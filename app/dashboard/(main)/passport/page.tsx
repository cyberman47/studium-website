"use client";

// Studium Passport — the persistent "what have I accomplished" identity
// record, complementing the Progress page's "who am I becoming." Every
// number here is real, reused from lib/passport.ts and lib/achievements.ts,
// which themselves compose data already tracked across the app (KP,
// streaks, mastery, cases, flashcards)—nothing is invented for show.
import { useEffect, useMemo, useState } from "react";
import { Check, Clock3, Globe, IdCard, Lock, Medal, Share2, Sparkles, Trophy, Users } from "lucide-react";
import { Reveal } from "@/components/ui";
import { AchievementCard, achievementIconMap } from "@/components/achievement-card";
import { AchievementCategory, categoryLabels, getPassportAchievements, PassportAchievement } from "@/lib/achievements";
import { getCommunityAchievements } from "@/lib/communityAchievements";
import { getPassportHistory, getPassportIdentity, getShareableSummary, PassportHistoryEntry, PassportIdentity } from "@/lib/passport";
import { fetchRealLeaderboard, LeaderboardResult } from "@/lib/leaderboardSync";

const emptyIdentity: PassportIdentity = {
  name: "Student", currentPathLabel: "Your Learning Journey", currentPathEmoji: "🗺️", totalKP: 0,
  level: { level: 1, name: "Beginner", totalKP: 0, currentThreshold: 0, nextThreshold: 300, kpIntoLevel: 0, kpForNextLevel: 300, progressPercent: 0, isMaxLevel: false },
  achievementsUnlockedCount: 0, achievementsTotalCount: 0, topicsMasteredCount: 0, questionAccuracyPercent: null, memberSince: null
};

const categoryTabs: { id: AchievementCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "knowledge", label: categoryLabels.knowledge },
  { id: "studying", label: categoryLabels.studying },
  { id: "flashcards", label: categoryLabels.flashcards },
  { id: "questions", label: categoryLabels.questions },
  { id: "medicalKnowledge", label: categoryLabels.medicalKnowledge },
  { id: "clinical", label: categoryLabels.clinical },
  { id: "community", label: categoryLabels.community }
];

const LEADERBOARD_LIMIT = 50;
type LeaderboardTab = "global" | "friends" | "weekly";

export default function PassportPage() {
  const [identity, setIdentity] = useState<PassportIdentity>(emptyIdentity);
  const [achievements, setAchievements] = useState<PassportAchievement[]>([]);
  // Fetched separately: Community achievements are Supabase-sourced (async,
  // cross-user), unlike everything else on this page which is synchronous
  // local data. Merged into the same grid/history below rather than shown
  // as a second, disconnected section.
  const [communityAchievements, setCommunityAchievements] = useState<PassportAchievement[]>([]);
  const [history, setHistory] = useState<PassportHistoryEntry[]>([]);
  const [category, setCategory] = useState<AchievementCategory | "all">("all");
  const [showLocked, setShowLocked] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareFallbackText, setShareFallbackText] = useState<string | null>(null);
  const [leaderboardTab, setLeaderboardTab] = useState<LeaderboardTab>("global");
  const [leaderboard, setLeaderboard] = useState<LeaderboardResult | null>(null);

  function refreshAll() {
    setIdentity(getPassportIdentity());
    setAchievements(getPassportAchievements());
    setHistory(getPassportHistory(12));
  }

  useEffect(() => { refreshAll(); }, []);

  useEffect(() => {
    let cancelled = false;
    fetchRealLeaderboard(LEADERBOARD_LIMIT).then(r => { if (!cancelled) setLeaderboard(r); });
    // Community achievements require 0003_social.sql + 0004_community.sql
    // to be applied and the student to be signed in—getCommunityAchievements
    // resolves to an honest all-locked list otherwise (see
    // lib/communityAchievements.ts), never a fake unlocked one.
    getCommunityAchievements().then(list => { if (!cancelled) setCommunityAchievements(list); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const allAchievements = useMemo(() => [...achievements, ...communityAchievements], [achievements, communityAchievements]);

  const filteredAchievements = useMemo(() => {
    return allAchievements
      .filter(a => category === "all" || a.category === category)
      .filter(a => showLocked || a.unlocked)
      .sort((a, b) => Number(b.unlocked) - Number(a.unlocked));
  }, [allAchievements, category, showLocked]);

  // Passport History = unlocked achievements sorted by date (see
  // lib/passport.ts)—merging in the community ones here, client-side,
  // keeps that same "the achievement list IS the timeline" design without
  // needing lib/passport.ts itself to know about Supabase.
  const combinedHistory = useMemo(() => {
    const communityEntries = communityAchievements
      .filter((a): a is PassportAchievement & { unlockedAt: string } => a.unlocked && a.unlockedAt !== null)
      .map(a => ({ id: a.id, date: a.unlockedAt, icon: a.icon, title: a.title, category: a.category }));
    return [...history, ...communityEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 12);
  }, [history, communityAchievements]);

  // Three real fallbacks, in order: the native share sheet, the clipboard,
  // and—if both are unavailable or denied (sandboxed/insecure contexts,
  // permission-denied clipboard, browsers without either API)—a visible,
  // manually-selectable summary block, so the action always gives the
  // student something real to work with instead of silently doing nothing.
  async function handleShare() {
    const summary = getShareableSummary();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `${summary.identity.name}'s Studium Passport`, text: summary.text });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return; // user cancelled the share sheet—not a failure
        // fall through to clipboard/manual fallback
      }
    }
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(summary.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // clipboard write denied/unavailable—fall through to the manual fallback below
    }
    setShareFallbackText(summary.text);
  }

  // A user's row only gets an accurate rank number if they were naturally
  // inside the fetched top-N (rows.length <= limit). If the "own row"
  // fallback had to be appended, they're genuinely somewhere beyond the
  // fetched window—shown honestly as "{limit}+" rather than a fabricated
  // exact number (see lib/leaderboardSync.ts's fetchRealLeaderboard: it
  // appends+re-sorts your row only when you weren't already in the real
  // top-N, which always pushes it to the very end of the merged set).
  const ownRankIsAccurate = (leaderboard?.rows.length ?? 0) <= LEADERBOARD_LIMIT;
  const sortedRows = leaderboard?.rows ?? [];
  const ownRow = sortedRows.find(r => r.isYou);
  const ownIndex = sortedRows.findIndex(r => r.isYou);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><IdCard size={13} />Studium Passport</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Your record inside Studium.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Every achievement, milestone, and rank below is real—built from what you've actually done here, not a badge collection for its own sake.</p>

    {/* Passport header — premium "ID card" panel */}
    <Reveal>
      <div className="relative mt-10 overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-[#0b3d3a] via-[#0f4c47] to-[#0b3d3a] p-7 text-white shadow-lift sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-teal-300/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-teal-300/80">Studium Passport</p>
            <h2 className="display mt-2 text-3xl text-white">{identity.name}</h2>
            <p className="mt-1 text-sm font-bold text-teal-200/90">{identity.currentPathEmoji} {identity.currentPathLabel}</p>
            {identity.memberSince && <p className="mt-3 text-[11px] font-semibold text-teal-300/70">Member since {new Date(identity.memberSince).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>}
          </div>
          <button type="button" onClick={handleShare} className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">
            {copied ? <Check size={14} /> : <Share2 size={14} />}{copied ? "Copied!" : "Share Passport"}
          </button>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Knowledge Points", value: identity.totalKP.toLocaleString() },
            { label: "Level", value: `${identity.level.level} · ${identity.level.name}` },
            { label: "Achievements", value: `${allAchievements.filter(a => a.unlocked).length}/${allAchievements.length}` },
            { label: "Topics Mastered", value: `${identity.topicsMasteredCount}` },
            { label: "Accuracy", value: identity.questionAccuracyPercent !== null ? `${identity.questionAccuracyPercent}%` : "—" }
          ].map(stat => <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur">
            <p className="text-lg font-extrabold text-white">{stat.value}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-300/70">{stat.label}</p>
          </div>)}
        </div>

        {shareFallbackText && <div className="relative mt-5 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur">
          <p className="text-[11px] font-bold text-teal-200/80">Sharing isn't available here—copy this summary manually:</p>
          <textarea readOnly value={shareFallbackText} onFocus={e => e.currentTarget.select()} rows={5} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/90 focus:outline-none focus:ring-2 focus:ring-teal-300/50" />
        </div>}
      </div>
    </Reveal>

    {/* Achievements */}
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight">Achievements</h2>
        <button type="button" onClick={() => setShowLocked(s => !s)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-3.5 py-1.5 text-xs font-bold text-slate-500 transition hover:border-teal-200 hover:text-heading">
          {showLocked ? <Lock size={12} /> : <Check size={12} />}{showLocked ? "Showing locked" : "Unlocked only"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {categoryTabs.map(tab => <button key={tab.id} type="button" onClick={() => setCategory(tab.id)} className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${category === tab.id ? "bg-ink text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200"}`}>{tab.label}</button>)}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filteredAchievements.map(a => <AchievementCard key={a.id} achievement={a} />)}
      </div>
      {filteredAchievements.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6 text-center text-sm text-slate-400">Nothing here yet in this category.</p>}
    </div>

    {/* Passport History */}
    <div className="mt-10">
      <h2 className="text-lg font-extrabold tracking-tight">Passport History</h2>
      <p className="mt-1 text-sm text-slate-500">Your achievements, in the order Studium recorded them.</p>
      {combinedHistory.length > 0 ? <div className="mt-5 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <div className="space-y-5">
          {combinedHistory.map(entry => {
            const Icon = achievementIconMap[entry.icon] ?? Trophy;
            return <div key={entry.id} className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700"><Icon size={17} /></span>
              <div className="min-w-0 flex-1 border-b border-slate-100 dark:border-white/10 pb-5 last:border-0 last:pb-0">
                <p className="text-xs font-bold text-slate-400">{new Date(entry.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
                <p className="mt-0.5 text-sm font-extrabold text-heading">{entry.title}</p>
              </div>
            </div>;
          })}
        </div>
      </div> : <p className="mt-5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6 text-center text-sm text-slate-400">Your history starts the moment you unlock your first achievement.</p>}
    </div>

    {/* Leaderboard */}
    <div className="mt-10">
      <h2 className="text-lg font-extrabold tracking-tight">Leaderboard</h2>
      <div className="mt-4 flex gap-2">
        {([
          { id: "global", label: "Global", icon: Globe },
          { id: "friends", label: "Friends", icon: Users },
          { id: "weekly", label: "Weekly", icon: Clock3 }
        ] as const).map(tab => <button key={tab.id} type="button" onClick={() => setLeaderboardTab(tab.id)} className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${leaderboardTab === tab.id ? "bg-ink text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200"}`}><tab.icon size={12} />{tab.label}</button>)}
      </div>

      <div className="mt-4 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        {leaderboardTab === "global" ? <>
          {!leaderboard ? <p className="text-sm text-slate-400">Loading real rankings…</p>
            : !leaderboard.signedIn ? <p className="text-sm text-slate-500">Log in to see other real students on the leaderboard.</p>
            : <div className="space-y-1">
              {sortedRows.map((row, i) => {
                const rank = ownRankIsAccurate || !row.isYou ? i + 1 : null;
                return <div key={row.id} className={`flex items-center gap-3 rounded-xl px-2.5 py-2.5 ${row.isYou ? "border border-teal-200/60 bg-teal-50/70 dark:bg-teal-500/15" : ""}`}>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${rank !== null && rank <= 3 ? "bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-600" : "bg-slate-100 dark:bg-white/10 text-slate-400"}`}>
                    {rank !== null && rank <= 3 ? <Medal size={13} /> : rank ?? `${LEADERBOARD_LIMIT}+`}
                  </span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${row.isYou ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500"}`}>{row.name.slice(0, 1).toUpperCase()}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-heading">{row.name}{row.isYou && <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-teal-500">You</span>}</span>
                  <span className="shrink-0 text-xs font-extrabold text-slate-500">{row.totalKP.toLocaleString()} KP</span>
                </div>;
              })}
              {ownRow && !ownRankIsAccurate && <p className="mt-3 text-[11px] text-slate-400">Your exact rank is beyond the top {LEADERBOARD_LIMIT}—keep earning KP to climb into view.</p>}
            </div>}
        </> : <div className="flex flex-col items-center gap-2 py-8 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-400">{leaderboardTab === "friends" ? <Users size={18} /> : <Clock3 size={18} />}</span>
          <p className="text-sm font-bold text-heading">{leaderboardTab === "friends" ? "Friends leaderboard is coming soon" : "Weekly leaderboard is coming soon"}</p>
          <p className="max-w-xs text-xs leading-relaxed text-slate-400">{leaderboardTab === "friends" ? "Needs the Friends system Studium doesn't have yet." : "Needs weekly KP tracking Studium doesn't have yet."}</p>
        </div>}
      </div>
    </div>

    <p className="mt-8 flex items-center gap-1.5 px-1 text-xs leading-relaxed text-slate-400"><Sparkles size={12} className="shrink-0" />Achievement dates reflect when Studium detected them, not necessarily the exact historical moment—there's no activity log old enough to know that for sure.</p>
  </section>;
}
