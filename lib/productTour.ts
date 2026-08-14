import { findCurrentPathDef, getCurrentPathId } from "./currentPath";
import { findSubject, getLessonStatus } from "./mcatPath";

// Real, on-page product tour—genuinely distinct from lib/onboarding.ts's
// signup questionnaire (role/goal/study-time answers). That one asks who
// the student is; this one teaches them where things live.
//
// Redesigned from a single long cross-page walkthrough into several small,
// self-contained section tours: one on the dashboard (the real "welcome"
// moment), and one quiet mini-tour per major section that plays itself the
// first time a student actually visits that section—never before, never
// again after. Each section tour never navigates away from its own page,
// which is what makes it fast: no route change, no waiting for a new
// page's content to mount, just spotlighting what's already on screen.
//
// Local-only by design, like nearly every other piece of app state in this
// codebase (lib/tutorChat.ts's mode, lib/mcatPath.ts's bookmarks, etc.)—it
// resets per-browser, not per-account. A cross-device version would mean a
// new Supabase migration and column, which this pass doesn't add.

export type SectionId = "dashboard" | "learning-paths" | "lesson" | "studium-ai" | "flashcards" | "create" | "progress";

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

// The six stages of Studium's real study loop, each pointing at the one
// real feature that actually does that job—used only by the dashboard
// tour's "How it all connects" step. Icon is a lookup key (not a component
// reference) so this file stays framework-free; SectionTour.tsx owns the
// actual icon mapping.
export type LoopStage = { stage: string; feature: string; icon: "calendar" | "map" | "layers" | "bookA" | "trendingUp" | "bot" };

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
  // Small grouped-list content (used by the dashboard's "Your study
  // toolkit" step)—explains why the sidebar's real sections exist without
  // touching the sidebar's own actual grouping/labels.
  groups?: { label: string; items: string[] }[];
  isWelcome?: boolean;
  isFinish?: boolean;
  // A visually distinct centered step (the dashboard's "How it all
  // connects" loop diagram)—still target: null like Welcome/Finish, but
  // rendered with the loopStages diagram instead of the plain icon+copy
  // modal layout.
  isLoop?: boolean;
  loopStages?: LoopStage[];
  // Fires once when this step's primary button is clicked, before
  // advancing (or, on the last step, before closing). Lets the mounting
  // page attach real page-specific behavior—e.g. the Studium AI step
  // sending a real preloaded prompt—without the tour engine itself needing
  // to know what that behavior is.
  action?: () => void;
};

// ---- Dashboard: the one real "Welcome to Studium" ceremony ----
//
// Deliberately stays on this one page for all 12 steps—every target below
// is something already visible on the Home Dashboard (the page itself, its
// widgets, or the sidebar), never a different route. That's what makes a
// 3-5 minute, 12-step tour still feel fast: no navigation wait between any
// two steps, just the spotlight moving. Section-specific depth (what a
// lesson looks like, what the AI composer does, etc.) is deliberately left
// to the separate per-section mini-tours below, which only ever play once
// the student actually opens that section themselves.
export const dashboardTourSteps: TourStep[] = [
  {
    id: "welcome",
    target: null,
    title: "Welcome to Studium",
    body: "Studium is a personal learning companion built for the way medical and pre-med students actually study—structured lessons, active recall, and an AI tutor that's part of the workflow, not bolted onto it.\n\nLet's walk through your dashboard so you know exactly what you're working with.",
    nextLabel: "Let's take a look →",
    isWelcome: true
  },
  {
    id: "dashboard-main",
    target: '[data-tour="dashboard-main"]',
    title: "Your study command center",
    body: "This is where Studium brings together what matters most: today's goal, what to continue, your progress, and what's coming up next—all in one place.",
    nextLabel: "Next →"
  },
  {
    id: "today-study",
    target: '[data-tour="today-study"]',
    title: "Know what to do today",
    body: "Studium turns your bigger learning goals into a manageable daily target, so you're not constantly deciding what to study next.\n\nThis is powered by your Study Planner—set an exam date once, and Studium keeps adjusting the plan.",
    nextLabel: "Next →"
  },
  {
    id: "continue-learning",
    target: '[data-tour="continue-learning"]',
    title: "Pick up where you left off",
    body: "Studium remembers exactly where you are in your material, so this card always leads straight to the next useful thing—no digging back through menus to find it.",
    nextLabel: "Next →"
  },
  {
    id: "learning-paths",
    target: '[data-tour="nav-learning-paths"]',
    title: "Follow a structured path",
    body: "Learning Paths organize an entire subject into courses, lessons, and concepts, so you always have a clear route through difficult material instead of studying disconnected topics.",
    nextLabel: "Next →",
    exampleChips: ["MCAT", "Biology", "Cells", "Cell Membrane", "Transport"]
  },
  {
    id: "toolkit",
    target: '[data-tour="sidebar-nav"]',
    title: "Your study toolkit",
    body: "Everything in your sidebar supports one part of studying. Here's how it breaks down.",
    nextLabel: "Next →",
    groups: [
      { label: "Learn", items: ["Learning Paths", "Library"] },
      { label: "Practice", items: ["Flashcards", "Create"] },
      { label: "Understand", items: ["Terminology", "Studium AI"] },
      { label: "Improve", items: ["Study Planner", "Progress"] }
    ]
  },
  {
    id: "terminology",
    target: '[data-tour="nav-terminology"]',
    title: "Build your medical vocabulary",
    body: "Medical terminology piles up fast. Terminology lets you save words as you meet them, learn real definitions, hear pronunciations, and track how well you actually know each one.\n\nTerms highlighted inside a lesson connect straight into this same system.",
    nextLabel: "Next →"
  },
  {
    id: "studium-ai",
    target: '[data-tour="nav-studium-ai"]',
    title: "Your AI study companion",
    body: "When you get stuck, want a simpler explanation, or want to go deeper, Studium AI is right there in the lesson—not a separate chatbot.\n\nTutor — guided explanations. Deep Dive — thorough, step-by-step breakdowns. Simplify — plain-language explanations.",
    nextLabel: "Next →"
  },
  {
    id: "flashcards",
    target: '[data-tour="nav-flashcards"]',
    title: "Turn learning into retention",
    body: "Reading something once isn't the same as remembering it. Flashcards give you active recall—one of the most effective ways to make material stick.\n\nStudium can also generate flashcards straight from material you upload in Create.",
    nextLabel: "Next →"
  },
  {
    id: "progress",
    target: '[data-tour="nav-progress"]',
    title: "See your knowledge grow",
    body: "Progress is more than a completion count. It tracks your mastery by subject, your Knowledge Points, your study streak, and exactly what still needs work—a live picture of what you know.",
    nextLabel: "Next →"
  },
  {
    id: "loop",
    target: null,
    title: "How it all connects",
    body: "You don't need to use every tool every day. Studium just gives you a loop to move through, one piece at a time.",
    nextLabel: "Next →",
    isLoop: true,
    loopStages: [
      { stage: "Plan", feature: "Study Planner", icon: "calendar" },
      { stage: "Learn", feature: "Learning Paths", icon: "map" },
      { stage: "Practice", feature: "Flashcards", icon: "layers" },
      { stage: "Review", feature: "Terminology", icon: "bookA" },
      { stage: "Track", feature: "Progress", icon: "trendingUp" },
      { stage: "Improve", feature: "Studium AI", icon: "bot" }
    ]
  },
  {
    id: "finish",
    target: null,
    title: "You're ready to start learning.",
    body: "You now know how to figure out what to study, learn it, practice it, and see what still needs work.\n\nLet's put it to use.",
    nextLabel: "Start My First Study Session →",
    isFinish: true
  }
];

// ---- Learning Paths ----
export const learningPathsTourSteps: TourStep[] = [
  {
    id: "learning-paths-main",
    target: '[data-tour="learning-paths-main"]',
    title: "Learn step by step",
    body: "Learning Paths organize your material into structured courses and lessons, so you always know what to study next.",
    nextLabel: "Got it",
    exampleChips: ["MCAT", "Biology", "Lesson", "Concepts"]
  }
];

// ---- A lesson (mounted only on the Scientific Method lesson today, the
// one lesson with the full concept-nav + real interactive terminology this
// tour actually points at) ----
export const lessonTourSteps: TourStep[] = [
  {
    id: "lesson-concept-nav",
    target: '[data-tour="lesson-concept-nav"]',
    title: "Study the material",
    body: "Lessons break difficult subjects into focused concepts. Read, listen, interact with examples, and check your understanding with Quick Checks as you go.",
    nextLabel: "Next →"
  },
  {
    id: "lesson-term",
    target: '[data-tour-term="hypothesis"]',
    title: "Build your vocabulary",
    body: 'Tap highlighted terms to see definitions, hear pronunciations, save them, and track how well you know them. Try tapping "hypothesis" below.',
    nextLabel: "Got it"
  }
];

// ---- Studium AI ----
export const studiumAiTourSteps: TourStep[] = [
  {
    id: "ai-composer",
    target: '[data-tour="ai-composer"]',
    title: "Meet Studium AI",
    body: "Your AI study companion can teach you concepts, simplify difficult material, or go deep on a topic.\n\nTutor — guided explanations. Deep Dive — thorough, step-by-step breakdowns. Simplify — plain-language explanations.",
    nextLabel: "Try it →"
    // action (sends a real preloaded prompt) is attached where this is
    // mounted, in app/dashboard/(main)/ai-tutor/page.tsx—it needs access to
    // AiTutorWorkspace's own send function, which this content-only file
    // doesn't have.
  }
];

// ---- Flashcards ----
export const flashcardsTourSteps: TourStep[] = [
  {
    id: "flashcards-main",
    target: '[data-tour="flashcards-main"]',
    title: "Turn knowledge into memory",
    body: "Review your saved and generated flashcards to strengthen what you've learned.",
    nextLabel: "Got it"
  }
];

// ---- Create ----
export const createTourSteps: TourStep[] = [
  {
    id: "create-main",
    target: '[data-tour="create-main"]',
    title: "Create your own study material",
    body: "Upload your notes or files and Studium can turn them into quizzes, flashcards, and other study resources.",
    nextLabel: "Got it"
  }
];

// ---- Progress ----
export const progressTourSteps: TourStep[] = [
  {
    id: "progress-main",
    target: '[data-tour="progress-main"]',
    title: "See your progress",
    body: "Studium tracks your learning so you can see what you've mastered, what needs review, and how you're progressing over time.",
    nextLabel: "Got it"
  }
];

// Dashboard finish step's "Start Learning →"—mirrors the same real
// recommendation logic the dashboard's own "Continue Studying" card already
// uses (current path → next not-yet-completed Biology lesson, same
// fallback chain), so the tour doesn't invent a separate notion of
// "recommended" from scratch.
export function getRecommendedLearningHref(): string {
  const pathId = getCurrentPathId();
  if (pathId === "mcat") {
    const biology = findSubject("bio-biochem", "biology");
    if (biology) {
      const ids = biology.lessons.map(l => l.id);
      const next = biology.lessons.find(l => getLessonStatus(ids, l.id) !== "locked" && getLessonStatus(ids, l.id) !== "completed");
      if (next) return `/dashboard/learning-paths/mcat/bio-biochem/biology/${next.id}`;
    }
  }
  return findCurrentPathDef(pathId)?.href ?? "/dashboard/learning-paths";
}
