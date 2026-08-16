"use client";

// Community "My Profile": the student's public-facing identity in Studium's
// community, not a second identity system—every number here is read from
// something Studium already tracks (lib/passport.ts's identity aggregation,
// lib/achievements.ts + lib/communityAchievements.ts, lib/community.ts's
// real reputation/posts). The only genuinely new field is `bio`
// (supabase/migrations/0009_community_profile.sql), editable right here.
// Structured in clearly separable cards on purpose—followers/friends,
// badges, and a richer reputation model can each slot in as their own card
// later without reshaping what's already here.
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, IdCard, MessageCircle, Pencil, Sparkles, ThumbsUp, TrendingUp, User, X, Zap } from "lucide-react";
import { AchievementCard } from "@/components/achievement-card";
import { getPassportAchievements, PassportAchievement } from "@/lib/achievements";
import { getCommunityAchievements } from "@/lib/communityAchievements";
import { getPassportIdentity, PassportIdentity } from "@/lib/passport";
import { getStreak } from "@/lib/progress";
import { CommunityPost, CommunityReputation, fetchMyPosts, fetchReputation, categoryLabels } from "@/lib/community";
import { fetchMyProfileRow, MyProfileRow, updateMyBio } from "@/lib/communityProfile";
import { createClient } from "@/lib/supabase/client";

const cardClass = "rounded-3xl border border-black/[0.06] dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

function formatJoined(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type Mode = "loading" | "signedOut" | "ready";

export default function CommunityProfilePage() {
  const [mode, setMode] = useState<Mode>("loading");
  const [identity, setIdentity] = useState<PassportIdentity | null>(null);
  const [profileRow, setProfileRow] = useState<MyProfileRow | null>(null);
  const [streak, setStreak] = useState(0);
  const [reputation, setReputation] = useState<CommunityReputation | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [achievements, setAchievements] = useState<PassportAchievement[]>([]);

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMode("signedOut"); return; }

    setIdentity(getPassportIdentity());
    setStreak(getStreak());

    const [row, rep, myPosts, localAch, communityAch] = await Promise.all([
      fetchMyProfileRow(),
      fetchReputation(user.id),
      fetchMyPosts(user.id, 6),
      Promise.resolve(getPassportAchievements()),
      getCommunityAchievements()
    ]);
    setProfileRow(row);
    setReputation(rep);
    setPosts(myPosts);
    setAchievements([...localAch, ...communityAch]);
    setBioDraft(row?.bio ?? "");
    setMode("ready");
  }

  useEffect(() => { load(); }, []);

  async function saveBio() {
    setSavingBio(true);
    const result = await updateMyBio(bioDraft);
    setSavingBio(false);
    if (result.ok) {
      setProfileRow(prev => prev ? { ...prev, bio: bioDraft.trim() } : prev);
      setEditingBio(false);
    }
  }

  if (mode === "loading") return <section className="relative py-10 sm:py-14"><div className={`${cardClass} max-w-2xl p-8 text-center text-sm text-slate-400`}>Loading your profile…</div></section>;

  if (mode === "signedOut") return <section className="relative py-10 sm:py-14">
    <span className="eyebrow"><User size={13} />My Profile</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Your Community profile.</h1>
    <div className={`${cardClass} mt-8 max-w-xl p-8 text-center`}>
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-300"><User size={26} /></span>
      <h2 className="mt-4 text-lg font-extrabold text-heading dark:text-white">Sign in to see your profile.</h2>
      <p className="mt-1.5 text-sm text-slate-500">Your Community profile is tied to your real Studium account.</p>
      <Link href="/login" className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Log In</Link>
    </div>
  </section>;

  if (!identity) return null;
  const unlockedAchievements = achievements.filter(a => a.unlocked).sort((a, b) => new Date(b.unlockedAt ?? 0).getTime() - new Date(a.unlockedAt ?? 0).getTime());
  const rarityRank: Record<string, number> = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
  const topAchievements = [...unlockedAchievements].sort((a, b) => rarityRank[b.rarity] - rarityRank[a.rarity]).slice(0, 4);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[280px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><User size={13} />My Profile</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Your Community profile.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">What other students see about you—built from what you've actually done in Studium.</p>

    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      <div className="min-w-0 space-y-6">
        {/* Identity header */}
        <div className={`${cardClass} p-6 sm:p-7`}>
          <div className="flex flex-wrap items-start gap-5">
            <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-teal-100 text-2xl font-extrabold text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
              {profileRow?.avatarUrl ? <img src={profileRow.avatarUrl} alt="" className="h-full w-full object-cover" /> : identity.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-extrabold text-heading dark:text-white">{identity.name}</h2>
              {profileRow?.username && <p className="text-sm font-bold text-slate-400">@{profileRow.username}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-xs font-bold text-heading dark:text-white">{identity.currentPathEmoji} {identity.currentPathLabel}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-500/15 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">Level {identity.level.level} · {identity.level.name}</span>
              </div>
            </div>
            <p className="shrink-0 text-xs font-bold text-slate-400">Joined {formatJoined(identity.memberSince)}</p>
          </div>

          {/* Bio */}
          <div className="mt-5 border-t border-slate-100 dark:border-white/10 pt-5">
            {editingBio ? <div>
              <textarea
                value={bioDraft}
                onChange={e => setBioDraft(e.target.value.slice(0, 280))}
                rows={3}
                placeholder="Tell other students a bit about yourself and what you're studying for."
                className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-400">{bioDraft.length}/280</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setEditingBio(false); setBioDraft(profileRow?.bio ?? ""); }} className="cursor-pointer rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-heading dark:hover:bg-white/5"><X size={15} /></button>
                  <button type="button" disabled={savingBio} onClick={saveBio} className="flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:opacity-50"><Check size={13} />{savingBio ? "Saving…" : "Save"}</button>
                </div>
              </div>
            </div> : <button type="button" onClick={() => setEditingBio(true)} className="group flex w-full cursor-pointer items-start justify-between gap-3 text-left">
              <p className={`text-sm leading-relaxed ${profileRow?.bio ? "text-slate-600 dark:text-slate-300" : "italic text-slate-400"}`}>{profileRow?.bio || "No bio yet—add a short one so other students know what you're studying for."}</p>
              <Pencil size={14} className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-teal-600" />
            </button>}
          </div>
        </div>

        {/* Achievements (condensed) */}
        <div className={`${cardClass} p-6 sm:p-7`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight">Achievements</h2>
            <Link href="/dashboard/passport" className="flex cursor-pointer items-center gap-1 text-xs font-bold text-teal-700 hover:underline dark:text-teal-300">Full Passport<ArrowUpRight size={12} /></Link>
          </div>
          <p className="mt-1 text-sm text-slate-500">{unlockedAchievements.length} of {achievements.length} unlocked.</p>
          {topAchievements.length > 0 ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {topAchievements.map(a => <AchievementCard key={a.id} achievement={a} />)}
          </div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-6 text-center text-sm text-slate-400">Keep studying—your first achievement will show up here.</div>}
        </div>

        {/* Recent posts/activity */}
        <div className={`${cardClass} p-6 sm:p-7`}>
          <h2 className="text-lg font-extrabold tracking-tight">Recent Posts</h2>
          <p className="mt-1 text-sm text-slate-500">Your latest activity in the Forum.</p>
          {posts.length > 0 ? <div className="mt-4 space-y-2.5">
            {posts.map(p => <Link key={p.id} href={`/dashboard/community/forum/${p.id}`} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-100 dark:border-white/10 px-4 py-3 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-soft">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-heading dark:text-white">{p.title}</p>
                <p className="mt-0.5 text-[11px] font-bold text-slate-400">{categoryLabels[p.category]} · {formatRelativeTime(p.createdAt)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1"><ThumbsUp size={12} />{p.reactionCount}</span>
                <span className="flex items-center gap-1"><MessageCircle size={12} />{p.commentCount}</span>
              </div>
            </Link>)}
          </div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-6 text-center text-sm text-slate-400">You haven't posted in the Forum yet.<br /><Link href="/dashboard/community/forum/ask" className="cursor-pointer font-bold text-teal-700 hover:underline dark:text-teal-300">Ask the Community →</Link></div>}
        </div>
      </div>

      {/* Sidebar: real stats */}
      <div className="space-y-6">
        <div className={`${cardClass} p-6`}>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-400">Your Stats</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-teal-50 dark:bg-teal-500/15 p-3.5 text-center">
              <Zap size={17} className="mx-auto text-teal-700 dark:text-teal-300" fill="currentColor" />
              <p className="mt-1.5 text-xl font-extrabold text-heading dark:text-white">{identity.totalKP.toLocaleString()}</p>
              <p className="text-[11px] font-bold text-slate-500">Knowledge Points</p>
            </div>
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/15 p-3.5 text-center">
              <TrendingUp size={17} className="mx-auto text-amber-600 dark:text-amber-300" />
              <p className="mt-1.5 text-xl font-extrabold text-heading dark:text-white">{streak}</p>
              <p className="text-[11px] font-bold text-slate-500">Day streak</p>
            </div>
          </div>
          {identity.questionAccuracyPercent !== null && <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-100 dark:border-white/10 px-3.5 py-2.5">
            <span className="text-xs font-bold text-slate-500">Question accuracy</span>
            <span className="text-xs font-extrabold text-heading dark:text-white">{identity.questionAccuracyPercent}%</span>
          </div>}
          <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-100 dark:border-white/10 px-3.5 py-2.5">
            <span className="text-xs font-bold text-slate-500">Topics mastered</span>
            <span className="text-xs font-extrabold text-heading dark:text-white">{identity.topicsMasteredCount}</span>
          </div>
        </div>

        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300"><Sparkles size={15} /></span>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-400">Community Activity</h2>
          </div>
          {reputation ? <div className="mt-4 space-y-2">
            <StatRow label="Discussions started" value={reputation.discussionsStarted} />
            <StatRow label="Helpful answers" value={reputation.helpfulAnswers} />
            <StatRow label="Accepted answers" value={reputation.acceptedAnswers} />
            <StatRow label="Reactions received" value={reputation.reactionsReceived} />
          </div> : <p className="mt-3 text-xs leading-relaxed text-slate-400">Community activity isn't available yet—post in the Forum to start building this.</p>}
        </div>

        <Link href="/dashboard/passport" className="flex cursor-pointer items-center justify-between gap-3 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300"><IdCard size={16} /></span>
            <div><p className="text-sm font-extrabold text-heading dark:text-white">Full Passport</p><p className="text-xs text-slate-400">Every achievement & your learning journey</p></div>
          </div>
          <ArrowUpRight size={15} className="shrink-0 text-slate-300" />
        </Link>
      </div>
    </div>
  </section>;
}

function StatRow({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-extrabold text-heading dark:text-white">{value}</span>
  </div>;
}
