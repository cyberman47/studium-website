"use client";

import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui";
import { findNursingTopic } from "@/lib/nursingPath";

const tileColors = [
  "bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700", "bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600", "bg-pink-100 dark:bg-pink-500/20 dark:text-pink-300 text-pink-600", "bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-600",
  "bg-sky-100 dark:bg-sky-500/20 dark:text-sky-300 text-sky-600", "bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300 text-indigo-600", "bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300 text-emerald-600", "bg-red-100 text-red-600"
];

export default function NursingTopicPage({ params }: { params: { topic: string } }) {
  const topic = findNursingTopic(params.topic);

  if (!topic) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Topic not found.</p>
      <Link href="/dashboard/learning-paths/nursing" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back to Nursing path</Link>
    </section>;
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/learning-paths/nursing" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600">← Back to Nursing path</Link>
    <span className="eyebrow"><Sparkles size={13} />Nursing</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{topic.shortTitle}.</h1>
    <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">Lessons for these subjects haven't been written yet—check back soon.</p>

    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topic.subjects.map((subject, i) => <Reveal key={subject.id} delay={i * 0.03}>
        <div className="flex h-full flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 opacity-70">
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tileColors[i % tileColors.length]}`}><BookOpen size={19} /></span>
          <h2 className="mt-4 text-base font-extrabold tracking-tight text-heading">{subject.name}</h2>
          <p className="mt-1 text-xs font-bold text-slate-400">Coming soon</p>
        </div>
      </Reveal>)}
    </div>
  </section>;
}
