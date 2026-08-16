-- Studium Study Groups: real, discoverable groups students can join, built
-- to reuse the Forum's existing post system rather than a second parallel
-- posts table—a group's "Discussions" tab is just community_posts filtered
-- by group_id. Depends on 0004_community.sql (community_posts,
-- community_category) and 0009_community_profile.sql (the wider category
-- enum used by the seed rows below).
--
-- NOT APPLIED. Written for review only, per the standing "no Supabase
-- changes without explicit per-turn permission" rule.

create table if not exists public.community_groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  category public.community_category, -- nullable: a group's focus tag, reuses the same taxonomy Forum posts use rather than a second one
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.community_groups is 'Real, discoverable study groups. created_by is null for Studium-seeded groups (no single student "owns" them).';

alter table public.community_groups enable row level security;

create policy "Groups are readable by any signed-in student"
  on public.community_groups for select
  using (auth.role() = 'authenticated');

create policy "Students can create a group as themselves"
  on public.community_groups for insert
  with check (auth.uid() = created_by);

create policy "Creator or moderator can update a group"
  on public.community_groups for update
  using (
    auth.uid() = created_by
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
  );

create policy "Creator or moderator can delete a group"
  on public.community_groups for delete
  using (
    auth.uid() = created_by
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
  );

-- ---- Membership ----
-- Real member counts fall directly out of counting these rows—never a
-- hand-set "248 members" figure. Every seeded group below starts at the
-- honest, real number: 0.
create table if not exists public.community_group_members (
  group_id uuid not null references public.community_groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member', -- 'member' | 'admin'
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create index if not exists community_group_members_user_idx on public.community_group_members (user_id);

alter table public.community_group_members enable row level security;

create policy "Membership is readable by any signed-in student"
  on public.community_group_members for select
  using (auth.role() = 'authenticated');

create policy "Students can join a group as themselves"
  on public.community_group_members for insert
  with check (auth.uid() = user_id);

create policy "Students can leave a group they joined"
  on public.community_group_members for delete
  using (auth.uid() = user_id);

-- ---- Group discussions (reuses community_posts, no new posts table) ----
-- Nullable and additive: every existing Forum post keeps group_id = null
-- and behaves exactly as before. A group's Discussions tab is simply
-- community_posts filtered to its group_id, still governed by
-- community_posts' own existing RLS (0004_community.sql)—groups here are a
-- public discovery/organization layer, not a private/invite-only space, so
-- no additional RLS is needed on community_posts itself.
alter table public.community_posts
  add column if not exists group_id uuid references public.community_groups (id) on delete cascade;

create index if not exists community_posts_group_idx on public.community_posts (group_id, created_at desc);

-- ---- Seed: real groups, honestly starting at 0 members ----
insert into public.community_groups (slug, name, description, category, created_by) values
  ('mcat-biology', 'MCAT Biology', 'Working through MCAT Biology & Biochemistry together.', 'mcat', null),
  ('pre-med-students', 'Pre-Med Students', 'General support and study group for pre-med students.', 'mcat', null),
  ('anatomy-study-group', 'Anatomy Study Group', 'Studying human anatomy together, region by region.', 'anatomy', null),
  ('nursing-students', 'Nursing Students', 'A study group for nursing students at any stage.', 'nursing', null)
on conflict (slug) do nothing;
