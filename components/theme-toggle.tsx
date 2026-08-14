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

// Compact icon-button variant for tight spaces like the marketing nav bar—
// same real Light/Dark/System control as above, just a single button that
// opens a small dropdown instead of a 3-way segmented strip. Shows the
// icon for the *currently selected mode* (not the resolved light/dark),
// so picking "System" keeps showing the monitor icon even as the actual
// palette follows the OS.
export function ThemeToggleButton({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMode(getThemeMode());
    return watchSystemTheme();
  }, []);

  function handleSelect(next: ThemeMode) {
    setMode(next);
    setThemeMode(next);
    setOpen(false);
  }

  const current = options.find(o => o.mode === mode) ?? options[0];

  return <div className={`relative ${className}`}>
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      aria-label={`Theme: ${current.label}. Change theme`}
      aria-pressed={open}
      title="Theme"
      className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] text-slate-600 dark:text-slate-300 transition hover:border-teal-200 dark:hover:border-teal-500/30 hover:text-teal-600 dark:hover:text-teal-300"
    >
      <current.icon size={17} />
    </button>
    {open && <>
      <button type="button" aria-hidden="true" tabIndex={-1} className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-full z-20 mt-2 w-36 overflow-hidden rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] py-1.5 shadow-lift">
        {options.map(opt => <button
          key={opt.mode}
          type="button"
          onClick={() => handleSelect(opt.mode)}
          className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs font-bold transition hover:bg-slate-50 dark:hover:bg-white/5 ${opt.mode === mode ? "text-teal-600 dark:text-teal-300" : "text-slate-600 dark:text-slate-300"}`}
        >
          <opt.icon size={14} />{opt.label}
        </button>)}
      </div>
    </>}
  </div>;
}
