"use client";

import { useEffect, useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import { ToggleRow } from "@/components/ui";
import { getPreferences, Preferences, savePreferences } from "@/lib/onboarding";

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<Preferences>({ dailyReminder: true, streakAlerts: true, weeklyEmail: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => { setPrefs(getPreferences()); }, []);

  function toggle(key: keyof Preferences) {
    setPrefs(p => {
      const next = { ...p, [key]: !p[key] };
      savePreferences(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      return next;
    });
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Notifications.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Choose what Studium keeps you in the loop about.</p>

    <div className="mt-10 max-w-2xl">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight"><Bell size={18} className="text-teal-600" />Notifications</h2>
        <div className="mt-3 divide-y divide-slate-100">
          <ToggleRow label="Daily study reminder" desc="A gentle nudge if you haven't studied yet today." checked={prefs.dailyReminder} onChange={() => toggle("dailyReminder")} />
          <ToggleRow label="Streak alerts" desc="Get notified before your streak is at risk." checked={prefs.streakAlerts} onChange={() => toggle("streakAlerts")} />
          <ToggleRow label="Weekly progress email" desc="A summary of your week, every Monday." checked={prefs.weeklyEmail} onChange={() => toggle("weeklyEmail")} />
        </div>
        {saved && <p className="mt-3 text-xs font-bold text-teal-600">Preferences saved</p>}
      </div>
    </div>
  </section>;
}
