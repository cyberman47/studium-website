"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, ExternalLink, Link2 } from "lucide-react";
import { getResources, Resource } from "@/lib/resources";
import { isInLibrary, LIBRARY_SAVES_EVENT, toggleLibrarySave } from "@/lib/myLibrary";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [, setSaveVersion] = useState(0);

  useEffect(() => {
    setResources(getResources());
    function bump() { setSaveVersion(v => v + 1); }
    window.addEventListener(LIBRARY_SAVES_EVENT, bump);
    return () => window.removeEventListener(LIBRARY_SAVES_EVENT, bump);
  }, []);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/library" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Library</Link>
    <span className="eyebrow"><Link2 size={13} />Resources</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Real reference material.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Genuine external organizations and references worth bookmarking—each one clearly sourced.</p>

    <div className="mt-8 space-y-3">
      {resources.map(r => {
        const saved = isInLibrary("resource", r.id);
        return <div key={r.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Link2 size={19} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">{r.type} · {r.source}</p>
            <a href={r.url} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex cursor-pointer items-center gap-1.5 text-sm font-extrabold text-heading hover:text-teal-700">{r.title}<ExternalLink size={12} className="text-slate-400" /></a>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{r.description}</p>
          </div>
          <button type="button" onClick={() => toggleLibrarySave("resource", r.id)} title={saved ? "Remove from Library" : "Save to Library"} className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border transition ${saved ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600" : "border-slate-200 dark:border-white/10 text-slate-400 hover:border-teal-200 hover:text-teal-600"}`}><Bookmark size={15} fill={saved ? "currentColor" : "none"} /></button>
        </div>;
      })}
    </div>
  </section>;
}
