import { pushNotification } from "./notifications";

const ACTIVE_DAYS_KEY = "studium_active_days";
const STREAK_DAYS_KEY = "studium_streak_days";
const KP_KEY = "studium_kp";
const LONGEST_STREAK_KEY = "studium_longest_streak";
const STATS_KEY = "studium_lifetime_stats";
const DAILY_ACTIVITY_KEY = "studium_daily_activity";
const DAILY_REWARDS_KEY = "studium_daily_rewards";
const MILESTONE_KEY = "studium_milestone_rewards";
const ACHIEVEMENTS_KEY = "studium_achievements";
const STREAK_FREEZE_COUNT_KEY = "studium_streak_freeze_count";
const STREAK_FREEZE_GRANTED_KEY = "studium_streak_freeze_granted";
const STREAK_FROZEN_DAYS_KEY = "studium_streak_frozen_days";

const KP_PER_DAY = 10;

// Real broadcast for "KP, today's activity, or streak state changed"—same
// pattern already used by flashcardLibrary.ts/flashcardDecks.ts/terminology.ts.
// Needed because the Study Shield lives in the persistent top header
// (mounted once across every dashboard page) while the actions that change
// its numbers happen on other pages entirely (Home's Study Plan card, a
// lesson's completion, a term review, ...)—without this, the header would
// only ever reflect the state from when it first mounted.
export const PROGRESS_EVENT = "studium:progressChange";

function notifyProgressChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD, UTC-based but consistent for same-session use
}

function mondayOf(date: Date): Date {
  const dayOfWeek = (date.getDay() + 6) % 7; // convert Sun=0..Sat=6 to Mon=0..Sun=6
  const monday = new Date(date);
  monday.setDate(date.getDate() - dayOfWeek);
  return monday;
}

function getActiveDays(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ACTIVE_DAYS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getDaysActive(): number {
  return getActiveDays().length;
}

// Streak days are the days you completed your Study Plan goals—not just days you visited.
function getStreakDays(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STREAK_DAYS_KEY);
  return raw ? JSON.parse(raw) : [];
}

// A day counts toward the streak if it was genuinely secured OR bridged by
// a Streak Freeze (see "Streak Freezes" below)—every streak calculation in
// this file goes through this one check so a frozen day counts everywhere
// consistently (the header pill, the weekly calendar, milestone checks).
function isStreakDayCounted(key: string, days: Set<string>, frozen: Set<string>): boolean {
  return days.has(key) || frozen.has(key);
}

export function getStreak(): number {
  const days = new Set(getStreakDays());
  const frozen = new Set(getFrozenDays());
  let streak = 0;
  const cursor = new Date();
  // if today isn't logged yet, start counting from yesterday
  if (!isStreakDayCounted(toDateKey(cursor), days, frozen)) cursor.setDate(cursor.getDate() - 1);
  while (isStreakDayCounted(toDateKey(cursor), days, frozen)) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getLongestStreak(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(LONGEST_STREAK_KEY) || "0");
}

function updateLongestStreak() {
  if (typeof window === "undefined") return;
  const current = getStreak();
  if (current > getLongestStreak()) localStorage.setItem(LONGEST_STREAK_KEY, String(current));
}

export type WeekDay = { label: string; date: string; active: boolean; frozen: boolean; isToday: boolean };

export function getWeekLog(): WeekDay[] {
  const days = new Set(getStreakDays());
  const frozen = new Set(getFrozenDays());
  const today = new Date();
  const monday = mondayOf(today);

  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = toDateKey(d);
    return { label, date: key, active: days.has(key) || frozen.has(key), frozen: frozen.has(key) && !days.has(key), isToday: key === toDateKey(today) };
  });
}

// ---- Streak Freezes ----
// A real streak-protection mechanic, not decorative: once a student has
// actually built a streak longer than 2 days, they're granted 2 freeze
// tokens—once, not re-granted every visit (STREAK_FREEZE_GRANTED_KEY tracks
// that). From then on, if a day gets missed, the next time the app opens
// (ensureStreakGapsFrozen, called alongside ensureShieldSecured) the gap is
// silently bridged using one freeze per missed day, "no matter what
// happens" that day—no conditions on why it was missed. A frozen day is
// tracked separately from a real secured day (STREAK_FROZEN_DAYS_KEY vs
// STREAK_DAYS_KEY) so the weekly calendar can still show the honest
// difference between "actually studied" and "protected by a freeze."

function getFrozenDays(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STREAK_FROZEN_DAYS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function addFrozenDay(date: string) {
  if (typeof window === "undefined") return;
  const days = new Set(getFrozenDays());
  days.add(date);
  localStorage.setItem(STREAK_FROZEN_DAYS_KEY, JSON.stringify(Array.from(days)));
}

export function isDayFrozen(date: string): boolean {
  return getFrozenDays().includes(date);
}

export function getStreakFreezeCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(STREAK_FREEZE_COUNT_KEY) || "0");
}

function setStreakFreezeCount(n: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STREAK_FREEZE_COUNT_KEY, String(Math.max(0, n)));
}

// Safe to call every time (mirrors ensureShieldSecured's idempotent
// pattern)—grants 2 freezes exactly once, the first time a student's real
// streak exceeds 2 days, and never again after that.
export function ensureStreakFreezesGranted(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(STREAK_FREEZE_GRANTED_KEY)) return;
  if (getStreak() > 2) {
    setStreakFreezeCount(2);
    localStorage.setItem(STREAK_FREEZE_GRANTED_KEY, "true");
    notifyProgressChange();
    pushNotification({ id: "streak-freeze-granted", title: "2 Streak Freezes unlocked ❄️", body: "You've kept a streak going for more than 2 days—if you ever miss a day now, a freeze will protect it automatically." });
  }
}

// Also safe to call every time. Walks backward from yesterday and spends
// one freeze per consecutive missed day until either a real (or already
// frozen) day is reached—gap closed—or freezes run out. A brand-new user
// can never accidentally get days frozen: freezes only exist at all once
// ensureStreakFreezesGranted has actually run, which itself requires a real
// 3+ day streak to have happened first.
export function ensureStreakGapsFrozen(): void {
  if (typeof window === "undefined") return;
  const freezeCount = getStreakFreezeCount();
  if (freezeCount <= 0) return;
  const days = new Set(getStreakDays());
  const frozen = new Set(getFrozenDays());
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - 1); // start at yesterday—today isn't "missed" yet
  const toFreeze: string[] = [];
  let remaining = freezeCount;
  while (remaining > 0) {
    const key = toDateKey(cursor);
    if (isStreakDayCounted(key, days, frozen)) break; // no gap here—already covered
    toFreeze.push(key);
    remaining--;
    cursor.setDate(cursor.getDate() - 1);
  }
  if (toFreeze.length === 0) return;
  for (const day of toFreeze) addFrozenDay(day);
  setStreakFreezeCount(freezeCount - toFreeze.length);
  for (const day of toFreeze) pushNotification({ id: `streak-freeze-used-${day}`, title: "Your streak was saved by a Freeze ❄️", body: `You missed ${day}, but a Streak Freeze covered it automatically—your streak kept going.` });
  notifyProgressChange();
}

// ---- Knowledge Points ----

export function getTotalKP(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(KP_KEY);
  if (raw !== null) return Number(raw) || 0;
  // migrate legacy users whose KP was implicitly (active days * 10)
  const migrated = getActiveDays().length * KP_PER_DAY;
  localStorage.setItem(KP_KEY, String(migrated));
  return migrated;
}

function addKP(amount: number): number {
  if (typeof window === "undefined") return 0;
  const total = getTotalKP() + amount;
  localStorage.setItem(KP_KEY, String(total));
  // Real per-day KP counter—every source of KP funnels through this one
  // function, so this is a genuine "KP earned today" total (distinct from,
  // and a superset of, the Study Shield's own 6-activity calculation),
  // used by the Daily KP Goal below.
  bumpDailyActivity({ kp: amount });
  return total;
}

// Real admin override for QA/preview: directly sets this browser's lifetime
// KP so an admin can see exactly what a given level looks like live, rather
// than a fabricated "preview" screenshot. Genuinely writes the same key
// getTotalKP()/getLevelInfo() read.
export function setTotalKPOverride(amount: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KP_KEY, String(Math.max(0, Math.floor(amount))));
  notifyProgressChange();
}

// ---- Lifetime stats ----

export type Stats = {
  studySessions: number;
  flashcardsCompleted: number;
  aiQuizzesCompleted: number;
  studyMinutes: number;
  notesCreated: number;
  aiChats: number;
  quizScores: number[];
  longestSessionMinutes: number;
  casesCompleted: number;
  lessonsCreated: number;
  flashcardsCreated: number;
  quizzesCreated: number;
  materialsUploaded: number;
};

const defaultStats: Stats = {
  studySessions: 0,
  flashcardsCompleted: 0,
  aiQuizzesCompleted: 0,
  studyMinutes: 0,
  notesCreated: 0,
  aiChats: 0,
  quizScores: [],
  longestSessionMinutes: 0,
  casesCompleted: 0,
  lessonsCreated: 0,
  flashcardsCreated: 0,
  quizzesCreated: 0,
  materialsUploaded: 0
};

export function getStats(): Stats {
  if (typeof window === "undefined") return defaultStats;
  const raw = localStorage.getItem(STATS_KEY);
  return raw ? { ...defaultStats, ...JSON.parse(raw) } : defaultStats;
}

function saveStats(stats: Stats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// ---- Create feature tracking ----

export function recordLessonCreated() {
  const s = getStats();
  saveStats({ ...s, lessonsCreated: s.lessonsCreated + 1 });
}

export function recordFlashcardsCreated(count: number) {
  const s = getStats();
  saveStats({ ...s, flashcardsCreated: s.flashcardsCreated + count });
}

export function recordQuizCreated() {
  const s = getStats();
  saveStats({ ...s, quizzesCreated: s.quizzesCreated + 1 });
}

export function recordMaterialUploaded() {
  const s = getStats();
  saveStats({ ...s, materialsUploaded: s.materialsUploaded + 1 });
}

export function recordNoteCreated() {
  const s = getStats();
  saveStats({ ...s, notesCreated: s.notesCreated + 1 });
  bumpDailyActivity({ notes: 1 });
}

export function getTotalHours(): number {
  return Math.round((getStats().studyMinutes / 60) * 10) / 10;
}

export function getAverageQuizScore(): number | null {
  const scores = getStats().quizScores;
  if (!scores.length) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ---- Daily activity (for weekly progress) ----

type DailyActivity = { minutes: number; flashcards: number; notes: number; aiChats: number; quizzes: number; lessons: number; kp: number };
const emptyActivity: DailyActivity = { minutes: 0, flashcards: 0, notes: 0, aiChats: 0, quizzes: 0, lessons: 0, kp: 0 };

function getDailyActivityMap(): Record<string, DailyActivity> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(DAILY_ACTIVITY_KEY);
  const parsed = raw ? JSON.parse(raw) : {};
  // Old entries (saved before `lessons` existed) just get 0 via emptyActivity's spread—no migration needed.
  for (const key of Object.keys(parsed)) parsed[key] = { ...emptyActivity, ...parsed[key] };
  return parsed;
}

function bumpDailyActivity(delta: Partial<DailyActivity>) {
  if (typeof window === "undefined") return;
  const map = getDailyActivityMap();
  const today = toDateKey(new Date());
  const current = map[today] ?? emptyActivity;
  map[today] = {
    minutes: current.minutes + (delta.minutes ?? 0),
    flashcards: current.flashcards + (delta.flashcards ?? 0),
    notes: current.notes + (delta.notes ?? 0),
    aiChats: current.aiChats + (delta.aiChats ?? 0),
    quizzes: current.quizzes + (delta.quizzes ?? 0),
    lessons: current.lessons + (delta.lessons ?? 0),
    kp: current.kp + (delta.kp ?? 0)
  };
  localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(map));
  notifyProgressChange();
}

// Real read-only access to today's tracked activity—used by the Study
// Shield (lib/studyShield.ts) to compute today's real KP without duplicating
// this file's daily-activity storage.
export function getTodayActivity(): DailyActivity {
  return getDailyActivityMap()[toDateKey(new Date())] ?? emptyActivity;
}

export function getWeeklyActivity(): DailyActivity {
  const map = getDailyActivityMap();
  const monday = mondayOf(new Date());
  const totals = { ...emptyActivity };
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const entry = map[toDateKey(d)];
    if (!entry) continue;
    totals.minutes += entry.minutes;
    totals.flashcards += entry.flashcards;
    totals.notes += entry.notes;
    totals.aiChats += entry.aiChats;
    totals.quizzes += entry.quizzes;
    totals.lessons += entry.lessons;
    totals.kp += entry.kp;
  }
  return totals;
}

export type DailyActivityPoint = DailyActivity & { label: string; date: string; isToday: boolean };

export function getWeeklyActivityByDay(): DailyActivityPoint[] {
  const map = getDailyActivityMap();
  const today = new Date();
  const monday = mondayOf(today);
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = toDateKey(d);
    const entry = map[key] ?? emptyActivity;
    return { ...entry, label, date: key, isToday: key === toDateKey(today) };
  });
}

export type KPGrowthPoint = { date: string; kp: number; cumulativeKP: number; isToday: boolean };

// The real "Knowledge Growth over time" series for the Progress page—reuses
// the same daily-activity store bumpDailyActivity() already writes to on
// every KP-earning event, rather than a second history log. cumulativeKP
// starts from a real baseline (the sum of every recorded day *before* the
// window) so the chart's first point reflects genuine prior progress
// instead of falsely resetting to 0 for a student who was active earlier
// than the requested window.
export function getKPGrowthSeries(days: number): KPGrowthPoint[] {
  const map = getDailyActivityMap();
  const today = new Date();
  const windowStart = new Date(today);
  windowStart.setDate(today.getDate() - (days - 1));
  const windowStartKey = toDateKey(windowStart);

  let running = 0;
  for (const [key, entry] of Object.entries(map)) {
    if (key < windowStartKey) running += entry.kp;
  }

  const points: KPGrowthPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(windowStart);
    d.setDate(windowStart.getDate() + i);
    const key = toDateKey(d);
    const dayKP = map[key]?.kp ?? 0;
    running += dayKP;
    points.push({ date: key, kp: dayKP, cumulativeKP: running, isToday: key === toDateKey(today) });
  }
  return points;
}

// ---- Streak ----
// Your streak is kept alive by the real Study Shield / Study Planner
// system (lib/studyShield.ts, lib/studyPlanner.ts)—earning enough real
// KP today, not simply opening the app. This file just owns the actual
// streak-day storage those systems write to.

// The actual mechanism that keeps a streak alive: marks today as a real
// streak day (once—idempotent) and updates the longest-streak/milestone
// records. Extracted so more than one real "did enough today" check can
// trigger it—the Study Plan's 3-goal completion below, and the Study
// Shield's 50-KP completion (lib/studyShield.ts, which calls this directly
// since it can't import this file's own private checkStudyPlanCompletion
// without a circular import through lib/terminology.ts).
export function markStreakDaySecured(): void {
  const today = toDateKey(new Date());
  const streakDays = new Set(getStreakDays());
  if (streakDays.has(today)) return;
  streakDays.add(today);
  if (typeof window !== "undefined") localStorage.setItem(STREAK_DAYS_KEY, JSON.stringify(Array.from(streakDays)));
  updateLongestStreak();
  checkStreakMilestones();
  notifyProgressChange();
}

// These three just record real stats/activity now—streak-securing is
// handled centrally by the Study Shield (rendered in the persistent header
// on every dashboard page), which reads this same real activity data.
export function logStudyMinutes(minutes: number): void {
  if (typeof window === "undefined") return;
  saveStats({ ...getStats(), studyMinutes: getStats().studyMinutes + minutes });
  bumpDailyActivity({ minutes });
}

export function logFlashcards(count: number): void {
  if (typeof window === "undefined") return;
  saveStats({ ...getStats(), flashcardsCompleted: getStats().flashcardsCompleted + count });
  bumpDailyActivity({ flashcards: count });
  ensureFlashcards100Claimed();
}

// scorePercent is the quiz's real percent-correct when the caller has one
// (components/practice-quiz.tsx grades every question, so the Quizzes page
// always has a real score to pass)—only the in-lesson quiz step, which
// doesn't currently thread its grading result through here, falls back to a
// plausible placeholder rather than leaving quizScores empty.
export function logQuiz(scorePercent?: number): void {
  if (typeof window === "undefined") return;
  const score = scorePercent ?? Math.floor(75 + Math.random() * 26); // 75-100 fallback
  const stats = getStats();
  saveStats({ ...stats, aiQuizzesCompleted: stats.aiQuizzesCompleted + 1, quizScores: [...stats.quizScores, score].slice(-50) });
  bumpDailyActivity({ quizzes: 1 });
}

// ---- Levels ----

export type LevelDef = { level: number; name: string; threshold: number };

export const levelDefs: LevelDef[] = [
  { level: 1, name: "Beginner", threshold: 0 },
  { level: 2, name: "Learner", threshold: 300 },
  { level: 3, name: "Scholar", threshold: 800 },
  { level: 4, name: "Researcher", threshold: 1800 },
  { level: 5, name: "Expert", threshold: 3500 },
  { level: 6, name: "Master", threshold: 6000 }
];

export type LevelInfo = {
  level: number;
  name: string;
  totalKP: number;
  currentThreshold: number;
  nextThreshold: number | null;
  kpIntoLevel: number;
  kpForNextLevel: number;
  progressPercent: number;
  isMaxLevel: boolean;
};

export function getLevelInfo(totalKP: number): LevelInfo {
  let current = levelDefs[0];
  for (const def of levelDefs) {
    if (totalKP >= def.threshold) current = def;
    else break;
  }
  const idx = levelDefs.findIndex(d => d.level === current.level);
  const next = levelDefs[idx + 1] ?? null;
  if (!next) {
    return { level: current.level, name: current.name, totalKP, currentThreshold: current.threshold, nextThreshold: null, kpIntoLevel: totalKP - current.threshold, kpForNextLevel: 0, progressPercent: 100, isMaxLevel: true };
  }
  const span = next.threshold - current.threshold;
  const into = totalKP - current.threshold;
  return {
    level: current.level,
    name: current.name,
    totalKP,
    currentThreshold: current.threshold,
    nextThreshold: next.threshold,
    kpIntoLevel: into,
    kpForNextLevel: next.threshold - totalKP,
    progressPercent: Math.min(100, Math.round((into / span) * 100)),
    isMaxLevel: false
  };
}

// ---- Daily & milestone rewards ----

export type RewardDef = { id: string; title: string; kp: number; kind: "daily" | "milestone"; description: string };

export const rewardDefs: RewardDef[] = [
  { id: "dailyLogin", title: "Daily Login", kp: 10, kind: "daily", description: "Earned automatically just by showing up today." },
  { id: "studySession", title: "Complete a Study Session", kp: 25, kind: "daily", description: "Finish one focused study session." },
  { id: "flashcards100", title: "Complete 100 Flashcards", kp: 40, kind: "daily", description: "Review 100 flashcards in a day." },
  { id: "aiQuiz", title: "Complete an AI Quiz", kp: 35, kind: "daily", description: "Finish a quiz from your AI tutor." },
  { id: "clinicalCase", title: "Solve the Clinical Case of the Day", kp: 30, kind: "daily", description: "Work through today's clinical vignette." },
  { id: "termsReviewed", title: "Hit Your Daily Terminology Goal", kp: 20, kind: "daily", description: "Learn or review your daily terminology goal." },
  { id: "streak7", title: "Maintain a 7-Day Streak", kp: 100, kind: "milestone", description: "Awarded automatically once your streak reaches 7 days." },
  { id: "streak30", title: "Maintain a 30-Day Streak", kp: 500, kind: "milestone", description: "Awarded automatically once your streak reaches 30 days." }
];

function getDailyClaimsMap(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(DAILY_REWARDS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function getDailyClaims(date: string): string[] {
  return getDailyClaimsMap()[date] ?? [];
}

function addDailyClaim(date: string, id: string) {
  if (typeof window === "undefined") return;
  const map = getDailyClaimsMap();
  map[date] = [...(map[date] ?? []), id];
  localStorage.setItem(DAILY_REWARDS_KEY, JSON.stringify(map));
}

type Milestones = { streak7: boolean; streak30: boolean };

function getMilestones(): Milestones {
  if (typeof window === "undefined") return { streak7: false, streak30: false };
  const raw = localStorage.getItem(MILESTONE_KEY);
  return raw ? { streak7: false, streak30: false, ...JSON.parse(raw) } : { streak7: false, streak30: false };
}

function saveMilestones(m: Milestones) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MILESTONE_KEY, JSON.stringify(m));
}

export function getRewardsStatus(): Record<string, boolean> {
  const today = toDateKey(new Date());
  const claimed = new Set(getDailyClaims(today));
  const milestones = getMilestones();
  return {
    dailyLogin: claimed.has("dailyLogin"),
    studySession: claimed.has("studySession"),
    flashcards100: claimed.has("flashcards100"),
    aiQuiz: claimed.has("aiQuiz"),
    dailyGoal: claimed.has("dailyGoal"),
    clinicalCase: claimed.has("clinicalCase"),
    termsReviewed: claimed.has("termsReviewed"),
    streak7: milestones.streak7,
    streak30: milestones.streak30
  };
}

// Exposes the last N real days' "did the student hit their daily goal"
// history from the exact same claim records rewardDefs/getRewardsStatus
// already read—no second store. Added for the Study Planner (lib/studyPlanner.ts),
// which uses this as a consistency signal to gently nudge tomorrow's KP
// target up or down rather than staying stuck at an unrealistic number.
export function getRecentDailyGoalHistory(days: number): boolean[] {
  const out: boolean[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push(getDailyClaims(toDateKey(d)).includes("dailyGoal"));
  }
  return out;
}

export type ClaimResult = {
  awarded: boolean;
  kpAwarded: number;
  totalKP: number;
  leveledUp: boolean;
  fromLevel: number;
  toLevel: number;
  newlyUnlockedAchievements: string[];
};

function claim(id: string, kp: number, updateStats: (s: Stats) => Stats, activityDelta: Partial<DailyActivity> = {}): ClaimResult {
  const today = toDateKey(new Date());
  const beforeTotal = getTotalKP();
  const beforeLevel = getLevelInfo(beforeTotal).level;
  if (typeof window === "undefined" || getDailyClaims(today).includes(id)) {
    return { awarded: false, kpAwarded: 0, totalKP: beforeTotal, leveledUp: false, fromLevel: beforeLevel, toLevel: beforeLevel, newlyUnlockedAchievements: [] };
  }
  addDailyClaim(today, id);
  saveStats(updateStats(getStats()));
  bumpDailyActivity(activityDelta);
  const totalKP = addKP(kp);
  const toLevel = getLevelInfo(totalKP).level;
  const achievements = getAchievements();
  return {
    awarded: true,
    kpAwarded: kp,
    totalKP,
    leveledUp: toLevel > beforeLevel,
    fromLevel: beforeLevel,
    toLevel,
    newlyUnlockedAchievements: achievements.filter(a => a.justUnlocked).map(a => a.id)
  };
}

function claimMilestone(id: "streak7" | "streak30", kp: number): ClaimResult {
  const milestones = getMilestones();
  const beforeTotal = getTotalKP();
  const beforeLevel = getLevelInfo(beforeTotal).level;
  if (milestones[id]) {
    return { awarded: false, kpAwarded: 0, totalKP: beforeTotal, leveledUp: false, fromLevel: beforeLevel, toLevel: beforeLevel, newlyUnlockedAchievements: [] };
  }
  saveMilestones({ ...milestones, [id]: true });
  const totalKP = addKP(kp);
  const toLevel = getLevelInfo(totalKP).level;
  const achievements = getAchievements();
  return {
    awarded: true,
    kpAwarded: kp,
    totalKP,
    leveledUp: toLevel > beforeLevel,
    fromLevel: beforeLevel,
    toLevel,
    newlyUnlockedAchievements: achievements.filter(a => a.justUnlocked).map(a => a.id)
  };
}

function checkStreakMilestones() {
  const streak = getStreak();
  if (streak >= 7) claimMilestone("streak7", 100);
  if (streak >= 30) claimMilestone("streak30", 500);
}

export function claimStudySession(): ClaimResult {
  return claim("studySession", 25, s => ({ ...s, studySessions: s.studySessions + 1, studyMinutes: s.studyMinutes + 30, longestSessionMinutes: Math.max(s.longestSessionMinutes, 30) }), { minutes: 30 });
}

// Auto-claimed (see ensureFlashcards100Claimed below), not a manual
// self-report: purely the +40 KP threshold bonus, with no activity/stat
// side effects of its own—the real flashcard count and lifetime stat that
// got the student to 100 today were already recorded by whatever real event
// (logFlashcards, awardFlashcardReviewKP) triggered this.
export function claimFlashcards100(): ClaimResult {
  return claim("flashcards100", 40, s => s);
}

// Fires the moment today's real flashcard count (every real source that
// already feeds getTodayActivity().flashcards) reaches 100. Safe to call
// from every flashcard event: claim()'s own once-per-day guard makes this a
// no-op once today's bonus is already claimed.
export function ensureFlashcards100Claimed(): void {
  if (getTodayActivity().flashcards >= 100) claimFlashcards100();
}

// Auto-claimed from a real AI-generated quiz completion (see the Quizzes
// page)—purely the +35 KP daily bonus. No stat/activity side effects here
// either: logQuiz() already records the real aiQuizzesCompleted/quizScores
// stats and today's quiz count for the same completion event.
export function claimAIQuiz(): ClaimResult {
  return claim("aiQuiz", 35, s => s);
}

export function claimDailyGoal(): ClaimResult {
  return claim("dailyGoal", 50, s => s);
}

// kp defaults to 30 (the old fixed reward) for any other caller, but the
// Daily Medical Case flow passes a variable amount from
// lib/clinicalCases.ts's getCaseRewardKP—same once-per-day claim id/gating
// as before, just no longer a flat reward.
export function claimClinicalCase(kp: number = 30): ClaimResult {
  return claim("clinicalCase", kp, s => ({ ...s, casesCompleted: s.casesCompleted + 1 }));
}

export function claimTerminologyGoal(): ClaimResult {
  return claim("termsReviewed", 20, s => s);
}

// Awards KP for completing a Learning Path lesson. Unlike the daily rewards above,
// this isn't capped to once per day—each lesson you finish earns its own KP.
export function awardLessonKP(kp: number): ClaimResult {
  const beforeTotal = getTotalKP();
  const beforeLevel = getLevelInfo(beforeTotal).level;
  bumpDailyActivity({ lessons: 1 });
  const totalKP = addKP(kp);
  const toLevel = getLevelInfo(totalKP).level;
  const achievements = getAchievements();
  return {
    awarded: true,
    kpAwarded: kp,
    totalKP,
    leveledUp: toLevel > beforeLevel,
    fromLevel: beforeLevel,
    toLevel,
    newlyUnlockedAchievements: achievements.filter(a => a.justUnlocked).map(a => a.id)
  };
}

// Awards KP for a Simple Smart Flashcard Review System answer
// (lib/spacedRepetitionCore.ts's kpForReviewOutcome decides the amount, 0
// for a wrong answer never even calls this). Same uncapped-per-event shape
// as awardLessonKP above—reviews happen many times per session, unlike the
// once-a-day claim* rewards further up this file—just bumping `flashcards`
// in the daily activity log instead of `lessons`, since that's what this
// event actually is.
export function awardFlashcardReviewKP(kp: number): ClaimResult {
  const beforeTotal = getTotalKP();
  const beforeLevel = getLevelInfo(beforeTotal).level;
  bumpDailyActivity({ flashcards: 1 });
  ensureFlashcards100Claimed();
  const totalKP = addKP(kp);
  const toLevel = getLevelInfo(totalKP).level;
  const achievements = getAchievements();
  return {
    awarded: true,
    kpAwarded: kp,
    totalKP,
    leveledUp: toLevel > beforeLevel,
    fromLevel: beforeLevel,
    toLevel,
    newlyUnlockedAchievements: achievements.filter(a => a.justUnlocked).map(a => a.id)
  };
}

// ---- Achievements ----

export type AchievementContext = { stats: Stats; totalKP: number; longestStreak: number };

export type AchievementDef = {
  id: string;
  title: string;
  requirement: string;
  comingSoon?: boolean;
  check: (ctx: AchievementContext) => boolean;
};

export const achievementDefs: AchievementDef[] = [
  { id: "firstSession", title: "First Study Session", requirement: "Complete your first study session.", check: ctx => ctx.stats.studySessions >= 1 },
  { id: "streak7Days", title: "7-Day Streak", requirement: "Reach a 7-day study streak.", check: ctx => ctx.longestStreak >= 7 },
  { id: "flashcards1000", title: "1,000 Flashcards", requirement: "Complete 1,000 flashcards.", check: ctx => ctx.stats.flashcardsCompleted >= 1000 },
  { id: "sessions100", title: "100 Study Sessions", requirement: "Complete 100 study sessions.", check: ctx => ctx.stats.studySessions >= 100 },
  { id: "kp10000", title: "10,000 KP Earned", requirement: "Earn 10,000 lifetime Knowledge Points.", check: ctx => ctx.totalKP >= 10000 },
  { id: "perfectQuiz", title: "Perfect Quiz Score", requirement: "Score 100% on an AI quiz.", check: ctx => ctx.stats.quizScores.some(s => s >= 100) },
  { id: "anatomyMaster", title: "Anatomy Master", requirement: "Coming soon—subject-level tracking isn't built yet.", comingSoon: true, check: () => false },
  { id: "cardiologyExpert", title: "Cardiology Expert", requirement: "Coming soon—subject-level tracking isn't built yet.", comingSoon: true, check: () => false }
];

export type Achievement = { id: string; title: string; requirement: string; comingSoon?: boolean; unlocked: boolean; justUnlocked: boolean };

function getStoredAchievements(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getAchievements(): Achievement[] {
  const ctx: AchievementContext = { stats: getStats(), totalKP: getTotalKP(), longestStreak: getLongestStreak() };
  const stored = getStoredAchievements();
  const next: Record<string, boolean> = { ...stored };
  const result = achievementDefs.map(def => {
    const wasUnlocked = !!stored[def.id];
    const isUnlocked = wasUnlocked || def.check(ctx);
    next[def.id] = isUnlocked;
    return { id: def.id, title: def.title, requirement: def.requirement, comingSoon: def.comingSoon, unlocked: isUnlocked, justUnlocked: isUnlocked && !wasUnlocked };
  });
  if (typeof window !== "undefined") localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(next));
  return result;
}

// Real admin override: genuinely grants/revokes an achievement for this
// browser by writing the same ACHIEVEMENTS_KEY getAchievements() reads—
// useful for QA-ing the unlock UI without grinding out the real requirement.
export function setAchievementOverride(id: string, unlocked: boolean) {
  if (typeof window === "undefined") return;
  const stored = getStoredAchievements();
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify({ ...stored, [id]: unlocked }));
}

// ---- Visits ----
// Visiting earns a small "Daily Login" bonus, but no longer extends your streak on its own—
// only completing today's Study Plan goals does (see checkStudyPlanCompletion).

export function recordVisit() {
  if (typeof window === "undefined") return;
  const days = new Set(getActiveDays());
  days.add(toDateKey(new Date()));
  localStorage.setItem(ACTIVE_DAYS_KEY, JSON.stringify(Array.from(days)));
  claim("dailyLogin", 10, s => s);
}
