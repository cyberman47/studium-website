"use client";

import { useState } from "react";
import { Check, Globe, Sparkles } from "lucide-react";

const languages = [
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "nl", flag: "🇳🇱", name: "Nederlands" },
  { code: "pt", flag: "🇵🇹", name: "Português" }
] as const;

export default function LanguagesSettingsPage() {
  const [selected, setSelected] = useState<(typeof languages)[number]>(languages[0]);
  const [notice, setNotice] = useState(false);

  function choose(lang: (typeof languages)[number]) {
    setSelected(lang);
    setNotice(lang.code !== "en");
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />App settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Languages.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Choose the language Studium is displayed in.</p>

    <div className="mt-10 max-w-2xl">
      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight"><Globe size={18} className="text-teal-600" />Display language</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {languages.map(l => {
            const active = l.code === selected.code;
            return <button type="button" key={l.code} onClick={() => choose(l)} className={`flex cursor-pointer items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${active ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-600 hover:border-teal-200"}`}>
              <span className="flex items-center gap-2"><span>{l.flag}</span>{l.name}</span>
              {active && <Check size={15} strokeWidth={3} />}
            </button>;
          })}
        </div>
        {notice && <p className="mt-4 text-xs font-bold text-teal-600">{selected.name} translation coming soon—showing English for now.</p>}
      </div>
    </div>
  </section>;
}
