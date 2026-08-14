// Community achievements—same PassportAchievementDef/rarity/category
// *types* as lib/achievements.ts (imported, not redefined), but computed
// from real Supabase data (public.community_reputation, see
// supabase/migrations/0004_community.sql) instead of localStorage. Kept as
// its own async module rather than folded into lib/achievements.ts's
// synchronous engine, so every existing local-achievement caller keeps
// working completely unchanged.
//
// The spec's five example achievements name three real underlying metrics
// (discussions started, times an answer was marked helpful, times an
// answer was the accepted answer)—"Helpful Student"/"Community Scholar"
// are a tier on helpful-marks, "Medical Mentor" is mapped to accepted
// answers specifically (a stronger trust signal than a helpful mark), so
// all five are genuinely distinct rather than three copies of one number.
import { AchievementCategory, PassportAchievement, PassportAchievementDef } from "./achievements";
import { CommunityReputation, fetchReputation } from "./community";
import { createClient } from "./supabase/client";

const CATEGORY: AchievementCategory = "community";

type CommunityAchievementDef = Omit<PassportAchievementDef, "check"> & { check: (rep: CommunityReputation) => boolean };

const communityAchievementDefs: CommunityAchievementDef[] = [
  {
    id: "community0", category: CATEGORY, icon: "messagesSquare",
    title: "First Contribution", description: "Created your first discussion.",
    requirement: "Create 1 discussion", rarity: "common",
    check: rep => rep.discussionsStarted >= 1
  },
  {
    id: "community1", category: CATEGORY, icon: "handHeart",
    title: "Helpful Student", description: "Received 25 helpful-answer votes.",
    requirement: "Get 25 answers marked helpful", rarity: "uncommon",
    check: rep => rep.helpfulAnswers >= 25
  },
  {
    id: "community2", category: CATEGORY, icon: "handHeart",
    title: "Community Scholar", description: "Received 100 helpful-answer votes.",
    requirement: "Get 100 answers marked helpful", rarity: "epic",
    check: rep => rep.helpfulAnswers >= 100
  },
  {
    id: "community3", category: CATEGORY, icon: "stethoscope",
    title: "Medical Mentor", description: "Had 25 answers marked as the accepted answer.",
    requirement: "Get 25 accepted answers", rarity: "rare",
    check: rep => rep.acceptedAnswers >= 25
  },
  {
    id: "community4", category: CATEGORY, icon: "messagesSquare",
    title: "Discussion Starter", description: "Created 50 discussions.",
    requirement: "Create 50 discussions", rarity: "legendary",
    check: rep => rep.discussionsStarted >= 50
  }
];

const STORAGE_KEY = "studium_community_achievements";
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

// Real reputation lives in Supabase (shared across devices/browsers by
// nature—it's about what OTHER students did), but the "when did I first
// cross this threshold" timestamp is still only knowable locally, the same
// documented limitation lib/achievements.ts already discloses. If a
// student never opens Studium after crossing a threshold, this simply
// never gets a chance to stamp a date—still correctly "unlocked" via the
// live check, just without a precise date until the app runs again.
export async function getCommunityAchievements(): Promise<PassportAchievement[]> {
  const rep = await fetchCurrentUserReputation();
  if (!rep) return communityAchievementDefs.map(def => ({ ...def, check: () => false, unlocked: false, unlockedAt: null }));

  const store = readStore();
  let changed = false;

  const result: PassportAchievement[] = communityAchievementDefs.map(def => {
    const isUnlocked = def.check(rep);
    const existing = store[def.id];
    if (isUnlocked && !existing) {
      store[def.id] = { unlockedAt: new Date().toISOString() };
      changed = true;
    }
    return { ...def, check: () => isUnlocked, unlocked: isUnlocked, unlockedAt: isUnlocked ? (store[def.id]?.unlockedAt ?? null) : null };
  });

  if (changed) writeStore(store);
  return result;
}

async function fetchCurrentUserReputation(): Promise<CommunityReputation | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return fetchReputation(user.id);
}
