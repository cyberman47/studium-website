"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BookOpen, BrainCircuit, Check, ChevronDown, Clock3, Compass, Flame, HelpCircle, LayoutGrid, LogOut, Mail, MessageCircle, Settings, Sparkles, Target, User, Video, Zap } from "lucide-react";
import { Logo } from "@/components/navigation";
import { getOnboardingAnswers, getUser, OnboardingAnswers } from "@/lib/onboarding";
import { getStreak, getTotalKP, getWeekLog, recordVisit, WeekDay } from "@/lib/progress";

const menuItems = [
  { label: "Profile", icon: User, href: "#" },
  { label: "Notifications", icon: Bell, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
  { label: "Contact", icon: Mail, href: "mailto:hello@studium.app" },
  { label: "Help", icon: HelpCircle, href: "#" }
] as const;

const methodInfo: Record<string, { icon: typeof BrainCircuit; text: string }> = {
  "AI Tutor": { icon: MessageCircle, text: "Ask Studium anything, any time you're stuck." },
  Flashcards: { icon: LayoutGrid, text: "Turn your notes into intelligent, spaced-repetition cards." },
  "Practice Questions": { icon: Target, text: "Sharpen recall with questions built around your material." },
  Notes: { icon: BookOpen, text: "Keep everything organized in one calm place." },
  "Mind Maps": { icon: Compass, text: "See how ideas connect at a glance." },
  Videos: { icon: Video, text: "Learn visually, at your own pace." }
};

export default function DashboardPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);

  useEffect(() => {
    const user = getUser();
    setName(user?.name?.split(" ")[0] || "there");
    setAnswers(getOnboardingAnswers());
    recordVisit();
  }, []);

  function logOut() {
    localStorage.removeItem("studium_user");
    localStorage.removeItem("studium_onboarding_answers");
    localStorage.removeItem("studium_onboarding_complete");
    router.push("/");
  }

  const methods = answers?.studyMethods?.length ? answers.studyMethods : Object.keys(methodInfo).slice(0, 3);

  return <main className="min-h-screen bg-[#fcfdfd]">
    <header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between"><Logo /><div className="flex items-center gap-3"><KnowledgePoints /><UserMenu name={name} onLogOut={logOut} /></div></div>
    </header>

    <section className="relative py-16 sm:py-20">
      <div className="absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
      <div className="container-page">
        <span className="eyebrow"><Sparkles size={13} />Your dashboard</span>
        <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Welcome, {name} 👋</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Here's your study profile, built from what you told us. It'll get sharper the more you use Studium.</p>

        {answers && (answers.role || answers.goal || answers.studyTime) && <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {answers.role && <ProfileCard icon={Compass} label="You are a" value={answers.role} />}
          {answers.goal && <ProfileCard icon={Target} label="Main goal" value={answers.goal} />}
          {answers.studyTime && <ProfileCard icon={Clock3} label="Daily study time" value={answers.studyTime} />}
        </div>}

        <div className="mt-14">
          <h2 className="text-lg font-extrabold tracking-tight">Your study toolkit</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {methods.map(m => {
              const info = methodInfo[m];
              if (!info) return null;
              const Icon = info.icon;
              return <div key={m} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-100 text-teal-700"><Icon size={21} /></span>
                <h3 className="mt-5 text-base font-extrabold tracking-tight">{m}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{info.text}</p>
              </div>;
            })}
          </div>
        </div>

        <div className="mt-14 flex items-center gap-4 rounded-3xl bg-ink p-6 text-white shadow-soft sm:p-7">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-400 text-teal-950"><Flame size={22} /></span>
          <div><p className="text-sm font-extrabold">You're all set.</p><p className="mt-1 text-sm text-slate-300">This is a demo dashboard—no real account or study data lives here yet.</p></div>
        </div>
      </div>
    </section>
  </main>;
}

function ProfileCard({ icon: Icon, label, value }: { icon: typeof BrainCircuit; label: string; value: string }) {
  return <div className="rounded-2xl border border-teal-100 bg-[#f9fcfc] p-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500 text-white"><Icon size={17} /></span><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-sm font-extrabold text-ink">{value}</p></div>;
}

function UserMenu({ name, onLogOut }: { name: string; onLogOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function close() { setOpen(false); }

  return <div ref={ref} className="relative">
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Account menu" aria-expanded={open} className="flex cursor-pointer items-center gap-1.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-teal-100">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 text-sm font-extrabold text-teal-700">{initial}</span>
      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-0 top-full z-30 mt-2 max-h-[calc(100vh-6rem)] w-64 origin-top-right overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-lift"
      >
        <div className="p-1.5">
          {menuItems.map(item => <a key={item.label} href={item.href} onClick={close} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-ink"><item.icon size={15} className="shrink-0 text-slate-400" />{item.label}</a>)}
          <button type="button" onClick={() => { close(); onLogOut(); }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"><LogOut size={15} />Log out</button>
        </div>
        <div className="border-t border-slate-100 p-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Get the mobile app</p>
          <div className="mt-2.5 flex flex-col items-start gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a href="#" className="cursor-pointer transition hover:opacity-80"><img src="/images/badges/google-play-badge.png" alt="Get it on Google Play" className="h-10 w-auto" /></a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a href="#" className="cursor-pointer transition hover:opacity-80"><img src="/images/badges/app-store-badge.svg" alt="Download on the App Store" className="h-10 w-auto" /></a>
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}

function KnowledgePoints() {
  const [open, setOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalKP, setTotalKP] = useState(0);
  const [week, setWeek] = useState<WeekDay[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStreak(getStreak());
    setTotalKP(getTotalKP());
    setWeek(getWeekLog());
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return <div ref={ref} className="relative">
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Knowledge Points" aria-expanded={open} className="flex cursor-pointer items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-extrabold text-amber-700 transition hover:bg-amber-100 focus-visible:ring-4 focus-visible:ring-amber-100">
      <Flame size={16} className="text-amber-500" fill="currentColor" />{streak}
    </button>
    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-full z-30 mt-2 max-h-[calc(100vh-6rem)] w-72 origin-top-left overflow-y-auto rounded-2xl border border-slate-100 bg-white p-5 shadow-lift"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-600"><Flame size={22} fill="currentColor" /></span>
          <div><p className="text-2xl font-extrabold leading-tight text-ink">{streak} day{streak === 1 ? "" : "s"}</p><p className="text-xs font-bold text-slate-500">Current streak</p></div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f9fcfc] px-3 py-2.5 text-xs font-extrabold text-teal-700"><Zap size={14} fill="currentColor" />{totalKP} Knowledge Points earned</div>
        <div className="mt-5">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">This week</p>
          <div className="mt-2.5 flex justify-between gap-1">
            {week.map(d => <span key={d.date} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-extrabold transition ${d.active ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-400"} ${d.isToday ? "ring-2 ring-teal-500 ring-offset-2" : ""}`}>{d.active ? <Check size={14} strokeWidth={3} /> : d.label}</span>)}
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">{streak > 0 ? "Come back tomorrow to keep your streak alive." : "Log in tomorrow to start a new streak."}</p>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
