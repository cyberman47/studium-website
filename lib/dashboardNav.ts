// Single source of truth for the dashboard's primary navigation—shared by
// the desktop sidebar (app/dashboard/(main)/layout.tsx) and the mobile nav
// drawer (components/dashboard-shell.tsx's MobileNav), so the two surfaces
// can never drift out of sync with each other.
import { BookA, Bot, CalendarCheck, Home, IdCard, Layers, Library, ListChecks, Map, PenLine, TrendingUp, Users } from "lucide-react";

export type NavItem = { label: string; href: string; icon: typeof Home; flag?: "ai_tutor_nav"; tourId?: string };
export type NavGroup = { label: string | null; items: NavItem[] };

// Grouped by what a student is doing, not alphabetically: Study (plan and
// consume material) → Review (reinforce what you've already learned) →
// Tools (make new material)—with Home standing alone above and
// Progress/Passport/Community standing alone below, same
// ungrouped-header/footer pattern as the Settings sidebar
// (app/dashboard/settings/layout.tsx). Community now points at the real
// Community section (app/dashboard/(main)/community—Feed/Discussions/Ask,
// built on supabase/migrations/0004_community.sql), which is what
// "the Studium Community" means given the full social-learning-layer spec.
// The Community Library (lib/communityLessons.ts—students publishing/
// discovering each other's lessons) is a smaller, different feature and
// stays reachable from within Library instead of the top-level sidebar.
// Forum (discussion posts, /forum) lives in the profile dropdown
// (components/dashboard-shell.tsx).
export const navGroups: NavGroup[] = [
  { label: null, items: [
    { label: "Home", href: "/dashboard", icon: Home }
  ] },
  { label: "Study", items: [
    { label: "Learning Paths", href: "/dashboard/learning-paths", icon: Map, tourId: "nav-learning-paths" },
    { label: "Study Planner", href: "/dashboard/study-plan", icon: CalendarCheck },
    { label: "Library", href: "/dashboard/library", icon: Library }
  ] },
  { label: "Review", items: [
    { label: "Flashcards", href: "/dashboard/flashcards", icon: Layers, tourId: "nav-flashcards" },
    { label: "Quizzes", href: "/dashboard/quizzes", icon: ListChecks },
    { label: "Terminology", href: "/dashboard/terminology", icon: BookA, tourId: "nav-terminology" }
  ] },
  { label: "Tools", items: [
    { label: "Create", href: "/dashboard/create", icon: PenLine },
    { label: "Studium AI", href: "/dashboard/ai-tutor", icon: Bot, flag: "ai_tutor_nav", tourId: "nav-studium-ai" }
  ] },
  { label: null, items: [
    { label: "Progress", href: "/dashboard/progress", icon: TrendingUp, tourId: "nav-progress" },
    { label: "Passport", href: "/dashboard/passport", icon: IdCard },
    { label: "Community", href: "/dashboard/community", icon: Users }
  ] }
];

// Exact-match only for Home (every other route also starts with "/dashboard"
// so a naive prefix check would keep it highlighted everywhere); every other
// item highlights on its own nested routes too—e.g. Learning Paths stays lit
// while browsing deep into /dashboard/learning-paths/mcat/bio-biochem/biology,
// not just on the exact top-level page.
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
