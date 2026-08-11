// Lesson Builder: real, localStorage-backed custom courses composed of
// references to content that already genuinely exists in the app (term
// categories and clinical cases—both real, live data, not placeholders).
// A course/lesson built here is a real object a student could browse if a
// dedicated viewer route existed; that viewer isn't built yet (a full
// custom-course *player* is a separate, large feature), so today this is
// honestly the authoring half only—verified real by round-tripping through
// localStorage and resolving each block's referenced content live.

import { getAllCases } from "./clinicalCases";
import { termCategories } from "./terminology";

export type LessonBlockType = "vocabulary" | "case" | "note";

export type LessonBlock = {
  id: string;
  type: LessonBlockType;
  refId: string; // categoryId for "vocabulary", case id for "case", free text for "note"
  label: string; // resolved display label, cached at add-time
};

export type CustomLesson = {
  id: string;
  title: string;
  blocks: LessonBlock[];
};

export type CustomCourse = {
  id: string;
  title: string;
  description: string;
  specialty: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: CustomLesson[];
  createdAt: string;
};

const COURSES_KEY = "studium_custom_courses";
export const CUSTOM_COURSES_EVENT = "studium:customCoursesChange";

function readCourses(): CustomCourse[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(COURSES_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeCourses(list: CustomCourse[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COURSES_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(CUSTOM_COURSES_EVENT));
}

export function getCourses(): CustomCourse[] {
  return readCourses();
}

function slugifyId(text: string): string {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

function uniqueId(base: string, taken: string[]): string {
  let id = base || "item";
  let n = 1;
  while (taken.includes(id)) id = `${base}-${++n}`;
  return id;
}

export function addCourse(input: { title: string; description: string; specialty: string; difficulty: CustomCourse["difficulty"] }): { ok: true; course: CustomCourse } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.title.trim()) return { ok: false, error: "Title is required." };
  const existing = readCourses();
  const id = uniqueId(slugifyId(input.title), existing.map(c => c.id));
  const course: CustomCourse = { ...input, id, lessons: [], createdAt: new Date().toISOString() };
  writeCourses([...existing, course]);
  return { ok: true, course };
}

export function removeCourse(courseId: string) {
  writeCourses(readCourses().filter(c => c.id !== courseId));
}

export function addLesson(courseId: string, title: string): { ok: true } | { ok: false; error: string } {
  if (!title.trim()) return { ok: false, error: "Lesson title is required." };
  const courses = readCourses();
  const idx = courses.findIndex(c => c.id === courseId);
  if (idx === -1) return { ok: false, error: "Course not found." };
  const lessonId = uniqueId(slugifyId(title), courses[idx].lessons.map(l => l.id));
  const next = [...courses];
  next[idx] = { ...next[idx], lessons: [...next[idx].lessons, { id: lessonId, title, blocks: [] }] };
  writeCourses(next);
  return { ok: true };
}

export function removeLesson(courseId: string, lessonId: string) {
  const courses = readCourses();
  const idx = courses.findIndex(c => c.id === courseId);
  if (idx === -1) return;
  const next = [...courses];
  next[idx] = { ...next[idx], lessons: next[idx].lessons.filter(l => l.id !== lessonId) };
  writeCourses(next);
}

export function reorderLessons(courseId: string, orderedLessonIds: string[]) {
  const courses = readCourses();
  const idx = courses.findIndex(c => c.id === courseId);
  if (idx === -1) return;
  const byId = new Map(courses[idx].lessons.map(l => [l.id, l]));
  const reordered = orderedLessonIds.map(id => byId.get(id)).filter((l): l is CustomLesson => !!l);
  const next = [...courses];
  next[idx] = { ...next[idx], lessons: reordered };
  writeCourses(next);
}

export function addBlock(courseId: string, lessonId: string, type: LessonBlockType, refId: string): { ok: true } | { ok: false; error: string } {
  const courses = readCourses();
  const cIdx = courses.findIndex(c => c.id === courseId);
  if (cIdx === -1) return { ok: false, error: "Course not found." };
  const lIdx = courses[cIdx].lessons.findIndex(l => l.id === lessonId);
  if (lIdx === -1) return { ok: false, error: "Lesson not found." };

  let label = refId;
  if (type === "vocabulary") label = termCategories.find(c => c.id === refId)?.name ?? refId;
  else if (type === "case") label = getAllCases().find(c => c.id === refId)?.title ?? refId;
  if (type !== "note" && !label) return { ok: false, error: "Couldn't resolve that reference." };

  const blockId = `${type}-${refId}-${Date.now()}`;
  const next = [...courses];
  const lessons = [...next[cIdx].lessons];
  lessons[lIdx] = { ...lessons[lIdx], blocks: [...lessons[lIdx].blocks, { id: blockId, type, refId, label }] };
  next[cIdx] = { ...next[cIdx], lessons };
  writeCourses(next);
  return { ok: true };
}

export function removeBlock(courseId: string, lessonId: string, blockId: string) {
  const courses = readCourses();
  const cIdx = courses.findIndex(c => c.id === courseId);
  if (cIdx === -1) return;
  const lIdx = courses[cIdx].lessons.findIndex(l => l.id === lessonId);
  if (lIdx === -1) return;
  const next = [...courses];
  const lessons = [...next[cIdx].lessons];
  lessons[lIdx] = { ...lessons[lIdx], blocks: lessons[lIdx].blocks.filter(b => b.id !== blockId) };
  next[cIdx] = { ...next[cIdx], lessons };
  writeCourses(next);
}

export function reorderBlocks(courseId: string, lessonId: string, orderedBlockIds: string[]) {
  const courses = readCourses();
  const cIdx = courses.findIndex(c => c.id === courseId);
  if (cIdx === -1) return;
  const lIdx = courses[cIdx].lessons.findIndex(l => l.id === lessonId);
  if (lIdx === -1) return;
  const byId = new Map(courses[cIdx].lessons[lIdx].blocks.map(b => [b.id, b]));
  const reordered = orderedBlockIds.map(id => byId.get(id)).filter((b): b is LessonBlock => !!b);
  const next = [...courses];
  const lessons = [...next[cIdx].lessons];
  lessons[lIdx] = { ...lessons[lIdx], blocks: reordered };
  next[cIdx] = { ...next[cIdx], lessons };
  writeCourses(next);
}
