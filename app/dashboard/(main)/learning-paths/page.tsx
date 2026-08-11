"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award, ArrowUpRight, Bone, ClipboardCheck, Flame, GraduationCap, HeartHandshake, Map, Pill, Play, Sparkles, Stethoscope, Zap
} from "lucide-react";
import { CurrentPathId, findCurrentPathDef, getCurrentPathId, pathEmoji, CURRENT_PATH_EVENT } from "@/lib/currentPath";
import { findSubject, getLessonStatus, lessonContentMap, mcatSections } from "@/lib/mcatPath";
import { medicalSchoolTopics } from "@/lib/medicalSchoolPath";
import { nursingTopics } from "@/lib/nursingPath";
import { anatomySections } from "@/lib/anatomyPath";
import { pharmacologyTopics } from "@/lib/pharmacologyPath";
import { usmleTopics } from "@/lib/usmlePath";
import { clinicalCases } from "@/lib/clinicalCases";
import { getStreak, getTotalKP, getLevelInfo } from "@/lib/progress";
import { getTerminologyStats } from "@/lib/terminology";

type NextLesson = { id: string; title: string; minutes: number; completedCount: number; total: number };

// Real per-lesson progress only exists for MCAT → Biology today (see
// lib/mcatPath.ts)—every other track here is a real, browsable structure
// (topics for the navigation-shell tracks, real case content for Medical
// Cases) with no lesson bodies written yet elsewhere. Meta counts below are
// computed live from the actual data arrays rather than hardcoded, so they
// can never drift out of sync with what's really there.
const mcatLessonCount = mcatSections.reduce((sum, s) => sum + s.subjects.reduce((sSum, sub) => sSum + sub.lessons.length, 0), 0);

const tracks = [
  { name: "Medical School", icon: GraduationCap, color: "bg-teal-100 text-teal-700", href: "/dashboard/learning-paths/medical-school", meta: `${medicalSchoolTopics.length} Topics` },
  { name: "MCAT", icon: ClipboardCheck, color: "bg-violet-100 text-violet-600", href: "/dashboard/learning-paths/mcat", meta: `${mcatSections.length} Sections · ${mcatLessonCount} Lessons Ready` },
  { name: "Nursing", icon: HeartHandshake, color: "bg-pink-100 text-pink-600", href: "/dashboard/learning-paths/nursing", meta: `${nursingTopics.length} Topics` },
  { name: "Anatomy", icon: Bone, color: "bg-red-100 text-red-600", href: "/dashboard/learning-paths/anatomy", meta: `${anatomySections.length} Regions` },
  { name: "Pharmacology", icon: Pill, color: "bg-indigo-100 text-indigo-600", href: "/dashboard/learning-paths/pharmacology", meta: `${pharmacologyTopics.length} Topics` },
  // Real, already-built clinical case content (see lib/clinicalCases.ts /
  // the daily case flow at /dashboard/case-of-the-day)—linked here rather
  // than duplicating a second, empty case system.
  { name: "Medical Cases", icon: Stethoscope, color: "bg-rose-100 text-rose-600", href: "/dashboard/library/clinical-cases", meta: `${clinicalCases.length} Cases` },
  { name: "USMLE", icon: Award, color: "bg-amber-100 text-amber-600", href: "/dashboard/learning-paths/usmle", meta: `${usmleTopics.length} Topics` }
];

export default function LearningPathsPage() {
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
  const [pathId, setPathId] = useState<CurrentPathId | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalKP, setTotalKP] = useState(0);
  const [termStats, setTermStats] = useState(getTerminologyStats());

  function refresh() {
    const biology = findSubject("bio-biochem", "biology");
    if (biology) {
      const ids = biology.lessons.map(l => l.id);
      const completedCount = ids.filter(id => getLessonStatus(ids, id) === "completed").length;
      const next = biology.lessons.find(l => getLessonStatus(ids, l.id) !== "locked" && getLessonStatus(ids, l.id) !== "completed");
      setNextLesson(next ? { id: next.id, title: next.title, minutes: lessonContentMap[next.id]?.estimatedMinutes ?? 20, completedCount, total: ids.length } : null);
    }
    setPathId(getCurrentPathId());
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

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Map size={13} />Learning Paths</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Learning Paths.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">A guided route through what to study next, built around your goals.</p>

    {/* Layout sits inside the shared dashboard shell (same as Library), so its
        outer edges already line up with the header—no separate max-width
        wrapper is introduced here that could drift out of alignment with it. */}
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      {/* Main column (~70%) */}
      <div className="min-w-0 space-y-8">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Continue</h2>
          {/* Ready for more than one card (overflow-x-auto) the moment a second
              track gets real lesson-level progress—today only MCAT → Biology
              does, so a second fabricated "in progress" card isn't shown. */}
          <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
            {nextLesson ? <div className="w-full shrink-0 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-600"><ClipboardCheck size={24} /></span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">MCAT · Biology</p>
                    <p className="text-lg font-extrabold text-ink">{percent}% Complete</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">{nextLesson.completedCount} / {nextLesson.total} lessons</span>
              </div>

              <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${percent}%` }} /></div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Next Up</p>
                  <p className="mt-0.5 truncate text-sm font-bold text-ink">{nextLesson.title} — {nextLesson.minutes} min left</p>
                </div>
                <Link href={`/dashboard/learning-paths/mcat/bio-biochem/biology/${nextLesson.id}`} className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">
                  <Play size={13} fill="currentColor" />Resume Path
                </Link>
              </div>
            </div> : <div className="w-full shrink-0 rounded-3xl border border-dashed border-slate-200 bg-white p-7 text-center shadow-soft">
              <p className="text-sm font-extrabold text-ink">You've completed every Biology lesson—nice work.</p>
              <p className="mt-1 text-xs text-slate-500">Pick another track below to keep going.</p>
            </div>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Browse Paths</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {tracks.map(track => <Link
              key={track.name}
              href={track.href}
              className="group flex cursor-pointer flex-col items-start rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-200 group-hover:scale-105 ${track.color}`}><track.icon size={22} /></span>
              <p className="mt-4 text-sm font-extrabold text-ink">{track.name}</p>
              <p className="mt-1 text-xs font-bold text-slate-400">{track.meta}</p>
            </Link>)}
          </div>
        </div>
      </div>

      {/* Sidebar column (~30%) */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-extrabold tracking-tight">Your Progress</h2>
          {currentPathDef && <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">{pathId && pathEmoji[pathId]} Currently studying {currentPathDef.label}</p>}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-amber-50 p-3.5 text-center">
              <Flame size={17} className="mx-auto text-amber-600" fill="currentColor" />
              <p className="mt-1.5 text-xl font-extrabold text-ink">{streak}</p>
              <p className="text-[11px] font-bold text-slate-500">Day streak</p>
            </div>
            <div className="rounded-2xl bg-teal-50 p-3.5 text-center">
              <Zap size={17} className="mx-auto text-teal-700" fill="currentColor" />
              <p className="mt-1.5 text-xl font-extrabold text-ink">{totalKP}</p>
              <p className="text-[11px] font-bold text-slate-500">Knowledge Points</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-100 px-3.5 py-2.5">
            <span className="text-xs font-bold text-slate-500">Level {level.level}</span>
            <span className="text-xs font-extrabold text-ink">{level.name}</span>
          </div>
        </div>

        <Link href="/dashboard/terminology" className="block rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-tight">Terminology Track</h2>
            <ArrowUpRight size={15} className="shrink-0 text-slate-300" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-ink">{termStats.totalLearned}<span className="text-sm font-bold text-slate-400"> terms learned</span></p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${termStats.masteryPercent}%` }} /></div>
          <p className="mt-2 text-xs text-slate-500">{termStats.masteredCount} mastered · {termStats.masteryPercent}% mastery</p>
        </Link>

        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-soft">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-600"><Sparkles size={18} /></span>
          <p className="mt-3 text-sm font-extrabold text-ink">Recommended For You</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Personalized track suggestions are coming soon—for now, browse tracks directly on the left.</p>
        </div>
      </div>
    </div>

    <p className="mt-10 px-1 text-xs leading-relaxed text-slate-400">MCAT → Biology has real, completable lessons with genuine progress tracking, and Medical Cases links to real, solvable clinical cases. Medical School, Nursing, Anatomy, Pharmacology, and USMLE are real, browsable topic structures—lesson content for those is still being written.</p>
  </section>;
}
