"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Calendar, ChevronRight, Flame, HelpCircle, Layers, Play, Stethoscope, Target, Zap } from "lucide-react";
import { getUser } from "@/lib/onboarding";
import { getLevelInfo, getStreak, getTotalKP, LevelInfo, recordVisit } from "@/lib/progress";
import { CaseAttempt, ClinicalCase, getCaseOfTheDay, getTodayCaseAttempt } from "@/lib/clinicalCases";
import { CURRENT_PATH_EVENT, CurrentPathId, findCurrentPathDef, getCurrentPathId, pathEmoji } from "@/lib/currentPath";
import { findSubject, getLessonStatus } from "@/lib/mcatPath";
import { getAllMcatPracticeQuestions, getUnusedMcatPracticeQuestions } from "@/lib/mcatConcepts";
import { getAllLibraryCards, isCardDue } from "@/lib/flashcardLibrary";
import { getTerminologyStats, TerminologyStats } from "@/lib/terminology";
import { ensureShieldSecured, getTodayShieldProgress, ShieldProgress } from "@/lib/studyShield";
import { getDaysRemaining, getExamConfig } from "@/lib/studyPlanner";

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

const weakAreas = [
  { label: "Renal System", accuracy: 48, tone: "rose" },
  { label: "Immunology", accuracy: 71, tone: "amber" },
  { label: "Anatomy", accuracy: 89, tone: "emerald" }
] as const;

const toneClasses: Record<string, { bar: string; text: string }> = {
  rose: { bar: "bg-rose-500", text: "text-rose-600" },
  amber: { bar: "bg-amber-400", text: "text-amber-600" },
  emerald: { bar: "bg-emerald-500", text: "text-emerald-600" }
};

const cardClass = "rounded-3xl border border-black/[0.06] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

type NextLesson = { id: string; title: string; completedCount: number; total: number };

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHomePage() {
  const [name, setName] = useState("");
  const [streak, setStreak] = useState(0);
  const [totalKP, setTotalKP] = useState(0);
  const [level, setLevel] = useState<LevelInfo | null>(null);
  const [todaysCase, setTodaysCase] = useState<ClinicalCase | null>(null);
  const [caseAttempt, setCaseAttempt] = useState<CaseAttempt | null>(null);
  const [pathId, setPathId] = useState<CurrentPathId | null>(null);
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
  const [term, setTerm] = useState<TerminologyStats | null>(null);
  const [shield, setShield] = useState<ShieldProgress | null>(null);
  const [examDate, setExamDate] = useState<string | null>(null);
  const [dueCards, setDueCards] = useState(0);
  const [unusedQuizzes, setUnusedQuizzes] = useState(0);

  function refresh() {
    const kp = getTotalKP();
    setStreak(getStreak());
    setTotalKP(kp);
    setLevel(getLevelInfo(kp));
    setTodaysCase(getCaseOfTheDay());
    setCaseAttempt(getTodayCaseAttempt());
    const currentPath = getCurrentPathId();
    setPathId(currentPath);
    setTerm(getTerminologyStats());

    let s = getTodayShieldProgress();
    ensureShieldSecured(s);
    if (s.secured) s = getTodayShieldProgress();
    setShield(s);
    setExamDate(getExamConfig()?.examDate ?? null);
    setDueCards(getAllLibraryCards().filter(c => isCardDue(c.id)).length);
    setUnusedQuizzes(getUnusedMcatPracticeQuestions(getAllMcatPracticeQuestions()).length);

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
    return () => window.removeEventListener(CURRENT_PATH_EVENT, onPathChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPathDef = findCurrentPathDef(pathId);
  const recommendations = pathId ? pathRecommendations[pathId] : null;
  const lessonsCompleted = nextLesson?.completedCount ?? 0;

  return <section className="relative bg-[#F8FAFC] py-8 sm:py-10">
    <div className="absolute inset-x-0 top-0 -z-10 h-[220px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />

    {/* Compact greeting */}
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <span className="eyebrow">YOUR DASHBOARD</span>
        <h1 className="display mt-2 text-[22px] leading-tight sm:text-2xl">{getGreeting()}, {name} 👋</h1>
      </div>
      {currentPathDef
        ? <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3.5 py-1.5 text-xs font-bold text-ink shadow-sm">{pathId && pathEmoji[pathId]} {currentPathDef.label}</span>
        : <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3.5 py-1.5 text-xs font-bold text-slate-400 shadow-sm">Pick a path from the menu above</span>}
    </div>

    <div className="mt-6 space-y-6">
      {/* Top row: Continue Studying (50%) · Progress (25%) · Daily Case (25%) */}
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F8B8D] to-[#0b6467] p-6 text-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] lg:col-span-2">
          <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white/90">⚡ Continue Studying</span>
            {nextLesson?.id ? <>
              <h2 className="display mt-4 text-2xl">{nextLesson.title}</h2>
              <p className="mt-1.5 text-sm text-white/75">Next lesson · {nextLesson.completedCount} / {nextLesson.total} in Biology</p>
              <Link href={`/dashboard/learning-paths/mcat/bio-biochem/biology/${nextLesson.id}`} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0c6c6e] shadow-lg transition hover:-translate-y-0.5">
                <Play size={13} fill="currentColor" />Resume
              </Link>
            </> : <>
              <h2 className="display mt-4 text-2xl">{currentPathDef ? `Continue ${currentPathDef.label}` : "Choose your learning path"}</h2>
              <p className="mt-1.5 max-w-sm text-sm text-white/75">{currentPathDef ? "Explore your path to pick up where you left off." : "Pick what you're studying from the menu above to get a personalized plan."}</p>
              <Link href={currentPathDef ? currentPathDef.href : "/dashboard/learning-paths"} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0c6c6e] shadow-lg transition hover:-translate-y-0.5">
                <Play size={13} fill="currentColor" />Resume
              </Link>
            </>}
          </div>
        </div>

        <div className={`${cardClass} p-5 lg:col-span-1`}>
          <span className="eyebrow">🏆 Progress</span>
          <div className="mt-4 flex items-center gap-4">
            <MiniRing percent={shield?.percent ?? 0} size={58} stroke={6} />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Level {level?.level ?? 1}</p>
              <p className="truncate text-sm font-extrabold text-ink">{level?.name ?? "Beginner"}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
            <span className="flex items-center gap-1.5 font-bold text-ink"><Zap size={14} className="text-teal-600" fill="currentColor" />{totalKP} pts</span>
            <span className="flex items-center gap-1.5 font-bold text-ink"><Flame size={14} className="text-amber-500" fill="currentColor" />{streak} day{streak === 1 ? "" : "s"}</span>
          </div>
        </div>

        {todaysCase && <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-5 text-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] lg:col-span-1">
          <Stethoscope size={110} className="pointer-events-none absolute -right-6 -top-6 text-white/5" />
          <div className="relative">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-teal-300">Daily Clinical Case</span>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-extrabold text-white/80">{todaysCase.category}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${difficultyClasses[todaysCase.difficulty]}`}>{todaysCase.difficulty}</span>
            </div>
            <h3 className="mt-2.5 line-clamp-2 text-sm font-extrabold leading-snug">{todaysCase.title}</h3>
            <Link href="/dashboard/case-of-the-day" className="mt-3 inline-flex cursor-pointer items-center gap-1 text-xs font-extrabold text-teal-300 transition hover:text-teal-200">{caseAttempt ? "Review answer" : "Open case"}<ArrowUpRight size={13} /></Link>
          </div>
        </div>}
      </div>

      {/* Study Planner summary—real Study Planner data, not a second copy
          of its logic. Blank prompt until a real exam plan is set up. */}
      {examDate === null && <div className={`${cardClass} p-6 text-center sm:p-8`}>
        <span className="eyebrow justify-center text-[#0F8B8D]">📅 Study Planner</span>
        <h3 className="display mt-3 text-xl">Set up your study plan.</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">Studium builds a personalized daily KP goal from your exam date, confidence, and real performance.</p>
        <Link href="/dashboard/study-plan" className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0F8B8D] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375]"><Calendar size={15} />Set Up Study Plan</Link>
      </div>}
      {examDate !== null && shield && <Link href="/dashboard/study-plan" className={`${cardClass} block cursor-pointer p-5 transition hover:-translate-y-0.5 hover:shadow-lift sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="eyebrow text-[#0F8B8D]">📅 Study Planner</span>
          <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#0F8B8D]">View full plan<ArrowUpRight size={12} /></span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5 font-bold text-ink"><Target size={14} className="text-[#0F8B8D]" />{getDaysRemaining(examDate)} days to exam</span>
          <span className="flex items-center gap-1.5 font-bold text-ink">{shield.currentKP} / {shield.targetKP} KP today</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${shield.secured ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>{shield.secured ? "Streak secured" : `${shield.kpUntilSecured} KP to go`}</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-[width] duration-500 ${shield.secured ? "bg-[#0F8B8D]" : "bg-amber-400"}`} style={{ width: `${shield.percent}%` }} /></div>
      </Link>}

      {/* Secondary grid: AI Recommendations · Upcoming Reviews */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={`${cardClass} p-5 sm:p-6`}>
          <span className="eyebrow">🎯 AI Recommendations</span>
          {recommendations && <div className="mt-4 flex flex-wrap gap-2">
            {recommendations.map(item => <Link key={item.label} href={item.href} className="cursor-pointer rounded-full bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-100">{item.label}</Link>)}
          </div>}

          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">Focus Areas</p>
          <div className="mt-1">
            {weakAreas.map(area => <div key={area.label} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-ink">{area.label}</span><span className={`text-xs font-extrabold ${toneClasses[area.tone].text}`}>{area.accuracy}%</span></div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${toneClasses[area.tone].bar}`} style={{ width: `${area.accuracy}%` }} /></div>
              </div>
              <Link href="/dashboard/terminology" className="shrink-0 cursor-pointer rounded-full bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100">{area.accuracy >= 85 ? "Review" : "Practice"}</Link>
            </div>)}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Focus areas use sample accuracy data—per-topic performance tracking isn't wired up yet.</p>
        </div>

        <div className={`${cardClass} p-5 sm:p-6`}>
          <span className="eyebrow">⏰ Upcoming Reviews</span>
          <div className="mt-4 divide-y divide-slate-100">
            <Link href={term && term.dueForReview > 0 ? "/dashboard/terminology/review" : "/dashboard/terminology"} className="flex cursor-pointer items-center gap-3.5 py-3 transition hover:opacity-80">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-700 text-sm">🔤</span>
              <div className="min-w-0 flex-1"><p className="text-sm font-bold text-ink">Terminology</p><p className="text-xs text-slate-500">{term ? (term.dueForReview > 0 ? `${term.dueForReview} term${term.dueForReview === 1 ? "" : "s"} due` : `${Math.max(0, term.dailyGoal - term.todayCount)} new term${Math.max(0, term.dailyGoal - term.todayCount) === 1 ? "" : "s"} to learn`) : "—"}</p></div>
              <ChevronRight size={15} className="shrink-0 text-slate-300" />
            </Link>
            <div className="flex items-center gap-3.5 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600"><Layers size={15} /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-bold text-ink">Flashcards</p><p className="text-xs text-slate-500">{dueCards} card{dueCards === 1 ? "" : "s"} due</p></div>
              <span className="shrink-0 text-[11px] font-bold text-slate-400">In today's plan</span>
            </div>
            <div className="flex items-center gap-3.5 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600"><HelpCircle size={15} /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-bold text-ink">Quizzes</p><p className="text-xs text-slate-500">{unusedQuizzes} unused question{unusedQuizzes === 1 ? "" : "s"}</p></div>
              <span className="shrink-0 text-[11px] font-bold text-slate-400">In today's plan</span>
            </div>
          </div>
          <Link href="/dashboard/progress" className="mt-4 flex items-center justify-center gap-2 rounded-full border border-slate-200 py-2.5 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]"><BookOpen size={13} />View Full Progress</Link>
        </div>
      </div>

      <p className="px-1 text-xs leading-relaxed text-slate-400">This is a demo dashboard—no real account or study data lives here yet.</p>
    </div>
  </section>;
}

function MiniRing({ percent, size = 58, stroke = 6 }: { percent: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);
  return <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2f5f3" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#0F8B8D" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
    <span className="absolute text-[11px] font-extrabold text-ink">{percent}%</span>
  </div>;
}
