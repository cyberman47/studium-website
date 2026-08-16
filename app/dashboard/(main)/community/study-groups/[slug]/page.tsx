"use client";

// A single Study Group's real page: members (a real leaderboard—sorted by
// real total_kp, never fabricated), and Discussions (the same Forum post
// system as everywhere else in Community, just filtered to this group—see
// lib/community.ts's fetchFeed groupId option). No separate group-posts
// table, no separate group-leaderboard table.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MessageCircle, Plus, ThumbsUp, Trophy, UsersRound, X } from "lucide-react";
import { categoryLabels, CommunityCategory, CommunityPost, createPost, fetchFeed } from "@/lib/community";
import { fetchGroup, fetchGroupMembers, GroupMember, joinGroup, leaveGroup, StudyGroup } from "@/lib/studyGroups";
import { createClient } from "@/lib/supabase/client";

const cardClass = "rounded-3xl border border-black/[0.06] dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

type Tab = "discussions" | "members";
type Mode = "loading" | "notFound" | "ready";

function formatRelativeTime(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function StudyGroupDetailPage() {
  const params = useParams<{ slug: string }>();
  const [mode, setMode] = useState<Mode>("loading");
  const [signedIn, setSignedIn] = useState(false);
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [tab, setTab] = useState<Tab>("discussions");
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [busy, setBusy] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  async function refresh() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setSignedIn(!!user);
    const g = await fetchGroup(params.slug);
    if (!g) { setMode("notFound"); return; }
    setGroup(g);
    const [m, feed] = await Promise.all([fetchGroupMembers(g.id), fetchFeed({ groupId: g.id, limit: 30 })]);
    setMembers(m);
    setPosts(feed.posts);
    setMode("ready");
  }

  useEffect(() => { refresh(); }, [params.slug]);

  async function toggleMembership() {
    if (!group) return;
    setBusy(true);
    if (group.isMember) await leaveGroup(group.id); else await joinGroup(group.id);
    await refresh();
    setBusy(false);
  }

  if (mode === "loading") return <section className="relative py-10 sm:py-14"><div className={`${cardClass} max-w-2xl p-8 text-center text-sm text-slate-400`}>Loading group…</div></section>;
  if (mode === "notFound" || !group) return <section className="relative py-10 sm:py-14">
    <Link href="/dashboard/community/study-groups" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-heading"><ArrowLeft size={14} />Back to Study Groups</Link>
    <p className="mt-6 text-sm text-slate-400">This group doesn't exist (or Study Groups migrations aren't applied yet).</p>
  </section>;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[280px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/community/study-groups" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-heading"><ArrowLeft size={14} />Back to Study Groups</Link>

    <div className={`${cardClass} mt-4 p-6 sm:p-7`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"><UsersRound size={26} /></span>
          <div>
            <h1 className="display text-2xl">{group.name}</h1>
            <p className="mt-1 max-w-lg text-sm leading-relaxed text-slate-500">{group.description}</p>
            <p className="mt-2 text-xs font-bold text-slate-400">{group.memberCount} member{group.memberCount === 1 ? "" : "s"}{group.category ? ` · ${categoryLabels[group.category]}` : ""}</p>
          </div>
        </div>
        {signedIn && <button type="button" disabled={busy} onClick={toggleMembership} className={`shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold transition disabled:opacity-50 ${group.isMember ? "border border-slate-200 dark:border-white/10 text-slate-500 hover:border-rose-200 hover:text-rose-600" : "bg-accent-500 text-white shadow-[0_10px_20px_-10px_#047857] hover:-translate-y-0.5 hover:bg-accent-600"}`}>{busy ? "…" : group.isMember ? "Leave Group" : "Join Group"}</button>}
      </div>
    </div>

    <div className="mt-6 flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-1.5 shadow-soft w-fit">
      {(["discussions", "members"] as Tab[]).map(t => <button key={t} type="button" onClick={() => setTab(t)} className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold capitalize transition ${tab === t ? "bg-ink text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"}`}>{t === "discussions" ? <MessageCircle size={14} /> : <Trophy size={14} />}{t}</button>)}
    </div>

    {tab === "discussions" && <div className="mt-6 max-w-2xl">
      {signedIn && <button type="button" onClick={() => setComposerOpen(true)} className="mb-4 flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Plus size={15} />New Discussion</button>}
      {posts.length === 0 ? <div className={`${cardClass} p-8 text-center text-sm text-slate-400`}>No discussions in this group yet.</div> : <div className="space-y-3">
        {posts.map(post => <Link key={post.id} href={`/dashboard/community/forum/${post.id}`} className={`${cardClass} block cursor-pointer p-5 transition hover:-translate-y-0.5 hover:shadow-lift`}>
          <p className="text-sm font-extrabold text-heading dark:text-white">{post.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{post.body}</p>
          <div className="mt-2.5 flex items-center gap-3 text-[11px] font-bold text-slate-400">
            <span>{post.authorName} · {formatRelativeTime(post.createdAt)}</span>
            <span className="flex items-center gap-1"><ThumbsUp size={11} />{post.reactionCount}</span>
            <span className="flex items-center gap-1"><MessageCircle size={11} />{post.commentCount}</span>
          </div>
        </Link>)}
      </div>}
    </div>}

    {tab === "members" && <div className="mt-6 max-w-2xl space-y-2">
      {members.length === 0 ? <div className={`${cardClass} p-8 text-center text-sm text-slate-400`}>No members yet—be the first to join.</div> : members.map((m, i) => <div key={m.userId} className={`${cardClass} flex items-center justify-between px-5 py-3`}>
        <span className="flex items-center gap-2.5 text-sm font-bold text-heading dark:text-white">
          <span className="text-xs font-extrabold text-slate-400">#{i + 1}</span>{m.name}
          {m.role === "admin" && <span className="rounded-full bg-teal-50 dark:bg-teal-500/15 px-2 py-0.5 text-[10px] font-extrabold text-teal-700 dark:text-teal-300">Admin</span>}
        </span>
        <span className="text-xs font-bold text-slate-400">{m.totalKp.toLocaleString()} KP</span>
      </div>)}
    </div>}

    {composerOpen && <NewGroupPostModal groupId={group.id} onClose={() => setComposerOpen(false)} onCreated={() => { setComposerOpen(false); refresh(); }} />}
  </section>;
}

function NewGroupPostModal({ groupId, onClose, onCreated }: { groupId: string; onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<CommunityCategory>("general");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    const result = await createPost({ category, postType: "discussion", title, body, groupId });
    setSubmitting(false);
    if (!result.ok) { setError(result.error); return; }
    onCreated();
  }

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={onClose}>
    <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-lift sm:p-7">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-heading dark:text-white">New Discussion</h3>
        <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-heading dark:hover:bg-white/5" aria-label="Close"><X size={16} /></button>
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="mt-4 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100" />
      <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="What do you want to discuss with the group?" className="mt-3 w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100" />
      <select value={category} onChange={e => setCategory(e.target.value as CommunityCategory)} className="mt-3 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100">
        {Object.entries(categoryLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
      {error && <p className="mt-2 text-xs font-bold text-rose-600">{error}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold text-slate-500 hover:text-heading">Cancel</button>
        <button type="button" disabled={submitting || !title.trim() || !body.trim()} onClick={submit} className="cursor-pointer rounded-full bg-accent-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:opacity-50">{submitting ? "Posting…" : "Post"}</button>
      </div>
    </div>
  </div>;
}
