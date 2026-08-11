// The AI Study Planner's deterministic core. Fully functional with zero AI
// calls (lib/studyPlannerAI.ts layers Claude's interpretation on top of
// this, never in place of it)—every number here comes from real signals
// already tracked elsewhere in the app:
//   - Lesson/subject completion         → lib/mcatPath.ts
//   - Quiz/practice accuracy & misses   → lib/practiceHistory.ts
//   - Built-in per-subject quizzes      → lib/mcatConcepts.ts
//   - KP totals & daily-goal history    → lib/progress.ts
// Nothing here re-implements or duplicates those systems—this module only
// combines their outputs into a daily plan and a single KP target.

import { getLessonContent, getLessonEntry, mcatSections, SectionDef, SubjectDef } from "./mcatPath";
import { getAttemptsForLesson, getWeakConcepts, PracticeAttempt, WeakConcept } from "./practiceHistory";
import { findBuiltInQuiz } from "./mcatConcepts";
import { claimStudySession, getRecentDailyGoalHistory, getTodayActivity, getWeeklyActivity } from "./progress";

export const STUDY_PLANNER_EVENT = "studium:studyPlannerChange";

const EXAM_KEY = "studium_study_plan_exam";
const TOPICS_KEY = "studium_study_plan_topics";
const DAILY_KEY = "studium_study_plan_daily";
const ADJUSTMENTS_KEY = "studium_study_plan_adjustments";

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(STUDY_PLANNER_EVENT));
}

function dateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

// ---- Exam setup ----
// examId is real-only: MCAT is the sole exam with authored lesson/practice
// content today (see getRealSubjects below), so it's the only option the
// setup wizard actually offers—no fabricated USMLE/Pharmacology plans.

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export const weekdayOptions: { id: Weekday; label: string }[] = [
  { id: "mon", label: "Mon" }, { id: "tue", label: "Tue" }, { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" }, { id: "fri", label: "Fri" }, { id: "sat", label: "Sat" }, { id: "sun", label: "Sun" }
];

export type ExamConfig = {
  examId: "mcat";
  examDate: string; // yyyy-mm-dd
  hoursPerDay: number;
  availableDays: Weekday[];
  overallConfidence: 1 | 2 | 3 | 4 | 5;
  createdAt: string; // ISO—doubles as the start of the prep window for exam-stage detection
};

export function getExamConfig(): ExamConfig | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(EXAM_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setExamConfig(input: { examDate: string; hoursPerDay: number; availableDays: Weekday[]; overallConfidence: 1 | 2 | 3 | 4 | 5 }) {
  if (typeof window === "undefined") return;
  const existing = getExamConfig();
  const config: ExamConfig = { examId: "mcat", ...input, createdAt: existing?.createdAt ?? new Date().toISOString() };
  localStorage.setItem(EXAM_KEY, JSON.stringify(config));
  notify();
}

// Preserves createdAt (the original prep-window start) so adjusting the
// date later doesn't reset exam-stage detection back to "early".
export function updateExamDate(examDate: string) {
  const existing = getExamConfig();
  if (!existing) return;
  localStorage.setItem(EXAM_KEY, JSON.stringify({ ...existing, examDate }));
  notify();
}

export function getDaysRemaining(examDate: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(`${examDate}T00:00:00`);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}

// ---- Exam stage (spec: allocation shifts dynamically, not hardcoded) ----
// Early = still building fundamentals. Middle = weak-area/active-recall
// focus. Final = timed practice + mistake review. Derived from how far
// through the real prep window (createdAt → examDate) today actually is,
// not a fixed day-count per exam.

export type ExamStage = "early" | "middle" | "final";

export function getExamStage(config: ExamConfig): ExamStage {
  const created = new Date(config.createdAt).getTime();
  const exam = new Date(`${config.examDate}T00:00:00`).getTime();
  const totalWindow = Math.max(1, exam - created);
  const elapsed = Math.max(0, Date.now() - created);
  const percentElapsed = Math.min(1, elapsed / totalWindow);
  if (percentElapsed < 0.4) return "early";
  if (percentElapsed < 0.75) return "middle";
  return "final";
}

// ---- Real subjects ----
// Only subjects with at least one lesson that has real authored content
// count—matches the exact "only real content counts" rule already used by
// the old adaptive pacing engine's syllabus-progress calculation, so a
// subject that's just an empty title stub never shows up asking to be
// rated or planned around.

export type RealSubject = { sectionId: string; sectionTitle: string; subjectId: string; subjectName: string; lessonIds: string[] };

let cachedRealSubjects: RealSubject[] | null = null;

export function getRealSubjects(): RealSubject[] {
  if (cachedRealSubjects) return cachedRealSubjects;
  const out: RealSubject[] = [];
  for (const section of mcatSections as SectionDef[]) {
    for (const subject of section.subjects as SubjectDef[]) {
      const lessonIds = subject.lessons.filter(l => getLessonContent(l.id)).map(l => l.id);
      if (lessonIds.length > 0) out.push({ sectionId: section.id, sectionTitle: section.shortTitle, subjectId: subject.id, subjectName: subject.name, lessonIds });
    }
  }
  cachedRealSubjects = out;
  return out;
}

// ---- Per-subject confidence (spec §6) ----

export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;
export type TopicConfidenceEntry = { confidence: ConfidenceLevel; ratedAt: string };

function readTopicMap(): Record<string, TopicConfidenceEntry> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(TOPICS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getAllTopicConfidence(): Record<string, TopicConfidenceEntry> {
  return readTopicMap();
}

export function getTopicConfidence(subjectId: string): TopicConfidenceEntry | null {
  return readTopicMap()[subjectId] ?? null;
}

export function setTopicConfidence(subjectId: string, confidence: ConfidenceLevel) {
  if (typeof window === "undefined") return;
  const map = readTopicMap();
  map[subjectId] = { confidence, ratedAt: new Date().toISOString() };
  localStorage.setItem(TOPICS_KEY, JSON.stringify(map));
  notify();
}

export function hasRatedAnyTopics(): boolean {
  return Object.keys(readTopicMap()).length > 0;
}

// ---- Subject performance signals ----

export type SubjectAccuracy = { correct: number; total: number; percent: number | null };

export function getSubjectAccuracy(subject: RealSubject): SubjectAccuracy {
  let correct = 0, total = 0;
  for (const lessonId of subject.lessonIds) {
    for (const attempt of getAttemptsForLesson(lessonId)) {
      total++;
      if (attempt.correct) correct++;
    }
  }
  return { correct, total, percent: total > 0 ? Math.round((correct / total) * 100) : null };
}

export type Trend = "improving" | "declining" | "flat" | null;

// Compares the last real 7 days of attempts against the 7 days before
// that—returns null rather than guessing when there isn't enough real data
// yet to call a trend (fewer than 3 attempts in either window).
export function getSubjectTrend(subject: RealSubject): Trend {
  const attempts: PracticeAttempt[] = subject.lessonIds.flatMap(getAttemptsForLesson);
  if (attempts.length < 6) return null;
  const now = Date.now();
  const withinDays = (a: PracticeAttempt, days: number) => now - new Date(a.attemptedAt).getTime() <= days * 86400000;
  const recent = attempts.filter(a => withinDays(a, 7));
  const prior = attempts.filter(a => !withinDays(a, 7) && withinDays(a, 14));
  if (recent.length < 3 || prior.length < 3) return null;
  const accuracyOf = (list: PracticeAttempt[]) => Math.round((list.filter(a => a.correct).length / list.length) * 100);
  const diff = accuracyOf(recent) - accuracyOf(prior);
  if (diff >= 8) return "improving";
  if (diff <= -8) return "declining";
  return "flat";
}

export function getSubjectWeakConcepts(subject: RealSubject): WeakConcept[] {
  const lessonIdSet = new Set(subject.lessonIds);
  return getWeakConcepts().filter(w => lessonIdSet.has(w.lessonId));
}

// ---- Confidence × performance quadrant (spec §6) ----

export type QuadrantLabel = "strength" | "lacksConfidence" | "overconfident" | "weakness" | "unrated";
export type QuadrantResult = { label: QuadrantLabel; priorityWeight: number; insight: string };

const HIGH_ACCURACY = 75;
const LOW_ACCURACY = 60;
const HIGH_CONFIDENCE = 4;
const LOW_CONFIDENCE = 2;

export function getQuadrant(confidence: ConfidenceLevel | null, accuracyPercent: number | null): QuadrantResult {
  if (accuracyPercent === null) {
    if (confidence === null) return { label: "unrated", priorityWeight: 2, insight: "Not yet rated or practiced." };
    if (confidence <= LOW_CONFIDENCE) return { label: "weakness", priorityWeight: 3, insight: "Low self-rated confidence, no practice data yet." };
    if (confidence >= HIGH_CONFIDENCE) return { label: "unrated", priorityWeight: 1, insight: "Confident, but not yet verified by practice." };
    return { label: "unrated", priorityWeight: 1.5, insight: "Some confidence, no practice data yet." };
  }
  const conf = confidence ?? 3;
  const highConf = conf >= HIGH_CONFIDENCE, lowConf = conf <= LOW_CONFIDENCE;
  const highAcc = accuracyPercent >= HIGH_ACCURACY, lowAcc = accuracyPercent < LOW_ACCURACY;
  if (highConf && highAcc) return { label: "strength", priorityWeight: 0.5, insight: "Confident and performing well—genuine strength." };
  if (lowConf && highAcc) return { label: "lacksConfidence", priorityWeight: 1.5, insight: "Performing well despite low confidence—needs reassurance, not remediation." };
  if (highConf && lowAcc) return { label: "overconfident", priorityWeight: 3.5, insight: "Confident, but missing questions—possible misconception." };
  if (lowConf && lowAcc) return { label: "weakness", priorityWeight: 4, insight: "Low confidence and low accuracy—major weakness." };
  return { label: "unrated", priorityWeight: 2, insight: "Middling confidence and performance—keep practicing." };
}

// ---- Per-subject priority ----

export type SubjectSignals = {
  subject: RealSubject;
  lessonsCompleted: number;
  lessonsTotal: number;
  progressPercent: number;
  accuracy: SubjectAccuracy;
  trend: Trend;
  weakConcepts: WeakConcept[];
  confidence: ConfidenceLevel | null;
  quadrant: QuadrantResult;
  priorityScore: number;
};

function isWithinDays(iso: string, days: number): boolean {
  return Date.now() - new Date(iso).getTime() <= days * 86400000;
}

function computeSubjectSignals(subject: RealSubject, stage: ExamStage): SubjectSignals {
  const completed = subject.lessonIds.filter(id => getLessonEntry(id)?.status === "completed").length;
  const total = subject.lessonIds.length;
  const progressPercent = total ? Math.round((completed / total) * 100) : 0;
  const accuracy = getSubjectAccuracy(subject);
  const trend = getSubjectTrend(subject);
  const weakConcepts = getSubjectWeakConcepts(subject);
  const confidence = getTopicConfidence(subject.subjectId)?.confidence ?? null;
  const quadrant = getQuadrant(confidence, accuracy.percent);

  // Stage bias (spec §12): early stage leans toward subjects still building
  // fundamentals (low completion); middle/final stages lean toward subjects
  // with real recorded misses—dynamic, not a fixed per-exam allocation.
  const stageBias = stage === "early" ? (100 - progressPercent) / 100 : weakConcepts.length > 0 ? 0.5 : 0;
  const recencyBoost = weakConcepts.some(w => isWithinDays(w.lastAttempt, 3)) ? 1.2 : 1;
  const priorityScore = quadrant.priorityWeight * (1 + stageBias) * recencyBoost;

  return { subject, lessonsCompleted: completed, lessonsTotal: total, progressPercent, accuracy, trend, weakConcepts, confidence, quadrant, priorityScore };
}

// Sorted highest-priority first—the input every other function in this
// module (KP target, task generation) builds on.
export function getAllSubjectSignals(): SubjectSignals[] {
  const config = getExamConfig();
  const stage: ExamStage = config ? getExamStage(config) : "middle";
  return getRealSubjects().map(s => computeSubjectSignals(s, stage)).sort((a, b) => b.priorityScore - a.priorityScore);
}

// ---- Intensity & daily/weekly KP target (spec §3, §4) ----

export type Intensity = "light" | "moderate" | "high" | "intensive";
export const intensityMeta: Record<Intensity, { emoji: string; label: string }> = {
  light: { emoji: "🟢", label: "Light study day" },
  moderate: { emoji: "🟡", label: "Moderate study day" },
  high: { emoji: "🟠", label: "High-intensity study day" },
  intensive: { emoji: "🔴", label: "Intensive study day" }
};

// Same real per-lesson KP figure the old adaptive-pacing engine used
// (matches lib/progress.ts's real Learn-activity award size), kept as the
// baseline "how much is one more real lesson worth" unit.
const KP_PER_REMAINING_LESSON = 45;
// A conservative, documented estimate of achievable KP per available study
// hour, blending real per-activity award sizes (lesson ~45 KP/session,
// quiz ~20-35 KP, flashcards/terminology ~15-20 KP)—used only as a hard
// ceiling so the target never asks for more than the student said they
// have time for (spec §3: "do not assign a 3-hour workload" for 1 stated hour).
const KP_PER_HOUR_ESTIMATE = 45;

export type DailyTargetResult = { dailyKPTarget: number; intensity: Intensity; weeklyKPTarget: number; reason: string };

function deriveIntensity(daysRemaining: number, signals: SubjectSignals[]): Intensity {
  const majorWeaknessCount = signals.filter(s => s.quadrant.label === "weakness" || s.quadrant.label === "overconfident").length;
  if (daysRemaining <= 14 && majorWeaknessCount >= 2) return "intensive";
  if (daysRemaining <= 30 || majorWeaknessCount >= 2) return "high";
  if (daysRemaining <= 60 || majorWeaknessCount >= 1) return "moderate";
  return "light";
}

export function calculateDailyTarget(config: ExamConfig, signals: SubjectSignals[]): DailyTargetResult {
  const daysRemaining = Math.max(1, getDaysRemaining(config.examDate));

  // Priority-weighted remaining work: subjects flagged as weaknesses or
  // overconfident pull more of the daily budget than subjects already at
  // maintenance, even if their raw lesson count is the same.
  const weightedRemaining = signals.reduce((sum, s) => sum + (s.lessonsTotal - s.lessonsCompleted) * s.quadrant.priorityWeight, 0);
  const baseKP = (weightedRemaining * KP_PER_REMAINING_LESSON) / daysRemaining;

  // Consistency nudge (spec §3): hitting daily goals consistently nudges
  // tomorrow's target up a little; repeatedly missing nudges it down,
  // rather than staying stuck at a number the student clearly can't sustain.
  const history = getRecentDailyGoalHistory(7);
  const metCount = history.filter(Boolean).length;
  const consistencyMultiplier = metCount >= 6 ? 1.1 : metCount <= 2 ? 0.85 : 1;

  const timeCapKP = Math.max(15, config.hoursPerDay * KP_PER_HOUR_ESTIMATE);
  const rawTarget = Math.min(baseKP * consistencyMultiplier, timeCapKP);
  const dailyKPTarget = Math.max(15, Math.min(150, Math.round(rawTarget / 5) * 5));

  const intensity = deriveIntensity(daysRemaining, signals);
  const activeDays = Math.max(1, config.availableDays.length);
  const weeklyKPTarget = Math.round((dailyKPTarget * activeDays) / 5) * 5;

  const weakSubjects = signals.filter(s => s.quadrant.label === "weakness" || s.quadrant.label === "overconfident");
  const reason = weakSubjects.length > 0
    ? `${dailyKPTarget} KP today, weighted toward ${weakSubjects.slice(0, 2).map(s => s.subject.subjectName).join(" and ")}—your highest-priority topic${weakSubjects.length === 1 ? "" : "s"} right now.`
    : `${dailyKPTarget} KP today—steady maintenance across your subjects, nothing urgently weak.`;

  return { dailyKPTarget, intensity, weeklyKPTarget, reason };
}

// ---- Task generation ----

export type ActivityKind = "lesson" | "practice" | "flashcards" | "terminology";
const activityKp: Record<ActivityKind, number> = { lesson: 45, practice: 25, flashcards: 15, terminology: 20 };
const activityMinutes: Record<ActivityKind, number> = { lesson: 25, practice: 15, flashcards: 10, terminology: 10 };
const activityLabel: Record<ActivityKind, string> = { lesson: "Lesson review", practice: "Practice questions", flashcards: "Flashcards", terminology: "Terminology review" };

export type PlannedTask = {
  id: string;
  subjectId: string;
  sectionId: string;
  subjectName: string;
  activity: ActivityKind;
  label: string;
  kp: number;
  estimatedMinutes: number;
  href: string;
  priorityReason: string;
  done: boolean;
};

function nextIncompleteLessonId(subject: RealSubject): string | null {
  return subject.lessonIds.find(id => getLessonEntry(id)?.status !== "completed") ?? null;
}

function practiceHref(subject: RealSubject): string {
  return `/dashboard/learning-paths/mcat/${subject.sectionId}/${subject.subjectId}/practice`;
}

// Builds the concrete tasks for one subject, shaped by its quadrant—a
// "weakness" subject gets lesson review + practice; a "strength" subject
// gets one light maintenance task; nothing invents an activity the app
// doesn't actually have.
function tasksForSubject(signals: SubjectSignals): PlannedTask[] {
  const { subject, quadrant } = signals;
  const tasks: PlannedTask[] = [];
  const nextLessonId = nextIncompleteLessonId(subject);

  function push(activity: ActivityKind, href: string, reasonSuffix: string) {
    tasks.push({
      id: `${subject.subjectId}:${activity}:${dateKey()}`,
      subjectId: subject.subjectId, sectionId: subject.sectionId, subjectName: subject.subjectName,
      activity, label: activityLabel[activity], kp: activityKp[activity], estimatedMinutes: activityMinutes[activity],
      href, priorityReason: `${quadrant.insight}${reasonSuffix}`, done: false
    });
  }

  if (quadrant.label === "weakness" || quadrant.label === "overconfident") {
    if (nextLessonId) push("lesson", `/dashboard/learning-paths/mcat/${subject.sectionId}/${subject.subjectId}/${nextLessonId}`, "");
    push("practice", practiceHref(subject), " Targeted practice to close the gap.");
  } else if (quadrant.label === "lacksConfidence") {
    push("flashcards", "/dashboard/flashcards", " Reinforcing what you already know.");
    push("practice", practiceHref(subject), "");
  } else if (quadrant.label === "unrated") {
    if (nextLessonId) push("lesson", `/dashboard/learning-paths/mcat/${subject.sectionId}/${subject.subjectId}/${nextLessonId}`, "");
    else push("practice", practiceHref(subject), " Building a real performance signal for this topic.");
  } else {
    // strength → light maintenance only
    push("terminology", "/dashboard/terminology/review", " Maintenance—no need to over-invest here.");
  }

  return tasks;
}

// Snapshot of each subject's priority as of the last generation—compared
// against on the next regenerate so real, specific adjustments (spec §8)
// can be logged only when a subject's tier actually shifts, not on every
// recompute.
type SignalsSnapshot = Record<string, { quadrant: QuadrantLabel; priorityScore: number }>;

export type DailyPlan = {
  dateKey: string;
  kpTarget: number;
  weeklyKPTarget: number;
  intensity: Intensity;
  focusSubjectIds: string[];
  tasks: PlannedTask[];
  reason: string;
  generatedAt: string;
  aiRecommendation?: string;
  signalsSnapshot?: SignalsSnapshot;
};

function readDailyMap(): Record<string, DailyPlan> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(DAILY_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeDailyMap(map: Record<string, DailyPlan>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DAILY_KEY, JSON.stringify(map));
  notify();
}

// Regenerates today's plan from current signals, preserving any tasks the
// student has already marked done (by id) and any AI recommendation
// already cached for today—so recomputing priorities mid-day doesn't wipe
// real progress or force a redundant AI call.
export function generateDailyPlan(): DailyPlan | null {
  const config = getExamConfig();
  if (!config) return null;

  const signals = getAllSubjectSignals();
  const { dailyKPTarget, weeklyKPTarget, intensity, reason } = calculateDailyTarget(config, signals);

  // Allocate today's tasks across the top 4 highest-priority subjects—more
  // than that would fragment the day into too many small hops for the
  // stated available hours.
  const focusSubjects = signals.slice(0, 4);
  const existing = readDailyMap()[dateKey()];
  const doneMap = new Map((existing?.tasks ?? []).filter(t => t.done).map(t => [t.id, true]));

  const tasks = focusSubjects.flatMap(tasksForSubject).map(t => doneMap.has(t.id) ? { ...t, done: true } : t);

  // Real adaptive scheduling (spec §8): compare this recompute against the
  // snapshot from the last one and log a specific, human-readable note for
  // any subject whose priority tier actually moved—e.g. after a practice
  // attempt or a terminology rating changes its accuracy/confidence.
  if (existing?.signalsSnapshot) {
    for (const s of signals) {
      const prev = existing.signalsSnapshot[s.subject.subjectId];
      if (!prev || prev.quadrant === s.quadrant.label) continue;
      const detail = s.accuracy.percent !== null ? `${s.accuracy.correct}/${s.accuracy.total} correct in practice` : "confidence updated";
      if (s.priorityScore > prev.priorityScore) logAdjustment(`${s.subject.subjectName} priority increased: ${detail}.`);
      else if (s.priorityScore < prev.priorityScore) logAdjustment(`${s.subject.subjectName} priority decreased: ${detail}.`);
    }
  }
  const signalsSnapshot: SignalsSnapshot = {};
  for (const s of signals) signalsSnapshot[s.subject.subjectId] = { quadrant: s.quadrant.label, priorityScore: s.priorityScore };

  const plan: DailyPlan = {
    dateKey: dateKey(), kpTarget: dailyKPTarget, weeklyKPTarget, intensity,
    focusSubjectIds: focusSubjects.map(s => s.subject.subjectId), tasks, reason,
    generatedAt: new Date().toISOString(), aiRecommendation: existing?.aiRecommendation, signalsSnapshot
  };

  const map = readDailyMap();
  map[plan.dateKey] = plan;
  writeDailyMap(map);
  return plan;
}

// Returns today's cached plan if one already exists (so a page revisit
// doesn't silently reshuffle tasks the student is mid-way through),
// generating a fresh one only if today has none yet.
export function getTodaysPlan(): DailyPlan | null {
  const cached = readDailyMap()[dateKey()];
  if (cached) return cached;
  return generateDailyPlan();
}

// Call after a real signal-changing event (a practice attempt, a
// terminology rating)—forces today's plan to recompute from current
// signals instead of serving the stale cached one, which is what makes the
// schedule genuinely adaptive (spec §8) rather than fixed once generated
// each morning.
export function refreshTodaysPlan(): DailyPlan | null {
  return generateDailyPlan();
}

// Merges a validated AI response into today's cached plan without
// re-running the deterministic generator (which would drop the merge).
export function attachAIRecommendation(recommendation: string, adjustedKPTarget?: number) {
  const map = readDailyMap();
  const today = map[dateKey()];
  if (!today) return;
  map[dateKey()] = { ...today, aiRecommendation: recommendation, kpTarget: adjustedKPTarget ?? today.kpTarget };
  writeDailyMap(map);
}

// Marking a task done awards the same real "complete a planned study
// session" KP every other planned-session flow in this app already uses
// (lib/progress.ts's claimStudySession, once/day)—no new reward path.
export function markTaskDone(taskId: string) {
  const map = readDailyMap();
  const today = map[dateKey()];
  if (!today) return;
  const task = today.tasks.find(t => t.id === taskId);
  if (!task || task.done) return;
  map[dateKey()] = { ...today, tasks: today.tasks.map(t => t.id === taskId ? { ...t, done: true } : t) };
  writeDailyMap(map);
  claimStudySession();
}

export function getTodayPlannerKPProgress(): { earned: number; target: number; percent: number } {
  const plan = getTodaysPlan();
  const target = plan?.kpTarget ?? 0;
  const earned = getTodayActivity().kp;
  return { earned, target, percent: target > 0 ? Math.min(100, Math.round((earned / target) * 100)) : 0 };
}

// Weekly progress reuses lib/progress.ts's own real weekly KP aggregate
// (getWeeklyActivity) against the weekly target from today's plan—no
// second, parallel weekly ledger.
export function getWeeklyKPProgress(): { earned: number; target: number } {
  const plan = getTodaysPlan();
  const target = plan?.weeklyKPTarget ?? 0;
  return { earned: getWeeklyActivity().kp, target };
}

// ---- Adjustment log (spec §8: adaptive scheduling transparency) ----

export type Adjustment = { id: string; message: string; createdAt: string };

function readAdjustments(): Adjustment[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ADJUSTMENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getAdjustments(): Adjustment[] {
  return readAdjustments();
}

export function logAdjustment(message: string) {
  if (typeof window === "undefined") return;
  const next = [{ id: `adj-${Date.now()}`, message, createdAt: new Date().toISOString() }, ...readAdjustments()].slice(0, 20);
  localStorage.setItem(ADJUSTMENTS_KEY, JSON.stringify(next));
  notify();
}
