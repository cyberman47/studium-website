// The Passport page's aggregation layer—mirrors lib/medicalProfile.ts's
// role for the Progress page. No new localStorage keys of its own beyond
// what lib/achievements.ts already owns; every field here is composed from
// real getters that already exist elsewhere in the app.

import { getUser } from "./onboarding";
import { getLevelInfo, getTotalKP, LevelInfo } from "./progress";
import { getCurrentPathEmoji, getCurrentPathLabel, getMedicalProfile } from "./medicalProfile";
import { AchievementCategory, getPassportAchievements, PassportAchievement } from "./achievements";

export type PassportIdentity = {
  name: string;
  currentPathLabel: string;
  currentPathEmoji: string;
  totalKP: number;
  level: LevelInfo;
  achievementsUnlockedCount: number;
  achievementsTotalCount: number;
  topicsMasteredCount: number;
  questionAccuracyPercent: number | null;
  memberSince: string | null;
};

export function getPassportIdentity(): PassportIdentity {
  const user = getUser();
  const totalKP = getTotalKP();
  const achievements = getPassportAchievements();
  const profile = getMedicalProfile();

  return {
    name: user?.name?.trim() || "Student",
    currentPathLabel: getCurrentPathLabel(),
    currentPathEmoji: getCurrentPathEmoji(),
    totalKP,
    level: getLevelInfo(totalKP),
    achievementsUnlockedCount: achievements.filter(a => a.unlocked).length,
    achievementsTotalCount: achievements.length,
    topicsMasteredCount: profile.subjectsMasteredCount,
    questionAccuracyPercent: profile.questionAccuracyPercent,
    memberSince: user?.joinedAt ?? null
  };
}

export type PassportHistoryEntry = {
  id: string;
  date: string; // ISO
  icon: string;
  title: string;
  category: AchievementCategory;
};

// The Passport's chronological history IS the unlocked-achievement list,
// sorted by real unlockedAt—not a second, parallel "milestones" store.
// Legacy/undated entries (achievements unlocked before this system existed,
// or whose exact moment genuinely isn't known) sort last rather than being
// given a fabricated date.
export function getPassportHistory(limit?: number): PassportHistoryEntry[] {
  const unlocked = getPassportAchievements().filter((a): a is PassportAchievement & { unlockedAt: string } => a.unlocked && a.unlockedAt !== null);
  const sorted = unlocked.sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  const entries = sorted.map(a => ({ id: a.id, date: a.unlockedAt, icon: a.icon, title: a.title, category: a.category }));
  return limit ? entries.slice(0, limit) : entries;
}

export type ShareableSummary = {
  text: string;
  identity: PassportIdentity;
  topAchievements: PassportAchievement[];
};

// Pure data for the Share Passport action—clipboard/Web Share API calls
// live in the UI layer, not here. Built entirely from real local data
// (identity + real unlocked achievements, highest-rarity first); nothing
// fabricated for the sake of looking impressive.
export function getShareableSummary(): ShareableSummary {
  const identity = getPassportIdentity();
  const rarityRank: Record<string, number> = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
  const topAchievements = getPassportAchievements()
    .filter(a => a.unlocked)
    .sort((a, b) => rarityRank[b.rarity] - rarityRank[a.rarity])
    .slice(0, 5);

  const lines = [
    `${identity.name}'s Studium Passport`,
    identity.currentPathLabel,
    `${identity.totalKP.toLocaleString()} KP · Level ${identity.level.level} (${identity.level.name})`,
    `${identity.achievementsUnlockedCount} achievements · ${identity.topicsMasteredCount} topics mastered${identity.questionAccuracyPercent !== null ? ` · ${identity.questionAccuracyPercent}% accuracy` : ""}`,
    ...(topAchievements.length ? [`Top achievements: ${topAchievements.map(a => a.title).join(", ")}`] : [])
  ];

  return { text: lines.join("\n"), identity, topAchievements };
}
