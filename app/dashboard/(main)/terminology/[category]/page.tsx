"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { CheckCircle2, Layers, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui";
import { ExpandedTermPanel } from "@/components/interactive-text";
import { findTermCategory, getTermsByCategory, isTermLearned, isTermMastered } from "@/lib/terminology";

export default function TerminologyCategoryPage({ params }: { params: { category: string } }) {
  const category = findTermCategory(params.category);
  const termList = category ? getTermsByCategory(category.id) : [];
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  // Clicking a term used to navigate to a whole new page—now it opens the
  // same on-page summary popup used everywhere else a term gets clicked
  // (see components/interactive-text.tsx), so browsing stays on this page.
  const [openTermId, setOpenTermId] = useState<string | null>(null);

  useEffect(() => {
    setLearned(new Set(termList.filter(t => isTermLearned(t.id)).map(t => t.id)));
    setMastered(new Set(termList.filter(t => isTermMastered(t.id)).map(t => t.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category]);

  if (!category) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Category not found.</p>
      <Link href="/dashboard/terminology" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back to Terminology</Link>
    </section>;
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/terminology" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600">← Back to Terminology</Link>
    <span className="eyebrow"><Sparkles size={13} />Terminology</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{category.name}.</h1>

    {termList.length === 0
      ? <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-20 text-center shadow-soft">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><Layers size={26} /></span>
        <p className="text-base font-extrabold text-heading">Terms for this category are still being written.</p>
        <p className="max-w-xs text-sm leading-relaxed text-slate-500">Check back soon—Anatomy Terms is fully built out as a preview of what's coming.</p>
      </div>
      : <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {termList.map((term, i) => <Reveal key={term.id} delay={i * 0.03}>
          <button type="button" onClick={() => setOpenTermId(term.id)} className="flex h-full w-full cursor-pointer flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-extrabold tracking-tight text-heading">{term.name}</h2>
              {mastered.has(term.id) ? <span className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-2 py-1 text-[10px] font-extrabold text-teal-700"><CheckCircle2 size={11} />Mastered</span>
                : learned.has(term.id) && <span className="rounded-full bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 px-2 py-1 text-[10px] font-extrabold text-amber-700">Learning</span>}
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{term.definition}</p>
          </button>
        </Reveal>)}
      </div>}

    <AnimatePresence>
      {openTermId && <ExpandedTermPanel initialTermId={openTermId} onClose={() => setOpenTermId(null)} />}
    </AnimatePresence>
  </section>;
}
