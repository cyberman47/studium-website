"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Clock3, FileText } from "lucide-react";
import { Article, getArticles } from "@/lib/articles";
import { isInLibrary, LIBRARY_SAVES_EVENT, toggleLibrarySave } from "@/lib/myLibrary";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [topic, setTopic] = useState<string | null>(null);
  const [, setSaveVersion] = useState(0);

  useEffect(() => {
    setArticles(getArticles());
    function bump() { setSaveVersion(v => v + 1); }
    window.addEventListener(LIBRARY_SAVES_EVENT, bump);
    return () => window.removeEventListener(LIBRARY_SAVES_EVENT, bump);
  }, []);

  const topics = useMemo(() => Array.from(new Set(articles.map(a => a.topic))).sort(), [articles]);
  const filtered = useMemo(() => topic ? articles.filter(a => a.topic === topic) : articles, [articles, topic]);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/library" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Library</Link>
    <span className="eyebrow"><FileText size={13} />Articles</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Short, focused reads.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Real study-skills and exam-concept articles, written to read in a few minutes.</p>

    {topics.length > 0 && <div className="mt-8 flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => setTopic(null)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${!topic ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All topics</button>
      {topics.map(t => <button key={t} type="button" onClick={() => setTopic(topic === t ? null : t)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${topic === t ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{t}</button>)}
    </div>}

    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map(a => {
        const saved = isInLibrary("article", a.id);
        return <div key={a.id} className="flex flex-col rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-amber-600">{a.topic}</p>
            <button type="button" onClick={() => toggleLibrarySave("article", a.id)} title={saved ? "Remove from Library" : "Save to Library"} className={`grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full border transition ${saved ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600" : "border-slate-200 dark:border-white/10 text-slate-400 hover:border-teal-200 hover:text-teal-600"}`}><Bookmark size={14} fill={saved ? "currentColor" : "none"} /></button>
          </div>
          <Link href={`/dashboard/library/articles/${a.id}`} className="mt-1.5 cursor-pointer text-base font-extrabold tracking-tight text-heading hover:text-teal-700">{a.title}</Link>
          <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{a.description}</p>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-slate-400"><Clock3 size={12} />{a.readingMinutes} min read · {a.source}</div>
        </div>;
      })}
    </div>
  </section>;
}
