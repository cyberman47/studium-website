// Real, on-page product tour—genuinely distinct from lib/onboarding.ts's
// signup questionnaire (role/goal/study-time answers). That one asks who
// the student is; this one teaches them where things live.
//
// Exactly three tours, each fully self-contained on its own page (no
// navigation mid-tour): Dashboard (the real "welcome to Studium" moment),
// Learning Paths, and Terminology. Every other section's mini-tour that used
// to exist here (lesson, Studium AI, Flashcards, Create, Progress) has been
// removed entirely, per a full rebuild of this system.
//
// Local-only by design, like nearly every other piece of app state in this
// codebase (lib/tutorChat.ts's mode, lib/mcatPath.ts's bookmarks, etc.)—it
// resets per-browser, not per-account.

export type SectionId = "dashboard" | "learning-paths" | "terminology";

function seenKey(id: SectionId) {
  return `studium_tour_seen_${id}`;
}

export function hasSeenSectionTour(id: SectionId): boolean {
  if (typeof window === "undefined") return true; // SSR-safe: never flash the tour before hydration
  return localStorage.getItem(seenKey(id)) === "true";
}

// Skipping counts as seeing it, same as finishing—either way it shouldn't
// interrupt the student again on a later visit to that section.
export function markSectionTourSeen(id: SectionId) {
  if (typeof window === "undefined") return;
  localStorage.setItem(seenKey(id), "true");
}

// Powers "Take the Tour Again" (Account settings + the account dropdown):
// un-marks the dashboard tour specifically, so navigating there afterward
// makes it play again exactly like a genuine first visit would.
export function replayDashboardTour() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(seenKey("dashboard"));
}

export type TourStep = {
  id: string;
  // Full CSS selector to spotlight (e.g. '[data-tour="sidebar-nav"]').
  // null renders a centered modal instead.
  target: string | null;
  title: string;
  // "\n\n" splits into separate paragraphs in the tooltip/modal.
  body: string;
  nextLabel: string;
  exampleChips?: string[];
  isWelcome?: boolean;
  isFinish?: boolean;
  // Fires once when this step's primary button is clicked, before
  // advancing (or, on the last step, before closing). Lets the mounting
  // page attach real page-specific behavior without the tour engine itself
  // needing to know what that behavior is.
  action?: () => void;
};

// ---- Dashboard: the one real "Welcome to Studium" ceremony ----
//
// Five real stops, in this exact order: Daily Case (the daily habit) →
// Learning Paths (personalized studying) → Create (generate your own
// material) → Library (where it all lives) → Leaderboard (the social layer),
// bookended by a short welcome and a finish step. Every target is already
// visible on the Home Dashboard or its sidebar, so no step ever navigates
// away mid-tour.
export const dashboardTourSteps: TourStep[] = [
  {
    id: "welcome",
    target: null,
    title: "Welcome to Studium",
    body: "Studium is a personal learning companion built for the way medical and pre-med students actually study—structured lessons, active recall, and an AI tutor that's part of the workflow, not bolted onto it.\n\nLet's take a quick look around your dashboard.",
    nextLabel: "Let's take a look →",
    isWelcome: true
  },
  {
    id: "daily-case",
    target: '[data-tour="daily-case"]',
    title: "Start with your Daily Case",
    body: "Every day, Studium gives you one real clinical case to work through. It's a small, repeatable habit—show up, analyze the case, and keep your streak alive.",
    nextLabel: "Next →"
  },
  {
    id: "learning-paths",
    target: '[data-tour="nav-learning-paths"]',
    title: "Follow a personalized path",
    body: "Learning Paths organize your subject into structured courses and lessons, so you're always studying the right thing next instead of guessing where to start.",
    nextLabel: "Next →",
    exampleChips: ["MCAT", "Biology", "Cells", "Cell Membrane"]
  },
  {
    id: "create",
    target: '[data-tour="nav-create"]',
    title: "Create your own material",
    body: "Upload your own notes or documents, and Studium turns them into real flashcards, quizzes, lessons, and summaries—study material built from exactly what you're learning.",
    nextLabel: "Next →"
  },
  {
    id: "library",
    target: '[data-tour="nav-library"]',
    title: "Everything lives in your Library",
    body: "Every lesson, flashcard, quiz, and case you touch—generated or built-in—lands here, organized and easy to find again.",
    nextLabel: "Next →"
  },
  {
    id: "leaderboard",
    target: '[data-tour="leaderboard"]',
    title: "See how you stack up",
    body: "Track your rank against other real students, challenge someone to a battle, and turn studying into a little friendly competition.",
    nextLabel: "Next →"
  },
  {
    id: "finish",
    target: null,
    title: "You're ready to start learning.",
    body: "You now know where your daily habit lives, how to follow a path, create your own material, find it again, and see how you compare.",
    nextLabel: "Finish Tour",
    isFinish: true
  }
];

// ---- Learning Paths ----
// A shorter, quieter tour than the Dashboard's—it's the second one a student
// sees, so it skips the welcome/finish ceremony and just spotlights the
// page's real pieces in the order a first-time visitor would naturally look
// at them: what's already in progress, what else is browsable, your real
// stats, and where Terminology fits in.
export const learningPathsTourSteps: TourStep[] = [
  {
    id: "learning-paths-main",
    target: '[data-tour="learning-paths-main"]',
    title: "Your route through what to study next",
    body: "Learning Paths turns everything you need to learn into structured courses and lessons, and always remembers exactly where you left off.",
    nextLabel: "Next →",
    exampleChips: ["MCAT", "Biology", "Lesson", "Concepts"]
  },
  {
    id: "browse-paths",
    target: '[data-tour="browse-paths"]',
    title: "Explore every track",
    body: "Browse all of Studium's learning tracks—MCAT, Nursing, Medical School, and more—and jump into whichever one you're studying.",
    nextLabel: "Next →"
  },
  {
    id: "paths-progress",
    target: '[data-tour="paths-progress"]',
    title: "Track your streak and points",
    body: "Your current streak, Knowledge Points, and level live right here, so you can see your progress at a glance without leaving the page.",
    nextLabel: "Next →"
  },
  {
    id: "paths-terminology-link",
    target: '[data-tour="paths-terminology-link"]',
    title: "Build your vocabulary alongside it",
    body: "Terminology tracks every medical term you've learned as you study. Open it anytime from here—it has its own quick tour the first time you visit.",
    nextLabel: "Got it"
  }
];

// ---- Terminology ----
// Same short, spotlight-only shape as Learning Paths—four real stops through
// the page's own layout, ending on the searchable full list.
export const terminologyTourSteps: TourStep[] = [
  {
    id: "term-overview",
    target: '[data-tour="term-overview"]',
    title: "Your personal vocabulary list",
    body: "Studium tracks every real medical term you've clicked on in a lesson or flashcard—not the whole glossary, just what you've actually encountered. These counts show how well you know each one.",
    nextLabel: "Next →"
  },
  {
    id: "term-actions",
    target: '[data-tour="term-actions"]',
    title: "Review what's due",
    body: "Review Due Terms brings back the words you're at risk of forgetting, right on schedule. Word Builder turns learning terms into a quick game.",
    nextLabel: "Next →"
  },
  {
    id: "term-discovery",
    target: '[data-tour="term-discovery"]',
    title: "Pick up where you left off",
    body: "Quickly jump back into terms you've recently viewed or learned, or focus on the ones marked unfamiliar.",
    nextLabel: "Next →"
  },
  {
    id: "term-list",
    target: '[data-tour="term-list"]',
    title: "Search your full list",
    body: "Every term you've ever touched, searchable and filterable by how well you know it.",
    nextLabel: "Got it"
  }
];
