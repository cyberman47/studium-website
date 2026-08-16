-- Phase 7 of the real backend: turns the raw leaderboard into something
-- that scales past a handful of students, plus real 1v1 "Studium Battles".
--
-- ---- Why this migration exists ----
-- The original leaderboard (0002) only ever fetched the real top N plus
-- your own row, so it already never showed a literal "#34,835"—but as the
-- student base grows, a bare ordinal rank is still a bad experience for
-- almost everyone (only the top few get a number worth seeing). This adds
-- a single-row RPC that computes your real rank, the real total student
-- count, and your real percentile—cheap, and it never leaks any other
-- student's row to the client (unlike computing this by fetching everyone).
-- The app buckets that percentile into named tiers (Diamond/Platinum/...)
-- entirely client-side—no fabricated tier column to keep in sync.
--
-- ---- Studium Battles ----
-- Direct challenge, not open matchmaking: a student picks a specific real
-- opponent straight off the leaderboard and challenges them—there's no
-- queue, no random pairing, no separate "Battles" section to visit first.
-- A battle runs 24 hours from the moment it's created; whoever gains more
-- real KP over that window wins. Consistent with this project's existing
-- "no cron dependency" pattern (see 0003's weekly_leaderboard comment)—a
-- battle is settled lazily, by whichever client happens to read it after
-- ends_at has passed, not a server job.

-- ---- Real rank/percentile (no new columns—computed live from profiles) ----

create or replace function public.get_my_leaderboard_standing()
returns table(rank bigint, total_students bigint, percentile numeric)
language sql
security definer
set search_path = public
stable
as $$
  with ranked as (
    select
      id,
      row_number() over (order by total_kp desc, id) as rn,
      count(*) over () as total
    from public.profiles
    where name <> ''
  )
  select
    rn,
    total,
    -- Percentile-rank convention: rank 1 of N -> 100 (better than everyone
    -- else), rank N of N -> 0. The app displays this as "top (100-P)%".
    -- greatest(total-1,1) avoids a divide-by-zero when you're the only
    -- real student in the table yet.
    round(100.0 * (total - rn) / greatest(total - 1, 1), 1)
  from ranked
  where id = auth.uid();
$$;

comment on function public.get_my_leaderboard_standing() is 'Real rank/total-students/percentile for the calling student only—computed live, no other student''s row is ever returned.';

grant execute on function public.get_my_leaderboard_standing() to authenticated;

-- ---- Studium Battles ----

create table if not exists public.battles (
  id uuid primary key default gen_random_uuid(),
  player_a uuid not null references public.profiles (id) on delete cascade,
  player_b uuid not null references public.profiles (id) on delete cascade,
  kp_a_start integer not null,
  kp_b_start integer not null,
  started_at timestamptz not null default now(),
  ends_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'completed')),
  winner_id uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

comment on table public.battles is 'A real 1v1 KP race between two students, started by a direct challenge from the leaderboard—whoever gains more total_kp between started_at and ends_at wins. Rows are only ever written by the SECURITY DEFINER functions below, never directly by a client, so a player can''t fabricate a battle or a result.';

alter table public.battles enable row level security;

create policy "see only your own battles"
  on public.battles for select
  using (auth.uid() in (player_a, player_b));

-- No insert/update/delete policy for battles: every write happens through
-- challenge_to_battle()/settle_battle() below, which run as their owner
-- and so bypass RLS deliberately—the same pattern this project already
-- uses for public.leaderboard and public.public_profiles.

-- Real-time-ish progress for whichever battle(s) the caller is in—KP
-- gained is computed live against each player's current total_kp, so it's
-- never stale between polls.
create or replace view public.my_battle_progress as
  select
    b.id, b.status, b.started_at, b.ends_at, b.winner_id,
    b.player_a, pa.name as player_a_name, (pa.total_kp - b.kp_a_start) as player_a_kp_gained,
    b.player_b, pb.name as player_b_name, (pb.total_kp - b.kp_b_start) as player_b_kp_gained
  from public.battles b
  join public.profiles pa on pa.id = b.player_a
  join public.profiles pb on pb.id = b.player_b
  where auth.uid() in (b.player_a, b.player_b);

comment on view public.my_battle_progress is 'Live KP-gained progress for the calling student''s own battles only (auth.uid() filter), joined against each player''s real current total_kp.';

grant select on public.my_battle_progress to authenticated;

-- Challenging is idempotent per opponent: already have an active battle
-- against this exact person? Return that same one instead of starting a
-- duplicate. Otherwise create a fresh 24-hour battle, snapshotting both
-- players' real current total_kp as the starting line.
create or replace function public.challenge_to_battle(opponent_id uuid)
returns table(battle_id uuid, ends_at timestamptz, already_active boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  my_kp integer;
  opp_kp integer;
  existing record;
  new_battle_id uuid;
  battle_ends timestamptz;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;
  if opponent_id = me then
    raise exception 'cannot challenge yourself';
  end if;
  if not exists (select 1 from public.profiles where id = opponent_id) then
    raise exception 'opponent not found';
  end if;

  select b.id, b.ends_at into existing
  from public.battles b
  where b.status = 'active'
    and ((b.player_a = me and b.player_b = opponent_id) or (b.player_a = opponent_id and b.player_b = me))
  limit 1;

  if existing.id is not null then
    return query select existing.id, existing.ends_at, true;
    return;
  end if;

  select total_kp into my_kp from public.profiles where id = me;
  select total_kp into opp_kp from public.profiles where id = opponent_id;
  battle_ends := now() + interval '24 hours';

  insert into public.battles (player_a, player_b, kp_a_start, kp_b_start, ends_at)
  values (me, opponent_id, my_kp, opp_kp, battle_ends)
  returning id into new_battle_id;

  return query select new_battle_id, battle_ends, false;
end;
$$;

comment on function public.challenge_to_battle(uuid) is 'Real direct challenge: starts (or returns an already-active) 24-hour KP race between the caller and a specific chosen opponent—no queue, no random matchmaking.';

grant execute on function public.challenge_to_battle(uuid) to authenticated;

-- Lazy settlement, matching this project's no-cron-dependency pattern:
-- called by the client whenever it reads a battle whose ends_at has
-- passed. Ties are a real, honest possible outcome (winner_id stays null).
create or replace function public.settle_battle(target_battle_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  b record;
  kp_a integer;
  kp_b integer;
begin
  select * into b from public.battles
  where id = target_battle_id and status = 'active' and ends_at <= now();
  if not found then
    return;
  end if;

  select total_kp into kp_a from public.profiles where id = b.player_a;
  select total_kp into kp_b from public.profiles where id = b.player_b;

  update public.battles
  set status = 'completed',
      winner_id = case
        when (kp_a - b.kp_a_start) > (kp_b - b.kp_b_start) then b.player_a
        when (kp_b - b.kp_b_start) > (kp_a - b.kp_a_start) then b.player_b
        else null
      end
  where id = target_battle_id;
end;
$$;

comment on function public.settle_battle(uuid) is 'Finalizes a battle whose ends_at has passed—called lazily by whichever client reads it first, not a cron job. No-ops if the battle is already settled or not yet over.';

grant execute on function public.settle_battle(uuid) to authenticated;
