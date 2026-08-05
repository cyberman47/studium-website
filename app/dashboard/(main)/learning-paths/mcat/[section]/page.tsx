"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui";
import { findSection, getSubjectProgress, SubjectProgress } from "@/lib/mcatPath";

const tileColors = [
  "bg-teal-100 text-teal-700", "bg-violet-100 text-violet-600", "bg-pink-100 text-pink-600", "bg-amber-100 text-amber-600",
  "bg-sky-100 text-sky-600", "bg-indigo-100 text-indigo-600", "bg-emerald-100 text-emerald-600", "bg-red-100 text-red-600"
];

export default function MCATSectionPage({ params }: { params: { section: string } }) {
  const section = findSection(params.section);
  const [progress, setProgress] = useState<Record<string, SubjectProgress>>({});

  useEffect(() => {
    if (!section) return;
    const next: Record<string, SubjectProgress> = {};
    for (const subject of section.subjects) next[subject.id] = getSubjectProgress(subject.lessons.map(l => l.id));
    setProgress(next);
  }, [section]);

  if (!section) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Section not found.</p>
      <Link href="/dashboard/learning-paths/mcat" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back to MCAT path</Link>
    </section>;
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/learning-paths/mcat" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600">← Back to MCAT path</Link>
    <span className="eyebrow"><Sparkles size={13} />MCAT</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{section.shortTitle}.</h1>
    <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">{section.title}</p>

    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {section.subjects.map((subject, i) => {
        const p = progress[subject.id];
        const hasContent = subject.lessons.length > 0;
        const content = <>
          <div className="flex items-start justify-between gap-3">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tileColors[i % tileColors.length]}`}><BookOpen size={19} /></span>
            {hasContent && <ChevronRight size={18} className="mt-2 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500" />}
          </div>
          <h2 className="mt-4 text-base font-extrabold tracking-tight text-ink">{subject.name}</h2>
          {hasContent
            ? <>
              <p className="mt-1 text-xs font-bold text-slate-500">{p?.completed ?? 0} / {p?.total ?? 0} lessons · {p?.percent ?? 0}%</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${p?.percent ?? 0}%` }} /></div>
            </>
            : <p className="mt-1 text-xs font-bold text-slate-400">Coming soon</p>}
        </>;
        return hasContent
          ? <Reveal key={subject.id} delay={i * 0.03}><Link href={`/dashboard/learning-paths/mcat/${section.id}/${subject.id}`} className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">{content}</Link></Reveal>
          : <Reveal key={subject.id} delay={i * 0.03}><div className="flex h-full flex-col rounded-3xl border border-slate-100 bg-slate-50 p-5 opacity-70">{content}</div></Reveal>;
      })}
    </div>
  </section>;
}
