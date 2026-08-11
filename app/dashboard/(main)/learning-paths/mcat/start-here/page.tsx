"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, BookOpenCheck, Clock3, Compass, GraduationCap, ListChecks, RotateCcw, Sparkles
} from "lucide-react";
import { Reveal } from "@/components/ui";
import { McatSubnav } from "@/components/mcat-subnav";
import { markMcatStartHereSeen } from "@/lib/mcatConcepts";

export default function McatStartHerePage() {
  useEffect(() => { markMcatStartHereSeen(); }, []);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Start Here</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Welcome to the MCAT.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">A short orientation—worth reading once, then it's out of your way. Come back here any time from the tabs below.</p>

    <div className="mt-8">
      <McatSubnav />
    </div>

    <div className="mt-10 max-w-2xl space-y-6">
      <Reveal delay={0}>
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-100 text-teal-700"><GraduationCap size={20} /></span>
          <h2 className="mt-4 text-lg font-extrabold tracking-tight text-ink">What is the MCAT?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">The Medical College Admission Test is a standardized, computer-based exam almost every U.S. and Canadian medical school requires for admission. It's about 7.5 hours long (with breaks) and tests both science knowledge and reasoning under exam conditions—so preparing for it means building real understanding <em>and</em> practicing the format itself, not just memorizing facts.</p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-600"><Clock3 size={20} /></span>
          <h2 className="mt-4 text-lg font-extrabold tracking-tight text-ink">How the MCAT works</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">The exam has four sections, each scored 118–132 (total 472–528):</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
            <li className="flex gap-2"><span className="font-extrabold text-ink">Bio &amp; Biochem —</span> how living systems work, from molecules to organ systems.</li>
            <li className="flex gap-2"><span className="font-extrabold text-ink">Chem &amp; Phys —</span> the chemistry and physics underlying biological systems.</li>
            <li className="flex gap-2"><span className="font-extrabold text-ink">Psych, Social &amp; Bio of Behavior —</span> how psychological, social, and biological factors shape behavior and health.</li>
            <li className="flex gap-2"><span className="font-extrabold text-ink">CARS —</span> reading comprehension and reasoning about humanities/social science passages—no outside content knowledge required.</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">Most questions in the three science sections are attached to short passages, mixed with standalone "discrete" questions. CARS is entirely passage-based.</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-700"><Compass size={20} /></span>
          <h2 className="mt-4 text-lg font-extrabold tracking-tight text-ink">How to use Studium for MCAT prep</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Studium splits MCAT prep into three activities that stay independent on purpose—use whichever one matches what you need right now:</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f9fcfc] p-4">
              <BookOpenCheck size={16} className="text-teal-600" />
              <p className="mt-2 text-sm font-extrabold text-ink">Learn</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">Study the material lesson by lesson, organized by the four real MCAT exam sections.</p>
            </div>
            <div className="rounded-2xl bg-[#f9fcfc] p-4">
              <ListChecks size={16} className="text-violet-600" />
              <p className="mt-2 text-sm font-extrabold text-ink">Practice</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">Drill exam-realistic questions organized by the four real MCAT sections.</p>
            </div>
            <div className="rounded-2xl bg-[#f9fcfc] p-4">
              <RotateCcw size={16} className="text-amber-700" />
              <p className="mt-2 text-sm font-extrabold text-ink">Review</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">Flashcards, spaced repetition, and your personal weak areas—whenever you have a few minutes.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">The Learning Path recommends what to study next, but it won't force a fixed order—you're always free to jump straight into flashcards or practice questions.</p>
        </div>
      </Reveal>
    </div>

    <div className="mt-8 max-w-2xl">
      <Link href="/dashboard/learning-paths/mcat" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Start Learning<ArrowRight size={15} /></Link>
    </div>
  </section>;
}
