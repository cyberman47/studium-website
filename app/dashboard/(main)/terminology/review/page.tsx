"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, PartyPopper, RotateCcw, Sparkles } from "lucide-react";
import { getLevelInfo } from "@/lib/progress";
import { Term, getDueTerms, Rating, reviewTerm } from "@/lib/terminology";

export default function TerminologyReviewPage() {
  const [queue, setQueue] = useState<Term[] | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [floatingKP, setFloatingKP] = useState<number | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);

  useEffect(() => { setQueue(getDueTerms()); }, []);

  function rate(rating: Rating) {
    const current = queue?.[index];
    if (!current) return;
    const result = reviewTerm(current.id, rating);
    setReviewedCount(c => c + 1);
    if (result?.awarded) {
      setFloatingKP(result.kpAwarded);
      setTimeout(() => setFloatingKP(null), 1400);
      if (result.leveledUp) {
        const info = getLevelInfo(result.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
    setFlipped(false);
    setIndex(i => i + 1);
  }

  if (queue === null) return null;

  const current = queue[index];
  const done = index >= queue.length;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/terminology" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Terminology</Link>
    <span className="eyebrow"><Sparkles size={13} />Review Mode</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Review your terms.</h1>

    <div className="relative mt-8 max-w-lg">
      {queue.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 text-teal-700"><RotateCcw size={26} /></span>
        <p className="mt-4 text-base font-extrabold text-ink">Nothing due for review right now.</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Save some terms from the categories page, and they'll show up here when they're due.</p>
        <Link href="/dashboard/terminology" className="mt-5 inline-block cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Browse categories</Link>
      </div>
        : done ? <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-soft">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 text-teal-700"><PartyPopper size={26} /></span>
          <p className="mt-4 text-base font-extrabold text-ink">Review complete!</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">You reviewed {reviewedCount} term{reviewedCount === 1 ? "" : "s"}.</p>
          <Link href="/dashboard/terminology" className="mt-5 inline-block cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Back to Terminology</Link>
        </div>
          : <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
            <p className="text-xs font-bold text-slate-400">{index + 1} / {queue.length}</p>
            <div className="mt-4" style={{ perspective: 1200 }}>
              <motion.div
                onClick={() => setFlipped(f => !f)}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.45 }}
                className="relative h-48 w-full cursor-pointer select-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-[#f9fcfc] p-6 text-center" style={{ backfaceVisibility: "hidden" }}>
                  <p className="text-lg font-extrabold text-ink">What does "{current.name}" mean?</p>
                  <p className="mt-3 text-xs font-bold text-slate-400">Click to reveal</p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <p className="text-sm leading-relaxed text-teal-900">{current.definition}</p>
                </div>
              </motion.div>
            </div>

            {flipped && <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => rate("hard")} className="flex-1 cursor-pointer rounded-full border border-rose-200 bg-rose-50 py-2.5 text-xs font-extrabold text-rose-700 transition hover:bg-rose-100">Hard</button>
              <button type="button" onClick={() => rate("medium")} className="flex-1 cursor-pointer rounded-full border border-amber-200 bg-amber-50 py-2.5 text-xs font-extrabold text-amber-700 transition hover:bg-amber-100">Medium</button>
              <button type="button" onClick={() => rate("easy")} className="flex-1 cursor-pointer rounded-full border border-teal-200 bg-teal-50 py-2.5 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100">Easy</button>
            </div>}
          </div>}

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
