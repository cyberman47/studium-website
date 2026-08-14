"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check, Lightbulb, MoreVertical, PartyPopper,
  Shuffle, Undo2, X as XIcon
} from "lucide-react";
import { AiTutorPanel } from "./ai-tutor-panel";
import { AiFabTrigger } from "./ai-fab-trigger";
import { InteractiveText } from "./interactive-text";
import { Flashcard, FlashcardRating, FlashcardRatingRow } from "./flashcard";
import { TutorContext } from "@/lib/tutorChat";
import { getLevelInfo, getTotalKP } from "@/lib/progress";

export type FocusCard = {
  id: string;
  front: string;
  back: string;
  hint?: string | null;
};

// Same real four-point scale as lib/spacedRepetitionCore.ts's Rating and
// components/flashcard.tsx's FlashcardRating (literally that type—an alias,
// not a separate one this component's many callers have to translate via a
// ratingMap)—Again/Hard/Good/Easy, matching real Anki-style spaced
// repetition instead of a collapsed 3-button know/don't-know.
export type FocusRating = FlashcardRating;

// Minimal info a caller supplies to make Studium AI genuinely aware of what
// it's looking at during a review session—the full TutorContext (including
// which exact card is showing) is built internally from the live current
// card, not handed in once and left stale as the student moves through
// the deck. chatKey scopes the saved chat thread (lib/tutorChat.ts keys
// history by "lessonId") so Library/Deck sessions don't collide with real
// lesson chats or each other.
export type FocusModeTutorContext = { chatKey: string; subjectName: string; sectionName?: string };

export type FocusModeProps = {
  deckTitle: string;
  cards: FocusCard[];
  onExit: () => void;
  /** Real persistence hook—caller decides what each rating means for its data (e.g. reviewTerm's hard/medium/easy). */
  onRate: (card: FocusCard, rating: FocusRating) => void;
  /** Real reversal hook—caller restores whatever onRate changed. Undo is a no-op for the UI if omitted. */
  onUndo?: (card: FocusCard, rating: FocusRating) => void;
  /** Resume at a specific card—used when a caller toggles this overlay on
   * top of its own embedded card view, so expanding/collapsing to fullscreen
   * doesn't reset progress back to the first card. */
  initialIndex?: number;
  /** Opts into a collapsible Studium AI panel scoped to the exact card on
   * screen. Omitted entirely for callers that don't want it. Closed by
   * default even where it's offered—Focus Mode is deliberately immersive,
   * so it stays one click away rather than opening over the card automatically. */
  tutorContext?: FocusModeTutorContext;
};

type HistoryEntry = { card: FocusCard; rating: FocusRating };

export function FlashcardFocusMode({ deckTitle, cards: initialCards, onExit, onRate, onUndo, initialIndex = 0, tutorContext }: FocusModeProps) {
  const [cards, setCards] = useState(initialCards);
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [counts, setCounts] = useState<Record<FocusRating, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const current = cards[index];
  const done = index >= cards.length;

  // Rebuilt every render from whatever card is actually on screen right
  // now, so switching cards keeps the tutor's context accurate instead of
  // freezing on whichever card was current when the panel first opened.
  const liveTutorContext: TutorContext | null = tutorContext && current ? {
    sectionName: tutorContext.sectionName ?? "",
    subjectName: tutorContext.subjectName,
    lessonTitle: deckTitle,
    lessonId: tutorContext.chatKey,
    currentStep: "Flashcard Review",
    currentFlashcard: { front: current.front, back: current.back },
    recentMistakes: [],
    studentLevel: (() => { const l = getLevelInfo(getTotalKP()); return `Level ${l.level} · ${l.name}`; })()
  } : null;

  // Lock page scroll while the overlay is open, restore on exit.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  function resetCardView() {
    setFlipped(false);
    setShowHint(false);
  }

  function flip() {
    setFlipped(f => !f);
  }

  function rate(rating: FocusRating) {
    if (!current || done) return;
    onRate(current, rating);
    setHistory(h => [...h, { card: current, rating }]);
    setCounts(c => ({ ...c, [rating]: c[rating] + 1 }));
    resetCardView();
    setDirection(1);
    setIndex(i => i + 1);
  }

  function undo() {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCounts(c => ({ ...c, [last.rating]: Math.max(0, c[last.rating] - 1) }));
    onUndo?.(last.card, last.rating);
    resetCardView();
    setDirection(-1);
    setIndex(i => Math.max(0, i - 1));
  }

  function shuffle() {
    const remaining = cards.slice(index);
    const done_ = cards.slice(0, index);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    setCards([...done_, ...remaining]);
    setOptionsOpen(false);
  }

  function restart() {
    setCards(initialCards);
    setIndex(0);
    resetCardView();
    setCounts({ again: 0, hard: 0, good: 0, easy: 0 });
    setHistory([]);
    setOptionsOpen(false);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (done) return;
      if (e.code === "Space") { e.preventDefault(); flip(); }
      else if (e.code === "Digit1" || e.code === "ArrowLeft") { e.preventDefault(); rate("again"); }
      else if (e.code === "Digit2") { e.preventDefault(); rate("hard"); }
      else if (e.code === "Digit3") { e.preventDefault(); rate("good"); }
      else if (e.code === "Digit4" || e.code === "ArrowRight" || e.code === "Enter") { e.preventDefault(); rate("easy"); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, done]);

  const progressPercent = cards.length > 0 ? Math.min(100, Math.round((index / cards.length) * 100)) : 0;

  return <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-[#0d1917] text-heading">
    {/* Progress bar */}
    <div className="h-1 w-full bg-slate-100 dark:bg-white/10">
      <motion.div className="h-full bg-teal-500" animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.3 }} />
    </div>

    {/* Header */}
    <header className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 px-5 py-4 sm:px-8">
      <button type="button" onClick={onExit} title="Exit focus mode" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><XIcon size={18} /></button>

      <div className="min-w-0 text-center">
        <p className="truncate text-sm font-extrabold text-heading">{deckTitle}</p>
        {!done && <p className="text-xs font-bold text-slate-400">{index + 1} / {cards.length}</p>}
      </div>

      <div className="relative flex items-center gap-1.5">
        <button type="button" onClick={() => setOptionsOpen(o => !o)} title="Options" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><MoreVertical size={17} /></button>

        <AnimatePresence>
          {optionsOpen && <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 z-10 w-48 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-lift"
          >
            <button type="button" onClick={shuffle} className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-xs font-bold text-heading hover:bg-slate-50 dark:bg-white/5"><Shuffle size={13} className="text-teal-600" />Shuffle remaining</button>
            <button type="button" onClick={restart} className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-xs font-bold text-heading hover:bg-slate-50 dark:bg-white/5"><Undo2 size={13} className="text-teal-600" />Restart session</button>
          </motion.div>}
        </AnimatePresence>
      </div>
    </header>

    {/* Main content */}
    <div className="flex flex-1 flex-col items-center justify-center px-5 pb-6 sm:px-8">
      {done ? <CompletionScreen deckTitle={deckTitle} counts={counts} onExit={onExit} onRestart={restart} />
        : current && <div className="w-full max-w-2xl">
          <div className="mb-3 flex items-center justify-between px-1 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-500"><XIcon size={13} className="text-slate-400" />Needs Review <span className="text-slate-400">{counts.again + counts.hard}</span></span>
            <span className="flex items-center gap-1.5 text-teal-700">Know <span className="text-slate-400">{counts.good + counts.easy}</span><Check size={13} /></span>
          </div>

          <Flashcard
            cardKey={current.id}
            direction={direction}
            flipped={flipped}
            onFlip={flip}
            front={<InteractiveText text={current.front} />}
            back={<InteractiveText text={current.back} />}
            height="h-72 sm:h-80"
            frontExtra={current.hint ? <div onClick={e => e.stopPropagation()} className="mt-5">
              {showHint ? <p className="mx-auto max-w-sm rounded-xl bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-4 py-2.5 text-xs leading-relaxed text-teal-800">{current.hint}</p>
                : <button type="button" onClick={() => setShowHint(true)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-3.5 py-1.5 text-xs font-bold text-slate-500 transition hover:border-teal-300 hover:text-teal-700"><Lightbulb size={13} />Get a hint</button>}
            </div> : undefined}
          />
        </div>}
    </div>

    {/* Footer controls: the shared four-point Again/Hard/Good/Easy scale,
        the same rating row used everywhere a flashcard appears, plus this
        session's own Undo button. */}
    {!done && current && <footer className="flex items-center justify-center gap-2 border-t border-slate-100 dark:border-white/10 px-5 py-5 sm:gap-4 sm:px-8">
      <button type="button" onClick={undo} disabled={history.length === 0} title="Undo" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-slate-200 dark:border-white/10 text-slate-400 transition hover:border-slate-300 hover:text-heading disabled:cursor-not-allowed disabled:opacity-30"><Undo2 size={16} /></button>
      <div className="w-full max-w-md">
        <FlashcardRatingRow onRate={rate} />
      </div>
    </footer>}

    <AnimatePresence>
      {aiOpen && liveTutorContext && <motion.aside
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed right-0 top-0 z-[110] h-full w-full max-w-[400px] border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-lift"
      >
        <AiTutorPanel context={liveTutorContext} proactiveTip={null} onDismissTip={() => {}} onCollapse={() => setAiOpen(false)} />
      </motion.aside>}
    </AnimatePresence>

    {/* Persistent floating trigger, same component and behavior as every
        other Studium AI entry point—stays above the dark overlay and the
        card itself so it's reachable from any view state, including here. */}
    {liveTutorContext && <AiFabTrigger
      open={aiOpen}
      onToggle={() => setAiOpen(o => !o)}
      hasContext={!!current}
      contextLabel={current ? `Context: Flashcard - "${current.front}"` : undefined}
      zIndexClassName="z-[120]"
    />}
  </div>;
}

function CompletionScreen({ deckTitle, counts, onExit, onRestart }: { deckTitle: string; counts: Record<FocusRating, number>; onExit: () => void; onRestart: () => void }) {
  const total = counts.again + counts.hard + counts.good + counts.easy;
  const knowTotal = counts.good + counts.easy;
  const needsReview = counts.again + counts.hard;
  const pct = total > 0 ? Math.round((knowTotal / total) * 100) : 0;
  return <div className="w-full max-w-sm text-center">
    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><PartyPopper size={28} /></span>
    <h2 className="mt-5 text-2xl font-extrabold text-heading">Session complete!</h2>
    <p className="mt-1.5 text-sm text-slate-500">You went through {total} card{total === 1 ? "" : "s"} in "{deckTitle}".</p>
    <div className="mt-6 grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 p-4"><p className="text-xl font-extrabold text-teal-700">{knowTotal}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Good + Easy</p></div>
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 p-4"><p className="text-xl font-extrabold text-slate-600">{needsReview}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Again + Hard</p></div>
    </div>
    {total > 0 && <div className="mt-4">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} /></div>
      <p className="mt-1.5 text-xs font-bold text-slate-500">{pct}% marked Good or Easy</p>
    </div>}
    <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
      {needsReview > 0 && <button type="button" onClick={onRestart} className="flex-1 cursor-pointer rounded-full border border-slate-200 dark:border-white/10 py-3 text-sm font-bold text-heading transition hover:bg-slate-50 dark:bg-white/5">Review again</button>}
      <button type="button" onClick={onExit} className="flex-1 cursor-pointer rounded-full bg-accent-500 py-3 text-sm font-bold text-white transition hover:bg-accent-600">Done</button>
    </div>
  </div>;
}
