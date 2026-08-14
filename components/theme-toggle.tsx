"use client";

// Real Light/Dark/System control—lib/theme.ts persists it and toggles
// Tailwind's "dark" class on <html>, so this genuinely changes the app's
// appearance, not a decorative switch. Styled as a compact 3-way segmented
// control (matches the pill-toggle idiom already used elsewhere, e.g. the
// Ask the Community post-type picker), meant to sit inside the account
// dropdown (components/dashboard-shell.tsx's UserMenu).
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { getThemeMode, setThemeMode, ThemeMode, watchSystemTheme } from "@/lib/theme";

const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "system", label: "System", icon: Monitor }
];

export function ThemeToggle() {
  // Defaults to "system" (the real fallback lib/theme.ts uses) so this
  // never flashes an incorrect selected state before mount corrects it.
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    setMode(getThemeMode());
    return watchSystemTheme();
  }, []);

  function handleSelect(next: ThemeMode) {
    setMode(next);
    setThemeMode(next);
  }

  return <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
    {options.map(opt => {
      const active = mode === opt.mode;
      return <button
        key={opt.mode}
        type="button"
        onClick={() => handleSelect(opt.mode)}
        aria-pressed={active}
        title={opt.label}
        className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition ${active ? "bg-white text-heading shadow-sm dark:bg-white/15 dark:text-white" : "text-slate-500 hover:text-heading dark:text-slate-400 dark:hover:text-white"}`}
      >
        <opt.icon size={13} />{opt.label}
      </button>;
    })}
  </div>;
}
