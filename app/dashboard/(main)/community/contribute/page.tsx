"use client";

// Contribute: a hub into Studium's existing creation systems, not a second
// one. Every action here routes to the real, already-built flow that
// actually does the work (lib/create.ts's AI generation, lib/
// communityLessons.ts's publish flow, the real Forum)—this page only
// surfaces them with real counts of what you've already made.
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, Brain, Globe, HelpCircle, MessagesSquare, PenLine, Sparkles, Stethoscope, Type
} from "lucide-react";
import { getDecks, getLessons, getQuizzes, getSummaries } from "@/lib/create";
import { getMyCommunityLessons } from "@/lib/communityLessons";
import { CommunityReputation, fetchReputation } from "@/lib/community";
import { createClient } from "@/lib/supabase/client";

const cardClass = "rounded-3xl border border-black/[0.06] dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

const createOptions = [
  { label: "Generate Flashcards", desc: "AI-generated cards from a topic or your own notes.", href: "/dashboard/create/flashcards", icon: Brain, color: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300" },
  { label: "Create a Quiz", desc: "Real practice questions on any topic.", href: "/dashboard/create/quiz", icon: HelpCircle, color: "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300" },
  { label: "Write a Summary", desc: "High-yield notes and key definitions.", href: "/dashboard/create/summary", icon: PenLine, color: "bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300" },
  { label: "Extract Terminology", desc: "Pull real terms and definitions from any material.", href: "/dashboard/create/terminology", icon: Type, color: "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300" }
];

export default function ContributePage() {
  const [counts, setCounts] = useState({ myCreations: 0, published: 0 });
  const [reputation, setReputation] = useState<CommunityReputation | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setCounts({
      myCreations: getDecks().length + getQuizzes().length + getLessons().length + getSummaries().length,
      published: getMyCommunityLessons().length
    });
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setSignedIn(!!user);
      if (user) setReputation(await fetchReputation(user.id));
    });
  }, []);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[280px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Contribute</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Build the knowledge base.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Everything you create with Studium AI in one place—turn your own study material into something the whole community can learn from.</p>

    {/* Real counts—nothing here is a fabricated "impact" number */}
    <div className="mt-8 grid grid-cols-3 gap-4">
      <div className={`${cardClass} p-5 text-center`}>
        <p className="text-2xl font-extrabold text-heading dark:text-white">{counts.myCreations}</p>
        <p className="mt-1 text-xs font-bold text-slate-500">Things you've created</p>
      </div>
      <div className={`${cardClass} p-5 text-center`}>
        <p className="text-2xl font-extrabold text-heading dark:text-white">{counts.published}</p>
        <p className="mt-1 text-xs font-bold text-slate-500">Published to Community</p>
      </div>
      <div className={`${cardClass} p-5 text-center`}>
        <p className="text-2xl font-extrabold text-heading dark:text-white">{reputation?.discussionsStarted ?? "—"}</p>
        <p className="mt-1 text-xs font-bold text-slate-500">Forum discussions started</p>
      </div>
    </div>

    <div className="mt-10">
      <h2 className="text-lg font-extrabold tracking-tight">Create Study Material</h2>
      <p className="mt-1 text-sm text-slate-500">Uses the same AI generator as Studium's Create section—nothing new to learn.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {createOptions.map(opt => <Link key={opt.href} href={opt.href} className={`${cardClass} group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift`}>
          <span className={`grid h-11 w-11 place-items-center rounded-2xl transition-transform duration-200 group-hover:scale-105 ${opt.color}`}><opt.icon size={20} /></span>
          <p className="mt-3 text-sm font-extrabold text-heading dark:text-white">{opt.label}</p>
          <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">{opt.desc}</p>
        </Link>)}
      </div>
    </div>

    <div className="mt-10 grid gap-4 sm:grid-cols-2">
      <Link href="/dashboard/library/community/publish" className={`${cardClass} flex items-center justify-between gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-lift`}>
        <div className="flex items-center gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300"><Globe size={20} /></span>
          <div>
            <p className="text-sm font-extrabold text-heading dark:text-white">Publish a Study Guide</p>
            <p className="mt-0.5 text-xs text-slate-500">Share a real study guide other students can find and save.</p>
          </div>
        </div>
        <ArrowUpRight size={16} className="shrink-0 text-slate-300" />
      </Link>

      <Link href="/dashboard/community/forum/ask" className={`${cardClass} flex items-center justify-between gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-lift`}>
        <div className="flex items-center gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300"><MessagesSquare size={20} /></span>
          <div>
            <p className="text-sm font-extrabold text-heading dark:text-white">Start a Discussion</p>
            <p className="mt-0.5 text-xs text-slate-500">Ask a question or share something in the Forum.</p>
          </div>
        </div>
        <ArrowUpRight size={16} className="shrink-0 text-slate-300" />
      </Link>
    </div>

    {!signedIn && <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/10 p-4">
      <Stethoscope size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300" />
      <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">Sign in to publish to the Community or post in the Forum—Create's AI tools above work either way.</p>
    </div>}
  </section>;
}
