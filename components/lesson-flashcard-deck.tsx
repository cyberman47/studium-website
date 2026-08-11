"use client";

// The in-lesson Flashcards step's chrome (header, toolbar, keyboard nav)
// around the universal <Flashcard/> visual (components/flashcard.tsx). The
// card itself and its rating row are the shared primitives—this file only
// owns what's specific to being embedded in a lesson page: the Prev/Next +
// Explain-with-AI/Bookmark toolbar and the progress header. Rating logic
// itself (spaced-repetition, progress persistence) stays owned by the
// parent page, which is the same source of truth shared with the
// fullscreen Focus Mode (components/flashcard-focus-mode.tsx)—this
// component only calls the callbacks it's given.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, ChevronLeft, ChevronRight, Maximize, MessageCircleQuestion, Sparkles } from "lucide-react";
import { Flashcard, FlashcardRating, FlashcardRatingRow } from "./flashcard";

export type LessonFlashcard = { front: string; back: string };

export function LessonFlashcardDeck({
  cards, cardIndex, flipped, bookmarked, onFlip, onNavigate, onRate, onBookmarkToggle, onDontUnderstand, onFullscreen, onAskAI
}: {
  cards: LessonFlashcard[];
  cardIndex: number;
  flipped: boolean;
  bookmarked: boolean;
  onFlip: () => void;
  onNavigate: (index: number) => void;
  onRate: (rating: FlashcardRating) => void;
  onBookmarkToggle: () => void;
  onDontUnderstand: () => void;
  onFullscreen: () => void;
  onAskAI: () => void;
}) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const card = cards[cardIndex];
  const atStart = cardIndex === 0;
  const atEnd = cardIndex === cards.length - 1;

  function goPrev() {
    if (atStart) return;
    setDirection(-1);
    onNavigate(cardIndex - 1);
  }
  function goNext() {
    if (atEnd) return;
    setDirection(1);
    onNavigate(cardIndex + 1);
  }

  // Left/Right moves between cards, Space flips—active only while this deck
  // is actually on screen (the parent only mounts it during the Flashcards
  // step) and not while some other input on the page has focus.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
      else if (e.key === " " || e.code === "Space") { e.preventDefault(); onFlip(); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIndex, cards.length]);

  const progressPercent = Math.round(((cardIndex + 1) / cards.length) * 100);

  return <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
    {/* Header: title left, progress pill + bar right */}
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-extrabold tracking-tight">Flashcards</h2>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold tabular-nums text-slate-600">{cardIndex + 1} / {cards.length}</span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
            <motion.div className="h-full rounded-full bg-teal-500" animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.25, ease: "easeOut" }} />
          </div>
        </div>
        <button type="button" onClick={onFullscreen} title="Fullscreen" className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-ink"><Maximize size={15} /></button>
      </div>
    </div>

    <div className="mt-6">
      <Flashcard cardKey={cardIndex} direction={direction} flipped={flipped} onFlip={onFlip} front={card.front} back={card.back} />
    </div>

    {/* Toolbar: Prev · Explain with AI / I don't understand / Bookmark · Next */}
    <div className="mt-5 flex items-center justify-between gap-2">
      <button type="button" onClick={goPrev} disabled={atStart} title="Previous card (←)" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-slate-200 text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc] disabled:cursor-not-allowed disabled:opacity-30"><ChevronLeft size={16} /></button>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" onClick={onAskAI} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100"><Sparkles size={13} />Explain with AI</button>
        <button type="button" onClick={onDontUnderstand} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]"><MessageCircleQuestion size={13} />I don't understand</button>
        <button type="button" onClick={onBookmarkToggle} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition ${bookmarked ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-ink hover:border-amber-200 hover:bg-amber-50"}`}><Bookmark size={13} fill={bookmarked ? "currentColor" : "none"} />Bookmark</button>
      </div>

      <button type="button" onClick={goNext} disabled={atEnd} title="Next card (→)" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-slate-200 text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc] disabled:cursor-not-allowed disabled:opacity-30"><ChevronRight size={16} /></button>
    </div>

    {/* Rating row, revealed once flipped. Plain conditional render rather
        than an exit animation—see the note on the card slide above; the
        same dev-only Framer freeze risk applies to any exit here too, and
        this reveal is minor enough not to be worth that fragility. */}
    {flipped && <FlashcardRatingRow onRate={onRate} className="mt-4" />}
  </div>;
}
