"use client";

import { useState } from "react";
import {
  ArrowUpRight, Bone, Brain, ClipboardCheck, FlaskConical, GraduationCap,
  HeartHandshake, HeartPulse, Map, Pill, Search, Smile, Sparkles
} from "lucide-react";
import { inputClass } from "@/components/ui";

const categories = [
  { name: "Medical School", icon: GraduationCap, color: "bg-teal-100 text-teal-700" },
  { name: "MCAT", icon: ClipboardCheck, color: "bg-violet-100 text-violet-600" },
  { name: "Nursing", icon: HeartHandshake, color: "bg-pink-100 text-pink-600" },
  { name: "Dentistry", icon: Smile, color: "bg-sky-100 text-sky-600" },
  { name: "Pharmacy", icon: Pill, color: "bg-amber-100 text-amber-600" },
  { name: "Neuroscience", icon: Brain, color: "bg-indigo-100 text-indigo-600" },
  { name: "Biochemistry", icon: FlaskConical, color: "bg-emerald-100 text-emerald-600" },
  { name: "Anatomy", icon: Bone, color: "bg-red-100 text-red-600" }
];

export default function LearningPathsPage() {
  const [query, setQuery] = useState("");
  const filtered = categories.filter(c => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Map size={13} />Learning Paths</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Learning Paths.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">A guided route through what to study next, built around your goals.</p>

    <div className="relative mt-8 max-w-xl">
      <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." className={`${inputClass} pl-11`} />
    </div>

    <div className="mt-10">
      <h2 className="text-lg font-extrabold tracking-tight">Continue</h2>
      <div className="mt-4 max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600"><HeartPulse size={24} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-extrabold text-ink">Human Physiology</p>
            <p className="text-xs text-slate-500">62% complete</p>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[62%] rounded-full bg-teal-500" /></div>
        <a href="#" className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Continue<ArrowUpRight size={15} /></a>
      </div>
    </div>

    <div className="my-10 h-px w-full bg-slate-100" />

    <div>
      <h2 className="text-lg font-extrabold tracking-tight">Browse</h2>
      {filtered.length > 0
        ? <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map(cat => <a key={cat.name} href="#" className="group flex cursor-pointer flex-col items-center gap-3 rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl transition group-hover:scale-105 ${cat.color}`}><cat.icon size={22} /></span>
            <p className="text-sm font-extrabold text-ink">{cat.name}</p>
          </a>)}
        </div>
        : <p className="mt-6 text-sm text-slate-500">No paths match "{query}".</p>}
    </div>

    <p className="mt-10 px-1 text-xs leading-relaxed text-slate-400">This is a demo—learning paths aren't built out with real lessons yet, so "Continue" and the browse categories don't lead anywhere just yet.</p>
  </section>;
}
