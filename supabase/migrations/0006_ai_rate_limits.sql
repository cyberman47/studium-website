-- Real rate limiting for the three Anthropic-backed API routes
-- (app/api/tutor, app/api/study-plan, app/api/generate). Those routes have
-- no auth/session gate of their own -- reachable by anyone who can reach
-- the server -- so this is the actual abuse guard the code comments in
-- those files have been pointing at ("mitigate via request validation
-- plus a rate limit") since they were first written.
--
-- Fixed-window counter, one row per (identifier, window_start). identifier
-- is "user:<uuid>" for a signed-in Supabase session or "ip:<address>" for
-- an anonymous caller (lib/aiRateLimit.ts picks which). The increment and
-- the limit check happen atomically inside a single SECURITY DEFINER
-- function so two concurrent requests can't both slip through on a stale
-- read -- a plain "SELECT count, then UPDATE from the client" would race.

create table if not exists public.ai_rate_limits (
  identifier text not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  primary key (identifier, window_start)
);

-- Locked down from every direct client role -- no policies means no direct
-- table access at all, even for an authenticated user's own rows. The only
-- way in is the RPC below, which runs as its owner (SECURITY DEFINER) and
-- is reachable via the anon/authenticated grants on the function itself.
-- This is deliberate: a rate-limit table a client could read or write
-- directly would let anyone see or reset their own counter.
alter table public.ai_rate_limits enable row level security;

create or replace function public.check_and_increment_rate_limit(
  p_identifier text,
  p_window_minutes integer,
  p_max_requests integer
) returns table(allowed boolean, current_count integer, retry_after_seconds integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_start timestamptz;
  v_count integer;
begin
  -- Opportunistic cleanup instead of a cron job -- cheap at this table's
  -- real size, and every call already pays a write, so a stray extra
  -- delete costs nothing worth scheduling infra around.
  delete from public.ai_rate_limits where window_start < now() - interval '2 hours';

  -- Buckets the current moment into the start of its p_window_minutes-wide
  -- window, e.g. window_minutes=15 at 10:07 -> 10:00; at 10:22 -> 10:15.
  v_window_start := date_trunc('hour', now())
    + (floor(extract(minute from now()) / p_window_minutes) * p_window_minutes) * interval '1 minute';

  insert into public.ai_rate_limits (identifier, window_start, request_count)
  values (p_identifier, v_window_start, 1)
  on conflict (identifier, window_start)
    do update set request_count = ai_rate_limits.request_count + 1
  returning request_count into v_count;

  return query select
    (v_count <= p_max_requests) as allowed,
    v_count as current_count,
    case when v_count > p_max_requests
      then greatest(0, extract(epoch from (v_window_start + (p_window_minutes || ' minutes')::interval - now()))::integer)
      else 0
    end as retry_after_seconds;
end;
$$;

-- Both roles need this: an anonymous visitor trying the AI Tutor before
-- signing up authenticates to Supabase as "anon", not "authenticated".
grant execute on function public.check_and_increment_rate_limit(text, integer, integer) to anon, authenticated;
