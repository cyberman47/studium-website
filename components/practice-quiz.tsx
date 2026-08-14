"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Bookmark, Bot, Check, Clock3, Eraser, Flag, HelpCircle, Maximize, Minimize,
  PartyPopper, X
} from "lucide-react";
import { PracticeQuestion } from "@/lib/mcatPath";
import { getSavedQuestionIds, SAVED_QUESTIONS_EVENT, toggleSavedQuestion } from "@/lib/practiceHistory";
import { AiTutorPanel } from "./ai-tutor-panel";
import { InteractiveText } from "./interactive-text";
import { TutorContext } from "@/lib/tutorChat";
import { getLevelInfo, getTotalKP } from "@/lib/progress";

// The lesson Study Hub's practice-question UI, extracted so it has exactly
// one real implementation instead of two: the lesson page's own Practice
// step and the standalone Practice Workspace both render through this
// component. It owns its question/option/grading/explanation rendering and
// its own card chrome—callers just supply questions.
//
// Two interaction models live here on purpose, not by accident:
//   - Embedded card (the lesson Study Hub's default view): unchanged from
//     before—click an option, it grades immediately, "Next question"
//     appears. Nothing about this path changed in this redesign.
//   - Fullscreen (reached via the Practice Workspace, or by manually
//     expanding the embedded card): the real exam-runner experience this
//     redesign is about—select-then-Submit, Previous/Next navigation with
//     per-question answers retained, Flag for Review, Strikeout Mode, and
//     no forced auto-advance even when timed.

// A question needs a stable id to be bookmarkable (lib/practiceHistory.ts's
// saved-questions store is keyed by it)—callers derive it the same way
// lesson flashcards do (lessonId:index). lessonTitle is optional context
// used for the fullscreen runner's topic pill—real data when a caller has
// it, simply omitted otherwise rather than invented.
export type PracticeQuizItem = PracticeQuestion & { id: string; lessonTitle?: string };

type PerQuestionState = { selected: number | null; submitted: boolean; struck: number[] };

function emptyState(): PerQuestionState {
  return { selected: null, submitted: false, struck: [] };
}

// Same minimal-context-in, full-context-built-internally pattern as
// FlashcardFocusMode's tutorContext prop—only supplied by callers with no
// AI Tutor surface of their own (the standalone Practice pages). The lesson
// page already has a persistent split-screen tutor panel, so it simply
// doesn't pass this, avoiding a second tutor UI stacked on the first.
export type PracticeQuizTutorContext = { chatKey: string; subjectName: string; sectionName?: string };

export type PracticeQuizProps = {
  questions: PracticeQuizItem[];
  title?: string;
  emptyMessage?: string;
  /** Fired the moment a question is graded—callers persist attempt history, log KP, etc. */
  onAnswer?: (question: PracticeQuizItem, index: number, correct: boolean) => void;
  /** Optional "Ask tutor about this" action; the button is omitted entirely if not provided. */
  onAskTutor?: (question: PracticeQuizItem) => void;
  /** Fired once the student dismisses the final results summary. */
  onComplete?: (results: { correct: boolean }[]) => void;
  completeLabel?: string;
  /** Mirrors the exact question/answer state on screen back to the caller—
   * so a persistent AI Tutor panel outside this component can stay aware of
   * "the current passage/question" the way a study companion should,
   * without owning the quiz state itself. */
  onQuestionChange?: (info: { question: PracticeQuizItem; index: number; answered: boolean; selectedOption: number | null }) => void;
  /** Opts into a collapsible, self-contained AI Tutor toggle scoped to the
   * current question—omit when the caller already renders its own tutor
   * panel (e.g. the lesson Study Hub). */
  tutorContext?: PracticeQuizTutorContext;
  /** Short real label under the title in the fullscreen header (e.g. the
   * section(s) a drill was built from, or "Your Bookmarks")—omitted, not
   * fabricated, when the caller has nothing meaningful to show. */
  contextLabel?: string;
  /** Opens already expanded to a fullscreen, sidebar-covering study view
   * instead of the default in-flow card—used by the standalone Practice
   * pages so pressing into a question immediately fills the screen. */
  defaultFullscreen?: boolean;
  /** Called when the student exits via the header's close button, for
   * callers that have their own "back to menu" state. When provided, this
   * is a controlled fullscreen session: the manual maximize/minimize
   * toggle is hidden entirely (there's nothing sensible to shrink back
   * into), and Exit is the only way out. */
  onExit?: () => void;
  /** Real exam conditions: no immediate correct/incorrect per question—
   * answers are recorded silently and revealed only in the results summary
   * at the end. */
  timed?: boolean;
  /** Whole-session countdown shown in the header while timed; reaching 0
   * jumps straight to the results summary with whatever was answered so far. */
  timeLimitSeconds?: number;
};

export function PracticeQuiz({
  questions, title = "Practice Questions", emptyMessage = "No practice questions available yet for this selection.",
  onAnswer, onAskTutor, onComplete, completeLabel = "See Results", onQuestionChange, tutorContext, contextLabel,
  defaultFullscreen = false, onExit, timed = false, timeLimitSeconds
}: PracticeQuizProps) {
  const controlledFullscreen = !!onExit;

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, PerQuestionState>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [strikeoutMode, setStrikeoutMode] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(timeLimitSeconds ?? 0);
  const [aiOpen, setAiOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(defaultFullscreen || controlledFullscreen);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const current = answers[qIndex] ?? emptyState();
  // Card mode keeps the exact original one-click "select = graded
  // immediately" behavior; only the fullscreen runner requires an explicit
  // Submit before revealing anything.
  const requireExplicitSubmit = isFullscreen;

  useEffect(() => {
    if (questions[qIndex]) onQuestionChange?.({ question: questions[qIndex], index: qIndex, answered: current.submitted, selectedOption: current.selected });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, current.submitted, current.selected, questions]);

  useEffect(() => {
    function refresh() { setSavedIds(new Set(getSavedQuestionIds())); }
    refresh();
    window.addEventListener(SAVED_QUESTIONS_EVENT, refresh);
    return () => window.removeEventListener(SAVED_QUESTIONS_EVENT, refresh);
  }, []);

  // Locks page scroll while fullscreen, same as FlashcardFocusMode—the
  // overlay is the only thing that should scroll.
  useEffect(() => {
    if (!isFullscreen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [isFullscreen]);

  // Whole-session countdown—real seconds, ticking regardless of which
  // question is showing, ending the session honestly when it runs out.
  useEffect(() => {
    if (!timed || !timeLimitSeconds || showSummary || questions.length === 0) return;
    if (secondsLeft <= 0) { finalizeAndShowSummary(); return; }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timed, timeLimitSeconds, secondsLeft, showSummary, questions.length]);

  if (questions.length === 0) {
    return <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-8 text-center shadow-soft">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-400"><HelpCircle size={20} /></span>
      <p className="mt-3 text-sm font-extrabold text-heading">Nothing here yet.</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{emptyMessage}</p>
    </div>;
  }

  const q = questions[qIndex];
  const isSaved = savedIds.has(q.id);

  const liveTutorContext: TutorContext | null = tutorContext ? {
    sectionName: tutorContext.sectionName ?? "",
    subjectName: tutorContext.subjectName,
    lessonTitle: title,
    lessonId: tutorContext.chatKey,
    currentStep: "Practice",
    currentFlashcard: null,
    currentPracticeQuestion: { question: q.question, studentAnswer: current.selected !== null ? q.options[current.selected] : null },
    recentMistakes: [],
    studentLevel: (() => { const l = getLevelInfo(getTotalKP()); return `Level ${l.level} · ${l.name}`; })()
  } : null;

  function setCurrent(idx: number, next: Partial<PerQuestionState>) {
    setAnswers(a => ({ ...a, [idx]: { ...(a[idx] ?? emptyState()), ...next } }));
  }

  // Grades and logs a question's currently-selected answer, if it hasn't
  // been already—used both by the explicit Submit action (tutor mode) and
  // when leaving/ending a question in timed mode that was never submitted.
  function gradeIfNeeded(idx: number) {
    const st = answers[idx];
    if (!st || st.selected === null || st.submitted) return;
    const correct = st.selected === questions[idx].correctIndex;
    setCurrent(idx, { submitted: true });
    onAnswer?.(questions[idx], idx, correct);
  }

  function handleOptionClick(i: number) {
    if (strikeoutMode) {
      const struck = current.struck.includes(i) ? current.struck.filter(x => x !== i) : [...current.struck, i];
      setCurrent(qIndex, { struck });
      return;
    }
    if (!timed && current.submitted) return; // locked after grading in tutor mode
    if (!requireExplicitSubmit) {
      // Embedded card: preserves the exact original one-click behavior.
      const correct = i === q.correctIndex;
      setCurrent(qIndex, { selected: i, submitted: true });
      onAnswer?.(q, qIndex, correct);
    } else {
      // Fullscreen: selecting just marks a choice—grading/logging happens
      // on Submit (tutor mode) or when leaving the question (timed mode).
      setCurrent(qIndex, { selected: i });
    }
  }

  function submitCurrent() {
    if (current.selected === null || current.submitted) return;
    gradeIfNeeded(qIndex);
  }

  function finalizeAndShowSummary() {
    gradeIfNeeded(qIndex);
    setShowSummary(true);
  }

  function goPrevious() {
    if (qIndex > 0) setQIndex(i => i - 1);
  }

  function handlePrimaryButton() {
    if (requireExplicitSubmit && !timed && !current.submitted) {
      submitCurrent(); // step 1: reveal, stay put
      return;
    }
    if (timed) gradeIfNeeded(qIndex); // log a silent, ungraded-on-screen answer before moving on
    if (qIndex + 1 < questions.length) { setQIndex(i => i + 1); return; }
    if (isFullscreen) { finalizeAndShowSummary(); return; }
    // Embedded card: no internal results summary (never rendered there)—
    // preserves the original behavior the lesson Study Hub relies on,
    // completing straight through to onComplete.
    gradeIfNeeded(qIndex);
    onComplete?.(questions.map((qq, idx) => ({ correct: answers[idx]?.selected === qq.correctIndex && answers[idx]?.selected !== null })));
  }

  function toggleFlag() {
    setFlagged(f => { const next = new Set(f); if (next.has(qIndex)) next.delete(qIndex); else next.add(qIndex); return next; });
  }

  function handleToggleSave() {
    toggleSavedQuestion(q.id);
  }

  function handleClose() {
    if (onExit) onExit();
    else setIsFullscreen(false);
  }

  function handleDoneWithSummary() {
    const results = questions.map((_, idx) => ({ correct: answers[idx]?.selected === questions[idx].correctIndex && answers[idx]?.selected !== null }));
    onComplete?.(results);
  }

  function formatClock(totalSeconds: number): string {
    const m = Math.floor(Math.max(0, totalSeconds) / 60);
    const s = Math.max(0, totalSeconds) % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const bookmarkButton = <button
    type="button" onClick={handleToggleSave} title={isSaved ? "Remove from saved questions" : "Save this question"}
    className={`grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition ${isSaved ? "text-amber-500" : "text-slate-400 hover:bg-slate-100 dark:bg-white/10 hover:text-heading"}`}
  ><Bookmark size={16} fill={isSaved ? "currentColor" : "none"} /></button>;

  const tutorToggle = liveTutorContext && <button type="button" onClick={() => setAiOpen(o => !o)} title="Ask Studium AI" className={`grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition ${aiOpen ? "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600" : "text-slate-400 hover:bg-slate-100 dark:bg-white/10 hover:text-heading"}`}><Bot size={16} /></button>;

  const timerBadge = timed && timeLimitSeconds ? <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold tabular-nums ${secondsLeft <= 30 ? "bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300 text-rose-700" : "bg-slate-100 dark:bg-white/10 text-slate-600"}`}><Clock3 size={13} />{formatClock(secondsLeft)}</span> : null;

  const revealed = current.submitted && !timed;
  const letters = ["A", "B", "C", "D", "E", "F"];

  const optionsList = <div className={isFullscreen ? "mt-7 space-y-3" : "mt-4 space-y-2.5"}>
    {q.options.map((opt, i) => {
      const isCorrect = i === q.correctIndex;
      const isSelected = current.selected === i;
      const isStruck = current.struck.includes(i);
      let cls = "border-slate-200 dark:border-white/10 hover:border-teal-500 hover:bg-teal-50/30 dark:bg-teal-500/15";
      if (revealed) cls = isCorrect ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300" : isSelected ? "border-rose-300 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300" : "border-slate-100 dark:border-white/10 opacity-60";
      else if (isSelected) cls = "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300";
      const disabled = revealed || (!timed && current.submitted && !isFullscreen);
      return isFullscreen
        ? <button key={i} type="button" disabled={disabled} onClick={() => handleOptionClick(i)} className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition ${disabled ? "cursor-default" : "cursor-pointer"} ${cls}`}>
          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold transition ${isSelected && !isStruck ? "border-teal-500 bg-teal-500 text-white" : "border-slate-300 text-slate-500"}`}>{letters[i]}</span>
          <span className={`flex-1 text-sm font-bold text-heading ${isStruck ? "text-slate-400 line-through" : ""}`}>{opt}</span>
          {revealed && isCorrect && <Check size={17} className="shrink-0 text-teal-600" />}
          {revealed && isSelected && !isCorrect && <X size={17} className="shrink-0 text-rose-500" />}
          {!revealed && isSelected && !isStruck && <Check size={16} className="shrink-0 text-teal-600" />}
        </button>
        : <div key={i}>
          <button type="button" disabled={disabled} onClick={() => handleOptionClick(i)} className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold text-heading transition ${disabled ? "cursor-default" : "cursor-pointer"} ${cls}`}>
            <span className="flex items-center gap-2.5"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-slate-300 text-[10px] font-extrabold text-slate-500">{letters[i]}</span>{opt}</span>
            {revealed && isCorrect && <Check size={16} className="shrink-0 text-teal-600" />}
            {revealed && isSelected && !isCorrect && <X size={16} className="shrink-0 text-rose-500" />}
          </button>
          {revealed && <p className={`mt-1.5 px-1 text-xs leading-relaxed ${isCorrect ? "text-teal-700" : "text-slate-500"}`}><InteractiveText text={q.optionExplanations[i]} /></p>}
        </div>;
    })}
  </div>;

  // Embedded card only: the original inline "Next question" row lives
  // right under the options, unchanged in spirit from before.
  const embeddedFooter = !isFullscreen && current.submitted && <div className="mt-5 flex flex-wrap gap-2.5">
    <button type="button" onClick={handlePrimaryButton} className="cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">{qIndex + 1 < questions.length ? "Next question" : completeLabel}</button>
    {onAskTutor && <button type="button" onClick={() => onAskTutor(q)} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-3 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Ask tutor about this</button>}
  </div>;

  const total = questions.length;
  const correctCount = questions.filter((_, idx) => answers[idx]?.selected === questions[idx].correctIndex && answers[idx]?.selected !== null).length;
  const answeredCount = questions.filter((_, idx) => answers[idx]?.selected !== null && answers[idx]?.selected !== undefined).length;
  const missedList = questions
    .map((qq, idx) => ({ qq, idx, st: answers[idx] }))
    .filter(({ st, qq }) => st && st.selected !== null && st.selected !== qq.correctIndex);

  const summaryBody = <div className="mx-auto w-full max-w-2xl text-center">
    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><PartyPopper size={26} /></span>
    <h2 className="mt-4 text-2xl font-extrabold text-heading">Session complete</h2>
    <p className="mt-1.5 text-sm text-slate-500">{correctCount} / {answeredCount} correct{answeredCount > 0 ? ` (${Math.round((correctCount / answeredCount) * 100)}%)` : ""}{answeredCount < total ? ` · ${total - answeredCount} unanswered` : ""}</p>

    {missedList.length > 0 && <div className="mt-7 space-y-4 text-left">
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Review missed questions</p>
      {missedList.map(({ qq, idx, st }) => <div key={idx} className="rounded-2xl border border-slate-100 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 p-4">
        <p className="text-sm font-bold text-heading"><InteractiveText text={qq.question} /></p>
        <p className="mt-1.5 text-xs text-rose-600">Your answer: {qq.options[st!.selected!]}</p>
        <p className="mt-1 text-xs text-teal-700">Correct: {qq.options[qq.correctIndex]}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500"><InteractiveText text={qq.optionExplanations[qq.correctIndex]} /></p>
      </div>)}
    </div>}

    <button type="button" onClick={handleDoneWithSummary} className="mt-7 cursor-pointer rounded-full bg-accent-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Done</button>
  </div>;

  const tutorDrawer = <AnimatePresence>
    {aiOpen && liveTutorContext && <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      onClick={() => setAiOpen(false)}
      className="fixed inset-0 z-[110] flex justify-end bg-black/20"
    >
      <motion.aside
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25, ease: "easeInOut" }}
        onClick={e => e.stopPropagation()}
        className="h-full w-full max-w-[400px] border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-lift"
      >
        <AiTutorPanel context={liveTutorContext} proactiveTip={null} onDismissTip={() => {}} onCollapse={() => setAiOpen(false)} />
      </motion.aside>
    </motion.div>}
  </AnimatePresence>;

  if (isFullscreen) {
    const primaryLabel = requireExplicitSubmit && !timed && !current.submitted
      ? "Submit"
      : qIndex + 1 < questions.length ? "Next Question" : (timed ? "Finish" : "See Results");
    // An answer is required to move on, in every mode—no skipping a
    // question unanswered just because timed mode doesn't reveal feedback.
    // Flag for Review exists precisely for "I'm unsure, come back to this
    // one," not "leave it blank and move past it."
    const primaryDisabled = current.selected === null;
    const topicPill = q.lessonTitle ? `${q.lessonTitle} • ${q.concept}` : q.concept;

    // Fills the viewport the same way FlashcardFocusMode does—fixed
    // inset-0 above everything, including the app's left sidebar. A
    // slate-50 canvas with a real white question card on top, instead of
    // text floating in a plain white void.
    return <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 dark:bg-white/5 text-heading">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-5 py-4 sm:px-8">
        <button type="button" onClick={handleClose} title="Exit" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><X size={18} /></button>
        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-extrabold text-heading">{title}</p>
          {contextLabel && !showSummary && <p className="truncate text-xs font-bold text-slate-400">{contextLabel}</p>}
        </div>
        <div className="flex items-center gap-1.5">
          {!showSummary && timerBadge}
          {!showSummary && bookmarkButton}
          {!showSummary && tutorToggle}
          {/* Manual maximize/minimize is intentionally omitted for
              controlled sessions (started via the Practice Workspace)—
              there's no smaller view to shrink back into, so offering the
              toggle there was confusing dead weight. Uncontrolled callers
              (the lesson page's embedded card, expanded manually) keep it. */}
          {!controlledFullscreen && <button type="button" onClick={() => setIsFullscreen(false)} title="Exit fullscreen" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><Minimize size={16} /></button>}
        </div>
      </header>

      <div className="flex flex-1 justify-center overflow-y-auto px-5 py-8 sm:px-8">
        {showSummary ? summaryBody : <div className="w-full max-w-4xl">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-3 py-1 text-xs font-extrabold text-teal-700">{topicPill}</span>
              <div className="flex items-center gap-2">
                {flagged.has(qIndex) && <span className="flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 px-2.5 py-1 text-[11px] font-extrabold text-amber-700"><Flag size={11} fill="currentColor" />Flagged</span>}
                <span className="text-xs font-bold text-slate-400">Question {qIndex + 1} of {questions.length}</span>
              </div>
            </div>
            <p className="mt-6 text-xl font-medium leading-relaxed text-slate-900 dark:text-white"><InteractiveText text={q.question} /></p>
            {optionsList}
            {revealed && onAskTutor && <button type="button" onClick={() => onAskTutor(q)} className="mt-5 cursor-pointer text-xs font-extrabold text-teal-600 hover:text-teal-700">Ask tutor about this →</button>}
          </div>
        </div>}
      </div>

      {!showSummary && <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleFlag} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-extrabold transition ${flagged.has(qIndex) ? "border-amber-300 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 text-amber-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-amber-200 hover:bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300"}`}><Flag size={13} fill={flagged.has(qIndex) ? "currentColor" : "none"} />Flag for Review</button>
            <button type="button" onClick={() => setStrikeoutMode(s => !s)} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-extrabold transition ${strikeoutMode ? "border-violet-300 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300 dark:bg-violet-500/15 dark:text-violet-300 text-violet-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-violet-200 hover:bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300 dark:bg-violet-500/15 dark:text-violet-300"}`}><Eraser size={13} />Strikeout Mode</button>
          </div>

          <div className="flex min-w-[140px] flex-1 items-center justify-center gap-3">
            <div className="h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${Math.round(((qIndex + 1) / questions.length) * 100)}%` }} /></div>
            <span className="shrink-0 whitespace-nowrap text-xs font-bold text-slate-500 tabular-nums">{qIndex + 1} / {questions.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={goPrevious} disabled={qIndex === 0} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-4 py-2.5 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={14} />Previous</button>
            <button type="button" onClick={handlePrimaryButton} disabled={primaryDisabled} className="flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">{primaryLabel}{primaryLabel.includes("Next") && <ArrowRight size={14} />}</button>
          </div>
        </div>
      </footer>}

      {tutorDrawer}
    </div>;
  }

  return <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">
        {tutorToggle}
        {bookmarkButton}
        <button type="button" onClick={() => setIsFullscreen(true)} title="Fullscreen" className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><Maximize size={15} /></button>
        <p className="ml-1 shrink-0 text-xs font-bold text-slate-500">{qIndex + 1} / {questions.length}</p>
      </div>
    </div>
    <p className="mt-4 text-sm font-bold text-heading"><InteractiveText text={q.question} /></p>
    {optionsList}
    {embeddedFooter}
    {tutorDrawer}
  </div>;
}
