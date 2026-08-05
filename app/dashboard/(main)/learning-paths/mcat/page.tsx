"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Atom, BookOpenCheck, ChevronRight, Dna, HeartPulse, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui";
import { getSectionProgress, mcatSections, SubjectProgress } from "@/lib/mcatPath";

const sectionIcons: Record<string, typeof Dna> = {
  "bio-biochem": Dna,
  "chem-phys": Atom,
  "psych-social": HeartPulse,
  cars: BookOpenCheck
};

const sectionColors: Record<string, string> = {
  "bio-biochem": "bg-teal-100 text-teal-700",
  "chem-phys": "bg-violet-100 text-violet-600",
  "psych-social": "bg-pink-100 text-pink-600",
  cars: "bg-amber-100 text-amber-600"
};

export default function MCATPathPage() {
  const [progress, setProgress] = useState<Record<string, SubjectProgress>>({});

  useEffect(() => {
    const next: Record<string, SubjectProgress> = {};
    for (const section of mcatSections) next[section.id] = getSectionProgress(section);
    setProgress(next);
  }, []);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/learning-paths" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600">← Back to Learning Paths</Link>
    <span className="eyebrow"><Sparkles size={13} />MCAT</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">MCAT Learning Path.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">All four official MCAT sections, broken down into subjects and structured lessons.</p>

    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      {mcatSections.map((section, i) => {
        const Icon = sectionIcons[section.id];
        const p = progress[section.id];
        const hasContent = (p?.total ?? 0) > 0;
        return <Reveal key={section.id} delay={i * 0.05}>
          <Link href={`/dashboard/learning-paths/mcat/${section.id}`} className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${sectionColors[section.id]}`}><Icon size={22} /></span>
              <ChevronRight size={18} className="mt-2 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500" />
            </div>
            <h2 className="mt-5 text-lg font-extrabold leading-snug tracking-tight text-ink">{section.shortTitle}</h2>

            {hasContent ? <>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Progress</span>
                <span>{p.percent}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${p.percent}%` }} /></div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{p.completed} / {p.total} lessons complete</span>
                <span>{p.hoursRemaining} hrs left</span>
              </div>
            </> : <p className="mt-4 text-xs font-bold text-slate-400">Subjects coming soon</p>}
          </Link>
        </Reveal>;
      })}
    </div>
  </section>;
}
