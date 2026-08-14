"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { ToggleRow } from "@/components/ui";
import { AppSettings, getAppSettings, saveAppSettings } from "@/lib/onboarding";

const sessionSizes = [10, 20, 30, 50];

export default function ReviewSettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setSettings(getAppSettings()); }, []);

  function update(patch: Partial<AppSettings>) {
    setSettings(s => {
      if (!s) return s;
      const next = { ...s, ...patch };
      saveAppSettings(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      return next;
    });
  }

  if (!settings) return null;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />App settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Review.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">How flashcards and practice questions behave during review.</p>

    <div className="mt-10 max-w-2xl">
      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight"><RotateCcw size={18} className="text-teal-600" />Review sessions</h2>

        <div className="mt-5">
          <span className="mb-2 block text-xs font-extrabold text-slate-600">Cards per session</span>
          <div className="flex gap-2">
            {sessionSizes.map(size => <button type="button" key={size} onClick={() => update({ cardsPerSession: size })} className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold transition ${settings.cardsPerSession === size ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-600 hover:border-teal-200"}`}>{size}</button>)}
          </div>
        </div>

        <div className="mt-5 divide-y divide-slate-100">
          <ToggleRow label="Show hints before answering" desc="A small nudge appears if you pause on a question." checked={settings.showHints} onChange={() => update({ showHints: !settings.showHints })} />
          <ToggleRow label="Auto-advance after correct answers" desc="Skip the tap and move straight to the next card." checked={settings.autoAdvance} onChange={() => update({ autoAdvance: !settings.autoAdvance })} />
        </div>
        {saved && <p className="mt-3 text-xs font-bold text-teal-600">Preferences saved</p>}
      </div>
    </div>
  </section>;
}
