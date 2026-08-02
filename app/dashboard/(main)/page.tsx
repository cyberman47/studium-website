"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Bot, Brain, Clock3, Compass, FileQuestion, Layers, Play, Sparkles, Target } from "lucide-react";
import { getOnboardingAnswers, getUser, OnboardingAnswers } from "@/lib/onboarding";
import { getStreak, getTotalKP, getWeekLog, recordVisit, WeekDay } from "@/lib/progress";
import { StreakSummary } from "@/components/dashboard-shell";

const weakAreas = [
  { label: "Renal System", accuracy: 48, tone: "rose" },
  { label: "Immunology", accuracy: 71, tone: "amber" },
  { label: "Anatomy", accuracy: 89, tone: "emerald" }
] as const;

const toneClasses: Record<string, { bar: string; text: string }> = {
  rose: { bar: "bg-rose-500", text: "text-rose-600" },
  amber: { bar: "bg-amber-400", text: "text-amber-600" },
  emerald: { bar: "bg-emerald-500", text: "text-emerald-600" }
};

const MCAT_TOTAL_DAYS = 180;
const MCAT_DAYS_LEFT = 120;
const CARDS_DUE = 42;
const MASTERY_PERCENT = 65;
const SESSION_TOTAL = 40;
const SESSION_REMAINING = 25;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHomePage() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalKP, setTotalKP] = useState(0);
  const [week, setWeek] = useState<WeekDay[]>([]);

  useEffect(() => {
    const user = getUser();
    setName(user?.name?.split(" ")[0] || "there");
    setAnswers(getOnboardingAnswers());
    recordVisit();
    setStreak(getStreak());
    setTotalKP(getTotalKP());
    setWeek(getWeekLog());
  }, []);

  const sessionDone = SESSION_TOTAL - SESSION_REMAINING;
  const sessionPercent = Math.round((sessionDone / SESSION_TOTAL) * 100);

  const launchTiles = [
    { title: "AI Tutor", subtitle: "Ask about today's topics", icon: Bot, href: "/dashboard/ai-tutor", color: "bg-violet-100 text-violet-600" },
    { title: "Flashcard Decks", subtitle: `${CARDS_DUE} cards due`, icon: Layers, href: "/dashboard/flashcards", color: "bg-teal-100 text-teal-700" },
    { title: "Q-Banks", subtitle: "3 practice sets available", icon: FileQuestion, href: "#", color: "bg-amber-100 text-amber-600" }
  ];

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Your dashboard</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{getGreeting()}, {name} 🩺</h1>

    <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start xl:gap-8">
      {/* Main feed */}
      <div className="min-w-0 space-y-8">
        {/* Hero: Jump back in */}
        <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-lift sm:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-teal-300"><Play size={11} fill="currentColor" />Jump back in</span>
              <h2 className="display mt-4 text-2xl sm:text-3xl">Cardiac Physiology</h2>
              <p className="mt-2 text-sm text-slate-300">{SESSION_REMAINING} questions remaining in this set</p>
              <div className="mt-4 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-teal-400" style={{ width: `${sessionPercent}%` }} /></div>
              <p className="mt-1.5 text-xs text-slate-400">{sessionDone} of {SESSION_TOTAL} complete</p>
            </div>
            <a href="#" className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Resume Session<ArrowUpRight size={16} /></a>
          </div>
        </div>

        {/* Stat widgets */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-soft">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Target size={13} />MCAT Countdown</div>
            <div className="mt-3"><RingStat percent={(MCAT_DAYS_LEFT / MCAT_TOTAL_DAYS) * 100} value={MCAT_DAYS_LEFT} /></div>
            <p className="mt-2 text-xs text-slate-500">days remaining</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Brain size={13} />Cardiology Mastery</div>
            <p className="mt-3 text-3xl font-extrabold text-ink">{MASTERY_PERCENT}%</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${MASTERY_PERCENT}%` }} /></div>
            <p className="mt-2 text-xs text-slate-500">+8% this week</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Layers size={13} />Cards Due</div>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative h-12 w-14 shrink-0">
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg border-2 border-teal-100 bg-white" />
                <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-lg border-2 border-teal-200 bg-white" />
                <div className="absolute inset-0 grid place-items-center rounded-lg border-2 border-teal-500 bg-teal-50 text-sm font-extrabold text-teal-700">{CARDS_DUE}</div>
              </div>
              <a href="/dashboard/flashcards" className="cursor-pointer text-sm font-bold text-teal-600 transition hover:text-teal-700">Review now →</a>
            </div>
          </div>
        </div>

        {/* Weak areas action center */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
          <h2 className="text-lg font-extrabold tracking-tight">Your Weak Areas</h2>
          <div className="mt-1">
            {weakAreas.map(area => <div key={area.label} className="flex items-center gap-4 border-b border-slate-100 py-3.5 last:border-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-ink">{area.label}</span><span className={`text-xs font-extrabold ${toneClasses[area.tone].text}`}>{area.accuracy}% accuracy</span></div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${toneClasses[area.tone].bar}`} style={{ width: `${area.accuracy}%` }} /></div>
              </div>
              <a href="#" className="shrink-0 cursor-pointer rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100">Practice</a>
            </div>)}
          </div>
        </div>

        {/* Quick launch hub */}
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Quick Launch</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {launchTiles.map(tile => <a key={tile.title} href={tile.href} className="group flex cursor-pointer flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tile.color}`}><tile.icon size={21} /></span>
              <h3 className="mt-4 text-base font-extrabold tracking-tight">{tile.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{tile.subtitle}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-teal-600 opacity-0 transition group-hover:opacity-100">Open <ArrowUpRight size={12} /></span>
            </a>)}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <StreakSummary streak={streak} totalKP={totalKP} week={week} />
        </div>

        {answers && (answers.role || answers.goal || answers.studyTime) && <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Your profile</h3>
          <div className="mt-3 space-y-3">
            {answers.role && <ProfileRow icon={Compass} label="You are a" value={answers.role} />}
            {answers.goal && <ProfileRow icon={Target} label="Main goal" value={answers.goal} />}
            {answers.studyTime && <ProfileRow icon={Clock3} label="Daily study time" value={answers.studyTime} />}
          </div>
        </div>}

        <p className="px-1 text-xs leading-relaxed text-slate-400">This is a demo dashboard—no real account or study data lives here yet.</p>
      </aside>
    </div>
  </section>;
}

function RingStat({ percent, value, size = 84, stroke = 8 }: { percent: number; value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);
  return <div className="relative grid place-items-center" style={{ width: size, height: size }}>
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2f5f3" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#0F8B8D" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
    <span className="absolute text-xl font-extrabold text-ink">{value}</span>
  </div>;
}

function ProfileRow({ icon: Icon, label, value }: { icon: typeof Compass; label: string; value: string }) {
  return <div className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700"><Icon size={15} /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="truncate text-sm font-extrabold text-ink">{value}</p></div></div>;
}
