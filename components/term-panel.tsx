"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark, BookmarkCheck, Bot, Check, ChevronRight, Layers, ListPlus, PartyPopper, Puzzle, Quote, Wand2, X
} from "lucide-react";
import { ClaimResult, getLevelInfo, logFlashcards } from "@/lib/progress";
import {
  ConfidenceLevel, getTerm, getTermConfidence, getTermViewCount, isTermLearned, learnTerm, queueForReview,
  recordTermView, setTermConfidence, Term
} from "@/lib/terminology";

type TermPanelContextValue = { open: (termId: string) => void };
const TermPanelContext = createContext<TermPanelContextValue | null>(null);

export function useTermPanel(): TermPanelContextValue {
  const ctx = useContext(TermPanelContext);
  if (!ctx) throw new Error("useTermPanel must be used within a TermPanelProvider");
  return ctx;
}

const aiPrompts = [
  { label: "Explain more simply", icon: Wand2 },
  { label: "Give another example", icon: Quote },
  { label: "Why is this important?", icon: Bot },
  { label: "Show related diseases", icon: ChevronRight }
];

const confidenceOptions: { level: ConfidenceLevel; label: string; dot: string; active: string }[] = [
  { level: "know-well", label: "I Know This Well", dot: "bg-emerald-500", active: "border-emerald-500 bg-emerald-50 text-emerald-700" },
  { level: "somewhat", label: "Somewhat Familiar", dot: "bg-amber-500", active: "border-amber-500 bg-amber-50 text-amber-700" },
  { level: "dont-know", label: "I Don't Know This Yet", dot: "bg-rose-500", active: "border-rose-500 bg-rose-50 text-rose-700" }
];

export function TermPanelProvider({ children }: { children: React.ReactNode }) {
  const [termId, setTermId] = useState<string | null>(null);

  return <TermPanelContext.Provider value={{ open: id => setTermId(id) }}>
    {children}
    <TermPanel termId={termId} onClose={() => setTermId(null)} onNavigate={id => setTermId(id)} />
  </TermPanelContext.Provider>;
}

function TermPanel({ termId, onClose, onNavigate }: { termId: string | null; onClose: () => void; onNavigate: (id: string) => void }) {
  const term = termId ? getTerm(termId) : undefined;
  const [saved, setSaved] = useState(false);
  const [queued, setQueued] = useState(false);
  const [flashcardMade, setFlashcardMade] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [floatingKP, setFloatingKP] = useState<number | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);

  useEffect(() => {
    if (!term) return;
    recordTermView(term.id);
    setSaved(isTermLearned(term.id));
    setQueued(false);
    setFlashcardMade(false);
    setConfidence(getTermConfidence(term.id));
    setViewCount(getTermViewCount(term.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termId]);

  function handleResult(result: ClaimResult | null) {
    if (result?.awarded) {
      setFloatingKP(result.kpAwarded);
      setTimeout(() => setFloatingKP(null), 1400);
      if (result.leveledUp) {
        const info = getLevelInfo(result.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
  }

  function handleSave() {
    if (!term || saved) return;
    setSaved(true);
    handleResult(learnTerm(term.id));
  }

  function handleFlashcard() {
    if (!term || flashcardMade) return;
    setFlashcardMade(true);
    handleResult(logFlashcards(1));
  }

  function handleQueue() {
    if (!term || queued) return;
    queueForReview(term.id);
    setQueued(true);
  }

  function handleConfidence(level: ConfidenceLevel) {
    if (!term) return;
    setConfidence(level);
    handleResult(setTermConfidence(term.id, level));
  }

  const relatedTerms = term ? term.relatedTermIds.map(id => getTerm(id)).filter((t): t is Term => !!t) : [];

  return <>
    <AnimatePresence>
      {term && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]"
      />}
    </AnimatePresence>
    <AnimatePresence>
      {term && <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-hidden border-l border-black/[0.06] bg-white shadow-lift"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <span className="eyebrow text-[#0F8B8D]">Medical Term</span>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-ink"><X size={16} /></button>
        </div>

        <div className="relative flex-1 overflow-y-auto px-6 py-6">
          <h2 className="display text-3xl leading-tight">{term.name}</h2>
          {viewCount > 0 && <p className="mt-1 text-[11px] font-bold text-slate-400">Viewed {viewCount} time{viewCount === 1 ? "" : "s"}</p>}

          <h3 className="mt-5 text-xs font-extrabold uppercase tracking-wide text-slate-500">Definition</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink">{term.definition}</p>

          <div className="mt-4 rounded-2xl bg-[#f9fcfc] p-4">
            <p className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700"><Wand2 size={13} />Simple Explanation</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{term.aiExplanation}</p>
          </div>

          {term.wordBreakdown.length > 0 && <>
            <h3 className="mt-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Puzzle size={13} />Word Breakdown</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {term.wordBreakdown.map(wp => <span key={wp.part} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink">{wp.part} <span className="font-medium text-slate-500">= {wp.meaning}</span></span>)}
            </div>
          </>}

          {relatedTerms.length > 0 && <>
            <h3 className="mt-5 text-xs font-extrabold uppercase tracking-wide text-slate-500">Related Terms</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {relatedTerms.map(rt => <button key={rt.id} type="button" onClick={() => onNavigate(rt.id)} className="cursor-pointer rounded-full bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100">{rt.name}</button>)}
            </div>
          </>}

          <h3 className="mt-5 text-xs font-extrabold uppercase tracking-wide text-slate-500">Example Sentence</h3>
          <p className="mt-2 rounded-2xl border border-slate-100 p-3.5 text-sm italic leading-relaxed text-slate-600">&ldquo;{term.exampleSentence}&rdquo;</p>

          <h3 className="mt-6 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Bot size={13} />Ask Studium AI</h3>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {aiPrompts.map(p => <Link key={p.label} href="/dashboard/ai-tutor" className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-[#f9fcfc] hover:text-ink"><p.icon size={13} className="shrink-0 text-teal-600" />{p.label}</Link>)}
          </div>

          <h3 className="mt-6 text-xs font-extrabold uppercase tracking-wide text-slate-500">Vocabulary Actions</h3>
          <div className="mt-2.5 space-y-2">
            <button type="button" onClick={handleSave} disabled={saved} className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm font-bold transition ${saved ? "cursor-default border-teal-200 bg-teal-50 text-teal-700" : "border-slate-200 text-ink hover:border-teal-200 hover:bg-[#f9fcfc]"}`}>
              {saved ? <BookmarkCheck size={16} className="shrink-0" /> : <Bookmark size={16} className="shrink-0 text-slate-400" />}⭐ {saved ? "Saved to Terminology" : "Save to Terminology"}
            </button>
            <button type="button" onClick={handleFlashcard} disabled={flashcardMade} className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm font-bold transition ${flashcardMade ? "cursor-default border-teal-200 bg-teal-50 text-teal-700" : "border-slate-200 text-ink hover:border-teal-200 hover:bg-[#f9fcfc]"}`}>
              {flashcardMade ? <Check size={16} className="shrink-0" /> : <Layers size={16} className="shrink-0 text-slate-400" />}🧠 {flashcardMade ? "Flashcard Created" : "Create Flashcard"}
            </button>
            <button type="button" onClick={handleQueue} disabled={queued} className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm font-bold transition ${queued ? "cursor-default border-teal-200 bg-teal-50 text-teal-700" : "border-slate-200 text-ink hover:border-teal-200 hover:bg-[#f9fcfc]"}`}>
              {queued ? <Check size={16} className="shrink-0" /> : <ListPlus size={16} className="shrink-0 text-slate-400" />}📚 {queued ? "Queued for Review" : "Add to Review Queue"}
            </button>
          </div>

          <h3 className="mt-6 text-xs font-extrabold uppercase tracking-wide text-slate-500">Confidence Rating</h3>
          <p className="mt-1 text-xs text-slate-500">This personalizes how often it comes back in Terminology review.</p>
          <div className="mt-2.5 space-y-2">
            {confidenceOptions.map(opt => <button
              key={opt.level}
              type="button"
              onClick={() => handleConfidence(opt.level)}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm font-bold transition ${confidence === opt.level ? opt.active : "border-slate-200 text-slate-600 hover:bg-[#f9fcfc]"}`}
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${opt.dot}`} />{opt.label}
              {confidence === opt.level && <Check size={15} className="ml-auto shrink-0" strokeWidth={3} />}
            </button>)}
          </div>
        </div>

        <AnimatePresence>
          {floatingKP !== null && <motion.span
            initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -28 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
            className="pointer-events-none absolute right-8 top-16 text-sm font-extrabold text-teal-600"
          >+{floatingKP} KP</motion.span>}
        </AnimatePresence>
      </motion.div>}
    </AnimatePresence>

    <AnimatePresence>
      {levelUpInfo && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setLevelUpInfo(null)}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
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
  </>;
}
