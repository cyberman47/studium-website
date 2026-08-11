"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Atom, BookOpenCheck, Calendar, ChevronRight, Compass, Dna, HeartPulse,
  Play, RotateCcw, Sparkles, Target
} from "lucide-react";
import { Reveal } from "@/components/ui";
import { getSectionProgress, mcatSections, SectionDef, SubjectProgress } from "@/lib/mcatPath";
import {
  getAllMcatPracticeQuestions, getMcatContinueRecommendation, getMcatReadiness, getQuestionOfTheDay,
  hasSeenMcatStartHere, McatContinueRecommendation, McatReadiness, SectionPracticeQuestion
} from "@/lib/mcatConcepts";
import { getMcatGoals, McatGoals, setMcatGoals } from "@/lib/mcatGoals";
import { getDaysRemaining, getExamConfig, STUDY_PLANNER_EVENT } from "@/lib/studyPlanner";
import { logAttempt } from "@/lib/practiceHistory";
import {
  CARD_PROGRESS_EVENT, getAllLibraryCards, getCardProgress, isCardDue, LibraryCard, restoreLibraryCard, reviewLibraryCard
} from "@/lib/flashcardLibrary";
import { PERSONAL_FLASHCARDS_EVENT } from "@/lib/personalFlashcards";
import { TERM_PROGRESS_EVENT } from "@/lib/terminology";
import { FlashcardFocusMode, FocusCard, FocusRating } from "@/components/flashcard-focus-mode";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";

const sectionIcons: Record<string, typeof Dna> = {
  "bio-biochem": Dna,
  "chem-phys": Atom,
  "psych-social": HeartPulse,
  cars: BookOpenCheck
};

const sectionColors: Record<string, string> = {
  "bio-biochem": "bg-teal-100 text-teal-700",
  "chem-phys": "bg-violet-100 text-violet-600",
  "psych-social": "bg-pink-100 text-pink-600",
  cars: "bg-amber-100 text-amber-600"
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toQuizItem(q: SectionPracticeQuestion): PracticeQuizItem {
  return { ...q.question, id: q.id };
}

// Any question's onAnswer needs to log to the real per-lesson practice
// history—the id carries "lessonId:index", so this recovers it rather than
// threading a parallel lessonId prop through every ad-hoc quiz on this page.
function lessonIdFromQuestionId(id: string): string {
  return id.split(":")[0];
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// A ring, not a bar—denser at a glance across four pillar cards and the
// target bar than four more horizontal bars would be.
function CircularProgress({ percent, size = 48, stroke = 4.5 }: { percent: number; size?: number; stroke?: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const cx = size / 2, cy = size / 2;
  return <svg width={size} height={size} className="shrink-0">
    <g transform={`rotate(-90 ${cx} ${cy})`}>
      <circle cx={cx} cy={cy} r={radius} strokeWidth={stroke} className="fill-none stroke-slate-100" />
      <circle cx={cx} cy={cy} r={radius} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="fill-none stroke-teal-500 transition-[stroke-dashoffset] duration-500" />
    </g>
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="fill-ink font-extrabold" style={{ fontSize: size * 0.26 }}>{clamped}%</text>
  </svg>;
}

const defaultGoals: McatGoals = { targetScore: null };
const defaultReadiness: McatReadiness = { learnPercent: 0, accuracyPercent: null, readinessPercent: 0 };

export default function MCATPathPage() {
  const [sectionProgress, setSectionProgress] = useState<Record<string, SubjectProgress>>({});
  const [continueRec, setContinueRec] = useState<McatContinueRecommendation | null>(null);
  const [showStartHereNudge, setShowStartHereNudge] = useState(false);
  const [goals, setGoals] = useState<McatGoals>(defaultGoals);
  const [readiness, setReadiness] = useState<McatReadiness>(defaultReadiness);
  const [dueCards, setDueCards] = useState<LibraryCard[]>([]);
  const [questionOfDay, setQuestionOfDay] = useState<SectionPracticeQuestion | null>(null);
  const [examDate, setExamDate] = useState<string | null>(null);

  const [editingScore, setEditingScore] = useState(false);
  const [scoreDraft, setScoreDraft] = useState("");

  const [reviewOpen, setReviewOpen] = useState(false);
  const [qotdOpen, setQotdOpen] = useState(false);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const cardSnapshots = useRef(new Map<string, ReturnType<typeof getCardProgress>>()).current;

  // Every value below is real but localStorage/content-derived—populated
  // post-mount only, never computed inline during render, so the server
  // pass and the pre-effect client pass render identically (the same
  // hydration-mismatch fix already applied on the lesson Study Hub).
  useEffect(() => {
    function refresh() {
      const nextProgress: Record<string, SubjectProgress> = {};
      for (const section of mcatSections) nextProgress[section.id] = getSectionProgress(section);
      setSectionProgress(nextProgress);
      setContinueRec(getMcatContinueRecommendation());
      setShowStartHereNudge(!hasSeenMcatStartHere());
      setGoals(getMcatGoals());
      setExamDate(getExamConfig()?.examDate ?? null);
      setReadiness(getMcatReadiness());
      setDueCards(getAllLibraryCards().filter(c => isCardDue(c.id)));
      setQuestionOfDay(getQuestionOfTheDay());
    }
    refresh();
    window.addEventListener(CARD_PROGRESS_EVENT, refresh);
    window.addEventListener(TERM_PROGRESS_EVENT, refresh);
    window.addEventListener(PERSONAL_FLASHCARDS_EVENT, refresh);
    window.addEventListener(STUDY_PLANNER_EVENT, refresh);
    return () => {
      window.removeEventListener(CARD_PROGRESS_EVENT, refresh);
      window.removeEventListener(TERM_PROGRESS_EVENT, refresh);
      window.removeEventListener(PERSONAL_FLASHCARDS_EVENT, refresh);
      window.removeEventListener(STUDY_PLANNER_EVENT, refresh);
    };
  }, []);

  const daysLeft = examDate ? getDaysRemaining(examDate) : null;

  const diagnosticQuestions = useMemo(() => shuffle(getAllMcatPracticeQuestions()).map(toQuizItem), [diagnosticOpen]);

  function commitScore() {
    const n = Number(scoreDraft);
    const clamped = scoreDraft && !Number.isNaN(n) ? Math.min(528, Math.max(472, Math.round(n))) : null;
    setMcatGoals({ targetScore: clamped });
    setGoals(getMcatGoals());
    setEditingScore(false);
  }

  function handleRate(card: FocusCard, rating: FocusRating) {
    cardSnapshots.set(card.id, getCardProgress(card.id));
    reviewLibraryCard(card.id, rating);
  }

  function handleUndo(card: FocusCard) {
    restoreLibraryCard(card.id, cardSnapshots.get(card.id) ?? null);
  }

  function handleAdhocAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    logAttempt(lessonIdFromQuestionId(q.id), q.concept, correct, q.id);
  }

  if (reviewOpen) {
    const focusCards: FocusCard[] = dueCards.map(c => ({ id: c.id, front: c.front, back: c.back, hint: c.lessonTitle ? `From: ${c.lessonTitle}` : null }));
    return <FlashcardFocusMode
      deckTitle="Spaced Repetition Review"
      cards={focusCards}
      onExit={() => setReviewOpen(false)}
      onRate={handleRate}
      onUndo={handleUndo}
      tutorContext={{ chatKey: "mcat-review", subjectName: "MCAT Review" }}
    />;
  }

  if (qotdOpen && questionOfDay) {
    return <PracticeQuiz
      questions={[toQuizItem(questionOfDay)]}
      title="Question of the Day"
      completeLabel="Done"
      onAnswer={handleAdhocAnswer}
      onComplete={() => setQotdOpen(false)}
      defaultFullscreen
      onExit={() => setQotdOpen(false)}
    />;
  }

  if (diagnosticOpen) {
    return <PracticeQuiz
      questions={diagnosticQuestions}
      title="Diagnostic Quiz"
      emptyMessage="No practice questions have been authored yet."
      completeLabel="Finish"
      onAnswer={handleAdhocAnswer}
      onComplete={() => setDiagnosticOpen(false)}
      defaultFullscreen
      onExit={() => setDiagnosticOpen(false)}
    />;
  }

  const canResume = continueRec && continueRec.recommendation.action !== "caught-up";

  return <section className="mx-auto max-w-7xl bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
    <Link href="/dashboard/learning-paths" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Learning Paths</Link>
    <span className="eyebrow"><Sparkles size={13} />MCAT Preparation</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">MCAT Preparation Command Center.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Learn and Practice by exam section. Review by personal need.</p>

    {showStartHereNudge && <Reveal delay={0}>
      <Link href="/dashboard/learning-paths/mcat/start-here" className="mt-6 flex items-center gap-4 rounded-3xl border border-teal-200 bg-teal-50/70 p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-teal-700 shadow-soft"><Compass size={19} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-ink">New here? Start with a 2-minute orientation.</p>
          <p className="mt-0.5 text-xs text-slate-500">What the MCAT is, and how Studium's Learn / Practice / Review split works.</p>
        </div>
        <ChevronRight size={18} className="shrink-0 text-teal-600" />
      </Link>
    </Reveal>}

    {/* Target bar */}
    <Reveal delay={0.03}>
      <div className="mt-6 flex flex-wrap items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <div className="min-w-[130px]">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-400"><Calendar size={12} />Test Date</p>
          {/* Read-only here—the real editable source is the Study Planner's
              exam setup (lib/studyPlanner.ts), so this widget and the
              Planner's own countdown can never disagree. */}
          <Link href="/dashboard/study-plan" className="mt-1 block cursor-pointer text-left">
            <span className="text-lg font-extrabold text-ink hover:text-teal-700">{examDate ? formatDate(examDate) : "Set date"}</span>
            {daysLeft !== null && <span className="ml-2 text-xs font-bold text-teal-600">{daysLeft >= 0 ? `${daysLeft}d left` : "date passed"}</span>}
          </Link>
        </div>

        <div className="hidden h-10 w-px bg-slate-100 sm:block" />

        <div className="min-w-[110px]">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-400"><Target size={12} />Target Score</p>
          {editingScore
            ? <input autoFocus type="number" min={472} max={528} value={scoreDraft} onChange={e => setScoreDraft(e.target.value)} onBlur={commitScore} onKeyDown={e => e.key === "Enter" && commitScore()} className="mt-1.5 w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm font-bold text-ink outline-none focus:border-teal-400" />
            : <button type="button" onClick={() => { setScoreDraft(goals.targetScore?.toString() ?? ""); setEditingScore(true); }} className="mt-1 block cursor-pointer text-left">
              <span className="text-lg font-extrabold text-ink hover:text-teal-700">{goals.targetScore ?? "Set target"}</span>
            </button>}
        </div>

        <div className="hidden h-10 w-px bg-slate-100 sm:block" />

        <div className="flex items-center gap-3">
          <CircularProgress percent={readiness.readinessPercent} size={52} />
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Readiness</p>
            <p className="text-xs text-slate-500">{readiness.accuracyPercent !== null ? "Learn + Practice" : "From Learn progress"}</p>
          </div>
        </div>

        <div className="ml-auto">
          {canResume
            ? <Link href={continueRec!.recommendation.href} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Play size={14} fill="currentColor" />Resume: {continueRec!.recommendation.label}</Link>
            : <button type="button" onClick={() => setDiagnosticOpen(true)} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Play size={14} fill="currentColor" />Take Diagnostic Quiz</button>}
        </div>
      </div>
    </Reveal>

    {/* 4 Core Pillars */}
    <div className="mt-10 grid gap-5 grid-cols-1 md:grid-cols-2">
      {mcatSections.map((section, i) => <PillarCard key={section.id} section={section} progress={sectionProgress[section.id]} index={i} />)}
    </div>

    {/* Quick Practice drawer */}
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      <Reveal delay={0.1}>
        <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><RotateCcw size={13} />Spaced Repetition</div>
          <p className="mt-3 text-3xl font-extrabold text-ink">{dueCards.length}<span className="ml-1.5 text-sm font-bold text-slate-400">card{dueCards.length === 1 ? "" : "s"} due today</span></p>
          <button type="button" onClick={() => setReviewOpen(true)} disabled={dueCards.length === 0} className="mt-4 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40">Start Review</button>
        </div>
      </Reveal>
      <Reveal delay={0.14}>
        <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Sparkles size={13} />Question of the Day</div>
          {questionOfDay ? <>
            <p className="mt-3 flex-1 text-sm font-bold leading-snug text-ink">{questionOfDay.question.question}</p>
            <button type="button" onClick={() => setQotdOpen(true)} className="mt-4 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Try it</button>
          </> : <p className="mt-3 text-xs text-slate-500">No practice questions have been authored yet.</p>}
        </div>
      </Reveal>
    </div>
  </section>;
}

// The whole card is the link—pressing anywhere on "Biological & Biochemical
// Foundations" goes straight to that section's Lessons, no separate
// Lessons/Practice/Flashcards row to choose from first.
function PillarCard({ section, progress, index }: { section: SectionDef; progress: SubjectProgress | undefined; index: number }) {
  const Icon = sectionIcons[section.id];
  const hasContent = (progress?.total ?? 0) > 0;
  return <Reveal delay={index * 0.05}>
    <Link href={`/dashboard/learning-paths/mcat/${section.id}`} className="group flex h-full cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lift sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${sectionColors[section.id]}`}><Icon size={22} /></span>
        <CircularProgress percent={progress?.percent ?? 0} />
      </div>
      <h3 className="mt-5 flex items-center gap-1.5 text-lg font-extrabold leading-snug tracking-tight text-ink">
        {section.shortTitle}
        <ChevronRight size={18} className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500" />
      </h3>
      <p className="mt-1 text-xs font-bold text-slate-400">{hasContent ? `${progress!.total} lesson${progress!.total === 1 ? "" : "s"} available` : "Lessons coming soon"}</p>
    </Link>
  </Reveal>;
}
