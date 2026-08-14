// The Studium Passport's achievement engine. Deliberately additive to, and
// independent from, lib/progress.ts's own small achievementDefs/
// getAchievements() (untouched—that's a different, already-shipped
// mechanism: an unlock toast tied directly to KP-claim actions, read by
// components elsewhere in the app via ClaimResult.newlyUnlockedAchievements).
// This is the richer, categorized, rarity-tiered system the Passport page
// needs: ~25 real achievements across 6 categories, every one computed from
// data Studium already tracks elsewhere—nothing here is a second data
// store, only a new lens on existing real numbers, and nothing is ever
// hand-set to "unlocked."

import { getLongestStreak, getStats, getTotalKP, Stats } from "./progress";
import { getOverallAccuracy, OverallAccuracy } from "./practiceHistory";
import { getAllSubjectSignals, getRealSubjects, RealSubject, SubjectSignals } from "./studyPlanner";
import { getMasteredFlashcardsCount } from "./flashcardLibrary";

export type AchievementRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
// "community" added for lib/communityAchievements.ts—that module reuses
// these shared types rather than redefining its own, since it's Supabase-
// sourced (async) instead of local, so it lives as a separate module, not
// inside this file's synchronous engine.
export type AchievementCategory = "knowledge" | "studying" | "flashcards" | "questions" | "medicalKnowledge" | "clinical" | "community";

export const categoryLabels: Record<AchievementCategory, string> = {
  knowledge: "Knowledge",
  studying: "Studying",
  flashcards: "Flashcards",
  questions: "Questions",
  medicalKnowledge: "Medical Knowledge",
  clinical: "Clinical",
  community: "Community"
};

export const rarityLabels: Record<AchievementRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary"
};

export type AchievementContext = {
  totalKP: number;
  longestStreak: number;
  stats: Stats;
  accuracy: OverallAccuracy;
  masteredFlashcards: number;
  subjectSignals: SubjectSignals[];
};

function getAchievementContext(): AchievementContext {
  return {
    totalKP: getTotalKP(),
    longestStreak: getLongestStreak(),
    stats: getStats(),
    accuracy: getOverallAccuracy(),
    masteredFlashcards: getMasteredFlashcardsCount(),
    subjectSignals: getAllSubjectSignals()
  };
}

export type PassportAchievementDef = {
  id: string;
  category: AchievementCategory;
  icon: string; // resolved to a lucide component by the UI layer's icon map—kept a plain string so this file stays framework-free
  title: string;
  description: string;
  requirement: string;
  rarity: AchievementRarity;
  check: (ctx: AchievementContext) => boolean;
};

export type PassportAchievement = PassportAchievementDef & { unlocked: boolean; unlockedAt: string | null };

// ---- Tiered-family helper ----
// Most of this list is "same real metric, escalating threshold, escalating
// rarity"—expressed once per family instead of five hand-written
// near-duplicate defs, so adding a new tier later is a one-line addition,
// not a rewrite (per the spec's "clean, scalable architecture" ask).
type Tier = { threshold: number; rarity: AchievementRarity; title: string; description: string; requirement: string };

function tieredFamily(idPrefix: string, category: AchievementCategory, icon: string, metric: (ctx: AchievementContext) => number, tiers: Tier[]): PassportAchievementDef[] {
  return tiers.map((t, i) => ({
    id: `${idPrefix}${i}`,
    category, icon,
    title: t.title, description: t.description, requirement: t.requirement, rarity: t.rarity,
    check: (ctx: AchievementContext) => metric(ctx) >= t.threshold
  }));
}

// ---- Knowledge — lib/progress.ts's real lifetime KP total ----
const knowledgeAchievements = tieredFamily("knowledge", "knowledge", "star", ctx => ctx.totalKP, [
  { threshold: 1000, rarity: "common", title: "1,000 Knowledge Points", description: "Earned 1,000 lifetime Knowledge Points.", requirement: "Reach 1,000 KP" },
  { threshold: 5000, rarity: "uncommon", title: "5,000 Knowledge Points", description: "Earned 5,000 lifetime Knowledge Points.", requirement: "Reach 5,000 KP" },
  { threshold: 10000, rarity: "rare", title: "10,000 Knowledge Points", description: "Earned 10,000 lifetime Knowledge Points.", requirement: "Reach 10,000 KP" },
  { threshold: 25000, rarity: "epic", title: "25,000 Knowledge Points", description: "Earned 25,000 lifetime Knowledge Points.", requirement: "Reach 25,000 KP" },
  { threshold: 50000, rarity: "legendary", title: "50,000 Knowledge Points", description: "Earned 50,000 lifetime Knowledge Points.", requirement: "Reach 50,000 KP" }
]);

// ---- Studying — real study-session count + real longest streak ----
const studyingAchievements: PassportAchievementDef[] = [
  { id: "studying0", category: "studying", icon: "bookOpen", title: "First Study Session", description: "Completed your first study session.", requirement: "Complete 1 study session", rarity: "common", check: ctx => ctx.stats.studySessions >= 1 },
  ...tieredFamily("streak", "studying", "flame", ctx => ctx.longestStreak, [
    { threshold: 7, rarity: "uncommon", title: "7-Day Streak", description: "Studied 7 days in a row.", requirement: "Reach a 7-day streak" },
    { threshold: 30, rarity: "rare", title: "30-Day Streak", description: "Studied 30 days in a row.", requirement: "Reach a 30-day streak" },
    { threshold: 100, rarity: "epic", title: "100-Day Streak", description: "Studied 100 days in a row.", requirement: "Reach a 100-day streak" }
  ]),
  { id: "studying1", category: "studying", icon: "graduationCap", title: "100 Study Sessions", description: "Completed 100 study sessions.", requirement: "Complete 100 study sessions", rarity: "rare", check: ctx => ctx.stats.studySessions >= 100 }
];

// ---- Flashcards — real lifetime mastered-card count (lib/flashcardLibrary.ts) ----
const flashcardAchievements = tieredFamily("flashcards", "flashcards", "layers", ctx => ctx.masteredFlashcards, [
  { threshold: 100, rarity: "common", title: "Master 100 Flashcards", description: "Mastered 100 flashcards across your library.", requirement: "Master 100 flashcards" },
  { threshold: 500, rarity: "uncommon", title: "Master 500 Flashcards", description: "Mastered 500 flashcards across your library.", requirement: "Master 500 flashcards" },
  { threshold: 1000, rarity: "rare", title: "Master 1,000 Flashcards", description: "Mastered 1,000 flashcards across your library.", requirement: "Master 1,000 flashcards" },
  { threshold: 5000, rarity: "legendary", title: "Master 5,000 Flashcards", description: "Mastered 5,000 flashcards across your library.", requirement: "Master 5,000 flashcards" }
]);

// ---- Questions — real lifetime practice-attempt log (lib/practiceHistory.ts) ----
// Accuracy milestones are gated on a minimum sample size so a lucky
// 2-for-2 can't unlock "90% Accuracy"—disclosed directly in the
// requirement text rather than hidden.
const MIN_ACCURACY_SAMPLE = 20;
const questionsAchievements: PassportAchievementDef[] = [
  ...tieredFamily("questionsCount", "questions", "clipboardCheck", ctx => ctx.accuracy.total, [
    { threshold: 100, rarity: "common", title: "Answer 100 Questions", description: "Answered 100 practice questions.", requirement: "Answer 100 questions" },
    { threshold: 1000, rarity: "rare", title: "Answer 1,000 Questions", description: "Answered 1,000 practice questions.", requirement: "Answer 1,000 questions" }
  ]),
  { id: "questionsAcc0", category: "questions", icon: "target", title: "80% Accuracy", description: "Reached 80% question accuracy.", requirement: `80%+ accuracy over at least ${MIN_ACCURACY_SAMPLE} questions`, rarity: "uncommon", check: ctx => ctx.accuracy.total >= MIN_ACCURACY_SAMPLE && ctx.accuracy.percent >= 80 },
  { id: "questionsAcc1", category: "questions", icon: "target", title: "90% Accuracy", description: "Reached 90% question accuracy.", requirement: `90%+ accuracy over at least ${MIN_ACCURACY_SAMPLE} questions`, rarity: "epic", check: ctx => ctx.accuracy.total >= MIN_ACCURACY_SAMPLE && ctx.accuracy.percent >= 90 }
];

// ---- Medical Knowledge — dynamic, one per real authored subject ----
// Generated from lib/studyPlanner.ts's getRealSubjects()—the same "only
// subjects with real authored lesson content count" boundary the Study
// Planner already uses—NOT a hardcoded subject list. Today that's just
// "Biology" (the only subject with authored MCAT lessons right now); this
// family grows on its own, with zero code changes, the moment more lesson
// content is authored. Every real subject appears here even before it's
// mastered (locked/muted), matching the spec's "students should see what
// they can work toward."
const realSubjectsForAchievements: RealSubject[] = getRealSubjects();

const medicalKnowledgeAchievements: PassportAchievementDef[] = realSubjectsForAchievements.map(subject => ({
  id: `medicalKnowledge:${subject.subjectId}`,
  category: "medicalKnowledge",
  icon: "brain",
  title: `Master ${subject.subjectName}`,
  description: `Reached Mastered status in ${subject.subjectName}—strong lesson completion together with real practice accuracy.`,
  requirement: `Reach Mastered status in ${subject.subjectName}`,
  rarity: "rare",
  check: ctx => ctx.subjectSignals.find(s => s.subject.subjectId === subject.subjectId)?.masteryStatus === "Mastered"
}));

// ---- Clinical — real lifetime medical-case completions (lib/progress.ts's Stats.casesCompleted) ----
const clinicalAchievements = tieredFamily("clinical", "clinical", "stethoscope", ctx => ctx.stats.casesCompleted, [
  { threshold: 10, rarity: "common", title: "Complete 10 Medical Cases", description: "Solved 10 clinical vignettes.", requirement: "Complete 10 medical cases" },
  { threshold: 50, rarity: "rare", title: "Complete 50 Medical Cases", description: "Solved 50 clinical vignettes.", requirement: "Complete 50 medical cases" },
  { threshold: 100, rarity: "legendary", title: "Complete 100 Medical Cases", description: "Solved 100 clinical vignettes.", requirement: "Complete 100 medical cases" }
]);

function getAllAchievementDefs(): PassportAchievementDef[] {
  return [
    ...knowledgeAchievements,
    ...studyingAchievements,
    ...flashcardAchievements,
    ...questionsAchievements,
    ...medicalKnowledgeAchievements,
    ...clinicalAchievements
  ];
}

// ---- Storage ----
// Deliberately a new key, separate from lib/progress.ts's own
// ACHIEVEMENTS_KEY (studium_achievements)—different shape (this one carries
// a real unlockedAt timestamp per id), and keeping them apart means this
// new system can't accidentally corrupt or migrate the older, still-in-use
// one.
const STORAGE_KEY = "studium_passport_achievements";
type StoredRecord = Record<string, { unlockedAt: string }>;

function readStore(): StoredRecord {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeStore(store: StoredRecord) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export const PASSPORT_ACHIEVEMENTS_EVENT = "studium:passportAchievementsChange";

// Computes live unlock state for every real (and dynamically-generated)
// achievement, and persists a real unlockedAt the first time each one is
// detected true—the same "compute live, stamp on first true" pattern
// lib/progress.ts's own getAchievements() already uses. Caveat, surfaced in
// the Passport's own UI copy rather than hidden: the stamped date reflects
// when Studium *detected* the achievement (i.e. the next time this ran),
// not necessarily the exact historical moment it became true—there's no
// historical event log to derive that from.
export function getPassportAchievements(): PassportAchievement[] {
  const ctx = getAchievementContext();
  const defs = getAllAchievementDefs();
  const store = readStore();
  let changed = false;

  const result: PassportAchievement[] = defs.map(def => {
    const isUnlocked = def.check(ctx);
    const existing = store[def.id];
    if (isUnlocked && !existing) {
      store[def.id] = { unlockedAt: new Date().toISOString() };
      changed = true;
    }
    return { ...def, unlocked: isUnlocked, unlockedAt: isUnlocked ? (store[def.id]?.unlockedAt ?? null) : null };
  });

  if (changed) {
    writeStore(store);
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(PASSPORT_ACHIEVEMENTS_EVENT));
  }
  return result;
}
