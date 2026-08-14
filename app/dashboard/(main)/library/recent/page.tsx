"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock3, FileText, Globe, Link2 } from "lucide-react";
import { getAllRealLessons, BrowsableLesson } from "@/lib/mcatPath";
import { CommunityLesson, COMMUNITY_LESSONS_EVENT, getRecentCommunityLessons } from "@/lib/communityLessons";
import { Article, getArticles } from "@/lib/articles";
import { Resource, getResources } from "@/lib/resources";

type Feed = { kind: "community-lesson"; item: CommunityLesson } | { kind: "article"; item: Article } | { kind: "resource"; item: Resource };

function timeOf(f: Feed): number {
  if (f.kind === "community-lesson") return new Date(f.item.createdAt).getTime();
  if (f.kind === "article") return new Date(f.item.publishedAt).getTime();
  return new Date(f.item.addedAt).getTime();
}

export default function RecentlyAddedPage() {
  const [loaded, setLoaded] = useState(false);
  const [lessons, setLessons] = useState<BrowsableLesson[]>([]);
  const [feed, setFeed] = useState<Feed[]>([]);

  function refresh() {
    setLessons(getAllRealLessons());
    const items: Feed[] = [
      ...getRecentCommunityLessons(50).map((item): Feed => ({ kind: "community-lesson", item })),
      ...getArticles().map((item): Feed => ({ kind: "article", item })),
      ...getResources().map((item): Feed => ({ kind: "resource", item }))
    ];
    setFeed(items.sort((a, b) => timeOf(b) - timeOf(a)));
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
    window.addEventListener(COMMUNITY_LESSONS_EVENT, refresh);
    return () => window.removeEventListener(COMMUNITY_LESSONS_EVENT, refresh);
  }, []);

  if (!loaded) return null;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/library" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Library</Link>
    <span className="eyebrow"><Clock3 size={13} />Recently Added</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">What's new.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">The newest community lessons, articles, and resources—genuinely sorted by real publish date.</p>

    <div className="mt-8 space-y-2.5">
      {feed.length === 0 && <p className="py-10 text-center text-sm text-slate-400">Nothing new yet.</p>}
      {feed.map(f => {
        if (f.kind === "community-lesson") return <Link key={`cl-${f.item.id}`} href={`/dashboard/library/community/${f.item.id}`} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-[#fdfefe] dark:bg-[#0d1917] p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-600"><Globe size={16} /></span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-heading">{f.item.title}</p><p className="mt-0.5 text-xs text-slate-500">Community · by {f.item.creatorName} · {new Date(f.item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p></div>
        </Link>;
        if (f.kind === "article") return <Link key={`a-${f.item.id}`} href={`/dashboard/library/articles/${f.item.id}`} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-600"><FileText size={16} /></span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-heading">{f.item.title}</p><p className="mt-0.5 text-xs text-slate-500">Article · {f.item.topic} · {new Date(f.item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p></div>
        </Link>;
        return <a key={`r-${f.item.id}`} href={f.item.url} target="_blank" rel="noreferrer" className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600"><Link2 size={16} /></span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-heading">{f.item.title}</p><p className="mt-0.5 text-xs text-slate-500">Resource · {f.item.source} · {new Date(f.item.addedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p></div>
        </a>;
      })}
    </div>

    <div className="mt-12">
      <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-400"><BookOpen size={14} />Official Lessons</h2>
      <p className="mt-1 text-xs text-slate-500">Hand-written Studium lessons don't carry a publish date the way community content does—browse the full set from All Lessons.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map(l => <Link key={l.content.id} href={`/dashboard/learning-paths/mcat/${l.content.sectionId}/${l.content.subjectId}/${l.content.id}`} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-600"><BookOpen size={16} /></span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-heading">{l.content.title}</p><p className="mt-0.5 text-xs text-slate-500">{l.sectionTitle} · {l.subjectName}</p></div>
        </Link>)}
      </div>
    </div>
  </section>;
}
