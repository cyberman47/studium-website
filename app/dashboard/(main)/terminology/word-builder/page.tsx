import Link from "next/link";
import { ArrowLeft, Puzzle, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui";
import { wordRoots } from "@/lib/terminology";

export default function WordBuilderPage() {
  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/terminology" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Terminology</Link>
    <span className="eyebrow"><Puzzle size={13} />Word Builder</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Learn medical roots.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Most medical words are built from a small set of Greek and Latin roots. Learn the pieces, and you can decode words you've never seen before.</p>

    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {wordRoots.map((root, i) => <Reveal key={root.id} delay={i * 0.03}>
        <div className="flex h-full flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-sm font-extrabold text-teal-700"><Sparkles size={16} /></span>
            <div className="min-w-0">
              <p className="text-base font-extrabold text-heading">{root.part}</p>
              <p className="text-xs text-slate-500">= {root.meaning}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {root.examples.map(ex => <span key={ex} className="rounded-full bg-[#f9fcfc] dark:bg-white/5 px-2.5 py-1 text-xs font-bold text-heading">{ex}</span>)}
          </div>
        </div>
      </Reveal>)}
    </div>
  </section>;
}
