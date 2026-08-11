"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookA, Bot, CalendarCheck, Home, Layers, Library, ListChecks, Map, MessagesSquare, PenLine, TrendingUp } from "lucide-react";
import { FEATURE_FLAGS_EVENT, isFlagEnabled } from "@/lib/featureFlags";

type NavItem = { label: string; href: string; icon: typeof Home; flag?: "ai_tutor_nav" };
type NavGroup = { label: string | null; items: NavItem[] };

// Grouped by what a student is doing, not alphabetically: Study (plan and
// consume material) → Review (reinforce what you've already learned) →
// Tools (make new material)—with Home standing alone above and
// Progress/Community standing alone below, same ungrouped-header/footer
// pattern as the Settings sidebar (app/dashboard/settings/layout.tsx).
const navGroups: NavGroup[] = [
  { label: null, items: [
    { label: "Home", href: "/dashboard", icon: Home }
  ] },
  { label: "Study", items: [
    { label: "Learning Paths", href: "/dashboard/learning-paths", icon: Map },
    { label: "Study Planner", href: "/dashboard/study-plan", icon: CalendarCheck },
    { label: "Library", href: "/dashboard/library", icon: Library }
  ] },
  { label: "Review", items: [
    { label: "Flashcards", href: "/dashboard/flashcards", icon: Layers },
    { label: "Quizzes", href: "/dashboard/quizzes", icon: ListChecks },
    { label: "Terminology", href: "/dashboard/terminology", icon: BookA }
  ] },
  { label: "Tools", items: [
    { label: "Create", href: "/dashboard/create", icon: PenLine },
    { label: "Studium AI", href: "/dashboard/ai-tutor", icon: Bot, flag: "ai_tutor_nav" }
  ] },
  { label: null, items: [
    { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    { label: "Community", href: "/forum", icon: MessagesSquare }
  ] }
];

// Exact-match only for Home (every other route also starts with "/dashboard"
// so a naive prefix check would keep it highlighted everywhere); every other
// item highlights on its own nested routes too—e.g. Learning Paths stays lit
// while browsing deep into /dashboard/learning-paths/mcat/bio-biochem/biology,
// not just on the exact top-level page. This was the "sometimes doesn't
// highlight" bug: the old check was pathname === item.href, which only ever
// matched a nav item's own exact URL.
function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Real feature-flag gate, not decorative: admin's Feature Management tab
  // writes to the same localStorage key isFlagEnabled() reads, so toggling
  // it there genuinely hides/shows this nav item on next render.
  const [aiTutorNavEnabled, setAiTutorNavEnabled] = useState(true);

  useEffect(() => {
    function refresh() { setAiTutorNavEnabled(isFlagEnabled("ai_tutor_nav")); }
    refresh();
    window.addEventListener(FEATURE_FLAGS_EVENT, refresh);
    return () => window.removeEventListener(FEATURE_FLAGS_EVENT, refresh);
  }, []);

  const visibleGroups = navGroups
    .map(group => ({ ...group, items: group.items.filter(item => item.flag !== "ai_tutor_nav" || aiTutorNavEnabled) }))
    .filter(group => group.items.length > 0);

  return <div className="dashboard-shell flex items-start gap-8">
    <aside className="hidden w-56 shrink-0 py-6 sm:block">
      <nav className="sticky top-24 space-y-1 rounded-3xl border border-slate-200 bg-slate-50 p-3">
        {visibleGroups.map((group, i) => <div key={group.label ?? `ungrouped-${i}`} className={i > 0 ? "pt-3" : ""}>
          {group.label && <p className="px-3 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">{group.label}</p>}
          <div className="space-y-1">
            {group.items.map(item => {
              const active = isNavItemActive(pathname ?? "", item.href);
              return <Link key={item.href} href={item.href} className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-white hover:text-ink"}`}>
                <item.icon size={18} className={active ? "text-teal-600" : "text-slate-400"} />{item.label}
              </Link>;
            })}
          </div>
        </div>)}
      </nav>
    </aside>
    <div className="min-w-0 flex-1">{children}</div>
  </div>;
}
