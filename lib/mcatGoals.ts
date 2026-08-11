// Real, persisted MCAT test-date and target-score settings—no fabricated
// "Jan 15 / 518" placeholders. Same shape as every other small settings
// store in this app: one localStorage key, real getters/setters, a change
// event for live UI updates.

export type McatGoals = {
  testDate: string | null; // yyyy-mm-dd
  targetScore: number | null; // 472-528, the real MCAT scale
};

const KEY = "studium_mcat_goals";
export const MCAT_GOALS_EVENT = "studium:mcatGoalsChange";

const DEFAULT_GOALS: McatGoals = { testDate: null, targetScore: null };

export function getMcatGoals(): McatGoals {
  if (typeof window === "undefined") return DEFAULT_GOALS;
  const raw = localStorage.getItem(KEY);
  return raw ? { ...DEFAULT_GOALS, ...JSON.parse(raw) } : DEFAULT_GOALS;
}

export function setMcatGoals(updates: Partial<McatGoals>) {
  if (typeof window === "undefined") return;
  const next = { ...getMcatGoals(), ...updates };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(MCAT_GOALS_EVENT));
}

export function getDaysUntilTestDate(goals: McatGoals): number | null {
  if (!goals.testDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(goals.testDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}
