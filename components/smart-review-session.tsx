"use client";

// The Flashcards feature's own study-session UI for the Simple Smart
// Flashcard Review System. Deliberately a NEW, separate component from
// components/flashcard-focus-mode.tsx rather than a rewrite of it:
// FlashcardFocusMode's 4-button Again/Hard/Good/Easy footer is shared,
// as-is, by several other real pages (MCAT lesson pages, MCAT practice,
// Terminology review)—changing its rating scale here would silently change
// their UI too, which is exactly the "don't break existing flashcard
// functionality" this feature was told to avoid. This component's own
// footer uses a real three-level Unfamiliar/Learning/Known scale instead—
// same labels as My Terminology's own "Your familiarity" control, mapped
// onto the shared review engines' again/hard/good ratings (lib/
// smartReviewSession.ts's SessionRating)—rather than either FlashcardFocus
// Mode's 4 buttons or a flattened binary correct/incorrect. This component
// owns only the Flashcards page's and a deck's own study sessions; it
// reuses the shared <Flashcard> flip-card visual (components/flashcard.tsx,
// which was already rating-agnostic) so the card itself still looks and
// feels identical everywhere in the app.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Layers, Minus, PartyPopper, X as XIcon } from "lucide-react";
import { AiTutorPanel } from "./ai-tutor-panel";
import { AiFabTrigger } from "./ai-fab-trigger";
import { Flashcard } from "./flashcard";
import { InteractiveText } from "./interactive-text";
import { LibraryCard, reviewCardOutcome } from "@/lib/flashcardLibrary";
import {
  answerSessionCard, buildReviewSession, currentSessionCard, isSessionDone, ReviewSessionState, SessionRating,
  sessionTotalRemaining
} from "@/lib/smartReviewSession";
import { TutorContext } from "@/lib/tutorChat";
import { getLevelInfo, getTotalKP } from "@/lib/progress";

// No "Next review: Tomorrow / In 4 days" subtitle here on purpose—the
// student asked for it gone. Scheduling still happens for real underneath
// (lib/spacedRepetitionCore.ts), it's just not narrated after every answer.
type Feedback = { rating: SessionRating; title: string; kp: number };

// Same three real self-assessment levels, same labels, same dot colors as
// My Terminology's own "Your familiarity" scale (components/interactive-
// text.tsx's familiarityLevels / statusMeta)—not a binary correct/incorrect.
const ratingMeta: Record<SessionRating, { label: string; dot: string; text: string; border: string; bg: string; overlay: string }> = {
  again: { label: "Unfamiliar", dot: "bg-rose-500", text: "text-rose-700", border: "border-rose-200", bg: "bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300", overlay: "bg-slate-800/95" },
  hard: { label: "Learning", dot: "bg-amber-500", text: "text-amber-700", border: "border-amber-200", bg: "bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300", overlay: "bg-amber-600/95" },
  good: { label: "Known", dot: "bg-teal-500", text: "text-teal-700", border: "border-teal-200", bg: "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300", overlay: "bg-teal-600/95" }
};

export function SmartReviewSession({ deckTitle, cards, onExit }: { deckTitle: string; cards: LibraryCard[]; onExit: () => void }) {
  const [session, setSession] = useState<ReviewSessionState>(() => buildReviewSession(cards));
  const [flipped, setFlipped] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sessionKP, setSessionKP] = useState(0);
  const [counts, setCounts] = useState<Record<SessionRating, number>>({ again: 0, hard: 0, good: 0 });
  const [aiOpen, setAiOpen] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  useEffect(() => () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current); }, []);

  const current = currentSessionCard(session);
  const done = isSessionDone(session);
  const remaining = sessionTotalRemaining(session);

  // Rebuilt every render from whatever card is actually on screen right
  // now, same as FlashcardFocusMode's identical liveTutorContext—so
  // switching cards keeps the tutor's context accurate instead of freezing
  // on whichever card was current when the panel first opened. One shared
  // chat thread across every Library/deck review session (not split per
  // deck), matching the single "terminology-review" thread's pattern.
  const liveTutorContext: TutorContext | null = current ? {
    sectionName: current.sectionTitle ?? "",
    subjectName: current.subject,
    lessonTitle: deckTitle,
    lessonId: "flashcards-review",
    currentStep: "Flashcard Review",
    currentFlashcard: { front: current.front, back: current.back },
    recentMistakes: [],
    studentLevel: (() => { const l = getLevelInfo(getTotalKP()); return `Level ${l.level} · ${l.name}`; })(),
    currentOnScreenText: `Front: ${current.front}\nBack: ${current.back}`
  } : null;

  function answer(rating: SessionRating) {
    if (!current || feedback) return;
    const outcome = reviewCardOutcome(current.id, rating);
    setSessionKP(kp => kp + outcome.kpAwarded);
    setCounts(c => ({ ...c, [rating]: c[rating] + 1 }));

    const title = rating === "again" ? "Not quite." : rating === "hard" ? "Getting there." : outcome.entry.status === "mastered" ? "Great job!" : "Correct!";
    setFeedback({ rating, title, kp: outcome.kpAwarded });

    feedbackTimer.current = setTimeout(() => advance(rating), 1400);
  }

  function advance(rating: SessionRating) {
    if (feedbackTimer.current) { clearTimeout(feedbackTimer.current); feedbackTimer.current = null; }
    setSession(s => answerSessionCard(s, rating));
    setFeedback(null);
    setFlipped(false);
  }

  function skipFeedback() {
    if (!feedback) return;
    advance(feedback.rating);
  }

  const answeredCount = counts.again + counts.hard + counts.good;
  const feedbackIcon = feedback ? (feedback.rating === "good" ? <Check size={22} /> : feedback.rating === "hard" ? <Minus size={22} /> : <XIcon size={22} />) : null;

  return <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-[#0d1917] text-heading">
    <div className="h-1 w-full bg-slate-100 dark:bg-white/10">
      <motion.div className="h-full bg-teal-500" animate={{ width: done ? "100%" : `${Math.round(answeredCount / (answeredCount + remaining || 1) * 100)}%` }} transition={{ duration: 0.3 }} />
    </div>

    <header className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 px-5 py-4 sm:px-8">
      <button type="button" onClick={onExit} title="Exit session" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><XIcon size={18} /></button>
      <div className="min-w-0 text-center">
        <p className="truncate text-sm font-extrabold text-heading">{deckTitle}</p>
        {!done && <p className="text-xs font-bold text-slate-400">{remaining} card{remaining === 1 ? "" : "s"} to go</p>}
      </div>
      <div className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700"><Layers size={13} />{sessionKP} KP</div>
    </header>

    <div className="flex flex-1 flex-col items-center justify-center px-5 pb-6 sm:px-8">
      {done ? <CompletionScreen counts={counts} sessionKP={sessionKP} setAsideCount={session.setAside.length} onExit={onExit} />
        : current && <div className="w-full max-w-2xl">
          {/* Same three real self-assessment levels as My Terminology's own
              "Your familiarity" scale, not a binary correct/incorrect
              count. */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-1 text-xs font-bold">
            {(["again", "hard", "good"] as SessionRating[]).map(r => <span key={r} className={`flex items-center gap-1.5 ${ratingMeta[r].text}`}><span className={`h-1.5 w-1.5 rounded-full ${ratingMeta[r].dot}`} />{ratingMeta[r].label} <span className="text-slate-400">{counts[r]}</span></span>)}
          </div>

          <div className="relative">
            <Flashcard
              cardKey={current.id}
              direction={1}
              flipped={flipped}
              onFlip={() => !feedback && setFlipped(f => !f)}
              front={<InteractiveText text={current.front} interactive={false} />}
              back={<InteractiveText text={current.back} interactive={false} />}
              height="h-72 sm:h-80"
            />

            {/* Feedback overlay—tap anywhere to skip the auto-advance */}
            <AnimatePresence>
              {feedback && <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                onClick={skipFeedback}
                className={`absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center rounded-2xl text-center ${ratingMeta[feedback.rating].overlay}`}
              >
                <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white">{feedbackIcon}</span>
                  <p className="mt-3 text-xl font-extrabold text-white">{feedback.title}</p>
                  {feedback.kp > 0 && <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold text-white">+{feedback.kp} KP</p>}
                </motion.div>
              </motion.div>}
            </AnimatePresence>
          </div>
        </div>}
    </div>

    {/* Footer: the three real self-assessment levels the student ever needs
        to understand—same Unfamiliar/Learning/Known scale as My
        Terminology—Studium handles the scheduling automatically. */}
    {!done && current && !feedback && <footer className="flex items-center justify-center gap-3 border-t border-slate-100 dark:border-white/10 px-5 py-5 sm:px-8">
      {!flipped
        ? <button type="button" onClick={() => setFlipped(true)} className="w-full max-w-sm cursor-pointer rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5">Show Answer</button>
        : <div className="flex w-full max-w-lg gap-2.5">
          {(["again", "hard", "good"] as SessionRating[]).map(r => {
            const meta = ratingMeta[r];
            return <button
              key={r}
              type="button"
              onClick={() => answer(r)}
              className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-full border-2 ${meta.border} ${meta.bg} py-3 text-sm font-extrabold ${meta.text} transition hover:-translate-y-0.5`}
            ><span className={`h-2 w-2 rounded-full ${meta.dot}`} />{meta.label}</button>;
          })}
        </div>}
    </footer>}

    <AnimatePresence>
      {aiOpen && liveTutorContext && <motion.aside
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed right-0 top-0 z-[110] h-full w-full max-w-[400px] border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-lift"
      >
        <AiTutorPanel context={liveTutorContext} proactiveTip={null} onDismissTip={() => {}} onCollapse={() => setAiOpen(false)} />
      </motion.aside>}
    </AnimatePresence>

    {/* Same persistent Studium AI entry point every other flashcard surface
        in the app has (Focus Mode, in-lesson decks)—so every real study
        session, full screen or embedded, offers it. */}
    {liveTutorContext && <AiFabTrigger
      open={aiOpen}
      onToggle={() => setAiOpen(o => !o)}
      hasContext={!!current}
      contextLabel={current ? `Context: Flashcard - "${current.front}"` : undefined}
      zIndexClassName="z-[120]"
    />}
  </div>;
}

function CompletionScreen({ counts, sessionKP, setAsideCount, onExit }: { counts: Record<SessionRating, number>; sessionKP: number; setAsideCount: number; onExit: () => void }) {
  const total = counts.again + counts.hard + counts.good;
  const pct = total > 0 ? Math.round((counts.good / total) * 100) : 0;
  return <div className="w-full max-w-sm text-center">
    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><PartyPopper size={28} /></span>
    <h2 className="mt-5 text-2xl font-extrabold text-heading">Session complete!</h2>
    <p className="mt-1.5 text-sm text-slate-500">You answered {total} card{total === 1 ? "" : "s"} and earned <span className="font-extrabold text-teal-700">{sessionKP} KP</span>.</p>
    <div className="mt-6 grid grid-cols-3 gap-2.5">
      {(["again", "hard", "good"] as SessionRating[]).map(r => <div key={r} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 p-3.5">
        <p className={`text-xl font-extrabold ${ratingMeta[r].text}`}>{counts[r]}</p>
        <p className="mt-0.5 text-[11px] font-bold text-slate-500">{ratingMeta[r].label}</p>
      </div>)}
    </div>
    {total > 0 && <div className="mt-4">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} /></div>
      <p className="mt-1.5 text-xs font-bold text-slate-500">{pct}% known</p>
    </div>}
    {setAsideCount > 0 && <p className="mt-4 text-xs leading-relaxed text-slate-400">{setAsideCount} card{setAsideCount === 1 ? "" : "s"} needed more practice than this session had room for—they're still due, so they'll be here next time.</p>}
    <button type="button" onClick={onExit} className="mt-7 w-full cursor-pointer rounded-full bg-accent-500 py-3 text-sm font-bold text-white transition hover:bg-accent-600">Done</button>
  </div>;
}
