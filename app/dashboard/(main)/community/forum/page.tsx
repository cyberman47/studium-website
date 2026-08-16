"use client";

// The Community Feed—real posts (discussions + questions together) from
// public.community_posts, once supabase/migrations/0003_social.sql and
// 0004_community.sql are applied. No fake posts, ever: signed-out, empty,
// and not-yet-set-up states are all shown honestly instead.
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, HelpCircle, MessageCircle, Sparkles, ThumbsUp } from "lucide-react";
import {
  categoryLabels, CommunityCategory, CommunityPost, fetchFeed, postTypeLabels, toggleReaction, toggleSave
} from "@/lib/community";
import { formatRelativeTime } from "@/lib/notifications";

const allCategories = Object.keys(categoryLabels) as CommunityCategory[];

// useSearchParams() bails out of static rendering and needs a Suspense
// boundary around it, or the production build fails.
export default function CommunityFeedPage() {
  return <Suspense fallback={null}><CommunityFeedContent /></Suspense>;
}
function CommunityFeedContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as CommunityCategory | null;
  const [category, setCategory] = useState<CommunityCategory | "all">(categoryParam && allCategories.includes(categoryParam) ? categoryParam : "all");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const result = await fetchFeed({ category: category === "all" ? undefined : category });
    setSignedIn(result.signedIn);
    setPosts(result.posts);
    setError(result.error);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, [category]);

  async function handleReact(post: CommunityPost) {
    const { reacted } = await toggleReaction("post", post.id);
    setPosts(list => list.map(p => p.id === post.id ? { ...p, reactedByMe: reacted, reactionCount: p.reactionCount + (reacted ? 1 : -1) } : p));
  }

  async function handleSave(post: CommunityPost) {
    const { saved } = await toggleSave(post.id);
    setPosts(list => list.map(p => p.id === post.id ? { ...p, savedByMe: saved } : p));
  }

  return <div>
    <span className="eyebrow"><Sparkles size={13} />Studium Community</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Learn with other people.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Ask real questions, answer someone else's, and see what other medical students are working through—no generic social feed, just studying together.</p>

    <div className="mt-8 flex flex-wrap gap-2">
      <button type="button" onClick={() => setCategory("all")} className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${category === "all" ? "bg-ink text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200"}`}>All</button>
      {allCategories.map(c => <button key={c} type="button" onClick={() => setCategory(c)} className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${category === c ? "bg-ink text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200"}`}>{categoryLabels[c]}</button>)}
    </div>

    <div className="mt-6">
      {loading ? <p className="py-10 text-center text-sm text-slate-400">Loading real posts…</p>
        : signedIn === false ? <EmptyState title="Log in to see the Community feed" body="Posts, comments, and reactions are real and shared with other signed-in students—sign in to see them." />
        : error ? <EmptyState title="Community isn't set up yet" body="This runs on a database table that hasn't been created yet (supabase/migrations/0003_social.sql and 0004_community.sql need to be applied first)." />
        : posts.length === 0 ? <EmptyState title="No posts yet" body="Be the first to ask a question or start a discussion." cta />
        : <div className="space-y-4">
          {posts.map(post => <PostCard key={post.id} post={post} onReact={() => handleReact(post)} onSave={() => handleSave(post)} />)}
        </div>}
    </div>
  </div>;
}

function EmptyState({ title, body, cta }: { title: string; body: string; cta?: boolean }) {
  return <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-14 text-center">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white dark:bg-[#0d1917] text-slate-400 shadow-soft"><MessageCircle size={20} /></span>
    <p className="mt-1 text-sm font-bold text-heading">{title}</p>
    <p className="max-w-sm text-xs leading-relaxed text-slate-500">{body}</p>
    {cta && <Link href="/dashboard/community/forum/ask" className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Ask the Community →</Link>}
  </div>;
}

function PostCard({ post, onReact, onSave }: { post: CommunityPost; onReact: () => void; onSave: () => void }) {
  return <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift sm:p-6">
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-2.5 py-1 text-[10px] font-extrabold text-teal-700">{categoryLabels[post.category]}</span>
      {post.postType === "question" && <span className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 px-2.5 py-1 text-[10px] font-extrabold text-amber-700"><HelpCircle size={11} />{postTypeLabels.question}</span>}
      {post.acceptedCommentId && <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">✓ Answered</span>}
    </div>
    <Link href={`/dashboard/community/forum/${post.id}`} className="mt-3 block cursor-pointer">
      <p className="text-base font-extrabold text-heading hover:text-teal-700">{post.title}</p>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">{post.body}</p>
    </Link>
    <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-slate-400">
      <span>{post.authorName} · {formatRelativeTime(post.createdAt)}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onReact} className={`flex cursor-pointer items-center gap-1 transition ${post.reactedByMe ? "text-teal-600" : "hover:text-heading"}`}><ThumbsUp size={13} fill={post.reactedByMe ? "currentColor" : "none"} />{post.reactionCount}</button>
        <Link href={`/dashboard/community/forum/${post.id}`} className="flex cursor-pointer items-center gap-1 hover:text-heading"><MessageCircle size={13} />{post.commentCount}</Link>
        <button type="button" onClick={onSave} className={`cursor-pointer transition ${post.savedByMe ? "text-teal-600" : "hover:text-heading"}`}><Bookmark size={13} fill={post.savedByMe ? "currentColor" : "none"} /></button>
      </div>
    </div>
  </div>;
}
