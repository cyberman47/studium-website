"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, Check, ChevronDown, CreditCard, Flame, GraduationCap, HeartHandshake, LogOut, Map as MapIcon, ClipboardCheck,
  FlaskConical, Pill, Settings, Smile, Sparkles, Trophy, User, X, Zap
} from "lucide-react";
import { getLongestStreak, getStreak, getTotalKP, getWeekLog, getWeeklyActivityByDay, WeekDay } from "@/lib/progress";
import { currentPathOptions, CurrentPathId, findCurrentPathDef, getCurrentPathId, setCurrentPathId } from "@/lib/currentPath";
import { formatRelativeTime, getNotifications, getUnreadCount, markAllNotificationsRead, markNotificationRead, NotificationItem } from "@/lib/notifications";

const menuItems = [
  { label: "Profile Settings", icon: User, href: "/dashboard/settings/profile" },
  { label: "Account Settings", icon: Settings, href: "/dashboard/settings/account" },
  { label: "Notifications", icon: Bell, href: "/dashboard/settings/notifications" },
  { label: "Subscription", icon: CreditCard, href: "/dashboard/settings/billing" }
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
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Account menu" aria-expanded={open} className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-teal-100">
      {avatar
        ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
        : <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 text-sm font-extrabold text-teal-700">{initial}</span>}
      <span className="text-sm font-bold text-ink">{name}</span>
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
          <button type="button" onClick={() => { close(); onLogOut(); }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"><LogOut size={15} />Logout</button>
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

function formatDayLabel(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function StudyStreak() {
  const [open, setOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [week, setWeek] = useState<WeekDay[]>([]);
  const [recent, setRecent] = useState<ReturnType<typeof getWeeklyActivityByDay>>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStreak(getStreak());
    setLongestStreak(getLongestStreak());
    setWeek(getWeekLog());
    setRecent(getWeeklyActivityByDay());
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const activeRecent = recent.filter(d => d.minutes > 0 || d.flashcards > 0 || d.quizzes > 0).slice().reverse();

  return <div ref={ref} className="relative">
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Study streak" aria-expanded={open} className="flex cursor-pointer items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-extrabold text-amber-700 transition hover:bg-amber-100 focus-visible:ring-4 focus-visible:ring-amber-100">
      <Flame size={16} className="text-amber-500" fill="currentColor" />{streak} Day Streak
    </button>
    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-full z-30 mt-2 max-h-[calc(100vh-6rem)] w-80 origin-top-left overflow-y-auto rounded-2xl border border-slate-100 bg-white p-5 shadow-lift"
      >
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-amber-50 p-3 text-center">
            <Flame size={18} className="mx-auto text-amber-600" fill="currentColor" />
            <p className="mt-1.5 text-xl font-extrabold text-ink">{streak}</p>
            <p className="text-[11px] font-bold text-slate-500">Current streak</p>
          </div>
          <div className="rounded-2xl bg-teal-50 p-3 text-center">
            <Trophy size={18} className="mx-auto text-teal-600" />
            <p className="mt-1.5 text-xl font-extrabold text-ink">{longestStreak}</p>
            <p className="text-[11px] font-bold text-slate-500">Longest streak</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Study calendar</p>
          <div className="mt-2.5 flex justify-between gap-1">
            {week.map(d => <span key={d.date} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-extrabold transition ${d.active ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-400"} ${d.isToday ? "ring-2 ring-teal-500 ring-offset-2" : ""}`}>{d.active ? <Check size={14} strokeWidth={3} /> : d.label}</span>)}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Recent activity</p>
          {activeRecent.length === 0
            ? <p className="mt-1.5 text-xs text-slate-400">Nothing logged yet this week.</p>
            : <ul className="mt-2 space-y-1.5">
              {activeRecent.map(d => {
                const parts: string[] = [];
                if (d.minutes > 0) parts.push(`${d.minutes} min studied`);
                if (d.flashcards > 0) parts.push(`${d.flashcards} flashcards`);
                if (d.quizzes > 0) parts.push(`${d.quizzes} quiz${d.quizzes === 1 ? "" : "zes"}`);
                return <li key={d.date} className="text-xs text-slate-600"><span className="font-extrabold text-ink">{formatDayLabel(d.date)}:</span> {parts.join(" · ")}</li>;
              })}
            </ul>}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}

const pathIcons: Record<CurrentPathId, typeof GraduationCap> = {
  "medical-school": GraduationCap,
  mcat: ClipboardCheck,
  nursing: HeartHandshake,
  dentistry: Smile,
  pharmacy: Pill,
  "biomedical-sciences": FlaskConical,
  other: MapIcon
};

export function LearningPathSwitcher() {
  const [open, setOpen] = useState(false);
  const [pathId, setPathId] = useState<CurrentPathId | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setPathId(getCurrentPathId()); }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function choose(id: CurrentPathId) {
    setCurrentPathId(id);
    setPathId(id);
    setOpen(false);
  }

  const current = findCurrentPathDef(pathId);
  const CurrentIcon = pathId ? pathIcons[pathId] : MapIcon;

  return <div ref={ref} className="relative">
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Current learning path" aria-expanded={open} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc] focus-visible:ring-4 focus-visible:ring-teal-100">
      <CurrentIcon size={15} className="text-teal-600" />
      <span className="max-w-[9rem] truncate">{current ? current.label : "Choose your path"}</span>
      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-full z-30 mt-2 w-64 origin-top-left overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-lift"
      >
        <p className="px-2.5 pb-1.5 pt-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Currently studying</p>
        {current && <div className="mx-1 mb-2 flex items-center gap-2.5 rounded-xl bg-teal-50 px-3 py-2 text-sm font-extrabold text-teal-700"><CurrentIcon size={16} />{current.label}</div>}
        <p className="px-2.5 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Change to</p>
        <div className="space-y-0.5 pb-1">
          {currentPathOptions.filter(p => p.id !== pathId).map(p => {
            const Icon = pathIcons[p.id];
            return <button key={p.id} type="button" onClick={() => choose(p.id)} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-ink"><Icon size={15} className="shrink-0 text-slate-400" />{p.label}</button>;
          })}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  function refresh() {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  }

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function openNotification(item: NotificationItem) {
    if (!item.read) {
      markNotificationRead(item.id);
      refresh();
    }
  }

  return <div ref={ref} className="relative">
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Notifications" aria-expanded={open} className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-teal-100">
      <Bell size={18} />
      {unreadCount > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
    </button>
    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-5 right-5 z-50 flex max-h-[32rem] w-[calc(100vw-2.5rem)] max-w-md origin-bottom-right flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-lift"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-700"><Bell size={18} /></span>
            <div>
              <p className="text-base font-extrabold text-ink">Notifications</p>
              <p className="text-xs text-slate-500">{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}</p>
            </div>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-ink"><X size={16} /></button>
        </div>

        {unreadCount > 0 && <div className="flex justify-end border-b border-slate-100 px-5 py-2.5">
          <button type="button" onClick={() => { markAllNotificationsRead(); refresh(); }} className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-teal-600 transition hover:text-teal-700"><Check size={13} strokeWidth={3} />Mark all as read</button>
        </div>}

        <div className="overflow-y-auto p-2.5">
          {notifications.length === 0
            ? <div className="flex flex-col items-center gap-2 py-14 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-300"><Bell size={22} /></span>
              <p className="text-sm font-bold text-slate-400">Nothing here yet</p>
            </div>
            : notifications.map(item => <button
              key={item.id}
              type="button"
              onClick={() => openNotification(item)}
              className={`flex w-full cursor-pointer items-start gap-3.5 rounded-2xl px-3.5 py-3.5 text-left transition hover:bg-[#f9fcfc] ${item.read ? "" : "bg-[#effbfa]"}`}
            >
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-700">
                <Sparkles size={19} />
                {!item.read && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-teal-500" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm ${item.read ? "font-bold text-slate-500" : "font-extrabold text-ink"}`}>{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.body}</p>
                <p className="mt-1.5 text-xs font-bold text-slate-400">{formatRelativeTime(item.createdAt)}</p>
              </div>
            </button>)}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
