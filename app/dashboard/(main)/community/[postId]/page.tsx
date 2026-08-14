"use client";

// A single Community thread: the post, real comments, react/save, and (OP
// only, enforced for real by RLS—see supabase/migrations/0004_community.sql)
// marking an answer Helpful or Accepted. Reporting reuses the same reason
// taxonomy as lib/reports.ts's existing admin-inbox pattern, but writes to
// the real cross-user community_reports table instead of a local-only one.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Bookmark, Check, ChevronLeft, Flag, HelpCircle, MessageCircle, ThumbsUp } from "lucide-react";
import {
  categoryLabels, CommunityComment, CommunityPost, CommunityReportReason, createComment, fetchComments, fetchPost,
  markCommentAccepted, markCommentHelpful, postTypeLabels, reportReasonLabels, submitCommunityReport, toggleReaction, toggleSave
} from "@/lib/community";
import { formatRelativeTime } from "@/lib/notifications";
import { createClient } from "@/lib/supabase/client";

export default function CommunityThreadPage() {
  const params = useParams<{ postId: string }>();
  const postId = params.postId;

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<{ type: "post" | "comment"; id: string } | null>(null);

  async function refresh() {
    setLoading(true);
    const [postResult, commentList] = await Promise.all([fetchPost(postId), fetchComments(postId)]);
    setPost(postResult.post);
    setSignedIn(postResult.signedIn);
    setError(postResult.error);
    setComments(commentList);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    createClient().auth.getUser().then(({ data }) => setMyUserId(data.user?.id ?? null));
  }, [postId]);

  const isOP = !!post && !!myUserId && post.authorId === myUserId;

  async function handleReactPost() {
    if (!post) return;
    const { reacted } = await toggleReaction("post", post.id);
    setPost({ ...post, reactedByMe: reacted, reactionCount: post.reactionCount + (reacted ? 1 : -1) });
  }

  async function handleSavePost() {
    if (!post) return;
    const { saved } = await toggleSave(post.id);
    setPost({ ...post, savedByMe: saved });
  }

  async function handleReactComment(comment: CommunityComment) {
    const { reacted } = await toggleReaction("comment", comment.id);
    setComments(list => list.map(c => c.id === comment.id ? { ...c, reactedByMe: reacted, reactionCount: c.reactionCount + (reacted ? 1 : -1) } : c));
  }

  async function handleSubmitComment() {
    if (!draft.trim()) return;
    setPosting(true);
    setPostError(null);
    const result = await createComment(postId, draft);
    setPosting(false);
    if (!result.ok) { setPostError(result.error); return; }
    setDraft("");
    refresh();
  }

  async function handleMarkHelpful(comment: CommunityComment) {
    await markCommentHelpful(postId, comment.id, !comment.isHelpful);
    refresh();
  }

  async function handleMarkAccepted(comment: CommunityComment) {
    if (!post) return;
    await markCommentAccepted(postId, post.acceptedCommentId === comment.id ? null : comment.id);
    refresh();
  }

  if (loading) return <p className="py-10 text-center text-sm text-slate-400">Loading…</p>;
  if (signedIn === false) return <EmptyBlock title="Log in to view this thread" body="Community posts are real and shared with other signed-in students." />;
  if (error) return <EmptyBlock title="Community isn't set up yet" body="This runs on a database table that hasn't been created yet." />;
  if (!post) return <EmptyBlock title="Post not found" body="This post may have been removed." />;

  return <div className="mx-auto max-w-2xl">
    <Link href="/dashboard/community" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-heading"><ChevronLeft size={14} />Back to Feed</Link>

    <div className="mt-4 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-2.5 py-1 text-[10px] font-extrabold text-teal-700">{categoryLabels[post.category]}</span>
        {post.postType === "question" && <span className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 px-2.5 py-1 text-[10px] font-extrabold text-amber-700"><HelpCircle size={11} />{postTypeLabels.question}</span>}
      </div>
      <h1 className="display mt-3 text-2xl">{post.title}</h1>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{post.body}</p>
      {post.attachmentUrl && <img src={post.attachmentUrl} alt="" className="mt-4 max-h-80 rounded-2xl border border-slate-100 dark:border-white/10 object-contain" />}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4 text-xs font-bold text-slate-400">
        <span>{post.authorName} · {formatRelativeTime(post.createdAt)}</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleReactPost} className={`flex cursor-pointer items-center gap-1 transition ${post.reactedByMe ? "text-teal-600" : "hover:text-heading"}`}><ThumbsUp size={13} fill={post.reactedByMe ? "currentColor" : "none"} />{post.reactionCount}</button>
          <button type="button" onClick={handleSavePost} className={`cursor-pointer transition ${post.savedByMe ? "text-teal-600" : "hover:text-heading"}`}><Bookmark size={13} fill={post.savedByMe ? "currentColor" : "none"} /></button>
          <button type="button" onClick={() => setReportTarget({ type: "post", id: post.id })} className="cursor-pointer transition hover:text-rose-500"><Flag size={13} /></button>
        </div>
      </div>
    </div>

    <div className="mt-6">
      <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-400">{comments.length} {comments.length === 1 ? "Reply" : "Replies"}</h2>
      <div className="mt-3 space-y-3">
        {comments.map(comment => <div key={comment.id} className={`rounded-2xl border p-4 ${post.acceptedCommentId === comment.id ? "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-500/15" : "border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917]"} shadow-soft`}>
          {post.acceptedCommentId === comment.id && <p className="mb-2 flex items-center gap-1 text-[11px] font-extrabold text-emerald-700"><Check size={12} />Accepted Answer</p>}
          {comment.isHelpful && post.acceptedCommentId !== comment.id && <p className="mb-2 text-[11px] font-extrabold text-teal-600">Marked Helpful</p>}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{comment.body}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-400">
            <span>{comment.authorName} · {formatRelativeTime(comment.createdAt)}</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => handleReactComment(comment)} className={`flex cursor-pointer items-center gap-1 transition ${comment.reactedByMe ? "text-teal-600" : "hover:text-heading"}`}><ThumbsUp size={12} fill={comment.reactedByMe ? "currentColor" : "none"} />{comment.reactionCount}</button>
              {isOP && <>
                <button type="button" onClick={() => handleMarkHelpful(comment)} className={`cursor-pointer font-extrabold ${comment.isHelpful ? "text-teal-600" : "hover:text-heading"}`}>{comment.isHelpful ? "Unmark Helpful" : "✓ Helpful"}</button>
                {post.postType === "question" && <button type="button" onClick={() => handleMarkAccepted(comment)} className={`cursor-pointer font-extrabold ${post.acceptedCommentId === comment.id ? "text-emerald-600" : "hover:text-heading"}`}>{post.acceptedCommentId === comment.id ? "Unmark Accepted" : "✓ Accepted"}</button>}
              </>}
              <button type="button" onClick={() => setReportTarget({ type: "comment", id: comment.id })} className="cursor-pointer transition hover:text-rose-500"><Flag size={12} /></button>
            </div>
          </div>
        </div>)}
        {comments.length === 0 && <p className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-8 text-center text-sm text-slate-400">No replies yet—be the first to help.</p>}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft">
        <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3} placeholder="Write a helpful reply…" className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 p-3 text-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100" />
        {postError && <p className="mt-1.5 text-xs font-bold text-rose-600">{postError}</p>}
        <div className="mt-2 flex justify-end">
          <button type="button" disabled={posting || !draft.trim()} onClick={handleSubmitComment} className="cursor-pointer rounded-full bg-accent-500 px-5 py-2 text-xs font-extrabold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50">{posting ? "Posting…" : "Reply"}</button>
        </div>
      </div>
    </div>

    {reportTarget && <ReportModal target={reportTarget} onClose={() => setReportTarget(null)} />}
  </div>;
}

function EmptyBlock({ title, body }: { title: string; body: string }) {
  return <div className="mx-auto max-w-md py-14 text-center">
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-400"><MessageCircle size={20} /></span>
    <p className="mt-3 text-sm font-bold text-heading">{title}</p>
    <p className="mt-1 text-xs leading-relaxed text-slate-500">{body}</p>
    <Link href="/dashboard/community" className="mt-4 inline-block text-xs font-bold text-teal-700 hover:underline">← Back to Feed</Link>
  </div>;
}

function ReportModal({ target, onClose }: { target: { type: "post" | "comment"; id: string }; onClose: () => void }) {
  const [reason, setReason] = useState<CommunityReportReason>("off-topic");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setErr(null);
    const result = await submitCommunityReport({ targetType: target.type, targetId: target.id, reason, message });
    setSubmitting(false);
    if (!result.ok) { setErr(result.error); return; }
    setDone(true);
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0d1917] p-6 shadow-lift" onClick={e => e.stopPropagation()}>
      {done ? <>
        <p className="text-sm font-extrabold text-heading">Report submitted</p>
        <p className="mt-1 text-xs text-slate-500">A moderator will review this.</p>
        <button type="button" onClick={onClose} className="mt-4 w-full cursor-pointer rounded-full bg-ink px-4 py-2.5 text-xs font-bold text-white">Close</button>
      </> : <>
        <p className="text-sm font-extrabold text-heading">Report this {target.type}</p>
        <div className="mt-3 space-y-1.5">
          {(Object.keys(reportReasonLabels) as CommunityReportReason[]).map(r => <button key={r} type="button" onClick={() => setReason(r)} className={`block w-full cursor-pointer rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${reason === r ? "border-teal-300 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-800" : "border-slate-200 dark:border-white/10 text-slate-600 hover:bg-slate-50 dark:bg-white/5"}`}>{reportReasonLabels[r]}</button>)}
        </div>
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="Optional details…" className="mt-3 w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 p-2.5 text-xs focus:border-teal-300 focus:outline-none" />
        {err && <p className="mt-1.5 text-xs font-bold text-rose-600">{err}</p>}
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2.5 text-xs font-bold text-slate-500">Cancel</button>
          <button type="button" disabled={submitting} onClick={handleSubmit} className="flex-1 cursor-pointer rounded-full bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-50">{submitting ? "Sending…" : "Submit"}</button>
        </div>
      </>}
    </div>
  </div>;
}
