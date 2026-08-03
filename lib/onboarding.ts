export type OnboardingAnswers = {
  role: string | null;
  goal: string | null;
  studyTime: string | null;
  studyMethods: string[];
  source: string | null;
};

const USER_KEY = "studium_user";
const ANSWERS_KEY = "studium_onboarding_answers";
const COMPLETE_KEY = "studium_onboarding_complete";

export const emptyAnswers: OnboardingAnswers = { role: null, goal: null, studyTime: null, studyMethods: [], source: null };

export const roleOptions = ["Medical Student", "Pre-Med Student", "Nursing Student", "Pharmacy Student", "Dentistry Student", "Graduate Student", "University Student", "Other"];
export const goalOptions = ["Pass Exams", "Learn Faster", "Stay Organized", "Improve My Grades", "Build Long-Term Knowledge"];
export const studyTimeOptions = ["Less than 30 minutes", "30–60 minutes", "1–2 hours", "2–4 hours", "More than 4 hours"];
export const studyMethodOptions = ["AI Tutor", "Flashcards", "Practice Questions", "Notes", "Mind Maps", "Videos"];
export const sourceOptions = ["Google", "TikTok", "Instagram", "YouTube", "Friend", "School", "Reddit", "Other"];

export type User = { name: string; email: string; username: string; avatar: string | null; joinedAt: string };

function defaultUsername(name: string, email: string): string {
  const base = (name || email.split("@")[0] || "student").toLowerCase().replace(/[^a-z0-9]+/g, "");
  return base || "student";
}

export function saveUser(name: string, email: string) {
  if (typeof window === "undefined") return;
  const user: User = { name, email, username: defaultUsername(name, email), avatar: null, joinedAt: new Date().toISOString() };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.removeItem(COMPLETE_KEY);
  localStorage.removeItem(ANSWERS_KEY);
}

export function updateUser(patch: Partial<User>) {
  if (typeof window === "undefined") return;
  const current = getUser();
  const next: User = { ...(current ?? { name: "", email: "", username: "", avatar: null, joinedAt: new Date().toISOString() }), ...patch };
  localStorage.setItem(USER_KEY, JSON.stringify(next));
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  return {
    name: parsed.name ?? "",
    email: parsed.email ?? "",
    username: parsed.username ?? defaultUsername(parsed.name ?? "", parsed.email ?? ""),
    avatar: parsed.avatar ?? null,
    joinedAt: parsed.joinedAt ?? new Date().toISOString()
  };
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COMPLETE_KEY) === "true";
}

export function completeOnboarding(answers: OnboardingAnswers) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  localStorage.setItem(COMPLETE_KEY, "true");
}

export function getOnboardingAnswers(): OnboardingAnswers | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ANSWERS_KEY);
  return raw ? JSON.parse(raw) : null;
}

export type Preferences = { dailyReminder: boolean; streakAlerts: boolean; weeklyEmail: boolean };
const PREFS_KEY = "studium_preferences";
const defaultPreferences: Preferences = { dailyReminder: true, streakAlerts: true, weeklyEmail: false };

export function getPreferences(): Preferences {
  if (typeof window === "undefined") return defaultPreferences;
  const raw = localStorage.getItem(PREFS_KEY);
  return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences;
}

export function savePreferences(prefs: Preferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export type AppSettings = {
  soundEffects: boolean;
  autoPlayVideos: boolean;
  compactMode: boolean;
  textSize: "Small" | "Medium" | "Large";
  darkReading: boolean;
  cardsPerSession: number;
  showHints: boolean;
  autoAdvance: boolean;
};
const APP_SETTINGS_KEY = "studium_app_settings";
const defaultAppSettings: AppSettings = {
  soundEffects: true,
  autoPlayVideos: false,
  compactMode: false,
  textSize: "Medium",
  darkReading: false,
  cardsPerSession: 20,
  showHints: true,
  autoAdvance: false
};

export function getAppSettings(): AppSettings {
  if (typeof window === "undefined") return defaultAppSettings;
  const raw = localStorage.getItem(APP_SETTINGS_KEY);
  return raw ? { ...defaultAppSettings, ...JSON.parse(raw) } : defaultAppSettings;
}

export function saveAppSettings(settings: AppSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
}
