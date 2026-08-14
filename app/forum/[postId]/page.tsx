"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, MessagesSquare, Send } from "lucide-react";
import { inputClass } from "@/components/ui";
import { getUser } from "@/lib/onboarding";
import {
  addComment, forumCategoryLabels, FORUM_EVENT, ForumCategory, ForumComment, ForumPost, getCommentsForPost, getPost, hasUpvoted, toggleUpvote
} from "@/lib/forum";

const categoryColors: Record<ForumCategory, string> = {
  general: "bg-slate-100 text-slate-600",
  "study-tips": "bg-teal-50 text-teal-700",
  feedback: "bg-violet-50 text-violet-600",
  bug: "bg-rose-50 text-rose-600"
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function ForumPostPage({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<ForumPost | undefined | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [upvoted, setUpvoted] = useState(false);
  const [authorName, setAuthorName] = useState("You");
  const [commentBody, setCommentBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    const p = getPost(params.postId);
    setPost(p ?? undefined);
    if (p) {
      setComments(getCommentsForPost(p.id));
      setUpvoted(hasUpvoted(p.id));
    }
  }

  useEffect(() => {
    setAuthorName(getUser()?.name || "You");
    refresh();
    window.addEventListener(FORUM_EVENT, refresh);
    return () => window.removeEventListener(FORUM_EVENT, refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.postId]);

  function handleUpvote() {
    toggleUpvote(params.postId);
    refresh();
  }

  function submitComment() {
    const result = addComment({ postId: params.postId, body: commentBody, authorName });
    if (!result.ok) { setError(result.error); return; }
    setCommentBody("");
    setError(null);
    refresh();
  }

  if (post === null) return null; // pre-mount, avoids a hydration flash of "not found"

  if (!post) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Post not found—it may have been removed.</p>
      <Link href="/forum" className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700"><ArrowLeft size={14} />Back to Forum</Link>
    </section>;
  }

  return <section className="relative py-10 sm:py-14">
    <Link href="/forum" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Forum</Link>

    <div className="max-w-2xl">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${categoryColors[post.category]}`}>{forumCategoryLabels[post.category]}</span>
        <h1 className="display mt-3 text-2xl leading-tight sm:text-3xl">{post.title}</h1>
        <p className="mt-2 text-xs font-bold text-slate-400">{post.authorName} · {formatDate(post.createdAt)}</p>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{post.body}</p>

        <button
          type="button"
          onClick={handleUpvote}
          className={`mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-extrabold transition ${upvoted ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}
        ><ArrowUp size={13} />{upvoted ? "Upvoted" : "Upvote"}</button>
      </div>

      <div className="mt-6">
        <h2 className="flex items-center gap-1.5 text-base font-extrabold text-heading"><MessagesSquare size={16} className="text-slate-400" />{comments.length} Comment{comments.length === 1 ? "" : "s"}</h2>

        <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-soft">
          <textarea value={commentBody} onChange={e => setCommentBody(e.target.value)} rows={3} placeholder="Add a comment…" className={`${inputClass} resize-none`} />
          {error && <p className="mt-2 text-xs font-bold text-rose-600">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button type="button" onClick={submitComment} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-5 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-600"><Send size={13} />Comment</button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {comments.length === 0
            ? <p className="px-1 text-sm text-slate-500">No comments yet—be the first to reply.</p>
            : comments.map(c => <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
              <p className="text-xs font-bold text-slate-400">{c.authorName} · {formatDate(c.createdAt)}</p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-heading">{c.body}</p>
            </div>)}
        </div>
      </div>
    </div>
  </section>;
}
