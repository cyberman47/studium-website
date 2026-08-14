"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { Reveal } from "@/components/ui";
import { McatSubnav } from "@/components/mcat-subnav";
import { getAllConceptAreas } from "@/lib/mcatConcepts";
import { getAllLibraryCards, isCardDue } from "@/lib/flashcardLibrary";
import { getDecks } from "@/lib/flashcardDecks";
import { getWeakConcepts } from "@/lib/practiceHistory";

// A real landing page, not a second flashcard UI—every number here is real
// and every action hands off to the *existing* Flashcard Library and Study
// Decks (lib/flashcardLibrary.ts, lib/flashcardDecks.ts), so "flashcards
// remain independent" the way the restructure asks for: you can jump
// straight from the MCAT dashboard to studying due cards without ever
// opening a lesson.
export default function McatReviewPage() {
  const [stats, setStats] = useState({ dueCount: 0, deckCount: 0, weakCount: 0 });

  useEffect(() => {
    const mcatLessonIds = new Set(getAllConceptAreas().flatMap(a => a.lessonIds));
    const mcatCards = getAllLibraryCards().filter(c => c.source === "lesson" || (c.source === "personal" && c.lessonId && mcatLessonIds.has(c.lessonId)));
    const dueCount = mcatCards.filter(c => isCardDue(c.id)).length;
    const weakCount = getWeakConcepts().filter(w => mcatLessonIds.has(w.lessonId)).length;
    setStats({ dueCount, deckCount: getDecks().length, weakCount });
  }, []);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Review</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Review by personal need.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Flashcards, spaced repetition, and your weak areas—whenever you have a few minutes. This isn't a separate flashcard system; it opens the same Flashcard Library and Decks you already have.</p>

    <div className="mt-8">
      <McatSubnav />
    </div>

    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      <Reveal delay={0}>
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><RotateCcw size={13} />Due for Review</div>
          <p className="mt-3 text-2xl font-extrabold text-heading">{stats.dueCount}</p>
        </div>
      </Reveal>
      <Reveal delay={0.04}>
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Layers size={13} />My Decks</div>
          <p className="mt-3 text-2xl font-extrabold text-heading">{stats.deckCount}</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><TriangleAlert size={13} />Weak Concepts</div>
          <p className="mt-3 text-2xl font-extrabold text-heading">{stats.weakCount}</p>
        </div>
      </Reveal>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <Reveal delay={0.1}>
        <Link href="/dashboard/flashcards" className="group flex h-full flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><RotateCcw size={19} /></span>
            <ArrowUpRight size={17} className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-500" />
          </div>
          <h2 className="mt-4 text-base font-extrabold tracking-tight text-heading">Open Flashcard Library</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">Browse, search, and study every term and lesson card—{stats.dueCount} due right now.</p>
        </Link>
      </Reveal>
      <Reveal delay={0.14}>
        <Link href="/dashboard/flashcards" className="group flex h-full flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600"><Layers size={19} /></span>
            <ArrowUpRight size={17} className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-500" />
          </div>
          <h2 className="mt-4 text-base font-extrabold tracking-tight text-heading">My Decks</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{stats.deckCount > 0 ? `${stats.deckCount} custom deck${stats.deckCount === 1 ? "" : "s"}—combine cards from any concept area.` : "Build a custom deck from cards across any concept area, e.g. \"Biochemistry Exam 1.\""}</p>
        </Link>
      </Reveal>
    </div>

    <div className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/60 dark:bg-amber-500/15 p-6 shadow-soft sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white dark:bg-[#0d1917] text-amber-700 shadow-soft"><TriangleAlert size={19} /></span>
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-heading">Weak Areas</h2>
          <p className="mt-0.5 text-xs text-slate-500">Concepts you've repeatedly missed across every lesson, in one place.</p>
        </div>
      </div>
      {stats.weakCount === 0
        ? <p className="mt-4 text-sm text-amber-900">Nothing flagged yet—keep practicing and this fills in automatically.</p>
        : <Link href="/dashboard/learning-paths/mcat/practice" className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-extrabold text-amber-800 hover:text-amber-900">See weak areas by section in Practice<ArrowUpRight size={13} /></Link>}
    </div>
  </section>;
}
