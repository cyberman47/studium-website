// Real Adaptive Pacing engine for the Study Planner. One macro anchor (a
// single real exam date) replaces the earlier per-topic Mastery Goals
// system—everything here is computed from data that already exists
// elsewhere in the app: real lesson completion across the whole MCAT
// curriculum, real today's-activity/KP (lib/progress.ts), real due
// flashcards, real unused practice questions, and a real Daily Case attempt
// record. Nothing here is simulated or randomized.

import { getLessonContent, getLessonEntry, mcatSections } from "./mcatPath";
import { getAllMcatPracticeQuestions, getUnusedMcatPracticeQuestions } from "./mcatConcepts";
import { getAllLibraryCards, isCardDue } from "./flashcardLibrary";
import { getCaseOfTheDay, getTodayCaseAttempt } from "./clinicalCases";
import { getTodayActivity } from "./progress";

const EXAM_DATE_KEY = "studium_exam_date";
const INTENSITY_KEY = "studium_pace_intensity";
const CUSTOM_TASKS_KEY = "studium_custom_tasks";
export const ADAPTIVE_PACING_EVENT = "studium:adaptivePacingChange";

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(ADAPTIVE_PACING_EVENT));
}

function dateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

// ---- Exam anchor ----

export function getExamDate(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EXAM_DATE_KEY);
}

export function setExamDate(date: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXAM_DATE_KEY, date);
  notify();
}

export function getDaysRemaining(examDate: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(`${examDate}T00:00:00`);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}

// ---- Intensity ----

export type Intensity = "comfort" | "balanced" | "aggressive";
export const intensityLabels: Record<Intensity, string> = { comfort: "Comfort", balanced: "Balanced", aggressive: "Aggressive" };
const intensityMultiplier: Record<Intensity, number> = { comfort: 0.7, balanced: 1, aggressive: 1.4 };
const intensityCardCap: Record<Intensity, number> = { comfort: 20, balanced: 35, aggressive: 50 };

export function getIntensity(): Intensity {
  if (typeof window === "undefined") return "balanced";
  const raw = localStorage.getItem(INTENSITY_KEY);
  return raw === "comfort" || raw === "balanced" || raw === "aggressive" ? raw : "balanced";
}

export function setIntensity(intensity: Intensity) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTENSITY_KEY, intensity);
  notify();
}

// ---- Real syllabus progress ----
// Only lessons with real written content count, on both sides of the
// fraction—counting the ~80 still-empty title stubs elsewhere in the
// curriculum would make this number permanently near-zero for reasons that
// have nothing to do with the student's own progress.

export type SyllabusProgress = { completedLessons: number; totalLessonsWithContent: number; percent: number };

export function getSyllabusProgress(): SyllabusProgress {
  let completed = 0, total = 0;
  for (const section of mcatSections) {
    for (const subject of section.subjects) {
      for (const lesson of subject.lessons) {
        if (!getLessonContent(lesson.id)) continue;
        total++;
        if (getLessonEntry(lesson.id)?.status === "completed") completed++;
      }
    }
  }
  return { completedLessons: completed, totalLessonsWithContent: total, percent: total ? Math.round((completed / total) * 100) : 0 };
}

// ---- Adaptive pace ----

export type PaceState = "relaxed" | "optimal" | "sprint";

export type AdaptivePace = {
  dailyKPTarget: number;
  flashcardsTarget: number;
  quizTarget: number;
  paceState: PaceState;
  message: string;
};

// Same real per-activity KP the Study Shield itself awards (Learn +25,
// Practice +20)—"how much KP would fully working through one more real
// lesson be worth," not an arbitrary made-up number.
const KP_PER_REMAINING_LESSON = 45;

export function getAdaptivePace(examDate: string | null, intensity: Intensity): AdaptivePace | null {
  if (!examDate) return null;
  const days = Math.max(1, getDaysRemaining(examDate));
  const syllabus = getSyllabusProgress();
  const remainingLessons = Math.max(0, syllabus.totalLessonsWithContent - syllabus.completedLessons);
  const baseKP = (remainingLessons * KP_PER_REMAINING_LESSON) / days;
  const scaled = baseKP * intensityMultiplier[intensity];
  const dailyKPTarget = Math.max(15, Math.min(150, Math.round(scaled / 5) * 5));

  const paceState: PaceState = dailyKPTarget < 35 ? "relaxed" : dailyKPTarget <= 60 ? "optimal" : "sprint";
  const dateLabel = new Date(`${examDate}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const message = paceState === "relaxed"
    ? `You're well ahead of schedule. ${dailyKPTarget} KP/day comfortably keeps you on track for ${dateLabel}.`
    : paceState === "sprint"
      ? `${dateLabel} is coming up fast with real work still remaining—${dailyKPTarget} KP/day keeps you on pace.`
      : `${dailyKPTarget} KP/day keeps you on track to be ready by ${dateLabel}.`;

  const dueCards = getAllLibraryCards().filter(c => isCardDue(c.id)).length;
  const flashcardsTarget = Math.min(dueCards, intensityCardCap[intensity]);
  const quizTarget = intensity === "aggressive" ? 2 : 1;

  return { dailyKPTarget, flashcardsTarget, quizTarget, paceState, message };
}

// ---- Custom tasks (personal checklist, no KP) ----
// Deliberately don't award KP: real Knowledge Points stay tied to verified
// platform activity (a lesson genuinely completed, a quiz genuinely taken),
// not a self-reported claim—otherwise the whole streak-security number
// stops meaning anything.

export type CustomTask = { id: string; title: string; done: boolean; createdAt: string };

function readCustomTaskMap(): Record<string, CustomTask[]> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(CUSTOM_TASKS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeCustomTaskMap(map: Record<string, CustomTask[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_TASKS_KEY, JSON.stringify(map));
  notify();
}

export function getTodaysCustomTasks(): CustomTask[] {
  return readCustomTaskMap()[dateKey()] ?? [];
}

export function addCustomTask(title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const map = readCustomTaskMap();
  const key = dateKey();
  map[key] = [...(map[key] ?? []), { id: `task-${Date.now()}`, title: trimmed, done: false, createdAt: new Date().toISOString() }];
  writeCustomTaskMap(map);
}

export function toggleCustomTask(id: string) {
  const map = readCustomTaskMap();
  const key = dateKey();
  map[key] = (map[key] ?? []).map(t => t.id === id ? { ...t, done: !t.done } : t);
  writeCustomTaskMap(map);
}

export function deleteCustomTask(id: string) {
  const map = readCustomTaskMap();
  const key = dateKey();
  map[key] = (map[key] ?? []).filter(t => t.id !== id);
  writeCustomTaskMap(map);
}

// ---- Today's real task checklist ----

export type PacingTask = {
  id: string;
  kind: "case" | "flashcards" | "quiz" | "custom";
  title: string;
  detail: string;
  kp: number;
  done: boolean;
  href: string | null;
};

export function getTodaysPacingTasks(pace: AdaptivePace): PacingTask[] {
  const today = getTodayActivity();
  const tasks: PacingTask[] = [];

  const todaysCase = getCaseOfTheDay();
  tasks.push({
    id: "case", kind: "case",
    title: "Solve Daily Case",
    detail: todaysCase ? todaysCase.title : "Today's clinical case.",
    kp: 25, done: getTodayCaseAttempt() !== null,
    href: "/dashboard/case-of-the-day"
  });

  tasks.push({
    id: "flashcards", kind: "flashcards",
    title: "Flashcard Review",
    detail: pace.flashcardsTarget > 0 ? `${Math.min(today.flashcards, pace.flashcardsTarget)}/${pace.flashcardsTarget} cards` : "No cards due right now.",
    kp: 15, done: pace.flashcardsTarget > 0 && today.flashcards >= pace.flashcardsTarget,
    href: "/dashboard/flashcards"
  });

  const unused = getUnusedMcatPracticeQuestions(getAllMcatPracticeQuestions());
  tasks.push({
    id: "quiz", kind: "quiz",
    title: "Complete Practice Quiz",
    detail: `${unused.length} unused question${unused.length === 1 ? "" : "s"} available`,
    kp: 20, done: today.quizzes >= pace.quizTarget,
    href: "/dashboard/learning-paths/mcat/practice"
  });

  for (const t of getTodaysCustomTasks()) {
    tasks.push({ id: t.id, kind: "custom", title: t.title, detail: "Personal checklist item—doesn't award KP.", kp: 0, done: t.done, href: null });
  }

  return tasks;
}
