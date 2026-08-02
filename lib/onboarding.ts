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

export function saveUser(name: string, email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify({ name, email }));
  localStorage.removeItem(COMPLETE_KEY);
  localStorage.removeItem(ANSWERS_KEY);
}

export function getUser(): { name: string; email: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
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
