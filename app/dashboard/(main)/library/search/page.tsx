"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, BookOpen, FileText, Globe, Link2, Search } from "lucide-react";
import { getAllRealLessons, BrowsableLesson } from "@/lib/mcatPath";
import { CommunityLesson, getCommunityLessons } from "@/lib/communityLessons";
import { Article, getArticles } from "@/lib/articles";
import { Resource, getResources } from "@/lib/resources";

export default function LibrarySearchPage() {
  return <Suspense fallback={null}><LibrarySearchContent /></Suspense>;
}

function LibrarySearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [loaded, setLoaded] = useState(false);

  const [lessons, setLessons] = useState<BrowsableLesson[]>([]);
  const [community, setCommunity] = useState<CommunityLesson[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    setLessons(getAllRealLessons());
    setCommunity(getCommunityLessons());
    setArticles(getArticles());
    setResources(getResources());
    setLoaded(true);
  }, []);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(`/dashboard/library/search?q=${encodeURIComponent(query.trim())}`);
  }

  const q = query.trim().toLowerCase();
  const matchedLessons = useMemo(() => q ? lessons.filter(l => l.content.title.toLowerCase().includes(q) || l.content.simplifiedExplanation.toLowerCase().includes(q)) : [], [lessons, q]);
  const matchedCommunity = useMemo(() => q ? community.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.subject.toLowerCase().includes(q)) : [], [community, q]);
  const matchedArticles = useMemo(() => q ? articles.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)) : [], [articles, q]);
  const matchedResources = useMemo(() => q ? resources.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) : [], [resources, q]);

  const totalMatches = matchedLessons.length + matchedCommunity.length + matchedArticles.length + matchedResources.length;

  if (!loaded) return null;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/library" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Library</Link>
    <span className="eyebrow"><Search size={13} />Search</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Search the Library.</h1>

    <form onSubmit={submit} className="relative mt-6 max-w-xl">
      <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search lessons, community, articles, resources…" className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-3.5 pl-11 pr-4 text-sm font-semibold text-heading outline-none focus:border-teal-400" />
    </form>

    {!q
      ? <p className="mt-8 text-sm text-slate-400">Type something to search across all of the Library.</p>
      : <>
        <p className="mt-6 text-xs font-bold text-slate-400">{totalMatches} result{totalMatches === 1 ? "" : "s"} for &ldquo;{query.trim()}&rdquo;</p>

        {totalMatches === 0
          ? <p className="mt-6 text-sm text-slate-400">Nothing matched. Try a different word.</p>
          : <div className="mt-6 space-y-8">
            {matchedLessons.length > 0 && <ResultGroup icon={BookOpen} label="Lessons">
              {matchedLessons.map(l => <Link key={l.content.id} href={`/dashboard/learning-paths/mcat/${l.content.sectionId}/${l.content.subjectId}/${l.content.id}`} className="block cursor-pointer rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                <p className="text-sm font-extrabold text-heading">{l.content.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{l.sectionTitle} · {l.subjectName}</p>
              </Link>)}
            </ResultGroup>}

            {matchedCommunity.length > 0 && <ResultGroup icon={Globe} label="Community">
              {matchedCommunity.map(l => <Link key={l.id} href={`/dashboard/library/community/${l.id}`} className="block cursor-pointer rounded-2xl border border-slate-200 dark:border-white/10 bg-[#fdfefe] dark:bg-[#0d1917] p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                <p className="text-sm font-extrabold text-heading">{l.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">by {l.creatorName} · {l.pathName} · {l.subject}</p>
              </Link>)}
            </ResultGroup>}

            {matchedArticles.length > 0 && <ResultGroup icon={FileText} label="Articles">
              {matchedArticles.map(a => <Link key={a.id} href={`/dashboard/library/articles/${a.id}`} className="block cursor-pointer rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                <p className="text-sm font-extrabold text-heading">{a.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{a.topic} · {a.readingMinutes} min read</p>
              </Link>)}
            </ResultGroup>}

            {matchedResources.length > 0 && <ResultGroup icon={Link2} label="Resources">
              {matchedResources.map(r => <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="block cursor-pointer rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                <p className="text-sm font-extrabold text-heading">{r.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{r.type} · {r.source}</p>
              </a>)}
            </ResultGroup>}
          </div>}
      </>}
  </section>;
}

function ResultGroup({ icon: Icon, label, children }: { icon: typeof BookOpen; label: string; children: React.ReactNode }) {
  return <div>
    <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-400"><Icon size={14} />{label}</h2>
    <div className="mt-3 grid gap-2.5 sm:grid-cols-2">{children}</div>
  </div>;
}
