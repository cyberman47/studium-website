"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { sampleDocument, sampleLesson, saveLesson } from "@/lib/create";
import { InteractiveText } from "@/components/interactive-text";

export default function CreateLessonPage() {
  const [saved, setSaved] = useState(false);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><BookOpen size={13} />Build Lesson</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{sampleLesson.title}.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">A sample structured lesson generated from {sampleDocument.fileName}, in Studium's Learning Path style.</p>

    <div className="mt-8 max-w-2xl space-y-6">
      {saved && <div className="rounded-3xl border border-teal-100 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 p-5 text-center">
        <p className="text-sm font-extrabold text-teal-700">Lesson saved to My Creations ✓</p>
      </div>}

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Introduction</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600"><InteractiveText text={sampleLesson.introduction} /></p>
      </div>

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Main Concepts</h2>
        <div className="mt-3 space-y-4">
          {sampleLesson.mainConcepts.map(c => <div key={c.heading}>
            <p className="text-sm font-extrabold text-heading">{c.heading}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600"><InteractiveText text={c.body} /></p>
          </div>)}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Examples</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
          {sampleLesson.examples.map(ex => <li key={ex}><InteractiveText text={ex} /></li>)}
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Lightbulb size={14} className="text-amber-500" />Key Takeaways</h2>
        <ul className="mt-3 space-y-2">{sampleLesson.keyTakeaways.map(t => <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-teal-500" />{t}</li>)}</ul>
      </div>

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Practice Questions</h2>
        <div className="mt-3 space-y-3">
          {sampleLesson.practiceQuestions.map((q, i) => <div key={i} className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-3.5">
            <p className="text-sm font-bold text-heading">{i + 1}. {q.question}</p>
            <p className="mt-1 text-xs leading-relaxed text-teal-700">{q.correctAnswer}</p>
          </div>)}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Summary</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{sampleLesson.summary}</p>
      </div>

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Flashcards</h2>
        <div className="mt-3 flex flex-wrap gap-2">{sampleLesson.flashcards.map(f => <span key={f.question} className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-3 py-1.5 text-xs font-bold text-teal-700">{f.question}</span>)}</div>
      </div>

      {!saved && <button type="button" onClick={() => { saveLesson(sampleLesson.title); setSaved(true); }} className="flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Sparkles size={16} />Save Lesson</button>}
    </div>
  </section>;
}
