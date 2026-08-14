-- Phase 2 design for the Studium Passport's social layer: friendships,
-- passport visibility, a real public-profile surface for friend search /
-- viewing a friend's Passport, weekly leaderboard tracking (no cron
-- dependency), and a lightweight friends-only activity feed.
--
-- NOT APPLIED. This file is written for review only, per the standing
-- "no Supabase changes without explicit per-turn permission" rule—nothing
-- in the app queries these tables/views yet. Applying it (and building the
-- Friends/Leaderboard-extension/Activity-feed UI against it) is a separate,
-- explicitly-approved follow-up phase.

-- ---- Passport visibility ----
-- Default 'private' (safe-by-default), matching the profiles table's
-- existing owner-only RLS posture until a student opts into being findable.
create type public.passport_visibility as enum ('public', 'friends', 'private');

alter table public.profiles
  add column if not exists passport_visibility public.passport_visibility not null default 'private';

comment on column public.profiles.passport_visibility is 'Who can view this student''s public Passport: public, friends, or private (default).';

-- ---- Friendships ----
-- One row per relationship, ordered (requester -> addressee) with status
-- tracked explicitly rather than deleted/recreated rows, so "declined" and
-- "removed" stay distinguishable in history if ever needed. A partial
-- unique index (rather than a table constraint) prevents duplicate pending
-- requests in either direction between the same two users.
create type public.friendship_status as enum ('pending', 'accepted', 'declined');

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users (id) on delete cascade,
  addressee_id uuid not null references auth.users (id) on delete cascade,
  status public.friendship_status not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint friendships_not_self check (requester_id <> addressee_id)
);

-- Exactly one relationship row (in either direction) between any two users.
create unique index if not exists friendships_unique_pair
  on public.friendships (least(requester_id, addressee_id), greatest(requester_id, addressee_id));

create index if not exists friendships_addressee_idx on public.friendships (addressee_id, status);
create index if not exists friendships_requester_idx on public.friendships (requester_id, status);

alter table public.friendships enable row level security;

-- Either party to a friendship can see the row (needed for "my requests",
-- "my friends", and to check mutual-friend status).
create policy "Friendships are viewable by either party"
  on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Only the requester can create a request, and only as themselves.
create policy "Users can send friend requests as themselves"
  on public.friendships for insert
  with check (auth.uid() = requester_id);

-- Either party can update status: the addressee accepts/declines; either
-- party can later set status back to a "removed" state (modeled as a
-- delete, see below, rather than a third status, so an accepted friendship
-- that's removed doesn't linger as a confusing row).
create policy "Addressee can respond to a pending request"
  on public.friendships for update
  using (auth.uid() = addressee_id and status = 'pending')
  with check (status in ('accepted', 'declined'));

-- Removing a friend (or cancelling your own outgoing request) is a delete,
-- available to either party.
create policy "Either party can remove a friendship or cancel a request"
  on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- ---- Public profile surface ----
-- The real backend friend search / "view a friend's public Passport" needs:
-- a narrow, intentional view (not a raw profiles select) exposing only
-- educational-identity fields, gated by passport_visibility and, for
-- 'friends'-only profiles, by an actual accepted friendship. Runs with the
-- view owner's privileges (bypassing profiles' owner-only RLS
-- deliberately, same pattern as the existing public.leaderboard view), but
-- the where-clause below is the real gate—nobody sees a 'private' profile
-- or a 'friends'-only profile without a real accepted friendship row.
create or replace view public.public_profiles as
  select
    p.id, p.name, p.username, p.avatar_url,
    p.total_kp, p.current_streak, p.passport_visibility
  from public.profiles p
  where p.name <> ''
    and (
      p.passport_visibility = 'public'
      or (
        p.passport_visibility = 'friends'
        and exists (
          select 1 from public.friendships f
          where f.status = 'accepted'
            and (
              (f.requester_id = p.id and f.addressee_id = auth.uid())
              or (f.addressee_id = p.id and f.requester_id = auth.uid())
            )
        )
      )
      or p.id = auth.uid() -- you can always see your own row through this view
    );

comment on view public.public_profiles is 'Real cross-student profile surface for friend search and viewing a friend''s Passport—gated by passport_visibility + accepted friendships, not a raw profiles select.';

grant select on public.public_profiles to authenticated;

-- ---- Weekly leaderboard (no cron dependency) ----
-- Lazily reset, mirroring the app's existing local-first/reconcile-at-the-
-- edges pattern (lib/leaderboardSync.ts): each sync compares the stored
-- week_start to the current ISO week; if it's stale, the client resets
-- kp_at_week_start to the current total_kp and bumps week_start forward
-- before pushing this sync's numbers—no scheduled job required. Weekly KP
-- for ranking is simply total_kp - kp_at_week_start.
alter table public.profiles
  add column if not exists week_start date not null default date_trunc('week', now())::date,
  add column if not exists kp_at_week_start integer not null default 0;

comment on column public.profiles.week_start is 'Start (Monday) of the ISO week kp_at_week_start was captured for. Reset lazily by the client on the first sync of a new week.';
comment on column public.profiles.kp_at_week_start is 'total_kp snapshot at week_start—this week''s KP earned is total_kp - kp_at_week_start.';

create or replace view public.weekly_leaderboard as
  select id, name, total_kp, (total_kp - kp_at_week_start) as weekly_kp, week_start
  from public.profiles
  where name <> '' and week_start = date_trunc('week', now())::date
  order by weekly_kp desc;

comment on view public.weekly_leaderboard is 'Real weekly KP ranking (this week only)—rows outside the current week naturally drop off once their own next sync resets them.';

grant select on public.weekly_leaderboard to authenticated;

-- ---- Activity feed ----
-- One real row per notable event (achievement unlocked, subject mastered,
-- streak milestone, etc.)—written by the client at the moment it detects
-- the event locally (same moment lib/achievements.ts stamps unlockedAt),
-- not backfilled or inferred later. Visible only to accepted friends,
-- matching "keep the social layer focused on learning progress, not a
-- generic feed."
create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null, -- e.g. 'achievement_unlocked', 'subject_mastered', 'streak_milestone'
  title text not null, -- real, human-readable summary, e.g. "Mastered Cell Biology"
  icon text, -- optional icon key, mirrors lib/achievements.ts's PassportAchievementDef.icon
  created_at timestamptz not null default now()
);

create index if not exists activity_events_user_idx on public.activity_events (user_id, created_at desc);

alter table public.activity_events enable row level security;

create policy "Users can post their own activity"
  on public.activity_events for insert
  with check (auth.uid() = user_id);

create policy "Activity is visible to the poster and their accepted friends"
  on public.activity_events for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and (
          (f.requester_id = user_id and f.addressee_id = auth.uid())
          or (f.addressee_id = user_id and f.requester_id = auth.uid())
        )
    )
  );

-- ---- Reactions ----
-- Deliberately minimal—one reaction per user per event, no reaction-type
-- enum yet (a single "acknowledge" style reaction), matching "don't turn
-- Studium into a generic social platform."
create table if not exists public.activity_reactions (
  event_id uuid not null references public.activity_events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

alter table public.activity_reactions enable row level security;

create policy "Users can react as themselves"
  on public.activity_reactions for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own reaction"
  on public.activity_reactions for delete
  using (auth.uid() = user_id);

create policy "Reactions are visible to anyone who can see the event"
  on public.activity_reactions for select
  using (
    exists (
      select 1 from public.activity_events e
      where e.id = event_id
        and (
          e.user_id = auth.uid()
          or exists (
            select 1 from public.friendships f
            where f.status = 'accepted'
              and (
                (f.requester_id = e.user_id and f.addressee_id = auth.uid())
                or (f.addressee_id = e.user_id and f.requester_id = auth.uid())
              )
          )
        )
    )
  );
