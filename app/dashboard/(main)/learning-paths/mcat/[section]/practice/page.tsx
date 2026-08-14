"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Check, CheckSquare, Clock3, GraduationCap, Info, Layers, ListChecks, ListFilter, Sparkles, Square,
  TriangleAlert, X, Zap
} from "lucide-react";
import { FlashcardFocusMode, FocusCard, FocusRating } from "@/components/flashcard-focus-mode";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";
import { DeckPicker } from "@/components/deck-picker";
import { addCardsToDeck } from "@/lib/flashcardDecks";
import { findSection } from "@/lib/mcatPath";
import { getSectionLessonIds, getSectionPracticeQuestions, getUniqueConcepts, getUnusedMcatPracticeQuestions, SectionPracticeQuestion } from "@/lib/mcatConcepts";
import { getAllLibraryCards, getCardProgress, LibraryCard, restoreLibraryCard, reviewLibraryCard } from "@/lib/flashcardLibrary";
import { getWeakConcepts, logAttempt } from "@/lib/practiceHistory";

const SECONDS_PER_QUESTION = 95;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toQuizItem(q: SectionPracticeQuestion): PracticeQuizItem {
  return { ...q.question, id: q.id, lessonTitle: q.lessonTitle };
}

function recommendedMinutes(questionCount: number): number {
  return Math.max(1, Math.round((questionCount * SECONDS_PER_QUESTION) / 60));
}

type TargetPool = "unused" | "weak";
type Mode = "tutor" | "timed";
type DrillCount = number | "all";
type Session = { questions: PracticeQuizItem[]; title: string; contextLabel?: string; timed: boolean; timeLimitSeconds?: number } | null;
type PendingSession = { questions: PracticeQuizItem[]; title: string; contextLabel?: string } | null;
type BuilderTab = "quiz" | "flashcards";

function possessive(name: string): string {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

// "Practice this section" lands here—one page, real quiz building AND real
// flashcard-deck building, both scoped to this section's own lessons. The
// quiz half mirrors the subject-level Practice tab's Configure Drill
// Builder (lib/mcatConcepts.ts's real question pool, just section-wide
// instead of one subject); the flashcard half is new, built on the same
// real infrastructure as everywhere else cards get added to a deck
// (DeckPicker + lib/flashcardDecks.ts)—no separate deck UI invented.
export default function MCATSectionPracticePage({ params }: { params: { section: string } }) {
  const section = findSection(params.section);
  const sectionLessonIds = useMemo(() => section ? new Set(getSectionLessonIds(section.id)) : new Set<string>(), [section]);

  const [tab, setTab] = useState<BuilderTab>("quiz");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ---- Quiz builder ----
  const quizPool = useMemo(() => section ? getSectionPracticeQuestions(section.id) : [], [section]);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<"discrete" | "passage">("discrete");
  const [targetPool, setTargetPool] = useState<TargetPool>("unused");
  const [drillCount, setDrillCount] = useState<DrillCount>("all");
  const [mode, setMode] = useState<Mode>("tutor");
  const [session, setSession] = useState<Session>(null);
  const [pendingSession, setPendingSession] = useState<PendingSession>(null);
  const [setupMinutes, setSetupMinutes] = useState(0);

  useEffect(() => {
    if (getWeakConcepts().length > 0) setTargetPool("weak");
  }, []);

  const availableTopics = useMemo(() => getUniqueConcepts(quizPool), [quizPool]);
  const weakConceptNames = useMemo(() => new Set(getWeakConcepts().map(w => w.concept)), []);

  const { drillPool, usedFallback } = useMemo(() => {
    if (format === "passage") return { drillPool: [] as SectionPracticeQuestion[], usedFallback: false };
    let pool = quizPool;
    if (selectedTopics.size > 0) pool = pool.filter(q => selectedTopics.has(q.question.concept));
    if (targetPool === "weak") return { drillPool: pool.filter(q => weakConceptNames.has(q.question.concept)), usedFallback: false };
    const unused = getUnusedMcatPracticeQuestions(pool);
    if (unused.length > 0 || pool.length === 0) return { drillPool: unused, usedFallback: false };
    return { drillPool: pool, usedFallback: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizPool, selectedTopics, format, targetPool, weakConceptNames]);

  const effectiveCount = drillCount === "all" ? drillPool.length : Math.min(drillCount, drillPool.length);

  function toggleTopic(concept: string) {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (next.has(concept)) next.delete(concept); else next.add(concept);
      return next;
    });
  }

  function openSetup(pending: NonNullable<PendingSession>) {
    setPendingSession(pending);
    setSetupMinutes(recommendedMinutes(pending.questions.length));
  }

  function startDrill() {
    const questions = shuffle(drillPool).slice(0, effectiveCount).map(toQuizItem);
    const title = section?.shortTitle ?? "Practice";
    if (mode === "timed") openSetup({ questions, title, contextLabel: "Section Practice" });
    else setSession({ questions, title, contextLabel: "Section Practice", timed: false });
  }

  function confirmSetupAndStart() {
    if (!pendingSession) return;
    setSession({ ...pendingSession, timed: true, timeLimitSeconds: setupMinutes * 60 });
    setPendingSession(null);
  }

  function handleQuizAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    logAttempt(q.id.split(":")[0], q.concept, correct, q.id);
  }

  // ---- Flashcard deck builder ----
  const sectionCards = useMemo(
    () => getAllLibraryCards().filter(c => c.source === "lesson" && c.lessonId && sectionLessonIds.has(c.lessonId)),
    [sectionLessonIds]
  );
  const cardSubjects = useMemo(() => Array.from(new Set(sectionCards.map(c => c.subject))).sort(), [sectionCards]);
  const [cardQuery, setCardQuery] = useState("");
  const [cardSubjectFilter, setCardSubjectFilter] = useState<string | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const [deckPickerOpen, setDeckPickerOpen] = useState(false);
  const [addedToDeck, setAddedToDeck] = useState(false);
  const [studyCards, setStudyCards] = useState<FocusCard[] | null>(null);
  const cardSnapshots = useMemo(() => new Map<string, ReturnType<typeof getCardProgress>>(), []);

  const visibleCards = useMemo(() => {
    const q = cardQuery.trim().toLowerCase();
    return sectionCards.filter(c => {
      if (cardSubjectFilter && c.subject !== cardSubjectFilter) return false;
      if (q && !c.front.toLowerCase().includes(q) && !c.back.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sectionCards, cardSubjectFilter, cardQuery]);

  function toggleCard(id: string) {
    setSelectedCardIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function selectAllVisible() {
    setSelectedCardIds(prev => new Set([...Array.from(prev), ...visibleCards.map(c => c.id)]));
  }

  function clearCardSelection() {
    setSelectedCardIds(new Set());
  }

  function studySelectedNow() {
    const cards = sectionCards.filter(c => selectedCardIds.has(c.id));
    setStudyCards(cards.map(c => ({ id: c.id, front: c.front, back: c.back, hint: c.lessonTitle ? `From: ${c.lessonTitle}` : null })));
  }

  function handleCardRate(card: FocusCard, rating: FocusRating) {
    cardSnapshots.set(card.id, getCardProgress(card.id));
    reviewLibraryCard(card.id, rating);
  }

  function handleCardUndo(card: FocusCard) {
    restoreLibraryCard(card.id, cardSnapshots.get(card.id) ?? null);
  }

  if (session) {
    return <PracticeQuiz
      questions={session.questions}
      title={session.title}
      contextLabel={session.contextLabel}
      completeLabel="Done"
      onAnswer={handleQuizAnswer}
      onComplete={() => setSession(null)}
      defaultFullscreen
      onExit={() => setSession(null)}
      timed={session.timed}
      timeLimitSeconds={session.timeLimitSeconds}
    />;
  }

  if (studyCards) {
    return <FlashcardFocusMode
      deckTitle={`${section?.shortTitle ?? "Practice"} · Flashcards`}
      cards={studyCards}
      onExit={() => setStudyCards(null)}
      onRate={handleCardRate}
      onUndo={handleCardUndo}
      tutorContext={{ chatKey: `practice:${params.section}`, subjectName: section?.shortTitle ?? "Practice", sectionName: section?.title }}
    />;
  }

  if (pendingSession) {
    const recommended = recommendedMinutes(pendingSession.questions.length);
    const sliderMin = Math.max(1, Math.round(recommended * 0.4));
    const sliderMax = Math.max(sliderMin + 1, Math.round(recommended * 1.8));
    return <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 px-6 py-10 text-center">
      <span className="eyebrow justify-center"><Clock3 size={13} />Session Setup</span>
      <h1 className="display mt-5 text-3xl leading-tight sm:text-4xl">{pendingSession.title}</h1>
      <p className="mt-3 text-base text-slate-500">This test has <span className="font-extrabold text-heading">{pendingSession.questions.length} question{pendingSession.questions.length === 1 ? "" : "s"}</span>.</p>

      <div className="mt-8 w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-7 shadow-soft">
        <p className="text-sm font-bold text-heading">How much time would you like?</p>
        <p className="mt-1 text-xs text-slate-500">Recommended: {recommended} min (~95 sec/question, real MCAT pacing)</p>
        <p className="mt-6 text-4xl font-extrabold text-teal-600 tabular-nums">{setupMinutes}<span className="ml-1.5 text-base font-bold text-slate-400">min</span></p>
        <input type="range" min={sliderMin} max={sliderMax} value={setupMinutes} onChange={e => setSetupMinutes(Number(e.target.value))} className="mt-5 w-full accent-teal-600" />
        <div className="mt-1.5 flex justify-between text-[11px] font-bold text-slate-400">
          <span>{sliderMin} min</span>
          <button type="button" onClick={() => setSetupMinutes(recommended)} className="cursor-pointer text-teal-600 underline decoration-dotted underline-offset-2 hover:text-teal-700">Use recommended</button>
          <span>{sliderMax} min</span>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button type="button" onClick={() => setPendingSession(null)} className="cursor-pointer text-sm font-bold text-slate-500 hover:text-heading">Cancel</button>
        <button type="button" onClick={confirmSetupAndStart} className="cursor-pointer rounded-full bg-accent-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Start Test</button>
      </div>
    </div>;
  }

  if (!section) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Section not found.</p>
      <Link href="/dashboard/learning-paths/mcat" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back to MCAT path</Link>
    </section>;
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href={`/dashboard/learning-paths/mcat/${params.section}`} className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back</Link>
    <span className="eyebrow"><Sparkles size={13} />MCAT</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{section.shortTitle} Practice.</h1>
    <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">Put together a quiz or a flashcard deck from this section's own real lessons.</p>

    <nav className="mt-6 flex flex-wrap gap-2">
      <button type="button" onClick={() => setTab("quiz")} className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-extrabold transition ${tab === "quiz" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"}`}><ListChecks size={13} />Build a Quiz</button>
      <button type="button" onClick={() => setTab("flashcards")} className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-extrabold transition ${tab === "flashcards" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"}`}><Layers size={13} />Build a Flashcard Deck</button>
    </nav>

    <div className="mt-8">
      {tab === "quiz"
        ? <div className="max-w-2xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><ListFilter size={22} /></span>
          <h2 className="mt-5 text-lg font-extrabold tracking-tight text-heading">Configure Drill</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{!mounted ? "Loading…" : quizPool.length === 0 ? "No practice questions have been written for this section yet." : `Build a targeted session from ${possessive(section.shortTitle)} own ${quizPool.length} practice question${quizPool.length === 1 ? "" : "s"}.`}</p>

          {mounted && <>
            <div className="mt-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Topic</p>
              {availableTopics.length === 0
                ? <p className="mt-2 text-xs text-slate-400">No topics available yet.</p>
                : <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
                  {availableTopics.map(topic => <button key={topic} type="button" onClick={() => toggleTopic(topic)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition ${selectedTopics.has(topic) ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{topic}</button>)}
                </div>}
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Question Format</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setFormat("discrete")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${format === "discrete" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{format === "discrete" && <Check size={13} />}Discrete Questions</button>
                <button type="button" onClick={() => setFormat("passage")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${format === "passage" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{format === "passage" && <Check size={13} />}Passage-Based</button>
              </div>
              {format === "passage" && <p className="mt-1.5 text-[11px] font-bold text-amber-600">No passage-based content exists yet—this will return 0 questions.</p>}
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Target Pool</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setTargetPool("unused")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${targetPool === "unused" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All Unused Questions</button>
                <button type="button" onClick={() => setTargetPool("weak")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${targetPool === "weak" ? "border-amber-400 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 text-amber-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-amber-200"}`}><TriangleAlert size={13} />Weak Areas Only</button>
              </div>
              {usedFallback && <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 p-3">
                <Info size={14} className="mt-0.5 shrink-0 text-teal-600" />
                <p className="text-[11px] font-semibold leading-relaxed text-teal-800 dark:text-teal-300">You&apos;ve completed all unused questions in this section! Automatically including previously answered questions so you can review.</p>
              </div>}
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Question Count</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[5, 10, 15, 20].filter(n => n < drillPool.length).map(n => <button key={n} type="button" onClick={() => setDrillCount(n)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${drillCount === n ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{n}</button>)}
                <button type="button" onClick={() => setDrillCount("all")} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${drillCount === "all" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All matching ({drillPool.length})</button>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Mode</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setMode("tutor")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${mode === "tutor" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}><GraduationCap size={13} />Tutor Mode</button>
                <button type="button" onClick={() => setMode("timed")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${mode === "timed" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}><Clock3 size={13} />Timed</button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">{mode === "tutor" ? "See correct answers and explanations right after each question." : "Feedback is withheld until a results summary at the end—real exam conditions. You'll set the time on the next screen."}</p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-white/10 pt-5">
              <p className="text-xs font-bold text-slate-500">{effectiveCount < drillPool.length ? `Using ${effectiveCount} of ${drillPool.length} matching questions` : `${drillPool.length} question${drillPool.length === 1 ? "" : "s"} match`}</p>
              <button type="button" onClick={startDrill} disabled={drillPool.length === 0} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"><Zap size={14} />{mode === "timed" ? "Next: Set Time" : "Start Drill"}</button>
            </div>
          </>}
        </div>

        : <div className="max-w-3xl">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600"><Layers size={22} /></span>
            <h2 className="mt-5 text-lg font-extrabold tracking-tight text-heading">Build a Flashcard Deck</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{!mounted ? "Loading…" : sectionCards.length === 0 ? "No flashcards have been written for this section yet." : `Pick cards from ${possessive(section.shortTitle)} own ${sectionCards.length} real flashcard${sectionCards.length === 1 ? "" : "s"}, then study them now or save them as a deck.`}</p>

            {mounted && sectionCards.length > 0 && <>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <input
                  value={cardQuery}
                  onChange={e => setCardQuery(e.target.value)}
                  placeholder="Search cards…"
                  className="min-w-[180px] flex-1 rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm font-semibold text-heading outline-none focus:border-teal-400"
                />
                <button type="button" onClick={() => setCardSubjectFilter(null)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition ${!cardSubjectFilter ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All subjects</button>
                {cardSubjects.map(s => <button key={s} type="button" onClick={() => setCardSubjectFilter(s)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition ${cardSubjectFilter === s ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{s}</button>)}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button type="button" onClick={selectAllVisible} disabled={visibleCards.length === 0} className="cursor-pointer text-xs font-bold text-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40">Select all {cardSubjectFilter ?? "shown"} ({visibleCards.length})</button>
                {selectedCardIds.size > 0 && <button type="button" onClick={clearCardSelection} className="cursor-pointer text-xs font-bold text-slate-400 hover:text-heading">Clear selection</button>}
              </div>

              <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {visibleCards.length === 0
                  ? <p className="py-6 text-center text-xs text-slate-400">No cards match this filter.</p>
                  : visibleCards.map((card: LibraryCard) => {
                    const isSelected = selectedCardIds.has(card.id);
                    return <button
                      key={card.id}
                      type="button"
                      onClick={() => toggleCard(card.id)}
                      className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition ${isSelected ? "border-teal-300 bg-teal-50/60 dark:bg-teal-500/15" : "border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"}`}
                    >
                      {isSelected ? <CheckSquare size={17} className="mt-0.5 shrink-0 text-teal-600" /> : <Square size={17} className="mt-0.5 shrink-0 text-slate-300" />}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-heading">{card.front}</span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <span className="truncate">{card.subject}</span>
                          {card.lessonTitle && <span className="truncate text-slate-300">· {card.lessonTitle}</span>}
                        </span>
                      </span>
                    </button>;
                  })}
              </div>
            </>}
          </div>

          {selectedCardIds.size > 0 && <div className="sticky bottom-6 mt-5 flex flex-wrap items-center gap-3 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-5 py-3 shadow-lift">
            <span className="text-sm font-bold text-heading">{selectedCardIds.size} card{selectedCardIds.size === 1 ? "" : "s"} selected</span>
            <button type="button" onClick={studySelectedNow} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-heading transition hover:border-teal-300 hover:bg-[#f9fcfc] dark:bg-white/5"><Layers size={13} />Study Now</button>
            <button type="button" onClick={() => { setDeckPickerOpen(true); setAddedToDeck(false); }} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-600">Save to Deck</button>
            <button type="button" onClick={clearCardSelection} className="cursor-pointer text-slate-400 hover:text-heading" aria-label="Clear selection"><X size={16} /></button>
          </div>}

          {deckPickerOpen && <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={() => setDeckPickerOpen(false)}>
            <div className="w-full max-w-sm" onClick={e => e.stopPropagation()}>
              {addedToDeck
                ? <div className="rounded-2xl border border-teal-100 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 p-5 text-center">
                  <p className="text-sm font-extrabold text-teal-700">Added to deck ✓</p>
                  <button type="button" onClick={() => { setDeckPickerOpen(false); clearCardSelection(); }} className="mt-3 cursor-pointer text-xs font-bold text-teal-700 underline">Close</button>
                </div>
                : <DeckPicker
                  confirmLabel={`Add ${selectedCardIds.size} card${selectedCardIds.size === 1 ? "" : "s"}`}
                  onCancel={() => setDeckPickerOpen(false)}
                  onConfirm={deckId => { addCardsToDeck(deckId, Array.from(selectedCardIds)); setAddedToDeck(true); }}
                />}
            </div>
          </div>}
        </div>}
    </div>
  </section>;
}
