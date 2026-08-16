"use client";

// My Battles: a view-only page for real 1v1 KP races (lib/battles.ts).
// There's no queue and no "start a battle" flow here on purpose—a battle
// is always started by directly challenging a specific real student from
// their row on the Leaderboard (app/dashboard/(main)/page.tsx's
// LeaderboardCard), never from a standalone section. This page just shows
// what's currently running and what already happened.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, Swords, Trophy } from "lucide-react";
import { BattleProgress, getMyBattles } from "@/lib/battles";

const cardClass = "rounded-3xl border border-black/[0.06] bg-white dark:bg-[#0d1917] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

function formatTimeRemaining(endsAt: string): string {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return "Ending…";
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return hours >= 1 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
}

type Mode = "loading" | "ready";

export default function BattlesPage() {
  const [mode, setMode] = useState<Mode>("loading");
  const [battles, setBattles] = useState<BattleProgress[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh() {
    setBattles(await getMyBattles());
  }

  useEffect(() => {
    refresh().then(() => setMode("ready"));
    // Only polls while there's something live to watch (an active battle's
    // KP gap can shift, and its ends_at needs to be caught once it passes)
    // —re-armed below once that's known.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    const hasActive = battles.some(b => b.status === "active");
    if (hasActive) pollRef.current = setInterval(refresh, 15000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [battles]);

  const active = battles.filter(b => b.status === "active");
  const history = [...battles.filter(b => b.status === "completed")].sort((a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime());

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Dashboard</Link>
    <span className="eyebrow"><Swords size={13} />My Battles</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Your KP races.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Challenge a real student straight from the <Link href="/dashboard" className="cursor-pointer text-teal-700 underline dark:text-teal-300">Leaderboard</Link> to start a new 24-hour battle. This page just shows how they're going.</p>

    {mode === "loading" ? <div className={`${cardClass} mt-8 max-w-xl p-8 text-center text-sm text-slate-400`}>Loading…</div> : <div className="mt-8 max-w-xl space-y-8">
      {active.length === 0 && history.length === 0 && <div className={`${cardClass} p-8 text-center`}>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-300"><Swords size={26} /></span>
        <h2 className="mt-4 text-lg font-extrabold text-heading dark:text-white">No battles yet.</h2>
        <p className="mt-1.5 text-sm text-slate-500">Head to the Leaderboard and challenge someone real.</p>
        <Link href="/dashboard" className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Go to Leaderboard<ArrowUpRight size={15} /></Link>
      </div>}

      {active.length > 0 && <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-400">Active</h2>
        <div className="mt-3 space-y-4">{active.map(b => <BattleCard key={b.id} battle={b} />)}</div>
      </div>}

      {history.length > 0 && <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-400">Past Battles</h2>
        <div className="mt-3 space-y-2">{history.map(b => <HistoryRow key={b.id} battle={b} />)}</div>
      </div>}
    </div>}
  </section>;
}

function BattleCard({ battle }: { battle: BattleProgress }) {
  const max = Math.max(battle.you.kpGained, battle.opponent.kpGained, 1);
  const youLeading = battle.you.kpGained > battle.opponent.kpGained;
  const oppLeading = battle.opponent.kpGained > battle.you.kpGained;
  return <div className={`${cardClass} p-6 sm:p-8`}>
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-teal-600 dark:text-teal-300"><Swords size={13} />vs {battle.opponent.name}</span>
      <span className="flex items-center gap-1 text-xs font-bold text-slate-400"><Clock3 size={12} />{formatTimeRemaining(battle.endsAt)}</span>
    </div>

    <div className="mt-6 space-y-5">
      <PlayerBar label={battle.you.name} sublabel="You" kp={battle.you.kpGained} max={max} leading={youLeading} accent="teal" />
      <PlayerBar label={battle.opponent.name} sublabel="Opponent" kp={battle.opponent.kpGained} max={max} leading={oppLeading} accent="slate" />
    </div>

    <p className="mt-6 text-center text-xs text-slate-400">Whoever earns more real KP by the deadline wins. Keep studying.</p>
  </div>;
}

function PlayerBar({ label, sublabel, kp, max, leading, accent }: { label: string; sublabel: string; kp: number; max: number; leading: boolean; accent: "teal" | "slate" }) {
  const barColor = accent === "teal" ? "bg-teal-500" : "bg-slate-400";
  return <div>
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="flex items-center gap-1.5 font-extrabold text-heading dark:text-white">{label}{leading && <Trophy size={13} className="text-amber-500" />}</span>
      <span className="font-bold text-slate-500">{sublabel} · {kp.toLocaleString()} KP</span>
    </div>
    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full transition-[width] duration-500 ${barColor}`} style={{ width: `${Math.max(4, Math.round((kp / max) * 100))}%` }} /></div>
  </div>;
}

function HistoryRow({ battle }: { battle: BattleProgress }) {
  const outcome = battle.winnerId === null ? "Tie" : battle.winnerId === battle.you.id ? "Won" : "Lost";
  const outcomeClasses = outcome === "Won"
    ? "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300"
    : outcome === "Lost"
      ? "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
      : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300";
  return <div className={`${cardClass} flex items-center justify-between gap-3 p-4`}>
    <div className="min-w-0">
      <p className="truncate text-sm font-bold text-heading dark:text-white">vs {battle.opponent.name}</p>
      <p className="text-xs text-slate-400">You: {battle.you.kpGained.toLocaleString()} KP · Them: {battle.opponent.kpGained.toLocaleString()} KP</p>
    </div>
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${outcomeClasses}`}>{outcome}</span>
  </div>;
}
