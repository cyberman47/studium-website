"use client";

// The Review section's Quizzes hub: the one place that shows both real
// sources of quiz content in the app side by side—quizzes the student
// generated and saved themselves (lib/create.ts) and the quizzes already
// built into the app from genuinely authored MCAT lesson content
// (lib/mcatConcepts.ts's getBuiltInQuizzes, one real quiz per subject).
// Nothing here invents new content: "Your Quizzes" only ever shows what's
// actually in studium_create_quizzes, and "Existing Quizzes" only lists
// subjects that have at least one authored practice question.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown, ChevronRight, Copy, ListChecks, Play, Plus, Sparkles, Trash2
} from "lucide-react";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";
import { deleteQuiz, duplicateQuiz, GeneratedQuestion, getQuizzes, SavedQuiz } from "@/lib/create";
import { BuiltInQuiz, getBuiltInQuizzes } from "@/lib/mcatConcepts";
import { logAttempt } from "@/lib/practiceHistory";

type Session = { questions: PracticeQuizItem[]; title: string; contextLabel?: string; fromBuiltIn: boolean } | null;

const genTypeLabels: Record<GeneratedQuestion["type"], string> = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  "short-answer": "Short Answer",
  "clinical-scenario": "Clinical Scenario"
};

function toBuiltInItem(quiz: BuiltInQuiz): PracticeQuizItem[] {
  return quiz.questions.map(q => ({ ...q.question, id: q.id, lessonTitle: q.lessonTitle }));
}

// Only a quiz made entirely of multiple-choice questions (with a matchable
// correct option) can be replayed through the shared PracticeQuiz runner—
// true-false/short-answer/clinical-scenario questions have no discrete
// option list to grade against, so those quizzes stay preview-only rather
// than forcing a fake multiple-choice shape onto them.
function toTakeableItems(quiz: SavedQuiz): PracticeQuizItem[] | null {
  const items: PracticeQuizItem[] = [];
  for (let i = 0; i < quiz.questions.length; i++) {
    const q = quiz.questions[i];
    if (q.type !== "multiple-choice" || !q.options || q.options.length === 0) return null;
    const correctIndex = q.options.indexOf(q.correctAnswer);
    if (correctIndex === -1) return null;
    items.push({
      id: `own-quiz:${quiz.id}:${i}`,
      question: q.question,
      concept: quiz.title,
      options: q.options,
      correctIndex,
      optionExplanations: q.options.map((_opt, oi) => (oi === correctIndex ? q.explanation : ""))
    });
  }
  return items;
}

function typeBreakdown(quiz: SavedQuiz): { type: GeneratedQuestion["type"]; count: number }[] {
  const counts = new Map<GeneratedQuestion["type"], number>();
  quiz.questions.forEach(q => counts.set(q.type, (counts.get(q.type) ?? 0) + 1));
  return Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [session, setSession] = useState<Session>(null);

  useEffect(() => { setQuizzes(getQuizzes()); }, []);

  const builtInQuizzes = useMemo(() => getBuiltInQuizzes(), []);
  const builtInBySection = useMemo(() => {
    const groups: { sectionId: string; sectionTitle: string; quizzes: BuiltInQuiz[] }[] = [];
    for (const quiz of builtInQuizzes) {
      let group = groups.find(g => g.sectionId === quiz.sectionId);
      if (!group) { group = { sectionId: quiz.sectionId, sectionTitle: quiz.sectionTitle, quizzes: [] }; groups.push(group); }
      group.quizzes.push(quiz);
    }
    return groups;
  }, [builtInQuizzes]);

  function refresh() { setQuizzes(getQuizzes()); }

  function handleDelete(id: string) {
    deleteQuiz(id);
    refresh();
  }

  function handleDuplicate(id: string) {
    duplicateQuiz(id);
    refresh();
  }

  function startOwnQuiz(quiz: SavedQuiz) {
    const items = toTakeableItems(quiz);
    if (!items) return;
    setSession({ questions: items, title: quiz.title, contextLabel: "Your Quiz", fromBuiltIn: false });
  }

  function startBuiltInQuiz(quiz: BuiltInQuiz) {
    setSession({ questions: toBuiltInItem(quiz), title: quiz.title, contextLabel: quiz.sectionTitle, fromBuiltIn: true });
  }

  // Only built-in questions carry a real lessonId (id shape "lessonId:index")
  // that logAttempt can attribute progress to—own-quiz attempts aren't
  // logged rather than attributing them to a made-up lesson.
  function handleAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    if (!session?.fromBuiltIn) return;
    logAttempt(q.id.split(":")[0], q.concept, correct, q.id);
  }

  if (session) {
    return <PracticeQuiz
      questions={session.questions}
      title={session.title}
      contextLabel={session.contextLabel}
      completeLabel="Finish"
      onAnswer={handleAnswer}
      onComplete={() => setSession(null)}
      defaultFullscreen
      onExit={() => setSession(null)}
    />;
  }

  return <section className="mx-auto max-w-5xl bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
    <span className="eyebrow"><ListChecks size={13} />Review</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Quizzes.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Everything you can be quizzed on—the quizzes you've made yourself, and the ones already built into Studium.</p>

    {/* ---- Your Quizzes ---- */}
    <div className="mt-10 flex items-center justify-between gap-3">
      <h2 className="text-lg font-extrabold tracking-tight text-ink">Your Quizzes</h2>
      <Link href="/dashboard/create/build-quiz" className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-[#f9fcfc]"><Plus size={13} />Create a Quiz</Link>
    </div>

    {quizzes.length === 0
      ? <div className="mt-4 flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-200 bg-white py-14 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600"><ListChecks size={22} /></span>
        <p className="mt-1 text-sm font-bold text-ink">You haven't saved any quizzes yet.</p>
        <p className="max-w-sm text-xs leading-relaxed text-slate-500">Build one from your own notes or a topic list, and it'll show up here.</p>
        <Link href="/dashboard/create/build-quiz" className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Create your first quiz →</Link>
      </div>
      : <div className="mt-4 space-y-3">
        {quizzes.map(quiz => {
          const takeable = toTakeableItems(quiz);
          const expanded = expandedId === quiz.id;
          return <div key={quiz.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft sm:p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-ink">{quiz.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {typeBreakdown(quiz).map(({ type, count }) => <span key={type} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">{count} {genTypeLabels[type]}</span>)}
                  <span className="text-[11px] text-slate-400">· {new Date(quiz.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {takeable && <button type="button" onClick={() => startOwnQuiz(quiz)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Play size={12} />Take Quiz</button>}
                <button type="button" onClick={() => setExpandedId(expanded ? null : quiz.id)} aria-label={expanded ? "Collapse preview" : "Preview questions"} className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-ink">{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button>
                <button type="button" onClick={() => handleDuplicate(quiz.id)} aria-label="Duplicate" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-ink"><Copy size={15} /></button>
                <button type="button" onClick={() => handleDelete(quiz.id)} aria-label="Delete" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
              </div>
            </div>
            {!takeable && <p className="mt-2 text-[11px] font-semibold text-amber-600">Includes non-multiple-choice questions—preview only, can't be auto-graded yet.</p>}

            {expanded && <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
              {quiz.questions.map((q, i) => <div key={i} className="rounded-xl border border-slate-100 bg-[#fbfdfd] p-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">{genTypeLabels[q.type]}</span>
                  <span className="text-[10px] font-extrabold text-slate-400">{q.difficulty}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-ink">{i + 1}. {q.question}</p>
                {q.options && <ul className="mt-1.5 space-y-1 pl-4 text-xs text-slate-500">{q.options.map(o => <li key={o} className={o === q.correctAnswer ? "font-extrabold text-teal-700" : ""}>{o}</li>)}</ul>}
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500"><span className="font-extrabold text-teal-700">Answer:</span> {q.correctAnswer}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{q.explanation}</p>
              </div>)}
            </div>}
          </div>;
        })}
      </div>}

    {/* ---- Existing Quizzes ---- */}
    <div className="mt-12">
      <h2 className="text-lg font-extrabold tracking-tight text-ink">Existing Quizzes</h2>
      <p className="mt-1 text-sm text-slate-500">Real, pre-written practice quizzes already in Studium's MCAT curriculum, one per subject.</p>

      {builtInBySection.length === 0
        ? <p className="mt-4 text-sm text-slate-500">No subjects have practice questions authored yet.</p>
        : <div className="mt-5 space-y-7">
          {builtInBySection.map(group => <div key={group.sectionId}>
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-700">{group.sectionTitle}</p>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
              {group.quizzes.map(quiz => <div key={quiz.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-ink">{quiz.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"}</p>
                </div>
                <button type="button" onClick={() => startBuiltInQuiz(quiz)} className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Play size={12} />Start</button>
              </div>)}
            </div>
          </div>)}
        </div>}
    </div>

    <div className="mt-10 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-500 shadow-soft">
      <Sparkles size={14} className="shrink-0 text-teal-600" />
      Want a custom mix by topic instead? <Link href="/dashboard/learning-paths/mcat/practice" className="cursor-pointer font-bold text-teal-700 hover:underline">Try the Practice Workspace →</Link>
    </div>
  </section>;
}
