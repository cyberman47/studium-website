"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Check, Clock3, FileText } from "lucide-react";
import { getArticle } from "@/lib/articles";
import { isInLibrary, LIBRARY_SAVES_EVENT, toggleLibrarySave } from "@/lib/myLibrary";

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = getArticle(params.id);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!article) return;
    setSaved(isInLibrary("article", article.id));
    function refresh() { setSaved(isInLibrary("article", article!.id)); }
    window.addEventListener(LIBRARY_SAVES_EVENT, refresh);
    return () => window.removeEventListener(LIBRARY_SAVES_EVENT, refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (!article) return <section className="relative py-10 sm:py-14">
    <p className="text-sm text-slate-500">Article not found.</p>
    <Link href="/dashboard/library/articles" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back to Articles</Link>
  </section>;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/library/articles" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Articles</Link>

    <div className="mx-auto max-w-2xl">
      <span className="eyebrow"><FileText size={13} />{article.topic}</span>
      <h1 className="display mt-5 text-3xl leading-tight sm:text-4xl">{article.title}</h1>
      <div className="mt-4 flex items-center gap-3 text-xs font-bold text-slate-500">
        <span>{article.source}</span><span>·</span><span className="flex items-center gap-1"><Clock3 size={12} />{article.readingMinutes} min read</span><span>·</span><span>{new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>

      <button type="button" onClick={() => toggleLibrarySave("article", article.id)} className={`mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${saved ? "border-2 border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "bg-accent-500 text-white shadow-[0_12px_25px_-12px_#047857] hover:-translate-y-0.5 hover:bg-accent-600"}`}>
        {saved ? <><Check size={16} />Saved to My Library</> : <><Bookmark size={15} />Save to My Library</>}
      </button>

      <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-600">
        {article.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  </section>;
}
