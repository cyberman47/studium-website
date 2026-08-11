// Real, localStorage-backed feature flags—no remote config service exists,
// so these can't gate a server response, but they genuinely gate what THIS
// browser's UI renders. Toggling one in the admin Feature Management tab
// takes effect immediately, live, wherever a component actually checks it
// (see app/dashboard/(main)/layout.tsx for the one currently wired in).

export type FeatureFlagDef = {
  id: string;
  label: string;
  description: string;
  wiredInto: string; // honest note on what actually reads this flag today
};

export const featureFlagDefs: FeatureFlagDef[] = [
  { id: "ai_tutor_nav", label: "Studium AI nav link", description: "Show the 'Studium AI' item in the student sidebar.", wiredInto: "app/dashboard/(main)/layout.tsx — real, hides/shows the nav link" },
  { id: "beta_word_builder", label: "Word Builder (beta)", description: "Mark the Word Builder tool as a beta feature with a badge.", wiredInto: "app/dashboard/(main)/terminology/page.tsx — real, shows a Beta badge" },
  { id: "admin_case_editor", label: "Clinical Case editor", description: "Allow creating/editing custom clinical cases from the admin panel.", wiredInto: "app/admin/cases — real, hides Create/Edit actions when off" }
];

const FLAGS_KEY = "studium_feature_flags";
export const FEATURE_FLAGS_EVENT = "studium:featureFlagsChange";

function getOverrides(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(FLAGS_KEY);
  return raw ? JSON.parse(raw) : {};
}

// Every flag defaults to enabled unless explicitly turned off—so a fresh
// browser with no admin visits yet sees the full app, not a stripped one.
export function isFlagEnabled(id: string): boolean {
  const overrides = getOverrides();
  return overrides[id] ?? true;
}

export function setFlagEnabled(id: string, enabled: boolean) {
  if (typeof window === "undefined") return;
  const next = { ...getOverrides(), [id]: enabled };
  localStorage.setItem(FLAGS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(FEATURE_FLAGS_EVENT));
}

export function getAllFlags(): (FeatureFlagDef & { enabled: boolean })[] {
  return featureFlagDefs.map(f => ({ ...f, enabled: isFlagEnabled(f.id) }));
}

// ---- App version ----
// Read-only, honest: there's no deploy pipeline here to "control" a version
// against, so this section just surfaces the real static version string
// rather than pretending to manage releases.
export const APP_VERSION = "0.1.0";
