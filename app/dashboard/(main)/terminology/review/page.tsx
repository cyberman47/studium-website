"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, RotateCcw } from "lucide-react";
import Link from "next/link";
import { showKnowledgeToast } from "@/lib/kpToast";
import { getLevelInfo } from "@/lib/progress";
import {
  getDueTerms, getTermProgress, restoreTermProgress, reviewTerm, Term, TermProgressEntry
} from "@/lib/terminology";
import { FlashcardFocusMode, FocusCard, FocusRating } from "@/components/flashcard-focus-mode";

function buildHint(term: Term): string | null {
  if (term.wordBreakdown.length > 0) return term.wordBreakdown.map(p => `${p.part} = ${p.meaning}`).join("  ·  ");
  if (term.exampleSentence) return `Used in context: "${term.exampleSentence}"`;
  return null;
}

export default function TerminologyReviewPage() {
  const router = useRouter();
  const [queue, setQueue] = useState<Term[] | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);
  // Snapshot of each term's real Leitner-box state taken right before a
  // rating is applied, so Undo can restore it exactly—not a fake rewind.
  const snapshots = useRef<Map<string, TermProgressEntry | null>>(new Map());

  useEffect(() => { setQueue(getDueTerms()); }, []);

  function handleRate(card: FocusCard, rating: FocusRating) {
    snapshots.current.set(card.id, getTermProgress(card.id));
    const result = reviewTerm(card.id, rating);
    if (result?.awarded) {
      showKnowledgeToast(result.kpAwarded);
      if (result.leveledUp) {
        const info = getLevelInfo(result.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
  }

  function handleUndo(card: FocusCard) {
    const snapshot = snapshots.current.get(card.id) ?? null;
    restoreTermProgress(card.id, snapshot);
  }

  if (queue === null) return null;

  if (queue.length === 0) return <section className="relative py-10 sm:py-14">
    <div className="mx-auto max-w-lg">
      <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-10 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><RotateCcw size={26} /></span>
        <p className="mt-4 text-base font-extrabold text-heading">Nothing due for review right now.</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Save some terms from the categories page, and they'll show up here when they're due.</p>
        <Link href="/dashboard/terminology" className="mt-5 inline-block cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Browse categories</Link>
      </div>
    </div>
  </section>;

  const focusCards: FocusCard[] = queue.map(t => ({
    id: t.id,
    front: `What does "${t.name}" mean?`,
    back: t.definition,
    hint: buildHint(t)
  }));

  return <>
    <FlashcardFocusMode
      deckTitle="Terminology Review"
      cards={focusCards}
      onExit={() => router.push("/dashboard/terminology")}
      onRate={handleRate}
      onUndo={handleUndo}
      tutorContext={{ chatKey: "terminology-review", subjectName: "Terminology" }}
    />

    <AnimatePresence>
      {levelUpInfo && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setLevelUpInfo(null)}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0d1917] p-8 text-center shadow-lift"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-600"><PartyPopper size={30} /></span>
          <h2 className="display mt-5 text-2xl">🎉 Level Up!</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Congratulations! You've reached <span className="font-extrabold text-heading">Level {levelUpInfo.level} · {levelUpInfo.name}</span>.</p>
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Awesome!</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
