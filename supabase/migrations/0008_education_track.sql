-- Persists the "Currently Studying" track selection (lib/currentPath.ts's
-- CurrentPathId) to each student's real profile row, so it survives a
-- refresh, a re-login, and follows the student to a second device—not just
-- whatever's in this one browser's localStorage.
--
-- Defaults every existing row to 'mcat' (the app's one track with a fully
-- authored curriculum today, and the value most existing students are
-- already implicitly on)—so this migration can't silently change what
-- content anyone currently sees. The `not null default` also means this is
-- non-breaking for rows inserted by the public.handle_new_user() trigger
-- (0001_profiles.sql) without needing that function touched.

alter table public.profiles
  add column if not exists education_track text not null default 'mcat';

-- Keeps this column restricted to lib/currentPath.ts's real CurrentPathId
-- union—an invalid value here would silently break every downstream page
-- that switches on it. Dropped and recreated on every run so editing the
-- allowed list later (a new track) is just editing this migration's check,
-- not writing a fresh one.
alter table public.profiles drop constraint if exists profiles_education_track_check;
alter table public.profiles add constraint profiles_education_track_check
  check (education_track in ('medical-school', 'mcat', 'nursing', 'dentistry', 'pharmacy', 'biomedical-sciences', 'other'));

comment on column public.profiles.education_track is 'The student''s selected "Currently Studying" track (lib/currentPath.ts CurrentPathId). Drives Dashboard/Learning Paths/Progress/Studium AI content.';

-- No RLS change needed: education_track lives on public.profiles, which
-- 0001_profiles.sql already restricts to select/update by the row's own
-- owner (auth.uid() = id)—this column inherits that automatically.
