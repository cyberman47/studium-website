"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check, Clock3, GraduationCap, Info, ListFilter, TriangleAlert, Zap
} from "lucide-react";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";
import { findSection, findSubject } from "@/lib/mcatPath";
import { getSectionPracticeQuestions, getUniqueConcepts, getUnusedMcatPracticeQuestions, SectionPracticeQuestion } from "@/lib/mcatConcepts";
import { getWeakConcepts, logAttempt } from "@/lib/practiceHistory";

// Real MCAT pacing (~95 sec/question)—same figure the top-level Practice
// Workspace uses—drives the recommended-time default on the timed setup
// screen instead of a made-up round number.
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

// The "Practice" tab for a subject—the same Custom Drill Builder concept as
// the top-level Practice Workspace (/mcat/practice), just pre-scoped to this
// subject's own lessons instead of asking you to pick a section first. No
// "Sections" filter here: the subject itself already is the scope. Stays on
// this same URL throughout (config → drill → results), same pattern as
// every other Practice surface in the app.
export default function MCATSubjectPracticePage({ params }: { params: { section: string; subject: string } }) {
  const section = findSection(params.section);
  const subject = findSubject(params.section, params.subject);
  const subjectLessonIds = useMemo(() => new Set((subject?.lessons ?? []).map(l => l.id)), [subject]);
  const subjectPool = useMemo(
    () => section ? getSectionPracticeQuestions(section.id).filter(q => subjectLessonIds.has(q.lessonId)) : [],
    [section, subjectLessonIds]
  );
  const total = subjectPool.length;

  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<"discrete" | "passage">("discrete");
  const [targetPool, setTargetPool] = useState<TargetPool>("unused");
  const [drillCount, setDrillCount] = useState<DrillCount>("all");
  const [mode, setMode] = useState<Mode>("tutor");
  const [session, setSession] = useState<Session>(null);
  const [pendingSession, setPendingSession] = useState<PendingSession>(null);
  const [setupMinutes, setSetupMinutes] = useState(0);
  // The config screen renders unconditionally here (unlike the top-level
  // Practice Workspace, where the same localStorage-dependent counts sit
  // behind a drawer that starts closed on both server and the pre-hydration
  // client pass). Gating the real form on `mounted` reproduces that same
  // safety: server and first client paint both show the loading state, and
  // the real, localStorage-derived match counts only appear post-mount—no
  // hydration mismatch on "All matching (N)" etc.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Default Target Pool to "Weak Areas Only" automatically once there's
    // real weak-area data—an informed default, not a random one. Same rule
    // the top-level Practice Workspace uses.
    if (getWeakConcepts().length > 0) setTargetPool("weak");
  }, []);

  const availableTopics = useMemo(() => getUniqueConcepts(subjectPool), [subjectPool]);
  const weakConceptNames = useMemo(() => new Set(getWeakConcepts().map(w => w.concept)), []);

  const { drillPool, usedFallback } = useMemo(() => {
    if (format === "passage") return { drillPool: [] as SectionPracticeQuestion[], usedFallback: false }; // honest: no passage content exists yet
    let pool = subjectPool;
    if (selectedTopics.size > 0) pool = pool.filter(q => selectedTopics.has(q.question.concept));

    if (targetPool === "weak") return { drillPool: pool.filter(q => weakConceptNames.has(q.question.concept)), usedFallback: false };

    const unused = getUnusedMcatPracticeQuestions(pool);
    if (unused.length > 0 || pool.length === 0) return { drillPool: unused, usedFallback: false };
    return { drillPool: pool, usedFallback: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectPool, selectedTopics, format, targetPool, weakConceptNames]);

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
    const title = subject?.name ?? "Practice";
    if (mode === "timed") openSetup({ questions, title, contextLabel: "Subject Practice" });
    else setSession({ questions, title, contextLabel: "Subject Practice", timed: false });
  }

  function confirmSetupAndStart() {
    if (!pendingSession) return;
    setSession({ ...pendingSession, timed: true, timeLimitSeconds: setupMinutes * 60 });
    setPendingSession(null);
  }

  function handleAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    logAttempt(q.id.split(":")[0], q.concept, correct, q.id);
  }

  if (session) {
    return <PracticeQuiz
      questions={session.questions}
      title={session.title}
      contextLabel={session.contextLabel}
      completeLabel="Done"
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
    return <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 px-6 py-10 text-center">
      <span className="eyebrow justify-center"><Clock3 size={13} />Session Setup</span>
      <h1 className="display mt-5 text-3xl leading-tight sm:text-4xl">{pendingSession.title}</h1>
      <p className="mt-3 text-base text-slate-500">This test has <span className="font-extrabold text-ink">{pendingSession.questions.length} question{pendingSession.questions.length === 1 ? "" : "s"}</span>.</p>

      <div className="mt-8 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-soft">
        <p className="text-sm font-bold text-ink">How much time would you like?</p>
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
        <button type="button" onClick={() => setPendingSession(null)} className="cursor-pointer text-sm font-bold text-slate-500 hover:text-ink">Cancel</button>
        <button type="button" onClick={confirmSetupAndStart} className="cursor-pointer rounded-full bg-accent-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Start Test</button>
      </div>
    </div>;
  }

  if (!subject) {
    return <p className="text-sm text-slate-500">Subject not found.</p>;
  }

  if (!mounted) {
    return <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 text-teal-700"><ListFilter size={22} /></span>
      <h2 className="mt-5 text-lg font-extrabold tracking-tight text-ink">Configure Drill</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">Loading…</p>
    </div>;
  }

  return <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 text-teal-700"><ListFilter size={22} /></span>
    <h2 className="mt-5 text-lg font-extrabold tracking-tight text-ink">Configure Drill</h2>
    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{total === 0 ? "No practice questions have been written for this subject yet." : `Build a targeted session from ${subject.name}'s own ${total} practice question${total === 1 ? "" : "s"}.`}</p>

    <div className="mt-5">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Topic</p>
      {availableTopics.length === 0
        ? <p className="mt-2 text-xs text-slate-400">No topics available yet.</p>
        : <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
          {availableTopics.map(topic => <button key={topic} type="button" onClick={() => toggleTopic(topic)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition ${selectedTopics.has(topic) ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{topic}</button>)}
        </div>}
    </div>

    <div className="mt-5">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Question Format</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setFormat("discrete")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${format === "discrete" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{format === "discrete" && <Check size={13} />}Discrete Questions</button>
        <button type="button" onClick={() => setFormat("passage")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${format === "passage" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{format === "passage" && <Check size={13} />}Passage-Based</button>
      </div>
      {format === "passage" && <p className="mt-1.5 text-[11px] font-bold text-amber-600">No passage-based content exists yet—this will return 0 questions.</p>}
    </div>

    <div className="mt-5">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Target Pool</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setTargetPool("unused")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${targetPool === "unused" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>All Unused Questions</button>
        <button type="button" onClick={() => setTargetPool("weak")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${targetPool === "weak" ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500 hover:border-amber-200"}`}><TriangleAlert size={13} />Weak Areas Only</button>
      </div>
      {usedFallback && <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3">
        <Info size={14} className="mt-0.5 shrink-0 text-teal-600" />
        <p className="text-[11px] font-semibold leading-relaxed text-teal-800">You&apos;ve completed all unused questions in this subject! Automatically including previously answered questions so you can review.</p>
      </div>}
    </div>

    <div className="mt-5">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Question Count</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[5, 10, 15, 20].filter(n => n < drillPool.length).map(n => <button key={n} type="button" onClick={() => setDrillCount(n)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${drillCount === n ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{n}</button>)}
        <button type="button" onClick={() => setDrillCount("all")} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${drillCount === "all" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>All matching ({drillPool.length})</button>
      </div>
    </div>

    <div className="mt-5">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Mode</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setMode("tutor")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${mode === "tutor" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}><GraduationCap size={13} />Tutor Mode</button>
        <button type="button" onClick={() => setMode("timed")} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${mode === "timed" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}><Clock3 size={13} />Timed</button>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">{mode === "tutor" ? "See correct answers and explanations right after each question." : "Feedback is withheld until a results summary at the end—real exam conditions. You'll set the time on the next screen."}</p>
    </div>

    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
      <p className="text-xs font-bold text-slate-500">{effectiveCount < drillPool.length ? `Using ${effectiveCount} of ${drillPool.length} matching questions` : `${drillPool.length} question${drillPool.length === 1 ? "" : "s"} match`}</p>
      <button type="button" onClick={startDrill} disabled={drillPool.length === 0} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"><Zap size={14} />{mode === "timed" ? "Next: Set Time" : "Start Drill"}</button>
    </div>
  </div>;
}
