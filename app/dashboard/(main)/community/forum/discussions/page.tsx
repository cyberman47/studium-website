"use client";

// Category-grouped browse—the exact taxonomy from the product spec, with
// real per-category post counts (fetchCategoryCounts, lib/community.ts).
// Clicking a category deep-links into the Feed filtered to it, rather than
// duplicating the feed-rendering logic here.
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ListTree } from "lucide-react";
import { categoryGroups, categoryLabels, CommunityCategory, fetchCategoryCounts } from "@/lib/community";

export default function DiscussionsPage() {
  const [counts, setCounts] = useState<Map<CommunityCategory, number> | null>(null);

  useEffect(() => { fetchCategoryCounts().then(setCounts); }, []);

  return <div>
    <span className="eyebrow"><ListTree size={13} />Discussions</span>
    <h1 className="display mt-4 text-3xl">Browse by category.</h1>
    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">Every category below is a real, live filter on the Community feed—post counts update as students actually post.</p>

    <div className="mt-8 space-y-8">
      {categoryGroups.map(group => <div key={group.label}>
        <p className="text-xs font-extrabold uppercase tracking-wide text-teal-700">{group.label}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {group.categories.map(c => <Link key={c} href={`/dashboard/community/forum?category=${c}`} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lift">
            <div>
              <p className="text-sm font-extrabold text-heading">{categoryLabels[c]}</p>
              <p className="mt-0.5 text-xs text-slate-400">{counts ? `${counts.get(c) ?? 0} post${(counts.get(c) ?? 0) === 1 ? "" : "s"}` : "…"}</p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-slate-300" />
          </Link>)}
        </div>
      </div>)}
    </div>
  </div>;
}
