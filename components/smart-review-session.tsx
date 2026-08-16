"use client";

// The Flashcards feature's own study-session UI for the Simple Smart
// Flashcard Review System. Deliberately a NEW, separate component from
// components/flashcard-focus-mode.tsx rather than a rewrite of it:
// FlashcardFocusMode's 4-button Again/Hard/Good/Easy footer is shared,
// as-is, by several other real pages (MCAT lesson pages, MCAT practice,
// Terminology review)—changing its rating scale to a binary Correct/
// Incorrect would silently change their UI too, which is exactly the
// "don't break existing flashcard functionality" this feature was told to
// avoid. This component owns only the Flashcards page's and a deck's own
// study sessions; it reuses the shared <Flashcard> flip-card visual
// (components/flashcard.tsx, which was already rating-agnostic) so the
// card itself still looks and feels identical everywhere in the app.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Layers, PartyPopper, X as XIcon } from "lucide-react";
import { Flashcard } from "./flashcard";
import { InteractiveText } from "./interactive-text";
import { LibraryCard, reviewCardOutcome } from "@/lib/flashcardLibrary";
import {
  answerSessionCard, buildReviewSession, currentSessionCard, isSessionDone, ReviewSessionState, sessionTotalRemaining
} from "@/lib/smartReviewSession";

// No "Next review: Tomorrow / In 4 days" subtitle here on purpose—the
// student asked for it gone. Scheduling still happens for real underneath
// (lib/spacedRepetitionCore.ts), it's just not narrated after every answer.
type Feedback = { correct: boolean; title: string; kp: number };

export function SmartReviewSession({ deckTitle, cards, onExit }: { deckTitle: string; cards: LibraryCard[]; onExit: () => void }) {
  const [session, setSession] = useState<ReviewSessionState>(() => buildReviewSession(cards));
  const [flipped, setFlipped] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sessionKP, setSessionKP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
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

  function answer(correct: boolean) {
    if (!current || feedback) return;
    const outcome = reviewCardOutcome(current.id, correct);
    setSessionKP(kp => kp + outcome.kpAwarded);
    if (correct) setCorrectCount(c => c + 1); else setIncorrectCount(c => c + 1);

    const title = !correct ? "Not quite." : outcome.entry.status === "mastered" ? "Great job!" : "Correct!";
    setFeedback({ correct, title, kp: outcome.kpAwarded });

    feedbackTimer.current = setTimeout(() => advance(correct), 1400);
  }

  function advance(correct: boolean) {
    if (feedbackTimer.current) { clearTimeout(feedbackTimer.current); feedbackTimer.current = null; }
    setSession(s => answerSessionCard(s, correct));
    setFeedback(null);
    setFlipped(false);
  }

  function skipFeedback() {
    if (!feedback) return;
    advance(feedback.correct);
  }

  return <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-[#0d1917] text-heading">
    <div className="h-1 w-full bg-slate-100 dark:bg-white/10">
      <motion.div className="h-full bg-teal-500" animate={{ width: done ? "100%" : `${Math.round((correctCount + incorrectCount) / (correctCount + incorrectCount + remaining || 1) * 100)}%` }} transition={{ duration: 0.3 }} />
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
      {done ? <CompletionScreen correctCount={correctCount} incorrectCount={incorrectCount} sessionKP={sessionKP} setAsideCount={session.setAside.length} onExit={onExit} />
        : current && <div className="w-full max-w-2xl">
          <div className="mb-3 flex items-center justify-between px-1 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-500"><XIcon size={13} className="text-slate-400" />Incorrect <span className="text-slate-400">{incorrectCount}</span></span>
            <span className="flex items-center gap-1.5 text-teal-700">Correct <span className="text-slate-400">{correctCount}</span><Check size={13} /></span>
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
                className={`absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center rounded-2xl text-center ${feedback.correct ? "bg-teal-600/95" : "bg-slate-800/95"}`}
              >
                <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white">{feedback.correct ? <Check size={22} /> : <XIcon size={22} />}</span>
                  <p className="mt-3 text-xl font-extrabold text-white">{feedback.title}</p>
                  {feedback.kp > 0 && <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold text-white">+{feedback.kp} KP</p>}
                </motion.div>
              </motion.div>}
            </AnimatePresence>
          </div>
        </div>}
    </div>

    {/* Footer: exactly the two buttons the student ever needs to
        understand—Studium handles the scheduling automatically. */}
    {!done && current && !feedback && <footer className="flex items-center justify-center gap-3 border-t border-slate-100 dark:border-white/10 px-5 py-5 sm:px-8">
      {!flipped
        ? <button type="button" onClick={() => setFlipped(true)} className="w-full max-w-sm cursor-pointer rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5">Show Answer</button>
        : <div className="flex w-full max-w-md gap-3">
          <button type="button" onClick={() => answer(false)} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-rose-200 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 py-3.5 text-sm font-extrabold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300"><XIcon size={16} />Incorrect</button>
          <button type="button" onClick={() => answer(true)} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-sm font-extrabold text-white transition hover:bg-teal-700"><Check size={16} />Correct</button>
        </div>}
    </footer>}
  </div>;
}

function CompletionScreen({ correctCount, incorrectCount, sessionKP, setAsideCount, onExit }: { correctCount: number; incorrectCount: number; sessionKP: number; setAsideCount: number; onExit: () => void }) {
  const total = correctCount + incorrectCount;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  return <div className="w-full max-w-sm text-center">
    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><PartyPopper size={28} /></span>
    <h2 className="mt-5 text-2xl font-extrabold text-heading">Session complete!</h2>
    <p className="mt-1.5 text-sm text-slate-500">You answered {total} card{total === 1 ? "" : "s"} and earned <span className="font-extrabold text-teal-700">{sessionKP} KP</span>.</p>
    <div className="mt-6 grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 p-4"><p className="text-xl font-extrabold text-teal-700">{correctCount}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Correct</p></div>
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 p-4"><p className="text-xl font-extrabold text-slate-600">{incorrectCount}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Incorrect</p></div>
    </div>
    {total > 0 && <div className="mt-4">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} /></div>
      <p className="mt-1.5 text-xs font-bold text-slate-500">{pct}% correct</p>
    </div>}
    {setAsideCount > 0 && <p className="mt-4 text-xs leading-relaxed text-slate-400">{setAsideCount} card{setAsideCount === 1 ? "" : "s"} needed more practice than this session had room for—they're still due, so they'll be here next time.</p>}
    <button type="button" onClick={onExit} className="mt-7 w-full cursor-pointer rounded-full bg-accent-500 py-3 text-sm font-bold text-white transition hover:bg-accent-600">Done</button>
  </div>;
}
