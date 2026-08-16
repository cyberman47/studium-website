"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award, ArrowUpRight, Bone, ClipboardCheck, Flame, GraduationCap, HeartHandshake, Map, Pill, Play, Sparkles, Stethoscope, Zap
} from "lucide-react";
import { CurrentPathId, findCurrentPathDef, getCurrentPathId, hasRealCurriculum, pathEmoji, pathRecommendations, CURRENT_PATH_EVENT } from "@/lib/currentPath";
import { findSubject, getLessonStatus, lessonContentMap, mcatSections } from "@/lib/mcatPath";
import { medicalSchoolTopics } from "@/lib/medicalSchoolPath";
import { nursingTopics } from "@/lib/nursingPath";
import { anatomySections } from "@/lib/anatomyPath";
import { pharmacologyTopics } from "@/lib/pharmacologyPath";
import { usmleTopics } from "@/lib/usmlePath";
import { clinicalCases } from "@/lib/clinicalCases";
import { getStreak, getTotalKP, getLevelInfo } from "@/lib/progress";
import { getTerminologyStats } from "@/lib/terminology";
import { SectionTour } from "@/components/product-tour/SectionTour";
import { learningPathsTourSteps } from "@/lib/productTour";

type NextLesson = { id: string; title: string; minutes: number; completedCount: number; total: number };

// Real per-lesson progress only exists for MCAT → Biology today (see
// lib/mcatPath.ts)—every other track here is a real, browsable structure
// (topics for the navigation-shell tracks, real case content for Medical
// Cases) with no lesson bodies written yet elsewhere. Meta counts below are
// computed live from the actual data arrays rather than hardcoded, so they
// can never drift out of sync with what's really there.
const mcatLessonCount = mcatSections.reduce((sum, s) => sum + s.subjects.reduce((sSum, sub) => sSum + sub.lessons.length, 0), 0);

// `matches` links a browse card to the real CurrentPathId it corresponds
// to, when one exists—only medical-school/mcat/nursing have a dedicated
// track page today (see lib/currentPath.ts's currentPathOptions hrefs), so
// Dentistry/Pharmacy/Biomedical Sciences/Other honestly have nothing here
// to feature yet rather than a card pretending to be theirs.
const tracks: { name: string; icon: typeof GraduationCap; color: string; href: string; meta: string; matches: CurrentPathId | null }[] = [
  { name: "Medical School", icon: GraduationCap, color: "bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700", href: "/dashboard/learning-paths/medical-school", meta: `${medicalSchoolTopics.length} Topics`, matches: "medical-school" },
  { name: "MCAT", icon: ClipboardCheck, color: "bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600", href: "/dashboard/learning-paths/mcat", meta: `${mcatSections.length} Sections · ${mcatLessonCount} Lessons Ready`, matches: "mcat" },
  { name: "Nursing", icon: HeartHandshake, color: "bg-pink-100 dark:bg-pink-500/20 dark:text-pink-300 text-pink-600", href: "/dashboard/learning-paths/nursing", meta: `${nursingTopics.length} Topics`, matches: "nursing" },
  { name: "Anatomy", icon: Bone, color: "bg-red-100 text-red-600", href: "/dashboard/learning-paths/anatomy", meta: `${anatomySections.length} Regions`, matches: null },
  { name: "Pharmacology", icon: Pill, color: "bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300 text-indigo-600", href: "/dashboard/learning-paths/pharmacology", meta: `${pharmacologyTopics.length} Topics`, matches: null },
  // Real, already-built clinical case content (see lib/clinicalCases.ts /
  // the daily case flow at /dashboard/case-of-the-day)—linked here rather
  // than duplicating a second, empty case system.
  { name: "Medical Cases", icon: Stethoscope, color: "bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300 text-rose-600", href: "/dashboard/library/clinical-cases", meta: `${clinicalCases.length} Cases`, matches: null },
  { name: "USMLE", icon: Award, color: "bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-600", href: "/dashboard/learning-paths/usmle", meta: `${usmleTopics.length} Topics`, matches: null }
];

export default function LearningPathsPage() {
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
  const [pathId, setPathId] = useState<CurrentPathId | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalKP, setTotalKP] = useState(0);
  const [termStats, setTermStats] = useState(getTerminologyStats());

  function refresh() {
    const currentPath = getCurrentPathId();
    // Same real-curriculum gate as the Dashboard's Continue card (see
    // lib/currentPath.ts's hasRealCurriculum)—only MCAT has actual lesson
    // progress to resume, so this card never shows an MCAT lesson to a
    // student who isn't even on that track.
    const biology = currentPath && hasRealCurriculum[currentPath] ? findSubject("bio-biochem", "biology") : null;
    if (biology) {
      const ids = biology.lessons.map(l => l.id);
      const completedCount = ids.filter(id => getLessonStatus(ids, id) === "completed").length;
      const next = biology.lessons.find(l => getLessonStatus(ids, l.id) !== "locked" && getLessonStatus(ids, l.id) !== "completed");
      setNextLesson(next ? { id: next.id, title: next.title, minutes: lessonContentMap[next.id]?.estimatedMinutes ?? 20, completedCount, total: ids.length } : null);
    } else {
      setNextLesson(null);
    }
    setPathId(currentPath);
    setStreak(getStreak());
    setTotalKP(getTotalKP());
    setTermStats(getTerminologyStats());
  }

  useEffect(() => {
    refresh();
    function onPathChange() { refresh(); }
    window.addEventListener(CURRENT_PATH_EVENT, onPathChange);
    return () => window.removeEventListener(CURRENT_PATH_EVENT, onPathChange);
  }, []);

  const currentPathDef = findCurrentPathDef(pathId);
  const level = getLevelInfo(totalKP);
  const percent = nextLesson ? Math.round((nextLesson.completedCount / nextLesson.total) * 100) : 0;
  const trackHasCurriculum = pathId ? hasRealCurriculum[pathId] : false;
  // Surfaces the student's actual current track first in Browse Paths (when
  // it has a real card—see tracks[].matches above) instead of a fixed
  // order that ignores the top-bar selector entirely.
  const orderedTracks = pathId ? [...tracks].sort((a, b) => (a.matches === pathId ? -1 : 0) - (b.matches === pathId ? -1 : 0)) : tracks;
  const recommendations = pathId ? pathRecommendations[pathId] : null;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Map size={13} />Learning Paths</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Learning Paths.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">A guided route through what to study next, built around your goals.</p>

    {/* Layout sits inside the shared dashboard shell (same as Library), so its
        outer edges already line up with the header—no separate max-width
        wrapper is introduced here that could drift out of alignment with it. */}
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      {/* Main column (~70%) */}
      <div className="min-w-0 space-y-8">
        {/* Tour anchor lives here, not on the whole <section>—see the same
            note on app/dashboard/(main)/flashcards/page.tsx. */}
        <div data-tour="learning-paths-main">
          <h2 className="text-lg font-extrabold tracking-tight">Continue</h2>
          {/* Ready for more than one card (overflow-x-auto) the moment a second
              track gets real lesson-level progress—today only MCAT → Biology
              does, so a second fabricated "in progress" card isn't shown. */}
          <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
            {nextLesson ? <div className="w-full shrink-0 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600"><ClipboardCheck size={24} /></span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">MCAT · Biology</p>
                    <p className="text-lg font-extrabold text-heading">{percent}% Complete</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1 text-xs font-extrabold text-slate-600">{nextLesson.completedCount} / {nextLesson.total} lessons</span>
              </div>

              <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${percent}%` }} /></div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-white/10 pt-5">
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Next Up</p>
                  <p className="mt-0.5 truncate text-sm font-bold text-heading">{nextLesson.title} — {nextLesson.minutes} min left</p>
                </div>
                <Link href={`/dashboard/learning-paths/mcat/bio-biochem/biology/${nextLesson.id}`} className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">
                  <Play size={13} fill="currentColor" />Resume Path
                </Link>
              </div>
            </div> : <div className="w-full shrink-0 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-7 text-center shadow-soft">
              {trackHasCurriculum ? <>
                <p className="text-sm font-extrabold text-heading">You've completed every Biology lesson—nice work.</p>
                <p className="mt-1 text-xs text-slate-500">Pick another track below to keep going.</p>
              </> : <>
                <p className="text-sm font-extrabold text-heading">{currentPathDef ? `${currentPathDef.label} lesson content is still being written.` : "Pick what you're studying from the menu above."}</p>
                <p className="mt-1 text-xs text-slate-500">{currentPathDef ? "MCAT → Biology and Medical Cases already have real, completable content below." : "Then Studium can tell you exactly where to pick up."}</p>
              </>}
            </div>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Browse Paths</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {orderedTracks.map(track => {
              const isCurrent = track.matches !== null && track.matches === pathId;
              return <Link
                key={track.name}
                href={track.href}
                className={`group relative flex cursor-pointer flex-col items-start rounded-3xl border bg-white dark:bg-[#0d1917] p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift ${isCurrent ? "border-teal-400 dark:border-teal-500/60 ring-1 ring-teal-400/40" : "border-slate-100 dark:border-white/10"}`}
              >
                {isCurrent && <span className="absolute right-3 top-3 rounded-full bg-teal-500 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white">Current</span>}
                <span className={`grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-200 group-hover:scale-105 ${track.color}`}><track.icon size={22} /></span>
                <p className="mt-4 text-sm font-extrabold text-heading">{track.name}</p>
                <p className="mt-1 text-xs font-bold text-slate-400">{track.meta}</p>
              </Link>;
            })}
          </div>
        </div>
      </div>

      {/* Sidebar column (~30%) */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft">
          <h2 className="text-lg font-extrabold tracking-tight">Your Progress</h2>
          {currentPathDef && <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">{pathId && pathEmoji[pathId]} Currently studying {currentPathDef.label}</p>}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 p-3.5 text-center">
              <Flame size={17} className="mx-auto text-amber-600" fill="currentColor" />
              <p className="mt-1.5 text-xl font-extrabold text-heading">{streak}</p>
              <p className="text-[11px] font-bold text-slate-500">Day streak</p>
            </div>
            <div className="rounded-2xl bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 p-3.5 text-center">
              <Zap size={17} className="mx-auto text-teal-700" fill="currentColor" />
              <p className="mt-1.5 text-xl font-extrabold text-heading">{totalKP}</p>
              <p className="text-[11px] font-bold text-slate-500">Knowledge Points</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-100 dark:border-white/10 px-3.5 py-2.5">
            <span className="text-xs font-bold text-slate-500">Level {level.level}</span>
            <span className="text-xs font-extrabold text-heading">{level.name}</span>
          </div>
        </div>

        <Link href="/dashboard/terminology" className="block rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-tight">Terminology Track</h2>
            <ArrowUpRight size={15} className="shrink-0 text-slate-300" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-heading">{termStats.totalLearned}<span className="text-sm font-bold text-slate-400"> terms learned</span></p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500" style={{ width: `${termStats.masteryPercent}%` }} /></div>
          <p className="mt-2 text-xs text-slate-500">{termStats.masteredCount} mastered · {termStats.masteryPercent}% mastery</p>
        </Link>

        {recommendations && recommendations.length > 0 && recommendations[0].label !== "Browse Learning Paths" ? <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600"><Sparkles size={16} /></span>
            <h2 className="text-sm font-extrabold tracking-tight">Recommended For You</h2>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Picked for {currentPathDef?.label}.</p>
          <div className="mt-3 space-y-1.5">
            {recommendations.map(item => <Link key={item.href} href={item.href} className="flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-heading dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
              {item.label}<ArrowUpRight size={13} className="shrink-0 text-slate-300" />
            </Link>)}
          </div>
        </div> : <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 text-center shadow-soft">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600"><Sparkles size={18} /></span>
          <p className="mt-3 text-sm font-extrabold text-heading">Recommended For You</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Personalized track suggestions are coming soon—for now, browse tracks directly on the left.</p>
        </div>}
      </div>
    </div>

    <p className="mt-10 px-1 text-xs leading-relaxed text-slate-400">MCAT → Biology has real, completable lessons with genuine progress tracking, and Medical Cases links to real, solvable clinical cases. Medical School, Nursing, Anatomy, Pharmacology, and USMLE are real, browsable topic structures—lesson content for those is still being written.</p>
    <SectionTour id="learning-paths" steps={learningPathsTourSteps} />
  </section>;
}
