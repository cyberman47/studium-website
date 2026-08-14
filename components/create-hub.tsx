"use client";

import Link from "next/link";
import { HelpCircle, Layers, UploadCloud } from "lucide-react";

// Three ways to create, per the Create page redesign. "Create from Files" is
// the existing upload flow directly below on the same page (no new route—
// this just anchors down to it); real text (a .txt upload or pasted notes)
// feeds a real AI generator, other formats fall back to the labeled sample
// walkthrough. "Create a Quiz" and "Create Flashcards" are both real
// curriculum-driven builders that call the same AI generator
// (app/api/generate/route.ts) with the exact topics you select.
export function CreateHub() {
  return <div className="mt-8 grid gap-4 sm:grid-cols-3">
    <a href="#upload-files" className="group flex cursor-pointer flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lift">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700 transition-transform duration-200 group-hover:scale-105"><UploadCloud size={22} /></span>
      <h2 className="mt-4 text-base font-extrabold tracking-tight text-heading">Create from Files</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">Paste notes or upload a .txt file for real AI generation, or try any file type as a sample walkthrough.</p>
    </a>

    <Link href="/dashboard/create/build-quiz" className="group flex cursor-pointer flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lift">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-600 transition-transform duration-200 group-hover:scale-105"><HelpCircle size={22} /></span>
      <h2 className="mt-4 text-base font-extrabold tracking-tight text-heading">Create a Quiz</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">Select exact topics from Studium's curriculum and generate real AI questions.</p>
    </Link>

    <Link href="/dashboard/create/build-flashcards" className="group flex cursor-pointer flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lift">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300 text-indigo-600 transition-transform duration-200 group-hover:scale-105"><Layers size={22} /></span>
      <h2 className="mt-4 text-base font-extrabold tracking-tight text-heading">Create Flashcards</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">Select exact topics from Studium's curriculum and generate real AI flashcards.</p>
    </Link>
  </div>;
}
