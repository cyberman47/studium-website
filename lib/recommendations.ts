// Turns real progress signals into one "what should I do next" line per
// topic (lesson), modeled on the same predicate style as the achievement
// rules in lib/progress.ts (`check(ctx): boolean`)—except there's no prior
// recommendation engine anywhere in the app, so this is genuinely new
// logic, not a wrapper around something that already existed.

import { mcatSections, getLessonEntry } from "./mcatPath";
import { getAllLibraryCards, isCardDue, isCardStarted } from "./flashcardLibrary";
import { getWeakConcepts, hasPracticed } from "./practiceHistory";

export type RecommendedAction = "learn" | "flashcards" | "practice" | "weak-areas" | "caught-up";

export type Recommendation = {
  action: RecommendedAction;
  label: string;
  detail: string;
  href: string;
};

export function findLessonLocation(lessonId: string): { sectionId: string; subjectId: string; title: string } | null {
  for (const section of mcatSections) {
    for (const subject of section.subjects) {
      const lesson = subject.lessons.find(l => l.id === lessonId);
      if (lesson) return { sectionId: section.id, subjectId: subject.id, title: lesson.title };
    }
  }
  return null;
}

function lessonHref(lessonId: string): string {
  const loc = findLessonLocation(lessonId);
  return loc ? `/dashboard/learning-paths/mcat/${loc.sectionId}/${loc.subjectId}/${lessonId}` : "#";
}

export function getTopicRecommendation(lessonId: string): Recommendation {
  const href = lessonHref(lessonId);
  const entry = getLessonEntry(lessonId);
  const lessonCardIds = getAllLibraryCards().filter(c => c.lessonId === lessonId).map(c => c.id);
  const anyCardStarted = lessonCardIds.some(isCardStarted);
  const practicedAlready = hasPracticed(lessonId);

  // "Start Learning" only when there's truly no engagement yet—reviewing a
  // few flashcards or attempting practice counts as started, even if the
  // lesson was never formally finished.
  if (!entry && !anyCardStarted && !practicedAlready) {
    return { action: "learn", label: "Start Learning", detail: "You haven't studied this topic yet.", href };
  }

  const dueCount = lessonCardIds.filter(isCardDue).length;
  if (dueCount > 0) {
    return { action: "flashcards", label: `${dueCount} flashcard${dueCount === 1 ? "" : "s"} ready for review`, detail: "Spaced repetition says these are due.", href };
  }

  const weak = getWeakConcepts(lessonId);
  if (weak.length > 0) {
    return { action: "weak-areas", label: `Review: ${weak[0].concept}`, detail: `Missed ${weak[0].missCount} times in practice.`, href };
  }

  if (!hasPracticed(lessonId)) {
    return { action: "practice", label: "Try a few practice questions", detail: "You know the material—time to apply it.", href };
  }

  return { action: "caught-up", label: "You're all caught up here", detail: "Learned, reviewed, and practiced.", href };
}
