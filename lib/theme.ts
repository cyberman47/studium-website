// Real theme state, not decorative: Light/Dark/System, persisted to
// localStorage and applied by toggling Tailwind's "dark" class on
// <html> (tailwind.config.ts's darkMode: "class"). The actual anti-flash
// script lives inline in app/layout.tsx's <head> (has to run before React
// hydrates, so it can't be this module)—this file is what every client
// component (the toggle itself, anything that needs to know the resolved
// theme) reads and writes after that.
export type ThemeMode = "light" | "dark" | "system";

const THEME_KEY = "studium_theme";
export const THEME_EVENT = "studium:themeChange";

export function getThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const raw = localStorage.getItem(THEME_KEY);
  // Falls back to "light", not "system"—a visitor who has never touched
  // the theme toggle always sees light mode, matching the anti-flash
  // script in app/layout.tsx. "System" is still a real, selectable option;
  // it just isn't the unstated default anymore.
  return raw === "light" || raw === "dark" || raw === "system" ? raw : "light";
}

export function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// What "system" actually resolves to right now—real OS-level preference,
// re-checked live rather than cached, since it can change while the app is open.
export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  return mode === "system" ? (getSystemPrefersDark() ? "dark" : "light") : mode;
}

function applyResolvedTheme(resolved: "light" | "dark") {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  // Also tells the browser itself (native scrollbars, form controls, the
  // "reader" UI, etc.) which palette to render, on top of Tailwind's class.
  document.documentElement.style.colorScheme = resolved;
}

export function setThemeMode(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, mode);
  applyResolvedTheme(resolveTheme(mode));
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: mode }));
}

// Keeps the applied theme correct if the OS preference changes while
// mode === "system" and the app is already open—matchMedia's own change
// event, not a poll. Returns the unsubscribe function.
export function watchSystemTheme(onChange?: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  function handler() {
    if (getThemeMode() === "system") applyResolvedTheme(resolveTheme("system"));
    onChange?.();
  }
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}
