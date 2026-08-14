"use client";

// The "+ Ask the Community" flow: title/question, category, discussion-vs-
// question, an optional attachment. Real Supabase Storage upload wasn't
// part of this pass's schema (would need its own bucket + policies), so
// the attachment field takes an image URL rather than a file picker—an
// honest, real, working simplification rather than a fake upload button.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Sparkles } from "lucide-react";
import { categoryGroups, categoryLabels, CommunityCategory, createPost, PostType } from "@/lib/community";

export default function AskCommunityPage() {
  const router = useRouter();
  const [postType, setPostType] = useState<PostType>("question");
  const [category, setCategory] = useState<CommunityCategory>("mcat");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [showAttachment, setShowAttachment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const result = await createPost({ category, postType, title, body, attachmentUrl: attachmentUrl.trim() || null });
    setSubmitting(false);
    if (!result.ok) { setError(result.error); return; }
    router.push(`/dashboard/community/${result.id}`);
  }

  return <div className="mx-auto max-w-xl">
    <span className="eyebrow"><Sparkles size={13} />Ask the Community</span>
    <h1 className="display mt-4 text-3xl">What do you want to ask?</h1>
    <p className="mt-3 text-sm leading-relaxed text-slate-500">Other students can answer, and you can mark the most useful reply as Helpful or Accepted.</p>

    <div className="mt-6 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <div className="flex gap-2">
        {(["question", "discussion"] as PostType[]).map(t => <button key={t} type="button" onClick={() => setPostType(t)} className={`flex-1 cursor-pointer rounded-xl border-2 py-2.5 text-sm font-extrabold transition ${postType === t ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-800" : "border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:bg-white/5"}`}>{t === "question" ? "Question" : "Discussion"}</button>)}
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">{postType === "question" ? "You're asking something specific—others can mark a reply as the accepted answer." : "You're starting a broader conversation—no single \"right\" answer expected."}</p>

      <label className="mt-5 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder={postType === "question" ? "e.g. How do you memorize the cranial nerves?" : "e.g. I made a mnemonic for the TCA cycle"} className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100" />

      <label className="mt-4 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Details</label>
      <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} placeholder="Add context—what have you tried, what's confusing you, what would help." className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100" />

      <label className="mt-4 block text-xs font-extrabold uppercase tracking-wide text-slate-400">Category</label>
      <div className="mt-2 space-y-3">
        {categoryGroups.map(group => <div key={group.label}>
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-teal-700">{group.label}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {group.categories.map(c => <button key={c} type="button" onClick={() => setCategory(c)} className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition ${category === c ? "bg-ink text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200"}`}>{categoryLabels[c]}</button>)}
          </div>
        </div>)}
      </div>

      {showAttachment ? <div className="mt-4">
        <label className="block text-xs font-extrabold uppercase tracking-wide text-slate-400">Image URL (optional)</label>
        <input value={attachmentUrl} onChange={e => setAttachmentUrl(e.target.value)} placeholder="https://…" className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100" />
      </div> : <button type="button" onClick={() => setShowAttachment(true)} className="mt-4 flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-heading"><ImagePlus size={14} />Attach an image link</button>}

      {error && <p className="mt-4 text-xs font-bold text-rose-600">{error}</p>}

      <button type="button" disabled={submitting || !title.trim() || !body.trim()} onClick={handleSubmit} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Posting…" : "Post to Community"}</button>
    </div>
  </div>;
}
