"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Clock3, Frown,
  LayoutGrid, Layers, Lightbulb, Link2, Meh, PartyPopper, Sparkles, Star, Target, X
} from "lucide-react";
import { getLevelInfo, getTotalKP } from "@/lib/progress";
import { awardLessonKP, ClaimResult, logFlashcards, logQuiz, logStudyMinutes } from "@/lib/progress";
import { showKnowledgeToast } from "@/lib/kpToast";
import {
  completeLesson, findSection, findSubject, getBookmarkedCards, getLessonContent, getLessonEntry, PracticeQuestion, setLessonConfidence, toggleBookmarkedCard
} from "@/lib/mcatPath";
import { InteractiveText } from "@/components/interactive-text";
import { AiTutorPanel, ProactiveTip } from "@/components/ai-tutor-panel";
import { getTutorMode, sendMessage, TutorContext } from "@/lib/tutorChat";
import { addPersonalFlashcard } from "@/lib/personalFlashcards";
import { addSavedHighlight } from "@/lib/savedHighlights";
import { detectTerms } from "@/lib/termDetection";
import { Term } from "@/lib/terminology";
import { FlashcardFocusMode, FocusCard, FocusRating } from "@/components/flashcard-focus-mode";
import { LessonFlashcardDeck } from "@/components/lesson-flashcard-deck";
import { AiFabTrigger } from "@/components/ai-fab-trigger";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";
import { addCardsToDeck, createDeck, getDecks, STUDY_DECKS_EVENT, StudyDeck } from "@/lib/flashcardDecks";
import { getCardProgress, isCardStarted, reviewLibraryCard, restoreLibraryCard } from "@/lib/flashcardLibrary";
import { getWeakConcepts, hasPracticed, logAttempt, WeakConcept } from "@/lib/practiceHistory";
import { getTopicRecommendation, Recommendation, RecommendedAction } from "@/lib/recommendations";
import { ScientificMethodLesson } from "@/components/scientific-method/scientific-method-lesson";
import { documentLessonContentByLessonId } from "@/lib/documentLessons";

// Matches the server-rendered pass exactly (localStorage doesn't exist on
// the server, so every real signal below defaults to "nothing yet")—the
// real numbers are filled in by an effect after mount, never computed
// inline during render, so hydration never sees server/client text mismatch.
const defaultHubStats = { realProgressPercent: 0, recommendation: { action: "learn" as RecommendedAction, label: "", detail: "", href: "#" } as Recommendation, hubWeakConcepts: [] as WeakConcept[] };

// "takeaways" and "knowledge-check" are gone as separate steps—key takeaways
// are now folded into the reading itself as a summary, and the knowledge
// check was cut entirely per product feedback. "hub" replaces the old
// "intro" step: instead of a bare Start button, it's a real Study Hub the
// student can always return to, recommending what to do next without
// forcing Learn → Flashcards → Practice in strict order.
type Step = "hub" | "learn" | "flashcards" | "practice" | "review" | "complete";
type Confidence = "understand" | "practice" | "confused";

const stepOrder: Step[] = ["learn", "flashcards", "practice", "review", "complete"];
const stepLabels: Record<Step, string> = { hub: "Study Hub", learn: "Read", flashcards: "Flashcards", practice: "Practice", review: "AI Review", complete: "Complete" };

export default function MCATLessonPage({ params }: { params: { section: string; subject: string; lesson: string } }) {
  const lesson = getLessonContent(params.lesson);
  // Document-lesson gate: every lesson id registered in
  // lib/documentLessons/index.ts gets the redesigned concept-based Learn
  // experience (components/scientific-method/scientific-method-lesson.tsx,
  // exported as ScientificMethodLesson for historical reasons—it's generic
  // now). Any lesson id not in that lookup falls through to the original
  // hub/learn rendering below, completely unchanged.
  const documentLessonContent = lesson ? documentLessonContentByLessonId[lesson.id] : undefined;

  const [step, setStep] = useState<Step>("hub");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [showWeakAreas, setShowWeakAreas] = useState(false);
  const [hubStats, setHubStats] = useState(defaultHubStats);
  const cardProgressSnapshots = useRef(new Map<number, ReturnType<typeof getCardProgress>>()).current;

  const [highlight, setHighlight] = useState<{ text: string; x: number; y: number } | null>(null);
  const [connectedTerms, setConnectedTerms] = useState<{ text: string; terms: Term[] } | null>(null);
  const [cardEditor, setCardEditor] = useState<{ front: string; back: string } | null>(null);
  const [cardEditorDeckId, setCardEditorDeckId] = useState<string>(""); // "" none, "new", or an existing deck id
  const [cardEditorNewDeckName, setCardEditorNewDeckName] = useState("");
  const [decks, setDecks] = useState<StudyDeck[]>([]);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardRatings, setCardRatings] = useState<Record<number, FocusRating>>({});
  const [flashcardsFullscreen, setFlashcardsFullscreen] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const [results, setResults] = useState<{ correct: boolean }[]>([]);
  const [practiceResetKey, setPracticeResetKey] = useState(0);
  const [practiceState, setPracticeState] = useState<{ question: PracticeQuestion; index: number; answered: boolean; selectedOption: number | null } | null>(null);

  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);
  const [showMistakes, setShowMistakes] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const [proactiveTip, setProactiveTip] = useState<ProactiveTip>(null);
  const [tipsShown, setTipsShown] = useState<Set<string>>(new Set());
  // Closed by default—Studium AI should stay out of the way until the
  // student actually wants it, not take up a third of the screen on load.
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (lesson) setBookmarks(getBookmarkedCards(lesson.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.lesson]);

  useEffect(() => {
    function refreshDecks() { setDecks(getDecks()); }
    refreshDecks();
    window.addEventListener(STUDY_DECKS_EVENT, refreshDecks);
    return () => window.removeEventListener(STUDY_DECKS_EVENT, refreshDecks);
  }, []);

  // Proactive tips: genuinely drawn from this lesson's own real content
  // (key takeaways) or real recent behavior (missed answers)—not from a
  // live model. Each fires once per lesson session.
  useEffect(() => {
    if (!lesson) return;
    if (step === "flashcards" && !tipsShown.has("flashcards-takeaway") && lesson.keyTakeaways.length > 0) {
      setProactiveTip({ icon: "💡", text: lesson.keyTakeaways[0], sourceLabel: "From this lesson's key takeaways", actionLabel: "Ask about this", actionPrompt: `Tell me more about this: "${lesson.keyTakeaways[0]}"` });
      setTipsShown(s => new Set(s).add("flashcards-takeaway"));
    }
    if (step === "practice" && !tipsShown.has("practice-connection") && lesson.sections[0]?.keyTerms[0]) {
      const kt = lesson.sections[0].keyTerms[0];
      setProactiveTip({ icon: "🔗", text: `This connects to "${kt.term}": ${kt.definition}`, sourceLabel: "From this lesson's key terms", actionLabel: "Explain the connection", actionPrompt: `Explain how this connects: "${kt.term}" — ${kt.definition}` });
      setTipsShown(s => new Set(s).add("practice-connection"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (results.length < 2) return;
    const lastTwo = results.slice(-2);
    if (lastTwo.every(r => !r.correct) && !tipsShown.has("miss-streak")) {
      setProactiveTip({ icon: "⚠️", text: "You've missed the last two in a row—ask your tutor for a hint before continuing.", sourceLabel: "Based on your recent answers", actionLabel: "Get a hint" });
      setTipsShown(s => new Set(s).add("miss-streak"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  // Practice is the one place Studium AI opens itself—applying what you
  // just read benefits from a tutor right there, unlike the Learn view
  // (kept closed by default on purpose). Runs once per transition into
  // Practice, so collapsing it back afterward sticks until you leave and
  // re-enter.
  useEffect(() => {
    if (step === "practice") setPanelOpen(true);
  }, [step]);

  // Real progress across the three study methods, not a fabricated
  // sequence position: Learn counts once the lesson's ever been completed
  // (or reached this session), Flashcards is the fraction of this lesson's
  // cards with any spaced-repetition history, Practice is whether it's
  // been attempted at all—durable signals, not guesses. Computed here
  // (post-mount, real localStorage available) rather than inline during
  // render, which would read empty server-side storage and mismatch.
  useEffect(() => {
    if (!lesson) return;
    const lessonCardIds = lesson.flashcards.map((_, i) => `lesson:${lesson.id}:${i}`);
    const cardsStarted = lessonCardIds.filter(isCardStarted).length;
    const flashcardFraction = lessonCardIds.length ? cardsStarted / lessonCardIds.length : 0;
    const learnDone = !!getLessonEntry(lesson.id) || stepOrder.indexOf(step) >= 1;
    const practicedDone = hasPracticed(lesson.id);
    const realProgressPercent = Math.round(100 * ((learnDone ? 1 : 0) + flashcardFraction + (practicedDone ? 1 : 0)) / 3);
    setHubStats({ realProgressPercent, recommendation: getTopicRecommendation(lesson.id), hubWeakConcepts: getWeakConcepts(lesson.id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, lesson?.id, results, cardRatings]);

  if (!lesson) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Lesson content isn't available yet.</p>
      <Link href={`/dashboard/learning-paths/mcat/${params.section}/${params.subject}`} className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back</Link>
    </section>;
  }

  const section = findSection(lesson.sectionId);
  const subject = findSubject(lesson.sectionId, lesson.subjectId);
  const level = getLevelInfo(getTotalKP());
  const missedConcepts = Array.from(new Set(results.map((r, i) => !r.correct ? lesson.practiceQuestions[i]?.concept : null).filter((c): c is string => !!c)));

  const tutorContext: TutorContext = {
    sectionName: section?.shortTitle ?? lesson.sectionId,
    subjectName: subject?.name ?? lesson.subjectId,
    lessonTitle: lesson.title,
    lessonId: lesson.id,
    currentStep: stepLabels[step],
    currentFlashcard: step === "flashcards" ? lesson.flashcards[cardIndex] : null,
    currentPracticeQuestion: step === "practice" && practiceState
      ? { question: practiceState.question.question, studentAnswer: practiceState.answered && practiceState.selectedOption !== null ? practiceState.question.options[practiceState.selectedOption] : null }
      : null,
    recentMistakes: missedConcepts,
    studentLevel: `Level ${level.level} · ${level.name}`
  };

  function handleMouseUp() {
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setHighlight({ text: sel.toString().trim().slice(0, 300), x: rect.left + rect.width / 2, y: rect.top });
    setConnectedTerms(null);
  }

  function sendToTutor(text: string) {
    sendMessage(lesson!.id, text, getTutorMode(), tutorContext);
    setHighlight(null);
  }

  // "Explain with AI" on a flashcard—opens the drawer (if collapsed) and
  // immediately sends a real, card-specific prompt, rather than just
  // opening to an empty chat and making the student type it themselves.
  function askAIAboutCard() {
    setPanelOpen(true);
    sendToTutor(`Explain "${lesson!.flashcards[cardIndex].front}" in the context of ${lesson!.title}.`);
  }

  // Scientific Method prototype's "✨ Studium AI" toolbar button and its
  // per-concept "🧠 Teach Me"—opens the same real AI panel/chat every other
  // trigger on this page uses, optionally with a concept-specific prompt.
  function openAIPanel(prompt?: string) {
    setPanelOpen(true);
    if (prompt) sendToTutor(prompt);
  }

  function handleConnectConcepts() {
    if (!highlight) return;
    const segments = detectTerms(highlight.text);
    const terms = segments.filter(s => s.type === "term").map(s => (s as { term: Term }).term);
    setConnectedTerms({ text: highlight.text, terms });
    setHighlight(null);
  }

  function handleCreateFlashcard() {
    if (!highlight) return;
    setCardEditor({ front: highlight.text, back: "" });
    setCardEditorDeckId("");
    setCardEditorNewDeckName("");
    setHighlight(null);
  }

  function handleSaveHighlight() {
    if (!highlight) return;
    addSavedHighlight({ text: highlight.text, sourceLessonId: lesson!.id, sourceLessonTitle: lesson!.title });
    setSavedFlash(highlight.text);
    setHighlight(null);
    setTimeout(() => setSavedFlash(null), 1800);
  }

  function submitCardEditor() {
    if (!cardEditor || !cardEditor.front.trim()) return;
    const card = addPersonalFlashcard({ front: cardEditor.front, back: cardEditor.back, sourceLessonId: lesson!.id, sourceLessonTitle: lesson!.title });
    if (cardEditorDeckId === "new" && cardEditorNewDeckName.trim()) {
      createDeck(cardEditorNewDeckName.trim(), [card.id]);
    } else if (cardEditorDeckId) {
      addCardsToDeck(cardEditorDeckId, [card.id]);
    }
    setCardEditor(null);
  }

  function flipCard() { setFlipped(f => !f); }

  // Manual browsing (Prev/Next arrows, Left/Right keys)—independent from
  // rateCard's rate-then-auto-advance flow below, so you can look back at
  // an earlier card without it counting as a fresh review.
  function navigateCard(index: number) {
    setCardIndex(index);
    setFlipped(false);
  }

  // Single source of truth for rating a flashcard—used by both the embedded
  // card view and the fullscreen Focus Mode overlay, so toggling fullscreen
  // never desyncs progress between the two. Also writes through to the
  // shared card-progress store (lib/flashcardLibrary.ts) under this card's
  // unified id, so the same real spaced-repetition state shows up in the
  // Flashcard Library and any deck this card gets added to—not a second,
  // disconnected rating system.
  function rateCard(rating: FocusRating) {
    const cardId = `lesson:${lesson!.id}:${cardIndex}`;
    cardProgressSnapshots.set(cardIndex, getCardProgress(cardId));
    reviewLibraryCard(cardId, rating);
    setCardRatings(r => ({ ...r, [cardIndex]: rating }));
    setFlipped(false);
    if (cardIndex + 1 < lesson!.flashcards.length) setCardIndex(i => i + 1);
    else setStep("practice");
  }

  function undoCardRating(focusCard: FocusCard) {
    const idx = Number(focusCard.id);
    const cardId = `lesson:${lesson!.id}:${idx}`;
    restoreLibraryCard(cardId, cardProgressSnapshots.get(idx) ?? null);
    setCardRatings(r => { const next = { ...r }; delete next[idx]; return next; });
    setCardIndex(idx);
    setFlipped(false);
  }

  // Direct entry points from the Study Hub—any mode can be opened without
  // visiting the others first. Starts the session timer on first use,
  // whichever mode the student picks.
  function enterMode(target: Step) {
    if (startedAt === null) setStartedAt(Date.now());
    setStep(target);
  }

  function toggleBookmark() {
    toggleBookmarkedCard(lesson!.id, cardIndex);
    setBookmarks(getBookmarkedCards(lesson!.id));
  }

  // Fired by PracticeQuiz on every graded question—the lesson page keeps
  // its own `results` as the source of truth for the Review step's
  // accuracy/strong/weak-concept breakdown, and persists the attempt for
  // Weak Areas/the Study Hub recommendation to survive a reload.
  function handlePracticeAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    setResults(r => [...r, { correct }]);
    logAttempt(lesson!.id, q.concept, correct, q.id);
  }

  function retryFlashcards() {
    setCardIndex(0);
    setFlipped(false);
    setStep("flashcards");
  }

  function retryPractice() {
    setResults([]);
    setPracticeResetKey(k => k + 1); // remounts PracticeQuiz with fresh internal state
    setStep("practice");
  }

  function finishLesson() {
    const accuracy = results.length ? Math.round((results.filter(r => r.correct).length / results.length) * 100) : 0;
    const timeSpentMinutes = Math.max(1, Math.round((Date.now() - (startedAt ?? Date.now())) / 60000));
    const kp = 40 + Math.round((accuracy / 100) * 20);
    completeLesson(lesson!.id, { timeSpentMinutes, quizScore: accuracy, flashcardsCompleted: lesson!.flashcards.length });
    logStudyMinutes(timeSpentMinutes);
    logFlashcards(lesson!.flashcards.length);
    logQuiz();
    const result = awardLessonKP(kp);
    setClaimResult(result);
    showKnowledgeToast(result.kpAwarded);
    if (result.leveledUp) {
      const info = getLevelInfo(result.totalKP);
      setLevelUpInfo({ level: info.level, name: info.name });
    }
    setStep("complete");
  }

  function answerConfidence(conf: Confidence) {
    setLessonConfidence(lesson!.id, conf);
    setConfidence(conf);
  }

  const accuracy = results.length ? Math.round((results.filter(r => r.correct).length / results.length) * 100) : 0;
  const conceptResults: Record<string, boolean[]> = {};
  lesson.practiceQuestions.forEach((q, i) => { (conceptResults[q.concept] ??= []).push(!!results[i]?.correct); });
  const strongConcepts = Object.entries(conceptResults).filter(([, arr]) => arr.every(Boolean)).map(([c]) => c);
  const weakConcepts = Object.entries(conceptResults).filter(([, arr]) => arr.some(r => !r)).map(([c]) => c);
  const missedQuestions = lesson.practiceQuestions.filter((_, i) => results[i] && !results[i].correct);

  const { realProgressPercent, recommendation, hubWeakConcepts } = hubStats;

  function goToRecommendation(action: RecommendedAction) {
    if (action === "learn") enterMode("learn");
    else if (action === "flashcards") enterMode("flashcards");
    else if (action === "practice") enterMode("practice");
    else if (action === "weak-areas") setShowWeakAreas(true);
  }

  return <div className="relative flex bg-white dark:bg-[#0d1917]" style={{ minHeight: "calc(100vh - 89px)" }}>
    {/* LEFT — lesson content, ~65% width; widens to a genuinely full-width
        reading mode (not just empty space) once the AI panel is collapsed */}
    <section className={`min-w-0 flex-1 px-6 py-10 transition-[max-width] duration-300 sm:px-10 sm:py-14 ${documentLessonContent && (step === "hub" || step === "learn") ? "lg:px-14" : `lg:mx-auto ${panelOpen ? "lg:max-w-3xl" : "lg:max-w-5xl"}`}`} onMouseUp={(step === "learn" || (documentLessonContent && step === "hub")) ? handleMouseUp : undefined}>
      <div className="flex items-center justify-between gap-3">
        <Link href={`/dashboard/learning-paths/mcat/${params.section}/${params.subject}`} className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to path</Link>
        <div className="flex items-center gap-2">
          {step !== "hub" && <button type="button" onClick={() => setStep("hub")} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-3 py-1.5 text-xs font-bold text-heading shadow-soft transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"><LayoutGrid size={13} />Study Hub</button>}
        </div>
      </div>

      {/* Document lessons supply their own title/meta/progress header (see
          ScientificMethodLesson below), so the original header block only
          renders for every other lesson, and for a document lesson's own
          flashcards/practice/review/complete steps where it's unchanged. */}
      {!(documentLessonContent && (step === "hub" || step === "learn")) && <div className="max-w-none">
        <span className="eyebrow"><Sparkles size={13} />{lesson.difficulty}</span>
        <h1 className="display mt-5 text-3xl leading-tight sm:text-4xl">{lesson.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1"><Clock3 size={13} />{lesson.estimatedMinutes} min</span>
          <span>{lesson.difficulty}</span>
          {step !== "hub" && <span>{stepLabels[step]}</span>}
        </div>
        {step !== "hub" && <div className="mt-3 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${realProgressPercent}%` }} /></div>}
      </div>}

      <div className="mt-8 max-w-none">
        {/* Document lessons: "hub" and "learn" merge into one redesigned,
            concept-based experience—see documentLessonContent's definition
            above. Every other lesson (and a document lesson's own
            flashcards/practice/review/complete steps) renders exactly as
            before via the unchanged blocks below. */}
        {documentLessonContent && (step === "hub" || step === "learn") && <ScientificMethodLesson
          lesson={lesson}
          content={documentLessonContent}
          onOpenAI={openAIPanel}
          onContinueToFlashcards={() => setStep("flashcards")}
        />}

        {/* Study Hub: recommends what to do next from real progress signals,
            and lets the student jump into any mode directly—curriculum
            (this lesson, in this subject) stays structured, but the study
            method inside it is the student's choice, not a forced order. */}
        {!documentLessonContent && step === "hub" && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-7 shadow-soft sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Your progress on this topic</p>
              <p className="mt-1 text-3xl font-extrabold text-heading">{realProgressPercent}%</p>
            </div>
            <div className="h-2 w-full max-w-[220px] flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${realProgressPercent}%` }} /></div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button type="button" onClick={() => enterMode("learn")} className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-5 text-sm font-bold text-heading transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><BookOpen size={18} /></span>Learn
            </button>
            <button type="button" onClick={() => enterMode("flashcards")} className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-5 text-sm font-bold text-heading transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 dark:bg-sky-500/20 dark:text-sky-300 text-sky-700"><Layers size={18} /></span>Flashcards
            </button>
            <button type="button" onClick={() => enterMode("practice")} className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-5 text-sm font-bold text-heading transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-700"><Target size={18} /></span>Practice
            </button>
            <button type="button" onClick={() => setShowWeakAreas(s => !s)} className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border py-5 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-soft ${showWeakAreas ? "border-amber-300 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 text-amber-800" : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] text-heading hover:border-amber-200"}`}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-700"><AlertTriangle size={18} /></span>Weak Areas
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white dark:bg-[#0d1917] text-teal-600 shadow-soft"><Sparkles size={17} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-heading">{recommendation.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{recommendation.detail}</p>
            </div>
            {recommendation.action !== "caught-up" && <button type="button" onClick={() => goToRecommendation(recommendation.action)} className="shrink-0 cursor-pointer rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Go</button>}
          </div>

          {showWeakAreas && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/60 dark:bg-amber-500/15 p-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-amber-800">Weak Areas</p>
            {hubWeakConcepts.length === 0
              ? <p className="mt-2 text-sm text-amber-900">Nothing flagged yet—concepts show up here once you've missed them a couple of times in practice.</p>
              : <div className="mt-3 space-y-2.5">
                {hubWeakConcepts.map(w => <div key={w.concept} className="flex items-center justify-between gap-3 rounded-xl bg-white dark:bg-[#0d1917] px-4 py-2.5 shadow-soft">
                  <span className="text-sm font-bold text-heading">{w.concept}</span>
                  <span className="text-xs font-bold text-amber-700">Missed {w.missCount}×</span>
                </div>)}
                <button type="button" onClick={retryPractice} className="mt-1 cursor-pointer text-xs font-extrabold text-teal-600 hover:text-teal-700">Practice this lesson again →</button>
              </div>}
          </div>}
        </div>}

        {/* Reading, styled like a document/lecture handout rather than a
            stack of chat bubbles: one continuous page, section dividers
            instead of separate boxed cards, a real glossary (not click-to-
            reveal chips), and the lesson's real key takeaways folded in as
            a summary callout at the end instead of a separate step. */}
        {!documentLessonContent && step === "learn" && <div>
          <article className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-8 shadow-sm sm:p-12">
            {lesson.sections.map((sec, i) => <div key={sec.heading} className={i > 0 ? "mt-9 border-t border-slate-100 dark:border-white/10 pt-9" : ""}>
              <h2 className="font-display text-xl font-extrabold tracking-tight text-heading">{sec.heading}</h2>
              <p className="mt-3 select-text text-[15px] leading-[1.85] text-slate-700 dark:text-slate-300"><InteractiveText text={sec.body} /></p>
              {sec.keyTerms.length > 0 && <dl className="mt-4 rounded-xl bg-[#f9fcfc] dark:bg-white/5 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Glossary</p>
                <div className="mt-2 space-y-1.5">
                  {sec.keyTerms.map(kt => <div key={kt.term}>
                    <dt className="inline text-xs font-extrabold text-teal-700">{kt.term}</dt>
                    <dd className="inline text-xs leading-relaxed text-slate-500"> — {kt.definition}</dd>
                  </div>)}
                </div>
              </dl>}
            </div>)}

            <div className="mt-10 rounded-2xl border-l-4 border-teal-500 bg-teal-50/70 dark:bg-teal-500/15 p-6">
              <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-teal-800 dark:text-teal-300"><Lightbulb size={14} />Key Takeaways</h3>
              <ul className="mt-3 space-y-2.5">
                {lesson.keyTakeaways.map(t => <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-teal-900 dark:text-teal-200"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />{t}</li>)}
              </ul>
            </div>
          </article>

          <p className="mt-3 px-1 text-xs text-slate-400">Tip: highlight any sentence above for more options.</p>
          <button type="button" onClick={() => setStep("flashcards")} className="mt-5 cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Continue to Flashcards</button>
        </div>}

        {step === "flashcards" && <LessonFlashcardDeck
          cards={lesson.flashcards}
          cardIndex={cardIndex}
          flipped={flipped}
          bookmarked={bookmarks.includes(cardIndex)}
          onFlip={flipCard}
          onNavigate={navigateCard}
          onRate={rateCard}
          onBookmarkToggle={toggleBookmark}
          onDontUnderstand={() => sendToTutor(`I don't understand: "${lesson.flashcards[cardIndex].front}"`)}
          onFullscreen={() => setFlashcardsFullscreen(true)}
          onAskAI={askAIAboutCard}
        />}

        {flashcardsFullscreen && <FlashcardFocusMode
          deckTitle={lesson.title}
          initialIndex={cardIndex}
          cards={lesson.flashcards.map((c, i): FocusCard => ({ id: String(i), front: c.front, back: c.back }))}
          onExit={() => setFlashcardsFullscreen(false)}
          onRate={(card, rating) => rateCard(rating)}
          onUndo={undoCardRating}
          tutorContext={{ chatKey: lesson.id, subjectName: tutorContext.subjectName, sectionName: tutorContext.sectionName }}
        />}

        {step === "practice" && <PracticeQuiz
          key={practiceResetKey}
          questions={lesson.practiceQuestions.map((q, i) => ({ ...q, id: `${lesson.id}:${i}`, lessonTitle: lesson.title }))}
          onAnswer={handlePracticeAnswer}
          onAskTutor={q => sendToTutor(`Give me a hint about: "${q.question}"`)}
          onComplete={() => setStep("review")}
          onQuestionChange={setPracticeState}
          completeLabel="See AI Review"
        />}

        {step === "review" && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
          <h2 className="text-lg font-extrabold tracking-tight">AI Review</h2>
          <p className="mt-1 text-sm text-slate-500">You scored {accuracy}% on this lesson's practice questions.</p>
          {strongConcepts.length > 0 && <p className="mt-4 text-sm leading-relaxed text-slate-600"><span className="font-extrabold text-teal-700">You performed well on:</span> {strongConcepts.join(", ")}.</p>}
          {weakConcepts.length > 0 && <p className="mt-2 text-sm leading-relaxed text-slate-600"><span className="font-extrabold text-rose-600">You should review:</span> {weakConcepts.join(", ")}.</p>}
          {weakConcepts.length === 0 && <p className="mt-2 text-sm leading-relaxed text-slate-600">You got every question right—nice work.</p>}

          {showMistakes && missedQuestions.length > 0 && <div className="mt-5 space-y-3 rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">What you missed</p>
            {missedQuestions.map(q => <div key={q.question} className="border-t border-slate-100 dark:border-white/10 pt-3 first:border-0 first:pt-0">
              <p className="text-sm font-bold text-heading">{q.question}</p>
              <p className="mt-1 text-xs leading-relaxed text-teal-700">{q.optionExplanations[q.correctIndex]}</p>
            </div>)}
          </div>}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button type="button" onClick={() => setStep("learn")} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Review Lesson</button>
            <button type="button" onClick={() => setAiNotice("Generating new questions isn't connected in this demo yet.")} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Generate More Questions</button>
            <button type="button" onClick={() => setAiNotice("Generating new flashcards isn't connected in this demo yet.")} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Generate More Flashcards</button>
            {missedQuestions.length > 0 && <button type="button" onClick={() => setShowMistakes(s => !s)} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">{showMistakes ? "Hide Mistakes" : "Explain My Mistakes"}</button>}
          </div>
          {aiNotice && <p className="mt-3 text-xs font-bold text-slate-400">{aiNotice}</p>}

          <button type="button" onClick={finishLesson} className="mt-6 cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Finish Lesson</button>
        </div>}

        {step === "complete" && claimResult && <div className="relative rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-8">
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-600"><PartyPopper size={30} /></span>
            <h2 className="display mt-4 text-2xl">Lesson complete!</h2>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-4 text-center"><p className="text-xl font-extrabold text-heading">{accuracy}%</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Accuracy</p></div>
            <div className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-4 text-center"><p className="text-xl font-extrabold text-heading">{Math.max(1, Math.round((Date.now() - (startedAt ?? Date.now())) / 60000))} min</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Time spent</p></div>
            <div className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-4 text-center">
              <p className="text-xl font-extrabold text-teal-600">+{claimResult.kpAwarded}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">KP earned</p>
            </div>
            <div className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-4 text-center"><p className="text-xl font-extrabold text-heading">Lvl {claimResult.toLevel}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Updated level</p></div>
          </div>

          {confidence === null ? <div className="mt-7 border-t border-slate-100 dark:border-white/10 pt-6 text-center">
            <p className="text-sm font-bold text-heading">How confident do you feel with this topic?</p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <button type="button" onClick={() => answerConfidence("understand")} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-teal-200 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 py-3 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300"><CheckCircle2 size={15} />I understand it well</button>
              <button type="button" onClick={() => answerConfidence("practice")} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 py-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300"><Meh size={15} />I need more practice</button>
              <button type="button" onClick={() => answerConfidence("confused")} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 py-3 text-xs font-extrabold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300"><Frown size={15} />I'm still confused</button>
            </div>
          </div> : <div className="mt-7 border-t border-slate-100 dark:border-white/10 pt-6">
            {confidence === "understand" && <p className="text-center text-sm text-teal-700">Nice work—the next lesson is unlocked.</p>}
            {confidence === "practice" && <div className="text-center">
              <p className="text-sm text-slate-600">No problem—here's another pass at the flashcards and practice questions.</p>
              <div className="mt-4 flex justify-center gap-2.5">
                <button type="button" onClick={retryFlashcards} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Practice flashcards again</button>
                <button type="button" onClick={retryPractice} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Retry practice questions</button>
              </div>
            </div>}
            {confidence === "confused" && <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Simplified explanation</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{lesson.simplifiedExplanation}</p>
              {lesson.prerequisiteLessonId && <Link href={`/dashboard/learning-paths/mcat/${params.section}/${params.subject}/${lesson.prerequisiteLessonId}`} className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Review the prerequisite lesson</Link>}
            </div>}

            <div className="mt-6 text-center">
              <Link href={`/dashboard/learning-paths/mcat/${params.section}/${params.subject}`} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Continue to Next Lesson<ChevronRight size={16} /></Link>
            </div>
          </div>}
        </div>}
      </div>

      {/* Highlight popup: 🧠 Explain · 📝 Create Flashcard · 🔗 Connect Concepts · ❓ Ask AI · ⭐ Save */}
      {highlight && step === "learn" && <div
        style={{ position: "fixed", left: highlight.x, top: Math.max(8, highlight.y - 52) }}
        className="z-40 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-ink px-2 py-1.5 text-white shadow-lift"
      >
        <button type="button" onClick={() => sendToTutor(`Explain: "${highlight.text}"`)} title="Explain" className="cursor-pointer rounded-full px-2 py-1 text-xs font-bold hover:bg-white/10">🧠 Explain</button>
        <button type="button" onClick={handleCreateFlashcard} title="Create Flashcard" className="cursor-pointer rounded-full px-2 py-1 text-xs font-bold hover:bg-white/10">📝 Flashcard</button>
        <button type="button" onClick={handleConnectConcepts} title="Connect Concepts" className="cursor-pointer rounded-full px-2 py-1 text-xs font-bold hover:bg-white/10">🔗 Connect</button>
        <button type="button" onClick={() => sendToTutor(`Question about: "${highlight.text}"`)} title="Ask AI" className="cursor-pointer rounded-full px-2 py-1 text-xs font-bold hover:bg-white/10">❓ Ask</button>
        <button type="button" onClick={handleSaveHighlight} title="Save" className="cursor-pointer rounded-full px-2 py-1 text-xs font-bold hover:bg-white/10">⭐ Save</button>
      </div>}

      <AnimatePresence>
        {savedFlash && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-bold text-white shadow-lift"><Star size={13} className="text-amber-400" fill="currentColor" />Saved to your tutor panel</motion.div>}
      </AnimatePresence>

      {/* Connect Concepts results panel */}
      <AnimatePresence>
        {connectedTerms && <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-5 right-5 z-40 w-full max-w-xs rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-lift"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700"><Link2 size={13} />Connected Concepts</p>
            <button type="button" onClick={() => setConnectedTerms(null)} className="cursor-pointer text-slate-400 hover:text-heading"><X size={14} /></button>
          </div>
          <p className="mt-2 rounded-lg bg-[#f9fcfc] dark:bg-white/5 p-2 text-xs italic text-slate-500">"{connectedTerms.text}"</p>
          {connectedTerms.terms.length > 0 ? <div className="mt-2 space-y-2">
            {connectedTerms.terms.map(t => <div key={t.id}><p className="text-xs font-extrabold text-heading">{t.name}</p><p className="text-[11px] leading-relaxed text-slate-500">{t.definition}</p></div>)}
          </div> : <p className="mt-2 text-xs text-slate-500">No matching terms found in the terminology database for this selection.</p>}
        </motion.div>}
      </AnimatePresence>

      {/* Create Flashcard editor */}
      <AnimatePresence>
        {cardEditor && <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          onClick={() => setCardEditor(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0d1917] p-6 shadow-lift"
          >
            <h3 className="text-base font-extrabold text-heading">New Flashcard</h3>
            <p className="mt-1 text-xs text-slate-500">Front comes from your highlight. Write your own answer for the back—no live AI to write it for you yet.</p>
            <label className="mt-4 block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Front</span>
              <textarea value={cardEditor.front} onChange={e => setCardEditor(c => c && { ...c, front: e.target.value })} rows={2} className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm outline-none focus:border-teal-400" />
            </label>
            <label className="mt-3 block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Back</span>
              <textarea value={cardEditor.back} onChange={e => setCardEditor(c => c && { ...c, back: e.target.value })} rows={2} placeholder="Write the answer..." className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm outline-none focus:border-teal-400" />
            </label>
            <label className="mt-3 block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Add to deck (optional)</span>
              <select value={cardEditorDeckId} onChange={e => setCardEditorDeckId(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm font-semibold text-heading outline-none focus:border-teal-400">
                <option value="">Just save to My Cards</option>
                {decks.map(d => <option key={d.id} value={d.id}>{d.name} ({d.cardIds.length})</option>)}
                <option value="new">+ New deck…</option>
              </select>
              {cardEditorDeckId === "new" && <input autoFocus value={cardEditorNewDeckName} onChange={e => setCardEditorNewDeckName(e.target.value)} placeholder="Deck name" className="mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm font-semibold text-heading outline-none focus:border-teal-400" />}
            </label>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setCardEditor(null)} className="flex-1 cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-sm font-bold text-slate-500">Cancel</button>
              <button type="button" onClick={submitCardEditor} className="flex-1 cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-sm font-bold text-white">Add to My Cards</button>
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {levelUpInfo && <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          onClick={() => setLevelUpInfo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
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
    </section>

    {/* RIGHT — Studium AI workspace, ~35% width, collapsible */}
    <AnimatePresence initial={false}>
      {panelOpen && <motion.aside
        initial={{ width: 0, opacity: 0 }} animate={{ width: "35%", opacity: 1 }} exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="sticky top-0 hidden h-screen min-w-[360px] max-w-[460px] shrink-0 overflow-hidden border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-soft lg:block"
      >
        <div className="h-full min-w-[360px]">
          <AiTutorPanel context={tutorContext} proactiveTip={proactiveTip} onDismissTip={() => setProactiveTip(null)} onCollapse={() => setPanelOpen(false)} />
        </div>
      </motion.aside>}
    </AnimatePresence>

    {/* Persistent floating trigger—the one way to open Studium AI, always
        on screen regardless of step or panel state. */}
    <AiFabTrigger
      open={panelOpen}
      onToggle={() => setPanelOpen(o => !o)}
      hasContext={!!tutorContext.currentFlashcard}
      contextLabel={tutorContext.currentFlashcard ? `Context: Flashcard - "${tutorContext.currentFlashcard.front}"` : undefined}
    />
  </div>;
}
