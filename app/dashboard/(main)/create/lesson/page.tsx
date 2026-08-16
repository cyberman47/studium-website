"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { GeneratedLesson, sampleDocument, sampleLesson, saveLesson } from "@/lib/create";
import { consumePendingSource, generateLesson } from "@/lib/aiGenerate";
import { InteractiveText } from "@/components/interactive-text";

type LoadState = "loading" | "generating" | "ready" | "error";

export default function CreateLessonPage() {
  // Same real/sample split as the Flashcards and Quiz generators: real
  // source text handed off via consumePendingSource triggers a real AI
  // call here; a direct/bookmarked visit with nothing pending falls back
  // to the honest sample walkthrough exactly as before.
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [genError, setGenError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<GeneratedLesson>(sampleLesson);
  const [isSample, setIsSample] = useState(true);
  const [saved, setSaved] = useState(false);

  // Guards the one-shot sessionStorage read against React Strict Mode's dev
  // double-invoke of effects—see the identical note on the Flashcards page.
  const consumedRef = useRef(false);

  useEffect(() => {
    if (consumedRef.current) return;
    consumedRef.current = true;

    const pendingSource = consumePendingSource();
    if (pendingSource) {
      setLoadState("generating");
      generateLesson(pendingSource).then(result => {
        if ("error" in result) { setGenError(result.error); setLoadState("error"); return; }
        setLesson(result.items);
        setIsSample(false);
        setLoadState("ready");
      });
      return;
    }

    setLoadState("ready");
  }, []);

  if (loadState === "loading") return null;

  if (loadState === "generating") return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <div className="mt-16 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-20 text-center shadow-soft">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300"><Sparkles size={22} /></span>
      <p className="text-sm font-extrabold text-heading dark:text-white">Building a lesson from your notes…</p>
      <p className="max-w-xs text-xs leading-relaxed text-slate-500">A real AI call is reading your text and structuring a full lesson. This takes a bit longer than flashcards.</p>
    </div>
  </section>;

  if (loadState === "error") return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <div className="mt-16 flex flex-col items-center gap-3 rounded-3xl border border-rose-200 bg-rose-50 dark:bg-rose-500/10 py-16 text-center">
      <p className="text-sm font-extrabold text-rose-700 dark:text-rose-300">Generation failed.</p>
      <p className="max-w-sm text-xs leading-relaxed text-rose-600 dark:text-rose-300">{genError}</p>
      <Link href="/dashboard/create" className="mt-2 inline-block cursor-pointer text-sm font-bold text-teal-700 underline">Back to Create</Link>
    </div>
  </section>;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><BookOpen size={13} />Build Lesson</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{lesson.title}.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">{isSample ? `A sample structured lesson generated from ${sampleDocument.fileName}, in Studium's Learning Path style.` : "A real lesson, structured by AI from your own notes."}</p>

    <div className="mt-8 max-w-2xl space-y-6">
      {saved && <div className="rounded-3xl border border-teal-100 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 p-5 text-center">
        <p className="text-sm font-extrabold text-teal-700 dark:text-teal-300">Lesson saved to My Creations ✓</p>
      </div>}

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Introduction</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600"><InteractiveText text={lesson.introduction} /></p>
      </div>

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Main Concepts</h2>
        <div className="mt-3 space-y-4">
          {lesson.mainConcepts.map(c => <div key={c.heading}>
            <p className="text-sm font-extrabold text-heading">{c.heading}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600"><InteractiveText text={c.body} /></p>
          </div>)}
        </div>
      </div>

      {lesson.examples.length > 0 && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Examples</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
          {lesson.examples.map(ex => <li key={ex}><InteractiveText text={ex} /></li>)}
        </ul>
      </div>}

      {lesson.keyTakeaways.length > 0 && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Lightbulb size={14} className="text-amber-500" />Key Takeaways</h2>
        <ul className="mt-3 space-y-2">{lesson.keyTakeaways.map(t => <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-teal-500" />{t}</li>)}</ul>
      </div>}

      {lesson.practiceQuestions.length > 0 && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Practice Questions</h2>
        <div className="mt-3 space-y-3">
          {lesson.practiceQuestions.map((q, i) => <div key={i} className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-3.5">
            <p className="text-sm font-bold text-heading">{i + 1}. {q.question}</p>
            <p className="mt-1 text-xs leading-relaxed text-teal-700 dark:text-teal-300">{q.correctAnswer}</p>
          </div>)}
        </div>
      </div>}

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Summary</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{lesson.summary}</p>
      </div>

      {lesson.flashcards.length > 0 && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Flashcards</h2>
        <div className="mt-3 flex flex-wrap gap-2">{lesson.flashcards.map(f => <span key={f.question} className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-3 py-1.5 text-xs font-bold text-teal-700">{f.question}</span>)}</div>
      </div>}

      {!saved && <button type="button" onClick={() => { saveLesson(lesson.title, lesson); setSaved(true); }} className="flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Sparkles size={16} />Save Lesson</button>}
    </div>
  </section>;
}
