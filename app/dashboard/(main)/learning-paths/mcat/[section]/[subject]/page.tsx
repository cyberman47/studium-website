"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen, Check, CheckSquare, ListChecks, Layers, Lock, Play, Square, Target, TrendingUp, X
} from "lucide-react";
import { FlashcardFocusMode, FocusCard, FocusRating } from "@/components/flashcard-focus-mode";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";
import {
  findSection, findSubject, getLessonContent, getLessonStatus, getSubjectProgress, LessonContent, LessonStatus, SubjectProgress
} from "@/lib/mcatPath";
import { getSectionPracticeQuestions } from "@/lib/mcatConcepts";
import { CARD_PROGRESS_EVENT, getAllLibraryCards, getCardProgress, isCardDue, restoreLibraryCard, reviewLibraryCard } from "@/lib/flashcardLibrary";
import { getAttemptsForLesson, logAttempt, PRACTICE_HISTORY_EVENT } from "@/lib/practiceHistory";


type SubjectLesson = { id: string; title: string; content: LessonContent | undefined };
type ActiveQuiz = { title: string; contextLabel?: string; questions: PracticeQuizItem[] } | null;
type ActiveDeck = { title: string; cards: FocusCard[] } | null;

function lessonFlashcards(lesson: SubjectLesson): FocusCard[] {
  return (lesson.content?.flashcards ?? []).map((fc, i) => ({ id: `lesson:${lesson.id}:${i}`, front: fc.front, back: fc.back }));
}

function lessonQuizItems(lesson: SubjectLesson): PracticeQuizItem[] {
  return (lesson.content?.practiceQuestions ?? []).map((q, i) => ({ ...q, id: `${lesson.id}:${i}`, lessonTitle: lesson.title }));
}

// Real sub-topic tags per lesson, straight from that lesson's own practice
// question concept tags—same field Weak Areas/Question Format already use,
// not a separate, invented topic taxonomy. Mirrors the concept-area hub.
function lessonConcepts(lesson: SubjectLesson): string[] {
  return Array.from(new Set((lesson.content?.practiceQuestions ?? []).map(q => q.concept))).slice(0, 4);
}

// The "Lessons" tab (default route) for a subject—header, back link, and the
// Lessons/Practice tab switcher itself all live in the parent layout.tsx now,
// so this component owns only the lesson list + its own per-lesson overlays.
export default function MCATSubjectPage({ params }: { params: { section: string; subject: string } }) {
  const subject = findSubject(params.section, params.subject);
  const section = findSection(params.section);
  const lessons: SubjectLesson[] = subject?.lessons.map(l => ({ id: l.id, title: l.title, content: getLessonContent(l.id) })) ?? [];
  const lessonIds = lessons.map(l => l.id);

  const [statuses, setStatuses] = useState<Record<string, LessonStatus>>({});
  const [progress, setProgress] = useState<SubjectProgress | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [accuracy, setAccuracy] = useState({ correct: 0, total: 0 });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz>(null);
  const [activeDeck, setActiveDeck] = useState<ActiveDeck>(null);
  const cardSnapshots = useRef(new Map<string, ReturnType<typeof getCardProgress>>()).current;

  useEffect(() => {
    if (!subject) return;
    function refresh() {
      const nextStatuses: Record<string, LessonStatus> = {};
      for (const id of lessonIds) nextStatuses[id] = getLessonStatus(lessonIds, id);
      setStatuses(nextStatuses);
      setProgress(getSubjectProgress(lessonIds));

      const subjectLessonIds = new Set(lessonIds);
      setDueCount(getAllLibraryCards().filter(c => c.lessonId && subjectLessonIds.has(c.lessonId) && isCardDue(c.id)).length);

      const attempts = lessonIds.flatMap(id => getAttemptsForLesson(id));
      setAccuracy({ correct: attempts.filter(a => a.correct).length, total: attempts.length });
    }
    refresh();
    window.addEventListener(CARD_PROGRESS_EVENT, refresh);
    window.addEventListener(PRACTICE_HISTORY_EVENT, refresh);
    return () => {
      window.removeEventListener(CARD_PROGRESS_EVENT, refresh);
      window.removeEventListener(PRACTICE_HISTORY_EVENT, refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.subject]);

  if (!subject) {
    return <p className="text-sm text-slate-500">Subject not found.</p>;
  }

  function handleRate(card: FocusCard, rating: FocusRating) {
    cardSnapshots.set(card.id, getCardProgress(card.id));
    reviewLibraryCard(card.id, rating);
  }

  function handleUndo(card: FocusCard) {
    restoreLibraryCard(card.id, cardSnapshots.get(card.id) ?? null);
  }

  function handleQuizAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    logAttempt(q.id.split(":")[0], q.concept, correct, q.id);
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function openDueCardsReview() {
    const subjectLessonIds = new Set(lessonIds);
    const due = getAllLibraryCards().filter(c => c.lessonId && subjectLessonIds.has(c.lessonId) && isCardDue(c.id));
    setActiveDeck({ title: "Due Cards Review", cards: due.map(c => ({ id: c.id, front: c.front, back: c.back, hint: c.lessonTitle ? `From: ${c.lessonTitle}` : null })) });
  }

  function openBatchFlashcards() {
    const cards = lessons.filter(l => selected.has(l.id)).flatMap(lessonFlashcards);
    setActiveDeck({ title: `${selected.size} Lesson${selected.size === 1 ? "" : "s"} · Flashcards`, cards });
  }

  function openBatchQuiz() {
    const questions = lessons.filter(l => selected.has(l.id)).flatMap(lessonQuizItems);
    setActiveQuiz({ title: "Custom Quiz", contextLabel: `${selected.size} lesson${selected.size === 1 ? "" : "s"} selected`, questions });
  }

  if (activeQuiz) {
    return <PracticeQuiz
      questions={activeQuiz.questions}
      title={activeQuiz.title}
      contextLabel={activeQuiz.contextLabel}
      completeLabel="Done"
      onAnswer={handleQuizAnswer}
      onComplete={() => setActiveQuiz(null)}
      defaultFullscreen
      onExit={() => setActiveQuiz(null)}
    />;
  }

  if (activeDeck) {
    return <FlashcardFocusMode
      deckTitle={activeDeck.title}
      cards={activeDeck.cards}
      onExit={() => setActiveDeck(null)}
      onRate={handleRate}
      onUndo={handleUndo}
      tutorContext={{ chatKey: `subject:${params.section}:${params.subject}`, subjectName: subject?.name ?? params.subject, sectionName: section?.shortTitle }}
    />;
  }

  const subjectQuestionCount = lessons.reduce((sum, l) => sum + (l.content?.practiceQuestions.length ?? 0), 0);
  const sectionQuestionTotal = section ? getSectionPracticeQuestions(section.id).length : 0;
  const questionShare = sectionQuestionTotal > 0 ? Math.round((subjectQuestionCount / sectionQuestionTotal) * 100) : 0;

  const resumeLesson = lessons.find(l => l.content && statuses[l.id] && statuses[l.id] !== "locked" && statuses[l.id] !== "completed");
  const fallbackLesson = lessons.find(l => l.content);
  const target = resumeLesson ?? fallbackLesson;
  const resumeHref = target ? `/dashboard/learning-paths/mcat/${params.section}/${params.subject}/${target.id}` : `/dashboard/learning-paths/mcat/${params.section}`;
  const allComplete = lessons.some(l => l.content) && lessons.filter(l => l.content).every(l => statuses[l.id] === "completed");

  const selectedLessons = lessons.filter(l => selected.has(l.id));
  const batchCardCount = selectedLessons.reduce((n, l) => n + (l.content?.flashcards.length ?? 0), 0);
  const batchQuestionCount = selectedLessons.reduce((n, l) => n + (l.content?.practiceQuestions.length ?? 0), 0);

  return <>
    {lessons.length === 0
      ? <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center shadow-soft">
        <p className="text-base font-extrabold text-ink">This subject's lessons are still being written.</p>
        <p className="max-w-xs text-sm leading-relaxed text-slate-500">Check back soon—Biology is fully built out as a preview of what's coming.</p>
      </div>
      : <div className="grid gap-8 lg:grid-cols-[1fr_336px]">
        {/* Main lesson list */}
        <div className="min-w-0">
          {progress && <div className="mb-5">
            <p className="text-sm font-bold text-slate-500">{progress.completed} / {progress.total} lessons complete · {progress.hoursRemaining} hrs remaining</p>
            <div className="mt-2 h-2 w-full max-w-sm overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500 transition-[width] duration-500" style={{ width: `${progress.percent}%` }} /></div>
          </div>}

          <div className="space-y-3">
            {lessons.map(lesson => {
              const status = statuses[lesson.id];
              const locked = status === "locked" || !status;
              const completed = status === "completed";
              const hasContent = !!lesson.content;
              const interactive = hasContent && !locked;
              const concepts = lessonConcepts(lesson);
              const cardCount = lesson.content?.flashcards.length ?? 0;
              const questionCount = lesson.content?.practiceQuestions.length ?? 0;
              const isSelected = selected.has(lesson.id);
              const readHref = lesson.content ? `/dashboard/learning-paths/mcat/${params.section}/${params.subject}/${lesson.id}` : "#";

              const upNext = interactive && !completed;
              return <div key={lesson.id} className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 transition ${locked ? "border-slate-100 bg-slate-50" : isSelected ? "border-teal-300 bg-teal-50/60 shadow-soft" : completed ? "border-teal-100 bg-white shadow-soft" : "border-slate-200 bg-white shadow-soft"}`}>
                {interactive
                  ? <button type="button" onClick={() => toggleSelect(lesson.id)} className="shrink-0 cursor-pointer text-slate-300 hover:text-teal-600" aria-label={`Select ${lesson.title}`}>
                    {isSelected ? <CheckSquare size={18} className="text-teal-600" /> : <Square size={18} />}
                  </button>
                  : <span className="w-[18px] shrink-0" />}

                {(() => {
                  const badgeClass = `grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-[#fcfdfd] transition ${completed ? "bg-teal-500 text-white" : locked ? "bg-slate-200 text-slate-400" : "bg-accent-500 text-white"}`;
                  const badgeIcon = completed ? <Check size={16} strokeWidth={3} /> : locked ? <Lock size={14} /> : <Play size={16} fill="currentColor" />;
                  return interactive
                    ? <Link href={readHref} className={`${badgeClass} cursor-pointer hover:-translate-y-0.5 hover:shadow-md`} aria-label={`Read ${lesson.title}`}>{badgeIcon}</Link>
                    : <span className={badgeClass}>{badgeIcon}</span>;
                })()}

                <div className="min-w-0 flex-1">
                  <p className={`flex items-center gap-2 text-sm font-bold ${locked ? "text-slate-400" : "text-ink"}`}>
                    {lesson.title}
                    {upNext && <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-accent-700">Up next</span>}
                  </p>
                  <p className="text-xs text-slate-500">{!hasContent ? "Content unavailable" : completed ? `Completed · ${lesson.content?.difficulty}` : locked ? "Locked" : `${lesson.content?.estimatedMinutes ?? 20} min · ${lesson.content?.difficulty ?? "Beginner"}`}</p>
                  {interactive && concepts.length > 0 && <div className="mt-1.5 flex flex-wrap gap-1">
                    {concepts.map(tag => <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200">{tag}</span>)}
                  </div>}
                </div>

                {interactive && <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  <Link href={readHref} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-extrabold text-ink transition hover:border-teal-300 hover:bg-[#f9fcfc]"><BookOpen size={12} />Read</Link>
                  <button type="button" onClick={() => setActiveQuiz({ title: lesson.title, contextLabel: "Lesson Practice", questions: lessonQuizItems(lesson) })} disabled={questionCount === 0} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-extrabold text-ink transition hover:border-teal-300 hover:bg-[#f9fcfc] disabled:cursor-not-allowed disabled:opacity-40"><ListChecks size={12} />Practice</button>
                  <button type="button" onClick={() => setActiveDeck({ title: lesson.title, cards: lessonFlashcards(lesson) })} disabled={cardCount === 0} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-extrabold text-ink transition hover:border-teal-300 hover:bg-[#f9fcfc] disabled:cursor-not-allowed disabled:opacity-40"><Layers size={12} />{cardCount} Card{cardCount === 1 ? "" : "s"}</button>
                </div>}
              </div>;
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-400"><Target size={13} />Exam Context</p>
            {section
              ? <p className="mt-2 text-sm leading-relaxed text-slate-600">Covers <span className="font-extrabold text-ink">{questionShare}%</span> of the {section.shortTitle} practice question bank <span className="text-slate-400">({subjectQuestionCount} of {sectionQuestionTotal} questions)</span>.</p>
              : <p className="mt-2 text-sm text-slate-400">Not mapped to a real exam section.</p>}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-400"><TrendingUp size={13} />Subject Stats</p>

            <div className="mt-3.5 flex items-center justify-between text-xs font-bold text-slate-500"><span>Mastery</span><span className="text-ink">{progress?.percent ?? 0}%</span></div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500 transition-[width] duration-500" style={{ width: `${progress?.percent ?? 0}%` }} /></div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Flashcards Due</p>
                <p className="text-xl font-extrabold text-ink">{dueCount}</p>
              </div>
              <button type="button" onClick={openDueCardsReview} disabled={dueCount === 0} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">Review Due</button>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Question Bank Accuracy</p>
              {accuracy.total > 0
                ? <p className="mt-0.5 text-xl font-extrabold text-ink">{accuracy.correct} <span className="text-sm font-bold text-slate-400">/ {accuracy.total} correct</span></p>
                : <p className="mt-0.5 text-sm font-bold text-slate-400">No attempts yet</p>}
            </div>
          </div>

          {target && <Link href={resumeHref} className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-500 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">
            <Play size={14} fill="currentColor" />{allComplete ? "Review Lessons" : "Resume Learning"}
          </Link>}
        </aside>
      </div>}

    <AnimatePresence>
      {selected.size > 0 && <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4"
      >
        <div className="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-lift">
          <span className="text-sm font-bold text-ink">{selected.size} lesson{selected.size === 1 ? "" : "s"} selected</span>
          <button type="button" onClick={openBatchFlashcards} disabled={batchCardCount === 0} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-ink transition hover:border-teal-300 hover:bg-[#f9fcfc] disabled:cursor-not-allowed disabled:opacity-40"><Layers size={13} />Launch Flashcards</button>
          <button type="button" onClick={openBatchQuiz} disabled={batchQuestionCount === 0} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"><ListChecks size={13} />Start Custom Quiz</button>
          <button type="button" onClick={() => setSelected(new Set())} className="cursor-pointer text-slate-400 hover:text-ink" aria-label="Clear selection"><X size={16} /></button>
        </div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
