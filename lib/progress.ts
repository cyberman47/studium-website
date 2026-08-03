const ACTIVE_DAYS_KEY = "studium_active_days";
const STREAK_DAYS_KEY = "studium_streak_days";
const KP_KEY = "studium_kp";
const LONGEST_STREAK_KEY = "studium_longest_streak";
const STATS_KEY = "studium_lifetime_stats";
const DAILY_ACTIVITY_KEY = "studium_daily_activity";
const DAILY_REWARDS_KEY = "studium_daily_rewards";
const MILESTONE_KEY = "studium_milestone_rewards";
const ACHIEVEMENTS_KEY = "studium_achievements";
const STUDY_PLAN_KEY = "studium_study_plan";

const KP_PER_DAY = 10;

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

export function getStreak(): number {
  const days = new Set(getStreakDays());
  let streak = 0;
  const cursor = new Date();
  // if today isn't logged yet, start counting from yesterday
  if (!days.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(toDateKey(cursor))) {
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

export type WeekDay = { label: string; date: string; active: boolean; isToday: boolean };

export function getWeekLog(): WeekDay[] {
  const days = new Set(getStreakDays());
  const today = new Date();
  const monday = mondayOf(today);

  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = toDateKey(d);
    return { label, date: key, active: days.has(key), isToday: key === toDateKey(today) };
  });
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
  return total;
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
  casesCompleted: 0
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

export function getTotalHours(): number {
  return Math.round((getStats().studyMinutes / 60) * 10) / 10;
}

export function getAverageQuizScore(): number | null {
  const scores = getStats().quizScores;
  if (!scores.length) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ---- Daily activity (for weekly progress) ----

type DailyActivity = { minutes: number; flashcards: number; notes: number; aiChats: number; quizzes: number };
const emptyActivity: DailyActivity = { minutes: 0, flashcards: 0, notes: 0, aiChats: 0, quizzes: 0 };

function getDailyActivityMap(): Record<string, DailyActivity> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(DAILY_ACTIVITY_KEY);
  return raw ? JSON.parse(raw) : {};
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
    quizzes: current.quizzes + (delta.quizzes ?? 0)
  };
  localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(map));
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
  }
  return totals;
}

// ---- Study Plan ----
// Your streak is only kept alive by completing all three of today's Study Plan goals—
// simply visiting the app no longer counts (see recordVisit / checkStudyPlanCompletion).

export type StudyPlanGoals = { minutes: number; flashcards: number; quizzes: number };

const defaultStudyPlan: StudyPlanGoals = { minutes: 30, flashcards: 50, quizzes: 1 };

export function getStudyPlan(): StudyPlanGoals {
  if (typeof window === "undefined") return defaultStudyPlan;
  const raw = localStorage.getItem(STUDY_PLAN_KEY);
  return raw ? { ...defaultStudyPlan, ...JSON.parse(raw) } : defaultStudyPlan;
}

export function saveStudyPlan(goals: StudyPlanGoals) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STUDY_PLAN_KEY, JSON.stringify(goals));
}

export type StudyPlanProgress = {
  goals: StudyPlanGoals;
  minutes: number;
  flashcards: number;
  quizzes: number;
  minutesComplete: boolean;
  flashcardsComplete: boolean;
  quizzesComplete: boolean;
  complete: boolean;
};

export function getStudyPlanProgress(): StudyPlanProgress {
  const goals = getStudyPlan();
  const today = getDailyActivityMap()[toDateKey(new Date())] ?? emptyActivity;
  const minutesComplete = today.minutes >= goals.minutes;
  const flashcardsComplete = today.flashcards >= goals.flashcards;
  const quizzesComplete = today.quizzes >= goals.quizzes;
  return {
    goals,
    minutes: today.minutes,
    flashcards: today.flashcards,
    quizzes: today.quizzes,
    minutesComplete,
    flashcardsComplete,
    quizzesComplete,
    complete: minutesComplete && flashcardsComplete && quizzesComplete
  };
}

// Called after any activity is logged. If today's plan is now fully met, marks today
// as a streak day (once) and auto-claims the "Reach Daily Study Goal" reward.
function checkStudyPlanCompletion(): ClaimResult | null {
  const progress = getStudyPlanProgress();
  if (!progress.complete) return null;
  const today = toDateKey(new Date());
  const streakDays = new Set(getStreakDays());
  if (!streakDays.has(today)) {
    streakDays.add(today);
    if (typeof window !== "undefined") localStorage.setItem(STREAK_DAYS_KEY, JSON.stringify(Array.from(streakDays)));
    updateLongestStreak();
    checkStreakMilestones();
  }
  return claimDailyGoal();
}

export function logStudyMinutes(minutes: number): ClaimResult | null {
  if (typeof window === "undefined") return null;
  saveStats({ ...getStats(), studyMinutes: getStats().studyMinutes + minutes });
  bumpDailyActivity({ minutes });
  return checkStudyPlanCompletion();
}

export function logFlashcards(count: number): ClaimResult | null {
  if (typeof window === "undefined") return null;
  saveStats({ ...getStats(), flashcardsCompleted: getStats().flashcardsCompleted + count });
  bumpDailyActivity({ flashcards: count });
  return checkStudyPlanCompletion();
}

export function logQuiz(): ClaimResult | null {
  if (typeof window === "undefined") return null;
  const score = Math.floor(75 + Math.random() * 26); // 75-100
  const stats = getStats();
  saveStats({ ...stats, aiQuizzesCompleted: stats.aiQuizzesCompleted + 1, quizScores: [...stats.quizScores, score].slice(-50) });
  bumpDailyActivity({ quizzes: 1 });
  return checkStudyPlanCompletion();
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
  { id: "dailyGoal", title: "Reach Daily Study Goal", kp: 50, kind: "daily", description: "Complete all three of today's Study Plan goals. This is what keeps your streak alive." },
  { id: "clinicalCase", title: "Solve the Clinical Case of the Day", kp: 30, kind: "daily", description: "Work through today's clinical vignette." },
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
    streak7: milestones.streak7,
    streak30: milestones.streak30
  };
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

export function claimFlashcards100(): ClaimResult {
  return claim("flashcards100", 40, s => ({ ...s, flashcardsCompleted: s.flashcardsCompleted + 100 }), { flashcards: 100 });
}

export function claimAIQuiz(): ClaimResult {
  const score = Math.floor(75 + Math.random() * 26); // 75-100
  return claim("aiQuiz", 35, s => ({ ...s, aiQuizzesCompleted: s.aiQuizzesCompleted + 1, quizScores: [...s.quizScores, score].slice(-50) }), { quizzes: 1 });
}

export function claimDailyGoal(): ClaimResult {
  return claim("dailyGoal", 50, s => s);
}

export function claimClinicalCase(): ClaimResult {
  return claim("clinicalCase", 30, s => ({ ...s, casesCompleted: s.casesCompleted + 1 }));
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
