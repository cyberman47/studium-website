"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Plus, Search } from "lucide-react";
import {
  CommunityLesson, COMMUNITY_LESSONS_EVENT, addCommunityLessonToLibrary, getCommunityLessons,
  getRecommendedCommunityLessons, getRecentCommunityLessons, getTrendingCommunityLessons, removeCommunityLessonFromLibrary
} from "@/lib/communityLessons";
import { LIBRARY_SAVES_EVENT } from "@/lib/myLibrary";
import { CommunityLessonCard } from "@/components/community-lesson-card";

export default function CommunityLibraryPage() {
  const [all, setAll] = useState<CommunityLesson[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [pathFilter, setPathFilter] = useState<string | null>(null);
  const [, setSaveVersion] = useState(0);

  function refresh() {
    setAll(getCommunityLessons());
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
    function bumpSaves() { setSaveVersion(v => v + 1); }
    window.addEventListener(COMMUNITY_LESSONS_EVENT, refresh);
    window.addEventListener(LIBRARY_SAVES_EVENT, bumpSaves);
    return () => {
      window.removeEventListener(COMMUNITY_LESSONS_EVENT, refresh);
      window.removeEventListener(LIBRARY_SAVES_EVENT, bumpSaves);
    };
  }, []);

  const pathNames = useMemo(() => Array.from(new Set(all.map(l => l.pathName))).sort(), [all]);

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = all;
    if (pathFilter) list = list.filter(l => l.pathName === pathFilter);
    if (q) list = list.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.subject.toLowerCase().includes(q));
    return list;
  }, [all, query, pathFilter]);

  // Discovery sections only render when nothing's actively being filtered
  // (see isFiltering below), so they read straight from the real lib
  // functions rather than intersecting against `searched` by object
  // reference—getCommunityLessons() re-parses localStorage on every call, so
  // two calls never return referentially-equal objects even for the same
  // underlying lesson.
  const trending = useMemo(() => getTrendingCommunityLessons(6), [all]);
  const recent = useMemo(() => getRecentCommunityLessons(6), [all]);
  const recommended = useMemo(() => getRecommendedCommunityLessons(6), [all]);

  if (!loaded) return null;

  const isFiltering = query.trim() !== "" || pathFilter !== null;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/library" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Library</Link>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <span className="eyebrow"><Globe size={13} />Community</span>
        <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Study guides from fellow students.</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Real content published by real Studium students—preview any of it, then add it to your own Library.</p>
      </div>
      <Link href="/dashboard/library/community/publish" className="mt-1 inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Plus size={16} />Publish a Lesson</Link>
    </div>

    <div className="relative mt-8 max-w-xl">
      <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search community content…" className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-3 pl-11 pr-4 text-sm font-semibold text-heading outline-none focus:border-teal-400" />
    </div>

    {pathNames.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => setPathFilter(null)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${!pathFilter ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All</button>
      {pathNames.map(p => <button key={p} type="button" onClick={() => setPathFilter(pathFilter === p ? null : p)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${pathFilter === p ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{p}</button>)}
    </div>}

    {all.length === 0
      ? <div className="mt-10 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-10 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><Globe size={26} /></span>
        <p className="mt-4 text-base font-extrabold text-heading">Community content is coming soon.</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">Student-created lessons and study resources will appear here.</p>
        <Link href="/dashboard/library/community/publish" className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Plus size={16} />Be the first to publish</Link>
      </div>
      : isFiltering
        ? <div className="mt-8">
          <p className="text-xs font-bold text-slate-400">{searched.length} result{searched.length === 1 ? "" : "s"}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searched.map(l => <CommunityLessonCard key={l.id} lesson={l} onSave={addCommunityLessonToLibrary} onUnsave={removeCommunityLessonFromLibrary} />)}
          </div>
        </div>
        : <div className="mt-10 space-y-10">
          {trending.length > 0 && <DiscoverySection title="Trending" subtitle="The most-added community lessons right now." lessons={trending} />}
          {recommended.length > 0 && <DiscoverySection title="Recommended for You" subtitle="Based on subjects you've already saved." lessons={recommended} />}
          {recent.length > 0 && <DiscoverySection title="Recently Added" subtitle="The newest lessons published by students." lessons={recent} />}
        </div>}
  </section>;
}

function DiscoverySection({ title, subtitle, lessons }: { title: string; subtitle: string; lessons: CommunityLesson[] }) {
  return <div>
    <h2 className="text-lg font-extrabold tracking-tight text-heading">{title}</h2>
    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map(l => <CommunityLessonCard key={l.id} lesson={l} onSave={addCommunityLessonToLibrary} onUnsave={removeCommunityLessonFromLibrary} />)}
    </div>
  </div>;
}
