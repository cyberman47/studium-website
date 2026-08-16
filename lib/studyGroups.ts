"use client";

// Studium Study Groups: real, discoverable groups (public.community_groups,
// supabase/migrations/0011_study_groups.sql), real membership (never a
// fabricated "248 members"—every count is a live count of
// community_group_members rows), and real discussions by reusing the
// existing Forum post system (lib/community.ts's fetchFeed/createPost with
// a group_id) rather than a second, parallel posts table.

import { createClient } from "./supabase/client";
import { CommunityCategory } from "./community";

export type StudyGroup = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CommunityCategory | null;
  createdBy: string | null;
  createdAt: string;
  memberCount: number;
  isMember: boolean;
};

type GroupRow = { id: string; slug: string; name: string; description: string; category: CommunityCategory | null; created_by: string | null; created_at: string };

async function fetchMemberCounts(supabase: ReturnType<typeof createClient>, groupIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (groupIds.length === 0) return map;
  const { data } = await supabase.from("community_group_members").select("group_id").in("group_id", groupIds);
  for (const row of data ?? []) map.set(row.group_id, (map.get(row.group_id) ?? 0) + 1);
  return map;
}

function rowToGroup(row: GroupRow, memberCounts: Map<string, number>, myMemberships: Set<string>): StudyGroup {
  return {
    id: row.id, slug: row.slug, name: row.name, description: row.description, category: row.category,
    createdBy: row.created_by, createdAt: row.created_at,
    memberCount: memberCounts.get(row.id) ?? 0, isMember: myMemberships.has(row.id)
  };
}

export async function fetchGroups(): Promise<StudyGroup[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("community_groups").select("*").order("created_at", { ascending: true });
  if (error || !data) return [];
  const rows = data as GroupRow[];
  const ids = rows.map(r => r.id);

  const [memberCounts, myRows] = await Promise.all([
    fetchMemberCounts(supabase, ids),
    user ? supabase.from("community_group_members").select("group_id").eq("user_id", user.id) : Promise.resolve({ data: [] as { group_id: string }[] })
  ]);
  const myMemberships = new Set((myRows.data ?? []).map(r => r.group_id));

  return rows.map(r => rowToGroup(r, memberCounts, myMemberships));
}

export async function fetchGroup(idOrSlug: string): Promise<StudyGroup | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isUuid = /^[0-9a-f-]{36}$/i.test(idOrSlug);
  const { data, error } = await supabase.from("community_groups").select("*").eq(isUuid ? "id" : "slug", idOrSlug).maybeSingle();
  if (error || !data) return null;
  const row = data as GroupRow;

  const [memberCounts, myRows] = await Promise.all([
    fetchMemberCounts(supabase, [row.id]),
    user ? supabase.from("community_group_members").select("group_id").eq("user_id", user.id).eq("group_id", row.id) : Promise.resolve({ data: [] as { group_id: string }[] })
  ]);
  return rowToGroup(row, memberCounts, new Set((myRows.data ?? []).map(r => r.group_id)));
}

export async function joinGroup(groupId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in to join a group." };
  const { error } = await supabase.from("community_group_members").insert({ group_id: groupId, user_id: user.id });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function leaveGroup(groupId: string): Promise<{ ok: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  const { error } = await supabase.from("community_group_members").delete().eq("group_id", groupId).eq("user_id", user.id);
  return { ok: !error };
}

export type GroupMember = { userId: string; name: string; totalKp: number; role: string; joinedAt: string };

// Doubles as the group's real leaderboard (sorted by real total_kp)—no
// separate group-leaderboard table needed, same public.leaderboard view the
// real cross-student Leaderboard and Challenges already join against.
export async function fetchGroupMembers(groupId: string): Promise<GroupMember[]> {
  const supabase = createClient();
  const { data: memberRows } = await supabase.from("community_group_members").select("user_id, role, joined_at").eq("group_id", groupId);
  const rows = memberRows ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((r: { user_id: string }) => r.user_id);
  const { data: board } = await supabase.from("leaderboard").select("id, name, total_kp").in("id", ids);
  const boardMap = new Map((board ?? []).map((b: { id: string; name: string; total_kp: number }) => [b.id, b]));

  return rows
    .map((r: { user_id: string; role: string; joined_at: string }) => {
      const b = boardMap.get(r.user_id);
      return { userId: r.user_id, name: b?.name ?? "Student", totalKp: b?.total_kp ?? 0, role: r.role, joinedAt: r.joined_at };
    })
    .sort((a, b) => b.totalKp - a.totalKp);
}
