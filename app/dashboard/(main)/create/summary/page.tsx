"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { sampleDocument, sampleSummary, saveSummary } from "@/lib/create";

export default function CreateSummaryPage() {
  const [saved, setSaved] = useState(false);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><FileText size={13} />Create Summary</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Study summary.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">A sample summary generated from {sampleDocument.fileName}.</p>

    <div className="mt-8 max-w-2xl space-y-6">
      {saved && <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5 text-center">
        <p className="text-sm font-extrabold text-teal-700">Summary saved to My Creations ✓</p>
      </div>}

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Short Summary</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{sampleSummary.shortSummary}</p>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">High-Yield Notes</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">{sampleSummary.highYieldNotes.map(n => <li key={n}>{n}</li>)}</ul>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Important Concepts</h2>
        <div className="mt-3 flex flex-wrap gap-2">{sampleSummary.importantConcepts.map(c => <span key={c} className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">{c}</span>)}</div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Key Definitions</h2>
        <div className="mt-3 space-y-2.5">{sampleSummary.keyDefinitions.map(d => <p key={d.term} className="text-sm leading-relaxed text-slate-600"><span className="font-extrabold text-ink">{d.term}:</span> {d.definition}</p>)}</div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Exam Tips</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">{sampleSummary.examTips.map(t => <li key={t}>{t}</li>)}</ul>
      </div>

      {!saved && <button type="button" onClick={() => { saveSummary(`${sampleDocument.fileName.replace(/\.[^.]+$/, "")} — Summary`); setSaved(true); }} className="flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Sparkles size={16} />Save Summary</button>}
    </div>
  </section>;
}
