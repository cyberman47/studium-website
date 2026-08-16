"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { GeneratedSummary, sampleDocument, sampleSummary, saveSummary } from "@/lib/create";
import { consumePendingSource, generateSummary } from "@/lib/aiGenerate";

type LoadState = "loading" | "generating" | "ready" | "error";

export default function CreateSummaryPage() {
  // Same real/sample split as the other generators—see the identical note
  // on the Flashcards and Lesson pages.
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [genError, setGenError] = useState<string | null>(null);
  const [summary, setSummary] = useState<GeneratedSummary>(sampleSummary);
  const [isSample, setIsSample] = useState(true);
  const [title, setTitle] = useState(`${sampleDocument.fileName.replace(/\.[^.]+$/, "")} — Summary`);
  const [saved, setSaved] = useState(false);

  const consumedRef = useRef(false);

  useEffect(() => {
    if (consumedRef.current) return;
    consumedRef.current = true;

    const pendingSource = consumePendingSource();
    if (pendingSource) {
      if (pendingSource.kind === "text" && pendingSource.fileName) setTitle(`${pendingSource.fileName.replace(/\.[^.]+$/, "")} — Summary`);
      setLoadState("generating");
      generateSummary(pendingSource).then(result => {
        if ("error" in result) { setGenError(result.error); setLoadState("error"); return; }
        setSummary(result.items);
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
      <p className="text-sm font-extrabold text-heading dark:text-white">Summarizing your notes…</p>
      <p className="max-w-xs text-xs leading-relaxed text-slate-500">A real AI call is reading your text and writing a summary. This takes a few seconds.</p>
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
    <span className="eyebrow"><FileText size={13} />Create Summary</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Study summary.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">{isSample ? `A sample summary generated from ${sampleDocument.fileName}.` : "A real summary, written by AI from your own notes."}</p>

    <div className="mt-8 max-w-2xl space-y-6">
      {saved && <div className="rounded-3xl border border-teal-100 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 p-5 text-center">
        <p className="text-sm font-extrabold text-teal-700 dark:text-teal-300">Summary saved to My Creations ✓</p>
      </div>}

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Short Summary</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{summary.shortSummary}</p>
      </div>

      {summary.highYieldNotes.length > 0 && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">High-Yield Notes</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">{summary.highYieldNotes.map(n => <li key={n}>{n}</li>)}</ul>
      </div>}

      {summary.importantConcepts.length > 0 && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Important Concepts</h2>
        <div className="mt-3 flex flex-wrap gap-2">{summary.importantConcepts.map(c => <span key={c} className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-3 py-1.5 text-xs font-bold text-teal-700">{c}</span>)}</div>
      </div>}

      {summary.keyDefinitions.length > 0 && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Key Definitions</h2>
        <div className="mt-3 space-y-2.5">{summary.keyDefinitions.map(d => <p key={d.term} className="text-sm leading-relaxed text-slate-600"><span className="font-extrabold text-heading">{d.term}:</span> {d.definition}</p>)}</div>
      </div>}

      {summary.examTips.length > 0 && <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Exam Tips</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">{summary.examTips.map(t => <li key={t}>{t}</li>)}</ul>
      </div>}

      {!saved && <button type="button" onClick={() => { saveSummary(title, summary); setSaved(true); }} className="flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Sparkles size={16} />Save Summary</button>}
    </div>
  </section>;
}
