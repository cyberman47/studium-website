// AI Management config layer. Real, persisted, editable without touching
// app code—but honest about its current reach: /dashboard/ai-tutor has no
// live model connected (it's an explicit "isn't connected yet" placeholder
// today), so nothing here drives real AI output yet. This is the config
// surface a real integration would read from once one exists, built now so
// that day-one integration is "point the tutor at these settings" instead
// of another ground-up build.

export type PromptTemplate = {
  id: string;
  name: string;
  scenario: string; // e.g. "Term explanation", "Case hint"
  template: string; // may contain {{term}}, {{case}} etc as placeholders
  createdAt: string;
};

export type AiSettings = {
  tone: "concise" | "encouraging" | "clinical";
  explanationLength: "short" | "medium" | "long";
  allowHints: boolean;
};

const PROMPTS_KEY = "studium_ai_prompts";
const SETTINGS_KEY = "studium_ai_settings";
export const AI_CONFIG_EVENT = "studium:aiConfigChange";

const defaultSettings: AiSettings = { tone: "encouraging", explanationLength: "medium", allowHints: true };

export function getAiSettings(): AiSettings {
  if (typeof window === "undefined") return defaultSettings;
  const raw = localStorage.getItem(SETTINGS_KEY);
  return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
}

export function setAiSettings(settings: Partial<AiSettings>) {
  if (typeof window === "undefined") return;
  const next = { ...getAiSettings(), ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(AI_CONFIG_EVENT));
}

function readPrompts(): PromptTemplate[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PROMPTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getPromptTemplates(): PromptTemplate[] {
  return readPrompts();
}

export function addPromptTemplate(input: Omit<PromptTemplate, "id" | "createdAt">): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.name.trim()) return { ok: false, error: "Name is required." };
  if (!input.template.trim()) return { ok: false, error: "Template text is required." };
  const t: PromptTemplate = { ...input, id: `prompt-${Date.now()}`, createdAt: new Date().toISOString() };
  localStorage.setItem(PROMPTS_KEY, JSON.stringify([...readPrompts(), t]));
  window.dispatchEvent(new CustomEvent(AI_CONFIG_EVENT));
  return { ok: true };
}

export function removePromptTemplate(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(readPrompts().filter(p => p.id !== id)));
  window.dispatchEvent(new CustomEvent(AI_CONFIG_EVENT));
}
