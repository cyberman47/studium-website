// Real, persisted MCAT target-score setting—no fabricated "518" placeholder.
// Same shape as every other small settings store in this app: one
// localStorage key, real getters/setters, a change event for live UI
// updates. Used to own a test date too, but that's now owned by
// lib/studyPlanner.ts's ExamConfig (the Study Planner setup flow)—having
// two independent, unsynced exam-date stores was a real bug (the MCAT hub
// and the Study Planner could disagree on "days left"), so this file keeps
// only the score, which nothing else tracks.

export type McatGoals = {
  targetScore: number | null; // 472-528, the real MCAT scale
};

const KEY = "studium_mcat_goals";
export const MCAT_GOALS_EVENT = "studium:mcatGoalsChange";

const DEFAULT_GOALS: McatGoals = { targetScore: null };

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
