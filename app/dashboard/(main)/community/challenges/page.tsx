"use client";

// Community Challenges: real challenges (supabase/migrations/
// 0010_challenges.sql), real progress (lib/challenges.ts—never a fabricated
// bar), and a real cross-user leaderboard wherever the underlying metric is
// actually synced (KP, streak). Everything else is honestly personal-only,
// disclosed directly rather than faking a leaderboard for it.
import { useEffect, useState } from "react";
import { Award, BookOpen, Brain, ClipboardCheck, Flame, Info, Swords, Trophy, Zap } from "lucide-react";
import {
  ChallengeDef, ChallengeLeaderboardRow, ChallengeMetric, getChallengeLeaderboard, getMyChallenges,
  joinChallenge, leaveChallenge, metricLabels, MyChallengeProgress
} from "@/lib/challenges";
import { createClient } from "@/lib/supabase/client";

const cardClass = "rounded-3xl border border-black/[0.06] dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

const metricIcons: Record<ChallengeMetric, typeof Zap> = {
  kp_gained: Zap, streak_days: Flame, flashcards_mastered: Brain, quizzes_completed: ClipboardCheck, lessons_completed: BookOpen
};

type Mode = "loading" | "signedOut" | "ready" | "error";

export default function ChallengesPage() {
  const [mode, setMode] = useState<Mode>("loading");
  const [challenges, setChallenges] = useState<MyChallengeProgress[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openLeaderboard, setOpenLeaderboard] = useState<string | null>(null);

  async function refresh() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMode("signedOut"); return; }
    try {
      setChallenges(await getMyChallenges());
      setMode("ready");
    } catch {
      setMode("error");
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleJoin(challenge: ChallengeDef) {
    setBusyId(challenge.id);
    await joinChallenge(challenge);
    await refresh();
    setBusyId(null);
  }

  async function handleLeave(challengeId: string) {
    setBusyId(challengeId);
    await leaveChallenge(challengeId);
    await refresh();
    setBusyId(null);
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[280px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Swords size={13} />Challenges</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Community Challenges.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Join a challenge and track real progress—built from what you actually study, not a fake progress bar.</p>

    {mode === "loading" && <div className={`${cardClass} mt-8 max-w-2xl p-8 text-center text-sm text-slate-400`}>Loading challenges…</div>}

    {mode === "signedOut" && <div className={`${cardClass} mt-8 max-w-xl p-8 text-center`}>
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-300"><Swords size={26} /></span>
      <h2 className="mt-4 text-lg font-extrabold text-heading dark:text-white">Sign in to join challenges.</h2>
      <p className="mt-1.5 text-sm text-slate-500">Challenges track your real, signed-in progress.</p>
    </div>}

    {mode === "error" && <div className={`${cardClass} mt-8 max-w-xl p-8 text-center text-sm text-slate-400`}>Challenges aren't set up yet—this needs supabase/migrations/0010_challenges.sql applied.</div>}

    {mode === "ready" && <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {challenges.length === 0 && <p className="text-sm text-slate-400">No challenges yet.</p>}
      {challenges.map(item => <ChallengeCard
        key={item.challenge.id}
        item={item}
        busy={busyId === item.challenge.id}
        leaderboardOpen={openLeaderboard === item.challenge.id}
        onToggleLeaderboard={() => setOpenLeaderboard(prev => prev === item.challenge.id ? null : item.challenge.id)}
        onJoin={() => handleJoin(item.challenge)}
        onLeave={() => handleLeave(item.challenge.id)}
      />)}
    </div>}
  </section>;
}

function ChallengeCard({ item, busy, leaderboardOpen, onToggleLeaderboard, onJoin, onLeave }: {
  item: MyChallengeProgress; busy: boolean; leaderboardOpen: boolean;
  onToggleLeaderboard: () => void; onJoin: () => void; onLeave: () => void;
}) {
  const { challenge, joined, currentValue, progressPercent, completed, hasLeaderboard } = item;
  const Icon = metricIcons[challenge.metric];

  return <div className={`${cardClass} p-6`}>
    <div className="flex items-start justify-between gap-3">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${completed ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"}`}><Icon size={20} /></span>
      {completed && <span className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300"><Award size={11} />Completed</span>}
    </div>
    <h2 className="mt-3 text-base font-extrabold text-heading dark:text-white">{challenge.title}</h2>
    <p className="mt-1 text-sm leading-relaxed text-slate-500">{challenge.description}</p>

    {joined ? <div className="mt-4">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500"><span>{currentValue.toLocaleString()} / {challenge.targetValue.toLocaleString()} {metricLabels[challenge.metric]}</span><span>{progressPercent}%</span></div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full transition-all ${completed ? "bg-emerald-500" : "bg-teal-500"}`} style={{ width: `${progressPercent}%` }} /></div>
    </div> : <p className="mt-4 text-xs font-bold text-slate-400">Not joined yet.</p>}

    <div className="mt-4 flex items-center gap-2">
      {joined
        ? <button type="button" disabled={busy} onClick={onLeave} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-500 transition hover:border-rose-200 hover:text-rose-600 disabled:opacity-50">{busy ? "…" : "Leave"}</button>
        : <button type="button" disabled={busy} onClick={onJoin} className="cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:opacity-50">{busy ? "…" : "Join Challenge"}</button>}
      {hasLeaderboard
        ? <button type="button" onClick={onToggleLeaderboard} className="flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-500/10"><Trophy size={13} />{leaderboardOpen ? "Hide" : "Leaderboard"}</button>
        : <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400"><Info size={12} />Personal progress only</span>}
    </div>

    {leaderboardOpen && hasLeaderboard && <ChallengeLeaderboard challenge={challenge} />}
  </div>;
}

function ChallengeLeaderboard({ challenge }: { challenge: ChallengeDef }) {
  const [rows, setRows] = useState<ChallengeLeaderboardRow[] | null | "loading">("loading");

  useEffect(() => {
    let cancelled = false;
    getChallengeLeaderboard(challenge).then(r => { if (!cancelled) setRows(r); });
    return () => { cancelled = true; };
  }, [challenge]);

  if (rows === "loading") return <p className="mt-4 text-xs text-slate-400">Loading leaderboard…</p>;
  if (!rows || rows.length === 0) return <p className="mt-4 text-xs text-slate-400">Nobody's joined yet—be the first.</p>;

  return <div className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-white/10 pt-4">
    {rows.slice(0, 8).map((r, i) => <div key={r.userId} className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold ${r.isYou ? "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" : "text-slate-600 dark:text-slate-300"}`}>
      <span>#{i + 1} {r.name}{r.isYou ? " (You)" : ""}</span>
      <span>{r.value.toLocaleString()}</span>
    </div>)}
  </div>;
}
