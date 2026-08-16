"use client";

// The real, Supabase-backed identity fields the Community "My Profile" page
// needs beyond what lib/onboarding.ts's local User already covers (name):
// username, avatar_url (both already real columns on public.profiles, just
// never read/written from the client before now) and bio (new, see
// supabase/migrations/0009_community_profile.sql). Kept as its own small
// module rather than folded into lib/community.ts, since this is about the
// signed-in student's own row, not cross-student community data.

import { createClient } from "./supabase/client";

export type MyProfileRow = { id: string; username: string; avatarUrl: string | null; bio: string | null };

export async function fetchMyProfileRow(): Promise<MyProfileRow | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.from("profiles").select("id, username, avatar_url, bio").eq("id", user.id).maybeSingle();
  if (error || !data) return null;
  return { id: data.id, username: data.username ?? "", avatarUrl: data.avatar_url ?? null, bio: data.bio ?? null };
}

export async function updateMyBio(bio: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in to edit your profile." };
  const trimmed = bio.trim().slice(0, 280);
  const { error } = await supabase.from("profiles").update({ bio: trimmed }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
