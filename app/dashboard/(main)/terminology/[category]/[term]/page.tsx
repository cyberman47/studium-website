"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bookmark, BookmarkCheck, PartyPopper, Puzzle, Sparkles, Wand2 } from "lucide-react";
import { getLevelInfo } from "@/lib/progress";
import { findTermCategory, getTerm, isTermLearned, learnTerm } from "@/lib/terminology";

export default function TermPage({ params }: { params: { category: string; term: string } }) {
  const category = findTermCategory(params.category);
  const term = getTerm(params.term);

  const [saved, setSaved] = useState(false);
  const [floatingKP, setFloatingKP] = useState<number | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);

  useEffect(() => {
    if (term) setSaved(isTermLearned(term.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.term]);

  if (!category || !term || term.categoryId !== category.id) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Term not found.</p>
      <Link href="/dashboard/terminology" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back to Terminology</Link>
    </section>;
  }

  function handleSave() {
    if (!term) return;
    const wasSaved = saved;
    const result = learnTerm(term.id);
    setSaved(true);
    if (!wasSaved && result?.awarded) {
      setFloatingKP(result.kpAwarded);
      setTimeout(() => setFloatingKP(null), 1400);
      if (result.leveledUp) {
        const info = getLevelInfo(result.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
  }

  const relatedTerms = term.relatedTermIds.map(id => getTerm(id)).filter((t): t is NonNullable<typeof t> => !!t);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href={`/dashboard/terminology/${category.id}`} className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to {category.name}</Link>
    <span className="eyebrow"><Sparkles size={13} />{category.name}</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{term.name}</h1>

    <div className="relative mt-8 max-w-2xl space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Definition</h2>
        <p className="mt-2 text-base leading-relaxed text-ink">{term.definition}</p>

        <h2 className="mt-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Puzzle size={13} />Word Breakdown</h2>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {term.wordBreakdown.map(wp => <span key={wp.part} className="rounded-full border border-slate-200 bg-[#f9fcfc] px-3 py-1.5 text-xs font-bold text-ink">{wp.part} <span className="font-medium text-slate-500">= {wp.meaning}</span></span>)}
        </div>

        {relatedTerms.length > 0 && <>
          <h2 className="mt-6 text-xs font-extrabold uppercase tracking-wide text-slate-500">Related Terms</h2>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {relatedTerms.map(rt => <Link key={rt.id} href={`/dashboard/terminology/${rt.categoryId}/${rt.id}`} className="cursor-pointer rounded-full bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100">{rt.name}</Link>)}
          </div>
        </>}

        <div className="mt-6 rounded-2xl bg-[#f9fcfc] p-4">
          <p className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700"><Wand2 size={13} />AI Explanation</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{term.aiExplanation}</p>
        </div>

        <button type="button" onClick={handleSave} disabled={saved} className="mt-6 flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
          {saved ? <><BookmarkCheck size={16} />Saved to Review</> : <><Bookmark size={16} />Save to Review</>}
        </button>
      </div>

      <AnimatePresence>
        {floatingKP !== null && <motion.span
          initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -24 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
          className="pointer-events-none absolute right-6 top-6 text-sm font-extrabold text-teal-600"
        >+{floatingKP} KP</motion.span>}
      </AnimatePresence>
    </div>

    <AnimatePresence>
      {levelUpInfo && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setLevelUpInfo(null)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-lift"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-600"><PartyPopper size={30} /></span>
          <h2 className="display mt-5 text-2xl">🎉 Level Up!</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Congratulations! You've reached <span className="font-extrabold text-ink">Level {levelUpInfo.level} · {levelUpInfo.name}</span>.</p>
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Awesome!</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}
