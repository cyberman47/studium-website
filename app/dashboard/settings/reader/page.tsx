"use client";

import { useEffect, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { ToggleRow } from "@/components/ui";
import { AppSettings, getAppSettings, saveAppSettings } from "@/lib/onboarding";

const textSizes: AppSettings["textSize"][] = ["Small", "Medium", "Large"];

export default function ReaderSettingsPage() {
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
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />App settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Reader.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Tune notes and lessons for comfortable, long study sessions.</p>

    <div className="mt-10 max-w-2xl">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight"><BookOpen size={18} className="text-teal-600" />Reading experience</h2>

        <div className="mt-5">
          <span className="mb-2 block text-xs font-extrabold text-slate-600">Text size</span>
          <div className="flex gap-2">
            {textSizes.map(size => <button type="button" key={size} onClick={() => update({ textSize: size })} className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold transition ${settings.textSize === size ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600 hover:border-teal-200"}`}>{size}</button>)}
          </div>
        </div>

        <div className="mt-5 divide-y divide-slate-100">
          <ToggleRow label="Dark reading mode" desc="Coming soon—Studium doesn't support dark mode yet." checked={settings.darkReading} onChange={() => update({ darkReading: !settings.darkReading })} />
        </div>
        {saved && <p className="mt-3 text-xs font-bold text-teal-600">Preferences saved</p>}
      </div>
    </div>
  </section>;
}
