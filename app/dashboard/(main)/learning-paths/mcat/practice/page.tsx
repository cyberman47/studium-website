"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bookmark, Check, Clock3, GraduationCap, Info, ListFilter, Shuffle, Sparkles, TriangleAlert, X, Zap
} from "lucide-react";
import { McatSubnav } from "@/components/mcat-subnav";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";
import { mcatSections } from "@/lib/mcatPath";
import {
  getAllMcatPracticeQuestions, getUniqueConcepts, getUnusedMcatPracticeQuestions, SectionPracticeQuestion
} from "@/lib/mcatConcepts";
import { getSavedQuestionIds, getWeakConcepts, logAttempt, SAVED_QUESTIONS_EVENT } from "@/lib/practiceHistory";

// Real MCAT pacing (~95 sec/question) drives every recommended-time figure
// on this page instead of a made-up round number.
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
// A timed session that's been sized and named but hasn't had its time
// budget confirmed yet—held here just long enough to show the setup screen.
type PendingSession = { questions: PracticeQuizItem[]; title: string; contextLabel?: string } | null;

// useSearchParams() bails out of static rendering and needs a Suspense
// boundary around it, or the production build fails.
export default function McatPracticePage() {
  return <Suspense fallback={null}><McatPracticeContent /></Suspense>;
}
function McatPracticeContent() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  const allQuestions = useMemo(() => getAllMcatPracticeQuestions(), []);
  const total = allQuestions.length; // static lesson content, not localStorage—safe during the very first render

  const [savedCount, setSavedCount] = useState(0);
  // Starts closed on both server and the pre-hydration client pass, even
  // when arriving with ?section= set—opening it (and pre-selecting that
  // section) happens in the mount effect below, right alongside the other
  // localStorage-derived state. Otherwise the drawer's real, localStorage-
  // dependent match count could render differently server vs. client on
  // first paint (the same hydration-mismatch class fixed on the Study Hub).
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(() => new Set(mcatSections.map(s => s.id)));
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<"discrete" | "passage">("discrete");
  const [targetPool, setTargetPool] = useState<TargetPool>("unused");
  const [drillCount, setDrillCount] = useState<DrillCount>("all");
  const [mode, setMode] = useState<Mode>("tutor");
  const [mixedCount, setMixedCount] = useState(() => Math.min(25, total) || total);
  const [session, setSession] = useState<Session>(null);
  const [pendingSession, setPendingSession] = useState<PendingSession>(null);
  const [setupMinutes, setSetupMinutes] = useState(0);

  useEffect(() => {
    function refresh() { setSavedCount(getSavedQuestionIds().length); }
    refresh();
    // Default Target Pool to "Weak Areas Only" automatically once there's
    // real weak-area data—an informed default, not a random one.
    if (getWeakConcepts().length > 0) setTargetPool("weak");
    if (sectionParam) {
      setSelectedSections(new Set([sectionParam]));
      setDrawerOpen(true);
    }
    window.addEventListener(SAVED_QUESTIONS_EVENT, refresh);
    return () => window.removeEventListener(SAVED_QUESTIONS_EVENT, refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectionFilteredPool = useMemo(
    () => allQuestions.filter(q => selectedSections.has(q.sectionId)),
    [allQuestions, selectedSections]
  );
  const availableTopics = useMemo(() => getUniqueConcepts(sectionFilteredPool), [sectionFilteredPool]);

  const weakConceptNames = useMemo(() => new Set(getWeakConcepts().map(w => w.concept)), [drawerOpen]);

  // Smart fallback: "All Unused Questions" is only a dead end if we let it
  // be one. When every question in the current filter has already been
  // attempted, silently expanding back to the full filtered pool (instead
  // of stranding the student at 0 matches) is more useful than a disabled
  // button—usedFallback drives the inline banner explaining why review
  // questions showed up under an "unused" filter.
  const { drillPool, usedFallback } = useMemo(() => {
    if (format === "passage") return { drillPool: [] as SectionPracticeQuestion[], usedFallback: false }; // honest: no passage content exists yet
    let pool = sectionFilteredPool;
    if (selectedTopics.size > 0) pool = pool.filter(q => selectedTopics.has(q.question.concept));

    if (targetPool === "weak") return { drillPool: pool.filter(q => weakConceptNames.has(q.question.concept)), usedFallback: false };

    const unused = getUnusedMcatPracticeQuestions(pool);
    if (unused.length > 0 || pool.length === 0) return { drillPool: unused, usedFallback: false };
    return { drillPool: pool, usedFallback: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionFilteredPool, selectedTopics, format, targetPool, weakConceptNames]);

  const effectiveCount = drillCount === "all" ? drillPool.length : Math.min(drillCount, drillPool.length);

  function toggleSection(id: string) {
    setSelectedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setSelectedTopics(new Set()); // topic list depends on section selection—stale picks would silently vanish otherwise
  }

  function toggleTopic(concept: string) {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (next.has(concept)) next.delete(concept); else next.add(concept);
      return next;
    });
  }

  // Opens the time-setup screen for timed sessions; untimed ones (Tutor
  // mode drills, Saved Questions review) skip straight to the runner since
  // there's no time budget to choose.
  function openSetup(pending: NonNullable<PendingSession>) {
    setPendingSession(pending);
    setSetupMinutes(recommendedMinutes(pending.questions.length));
  }

  function startDrill() {
    const sectionLabel = selectedSections.size === mcatSections.length ? "All Sections" : mcatSections.filter(s => selectedSections.has(s.id)).map(s => s.shortTitle).join(" · ");
    const questions = shuffle(drillPool).slice(0, effectiveCount).map(toQuizItem);
    setDrawerOpen(false);
    if (mode === "timed") openSetup({ questions, title: "Custom Drill", contextLabel: sectionLabel });
    else setSession({ questions, title: "Custom Drill", contextLabel: sectionLabel, timed: false });
  }

  function startMixedExam() {
    const picked = shuffle(allQuestions).slice(0, mixedCount).map(toQuizItem);
    openSetup({ questions: picked, title: "Mixed Exam Simulation", contextLabel: "All MCAT Sections" });
  }

  function confirmSetupAndStart() {
    if (!pendingSession) return;
    setSession({ ...pendingSession, timed: true, timeLimitSeconds: setupMinutes * 60 });
    setPendingSession(null);
  }

  function openSavedQuestions() {
    const savedIds = new Set(getSavedQuestionIds());
    setSession({ questions: allQuestions.filter(q => savedIds.has(q.id)).map(toQuizItem), title: "Saved Questions", contextLabel: "Your Bookmarks", timed: false });
  }

  // Every session on this page (drill, mixed exam, or saved-questions
  // review) persists real attempts—id is "lessonId:index", so the lesson
  // and concept are recovered from the question itself rather than a
  // separate id→lesson lookup table.
  function handleAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    logAttempt(q.id.split(":")[0], q.concept, correct, q.id);
  }

  if (session) {
    return <PracticeQuiz
      questions={session.questions}
      title={session.title}
      contextLabel={session.contextLabel}
      emptyMessage="Nothing saved yet—bookmark a question with the flag icon while practicing to add it here."
      completeLabel="Finish"
      onAnswer={handleAnswer}
      onComplete={() => setSession(null)}
      defaultFullscreen
      onExit={() => setSession(null)}
      timed={session.timed}
      timeLimitSeconds={session.timeLimitSeconds}
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

        <input
          type="range" min={sliderMin} max={sliderMax} value={setupMinutes}
          onChange={e => setSetupMinutes(Number(e.target.value))}
          className="mt-5 w-full accent-teal-600"
        />
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

  const quickCounts = [10, 25].filter(n => n < total);

  return <section className="mx-auto max-w-5xl bg-slate-50 dark:bg-white/5 px-4 py-10 sm:px-6 sm:py-14">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <span className="eyebrow"><Sparkles size={13} />Practice</span>
        <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Practice Workspace.</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-500">Build custom drills or launch a timed mixed session.</p>
      </div>
      <button type="button" onClick={openSavedQuestions} disabled={savedCount === 0} className="mt-1 inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-4 py-2.5 text-sm font-bold text-heading shadow-soft transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50">
        <Bookmark size={15} className="text-amber-500" fill={savedCount > 0 ? "currentColor" : "none"} />Saved Questions ({savedCount})
      </button>
    </div>

    <div className="mt-8">
      <McatSubnav />
    </div>

    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      {/* Card A: Custom Drill Builder */}
      <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-7 shadow-soft">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><ListFilter size={22} /></span>
        <h2 className="mt-5 text-lg font-extrabold tracking-tight text-heading">Custom Drill Builder</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Build a targeted session by topic, passage type, or focus on your weakest concepts.</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["Discrete & Passages", "Topic Filtering", "Weak Spot Targeting"].map(tag => <span key={tag} className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-600">{tag}</span>)}
        </div>
        <button type="button" onClick={() => setDrawerOpen(true)} className="mt-6 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Configure Drill →</button>
      </div>

      {/* Card B: Mixed Exam Simulation */}
      <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-7 shadow-soft">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600"><Shuffle size={22} /></span>
        <h2 className="mt-5 text-lg font-extrabold tracking-tight text-heading">Mixed Exam Simulation</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Simulate test day with a randomized, timed set across all MCAT sections.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickCounts.map(n => <button key={n} type="button" onClick={() => setMixedCount(n)} disabled={total === 0} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40 ${mixedCount === n ? "border-violet-500 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300 dark:bg-violet-500/15 dark:text-violet-300 text-violet-700" : "border-slate-200 dark:border-white/10 text-heading hover:border-violet-200 hover:bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300 dark:bg-violet-500/15 dark:text-violet-300"}`}>{n} Questions {n === 10 ? "(Quick)" : ""}</button>)}
          <button type="button" onClick={() => setMixedCount(total)} disabled={total === 0} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40 ${mixedCount === total ? "border-violet-500 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300 dark:bg-violet-500/15 dark:text-violet-300 text-violet-700" : "border-slate-200 dark:border-white/10 text-heading hover:border-violet-200 hover:bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300 dark:bg-violet-500/15 dark:text-violet-300"}`}>All available ({total})</button>
        </div>
        <button type="button" onClick={startMixedExam} disabled={total === 0 || mixedCount === 0} className="mt-6 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40">Start Mixed Session →</button>
        {total === 0 && <p className="mt-2 text-xs text-slate-400">No practice questions have been authored yet.</p>}
      </div>
    </div>

    {/* Filter drawer */}
    {drawerOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={() => setDrawerOpen(false)}>
      <div onClick={e => e.stopPropagation()} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-lift sm:p-7">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-heading">Configure Drill</h3>
          <button type="button" onClick={() => setDrawerOpen(false)} className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><X size={16} /></button>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Sections</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {mcatSections.map(s => <button key={s.id} type="button" onClick={() => toggleSection(s.id)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${selectedSections.has(s.id) ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{s.shortTitle}</button>)}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Topic</p>
          {availableTopics.length === 0
            ? <p className="mt-2 text-xs text-slate-400">No topics available for the selected sections.</p>
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
            <p className="text-[11px] font-semibold leading-relaxed text-teal-800 dark:text-teal-300">You&apos;ve completed all unused questions in these topics! Automatically including previously answered questions so you can review.</p>
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
      </div>
    </div>}
  </section>;
}
