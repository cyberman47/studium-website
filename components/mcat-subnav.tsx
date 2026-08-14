"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ListChecks, RotateCcw } from "lucide-react";

// The one piece of UI that makes "Practice by exam section / Review by
// personal need" legible everywhere in the MCAT track, not just on the
// dashboard—shown on every (main)-grouped MCAT page so a student mid-browse
// can jump straight into another activity instead of backtracking to the
// dashboard first. Deliberately not shown on the standalone lesson Study
// Hub, which already has its own "Study Hub" back button serving the same
// purpose in that split-screen layout.
//
// No "Learn" tab: browsing lessons IS the dashboard→section→subject flow
// (pillar cards down to real Read/Practice/Cards rows), not a separate
// concept-grouped page—a dedicated "Learn" tab pointing anywhere else would
// just duplicate "Back to Dashboard" below. No "Dashboard" or "Start Here"
// tabs either, for the same reason—the way back to the dashboard is that
// plain link, not a pill competing with Practice/Review for attention.

const tabs = [
  { label: "Practice", href: "/dashboard/learning-paths/mcat/practice", icon: ListChecks, match: (p: string) => p.startsWith("/dashboard/learning-paths/mcat/practice") },
  { label: "Review", href: "/dashboard/learning-paths/mcat/review", icon: RotateCcw, match: (p: string) => p.startsWith("/dashboard/learning-paths/mcat/review") }
];

// backHref/backLabel let a page override the default "one level up"
// target—e.g. the subject page is two levels under the Command Center, so
// its own back button needs to point at its parent section page, not skip
// straight to the top. Every page renders exactly one back link total: this
// one. Pages must not add their own separate back link alongside this.
export function McatSubnav({
  backHref = "/dashboard/learning-paths/mcat",
  backLabel = "Back to Dashboard"
}: { backHref?: string; backLabel?: string } = {}) {
  const pathname = usePathname();
  return <div className="border-b border-slate-100 dark:border-white/10 pb-5">
    <Link href={backHref} className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-teal-600">
      <ArrowLeft size={13} />{backLabel}
    </Link>
    <nav className="flex flex-wrap gap-2">
      {tabs.map(tab => {
        const active = tab.match(pathname ?? "");
        return <Link
          key={tab.href}
          href={tab.href}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-extrabold transition ${active ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"}`}
        >
          <tab.icon size={13} />{tab.label}
        </Link>;
      })}
    </nav>
  </div>;
}
