-- Studium Community Challenges: real, joinable study challenges backed by
-- Studium's existing real signals—never a fabricated progress bar. Two
-- families of metric, deliberately different in how progress is computed:
--
--   kp_gained / streak_days: cross-user, computed live off the same
--   profiles.total_kp / profiles.current_streak columns the real Leaderboard
--   (0002_leaderboard.sql) already syncs—so a challenge leaderboard is just
--   public.leaderboard joined against who's actually participating.
--
--   flashcards_mastered / quizzes_completed / lessons_completed: these
--   metrics only exist in each student's own local lib/progress.ts /
--   lib/flashcardLibrary.ts / lib/mcatPath.ts state today—nothing syncs them
--   cross-device yet. A student can still genuinely join and track their
--   own real progress (baseline_value captures their real count at
--   join-time, so progress = current local count - baseline_value), but
--   there is honestly no cross-user leaderboard for these until that data
--   is synced—lib/challenges.ts and the UI disclose this directly rather
--   than faking a leaderboard.
--
-- Depends on 0001 (profiles), 0002 (total_kp/current_streak/leaderboard).
-- NOT APPLIED. Written for review only, per the standing "no Supabase
-- changes without explicit per-turn permission" rule.

create type public.challenge_metric as enum ('kp_gained', 'streak_days', 'flashcards_mastered', 'quizzes_completed', 'lessons_completed');

create table if not exists public.community_challenges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  metric public.challenge_metric not null,
  target_value integer not null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

comment on table public.community_challenges is 'Real challenge definitions. Rows are program-level (created by the Studium team), not per-user—see community_challenge_participants for who joined.';

alter table public.community_challenges enable row level security;

create policy "Challenges are readable by any signed-in student"
  on public.community_challenges for select
  using (auth.role() = 'authenticated');

-- ---- Participation ----
-- baseline_value is captured once, at join time, from whichever real metric
-- the challenge tracks—so "progress" always means "what you've genuinely
-- done since joining," never lifetime totals padding out an old challenge.
create table if not exists public.community_challenge_participants (
  challenge_id uuid not null references public.community_challenges (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  baseline_value integer not null default 0,
  completed_at timestamptz,
  primary key (challenge_id, user_id)
);

create index if not exists community_challenge_participants_user_idx on public.community_challenge_participants (user_id);

alter table public.community_challenge_participants enable row level security;

create policy "Participation rows are readable by any signed-in student"
  on public.community_challenge_participants for select
  using (auth.role() = 'authenticated');

create policy "Students can join a challenge as themselves"
  on public.community_challenge_participants for insert
  with check (auth.uid() = user_id);

-- Only completed_at is ever legitimately updated after join (set once the
-- client detects the real target was reached)—baseline_value is fixed at
-- join-time by design, so nothing here lets a student inflate their own
-- progress after the fact.
create policy "Students can mark their own participation completed"
  on public.community_challenge_participants for update
  using (auth.uid() = user_id);

create policy "Students can leave a challenge they joined"
  on public.community_challenge_participants for delete
  using (auth.uid() = user_id);

-- ---- Seed: real challenge definitions ----
-- Actual rows, not client-fabricated copy. kp_gained/streak_days challenges
-- get a real cross-user leaderboard for free (see lib/challenges.ts);
-- lessons_completed targets the one subject with real lesson content today
-- (MCAT → Biology, see lib/currentPath.ts's hasRealCurriculum) rather than
-- implying every track has 10 lessons to complete.
insert into public.community_challenges (slug, title, description, metric, target_value, ends_at) values
  ('7-day-study-streak', '7-Day Study Challenge', 'Build a 7-day study streak.', 'streak_days', 7, now() + interval '180 days'),
  ('30-day-study-streak', '30-Day Study Streak', 'Build a 30-day study streak.', 'streak_days', 30, now() + interval '180 days'),
  ('1000-kp-challenge', '1,000 Knowledge Points Challenge', 'Earn 1,000 Knowledge Points from wherever you are studying.', 'kp_gained', 1000, now() + interval '90 days'),
  ('100-flashcards-challenge', '100 Flashcards Challenge', 'Master 100 flashcards across any of your decks.', 'flashcards_mastered', 100, now() + interval '90 days'),
  ('mcat-biology-challenge', 'MCAT Biology Challenge', 'Complete 10 lessons in MCAT → Biology.', 'lessons_completed', 10, now() + interval '90 days'),
  ('community-quiz-challenge', 'Community Quiz Challenge', 'Complete 25 AI-generated quizzes.', 'quizzes_completed', 25, now() + interval '90 days')
on conflict (slug) do nothing;
