import { getOnboardingAnswers } from "./onboarding";
import { createClient } from "./supabase/client";

export type CurrentPathId = "medical-school" | "mcat" | "nursing" | "dentistry" | "pharmacy" | "biomedical-sciences" | "other";

// Only MCAT has a fully authored curriculum today (real lesson bodies,
// mastery tracking, readiness scoring—see lib/mcatPath.ts/mcatConcepts.ts).
// Every downstream "Continue where you left off" surface (Dashboard,
// Learning Paths, Progress) reads this before showing MCAT-shaped content,
// so switching to Nursing/Dentistry/Pharmacy/Biomedical Sciences/Other
// never mislabels MCAT progress as if it belonged to that track—those
// tracks get an honest "still being built" state instead. Flip a track to
// `true` here the day its own real lesson content lands.
export const hasRealCurriculum: Record<CurrentPathId, boolean> = {
  mcat: true,
  "medical-school": false,
  nursing: false,
  dentistry: false,
  pharmacy: false,
  "biomedical-sciences": false,
  other: false
};

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

// Shared per-track "what to study next" links—one definition reused by both
// the Dashboard's Recommended Modules rail and Learning Paths' Recommended
// For You box, so the two surfaces can't drift into disagreeing with each
// other. Only medical-school/mcat/nursing get specific real destinations
// (they're the only tracks with an actual dedicated Learning Paths page—see
// currentPathOptions' hrefs above); every other track honestly points back
// at the general Learning Paths browse page rather than inventing a
// specific-sounding link to content that doesn't exist yet.
export const pathRecommendations: Record<CurrentPathId, { label: string; href: string }[]> = {
  "medical-school": [
    { label: "Cardiovascular Physiology", href: "/dashboard/learning-paths/medical-school/physiology" },
    { label: "Pharmacology Review", href: "/dashboard/learning-paths/medical-school/pharmacology" },
    { label: "Clinical Case: Heart Failure", href: "/dashboard/case-of-the-day" }
  ],
  mcat: [
    { label: "Cell Biology", href: "/dashboard/learning-paths/mcat/bio-biochem/biology" },
    { label: "Organic Chemistry", href: "/dashboard/learning-paths/mcat/chem-phys" },
    { label: "CARS Practice", href: "/dashboard/learning-paths/mcat/cars" }
  ],
  nursing: [
    { label: "Clinical Skills", href: "/dashboard/learning-paths/nursing/clinical-skills" },
    { label: "Pharmacology", href: "/dashboard/learning-paths/nursing/pharmacology" },
    { label: "NCLEX Preparation", href: "/dashboard/learning-paths/nursing/nclex-preparation" }
  ],
  dentistry: [{ label: "Browse Learning Paths", href: "/dashboard/learning-paths" }],
  pharmacy: [{ label: "Browse Learning Paths", href: "/dashboard/learning-paths" }],
  "biomedical-sciences": [{ label: "Browse Learning Paths", href: "/dashboard/learning-paths" }],
  other: [{ label: "Browse Learning Paths", href: "/dashboard/learning-paths" }]
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
  void pushEducationTrack(id);
}

// Real cross-device persistence, mirroring lib/leaderboardSync.ts's pattern:
// localStorage stays the fast, synchronous source of truth every existing
// call site already reads, and this pushes the same value up to the
// student's real profiles.education_track row (supabase/migrations/
// 0008_education_track.sql) whenever it changes. Best-effort and silent on
// failure/signed-out—switching tracks must never feel broken just because
// the network hiccuped or nobody's logged in yet.
async function pushEducationTrack(id: CurrentPathId): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ education_track: id }).eq("id", user.id);
  } catch {
    // Best-effort—local selection already applied above regardless.
  }
}

function isCurrentPathId(v: unknown): v is CurrentPathId {
  return typeof v === "string" && currentPathOptions.some(p => p.id === v);
}

// Hydrates this device's local selection from the student's real profile on
// sign-in/app load—what makes "log in on another device and see the same
// track" actually true, instead of every fresh browser silently falling
// back to the mcat/role-inferred default. Call once per app load (see
// components/dashboard-shell.tsx); no-ops (and returns null) when signed
// out, so local/onboarding-inferred state is left alone. Dispatches the
// same CURRENT_PATH_EVENT a manual switch does, so any already-mounted UI
// (the top-bar switcher, Dashboard, Learning Paths) picks it up live
// without needing a page reload.
export async function syncCurrentPathOnLoad(): Promise<CurrentPathId | null> {
  if (typeof window === "undefined") return null;
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from("profiles").select("education_track").eq("id", user.id).maybeSingle();
    if (error || !data) return null;
    const remote = (data as { education_track: string | null }).education_track;
    if (!isCurrentPathId(remote)) return null;
    const local = localStorage.getItem(CURRENT_PATH_KEY);
    if (local === remote) return remote;
    localStorage.setItem(CURRENT_PATH_KEY, remote);
    window.dispatchEvent(new CustomEvent(CURRENT_PATH_EVENT, { detail: remote }));
    return remote;
  } catch {
    return null;
  }
}
