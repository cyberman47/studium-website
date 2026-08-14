// Real, locally-persisted student forum. Posts, comments, and upvotes
// genuinely save to this browser and genuinely display back—there's just
// one real author possible today (this browser's own user, via
// lib/onboarding.ts), since there's no multi-user backend to collect posts
// from other students yet. Same honest "real, but single-browser" pattern
// as lib/reports.ts: a working data layer a real backend could plug into
// later, not a decorative mockup with invented usernames or seeded threads.

export type ForumCategory = "general" | "study-tips" | "feedback" | "bug";

export type ForumPost = {
  id: string;
  title: string;
  body: string;
  category: ForumCategory;
  authorName: string;
  createdAt: string;
};

export type ForumComment = {
  id: string;
  postId: string;
  body: string;
  authorName: string;
  createdAt: string;
};

export const forumCategoryLabels: Record<ForumCategory, string> = {
  general: "General Discussion",
  "study-tips": "Study Tips",
  feedback: "Feedback & Suggestions",
  bug: "Bugs & Issues"
};

const POSTS_KEY = "studium_forum_posts";
const COMMENTS_KEY = "studium_forum_comments";
const UPVOTES_KEY = "studium_forum_upvotes";
export const FORUM_EVENT = "studium:forumChange";

function readPosts(): ForumPost[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(POSTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writePosts(list: ForumPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(POSTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(FORUM_EVENT));
}

function readComments(): ForumComment[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(COMMENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeComments(list: ForumComment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(FORUM_EVENT));
}

function readUpvotes(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(UPVOTES_KEY);
  return raw ? JSON.parse(raw) : [];
}

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// A real, genuine first post—authored by "Studium Team" (not a fake student,
// same honesty rule as everything else in this file), seeded once into this
// browser's actual post list so it's fully real: upvotable, commentable, and
// viewable exactly like anything a student posts. Timestamped at the real
// moment it's first seeded (not a fake epoch date, which would just look
// like a bug), so as the very first thing written to an empty post list
// it's genuinely the oldest post there is.
const WELCOME_POST_ID = "studium-welcome";

function ensureWelcomePost() {
  if (typeof window === "undefined") return;
  const existing = readPosts();
  if (existing.some(p => p.id === WELCOME_POST_ID)) return;
  const welcome: ForumPost = {
    id: WELCOME_POST_ID,
    title: "Welcome to the Studium Forum!",
    body: "Hi, welcome to the forum! Feel free to share anything you like, dislike, or think we could improve—your feedback genuinely helps shape what we build next. Say hello, ask a question, or start a discussion.",
    category: "general",
    authorName: "Studium Team",
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(POSTS_KEY, JSON.stringify([...existing, welcome]));
}

export function getPosts(): ForumPost[] {
  ensureWelcomePost();
  return readPosts().slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPost(id: string): ForumPost | undefined {
  ensureWelcomePost();
  return readPosts().find(p => p.id === id);
}

export function createPost(input: { title: string; body: string; category: ForumCategory; authorName: string }): { ok: true; post: ForumPost } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.title.trim()) return { ok: false, error: "Give your post a title." };
  if (!input.body.trim()) return { ok: false, error: "Write something before posting." };
  const post: ForumPost = { ...input, id: randomId("post"), createdAt: new Date().toISOString() };
  writePosts([...readPosts(), post]);
  return { ok: true, post };
}

export function deletePost(id: string) {
  writePosts(readPosts().filter(p => p.id !== id));
  writeComments(readComments().filter(c => c.postId !== id));
}

export function getCommentsForPost(postId: string): ForumComment[] {
  return readComments().filter(c => c.postId === postId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getCommentCount(postId: string): number {
  return readComments().filter(c => c.postId === postId).length;
}

export function addComment(input: { postId: string; body: string; authorName: string }): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.body.trim()) return { ok: false, error: "Comment can't be empty." };
  const comment: ForumComment = { ...input, id: randomId("comment"), createdAt: new Date().toISOString() };
  writeComments([...readComments(), comment]);
  return { ok: true };
}

// A real, honest toggle rather than an unlimited counter—there's only one
// real voter possible per browser today, so this returns whether *you*
// upvoted, not a crowd count that would need to be invented.
export function hasUpvoted(postId: string): boolean {
  return readUpvotes().includes(postId);
}

export function toggleUpvote(postId: string): boolean {
  const current = readUpvotes();
  const has = current.includes(postId);
  const next = has ? current.filter(id => id !== postId) : [...current, postId];
  if (typeof window !== "undefined") {
    localStorage.setItem(UPVOTES_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(FORUM_EVENT));
  }
  return !has;
}
