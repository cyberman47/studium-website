"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles, Stethoscope } from "lucide-react";
import { CaseAttempt, ClinicalCase, getAllCases, getCaseOfTheDay, getTodayCaseAttempt } from "@/lib/clinicalCases";
import { findLibraryCategory } from "@/lib/libraryCategories";

const difficultyClasses: Record<string, string> = {
  Beginner: "bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300 text-emerald-700",
  Intermediate: "bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 text-amber-700",
  Advanced: "bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 text-rose-700"
};

export default function LibraryCategoryPage({ params }: { params: { category: string } }) {
  const category = findLibraryCategory(params.category);

  if (!category) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Category not found.</p>
      <Link href="/dashboard/library" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back to Library</Link>
    </section>;
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/library" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Library</Link>
    <span className="eyebrow"><Sparkles size={13} />Library</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{category.name}.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">{category.description}</p>

    {category.id === "clinical-cases" ? <ClinicalCasesView />
      : category.id === "flashcards" ? <FlashcardsRedirect />
      : <EmptyState category={category} />}
  </section>;
}

// The real Flashcard Library already lives at /dashboard/flashcards (browse,
// search, filter, decks)—rather than building a second UI here, this
// category card hands off to it directly.
function FlashcardsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/flashcards");
  }, [router]);
  return <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-20 text-center shadow-soft">
    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300 text-indigo-600"><Sparkles size={26} /></span>
    <p className="text-base font-extrabold text-heading">Taking you to your Flashcard Library…</p>
    <Link href="/dashboard/flashcards" className="mt-1 cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">Click here if you're not redirected</Link>
  </div>;
}

function EmptyState({ category }: { category: NonNullable<ReturnType<typeof findLibraryCategory>> }) {
  return <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-20 text-center shadow-soft">
    <span className={`grid h-14 w-14 place-items-center rounded-2xl ${category.color}`}><category.icon size={26} /></span>
    <p className="text-base font-extrabold text-heading">Nothing here yet.</p>
    <p className="max-w-xs text-sm leading-relaxed text-slate-500">We're still building this section—check back soon.</p>
  </div>;
}

function ClinicalCasesView() {
  const [todaysCase, setTodaysCase] = useState<ClinicalCase | null>(null);
  const [attempt, setAttempt] = useState<CaseAttempt | null>(null);
  const [allCases, setAllCases] = useState<ClinicalCase[]>([]);

  useEffect(() => {
    setTodaysCase(getCaseOfTheDay());
    setAttempt(getTodayCaseAttempt());
    setAllCases(getAllCases());
  }, []);

  return <div className="mt-10 max-w-3xl space-y-8">
    {todaysCase && <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-lift sm:p-7">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-teal-300"><Stethoscope size={12} />Today's Case</span>
          <h2 className="display mt-3 text-xl sm:text-2xl">{todaysCase.title}</h2>
          <p className="mt-1 text-sm text-slate-300">{todaysCase.category} · {todaysCase.difficulty}</p>
        </div>
        <Link href="/dashboard/case-of-the-day" className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-600">
          {attempt ? "Review your answer" : "Open case"}<ArrowUpRight size={15} />
        </Link>
      </div>
    </div>}

    <div>
      <h2 className="text-lg font-extrabold tracking-tight">All Cases</h2>
      <p className="mt-1 text-sm text-slate-500">Browse the full case library. Only today's case can be solved for credit—new cases rotate in daily.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {allCases.map(c => <div key={c.id} className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[11px] font-extrabold text-slate-600">{c.category}</span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${difficultyClasses[c.difficulty]}`}>{c.difficulty}</span>
            {todaysCase?.id === c.id && <span className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-2.5 py-1 text-[11px] font-extrabold text-teal-700"><CheckCircle2 size={11} />Today</span>}
          </div>
          <h3 className="mt-3 text-sm font-extrabold text-heading">{c.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{c.stem}</p>
        </div>)}
      </div>
    </div>
  </div>;
}
