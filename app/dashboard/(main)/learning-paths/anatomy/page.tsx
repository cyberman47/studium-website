"use client";

import Link from "next/link";
import {
  Bone, Brain, ChevronRight, Compass, Footprints, Hand, HeartPulse,
  Shield, Smile, Sparkles, Utensils
} from "lucide-react";
import { Reveal } from "@/components/ui";
import { anatomySections } from "@/lib/anatomyPath";

const sectionIcons: Record<string, typeof Bone> = {
  terminology: Compass,
  "upper-limb": Hand,
  "lower-limb": Footprints,
  "spine-back": Bone,
  thorax: HeartPulse,
  abdomen: Utensils,
  "pelvic-girdle-floor": Shield,
  "head-neck": Smile,
  neuroanatomy: Brain
};

const tileColors = [
  "bg-slate-200 text-slate-600", "bg-indigo-100 text-indigo-600", "bg-emerald-100 text-emerald-600", "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600", "bg-lime-100 text-lime-700", "bg-sky-100 text-sky-600", "bg-pink-100 text-pink-600",
  "bg-violet-100 text-violet-600"
];

export default function AnatomyPathPage() {
  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/learning-paths" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600">← Back to Learning Paths</Link>
    <span className="eyebrow"><Sparkles size={13} />Anatomy</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Anatomy Learning Path.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Organized as a regional gross-anatomy course, from terminology through neuroanatomy.</p>

    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {anatomySections.map((section, i) => {
        const Icon = sectionIcons[section.id] ?? Bone;
        return <Reveal key={section.id} delay={i * 0.03}>
          <Link href={`/dashboard/learning-paths/anatomy/${section.id}`} className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tileColors[i % tileColors.length]}`}><Icon size={20} /></span>
              <ChevronRight size={18} className="mt-1.5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500" />
            </div>
            <h2 className="mt-4 text-base font-extrabold leading-snug tracking-tight text-ink">{section.shortTitle}</h2>
            <p className="mt-1 text-xs font-bold text-slate-400">{section.subjects.length} subjects · Coming soon</p>
          </Link>
        </Reveal>;
      })}
    </div>

    <p className="mt-10 px-1 text-xs leading-relaxed text-slate-400">This is a navigation preview—Anatomy's subjects are real, but lesson content hasn't been written yet. Check back soon.</p>
  </section>;
}
