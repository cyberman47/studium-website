"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Sparkles } from "lucide-react";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";
import { getTerm } from "@/lib/terminology";
import { matchRealQuestions } from "@/lib/mcatQuizCurriculum";
import { SectionPracticeQuestion } from "@/lib/mcatConcepts";
import { logAttempt } from "@/lib/practiceHistory";

function toQuizItem(q: SectionPracticeQuestion): PracticeQuizItem {
  return { ...q.question, id: q.id, lessonTitle: q.lessonTitle };
}

// A separate route (rather than an inline overlay from the term panel) on
// purpose—the term panel is embeddable arbitrarily deep in lesson/case/quiz
// text, and this keeps that component from needing to import PracticeQuiz
// directly (avoiding a real circular-import risk between the two).
export default function QuizMeOnTermPage({ params }: { params: { termId: string } }) {
  const term = getTerm(params.termId);
  const [started, setStarted] = useState(false);

  // Same honest fuzzy-match already used by Create-a-Quiz—real matched
  // questions only, never invented ones.
  const matched = useMemo(() => term ? matchRealQuestions([term.name]) : [], [term]);

  function handleAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    logAttempt(q.id.split(":")[0], q.concept, correct, q.id);
  }

  if (!term) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Term not found.</p>
      <Link href="/dashboard/terminology" className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700"><ArrowLeft size={14} />Back to Terminology</Link>
    </section>;
  }

  if (started && matched.length > 0) {
    return <PracticeQuiz
      questions={matched.map(toQuizItem)}
      title={`Quiz me: ${term.name}`}
      completeLabel="Done"
      onAnswer={handleAnswer}
      onComplete={() => setStarted(false)}
      defaultFullscreen
      onExit={() => setStarted(false)}
    />;
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/terminology" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Terminology</Link>
    <span className="eyebrow"><HelpCircle size={13} />Quiz Me</span>
    <h1 className="display mt-5 text-3xl leading-tight sm:text-4xl">{term.name}</h1>

    {matched.length > 0
      ? <div className="mt-6 max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <p className="text-sm leading-relaxed text-slate-600">Studium found <span className="font-extrabold text-ink">{matched.length} real practice question{matched.length === 1 ? "" : "s"}</span> related to this term.</p>
        <button type="button" onClick={() => setStarted(true)} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Sparkles size={15} />Start Quiz</button>
      </div>
      : <div className="mt-6 max-w-lg rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-soft sm:p-7">
        <p className="text-sm font-extrabold text-ink">No practice questions have been written for this term yet.</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">Real questions will appear here automatically once they're written for this topic.</p>
        <Link href="/dashboard/learning-paths/mcat/practice" className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-[#f9fcfc]">Browse Real Practice Questions</Link>
      </div>}
  </section>;
}
