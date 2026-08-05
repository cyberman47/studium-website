"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bug, ChevronRight, ClipboardList, Dna, HeartPulse, Layers, Microscope,
  Pill, Puzzle, RotateCcw, Sparkles, Stethoscope, Target
} from "lucide-react";
import { Reveal } from "@/components/ui";
import { getTermsByCategory, termCategories, TerminologyStats, getTerminologyStats } from "@/lib/terminology";

const categoryIcons: Record<string, typeof HeartPulse> = {
  anatomy: HeartPulse,
  biology: Dna,
  microbiology: Bug,
  pharmacology: Pill,
  pathology: Microscope,
  clinical: Stethoscope,
  abbreviations: ClipboardList
};

const tileColors = [
  "bg-red-100 text-red-600", "bg-indigo-100 text-indigo-600", "bg-lime-100 text-lime-700", "bg-amber-100 text-amber-600",
  "bg-slate-200 text-slate-600", "bg-rose-100 text-rose-600", "bg-sky-100 text-sky-600"
];

const defaultStats: TerminologyStats = { totalLearned: 0, masteredCount: 0, dueForReview: 0, masteryPercent: 0, todayCount: 0, dailyGoal: 20 };

export default function TerminologyPage() {
  const [stats, setStats] = useState<TerminologyStats>(defaultStats);

  useEffect(() => { setStats(getTerminologyStats()); }, []);

  const goalPercent = Math.min(100, Math.round((stats.todayCount / stats.dailyGoal) * 100));

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Terminology</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Medical Terminology.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Learn, review, and master academic and medical terms through active recall and spaced repetition.</p>

    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Reveal delay={0}>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Layers size={13} />Total Terms Learned</div>
          <p className="mt-3 text-2xl font-extrabold text-ink">{stats.totalLearned.toLocaleString()}</p>
        </div>
      </Reveal>
      <Reveal delay={0.04}>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><RotateCcw size={13} />Terms Due for Review</div>
          <p className="mt-3 text-2xl font-extrabold text-ink">{stats.dueForReview.toLocaleString()}</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Target size={13} />Mastery</div>
          <p className="mt-3 text-2xl font-extrabold text-ink">{stats.masteryPercent}%</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${stats.masteryPercent}%` }} /></div>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Sparkles size={13} />Today's Goal</div>
          <p className="mt-3 text-2xl font-extrabold text-ink">{stats.todayCount} <span className="text-sm font-bold text-slate-400">/ {stats.dailyGoal} terms</span></p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${goalPercent}%` }} /></div>
        </div>
      </Reveal>
    </div>

    <div className="mt-6 flex flex-wrap gap-3">
      <Link href="/dashboard/terminology/review" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><RotateCcw size={16} />Review Due Terms{stats.dueForReview > 0 && ` (${stats.dueForReview})`}</Link>
      <Link href="/dashboard/terminology/word-builder" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]"><Puzzle size={16} />Word Builder</Link>
    </div>

    <div className="mt-10">
      <h2 className="text-lg font-extrabold tracking-tight">Categories</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {termCategories.map((cat, i) => {
          const Icon = categoryIcons[cat.id] ?? Layers;
          const count = getTermsByCategory(cat.id).length;
          return <Reveal key={cat.id} delay={i * 0.03}>
            <Link href={`/dashboard/terminology/${cat.id}`} className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tileColors[i % tileColors.length]}`}><Icon size={20} /></span>
                <ChevronRight size={18} className="mt-1.5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500" />
              </div>
              <h3 className="mt-4 text-base font-extrabold tracking-tight text-ink">{cat.name}</h3>
              <p className="mt-1 text-xs font-bold text-slate-400">{count > 0 ? `${count} terms` : "Coming soon"}</p>
            </Link>
          </Reveal>;
        })}
      </div>
    </div>
  </section>;
}
