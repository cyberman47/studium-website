"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Calendar, ChevronRight, Clock, Dna, Flame, FlaskConical, Medal, Play, Stethoscope, Target, Trophy, Zap } from "lucide-react";
import { getUser, isOnboardingComplete } from "@/lib/onboarding";
import { DailyActivityPoint, getLevelInfo, getStreak, getTodayActivity, getTotalKP, getWeeklyActivity, getWeeklyActivityByDay, LevelInfo, recordVisit } from "@/lib/progress";
import { CaseAttempt, ClinicalCase, getCaseOfTheDay, getTodayCaseAttempt } from "@/lib/clinicalCases";
import { CURRENT_PATH_EVENT, CurrentPathId, findCurrentPathDef, getCurrentPathId, pathEmoji } from "@/lib/currentPath";
import { findSubject, getLessonStatus } from "@/lib/mcatPath";
import { getMcatReadiness, McatReadiness } from "@/lib/mcatConcepts";
import { PRACTICE_HISTORY_EVENT } from "@/lib/practiceHistory";
import { ensureShieldSecured, getTodayShieldProgress, ShieldProgress } from "@/lib/studyShield";
import { DailyPlan, getDaysRemaining, getExamConfig, getRealSubjects, getSubjectAccuracy, getTodaysPlan, getWeeklyKPProgress } from "@/lib/studyPlanner";
import { fetchRealLeaderboard, LeaderboardResult } from "@/lib/leaderboardSync";
import { ReferEarnCard } from "@/components/refer-earn-card";
import { SectionTour } from "@/components/product-tour/SectionTour";
import { dashboardTourSteps, getRecommendedLearningHref } from "@/lib/productTour";

const pathRecommendations: Record<CurrentPathId, { label: string; href: string }[]> = {
  "medical-school": [
    { label: "Cardiovascular Physiology", href: "/dashboard/learning-paths/medical-school/physiology" },
    { label: "Pharmacology Review", href: "/dashboard/learning-paths/medical-school/pharmacology" },
    { label: "Clinical Case: Heart Failure", href: "/dashboard/case-of-the-day" }
  ],
  mcat: [
    { label: "Cell Biology", href: "/dashboard/learning-paths/mcat/bio-biochem/biology" },
    { label: "Organic Chemistry", href: "/dashboard/learning-paths/mcat/chem-phys" },
    { label: "CARS Practice", href: "/dashboard/learning-paths/mcat/cars" }
  ],
  nursing: [
    { label: "Clinical Skills", href: "/dashboard/learning-paths/nursing/clinical-skills" },
    { label: "Pharmacology", href: "/dashboard/learning-paths/nursing/pharmacology" },
    { label: "NCLEX Preparation", href: "/dashboard/learning-paths/nursing/nclex-preparation" }
  ],
  dentistry: [{ label: "Browse Learning Paths", href: "/dashboard/learning-paths" }],
  pharmacy: [{ label: "Browse Learning Paths", href: "/dashboard/learning-paths" }],
  "biomedical-sciences": [{ label: "Browse Learning Paths", href: "/dashboard/learning-paths" }],
  other: [{ label: "Browse Learning Paths", href: "/dashboard/learning-paths" }]
};

const difficultyClasses: Record<string, string> = {
  Beginner: "bg-emerald-500/15 text-emerald-300",
  Intermediate: "bg-amber-500/15 text-amber-300",
  Advanced: "bg-rose-500/15 text-rose-300"
};

type FocusArea = { label: string; accuracy: number; tone: "rose" | "amber" | "emerald" };

const toneClasses: Record<string, { bar: string; text: string }> = {
  rose: { bar: "bg-rose-500", text: "text-rose-600" },
  amber: { bar: "bg-amber-400", text: "text-amber-600" },
  emerald: { bar: "bg-emerald-500", text: "text-emerald-600" }
};

function toneForAccuracy(percent: number): FocusArea["tone"] {
  if (percent < 60) return "rose";
  if (percent < 85) return "amber";
  return "emerald";
}

// Real per-subject accuracy from lib/studyPlanner.ts's own signal layer
// (which reads lib/practiceHistory.ts's real quiz/practice attempts)—the
// same weakest-3-subjects-first framing the old sample data used, just
// computed from this student's actual answers instead of hardcoded numbers.
// Subjects with zero real attempts are excluded rather than shown at 0%,
// since "no data" and "0% accuracy" are different, honest things to say.
function getRealFocusAreas(): FocusArea[] {
  return getRealSubjects()
    .map(s => ({ label: s.subjectName, accuracy: getSubjectAccuracy(s).percent }))
    .filter((s): s is { label: string; accuracy: number } => s.accuracy !== null)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map(s => ({ ...s, tone: toneForAccuracy(s.accuracy) }));
}

// Real cross-student leaderboard (lib/leaderboardSync.ts), backed by the
// Supabase profiles.total_kp/current_streak columns every signed-in
// student's browser mirrors up in the background (app/dashboard/(main)/layout.tsx).
// No fabricated classmates: a signed-out visitor only sees their own real
// local KP, and a signed-in student with no one else registered yet just
// sees themselves—both real, honest states, not a sample-data mockup.
function withRank<T>(rows: T[]): (T & { rank: number })[] {
  return rows.map((row, i) => ({ ...row, rank: i + 1 }));
}

const cardClass = "rounded-3xl border border-black/[0.06] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#0d1917] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

type NextLesson = { id: string; title: string; completedCount: number; total: number };

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// "61m" reads worse than "1h 1m" the moment a real study session crosses an
// hour—switches to hours+minutes past 60, drops the minutes half entirely
// on an even hour ("2h" not "2h 0m"), and stays plain minutes below that.
function formatStudyMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

export default function DashboardHomePage() {
  const router = useRouter();
  // The tour's own step content lives in lib/productTour.ts; the "Start
  // Learning →" navigation is attached here since only this page's router
  // can act on it.
  const tourSteps = useMemo(
    () => dashboardTourSteps.map(s => s.isFinish ? { ...s, action: () => router.push(getRecommendedLearningHref()) } : s),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [name, setName] = useState("");
  const [streak, setStreak] = useState(0);
  const [totalKP, setTotalKP] = useState(0);
  const [level, setLevel] = useState<LevelInfo | null>(null);
  const [todaysCase, setTodaysCase] = useState<ClinicalCase | null>(null);
  const [caseAttempt, setCaseAttempt] = useState<CaseAttempt | null>(null);
  const [pathId, setPathId] = useState<CurrentPathId | null>(null);
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
  const [shield, setShield] = useState<ShieldProgress | null>(null);
  const [examDate, setExamDate] = useState<string | null>(null);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [weekMinutes, setWeekMinutes] = useState(0);
  const [weeklyKP, setWeeklyKP] = useState({ earned: 0, target: 0 });
  const [weeklyByDay, setWeeklyByDay] = useState<DailyActivityPoint[]>([]);
  const [readiness, setReadiness] = useState<McatReadiness | null>(null);
  const [todaysPlan, setTodaysPlan] = useState<DailyPlan | null>(null);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);

  function refresh() {
    const kp = getTotalKP();
    setStreak(getStreak());
    setTotalKP(kp);
    setLevel(getLevelInfo(kp));
    setTodaysCase(getCaseOfTheDay());
    setCaseAttempt(getTodayCaseAttempt());
    const currentPath = getCurrentPathId();
    setPathId(currentPath);

    let s = getTodayShieldProgress();
    ensureShieldSecured(s);
    if (s.secured) s = getTodayShieldProgress();
    setShield(s);
    const config = getExamConfig();
    setExamDate(config?.examDate ?? null);
    // Real per-subject accuracy—works regardless of whether a study plan is
    // set up, since it's just this student's actual practice attempts.
    setFocusAreas(getRealFocusAreas());

    // Study Planner command-center stats—every one of these reads a real
    // existing signal (lib/progress.ts activity log, lib/mcatConcepts.ts
    // readiness blend, lib/studyPlanner.ts's own daily plan), nothing new
    // is invented for this card.
    if (config) {
      setTodayMinutes(getTodayActivity().minutes);
      setWeekMinutes(getWeeklyActivity().minutes);
      setWeeklyKP(getWeeklyKPProgress());
      setWeeklyByDay(getWeeklyActivityByDay());
      setReadiness(getMcatReadiness());
      setTodaysPlan(getTodaysPlan());
    }

    const biology = findSubject("bio-biochem", "biology");
    if (biology) {
      const ids = biology.lessons.map(l => l.id);
      const completedCount = ids.filter(id => getLessonStatus(ids, id) === "completed").length;
      const next = biology.lessons.find(l => getLessonStatus(ids, l.id) !== "locked" && getLessonStatus(ids, l.id) !== "completed");
      setNextLesson(next ? { id: next.id, title: next.title, completedCount, total: ids.length } : { id: "", title: "", completedCount, total: ids.length });
    }
  }

  useEffect(() => {
    const user = getUser();
    setName(user?.name?.split(" ")[0] || "there");
    recordVisit();
    refresh();

    function onPathChange() { refresh(); }
    window.addEventListener(CURRENT_PATH_EVENT, onPathChange);
    window.addEventListener(PRACTICE_HISTORY_EVENT, onPathChange);
    return () => {
      window.removeEventListener(CURRENT_PATH_EVENT, onPathChange);
      window.removeEventListener(PRACTICE_HISTORY_EVENT, onPathChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPathDef = findCurrentPathDef(pathId);
  const recommendations = pathId ? pathRecommendations[pathId] : null;

  return <section data-tour="dashboard-main" className="relative bg-[#F8FAFC] py-8 dark:bg-[#070d0c] sm:py-10">
    <div className="absolute inset-x-0 top-0 -z-10 h-[220px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.15),transparent_65%)]" />

    {/* Compact greeting */}
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <span className="eyebrow">YOUR DASHBOARD</span>
        <h1 className="display mt-2 text-[22px] leading-tight text-heading dark:text-white sm:text-2xl">{getGreeting()}, {name} 👋</h1>
      </div>
      {currentPathDef
        ? <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3.5 py-1.5 text-xs font-bold text-heading shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white">{pathId && pathEmoji[pathId]} {currentPathDef.label}</span>
        : <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3.5 py-1.5 text-xs font-bold text-slate-400 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400">Pick a path from the menu above</span>}
    </div>

    {/* Two-column layout: left is the main task stack (Continue Studying →
        Study Planner → Recommended Modules), right is the sidebar stack
        (Daily Case Challenge → Leaderboard → Your Performance). `items-start`
        stops one column's tall card stretching the other column to match. */}
    <div className="mt-6 grid gap-4 lg:grid-cols-3 lg:items-start">
      {/* LEFT: main content stack */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        {/* Continue Studying */}
        <div data-tour="continue-learning" className="relative h-fit overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F8B8D] to-[#0b6467] p-6 text-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:from-[#0d2b29] dark:to-[#050908] dark:shadow-none dark:ring-1 dark:ring-white/5">
          <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/10 blur-3xl dark:bg-teal-500/10" />
          <div className="relative flex flex-col items-start gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white/90">⚡ Continue Studying</span>
            {nextLesson?.id ? <>
              <div>
                <h2 className="display text-2xl">{nextLesson.title}</h2>
                <p className="mt-1.5 text-sm text-white/75">Next lesson · {nextLesson.completedCount} / {nextLesson.total} in Biology</p>
              </div>
              <Link href={`/dashboard/learning-paths/mcat/bio-biochem/biology/${nextLesson.id}`} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0c6c6e] shadow-lg transition hover:-translate-y-0.5 dark:bg-teal-500 dark:text-white dark:hover:bg-teal-400">
                <Play size={13} fill="currentColor" />Resume
              </Link>
            </> : <>
              <div>
                <h2 className="display text-2xl">{currentPathDef ? `Continue ${currentPathDef.label}` : "Choose your learning path"}</h2>
                <p className="mt-1.5 max-w-sm text-sm text-white/75">{currentPathDef ? "Explore your path to pick up where you left off." : "Pick what you're studying from the menu above to get a personalized plan."}</p>
              </div>
              <Link href={currentPathDef ? currentPathDef.href : "/dashboard/learning-paths"} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0c6c6e] shadow-lg transition hover:-translate-y-0.5 dark:bg-teal-500 dark:text-white dark:hover:bg-teal-400">
                <Play size={13} fill="currentColor" />Resume
              </Link>
            </>}
          </div>
        </div>

        {/* Study Planner—real Study Planner data, not a second copy of its
            logic. Blank prompt until a real exam plan is set up. */}
        {examDate === null && <div data-tour="today-study" className={`${cardClass} h-fit p-6 text-center sm:p-8`}>
          <span className="eyebrow justify-center text-[#0F8B8D]">📅 Study Planner</span>
          <h3 className="display mt-3 text-xl text-heading dark:text-white">Set up your study plan.</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">Studium builds a personalized daily KP goal from your exam date, confidence, and real performance.</p>
          <Link href="/dashboard/study-plan" className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0F8B8D] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375]"><Calendar size={15} />Set Up Study Plan</Link>
        </div>}
        {/* Study Planner — the command-center version. Every stat below
            reads a real, already-computed signal (lib/progress.ts's
            activity log, lib/mcatConcepts.ts's readiness blend, or
            lib/studyPlanner.ts's own daily plan)—nothing here is invented
            for this card. */}
        {examDate !== null && shield && (() => {
          const topTask = todaysPlan?.tasks.find(t => !t.done) ?? todaysPlan?.tasks[0] ?? null;
          return <div data-tour="today-study" className={`${cardClass} h-fit p-5 sm:p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="eyebrow text-[#0F8B8D]">📅 Study Planner</span>
              <Link href="/dashboard/study-plan" className="flex cursor-pointer items-center gap-1.5 text-xs font-extrabold text-[#0F8B8D] transition hover:text-[#0c6c6e]">View full plan<ArrowUpRight size={12} /></Link>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 font-bold text-heading dark:text-white"><Target size={14} className="text-[#0F8B8D]" />{getDaysRemaining(examDate)} days to exam</span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${shield.secured ? "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"}`}>{shield.secured ? "Streak secured" : `${shield.kpUntilSecured} KP to go`}</span>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {/* LEFT: today's goal, readiness, and the numbers behind them */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400"><span>Today's Goal</span><span className="text-heading dark:text-white">{shield.currentKP} / {shield.targetKP} KP</span></div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full transition-[width] duration-500 ${shield.secured ? "bg-[#0F8B8D]" : "bg-amber-400"}`} style={{ width: `${shield.percent}%` }} /></div>
                </div>

                {readiness && <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400"><span>Exam Readiness</span><span className="text-heading dark:text-white">{readiness.readinessPercent}%</span></div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${readiness.readinessPercent}%` }} /></div>
                </div>}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-white/5">
                    <p className="flex items-center gap-1 text-base font-extrabold text-heading dark:text-white"><Clock size={13} className="text-slate-400" />{formatStudyMinutes(todayMinutes)}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Study Time Today</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-white/5">
                    <p className="text-base font-extrabold text-heading dark:text-white">{formatStudyMinutes(weekMinutes)}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Study Time This Week</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-white/5">
                    <p className="text-base font-extrabold text-heading dark:text-white">{readiness?.learnPercent ?? 0}%</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Overall Mastery</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-white/5">
                    <p className="text-base font-extrabold text-heading dark:text-white">{weeklyKP.earned} / {weeklyKP.target}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Weekly KP</p>
                  </div>
                </div>

                {weeklyByDay.length > 0 && <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">This Week's Activity</p>
                  <div className="mt-2 flex h-10 items-end gap-1.5">
                    {(() => {
                      const maxKP = Math.max(1, ...weeklyByDay.map(d => d.kp));
                      return weeklyByDay.map(d => <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                        <div className="flex h-7 w-full items-end overflow-hidden rounded bg-slate-100 dark:bg-white/10">
                          <div className={`w-full rounded ${d.isToday ? "bg-[#0F8B8D]" : "bg-teal-200 dark:bg-teal-500/15"}`} style={{ height: `${Math.max(6, Math.round((d.kp / maxKP) * 100))}%` }} />
                        </div>
                        <span className={`text-[9px] font-bold ${d.isToday ? "text-heading dark:text-white" : "text-slate-400"}`}>{d.label}</span>
                      </div>);
                    })()}
                  </div>
                </div>}
              </div>

              {/* RIGHT: today's real recommended session + CTA */}
              <div className="flex flex-col rounded-2xl border border-teal-100 bg-teal-50/50 p-4 dark:border-teal-500/20 dark:bg-teal-500/5">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-700 dark:text-teal-300">Recommended for Today</p>
                {topTask ? <>
                  <p className="mt-2 text-sm font-extrabold text-heading dark:text-white">{topTask.subjectName}</p>
                  <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{topTask.label}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{topTask.priorityReason}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Zap size={11} className="text-teal-600" fill="currentColor" />+{topTask.kp} KP</span>
                    <span className="flex items-center gap-1"><Clock size={11} />~{topTask.estimatedMinutes} min</span>
                  </div>
                  <Link href={topTask.href} className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0F8B8D] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375]"><Play size={12} fill="currentColor" />Start Studying</Link>
                </> : <>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">No pending tasks in today's plan—nice work, or check back after your plan next regenerates.</p>
                  <Link href="/dashboard/study-plan" className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0F8B8D] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375]"><Play size={12} fill="currentColor" />Start Studying</Link>
                </>}
              </div>
            </div>
          </div>;
        })()}

        {/* Recommended Modules—real navigation targets from the current
            learning path's recommendation list (or a real fallback route
            when no path is picked yet). No fabricated per-module stats. */}
        <div className={`${cardClass} h-fit p-5 sm:p-6`}>
          <span className="eyebrow">🧩 Recommended Modules</span>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(recommendations ?? pathRecommendations.other).slice(0, 2).map((item, i) => {
              const Icon = i % 2 === 0 ? Dna : FlaskConical;
              return <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${i % 2 === 0 ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300"}`}><Icon size={16} /></span>
                <p className="mt-2.5 text-sm font-extrabold text-heading dark:text-white">{item.label}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Suggested next step in your path.</p>
                <Link href={item.href} className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-[11px] font-extrabold text-teal-700 transition hover:bg-teal-50 dark:border-teal-500/30 dark:bg-white/5 dark:text-teal-300 dark:hover:bg-teal-500/10">Start Module<ArrowUpRight size={11} /></Link>
              </div>;
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: sidebar stack */}
      <div className="flex flex-col gap-4 lg:col-span-1">
        {/* Daily Case Challenge */}
        {todaysCase && <div className="relative h-fit overflow-hidden rounded-3xl bg-[#0F172A] p-5 text-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]">
          <Stethoscope size={110} className="pointer-events-none absolute -right-6 -top-6 text-white/5" />
          {/* Decorative ECG trace—no real telemetry, purely visual like the stethoscope glyph above. */}
          <svg viewBox="0 0 120 24" className="pointer-events-none absolute bottom-3 right-3 h-6 w-24 text-teal-400/30"><polyline points="0,12 20,12 26,4 32,20 38,12 50,12 56,8 60,16 66,12 120,12" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          <div className="relative">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-teal-300">Daily Case Challenge</span>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-extrabold text-white/80">{todaysCase.category}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${difficultyClasses[todaysCase.difficulty]}`}>{todaysCase.difficulty}</span>
            </div>
            <h3 className="mt-2.5 line-clamp-2 text-sm font-extrabold leading-snug">{todaysCase.title}</h3>
            <Link href="/dashboard/case-of-the-day" className="mt-3 inline-flex cursor-pointer items-center gap-1 text-xs font-extrabold text-teal-300 transition hover:text-teal-200">{caseAttempt ? "Review answer" : "Analyze Case"}<ArrowUpRight size={13} /></Link>
          </div>
        </div>}

        {/* Leaderboard—placed above Your Performance so it's the more
            visible of the two, per the user's explicit ordering request. */}
        <LeaderboardCard name={name} totalKP={totalKP} streak={streak} />

        {/* Your Performance—real level/ring/KP/streak (same source as
            before), plus the same sample per-subject accuracy bars that
            used to live in the old AI Recommendations card. */}
        <div className={`${cardClass} h-fit p-5`}>
          <span className="eyebrow">📈 Your Performance</span>
          <div className="mt-4 flex items-center gap-4">
            <MiniRing percent={shield?.percent ?? 0} size={56} stroke={6} />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Level {level?.level ?? 1}</p>
              <p className="truncate text-sm font-extrabold text-heading dark:text-white">{level?.name ?? "Beginner"}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-white/10">
            <span className="flex items-center gap-1.5 font-bold text-heading dark:text-white"><Zap size={14} className="text-teal-600" fill="currentColor" />{totalKP} pts</span>
            <span className="flex items-center gap-1.5 font-bold text-heading dark:text-white"><Flame size={14} className="text-amber-500" fill="currentColor" />{streak} day{streak === 1 ? "" : "s"}</span>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/10">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Focus Areas</p>
            {focusAreas.length > 0 ? <>
              <div className="mt-1">
                {focusAreas.map(area => <div key={area.label} className="flex items-center gap-3 border-b border-slate-100 py-2.5 last:border-0 last:pb-0 dark:border-white/10">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-heading dark:text-white">{area.label}</span><span className={`text-xs font-extrabold ${toneClasses[area.tone].text}`}>{area.accuracy}%</span></div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full ${toneClasses[area.tone].bar}`} style={{ width: `${area.accuracy}%` }} /></div>
                  </div>
                </div>)}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Your weakest real subjects, by practice accuracy.</p>
            </> : <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Answer a few practice questions and your real weakest subjects will show up here.</p>}
          </div>
        </div>

        <ReferEarnCard />
      </div>
    </div>

    <p className="mt-6 px-1 text-xs leading-relaxed text-slate-400">This is a demo dashboard—no real account or study data lives here yet.</p>
    <SectionTour id="dashboard" steps={tourSteps} enabled={isOnboardingComplete()} />
  </section>;
}

function MiniRing({ percent, size = 58, stroke = 6, label }: { percent: number; size?: number; stroke?: number; label?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);
  return <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-[#e2f5f3] dark:text-white/10" />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#0F8B8D" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
    <span className="absolute text-[11px] font-extrabold text-heading dark:text-white">{label ?? `${percent}%`}</span>
  </div>;
}

const rankMedalClasses: Record<number, string> = {
  1: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  2: "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-300",
  3: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300"
};

function LeaderboardCard({ name, totalKP, streak }: { name: string; totalKP: number; streak: number }) {
  const [result, setResult] = useState<LeaderboardResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchRealLeaderboard(5).then(r => { if (!cancelled) setResult(r); });
    return () => { cancelled = true; };
  }, []);

  // Signed out (or still loading): the only genuinely known row is your own
  // real local KP/streak—no other student's real data is reachable without
  // an account, so that's all that's shown, honestly.
  const rows = withRank(
    result?.signedIn && result.rows.length > 0
      ? result.rows
      : [{ id: "you", name: name || "You", totalKP, streak, isYou: true }]
  );

  const footnote = !result
    ? "Loading real rankings…"
    : !result.signedIn
      ? "Log in to see other real students on the leaderboard."
      : rows.length <= 1
        ? "You're the first one here—invite classmates to join you."
        : "Real student rankings.";

  return <div className={`${cardClass} p-5`}>
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400"><Trophy size={13} className="text-amber-500" />Leaderboard</span>
      <button type="button" className="flex cursor-pointer items-center gap-0.5 text-xs font-bold text-slate-400 transition hover:text-heading dark:hover:text-white">Weekly<ChevronRight size={13} /></button>
    </div>

    <div className="mt-3 space-y-1">
      {rows.map(row => <div
        key={row.id}
        className={`flex items-center gap-2.5 rounded-xl px-2 py-2 transition ${row.isYou ? "border border-teal-200/60 bg-teal-50/70 font-semibold text-teal-900 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-100" : ""}`}
      >
        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${rankMedalClasses[row.rank] ?? "bg-slate-100 text-slate-400 dark:bg-white/10 dark:text-slate-500"}`}>
          {row.rank <= 3 ? <Medal size={12} /> : row.rank}
        </span>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${row.isYou ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>
          {row.name.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-sm ${row.isYou ? "font-extrabold text-teal-900 dark:text-teal-100" : "font-bold text-heading dark:text-white"}`}>{row.name}{row.isYou && <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-teal-500">You</span>}</span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400"><Flame size={11} className="text-amber-500" fill="currentColor" />{row.streak}d</span>
        </span>
        <span className={`shrink-0 text-xs font-extrabold ${row.isYou ? "text-teal-700 dark:text-teal-300" : "text-slate-500 dark:text-slate-400"}`}>{row.totalKP.toLocaleString()} KP</span>
      </div>)}
    </div>
    <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-400 dark:border-white/10">{footnote}</p>
  </div>;
}
