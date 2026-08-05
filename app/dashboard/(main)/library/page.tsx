"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, ChevronRight, PartyPopper, Search, Sparkles, Star, Stethoscope, Target } from "lucide-react";
import { inputClass } from "@/components/ui";
import { libraryCategories } from "@/lib/libraryCategories";
import { findSubject, getLessonStatus } from "@/lib/mcatPath";
import { CaseAttempt, ClinicalCase, getCaseOfTheDay, getTodayCaseAttempt } from "@/lib/clinicalCases";
import {
  DailyActivityPoint, getLevelInfo, getStudyPlanProgress, getWeeklyActivityByDay, logQuiz, StudyPlanProgress
} from "@/lib/progress";

type NextLesson = { id: string; title: string; completedCount: number; total: number };

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [todaysCase, setTodaysCase] = useState<ClinicalCase | null>(null);
  const [caseAttempt, setCaseAttempt] = useState<CaseAttempt | null>(null);
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
  const [planProgress, setPlanProgress] = useState<StudyPlanProgress | null>(null);
  const [weekActivity, setWeekActivity] = useState<DailyActivityPoint[]>([]);
  const [floatingKP, setFloatingKP] = useState<number | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);

  function refresh() {
    setTodaysCase(getCaseOfTheDay());
    setCaseAttempt(getTodayCaseAttempt());
    const biology = findSubject("bio-biochem", "biology");
    if (biology) {
      const ids = biology.lessons.map(l => l.id);
      const completedCount = ids.filter(id => getLessonStatus(ids, id) === "completed").length;
      const next = biology.lessons.find(l => getLessonStatus(ids, l.id) !== "locked" && getLessonStatus(ids, l.id) !== "completed");
      setNextLesson(next ? { id: next.id, title: next.title, completedCount, total: ids.length } : null);
    }
    setPlanProgress(getStudyPlanProgress());
    setWeekActivity(getWeeklyActivityByDay());
  }

  useEffect(() => { refresh(); }, []);

  function handleTakeQuiz() {
    const result = logQuiz();
    refresh();
    if (result?.awarded) {
      setFloatingKP(result.kpAwarded);
      setTimeout(() => setFloatingKP(null), 1400);
      if (result.leveledUp) {
        const info = getLevelInfo(result.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
  }

  const filteredCategories = libraryCategories.filter(c => c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const maxMinutes = Math.max(1, ...weekActivity.map(d => d.minutes));
  const goalsMet = planProgress ? [planProgress.minutesComplete, planProgress.flashcardsComplete, planProgress.quizzesComplete].filter(Boolean).length : 0;
  const quizPercent = planProgress ? Math.min(100, Math.round((planProgress.quizzes / planProgress.goals.quizzes) * 100)) : 0;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Library</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Library.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Everything you need to study, all in one place.</p>

    <div className="relative mt-6 max-w-xl">
      <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search entire library..." className={`${inputClass} pl-11`} />
    </div>

    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_280px_300px] xl:items-start">
      {/* Main column */}
      <div className="min-w-0 space-y-6">
        {todaysCase && <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-lift sm:p-8">
          <Stethoscope size={200} className="pointer-events-none absolute -right-10 -top-10 text-white/5" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-teal-300">Featured Today</span>
            <h2 className="display mt-4 text-2xl sm:text-3xl">{todaysCase.category} Cases</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-300">Interactive patient scenarios and case-based learning.</p>
            <Link href="/dashboard/case-of-the-day" className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">
              {caseAttempt ? "Review Your Answer" : "Start Case"}<ArrowUpRight size={16} />
            </Link>
          </div>
        </div>}

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight">Continue Learning</h2>
            <Link href="/dashboard/learning-paths/mcat/bio-biochem/biology" className="flex cursor-pointer items-center gap-1 text-xs font-extrabold text-teal-600 hover:text-teal-700">Recent<ChevronRight size={14} /></Link>
          </div>
          <div className="mt-4 space-y-3">
            {nextLesson ? <Link href={`/dashboard/learning-paths/mcat/bio-biochem/biology/${nextLesson.id}`} className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-100 p-3 transition hover:border-teal-200 hover:bg-[#f9fcfc]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-700"><BookOpen size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{nextLesson.title}</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${(nextLesson.completedCount / nextLesson.total) * 100}%` }} /></div>
              </div>
              <span className="shrink-0 text-xs font-extrabold text-slate-500">{nextLesson.completedCount} / {nextLesson.total}</span>
            </Link> : <p className="text-sm text-slate-500">You've completed every Biology lesson—nice work.</p>}

            {planProgress && <Link href="/dashboard" className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-100 p-3 transition hover:border-teal-200 hover:bg-[#f9fcfc]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-600"><Target size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">Today's Study Plan</p>
                <p className="text-xs text-slate-500">{goalsMet} / 3 goals met</p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-slate-300" />
            </Link>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight">My Activity Insights</h2>
            <span className="text-xs font-bold text-slate-400">This week</span>
          </div>
          <div className="mt-6 flex h-32 items-end justify-between gap-2">
            {weekActivity.map(d => <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end overflow-hidden rounded-lg bg-slate-100">
                <div className={`w-full rounded-lg ${d.isToday ? "bg-teal-500" : "bg-teal-200"}`} style={{ height: `${Math.max(4, (d.minutes / maxMinutes) * 100)}%` }} />
              </div>
              <span className={`text-[11px] font-bold ${d.isToday ? "text-teal-600" : "text-slate-400"}`}>{d.label}</span>
            </div>)}
          </div>
          <p className="mt-3 text-xs text-slate-400">{weekActivity.reduce((sum, d) => sum + d.minutes, 0)} minutes studied this week</p>
        </div>
      </div>

      {/* Browse column */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold tracking-tight">Browse the Library</h2>
        <div className="mt-3 space-y-1">
          {filteredCategories.map(cat => <Link key={cat.id} href={`/dashboard/library/${cat.id}`} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-[#f9fcfc]">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${cat.color}`}><cat.icon size={16} /></span>
            <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{cat.name}</span>
            <ChevronRight size={15} className="shrink-0 text-slate-300" />
          </Link>)}
          {filteredCategories.length === 0 && <p className="px-2 py-4 text-sm text-slate-500">No matches for "{query}".</p>}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <div className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-extrabold tracking-tight">Daily Quiz Challenge</h2>
          <div className="mt-5 flex flex-col items-center">
            <RingProgress percent={quizPercent} value={planProgress?.quizzes ?? 0} />
            <p className="mt-2 text-xs font-bold text-slate-500">Progress</p>
          </div>
          <button
            type="button"
            onClick={handleTakeQuiz}
            disabled={!!planProgress?.quizzesComplete}
            className="mt-5 w-full cursor-pointer rounded-full bg-accent-500 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {planProgress?.quizzesComplete ? "Done for today ✓" : "Take Today's Quiz"}
          </button>
          <AnimatePresence>
            {floatingKP !== null && <motion.span
              initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -24 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
              className="pointer-events-none absolute right-6 top-6 text-sm font-extrabold text-teal-600"
            >+{floatingKP} KP</motion.span>}
          </AnimatePresence>
        </div>

        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-soft">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-lime-100 text-lime-700"><Star size={18} /></span>
          <p className="mt-3 text-sm font-extrabold text-ink">Community Highlights</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Shared notes, decks, and resources from other users will show up here once Community is built.</p>
        </div>
      </div>
    </div>

    <AnimatePresence>
      {levelUpInfo && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setLevelUpInfo(null)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-lift"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-600"><PartyPopper size={30} /></span>
          <h2 className="display mt-5 text-2xl">🎉 Level Up!</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Congratulations! You've reached <span className="font-extrabold text-ink">Level {levelUpInfo.level} · {levelUpInfo.name}</span>.</p>
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Awesome!</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}

function RingProgress({ percent, value, size = 88, stroke = 9 }: { percent: number; value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);
  return <div className="relative grid place-items-center" style={{ width: size, height: size }}>
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2f5f3" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#0F8B8D" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
    <span className="absolute text-2xl font-extrabold text-ink">{value}</span>
  </div>;
}
