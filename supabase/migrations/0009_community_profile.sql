-- Two small, additive pieces the new Community "My Profile" and "Forum"
-- work need on top of 0003_social.sql/0004_community.sql (apply this after
-- those, and after 0008): a real short-bio field on profiles, and a wider
-- community_category taxonomy that covers the tracks lib/currentPath.ts
-- already knows about (Nursing, Biology, Chemistry) plus a few categories
-- the product spec named that the original enum didn't have yet (General,
-- Medical School as its own broad category, Career, Research).
--
-- NOT APPLIED. Written for review only, per the standing "no Supabase
-- changes without explicit per-turn permission" rule.

-- ---- Short bio ----
-- Nullable/no default—an empty bio is a completely normal, honest state
-- ("hasn't written one yet"), not something to fill with a placeholder.
alter table public.profiles
  add column if not exists bio text;

comment on column public.profiles.bio is 'Short public bio shown on the student''s Community "My Profile" page. Null/empty until they write one.';

-- ---- Expanded category taxonomy ----
-- Postgres enums can only gain values, never lose or reorder them here—each
-- ADD VALUE is its own statement (not combined with anything that USES the
-- new value) so this is safe to run standalone in the SQL editor regardless
-- of Postgres version. Existing categories/posts are completely unaffected.
alter type public.community_category add value if not exists 'general';
alter type public.community_category add value if not exists 'medical-school';
alter type public.community_category add value if not exists 'nursing';
alter type public.community_category add value if not exists 'biology';
alter type public.community_category add value if not exists 'chemistry';
alter type public.community_category add value if not exists 'career';
alter type public.community_category add value if not exists 'research';
