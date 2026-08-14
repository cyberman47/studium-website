-- Phase 5 of the real backend: the referral program. A referral is
-- inherently cross-device (a friend signs up on a device that was never
-- signed in as the referrer), so unlike most of this app's local-first
-- state, this has to live here rather than in localStorage.
--
-- Every profile gets a stable, unique referral_code. referred_by records
-- which code a new student signed up through—captured automatically from
-- the ?ref= link at signup (see app/signup/page.tsx) and written by the
-- handle_new_user trigger below, never typed in by hand. A referral only
-- becomes "eligible" once the referred student's own real
-- onboarding_complete flag (already tracked by 0001_profiles.sql) is
-- true—not the moment the row exists—so generating empty accounts doesn't
-- generate rewards. That rule lives in one place (my_referrals' WHERE
-- clause / claim_referral_reward's count), so it's the one thing to change
-- later if the eligibility bar moves (e.g. to "email verified").

alter table public.profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by uuid references public.profiles(id) on delete set null,
  add column if not exists pro_until timestamptz,
  add column if not exists referral_months_claimed integer not null default 0;

comment on column public.profiles.referral_code is 'This student''s own shareable code (studium.app/ref/<code>)—generated once on first use, stable for the account''s lifetime.';
comment on column public.profiles.referred_by is 'The referrer''s profile id, resolved automatically from the ?ref= code at signup by handle_new_user below. Never client-settable after the fact.';
comment on column public.profiles.pro_until is 'Studium Pro access granted via the referral program, active until this timestamp. Independent of any separately-chosen paid plan (lib/billing.ts)—the two are combined client-side into one "are they Pro right now" check.';
comment on column public.profiles.referral_months_claimed is 'How many free months this account has already been granted via referrals—claim_referral_reward only ever grants the difference between what''s earned and what''s already been claimed, so re-running it is always safe.';

-- Generates (or returns the existing) referral code for a signed-in
-- student. A real server-side generator, not client-side Math.random, so
-- codes can't collide or be guessed/forged into someone else's.
create or replace function public.ensure_referral_code(uid uuid)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  existing text;
  candidate text;
begin
  select referral_code into existing from public.profiles where id = uid;
  if existing is not null then
    return existing;
  end if;
  loop
    candidate := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    begin
      update public.profiles set referral_code = candidate where id = uid;
      return candidate;
    exception when unique_violation then
      -- an 8-char collision is astronomically unlikely; loop retries cleanly if it ever happens
    end;
  end loop;
end;
$$;

grant execute on function public.ensure_referral_code(uuid) to authenticated;

-- Resolves a referral code straight into the new profile row at signup
-- time, via the same raw_user_meta_data mechanism 0001 already uses for
-- name/username/avatar (passed through supabase.auth.signUp's
-- options.data). This is what makes the referral link "just work" with no
-- code the new student has to enter themselves.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  referrer_id uuid;
begin
  if new.raw_user_meta_data ->> 'ref_code' is not null then
    select id into referrer_id from public.profiles where referral_code = upper(new.raw_user_meta_data ->> 'ref_code') limit 1;
  end if;
  insert into public.profiles (id, name, username, avatar_url, referred_by)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1), ''),
    new.raw_user_meta_data ->> 'avatar_url',
    referrer_id
  );
  return new;
end;
$$;

-- Every referral relationship, with eligibility computed live from the
-- referred student's real onboarding_complete flag rather than a second
-- status column that could drift out of sync. Deliberately narrow (three
-- non-identifying columns, same pattern as 0002's leaderboard view)—no
-- name, email, or avatar of the referred friend is exposed, matching the
-- product requirement that referred friends stay anonymous ("Friend
-- joined", never a real name). Any signed-in student can select from this
-- view, but the app always filters by referrer_id = their own id—the same
-- "narrow view, client filters to itself" pattern the leaderboard view
-- already uses for cross-student reads.
create or replace view public.my_referrals as
  select
    referred.id,
    referred.referred_by as referrer_id,
    referred.onboarding_complete as eligible,
    referred.created_at as joined_at
  from public.profiles referred
  where referred.referred_by is not null;

comment on view public.my_referrals is 'Referral relationships (id/referrer_id/eligible/joined_at only, no name/email/avatar)—callers filter to referrer_id = their own id.';

grant select on public.my_referrals to authenticated;

-- The actual reward grant: counts this student's real eligible referrals,
-- works out how many 1-month blocks that's worth (every 5 = 1 month,
-- scaling automatically—10 referrals = 2 months, 15 = 3, etc.), and
-- extends pro_until by only the newly-earned months since the last claim.
-- Idempotent by design (calling it again with nothing new earned is a
-- harmless no-op), and the counting/granting rule lives here, server-side,
-- rather than as client-trusted state.
create or replace function public.claim_referral_reward(uid uuid)
returns table(pro_until timestamptz, months_earned integer, months_claimed integer)
language plpgsql
security definer set search_path = public
as $$
declare
  eligible_count integer;
  earned integer;
  already_claimed integer;
  new_months integer;
  current_pro_until timestamptz;
begin
  select count(*) into eligible_count from public.profiles where referred_by = uid and onboarding_complete = true;
  earned := eligible_count / 5;

  select referral_months_claimed, profiles.pro_until into already_claimed, current_pro_until
    from public.profiles where id = uid;

  new_months := earned - already_claimed;
  if new_months > 0 then
    update public.profiles
      set pro_until = greatest(coalesce(current_pro_until, now()), now()) + (new_months || ' months')::interval,
          referral_months_claimed = earned
      where id = uid
      returning profiles.pro_until into current_pro_until;
  end if;

  return query select current_pro_until, earned, earned;
end;
$$;

grant execute on function public.claim_referral_reward(uuid) to authenticated;
