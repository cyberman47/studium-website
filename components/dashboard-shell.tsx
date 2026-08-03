"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, ChevronDown, Flame, HelpCircle, LogOut, Mail, Settings, User, Zap } from "lucide-react";
import { getStreak, getTotalKP, getWeekLog, WeekDay } from "@/lib/progress";

const menuItems = [
  { label: "Profile", icon: User, href: "/dashboard/settings/profile" },
  { label: "Notifications", icon: Bell, href: "/dashboard/settings/notifications" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  { label: "Contact", icon: Mail, href: "mailto:hello@studium.app" },
  { label: "Help", icon: HelpCircle, href: "#" }
] as const;

export function UserMenu({ name, avatar, onLogOut }: { name: string; avatar?: string | null; onLogOut: () => void }) {
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
      {avatar
        ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
        : <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 text-sm font-extrabold text-teal-700">{initial}</span>}
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

export function StreakSummary({ streak, totalKP, week }: { streak: number; totalKP: number; week: WeekDay[] }) {
  return <>
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
  </>;
}

export function KnowledgePoints() {
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
        <StreakSummary streak={streak} totalKP={totalKP} week={week} />
      </motion.div>}
    </AnimatePresence>
  </div>;
}
