"use client";

// The one universal Studium flashcard visual. Source of truth: the MCAT
// in-lesson Flashcards step (previously components/lesson-flashcard-deck.tsx
// only)—its exact dimensions, radius, gradients, shadow, typography, and
// flip mechanic now live here so every flashcard surface in the app
// (in-lesson MCAT flashcards, Terminology review, the main Flashcards
// section's study sessions) renders the literal same component instead of
// three hand-styled lookalikes. This file owns only the CARD itself (front/
// back, flip, optional image) and the rating buttons beneath it—callers own
// their own header/toolbar/progress chrome around it, since that varies by
// context (an embedded page step vs. a fullscreen session) while the card
// and its rating controls must always look identical.
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type FlashcardRating = "again" | "hard" | "good" | "easy";

export type FlashcardProps = {
  /** Changing this remounts the card so the entrance slide replays. */
  cardKey: string | number;
  /** Which way the entering card should slide in from: 1 = next (from the right), -1 = previous (from the left). */
  direction: 1 | -1;
  flipped: boolean;
  onFlip: () => void;
  front: React.ReactNode;
  back: React.ReactNode;
  /** Optional image shown above the front content (e.g. a diagram term). */
  imageSrc?: string;
  imageAlt?: string;
  /** Extra front-face content between the term and the "Click to flip" cue—e.g. a hint reveal. */
  frontExtra?: React.ReactNode;
  /** Tailwind height classes for the card—defaults to the lesson step's size. Fullscreen contexts pass a taller value. */
  height?: string;
  frontTextClassName?: string;
  backTextClassName?: string;
};

const DEFAULT_HEIGHT = "h-56";
const DEFAULT_FRONT_TEXT = "text-xl font-extrabold tracking-tight text-heading sm:text-2xl";
const DEFAULT_BACK_TEXT = "text-sm leading-relaxed text-teal-900 dark:text-teal-200 sm:text-base";

export function Flashcard({
  cardKey, direction, flipped, onFlip, front, back, imageSrc, imageAlt, frontExtra,
  height = DEFAULT_HEIGHT, frontTextClassName = DEFAULT_FRONT_TEXT, backTextClassName = DEFAULT_BACK_TEXT
}: FlashcardProps) {
  // Flip technique: a "true" 3D flip (two absolutely-positioned faces, one
  // pre-rotated 180deg with backface-visibility:hidden) is the textbook
  // approach, but it's genuinely unreliable across browsers/GPUs—when it
  // misbehaves, both faces composite on top of each other and the back
  // shows through the front, mirrored. This instead rotates the single
  // visible face down to edge-on (90deg, an invisible sliver), swaps which
  // face's *content* is rendered while nothing is visible, then rotates
  // back to 0deg showing the new content—so a mirrored face is never
  // actually on screen. Only one face's DOM ever exists at a time.
  const [displayFace, setDisplayFace] = useState<"front" | "back">(flipped ? "back" : "front");
  const [midFlip, setMidFlip] = useState(false);
  // Track actual previous values (not a "first run" flag) so React 18
  // Strict Mode's dev-only double-invoke of this effect—which re-runs it
  // once more with identical props, not a real change—is naturally a
  // no-op instead of misfiring a phantom flip animation on mount.
  const prevCardKey = useRef(cardKey);
  const prevFlipped = useRef(flipped);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cardChanged = prevCardKey.current !== cardKey;
    const flippedChanged = prevFlipped.current !== flipped;
    prevCardKey.current = cardKey;
    prevFlipped.current = flipped;
    if (!cardChanged && !flippedChanged) return;

    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);

    if (cardChanged) {
      // A different card arrived (Prev/Next/rate-and-advance)—snap directly
      // to its own flipped state; the entrance slide already signals "new
      // card," so this shouldn't also play a flip transition.
      setMidFlip(false);
      setDisplayFace(flipped ? "back" : "front");
      return;
    }

    // Same card, flip toggled by the user (click or Space): play the
    // edge-on transition.
    setMidFlip(true);
    flipTimeoutRef.current = setTimeout(() => {
      setDisplayFace(flipped ? "back" : "front");
      setMidFlip(false);
      flipTimeoutRef.current = null;
    }, 150);
  }, [cardKey, flipped]);

  useEffect(() => () => { if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current); }, []);

  return <div className={`relative ${height}`}>
    {/* Deck-stack ghost layers—two static offset outlines behind the active
        card give it a physical-deck depth cue without animating themselves.
        Their offset was tuned to peek out from behind a left-right flip;
        a top-bottom flip swings the real card's top/bottom edges through
        3D space, which briefly exposes far more of these static layers
        than intended—reading as "another card behind it" instead of a
        subtle stack. Fading them out for the mid-flip instant sidesteps
        the geometry mismatch entirely, on either axis. */}
    <div className={`pointer-events-none absolute inset-x-5 top-3 z-0 ${height} rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-[#0d1917] transition-opacity duration-150 ${midFlip ? "opacity-0" : "opacity-100"}`} style={{ transform: "scale(0.96)" }} />
    <div className={`pointer-events-none absolute inset-x-2.5 top-1.5 z-0 ${height} rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] transition-opacity duration-150 ${midFlip ? "opacity-0" : "opacity-100"}`} style={{ transform: "scale(0.98)" }} />

    {/* Entrance slide: a real @keyframes animation (.flashcard-enter, in
        app/globals.css), not a Framer Motion initial->animate handshake or
        a React-state-driven transition. Both of those turned out to
        silently never fire when this component mounts as part of a
        brand-new subtree (e.g. a just-opened fullscreen overlay) under
        this dev environment's React 18 Strict Mode—a plain CSS animation
        triggered by DOM insertion has no React lifecycle to get confused. */}
    <div
      key={cardKey}
      className="flashcard-enter absolute inset-0 z-10"
      style={{ perspective: 1200, "--flashcard-enter-x": `${direction * 24}px` } as React.CSSProperties}
    >
      <motion.div
        onClick={onFlip}
        animate={{ rotateX: midFlip ? 90 : 0 }}
        transition={{ duration: 0.15, ease: "easeIn" }}
        className="relative h-full w-full cursor-pointer select-none rounded-2xl shadow-md"
      >
        {displayFace === "front" ? <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-white to-slate-50 dark:from-[#0d1917] dark:to-[#0b1615] p-6 text-center">
          {imageSrc && <img src={imageSrc} alt={imageAlt ?? ""} className="mb-3 max-h-24 rounded-lg object-contain" />}
          <div className={frontTextClassName}>{front}</div>
          {frontExtra}
          <p className="absolute bottom-5 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
            Click to flip <kbd className="rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">Space</kbd>
          </p>
        </div> : <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-50 to-teal-100/60 dark:from-teal-500/10 dark:to-teal-500/[0.06] p-6 text-center">
          <div className={backTextClassName}>{back}</div>
          <p className="absolute bottom-5 text-[11px] font-bold text-teal-600/60 dark:text-teal-300/60">Click to flip back</p>
        </div>}
      </motion.div>
    </div>
  </div>;
}

const tieredRatings: { rating: FlashcardRating; key: string; label: string; className: string }[] = [
  { rating: "again", key: "1", label: "Again", className: "border-rose-200 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 text-rose-700 hover:border-rose-300 hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300" },
  { rating: "hard", key: "2", label: "Hard", className: "border-amber-200 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 text-amber-700 hover:border-amber-300 hover:bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300" },
  { rating: "good", key: "3", label: "Good", className: "border-teal-200 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700 hover:border-teal-300 hover:bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300" }
];

// The one real 4-point Again/Hard/Good/Easy scale (lib/spacedRepetitionCore.ts's
// Rating)—shared verbatim so the mastery controls look and behave the same
// wherever a flashcard is rated, whether that's an in-lesson step or a
// fullscreen study session.
export function FlashcardRatingRow({ onRate, className }: { onRate: (rating: FlashcardRating) => void; className?: string }) {
  return <div className={`flex gap-2 ${className ?? ""}`}>
    {tieredRatings.map(r => <button key={r.rating} type="button" onClick={() => onRate(r.rating)} title={`${r.label} — (${r.key})`} className={`flex flex-1 cursor-pointer flex-col items-center rounded-2xl border-2 py-2 transition ${r.className}`}>
      <span className="text-sm font-extrabold">{r.key}</span>
      <span className="text-[10px] font-bold">{r.label}</span>
    </button>)}
    <RatingEasyButton onRate={onRate} />
  </div>;
}

function RatingEasyButton({ onRate }: { onRate: (rating: FlashcardRating) => void }) {
  return <button type="button" onClick={() => onRate("easy")} title="Easy — I knew it instantly. (4)" className="flex flex-1 cursor-pointer flex-col items-center rounded-2xl bg-teal-600 py-2 text-white transition hover:bg-teal-700">
    <CheckIcon />
    <span className="text-[10px] font-bold text-teal-50">Easy</span>
  </button>;
}

// Inlined rather than imported from lucide-react to keep this shared
// primitives file dependency-light; identical glyph to lucide's Check.
function CheckIcon() {
  return <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
}
