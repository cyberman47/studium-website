"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Field, inputClass } from "@/components/ui";
import { completeOnboarding, emptyAnswers, getOnboardingAnswers, getUser, goalOptions, OnboardingAnswers, roleOptions, sourceOptions, studyMethodOptions, studyTimeOptions } from "@/lib/onboarding";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<OnboardingAnswers>(emptyAnswers);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = getUser();
    setName(user?.name || "");
    setEmail(user?.email || "");
    const a = getOnboardingAnswers();
    if (a) setAnswers(a);
  }, []);

  function toggleMethod(m: string) {
    setAnswers(a => ({ ...a, studyMethods: a.studyMethods.includes(m) ? a.studyMethods.filter(x => x !== m) : [...a.studyMethods, m] }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    completeOnboarding(answers);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const initial = (name || "?").trim().charAt(0).toUpperCase();

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Profile.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Keep your study profile up to date.</p>

    <div className="mt-10 max-w-2xl space-y-6">
      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-2xl font-extrabold text-teal-700">{initial}</span>
          <div className="min-w-0"><p className="truncate text-sm font-extrabold text-heading">{name || "Your name"}</p><p className="truncate text-xs text-slate-500">{email}</p></div>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-slate-500">To change your name, username, email, or photo, head to <Link href="/dashboard/settings/account" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Account</Link>.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
          <h2 className="text-lg font-extrabold tracking-tight">Study profile</h2>
          <p className="mt-1 text-sm text-slate-500">This is what you told us during onboarding—update it any time.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <SelectField label="You are a" value={answers.role} options={roleOptions} onChange={v => setAnswers(a => ({ ...a, role: v }))} />
            <SelectField label="Main goal" value={answers.goal} options={goalOptions} onChange={v => setAnswers(a => ({ ...a, goal: v }))} />
            <SelectField label="Daily study time" value={answers.studyTime} options={studyTimeOptions} onChange={v => setAnswers(a => ({ ...a, studyTime: v }))} />
            <SelectField label="How you heard about us" value={answers.source} options={sourceOptions} onChange={v => setAnswers(a => ({ ...a, source: v }))} />
          </div>
          <div className="mt-5">
            <span className="mb-2 block text-xs font-extrabold text-slate-600">Preferred study methods</span>
            <div className="flex flex-wrap gap-2">
              {studyMethodOptions.map(m => {
                const selected = answers.studyMethods.includes(m);
                return <button type="button" key={m} onClick={() => toggleMethod(m)} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${selected ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-600 hover:border-teal-200"}`}>{selected && <Check size={12} strokeWidth={3} />}{m}</button>;
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className="cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Save changes</button>
          {saved && <span className="text-sm font-bold text-teal-600">Saved ✓</span>}
        </div>
      </form>
    </div>
  </section>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string | null; options: string[]; onChange: (v: string) => void }) {
  return <Field label={label}>
    <select value={value ?? ""} onChange={e => onChange(e.target.value)} className={inputClass}>
      <option value="" disabled>Choose one</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </Field>;
}
