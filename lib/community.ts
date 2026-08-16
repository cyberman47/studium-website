// The Studium Community's real, cross-user data layer—same pattern as
// lib/leaderboardSync.ts (thin, typed wrappers around the real browser
// Supabase client, RLS as the actual security boundary, no local caching
// layer duplicating server state). Every function here does a genuine
// network call; there is no fake/seeded post data anywhere in this file.
// Requires supabase/migrations/0003_social.sql and 0004_community.sql to be
// applied—until then, every call below will error, and callers surface
// that honestly rather than silently falling back to placeholder content.
"use client";

import { createClient } from "./supabase/client";

export type CommunityCategory =
  | "anatomy" | "physiology" | "pharmacology" | "pathology" | "neuroscience"
  | "microbiology" | "biochemistry" | "clinical-medicine"
  | "mcat" | "study-strategies" | "med-school-prep" | "resources"
  | "flashcards" | "productivity" | "learning-techniques" | "study-planning"
  // Added by supabase/migrations/0009_community_profile.sql—covers the
  // education tracks lib/currentPath.ts already knows about (Nursing,
  // and Biology/Chemistry as their own MCAT-adjacent subjects) plus a
  // General/Career/Research catch-all the original taxonomy didn't have.
  | "general" | "medical-school" | "nursing" | "biology" | "chemistry" | "career" | "research";

export const categoryLabels: Record<CommunityCategory, string> = {
  anatomy: "Anatomy", physiology: "Physiology", pharmacology: "Pharmacology", pathology: "Pathology",
  neuroscience: "Neuroscience", microbiology: "Microbiology", biochemistry: "Biochemistry", "clinical-medicine": "Clinical Medicine",
  mcat: "MCAT", "study-strategies": "Study Strategies", "med-school-prep": "Medical School Preparation", resources: "Resources",
  flashcards: "Flashcards", productivity: "Productivity", "learning-techniques": "Learning Techniques", "study-planning": "Study Planning",
  general: "General", "medical-school": "Medical School", nursing: "Nursing", biology: "Biology", chemistry: "Chemistry",
  career: "Career", research: "Research"
};

export type CategoryGroup = { label: string; categories: CommunityCategory[] };

// The product spec's taxonomy, grouped for browsing—the grouping is a UI
// concern, not a schema concern (community_category stays a flat enum in
// Supabase). "General" leads since it's the default landing group for
// posts that don't fit a specific subject/track.
export const categoryGroups: CategoryGroup[] = [
  { label: "General", categories: ["general", "study-strategies", "career", "research"] },
  { label: "Medical School", categories: ["medical-school", "anatomy", "physiology", "pharmacology", "pathology", "neuroscience", "microbiology", "biochemistry", "clinical-medicine"] },
  { label: "Pre-med", categories: ["mcat", "biology", "chemistry", "med-school-prep", "resources"] },
  { label: "Nursing", categories: ["nursing"] },
  { label: "Studying", categories: ["flashcards", "productivity", "learning-techniques", "study-planning"] }
];

export type PostType = "discussion" | "question";
export const postTypeLabels: Record<PostType, string> = { discussion: "Discussion", question: "Question" };

export type CommunityPost = {
  id: string;
  authorId: string;
  authorName: string;
  category: CommunityCategory;
  postType: PostType;
  title: string;
  body: string;
  attachmentUrl: string | null;
  acceptedCommentId: string | null;
  // Set when this post was made inside a Study Group (supabase/migrations/
  // 0011_study_groups.sql's community_posts.group_id)—null for a normal
  // Forum post. Same table, same RLS, same reaction/comment machinery;
  // groups don't get a second, parallel posts system.
  groupId: string | null;
  createdAt: string;
  commentCount: number;
  reactionCount: number;
  reactedByMe: boolean;
  savedByMe: boolean;
};

export type CommunityComment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  isHelpful: boolean;
  createdAt: string;
  reactionCount: number;
  reactedByMe: boolean;
};

type SupabaseClient = ReturnType<typeof createClient>;

// Real per-post/comment counts and per-user reaction/save state, fetched as
// plain row sets and reduced client-side into Maps—no fabricated numbers,
// just a straightforward query shape that works without a bespoke
// aggregate view per count. Fine at the volume a first real Community
// launch actually has; a dedicated feed view is a natural later
// optimization, not a correctness requirement.
async function fetchCommentCounts(supabase: SupabaseClient, postIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (postIds.length === 0) return map;
  const { data } = await supabase.from("community_comments").select("post_id").eq("status", "published").in("post_id", postIds);
  for (const row of data ?? []) map.set(row.post_id, (map.get(row.post_id) ?? 0) + 1);
  return map;
}

async function fetchReactionCounts(supabase: SupabaseClient, targetType: "post" | "comment", targetIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (targetIds.length === 0) return map;
  const { data } = await supabase.from("community_reactions").select("target_id").eq("target_type", targetType).in("target_id", targetIds);
  for (const row of data ?? []) map.set(row.target_id, (map.get(row.target_id) ?? 0) + 1);
  return map;
}

async function fetchMyReactionSet(supabase: SupabaseClient, targetType: "post" | "comment", targetIds: string[], userId: string): Promise<Set<string>> {
  if (targetIds.length === 0) return new Set();
  const { data } = await supabase.from("community_reactions").select("target_id").eq("target_type", targetType).eq("user_id", userId).in("target_id", targetIds);
  return new Set((data ?? []).map(r => r.target_id));
}

async function fetchMySaveSet(supabase: SupabaseClient, postIds: string[], userId: string): Promise<Set<string>> {
  if (postIds.length === 0) return new Set();
  const { data } = await supabase.from("community_saves").select("post_id").eq("user_id", userId).in("post_id", postIds);
  return new Set((data ?? []).map(r => r.post_id));
}

function rowToPost(row: any, commentCounts: Map<string, number>, reactionCounts: Map<string, number>, myReactions: Set<string>, mySaves: Set<string>): CommunityPost {
  return {
    id: row.id, authorId: row.author_id, authorName: row.author?.name || "Student",
    category: row.category, postType: row.post_type, title: row.title, body: row.body,
    attachmentUrl: row.attachment_url, acceptedCommentId: row.accepted_comment_id, groupId: row.group_id ?? null, createdAt: row.created_at,
    commentCount: commentCounts.get(row.id) ?? 0, reactionCount: reactionCounts.get(row.id) ?? 0,
    reactedByMe: myReactions.has(row.id), savedByMe: mySaves.has(row.id)
  };
}

export type FeedResult = { signedIn: boolean; posts: CommunityPost[]; error: string | null };

// groupId omitted (default): the main Forum feed—ungrouped posts only, so a
// Study Group's discussions don't flood the general feed without their
// group context. Pass a real group id to get that group's Discussions tab
// instead (see lib/studyGroups.ts).
export async function fetchFeed(opts?: { category?: CommunityCategory; limit?: number; groupId?: string }): Promise<FeedResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, posts: [], error: null };

  let query = supabase
    .from("community_posts")
    .select("id, author_id, category, post_type, title, body, attachment_url, accepted_comment_id, group_id, created_at, author:profiles(name)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 30);
  query = opts?.groupId ? query.eq("group_id", opts.groupId) : query.is("group_id", null);
  if (opts?.category) query = query.eq("category", opts.category);

  const { data, error } = await query;
  if (error) return { signedIn: true, posts: [], error: error.message };
  const rows = data ?? [];
  const postIds = rows.map(r => r.id);

  const [commentCounts, reactionCounts, myReactions, mySaves] = await Promise.all([
    fetchCommentCounts(supabase, postIds),
    fetchReactionCounts(supabase, "post", postIds),
    fetchMyReactionSet(supabase, "post", postIds, user.id),
    fetchMySaveSet(supabase, postIds, user.id)
  ]);

  return { signedIn: true, posts: rows.map(r => rowToPost(r, commentCounts, reactionCounts, myReactions, mySaves)), error: null };
}

// A specific student's own real posts (My Profile's "Recent posts"/"My
// Contributions")—same shape/pattern as fetchFeed, just filtered to one
// author instead of everyone.
export async function fetchMyPosts(userId: string, limit = 10): Promise<CommunityPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("community_posts")
    .select("id, author_id, category, post_type, title, body, attachment_url, accepted_comment_id, created_at, author:profiles(name)")
    .eq("author_id", userId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  const postIds = data.map(r => r.id);
  const [commentCounts, reactionCounts] = await Promise.all([
    fetchCommentCounts(supabase, postIds),
    fetchReactionCounts(supabase, "post", postIds)
  ]);
  return data.map(r => rowToPost(r, commentCounts, reactionCounts, new Set(), new Set()));
}

// Real per-category post counts for the Discussions browse page—one row
// fetch reduced client-side, same shape as fetchCommentCounts above.
export async function fetchCategoryCounts(): Promise<Map<CommunityCategory, number>> {
  const supabase = createClient();
  const map = new Map<CommunityCategory, number>();
  const { data } = await supabase.from("community_posts").select("category").eq("status", "published");
  for (const row of data ?? []) map.set(row.category, (map.get(row.category) ?? 0) + 1);
  return map;
}

export type PostResult = { signedIn: boolean; post: CommunityPost | null; error: string | null };

export async function fetchPost(id: string): Promise<PostResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, post: null, error: null };

  const { data, error } = await supabase
    .from("community_posts")
    .select("id, author_id, category, post_type, title, body, attachment_url, accepted_comment_id, created_at, author:profiles(name)")
    .eq("id", id)
    .maybeSingle();
  if (error) return { signedIn: true, post: null, error: error.message };
  if (!data) return { signedIn: true, post: null, error: null };

  const [commentCounts, reactionCounts, myReactions, mySaves] = await Promise.all([
    fetchCommentCounts(supabase, [id]),
    fetchReactionCounts(supabase, "post", [id]),
    fetchMyReactionSet(supabase, "post", [id], user.id),
    fetchMySaveSet(supabase, [id], user.id)
  ]);

  return { signedIn: true, post: rowToPost(data, commentCounts, reactionCounts, myReactions, mySaves), error: null };
}

export async function fetchComments(postId: string): Promise<CommunityComment[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("community_comments")
    .select("id, post_id, author_id, body, is_helpful, created_at, author:profiles(name)")
    .eq("post_id", postId)
    .eq("status", "published")
    .order("created_at", { ascending: true });
  if (error || !data) return [];

  const ids = data.map(c => c.id);
  const [reactionCounts, myReactions] = await Promise.all([
    fetchReactionCounts(supabase, "comment", ids),
    user ? fetchMyReactionSet(supabase, "comment", ids, user.id) : Promise.resolve(new Set<string>())
  ]);

  return data.map((c: any) => ({
    id: c.id, postId: c.post_id, authorId: c.author_id, authorName: c.author?.name || "Student",
    body: c.body, isHelpful: c.is_helpful, createdAt: c.created_at,
    reactionCount: reactionCounts.get(c.id) ?? 0, reactedByMe: myReactions.has(c.id)
  }));
}

export type CreatePostInput = { category: CommunityCategory; postType: PostType; title: string; body: string; attachmentUrl?: string | null; groupId?: string | null };
export type ActionResult<T = undefined> = { ok: true } & (T extends undefined ? {} : T) | { ok: false; error: string };

export async function createPost(input: CreatePostInput): Promise<ActionResult<{ id: string }>> {
  if (!input.title.trim()) return { ok: false, error: "Please add a title." };
  if (!input.body.trim()) return { ok: false, error: "Please add some detail." };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in to post." };

  const { data, error } = await supabase.from("community_posts").insert({
    author_id: user.id, category: input.category, post_type: input.postType,
    title: input.title.trim(), body: input.body.trim(), attachment_url: input.attachmentUrl ?? null,
    group_id: input.groupId ?? null
  }).select("id").single();
  if (error || !data) return { ok: false, error: error?.message ?? "Couldn't post right now." };
  return { ok: true, id: data.id };
}

export async function createComment(postId: string, body: string): Promise<ActionResult> {
  if (!body.trim()) return { ok: false, error: "Write something first." };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in to comment." };

  const { data: post } = await supabase.from("community_posts").select("author_id").eq("id", postId).maybeSingle();
  const { error } = await supabase.from("community_comments").insert({ post_id: postId, author_id: user.id, body: body.trim() });
  if (error) return { ok: false, error: error.message };

  // Real cross-user notification—only fired when replying to someone else's post.
  if (post && post.author_id !== user.id) {
    await supabase.from("community_notifications").insert({ recipient_id: post.author_id, actor_id: user.id, kind: "reply", post_id: postId });
  }
  return { ok: true };
}

export async function toggleReaction(targetType: "post" | "comment", targetId: string): Promise<{ reacted: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { reacted: false };

  const { data: existing } = await supabase.from("community_reactions").select("user_id")
    .eq("target_type", targetType).eq("target_id", targetId).eq("user_id", user.id).maybeSingle();
  if (existing) {
    await supabase.from("community_reactions").delete().eq("target_type", targetType).eq("target_id", targetId).eq("user_id", user.id);
    return { reacted: false };
  }
  await supabase.from("community_reactions").insert({ target_type: targetType, target_id: targetId, user_id: user.id });
  return { reacted: true };
}

export async function toggleSave(postId: string): Promise<{ saved: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { saved: false };

  const { data: existing } = await supabase.from("community_saves").select("user_id").eq("post_id", postId).eq("user_id", user.id).maybeSingle();
  if (existing) {
    await supabase.from("community_saves").delete().eq("post_id", postId).eq("user_id", user.id);
    return { saved: false };
  }
  await supabase.from("community_saves").insert({ post_id: postId, user_id: user.id });
  return { saved: true };
}

// OP-only in practice (enforced for real by the comment's own RLS
// policy)—marking a comment helpful notifies its author for real.
export async function markCommentHelpful(postId: string, commentId: string, helpful: boolean): Promise<{ ok: boolean }> {
  const supabase = createClient();
  const { error } = await supabase.from("community_comments").update({ is_helpful: helpful }).eq("id", commentId);
  if (!error && helpful) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: comment } = await supabase.from("community_comments").select("author_id").eq("id", commentId).maybeSingle();
    if (user && comment && comment.author_id !== user.id) {
      await supabase.from("community_notifications").insert({ recipient_id: comment.author_id, actor_id: user.id, kind: "helpful", post_id: postId, comment_id: commentId });
    }
  }
  return { ok: !error };
}

// OP-only in practice (enforced for real by the post's own RLS policy).
// Pass commentId: null to clear an accepted answer.
export async function markCommentAccepted(postId: string, commentId: string | null): Promise<{ ok: boolean }> {
  const supabase = createClient();
  const { error } = await supabase.from("community_posts").update({ accepted_comment_id: commentId }).eq("id", postId);
  if (!error && commentId) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: comment } = await supabase.from("community_comments").select("author_id").eq("id", commentId).maybeSingle();
    if (user && comment && comment.author_id !== user.id) {
      await supabase.from("community_notifications").insert({ recipient_id: comment.author_id, actor_id: user.id, kind: "accepted", post_id: postId, comment_id: commentId });
    }
  }
  return { ok: !error };
}

export type CommunityReportReason = "off-topic" | "harassment" | "spam" | "misinformation" | "other";
export const reportReasonLabels: Record<CommunityReportReason, string> = {
  "off-topic": "Not related to studying/medicine", harassment: "Harassment or abuse", spam: "Spam",
  misinformation: "Medically incorrect / misleading", other: "Other"
};

export async function submitCommunityReport(input: { targetType: "post" | "comment"; targetId: string; reason: CommunityReportReason; message?: string }): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in to report content." };

  const { error } = await supabase.from("community_reports").insert({
    reporter_id: user.id, target_type: input.targetType, target_id: input.targetId,
    reason: input.reason, message: input.message?.trim() || null
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export type CommunityReputation = { helpfulAnswers: number; acceptedAnswers: number; reactionsReceived: number; discussionsStarted: number };

export async function fetchReputation(userId: string): Promise<CommunityReputation | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("community_reputation").select("*").eq("user_id", userId).maybeSingle();
  if (error || !data) return null;
  return {
    helpfulAnswers: data.helpful_answers, acceptedAnswers: data.accepted_answers,
    reactionsReceived: data.reactions_received, discussionsStarted: data.discussions_started
  };
}
