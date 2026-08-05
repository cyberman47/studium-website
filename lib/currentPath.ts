import { getOnboardingAnswers } from "./onboarding";

export type CurrentPathId = "medical-school" | "mcat" | "nursing" | "dentistry" | "pharmacy" | "biomedical-sciences" | "other";

export type CurrentPathDef = { id: CurrentPathId; label: string; href: string };

export const currentPathOptions: CurrentPathDef[] = [
  { id: "medical-school", label: "Medical School", href: "/dashboard/learning-paths/medical-school" },
  { id: "mcat", label: "MCAT Preparation", href: "/dashboard/learning-paths/mcat" },
  { id: "nursing", label: "Nursing", href: "/dashboard/learning-paths/nursing" },
  { id: "dentistry", label: "Dentistry", href: "/dashboard/learning-paths" },
  { id: "pharmacy", label: "Pharmacy", href: "/dashboard/learning-paths" },
  { id: "biomedical-sciences", label: "Biomedical Sciences", href: "/dashboard/learning-paths" },
  { id: "other", label: "Other", href: "/dashboard/learning-paths" }
];

export const currentPathLabels = currentPathOptions.map(p => p.label);

export const pathEmoji: Record<CurrentPathId, string> = {
  "medical-school": "🩺",
  mcat: "🧬",
  nursing: "👩‍⚕️",
  dentistry: "🦷",
  pharmacy: "💊",
  "biomedical-sciences": "🔬",
  other: "🗺️"
};

const CURRENT_PATH_KEY = "studium_current_learning_path";
export const CURRENT_PATH_EVENT = "studium:currentPathChange";

export function labelToPathId(label: string | null): CurrentPathId | null {
  return currentPathOptions.find(p => p.label === label)?.id ?? null;
}

export function findCurrentPathDef(id: CurrentPathId | null): CurrentPathDef | null {
  if (!id) return null;
  return currentPathOptions.find(p => p.id === id) ?? null;
}

function inferFromRole(): CurrentPathId | null {
  const role = getOnboardingAnswers()?.role;
  switch (role) {
    case "Medical Student": return "medical-school";
    case "Pre-Med Student": return "mcat";
    case "Nursing Student": return "nursing";
    case "Pharmacy Student": return "pharmacy";
    case "Dentistry Student": return "dentistry";
    default: return null;
  }
}

export function getCurrentPathId(): CurrentPathId | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CURRENT_PATH_KEY) as CurrentPathId | null;
  if (stored) return stored;
  return inferFromRole();
}

export function setCurrentPathId(id: CurrentPathId) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_PATH_KEY, id);
  window.dispatchEvent(new CustomEvent(CURRENT_PATH_EVENT, { detail: id }));
}
