"use client";

import Link from "next/link";
import {
  Baby, Bandage, Brain, Bug, ChevronRight, ClipboardList, Dna, HeartPulse,
  Pill, Siren, Sparkles, Stethoscope, Users
} from "lucide-react";
import { Reveal } from "@/components/ui";
import { nursingTopics } from "@/lib/nursingPath";

const topicIcons: Record<string, typeof Brain> = {
  foundations: Dna,
  "anatomy-physiology": HeartPulse,
  pharmacology: Pill,
  "health-assessment": Stethoscope,
  "medical-surgical": Bug,
  "maternal-child": Baby,
  "mental-health": Brain,
  geriatric: Users,
  "emergency-critical-care": Siren,
  "clinical-skills": Bandage,
  "nclex-preparation": ClipboardList
};

const tileColors = [
  "bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700", "bg-red-100 text-red-600", "bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-600", "bg-sky-100 dark:bg-sky-500/20 dark:text-sky-300 text-sky-600",
  "bg-lime-100 dark:bg-lime-500/20 dark:text-lime-300 text-lime-700", "bg-pink-100 dark:bg-pink-500/20 dark:text-pink-300 text-pink-600", "bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300 text-indigo-600", "bg-slate-200 text-slate-600",
  "bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300 text-rose-600", "bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300 text-emerald-600", "bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600"
];

export default function NursingPathPage() {
  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/learning-paths" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600">← Back to Learning Paths</Link>
    <span className="eyebrow"><Sparkles size={13} />Nursing</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Nursing Learning Path.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">The core nursing program topics, from foundations through NCLEX preparation.</p>

    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {nursingTopics.map((topic, i) => {
        const Icon = topicIcons[topic.id] ?? Stethoscope;
        return <Reveal key={topic.id} delay={i * 0.03}>
          <Link href={`/dashboard/learning-paths/nursing/${topic.id}`} className="group flex h-full flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tileColors[i % tileColors.length]}`}><Icon size={20} /></span>
              <ChevronRight size={18} className="mt-1.5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500" />
            </div>
            <h2 className="mt-4 text-base font-extrabold leading-snug tracking-tight text-heading">{topic.shortTitle}</h2>
            <p className="mt-1 text-xs font-bold text-slate-400">{topic.subjects.length} subjects · Coming soon</p>
          </Link>
        </Reveal>;
      })}
    </div>

    <p className="mt-10 px-1 text-xs leading-relaxed text-slate-400">This is a navigation preview—subjects are real, but lesson content hasn't been written yet. Check back soon.</p>
  </section>;
}
