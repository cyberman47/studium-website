"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Sparkles } from "lucide-react";
import { inputClass } from "@/components/ui";
import { Difficulty, GeneratedQuestion, sampleDocument, sampleQuizBank, saveQuiz } from "@/lib/create";

const typeLabels: Record<string, string> = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  "short-answer": "Short Answer",
  "clinical-scenario": "Clinical Scenario"
};

const difficultyClasses: Record<Difficulty, string> = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-rose-50 text-rose-700"
};

export default function CreateQuizPage() {
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty | "Any">("Any");
  const [title, setTitle] = useState(`${sampleDocument.fileName.replace(/\.[^.]+$/, "")} — Quiz`);
  const [saved, setSaved] = useState(false);

  const filteredBank = useMemo(() => difficulty === "Any" ? sampleQuizBank : sampleQuizBank.filter(q => q.difficulty === difficulty), [difficulty]);
  const questions: GeneratedQuestion[] = filteredBank.slice(0, count);

  function handleSave() {
    saveQuiz(title.trim() || "Untitled Quiz", questions);
    setSaved(true);
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><HelpCircle size={13} />Create Quiz</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Build a quiz.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Sample questions generated from {sampleDocument.fileName}, covering multiple choice, true/false, short answer, and clinical scenarios.</p>

    <div className="mt-8 max-w-2xl">
      {saved ? <div className="rounded-3xl border border-teal-100 bg-teal-50 p-6 text-center">
        <p className="text-sm font-extrabold text-teal-700">Quiz saved to My Creations ✓</p>
        <Link href="/dashboard/create" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-700 underline">Back to Create</Link>
      </div> : <>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Quiz title</span><input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} /></label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-xs font-extrabold text-slate-600">Number of questions</span>
              <div className="flex gap-2">
                {[5, 10, 20].map(n => <button key={n} type="button" onClick={() => setCount(n)} className={`flex-1 cursor-pointer rounded-full border px-3 py-2 text-xs font-extrabold transition ${count === n ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600 hover:border-teal-200"}`}>{n}</button>)}
              </div>
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-extrabold text-slate-600">Difficulty</span>
              <div className="flex gap-2">
                {(["Any", "Easy", "Medium", "Hard"] as const).map(d => <button key={d} type="button" onClick={() => setDifficulty(d)} className={`flex-1 cursor-pointer rounded-full border px-3 py-2 text-xs font-extrabold transition ${difficulty === d ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600 hover:border-teal-200"}`}>{d}</button>)}
              </div>
            </div>
          </div>
          {questions.length < count && <p className="mt-3 text-xs font-bold text-amber-600">Only {questions.length} sample questions are available at this difficulty in the demo bank.</p>}
        </div>

        <div className="mt-5 space-y-3">
          {questions.map((q, i) => <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-600">{typeLabels[q.type]}</span>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${difficultyClasses[q.difficulty]}`}>{q.difficulty}</span>
            </div>
            <p className="mt-2.5 text-sm font-bold text-ink">{i + 1}. {q.question}</p>
            {q.options && <ul className="mt-2 space-y-1 pl-4 text-xs text-slate-500">{q.options.map(o => <li key={o} className={o === q.correctAnswer ? "font-extrabold text-teal-700" : ""}>{o}</li>)}</ul>}
            <p className="mt-2 text-xs leading-relaxed text-slate-500"><span className="font-extrabold text-teal-700">Answer:</span> {q.correctAnswer}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{q.explanation}</p>
          </div>)}
        </div>

        <button type="button" onClick={handleSave} disabled={questions.length === 0} className="mt-6 flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60">
          <Sparkles size={16} />Save Quiz ({questions.length} questions)
        </button>
      </>}
    </div>
  </section>;
}
