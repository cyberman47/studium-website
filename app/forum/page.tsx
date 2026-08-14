"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUp, MessageCircle, MessagesSquare, Plus, X } from "lucide-react";
import { inputClass } from "@/components/ui";
import { getUser } from "@/lib/onboarding";
import {
  createPost, forumCategoryLabels, FORUM_EVENT, ForumCategory, ForumPost, getCommentCount, getPosts, hasUpvoted, toggleUpvote
} from "@/lib/forum";

const categoryColors: Record<ForumCategory, string> = {
  general: "bg-slate-100 text-slate-600",
  "study-tips": "bg-teal-50 text-teal-700",
  feedback: "bg-violet-50 text-violet-600",
  bug: "bg-rose-50 text-rose-600"
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});
  const [categoryFilter, setCategoryFilter] = useState<ForumCategory | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [authorName, setAuthorName] = useState("You");

  function refresh() {
    const all = getPosts();
    setPosts(all);
    setCommentCounts(Object.fromEntries(all.map(p => [p.id, getCommentCount(p.id)])));
    setUpvoted(Object.fromEntries(all.map(p => [p.id, hasUpvoted(p.id)])));
  }

  useEffect(() => {
    setAuthorName(getUser()?.name || "You");
    refresh();
    window.addEventListener(FORUM_EVENT, refresh);
    return () => window.removeEventListener(FORUM_EVENT, refresh);
  }, []);

  function handleUpvote(id: string) {
    toggleUpvote(id);
    refresh();
  }

  const filteredPosts = categoryFilter ? posts.filter(p => p.category === categoryFilter) : posts;

  return <section className="relative py-10 sm:py-14">
    <span className="eyebrow"><MessagesSquare size={13} />Forum</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Studium Forum.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Share what's working, what's not, and what you'd change.</p>

    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
      <p className="text-xs leading-relaxed text-amber-800">Posts you create here are saved to this browser only—Studium doesn't have a shared server yet, so you won't see posts from other students until Community launches. Everything below is real and yours, not a mockup.</p>
    </div>

    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setCategoryFilter(null)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${categoryFilter === null ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>All Posts</button>
        {(Object.keys(forumCategoryLabels) as ForumCategory[]).map(cat => <button key={cat} type="button" onClick={() => setCategoryFilter(cat)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${categoryFilter === cat ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{forumCategoryLabels[cat]}</button>)}
      </div>
      <button type="button" onClick={() => setComposerOpen(true)} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Plus size={15} />New Post</button>
    </div>

    <div className="mt-6 space-y-3">
      {filteredPosts.length === 0 && <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-soft">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 text-teal-700"><MessagesSquare size={22} /></span>
        <p className="text-sm font-extrabold text-heading">{categoryFilter ? "No posts in this category yet." : "No posts yet."}</p>
        <p className="max-w-xs text-xs leading-relaxed text-slate-500">Be the first to start a discussion.</p>
      </div>}

      {filteredPosts.map(post => <Link key={post.id} href={`/forum/${post.id}`} className="flex cursor-pointer items-start gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lift sm:p-6">
        <button
          type="button"
          onClick={e => { e.preventDefault(); handleUpvote(post.id); }}
          className={`flex shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-3 py-2 transition ${upvoted[post.id] ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-400 hover:border-teal-200"}`}
        >
          <ArrowUp size={15} />
          <span className="text-xs font-extrabold">{upvoted[post.id] ? 1 : 0}</span>
        </button>
        <div className="min-w-0 flex-1">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${categoryColors[post.category]}`}>{forumCategoryLabels[post.category]}</span>
          <h2 className="mt-2 text-base font-extrabold leading-snug text-heading">{post.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{post.body}</p>
          <p className="mt-2.5 flex items-center gap-3 text-[11px] font-bold text-slate-400">
            <span>{post.authorName} · {formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} />{commentCounts[post.id] ?? 0}</span>
          </p>
        </div>
      </Link>)}
    </div>

    {composerOpen && <NewPostModal
      authorName={authorName}
      onClose={() => setComposerOpen(false)}
      onCreated={() => { setComposerOpen(false); refresh(); }}
    />}
  </section>;
}

function NewPostModal({ authorName, onClose, onCreated }: { authorName: string; onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<ForumCategory>("general");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = createPost({ title, body, category, authorName });
    if (!result.ok) { setError(result.error); return; }
    onCreated();
  }

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={onClose}>
    <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-lift sm:p-7">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-heading">New Post</h3>
        <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-heading" aria-label="Close"><X size={16} /></button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(forumCategoryLabels) as ForumCategory[]).map(cat => <button key={cat} type="button" onClick={() => setCategory(cat)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-extrabold transition ${category === cat ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{forumCategoryLabels[cat]}</button>)}
      </div>

      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className={`${inputClass} mt-4`} />
      <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} placeholder="What's on your mind?" className={`${inputClass} mt-3 resize-none`} />
      {error && <p className="mt-2 text-xs font-bold text-rose-600">{error}</p>}

      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold text-slate-500 hover:text-heading">Cancel</button>
        <button type="button" onClick={submit} className="cursor-pointer rounded-full bg-accent-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Post</button>
      </div>
    </div>
  </div>;
}
