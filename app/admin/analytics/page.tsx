"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, Brain, CheckCircle2, Clock, Stethoscope, TrendingUp } from "lucide-react";
import { getAllCaseAttempts, getAllCases } from "@/lib/clinicalCases";
import { getStats, Stats } from "@/lib/progress";
import { getAllTerms, getTermViewCount, Term } from "@/lib/terminology";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topTerms, setTopTerms] = useState<(Term & { views: number })[]>([]);
  const [caseStats, setCaseStats] = useState<{ id: string; title: string; attempts: number; misses: number }[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);

  useEffect(() => {
    setStats(getStats());
    const terms = getAllTerms().map(t => ({ ...t, views: getTermViewCount(t.id) })).filter(t => t.views > 0).sort((a, b) => b.views - a.views).slice(0, 8);
    setTopTerms(terms);

    const attempts = getAllCaseAttempts();
    const cases = getAllCases();
    setTotalAttempts(attempts.length);
    setCorrectAttempts(attempts.filter(a => a.correct).length);
    const byCaseId = new Map<string, { attempts: number; misses: number }>();
    for (const a of attempts) {
      const entry = byCaseId.get(a.caseId) ?? { attempts: 0, misses: 0 };
      entry.attempts++;
      if (!a.correct) entry.misses++;
      byCaseId.set(a.caseId, entry);
    }
    const ranked = Array.from(byCaseId.entries())
      .map(([id, v]) => ({ id, title: cases.find(c => c.id === id)?.title ?? id, ...v }))
      .filter(c => c.misses > 0)
      .sort((a, b) => b.misses - a.misses)
      .slice(0, 6);
    setCaseStats(ranked);
  }, []);

  const completionRate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  return <div>
    <h1 className="text-lg font-extrabold text-white">Analytics</h1>

    <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
      <div>
        <p className="text-sm font-bold text-amber-300">This browser's real activity, not platform-wide analytics</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">Studium has no server collecting data across users, so "daily active users," retention, and cross-user learning patterns have no real numbers to show—showing any would mean making them up. Everything below is computed live from this browser's own real localStorage history: genuine, just scoped to one user.</p>
      </div>
    </div>

    {stats && <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard icon={Clock} tint="text-teal-400" label="Study Minutes" value={stats.studyMinutes.toLocaleString()} />
      <StatCard icon={TrendingUp} tint="text-violet-400" label="Study Sessions" value={stats.studySessions.toLocaleString()} />
      <StatCard icon={Stethoscope} tint="text-sky-400" label="Cases Completed" value={stats.casesCompleted.toLocaleString()} />
      <StatCard icon={Brain} tint="text-amber-400" label="Flashcards Reviewed" value={stats.flashcardsCompleted.toLocaleString()} />
    </div>}

    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-bold text-white">Most Studied Terms <span className="font-normal text-slate-500">— real view counts</span></h2>
        <div className="mt-3 space-y-1.5">
          {topTerms.map(t => <div key={t.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
            <span className="flex items-center gap-1.5 text-sm font-bold text-white"><BookOpen size={12} className="text-teal-400" />{t.name}</span>
            <span className="text-xs font-bold text-slate-400">{t.views} view{t.views !== 1 ? "s" : ""}</span>
          </div>)}
          {topTerms.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No term views recorded yet on this browser.</p>}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-white">Most Missed Cases <span className="font-normal text-slate-500">— real attempt history</span></h2>
        <p className="mt-1 text-xs text-slate-500">Overall accuracy across {totalAttempts} real attempt{totalAttempts !== 1 ? "s" : ""}: <span className="font-bold text-teal-400">{completionRate}%</span></p>
        <div className="mt-3 space-y-1.5">
          {caseStats.map(c => <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
            <span className="truncate text-sm font-bold text-white">{c.title}</span>
            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-rose-400">{c.misses}/{c.attempts} missed</span>
          </div>)}
          {caseStats.length === 0 && <div className="flex items-center gap-2 py-4 text-center text-xs text-slate-500"><CheckCircle2 size={14} className="text-teal-400" />No misses recorded yet on this browser.</div>}
        </div>
      </div>
    </div>
  </div>;
}

function StatCard({ icon: Icon, tint, label, value }: { icon: typeof Clock; tint: string; label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Icon size={13} className={tint} />{label}</div>
    <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
  </div>;
}
