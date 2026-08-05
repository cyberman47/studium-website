"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookmarkCheck, Layers, PartyPopper, Sparkles, Type, Wand2 } from "lucide-react";
import { getLevelInfo } from "@/lib/progress";
import { GeneratedFlashcard, sampleDocument, saveFlashcardDeck } from "@/lib/create";
import { getTerm, isTermLearned, learnTerm } from "@/lib/terminology";

const extractedIds = ["myocardial-infarction", "arrhythmia", "atherosclerosis"];

export default function CreateTerminologyPage() {
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [flashcardedIds, setFlashcardedIds] = useState<Set<string>>(new Set());
  const [aiNoticeId, setAiNoticeId] = useState<string | null>(null);
  const [floatingKP, setFloatingKP] = useState<number | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);

  useEffect(() => {
    setLearned(new Set(extractedIds.filter(isTermLearned)));
  }, []);

  const terms = extractedIds.map(id => getTerm(id)).filter((t): t is NonNullable<typeof t> => !!t);

  function handleAddToTerminology(termId: string) {
    const result = learnTerm(termId);
    setLearned(s => new Set(s).add(termId));
    if (result?.awarded) {
      setFloatingKP(result.kpAwarded);
      setTimeout(() => setFloatingKP(null), 1400);
      if (result.leveledUp) {
        const info = getLevelInfo(result.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
  }

  function handleCreateFlashcard(termId: string) {
    const term = getTerm(termId);
    if (!term) return;
    const card: GeneratedFlashcard = { question: `What is ${term.name}?`, answer: term.definition, difficulty: "Medium" };
    saveFlashcardDeck(`${term.name} Flashcard`, [card]);
    setFlashcardedIds(s => new Set(s).add(termId));
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><Type size={13} />Extract Terminology</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Extracted terms.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Important terms found in {sampleDocument.fileName}. These are genuinely part of Studium's Terminology library—adding one for real tracks toward your terminology progress.</p>

    <div className="relative mt-8 max-w-2xl space-y-5">
      {terms.map(term => <div key={term.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Term</p>
        <h2 className="mt-1 text-xl font-extrabold text-ink">{term.name}</h2>
        <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">Definition</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{term.definition}</p>
        <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">Word Breakdown</p>
        <div className="mt-1.5 flex flex-wrap gap-2">{term.wordBreakdown.map(wp => <span key={wp.part} className="rounded-full border border-slate-200 bg-[#f9fcfc] px-3 py-1 text-xs font-bold text-ink">{wp.part} <span className="font-medium text-slate-500">= {wp.meaning}</span></span>)}</div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button type="button" onClick={() => handleAddToTerminology(term.id)} disabled={learned.has(term.id)} className="flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
            {learned.has(term.id) ? <><BookmarkCheck size={13} />Added</> : <><Layers size={13} />Add to Terminology</>}
          </button>
          <button type="button" onClick={() => handleCreateFlashcard(term.id)} disabled={flashcardedIds.has(term.id)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc] disabled:cursor-not-allowed disabled:opacity-60">
            {flashcardedIds.has(term.id) ? "Flashcard created ✓" : "Create Flashcard"}
          </button>
          <button type="button" onClick={() => setAiNoticeId(aiNoticeId === term.id ? null : term.id)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]"><Wand2 size={13} />Ask AI</button>
        </div>
        {aiNoticeId === term.id && <p className="mt-3 rounded-xl bg-[#f9fcfc] p-3 text-xs leading-relaxed text-slate-500">Live AI Q&amp;A isn't connected in this demo yet—but here's the written explanation: "{term.aiExplanation}"</p>}
      </div>)}

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
