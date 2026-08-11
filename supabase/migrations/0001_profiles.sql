-- Phase 1 of the real backend: user profiles, backed by Supabase Auth's
-- built-in auth.users table (which already handles email/password, Google,
-- and Apple sign-in once those providers are enabled in the Supabase
-- dashboard). This migration only adds the app-specific data Supabase's own
-- users table doesn't carry, keyed 1:1 to auth.users by id.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  username text not null default '',
  avatar_url text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'App-specific profile data for each Supabase Auth user (1:1 with auth.users).';

-- Row Level Security: every student can only ever read or write their own
-- profile row. Without this, any authenticated user could read or edit any
-- other student's profile through Supabase's REST/client API.
alter table public.profiles enable row level security;

create policy "Profiles are viewable by their own owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are editable by their own owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-creates a profile row the moment someone signs up, however they sign
-- up (email/password, Google, or Apple)—so the app never has to remember to
-- do this itself, and it can't be skipped by a client-side bug. Name and
-- avatar are pulled from whatever the provider actually supplied (OAuth
-- providers populate raw_user_meta_data; email/password sign-up populates it
-- via the options.data passed at signUp time), never fabricated.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1), ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keeps updated_at honest on every edit (e.g. the account settings page
-- saving a new name) instead of it silently going stale.
create or replace function public.handle_profile_updated()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_profile_updated();
