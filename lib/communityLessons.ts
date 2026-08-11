// Real student-published study guides ("High-Yield Genetics Review"-style
// content), genuinely persisted and genuinely creator-attributed to whoever
// is signed in on this browser (lib/onboarding.ts's User)—not seeded, not
// simulated. Since Studium has no backend, there is no way to show content
// really authored by OTHER people; this store stays honestly empty until a
// real user actually publishes something, same as lib/forum.ts's posts (zero
// seeding, documented in its own file header) and the Library page's
// pre-existing "nothing fake lives here" Community panel. `saveCount` is a
// real integer driven only by real addToLibrary calls in THIS browser—never
// a fabricated "1.2k students" figure.
//
// Community lessons are one level lighter than a full lib/mcatPath.ts
// LessonContent: a titled table-of-contents of concepts a student can check
// off while studying, not a full sections/quiz/flashcard body. That's a
// deliberate, honest scope match to what a "study guide" a student writes in
// an afternoon actually looks like—see PUBLISH_CONCEPTS_MAX below for the
// practical ceiling this implies.

import { getUser } from "./onboarding";
import { addToLibrary, isInLibrary, removeFromLibrary } from "./myLibrary";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type CommunityLesson = {
  id: string;
  title: string;
  description: string;
  pathName: string;     // e.g. "MCAT"—the exam/path this belongs to
  subject: string;       // e.g. "Biology"
  difficulty: Difficulty;
  estimatedMinutes: number;
  concepts: string[];    // table-of-contents style list the student wrote
  creatorUsername: string;
  creatorName: string;
  createdAt: string;
  saveCount: number;
};

const KEY = "studium_community_lessons";
export const COMMUNITY_LESSONS_EVENT = "studium:communityLessonsChange";

export const PUBLISH_CONCEPTS_MAX = 30;

function readAll(): CommunityLesson[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeAll(list: CommunityLesson[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(COMMUNITY_LESSONS_EVENT));
}

export function getCommunityLessons(): CommunityLesson[] {
  return readAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getCommunityLesson(id: string): CommunityLesson | undefined {
  return readAll().find(l => l.id === id);
}

export function getMyCommunityLessons(): CommunityLesson[] {
  const me = getUser()?.username;
  if (!me) return [];
  return getCommunityLessons().filter(l => l.creatorUsername === me);
}

export type PublishLessonInput = {
  title: string; description: string; pathName: string; subject: string;
  difficulty: Difficulty; estimatedMinutes: number; concepts: string[];
};

// Returns null if nobody's signed in—there's no real identity to credit as
// creator, and crediting "Anonymous" for real published content would be
// worse than just refusing to publish.
export function publishCommunityLesson(input: PublishLessonInput): CommunityLesson | null {
  const user = getUser();
  if (!user) return null;
  const lesson: CommunityLesson = {
    id: `cl-${Date.now()}`,
    title: input.title.trim(),
    description: input.description.trim(),
    pathName: input.pathName,
    subject: input.subject,
    difficulty: input.difficulty,
    estimatedMinutes: input.estimatedMinutes,
    concepts: input.concepts.map(c => c.trim()).filter(Boolean).slice(0, PUBLISH_CONCEPTS_MAX),
    creatorUsername: user.username,
    creatorName: user.name || user.username,
    createdAt: new Date().toISOString(),
    saveCount: 0
  };
  writeAll([...readAll(), lesson]);
  return lesson;
}

// Only the creator may delete their own lesson—enforced here, not just in
// the UI, since this function is the one real write path.
export function deleteCommunityLesson(id: string): boolean {
  const user = getUser();
  const lesson = getCommunityLesson(id);
  if (!user || !lesson || lesson.creatorUsername !== user.username) return false;
  writeAll(readAll().filter(l => l.id !== id));
  removeFromLibrary("community-lesson", id);
  return true;
}

// ---- Add/remove to My Library, keeping saveCount honestly in sync ----

export function addCommunityLessonToLibrary(id: string) {
  if (isInLibrary("community-lesson", id)) return;
  addToLibrary("community-lesson", id);
  const list = readAll();
  const lesson = list.find(l => l.id === id);
  if (lesson) { lesson.saveCount += 1; writeAll(list); }
}

export function removeCommunityLessonFromLibrary(id: string) {
  if (!isInLibrary("community-lesson", id)) return;
  removeFromLibrary("community-lesson", id);
  const list = readAll();
  const lesson = list.find(l => l.id === id);
  if (lesson) { lesson.saveCount = Math.max(0, lesson.saveCount - 1); writeAll(list); }
}

// ---- Real per-student progress on a community lesson (concept checklist) ----
// Tracked separately from the shared lesson content itself—your checkmarks
// never touch the original lib/communityLessons.ts record, so two students
// with the same lesson saved each see only their own progress.

export type CommunityLessonProgress = { checkedConcepts: number[]; startedAt: string; lastStudied: string };

const PROGRESS_KEY = "studium_community_lesson_progress";
export const COMMUNITY_LESSON_PROGRESS_EVENT = "studium:communityLessonProgressChange";

function readProgressMap(): Record<string, CommunityLessonProgress> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeProgressMap(map: Record<string, CommunityLessonProgress>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(COMMUNITY_LESSON_PROGRESS_EVENT));
}

export function getCommunityLessonProgress(id: string): CommunityLessonProgress | null {
  return readProgressMap()[id] ?? null;
}

export function toggleCommunityConcept(lessonId: string, conceptIndex: number) {
  const map = readProgressMap();
  const now = new Date().toISOString();
  const existing = map[lessonId] ?? { checkedConcepts: [], startedAt: now, lastStudied: now };
  const checked = new Set(existing.checkedConcepts);
  if (checked.has(conceptIndex)) checked.delete(conceptIndex); else checked.add(conceptIndex);
  map[lessonId] = { checkedConcepts: Array.from(checked).sort((a, b) => a - b), startedAt: existing.startedAt, lastStudied: now };
  writeProgressMap(map);
}

export function getCommunityLessonPercent(id: string, totalConcepts: number): number {
  if (totalConcepts === 0) return 0;
  const progress = getCommunityLessonProgress(id);
  if (!progress) return 0;
  return Math.round((progress.checkedConcepts.length / totalConcepts) * 100);
}

// ---- Discovery ----

export function getTrendingCommunityLessons(limit = 6): CommunityLesson[] {
  return getCommunityLessons().slice().sort((a, b) => b.saveCount - a.saveCount).slice(0, limit);
}

export function getRecentCommunityLessons(limit = 6): CommunityLesson[] {
  return getCommunityLessons().slice(0, limit); // already sorted newest-first
}

// Honest "Recommended for You": real overlap with subjects the student has
// actually saved before, falling back to newest when there's no signal yet—
// not a simulated recommendation engine.
export function getRecommendedCommunityLessons(limit = 6): CommunityLesson[] {
  const all = getCommunityLessons();
  const savedSubjects = new Set(
    Array.from(new Set(all.map(l => l.subject))).filter(subject =>
      all.some(l => l.subject === subject && isInLibrary("community-lesson", l.id))
    )
  );
  if (savedSubjects.size === 0) return all.slice(0, limit);
  const matching = all.filter(l => savedSubjects.has(l.subject) && !isInLibrary("community-lesson", l.id));
  return (matching.length > 0 ? matching : all).slice(0, limit);
}
