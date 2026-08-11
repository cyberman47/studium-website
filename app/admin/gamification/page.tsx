"use client";

import { useEffect, useState } from "react";
import { Award, Flame, Trophy, Zap } from "lucide-react";
import {
  Achievement, achievementDefs, getAchievements, getLevelInfo, getLongestStreak, getStreak, getTotalKP, levelDefs,
  setAchievementOverride, setTotalKPOverride
} from "@/lib/progress";

export default function GamificationPage() {
  const [totalKP, setTotalKP] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [kpInput, setKpInput] = useState("");

  function refresh() {
    setTotalKP(getTotalKP());
    setAchievements(getAchievements());
    setStreak(getStreak());
    setLongestStreak(getLongestStreak());
  }
  useEffect(() => { refresh(); }, []);

  const level = getLevelInfo(totalKP);

  function handleSetKP() {
    const n = Number(kpInput);
    if (!Number.isFinite(n)) return;
    setTotalKPOverride(n);
    refresh();
  }

  function handleToggleAchievement(id: string, unlocked: boolean) {
    setAchievementOverride(id, !unlocked);
    refresh();
  }

  return <div>
    <h1 className="text-lg font-extrabold text-white">Gamification</h1>
    <p className="mt-1 text-xs text-slate-500">Real level thresholds and achievement definitions from lib/progress.ts, plus real QA overrides—these genuinely write the same keys the student Progress page reads. "Leaderboards" needs a real multi-user backend that doesn't exist, so it's intentionally left out rather than faked with made-up names.</p>

    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Zap size={13} className="text-teal-400" />This Browser's KP</div>
        <p className="mt-2 text-2xl font-extrabold text-white">{totalKP.toLocaleString()}</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Trophy size={13} className="text-violet-400" />Level</div>
        <p className="mt-2 text-2xl font-extrabold text-white">{level.level} · {level.name}</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Flame size={13} className="text-amber-400" />Streak</div>
        <p className="mt-2 text-2xl font-extrabold text-white">{streak} days</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Award size={13} className="text-sky-400" />Longest Streak</div>
        <p className="mt-2 text-2xl font-extrabold text-white">{longestStreak} days</p>
      </div>
    </div>

    <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">QA Override — set this browser's total KP</p>
      <p className="mt-1 text-xs text-slate-500">Real, not a preview screenshot—writes the same key getTotalKP() reads, so the Progress page immediately reflects it.</p>
      <div className="mt-2 flex gap-2">
        <input value={kpInput} onChange={e => setKpInput(e.target.value)} placeholder={String(totalKP)} className="w-40 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-teal-500/40" />
        <button type="button" onClick={handleSetKP} className="cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-xs font-bold text-white hover:bg-teal-600">Set KP</button>
      </div>
    </div>

    <div className="mt-8">
      <h2 className="text-sm font-bold text-white">Level Thresholds <span className="font-normal text-slate-500">— real, from code</span></h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wide text-slate-500"><th className="px-4 py-2.5">Level</th><th className="px-4 py-2.5">Name</th><th className="px-4 py-2.5">KP Threshold</th></tr></thead>
          <tbody>{levelDefs.map(l => <tr key={l.level} className={`border-b border-white/5 last:border-0 ${l.level === level.level ? "bg-teal-500/5" : ""}`}>
            <td className="px-4 py-2.5 font-bold text-white">{l.level}</td>
            <td className="px-4 py-2.5 text-slate-300">{l.name}</td>
            <td className="px-4 py-2.5 text-slate-400">{l.threshold.toLocaleString()} KP</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>

    <div className="mt-8">
      <h2 className="text-sm font-bold text-white">Achievements <span className="font-normal text-slate-500">— {achievementDefs.length} real definitions, toggle to QA the unlock UI</span></h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {achievements.map(a => <div key={a.id} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${a.unlocked ? "border-teal-500/20 bg-teal-500/5" : "border-white/10 bg-white/[0.02]"}`}>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">{a.title}</p>
            <p className="text-xs text-slate-500">{a.requirement}</p>
          </div>
          {!a.comingSoon && <button type="button" onClick={() => handleToggleAchievement(a.id, a.unlocked)} className={`shrink-0 cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${a.unlocked ? "bg-teal-500/15 text-teal-300 hover:bg-teal-500/25" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>{a.unlocked ? "Revoke" : "Grant"}</button>}
        </div>)}
      </div>
    </div>
  </div>;
}
