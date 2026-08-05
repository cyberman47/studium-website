// ---- Today's Study Plan (Home dashboard) ----
// Dynamically assembles a short daily task list from real user state: the
// selected Learning Path's next real lesson, the existing Study Plan goals
// (flashcards/quizzes—see progress.ts), and real Terminology SRS due counts.
// There's no AI backend generating this—it's a rules-based planner over
// genuinely tracked data, same honesty stance as the rest of the app.

import { CurrentPathId, findCurrentPathDef } from "./currentPath";
import { findSubject, getLessonStatus, lessonContentMap } from "./mcatPath";
import { getStudyPlanProgress, StudyPlanProgress } from "./progress";
import { getTerminologyStats } from "./terminology";

export type StudyPlanTaskId = "lesson" | "flashcards" | "terminology" | "quiz";

export type StudyPlanTask = {
  id: StudyPlanTaskId;
  emoji: string;
  title: string;
  detail: string;
  minutes: number;
  done: boolean;
  // A real page to open, or null when the task is logged in place (flashcards/
  // quizzes aren't fully built yet, so those use the same simulated "+X" log
  // mechanic the old Study Plan page used).
  href: string | null;
};

export type TodaysStudyPlan = {
  tasks: StudyPlanTask[];
  completedCount: number;
  totalCount: number;
  percent: number;
  allComplete: boolean;
};

function getLessonTask(pathId: CurrentPathId | null, progress: StudyPlanProgress): StudyPlanTask {
  if (pathId === "mcat") {
    const biology = findSubject("bio-biochem", "biology");
    if (biology) {
      const ids = biology.lessons.map(l => l.id);
      const next = biology.lessons.find(l => getLessonStatus(ids, l.id) !== "locked" && getLessonStatus(ids, l.id) !== "completed");
      if (next) {
        const minutes = lessonContentMap[next.id]?.estimatedMinutes ?? 20;
        return { id: "lesson", emoji: "🧬", title: next.title, detail: "Continue Lesson", minutes, done: progress.minutesComplete, href: `/dashboard/learning-paths/mcat/bio-biochem/biology/${next.id}` };
      }
      return { id: "lesson", emoji: "🧬", title: "Biology Fundamentals", detail: "All lessons complete—review anytime", minutes: 15, done: true, href: `/dashboard/learning-paths/mcat/bio-biochem/biology` };
    }
  }
  const def = findCurrentPathDef(pathId);
  return {
    id: "lesson",
    emoji: pathId === "medical-school" ? "🫀" : "🗺️",
    title: def ? `Continue ${def.label}` : "Choose Your Learning Path",
    detail: def ? "Explore your path" : "Pick a path from the header",
    minutes: 20,
    done: progress.minutesComplete,
    href: def ? def.href : "/dashboard/learning-paths"
  };
}

export function getTodaysStudyPlan(pathId: CurrentPathId | null): TodaysStudyPlan {
  const progress = getStudyPlanProgress();
  const term = getTerminologyStats();

  const lessonTask = getLessonTask(pathId, progress);

  const flashcardsRemaining = Math.max(0, progress.goals.flashcards - progress.flashcards);
  const flashcardsTask: StudyPlanTask = {
    id: "flashcards",
    emoji: "🧠",
    title: "Flashcard Review",
    detail: progress.flashcardsComplete ? "Goal complete" : `${flashcardsRemaining} cards due`,
    minutes: 15,
    done: progress.flashcardsComplete,
    href: null
  };

  const termsGoalMet = term.todayCount >= term.dailyGoal;
  const termsRemaining = term.dueForReview > 0 ? term.dueForReview : Math.max(0, term.dailyGoal - term.todayCount);
  const terminologyTask: StudyPlanTask = {
    id: "terminology",
    emoji: "🔤",
    title: "Terminology Review",
    detail: termsGoalMet ? "Goal complete" : `${termsRemaining} term${termsRemaining === 1 ? "" : "s"}${term.dueForReview > 0 ? " due" : " to learn"}`,
    minutes: 5,
    done: termsGoalMet,
    href: term.dueForReview > 0 ? "/dashboard/terminology/review" : "/dashboard/terminology"
  };

  const quizTask: StudyPlanTask = {
    id: "quiz",
    emoji: "❓",
    title: "Practice Quiz",
    detail: progress.quizzesComplete ? "Goal complete" : `${progress.goals.quizzes} quiz${progress.goals.quizzes === 1 ? "" : "zes"} available`,
    minutes: 15,
    done: progress.quizzesComplete,
    href: null
  };

  const tasks = [lessonTask, flashcardsTask, terminologyTask, quizTask];
  const completedCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;
  return { tasks, completedCount, totalCount, percent: Math.round((completedCount / totalCount) * 100), allComplete: completedCount === totalCount };
}
