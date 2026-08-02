"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { ToggleRow } from "@/components/ui";
import { AppSettings, getAppSettings, saveAppSettings } from "@/lib/onboarding";

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setSettings(getAppSettings()); }, []);

  function toggle(key: "soundEffects" | "autoPlayVideos" | "compactMode") {
    setSettings(s => {
      if (!s) return s;
      const next = { ...s, [key]: !s[key] };
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
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">General.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">The little things that shape how Studium feels day to day.</p>

    <div className="mt-10 max-w-2xl">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight"><SlidersHorizontal size={18} className="text-teal-600" />Behavior</h2>
        <div className="mt-3 divide-y divide-slate-100">
          <ToggleRow label="Sound effects" desc="Little chimes for correct answers and streak milestones." checked={settings.soundEffects} onChange={() => toggle("soundEffects")} />
          <ToggleRow label="Auto-play videos" desc="Start video lessons automatically when you open them." checked={settings.autoPlayVideos} onChange={() => toggle("autoPlayVideos")} />
          <ToggleRow label="Compact mode" desc="Tighter spacing across the dashboard for more on screen." checked={settings.compactMode} onChange={() => toggle("compactMode")} />
        </div>
        {saved && <p className="mt-3 text-xs font-bold text-teal-600">Preferences saved</p>}
      </div>
    </div>
  </section>;
}
