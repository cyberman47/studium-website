// Durable log of practice-question attempts, keyed by lesson and concept.
// The lesson Practice step already grades questions in-session (see the
// lesson page's `selectOption`/review step)—this persists that signal so it
// survives a reload and can power "Weak Areas" and the recommendation
// engine (lib/recommendations.ts), instead of only living in local state
// for the current visit.

export type PracticeAttempt = {
  lessonId: string;
  concept: string;
  correct: boolean;
  attemptedAt: string;
  // Optional so every existing call site keeps compiling unchanged—only
  // callers that know the real stable question id (lessonId:index) pass
  // one, which is what lets "unused questions" be computed precisely
  // instead of guessed at the concept level.
  questionId?: string;
};

const KEY = "studium_practice_history";
export const PRACTICE_HISTORY_EVENT = "studium:practiceHistoryChange";

function read(): PracticeAttempt[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

function write(list: PracticeAttempt[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(PRACTICE_HISTORY_EVENT));
}

export function logAttempt(lessonId: string, concept: string, correct: boolean, questionId?: string) {
  write([...read(), { lessonId, concept, correct, attemptedAt: new Date().toISOString(), questionId }]);
}

export function getAttemptsForLesson(lessonId: string): PracticeAttempt[] {
  return read().filter(a => a.lessonId === lessonId);
}

export function hasPracticed(lessonId: string): boolean {
  return read().some(a => a.lessonId === lessonId);
}

// Only attempts that carried a real question id count—older attempts (or
// ones logged without one) simply aren't part of this precise picture,
// rather than guessed at.
export function getAttemptedQuestionIds(): Set<string> {
  return new Set(read().map(a => a.questionId).filter((id): id is string => !!id));
}

// Mistake Vault: real questions whose most recent attempt was wrong—reflects
// what you'd get wrong if you retried today, not every historical miss (a
// question you eventually got right shouldn't linger here forever). Only
// attempts carrying a real question id are eligible, same precision rule as
// getAttemptedQuestionIds.
export function getMissedQuestionIds(): string[] {
  const attempts = read().filter((a): a is PracticeAttempt & { questionId: string } => !!a.questionId);
  const latestById = new Map<string, PracticeAttempt>();
  for (const a of attempts) {
    const existing = latestById.get(a.questionId!);
    if (!existing || new Date(a.attemptedAt) >= new Date(existing.attemptedAt)) latestById.set(a.questionId!, a);
  }
  return Array.from(latestById.values()).filter(a => !a.correct).map(a => a.questionId!);
}

export type OverallAccuracy = { correct: number; total: number; percent: number };

// Real accuracy across every practice attempt ever logged, regardless of
// lesson—used by the MCAT Dashboard's Readiness calculation instead of a
// second, separate tracking mechanism.
export function getOverallAccuracy(): OverallAccuracy {
  const attempts = read();
  const correct = attempts.filter(a => a.correct).length;
  const total = attempts.length;
  return { correct, total, percent: total > 0 ? Math.round((correct / total) * 100) : 0 };
}

export type WeakConcept = { concept: string; lessonId: string; missCount: number; attemptCount: number; lastAttempt: string };

// A concept counts as "weak" once it's been missed at least twice and misses
// outnumber (or match) correct attempts—repeated trouble, not one slip.
export function getWeakConcepts(lessonId?: string): WeakConcept[] {
  const attempts = lessonId ? read().filter(a => a.lessonId === lessonId) : read();
  const byConcept = new Map<string, PracticeAttempt[]>();
  for (const a of attempts) {
    const key = `${a.lessonId}::${a.concept}`;
    byConcept.set(key, [...(byConcept.get(key) ?? []), a]);
  }
  const weak: WeakConcept[] = [];
  for (const [key, list] of Array.from(byConcept)) {
    const misses = list.filter((a: PracticeAttempt) => !a.correct).length;
    const hits = list.length - misses;
    if (misses >= 2 && misses >= hits) {
      const [lid, concept] = key.split("::");
      const last = list.reduce((a: PracticeAttempt, b: PracticeAttempt) => new Date(a.attemptedAt) > new Date(b.attemptedAt) ? a : b);
      weak.push({ concept, lessonId: lid, missCount: misses, attemptCount: list.length, lastAttempt: last.attemptedAt });
    }
  }
  return weak.sort((a, b) => b.missCount - a.missCount);
}

// ---- Saved (bookmarked) practice questions ----
// Real, persisted, and independent of any one study session—mirrors the
// existing flashcard bookmark pattern (toggleBookmarkedCard in
// lib/mcatPath.ts), just for practice questions instead. Questions don't
// carry a stable id in their own content shape, so callers pass one in
// (lessonId:index, matching how lesson flashcards get unified ids in
// lib/flashcardLibrary.ts).

const SAVED_QUESTIONS_KEY = "studium_saved_practice_questions";
export const SAVED_QUESTIONS_EVENT = "studium:savedPracticeQuestionsChange";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SAVED_QUESTIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeSaved(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVED_QUESTIONS_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(SAVED_QUESTIONS_EVENT));
}

export function getSavedQuestionIds(): string[] {
  return readSaved();
}

export function isQuestionSaved(id: string): boolean {
  return readSaved().includes(id);
}

// Returns the new saved state, so callers can update UI without a second read.
export function toggleSavedQuestion(id: string): boolean {
  const current = readSaved();
  const isSaved = current.includes(id);
  writeSaved(isSaved ? current.filter(x => x !== id) : [...current, id]);
  return !isSaved;
}
