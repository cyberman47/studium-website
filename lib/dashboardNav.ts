// Single source of truth for the dashboard's primary navigation—shared by
// the desktop sidebar (app/dashboard/(main)/layout.tsx) and the mobile nav
// drawer (components/dashboard-shell.tsx's MobileNav), so the two surfaces
// can never drift out of sync with each other.
import {
  BookA, Bot, CalendarCheck, Home, Layers, Library, ListChecks, Map, MessagesSquare, PenLine, Sparkles, Swords, TrendingUp, User, Users, UsersRound
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: typeof Home; flag?: "ai_tutor_nav"; tourId?: string; children?: NavItem[] };
export type NavGroup = { label: string | null; items: NavItem[] };

// Grouped by what a student is doing, not alphabetically: Study (plan and
// consume material) → Review (reinforce what you've already learned) →
// Tools (make new material)—with Home standing alone above and
// Progress/Community standing alone below, same
// ungrouped-header/footer pattern as the Settings sidebar
// (app/dashboard/settings/layout.tsx). Community is a real collapsible
// section (see NavItem.children below), not a single link—its five
// children live under app/dashboard/(main)/community/*, all real and
// Supabase-backed: My Profile (identity/progress), Forum (the former
// Feed/Discussions/Ask, now at .../community/forum), Challenges, Study
// Groups, and Contribute (a hub into the existing Create system + Library's
// community-publish flow, not a duplicate creation flow). The Community
// Library (lib/communityLessons.ts—students publishing/discovering each
// other's lessons) is a smaller, different feature and stays reachable from
// within Library. The older local-only feedback/bug-report Forum (/forum)
// is a different, smaller feature and still lives in the profile dropdown
// (components/dashboard-shell.tsx)—not the same thing as Community's Forum.
export const navGroups: NavGroup[] = [
  { label: null, items: [
    { label: "Home", href: "/dashboard", icon: Home }
  ] },
  { label: "Study", items: [
    { label: "Learning Paths", href: "/dashboard/learning-paths", icon: Map, tourId: "nav-learning-paths" },
    { label: "Study Planner", href: "/dashboard/study-plan", icon: CalendarCheck },
    { label: "Library", href: "/dashboard/library", icon: Library, tourId: "nav-library" }
  ] },
  { label: "Review", items: [
    { label: "Flashcards", href: "/dashboard/flashcards", icon: Layers },
    { label: "Quizzes", href: "/dashboard/quizzes", icon: ListChecks },
    { label: "My Terminology", href: "/dashboard/terminology", icon: BookA }
  ] },
  { label: "Tools", items: [
    { label: "Create", href: "/dashboard/create", icon: PenLine, tourId: "nav-create" },
    { label: "Studium AI", href: "/dashboard/ai-tutor", icon: Bot, flag: "ai_tutor_nav" }
  ] },
  { label: null, items: [
    { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    // Passport was removed from here—its content already lives on My
    // Profile below (a real Supabase-backed page), so this was a second,
    // redundant entry point to the same thing rather than distinct content.
    { label: "Community", href: "/dashboard/community", icon: Users, children: [
      { label: "My Profile", href: "/dashboard/community/profile", icon: User },
      { label: "Forum", href: "/dashboard/community/forum", icon: MessagesSquare },
      { label: "Challenges", href: "/dashboard/community/challenges", icon: Swords },
      { label: "Study Groups", href: "/dashboard/community/study-groups", icon: UsersRound },
      { label: "Contribute", href: "/dashboard/community/contribute", icon: Sparkles }
    ] }
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

// True when `item` is the parent of (or is itself) the active route—used to
// auto-expand a collapsible nav section (Community) on load/refresh so
// "browser refresh preserves the correct route/page" holds for the sidebar
// too, not just the page content.
export function hasActiveChild(pathname: string, item: NavItem): boolean {
  if (!item.children) return false;
  return item.children.some(child => isNavItemActive(pathname, child.href));
}
