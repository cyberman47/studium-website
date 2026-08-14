-- Phase 2 of the real backend: a genuine, multi-student leaderboard.
-- Adds the two numbers a leaderboard actually needs (total_kp,
-- current_streak) to the existing per-user profiles row, mirrored up from
-- each browser's real lib/progress.ts KP ledger (see
-- lib/leaderboardSync.ts)—localStorage stays the source of truth for a
-- signed-in user's own device; this is the shared, cross-user copy.

alter table public.profiles
  add column if not exists total_kp integer not null default 0,
  add column if not exists current_streak integer not null default 0;

comment on column public.profiles.total_kp is 'Mirrors this student''s real lib/progress.ts getTotalKP(), synced from the client whenever it changes.';
comment on column public.profiles.current_streak is 'Mirrors this student''s real lib/progress.ts getStreak(), synced from the client whenever it changes.';

-- A narrow, read-only view: every signed-in student can see every other
-- student's name/KP/streak (the minimum a leaderboard needs), but nothing
-- else about them—profiles' own strict "owner only" RLS above still
-- protects username, avatar, onboarding state, etc. This view runs with
-- the privileges of its owner (standard Postgres view behavior), so it
-- deliberately bypasses that per-row RLS only for these three columns.
create or replace view public.leaderboard as
  select id, name, total_kp, current_streak
  from public.profiles
  where name <> ''
  order by total_kp desc;

comment on view public.leaderboard is 'Real cross-student leaderboard data (name/KP/streak only)—readable by any signed-in student.';

grant select on public.leaderboard to authenticated;
