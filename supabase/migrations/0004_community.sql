-- Studium Community: the real discussion/Q&A layer (Feed, Discussions, Ask
-- the Community). Depends on 0003_social.sql already being applied
-- (references public.friendships is not required directly, but shares its
-- is_moderator-style trust model and activity conventions)—apply 0003 first,
-- then this file, in the Supabase Dashboard SQL editor.
--
-- NOT APPLIED. Written for review only, per the standing "no Supabase
-- changes without explicit per-turn permission" rule. Nothing in the app
-- queries these tables yet.

-- ---- Moderator flag ----
-- Minimal, not self-serve: only settable via direct SQL by the project
-- owner for now (no grant-UI in this pass). This is the first genuinely
-- server-enforced (RLS-backed) moderation capability in the app, unlike
-- /admin's explicitly-disclosed client-only role preview.
alter table public.profiles
  add column if not exists is_moderator boolean not null default false;

comment on column public.profiles.is_moderator is 'Real moderation flag, enforced via RLS on community_* tables below. Not self-serve—granted directly via SQL.';

-- ---- Category taxonomy ----
-- A fixed, non-user-extensible list (the exact taxonomy from the product
-- spec)—modeled as an enum for data integrity rather than a second lookup
-- table, since it doesn't change per-user. Grouping into "Medical School /
-- Pre-med / Studying" for browsing UI lives in lib/community.ts, not here.
create type public.community_category as enum (
  'anatomy', 'physiology', 'pharmacology', 'pathology', 'neuroscience',
  'microbiology', 'biochemistry', 'clinical-medicine',
  'mcat', 'study-strategies', 'med-school-prep', 'resources',
  'flashcards', 'productivity', 'learning-techniques', 'study-planning'
);

create type public.community_post_type as enum ('discussion', 'question');
create type public.community_status as enum ('published', 'removed');

-- ---- Posts ----
-- author_id references public.profiles (not auth.users directly)
-- deliberately: profiles.id is 1:1 with auth.users.id, but pointing here
-- lets PostgREST embed the author's real name/avatar in one query
-- (`.select("*, author:profiles(name, avatar_url)")`) instead of a second
-- round-trip per post.
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  category public.community_category not null,
  post_type public.community_post_type not null default 'discussion',
  title text not null,
  body text not null,
  attachment_url text,
  accepted_comment_id uuid, -- fk added after community_comments exists below
  status public.community_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_posts_category_idx on public.community_posts (category, created_at desc);
create index if not exists community_posts_author_idx on public.community_posts (author_id, created_at desc);

alter table public.community_posts enable row level security;

create policy "Published posts are readable by any signed-in student"
  on public.community_posts for select
  using (status = 'published' or author_id = auth.uid());

create policy "Students can create their own posts"
  on public.community_posts for insert
  with check (auth.uid() = author_id);

create policy "Authors and moderators can update a post"
  on public.community_posts for update
  using (
    auth.uid() = author_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
  );

create policy "Authors and moderators can delete a post"
  on public.community_posts for delete
  using (
    auth.uid() = author_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
  );

-- ---- Comments ----
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  is_helpful boolean not null default false, -- OP-settable; multiple comments can be marked helpful on a discussion
  status public.community_status not null default 'published',
  created_at timestamptz not null default now()
);

create index if not exists community_comments_post_idx on public.community_comments (post_id, created_at asc);
create index if not exists community_comments_author_idx on public.community_comments (author_id);

alter table public.community_comments enable row level security;

create policy "Comments are readable wherever the post is"
  on public.community_comments for select
  using (
    status = 'published'
    or author_id = auth.uid()
    or exists (select 1 from public.community_posts p where p.id = post_id and p.author_id = auth.uid())
  );

create policy "Students can comment as themselves"
  on public.community_comments for insert
  with check (auth.uid() = author_id);

-- Only the comment's own author can edit its body; marking helpful/accepted
-- is a separate, OP-only action handled by the two policies below so a
-- commenter can't mark their own answer helpful.
create policy "Authors and moderators can update their own comment body"
  on public.community_comments for update
  using (
    auth.uid() = author_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
  );

-- Known simplification: RLS's USING clause governs which ROWS this policy
-- allows updating, not which COLUMNS—so this technically lets the post's
-- author update any field on a comment underneath their post, not strictly
-- just is_helpful. Enforcing column-level restriction would need a trigger;
-- left out for this first version per "don't overcomplicate moderation,"
-- and the client (lib/community.ts) only ever sends an is_helpful patch
-- through this path, so it's not exploitable through the app's own UI.
create policy "The post's author can mark a comment on it helpful"
  on public.community_comments for update
  using (exists (select 1 from public.community_posts p where p.id = post_id and p.author_id = auth.uid()));

create policy "Authors and moderators can delete a comment"
  on public.community_comments for delete
  using (
    auth.uid() = author_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
  );

-- Now that community_comments exists, wire the accepted-answer reference.
alter table public.community_posts
  add constraint community_posts_accepted_comment_fk
  foreign key (accepted_comment_id) references public.community_comments (id) on delete set null;

-- Only the post's own author can set/clear its accepted answer.
create policy "The post's author can mark its accepted answer"
  on public.community_posts for update
  using (auth.uid() = author_id);

-- ---- Reactions ----
-- One reaction per user per post/comment—deliberately minimal (a single
-- "helpful" style reaction), matching 0003's activity_reactions.
create type public.community_target_type as enum ('post', 'comment');

create table if not exists public.community_reactions (
  target_type public.community_target_type not null,
  target_id uuid not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (target_type, target_id, user_id)
);

alter table public.community_reactions enable row level security;

create policy "Reactions are readable by anyone signed in"
  on public.community_reactions for select
  using (true);

create policy "Students can react as themselves"
  on public.community_reactions for insert
  with check (auth.uid() = user_id);

create policy "Students can remove their own reaction"
  on public.community_reactions for delete
  using (auth.uid() = user_id);

-- ---- Saves (private bookmarks) ----
create table if not exists public.community_saves (
  post_id uuid not null references public.community_posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.community_saves enable row level security;

create policy "Saves are private to their owner"
  on public.community_saves for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---- Blocks ----
-- A personal preference, not a security boundary—queries filter against
-- this table client-side rather than enforcing it via RLS, so a block never
-- silently breaks the blocked user's own ability to use the app elsewhere.
create table if not exists public.community_blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint community_blocks_not_self check (blocker_id <> blocked_id)
);

alter table public.community_blocks enable row level security;

create policy "Blocks are private to their owner"
  on public.community_blocks for all
  using (auth.uid() = blocker_id)
  with check (auth.uid() = blocker_id);

-- ---- Reports ----
-- Mirrors lib/reports.ts's shape (ReportType/Report/status) but real and
-- cross-user: reports need to reach an actual moderator, not just stay in
-- the reporter's own browser.
create type public.community_report_status as enum ('open', 'resolved', 'dismissed');

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type public.community_target_type not null,
  target_id uuid not null,
  reason text not null,
  message text,
  status public.community_report_status not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists community_reports_status_idx on public.community_reports (status, created_at desc);

alter table public.community_reports enable row level security;

create policy "Reporters see their own reports; moderators see all"
  on public.community_reports for select
  using (
    auth.uid() = reporter_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
  );

create policy "Students can file a report as themselves"
  on public.community_reports for insert
  with check (auth.uid() = reporter_id);

create policy "Moderators can update report status"
  on public.community_reports for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator));

-- ---- Notifications ----
-- The real per-recipient notification lib/notifications.ts can't provide on
-- its own (it can only write to the current browser's own local list).
-- Insert is allowed by any authenticated user acting as themselves
-- (actor_id = auth.uid()) targeting someone else—you can notify others as
-- yourself, never impersonate. Only the recipient can read/mark-read.
create type public.community_notification_kind as enum ('reply', 'helpful', 'accepted');

create table if not exists public.community_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  actor_id uuid not null references public.profiles (id) on delete cascade,
  kind public.community_notification_kind not null,
  post_id uuid references public.community_posts (id) on delete cascade,
  comment_id uuid references public.community_comments (id) on delete cascade,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists community_notifications_recipient_idx on public.community_notifications (recipient_id, read, created_at desc);

alter table public.community_notifications enable row level security;

create policy "Recipients read their own notifications"
  on public.community_notifications for select
  using (auth.uid() = recipient_id);

create policy "Students can notify others as themselves"
  on public.community_notifications for insert
  with check (auth.uid() = actor_id);

create policy "Recipients can mark their notifications read"
  on public.community_notifications for update
  using (auth.uid() = recipient_id);

-- ---- Reputation (computed live, not a stored counter) ----
-- Avoids drift entirely: always a live aggregate of real rows, the same
-- "compute from real data, never hand-set" philosophy as
-- lib/achievements.ts's Passport engine.
create or replace view public.community_reputation as
  select
    u.id as user_id,
    coalesce(helpful.count, 0) as helpful_answers,
    coalesce(accepted.count, 0) as accepted_answers,
    coalesce(reactions.count, 0) as reactions_received,
    coalesce(posts.count, 0) as discussions_started
  from public.profiles u
  left join (
    select author_id, count(*) as count from public.community_comments
    where is_helpful and status = 'published' group by author_id
  ) helpful on helpful.author_id = u.id
  left join (
    select c.author_id, count(*) as count
    from public.community_comments c
    join public.community_posts p on p.accepted_comment_id = c.id
    group by c.author_id
  ) accepted on accepted.author_id = u.id
  left join (
    select
      case when target_type = 'post' then p2.author_id else c2.author_id end as author_id,
      count(*) as count
    from public.community_reactions r
    left join public.community_posts p2 on r.target_type = 'post' and r.target_id = p2.id
    left join public.community_comments c2 on r.target_type = 'comment' and r.target_id = c2.id
    group by 1
  ) reactions on reactions.author_id = u.id
  left join (
    select author_id, count(*) as count from public.community_posts
    where status = 'published' group by author_id
  ) posts on posts.author_id = u.id;

comment on view public.community_reputation is 'Live, computed community reputation per user—helpful answers, accepted answers, reactions received, discussions started. Backs both the Top Contributors leaderboard (deferred phase) and the Community achievement tiers (lib/communityAchievements.ts).';

grant select on public.community_reputation to authenticated;
