// The Study Shield: today's real KP progress toward keeping your streak
// alive, replacing the plain flame streak button. Every activity below is a
// real, already-tracked signal—nothing here is simulated or randomized:
//   - Complete lesson / Flashcard session / Complete quiz / 30 min studying
//     → lib/progress.ts's real per-day activity map (getTodayActivity)
//   - Daily Case                          → lib/clinicalCases.ts's real
//     today's-attempt record (getTodayCaseAttempt)
//   - Learn terminology                   → lib/terminology.ts's real
//     today's-review count (getTerminologyStats)
//
// Reaching the target really does extend your streak: once secured, this
// module calls progress.ts's markStreakDaySecured() directly (the same
// real streak-day storage the existing 3-goal Study Plan already writes
// to)—so the Shield isn't a second, disconnected "streak" concept, it's
// just a different, points-based way to earn the same real day.
//
// This file (not lib/progress.ts) owns the aggregation because it needs
// lib/terminology.ts's stats, and terminology.ts already imports from
// progress.ts—so progress.ts importing back from terminology.ts (or from
// here) would be circular. This file safely imports one-directionally from
// progress.ts, terminology.ts, and clinicalCases.ts instead.
//
// The target itself is adaptive once a real exam date is set (see
// lib/adaptivePacing.ts): the Study Planner's dynamic daily KP target IS
// the real number that secures today's streak, not a second, disconnected
// target—so the header pill, the planner's progress bar, and "streak
// secured" all agree on one real number. Falls back to the flat default
// until an exam date exists.

import { getTodayActivity, getStreak, markStreakDaySecured } from "./progress";
import { getTerminologyStats } from "./terminology";
import { getTodayCaseAttempt } from "./clinicalCases";
import { getAdaptivePace, getExamDate, getIntensity } from "./adaptivePacing";

export const SHIELD_TARGET_KP = 50;

export type ShieldActivityId = "lesson" | "flashcards" | "quiz" | "case" | "terminology" | "minutes";

export type ShieldActivity = { id: ShieldActivityId; label: string; kp: number; done: boolean };

export type ShieldProgress = {
  activities: ShieldActivity[];
  currentKP: number;
  targetKP: number;
  percent: number;
  secured: boolean;
  kpUntilSecured: number;
  streakDays: number;
};

export function getTodayShieldProgress(): ShieldProgress {
  const today = getTodayActivity();
  const term = getTerminologyStats();
  const caseAttempt = getTodayCaseAttempt();

  const activities: ShieldActivity[] = [
    { id: "lesson", label: "Complete lesson", kp: 25, done: today.lessons > 0 },
    { id: "flashcards", label: "Flashcard session", kp: 15, done: today.flashcards > 0 },
    { id: "quiz", label: "Complete quiz", kp: 20, done: today.quizzes > 0 },
    { id: "case", label: "Daily Case", kp: 25, done: caseAttempt !== null },
    { id: "terminology", label: "Learn terminology", kp: 5, done: term.todayCount > 0 },
    { id: "minutes", label: "30 min studying", kp: 20, done: today.minutes >= 30 }
  ];

  const currentKP = activities.filter(a => a.done).reduce((sum, a) => sum + a.kp, 0);

  const examDate = getExamDate();
  const adaptive = examDate ? getAdaptivePace(examDate, getIntensity()) : null;
  const targetKP = adaptive?.dailyKPTarget ?? SHIELD_TARGET_KP;
  const secured = currentKP >= targetKP;

  return {
    activities,
    currentKP,
    targetKP,
    percent: Math.min(100, Math.round((currentKP / targetKP) * 100)),
    secured,
    kpUntilSecured: Math.max(0, targetKP - currentKP),
    streakDays: getStreak()
  };
}

// Safe to call every time the Shield is computed (e.g. on mount, and after
// every activity change)—markStreakDaySecured() is itself idempotent, so
// calling it again once today's already secured is a harmless no-op.
export function ensureShieldSecured(progress: ShieldProgress): void {
  if (progress.secured) markStreakDaySecured();
}
