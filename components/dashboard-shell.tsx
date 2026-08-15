"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, Check, ChevronDown, Compass, CreditCard, Flame, GraduationCap, HeartHandshake, LogOut, Map as MapIcon, ClipboardCheck,
  FlaskConical, Menu, MessagesSquare, Pill, Settings, ShieldAlert, Smile, Snowflake, Sparkles, Trash2, Trophy, User, X, Zap
} from "lucide-react";
import { isNavItemActive, navGroups } from "@/lib/dashboardNav";
import {
  ensureStreakFreezesGranted, ensureStreakGapsFrozen, getLongestStreak, getStreakFreezeCount, getWeekLog,
  PROGRESS_EVENT, WeekDay
} from "@/lib/progress";
import { STUDY_PLANNER_EVENT } from "@/lib/studyPlanner";
import { ensureShieldSecured, getTodayShieldProgress, ShieldProgress } from "@/lib/studyShield";
import { currentPathOptions, CurrentPathId, findCurrentPathDef, getCurrentPathId, setCurrentPathId } from "@/lib/currentPath";
import {
  deleteNotification, formatRelativeTime, getNotifications, getUnreadCount, markAllNotificationsRead, NotificationItem,
  toggleNotificationRead
} from "@/lib/notifications";
import { ThemeToggle } from "@/components/theme-toggle";
import { replayDashboardTour } from "@/lib/productTour";

const SECURED_COLOR = "#0F8B8D"; // this app's existing brand teal (accent-500)—used instead of the spec's one-off #00A884 to stay on the real design system
const BUILDING_COLOR = "#D97706"; // amber-600, matches the amber-50/100/600 tones this file already used for the old flame streak button

// A brain, not a shield—same liquid-fill mechanic as before (a clipPath
// rect whose height is driven by `percent`, reused for both the outline and
// the colored fill layer), just swapped onto real brain geometry: the two
// closed hemisphere loops from Lucide's own "Brain" icon (normally rendered
// as multi-stroke line art) combined into one fillable silhouette instead,
// since a liquid fill needs one solid enclosed shape, not separate stroked
// lines. useId keeps the clipPath id collision-free between the header's
// mini brain and the dropdown's large one, which render simultaneously.
function BrainIcon({ percent, secured, size = 22 }: { percent: number; secured: boolean; size?: number }) {
  const clipId = useId();
  const fill = secured ? SECURED_COLOR : BUILDING_COLOR;
  const brainPath = "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z";
  const fillHeight = (percent / 100) * 24;
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <defs>
      <clipPath id={clipId}>
        <rect x="0" y={24 - fillHeight} width="24" height={fillHeight} style={{ transition: "y 0.6s cubic-bezier(.22,1,.36,1), height 0.6s cubic-bezier(.22,1,.36,1)" }} />
      </clipPath>
    </defs>
    <path d={brainPath} fill="none" stroke="#CBD5E1" strokeWidth="1.3" strokeLinejoin="round" />
    <path d={brainPath} fill={fill} clipPath={`url(#${clipId})`} style={{ transition: "fill 0.4s ease" }} />
    {secured && <path d="M7.7 12 L10.8 15.1 L16.6 8.6" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "opacity 0.3s ease 0.3s" }} />}
  </svg>;
}

const menuItems = [
  { label: "Profile Settings", icon: User, href: "/dashboard/settings/profile" },
  { label: "Account Settings", icon: Settings, href: "/dashboard/settings/account" },
  { label: "Notifications", icon: Bell, href: "/dashboard/settings/notifications" },
  { label: "Subscription", icon: CreditCard, href: "/dashboard/settings/billing" },
  // Forum is its own real discussion feature, distinct from the Community
  // Library (lib/communityLessons.ts, now a real sidebar item)—moved back
  // here, directly above Logout, per request.
  { label: "Forum", icon: MessagesSquare, href: "/forum" }
] as const;

export function UserMenu({ name, avatar, onLogOut }: { name: string; avatar?: string | null; onLogOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const router = useRouter();

  // Un-marks the dashboard tour and sends the student there—its own
  // SectionTour (app/dashboard/(main)/page.tsx) auto-plays on mount for
  // anyone who hasn't seen it, so this is indistinguishable from a genuine
  // first visit.
  function replayTour() {
    replayDashboardTour();
    router.push("/dashboard");
  }

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
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Account menu" aria-expanded={open} className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-teal-100 dark:hover:bg-white/5">
      {avatar
        ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
        : <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 text-sm font-extrabold text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">{initial}</span>}
      <span className="hidden text-sm font-bold text-heading dark:text-white sm:inline">{name}</span>
      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-0 top-full z-30 mt-2 max-h-[calc(100vh-6rem)] w-64 origin-top-right overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-lift dark:border-white/10 dark:bg-[#0d1917]"
      >
        <div className="border-b border-slate-100 p-3 dark:border-white/10">
          <p className="px-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Appearance</p>
          <div className="mt-2"><ThemeToggle /></div>
        </div>
        <div className="p-1.5">
          {menuItems.map(item => <a key={item.label} href={item.href} onClick={close} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-heading dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"><item.icon size={15} className="shrink-0 text-slate-400" />{item.label}</a>)}
          <button type="button" onClick={() => { close(); replayTour(); }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-heading dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"><Compass size={15} className="shrink-0 text-slate-400" />Product Tour</button>
          <button type="button" onClick={() => { close(); onLogOut(); }} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"><LogOut size={15} />Logout</button>
        </div>
        <div className="border-t border-slate-100 p-3 dark:border-white/10">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Get the mobile app</p>
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
      <div><p className="text-2xl font-extrabold leading-tight text-heading">{streak} day{streak === 1 ? "" : "s"}</p><p className="text-xs font-bold text-slate-500">Current streak</p></div>
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

// Study Shield: replaces the old flame streak pill. Every number here is
// real (lib/studyShield.ts)—today's KP is a genuine sum of today's actually
// logged activities, and crossing the 50-KP target genuinely marks today as
// a streak day (same real storage the old 3-goal Study Plan already wrote
// to), not a cosmetic-only animation.
export function StudyStreak() {
  const [open, setOpen] = useState(false);
  // The dropdown opens compact (days + KP + secured status only) so it
  // doesn't dump the full activity list/calendar on you every time—expanded
  // is its own state, reset shut each time the dropdown itself closes, via
  // the click-outside effect below.
  const [expanded, setExpanded] = useState(false);
  const [longestStreak, setLongestStreak] = useState(0);
  const [week, setWeek] = useState<WeekDay[]>([]);
  const [progress, setProgress] = useState<ShieldProgress | null>(null);
  const [freezeCount, setFreezeCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  function refresh() {
    // Bridge any missed day with a real Streak Freeze, and grant freezes if
    // this is the first time the streak has passed 2 days—both before
    // reading today's progress, so a just-bridged gap is reflected
    // immediately rather than on the next reload.
    ensureStreakGapsFrozen();
    ensureStreakFreezesGranted();
    let next = getTodayShieldProgress();
    ensureShieldSecured(next);
    // Re-read after securing so `streakDays` reflects today counting toward
    // the real streak immediately (getStreak() already includes today the
    // moment it's added to storage)—the "14 → 15 DAYS" jump the moment you
    // cross 50 KP is this, not a separate animation trick.
    if (next.secured) next = getTodayShieldProgress();
    setProgress(next);
    setLongestStreak(getLongestStreak());
    setWeek(getWeekLog());
    setFreezeCount(getStreakFreezeCount());
  }

  useEffect(() => {
    refresh();
    // The Shield lives in the persistent header, but the actions that
    // change it happen on other pages entirely—without these listeners
    // it'd only ever reflect whatever was true the moment it first
    // mounted. Its target is adaptive once a Study Planner exam is set up
    // (see lib/studyPlanner.ts), so it also needs to hear about plan
    // changes, not just KP changes.
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener(STUDY_PLANNER_EVENT, refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener(STUDY_PLANNER_EVENT, refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setExpanded(false); }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  if (!progress) return <div className="h-7 w-32 shrink-0 animate-pulse rounded-full bg-slate-100" />;

  const { activities, currentKP, targetKP, percent, secured, kpUntilSecured, streakDays } = progress;

  return <div ref={ref} className="relative">
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      aria-label="Study progress"
      aria-expanded={open}
      className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-extrabold transition focus-visible:ring-4 ${secured ? "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 focus-visible:ring-teal-100 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-500/15" : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 focus-visible:ring-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/15"}`}
    >
      <BrainIcon percent={percent} secured={secured} size={13} />
      {streakDays}d<span className="mx-0.5 text-black/15">·</span>{currentKP}/{targetKP} KP
    </button>

    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-full z-30 mt-2 max-h-[calc(100vh-6rem)] w-72 origin-top-left overflow-y-auto rounded-2xl border border-slate-100 bg-white p-4 shadow-lift"
      >
        {/* Compact by default—just the headline number and today's status,
            so opening this doesn't dump the full activity list/calendar on
            you every time. The chevron below reveals the rest. */}
        <div className="flex flex-col items-center text-center">
          <p className="text-2xl font-extrabold tracking-tight text-heading">{streakDays} DAYS</p>
          <div className="mt-2">
            <BrainIcon percent={percent} secured={secured} size={72} />
          </div>
          <p className="mt-2 text-sm font-extrabold text-heading">{currentKP} / {targetKP} KP</p>
          {secured
            ? <p className="mt-1 flex items-center gap-1.5 text-xs font-extrabold text-teal-700"><Check size={13} strokeWidth={3} />STREAK SECURED FOR TODAY</p>
            : <p className="mt-1 flex items-center gap-1.5 text-xs font-extrabold text-amber-700"><ShieldAlert size={13} />{kpUntilSecured} KP until your streak is secured</p>}
          {freezeCount > 0 && <p className="mt-2 flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-extrabold text-sky-700"><Snowflake size={12} />{freezeCount} Streak Freeze{freezeCount === 1 ? "" : "s"} available</p>}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-100 py-1.5 text-[11px] font-bold text-slate-500 transition hover:border-teal-200 hover:text-teal-700"
        >
          {expanded ? "Show less" : "Show details"}
          <ChevronDown size={13} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence initial={false}>
          {expanded && <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-2xl bg-[#f9fcfc] p-3 text-center">
              <p className="text-lg font-extrabold text-heading">{longestStreak}</p>
              <p className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500"><Trophy size={11} />Longest streak</p>
            </div>

            <div className="mt-3">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Today's activities</p>
              <div className="mt-2 space-y-1.5">
                {activities.map(a => <div key={a.id} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 transition ${a.done ? "border-transparent bg-teal-50" : "border-slate-100 bg-white"}`}>
                  {a.done
                    ? <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-500 text-white"><Check size={11} strokeWidth={3} /></span>
                    : <span className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-200" />}
                  <span className={`flex-1 text-xs font-bold ${a.done ? "text-slate-400 line-through" : "text-heading"}`}>{a.label}</span>
                  <span className={`text-xs font-extrabold ${a.done ? "text-teal-600" : "text-slate-400"}`}>+{a.kp} KP</span>
                </div>)}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Study calendar</p>
              <div className="mt-2.5 flex justify-between gap-1">
                {week.map(d => <span key={d.date} title={d.frozen ? "Protected by a Streak Freeze" : undefined} className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-extrabold transition ${d.frozen ? "bg-sky-400 text-white" : d.active ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-400"} ${d.isToday ? "ring-2 ring-teal-500 ring-offset-2" : ""}`}>{d.frozen ? <Snowflake size={12} /> : d.active ? <Check size={12} strokeWidth={3} /> : d.label}</span>)}
              </div>
            </div>

            <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold ${secured ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>
              <Zap size={14} fill="currentColor" />
              {secured ? `Streak secured—come back tomorrow to keep it going.` : `Earn ${kpUntilSecured} more KP to continue your ${streakDays}-day streak.`}
            </div>

            <Link href="/dashboard/progress" onClick={() => { setOpen(false); setExpanded(false); }} className="mt-3 flex cursor-pointer items-center justify-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-teal-600">View full progress</Link>
          </motion.div>}
        </AnimatePresence>
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
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Current learning path" aria-expanded={open} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] focus-visible:ring-4 focus-visible:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-teal-500/30 dark:hover:bg-white/10">
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
            return <button key={p.id} type="button" onClick={() => choose(p.id)} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-heading"><Icon size={15} className="shrink-0 text-slate-400" />{p.label}</button>;
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
  // Which single notification is expanded, inbox-style—collapsed rows show
  // only the subject line (title), and opening one to read the body is
  // what marks it read, same real read/unread state as before.
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  // Purely expand/collapse—no longer a side-channel for marking read, since
  // that's now a real, explicit action (the button below), not something
  // that quietly happens just from previewing a message.
  function toggleExpand(item: NotificationItem) {
    setExpandedId(id => id === item.id ? null : item.id);
  }

  function handleToggleRead(id: string) {
    toggleNotificationRead(id);
    refresh();
  }

  function handleDelete(id: string) {
    deleteNotification(id);
    refresh();
    setExpandedId(current => current === id ? null : current);
  }

  return <div ref={ref} className="relative">
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Notifications" aria-expanded={open} className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-teal-100 dark:text-slate-400 dark:hover:bg-white/5">
      <Bell size={18} />
      {unreadCount > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
    </button>
    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-5 right-5 z-50 flex max-h-[32rem] w-[calc(100vw-2.5rem)] max-w-[22rem] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-lift"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-700"><Bell size={18} /></span>
            <div>
              <p className="text-base font-extrabold text-heading">Notifications</p>
              <p className="text-xs text-slate-500">{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}</p>
            </div>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-heading"><X size={16} /></button>
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
            : notifications.map(item => {
              const isExpanded = expandedId === item.id;
              return <div key={item.id} className={`overflow-hidden rounded-2xl transition-colors ${item.read ? "" : "bg-[#effbfa]"}`}>
                {/* Inbox row: only the subject line shows until pressed, like
                    an email—the body reveals inline underneath on click,
                    which is also the real moment it gets marked read. */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item)}
                  aria-expanded={isExpanded}
                  className="flex w-full cursor-pointer items-center gap-3.5 px-3.5 py-3.5 text-left transition hover:bg-[#f9fcfc]"
                >
                  <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-700">
                    <Sparkles size={19} />
                    {!item.read && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-teal-500" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm ${item.read ? "font-bold text-slate-500" : "font-extrabold text-heading"}`}>{item.title}</span>
                    <span className="mt-0.5 block text-xs font-bold text-slate-400">{formatRelativeTime(item.createdAt)}</span>
                  </span>
                  <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-3.5 pb-3.5 pl-[3.75rem]">
                      <p className="text-sm leading-relaxed text-slate-500">{item.body}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <button type="button" onClick={() => handleToggleRead(item.id)} className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-teal-600 transition hover:text-teal-700">
                          <Check size={13} strokeWidth={3} />{item.read ? "Mark as unread" : "Mark as read"}
                        </button>
                        <button type="button" onClick={() => handleDelete(item.id)} className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-rose-500 transition hover:text-rose-600">
                          <Trash2 size={13} />Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>}
                </AnimatePresence>
              </div>;
            })}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}

// The dashboard's entire primary navigation (Learning Paths, Study Planner,
// Flashcards, everything) lives in app/dashboard/(main)/layout.tsx's
// <aside>, which is flatly `hidden` below the sm breakpoint with no
// replacement—on a phone, every one of those sections was unreachable
// except by typing a URL. This is that replacement: a slide-in drawer,
// portaled to <body> so it can overlay the whole page regardless of where
// it's mounted in the tree, built from the exact same navGroups data the
// desktop sidebar uses (lib/dashboardNav.ts) so the two can't drift apart.
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Next.js <Link> navigations don't reload the page, so without this the
  // drawer would still be sitting open over the new page after a tap.
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  return <>
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open navigation menu"
      aria-expanded={open}
      className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-teal-100 dark:text-slate-400 dark:hover:bg-white/5 sm:hidden"
    >
      <Menu size={20} />
    </button>
    {typeof document !== "undefined" && createPortal(
      <AnimatePresence>
        {open && <>
          <motion.button
            type="button"
            aria-label="Close navigation menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] cursor-default bg-black/40 sm:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 z-[71] flex w-[82vw] max-w-[320px] flex-col overflow-y-auto bg-white shadow-lift dark:bg-[#0d1917] sm:hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
              <p className="text-base font-extrabold text-heading dark:text-white">Menu</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-heading dark:hover:bg-white/5"><X size={18} /></button>
            </div>
            <nav className="flex-1 space-y-1 p-3">
              {navGroups.map((group, i) => <div key={group.label ?? `ungrouped-${i}`} className={i > 0 ? "pt-3" : ""}>
                {group.label && <p className="px-3 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">{group.label}</p>}
                <div className="space-y-1">
                  {group.items.map(item => {
                    const active = isNavItemActive(pathname ?? "", item.href);
                    return <Link key={item.href} href={item.href} className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${active ? "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" : "text-slate-600 hover:bg-slate-50 hover:text-heading dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"}`}>
                      <item.icon size={18} className={active ? "text-teal-600 dark:text-teal-300" : "text-slate-400 dark:text-slate-500"} />{item.label}
                    </Link>;
                  })}
                </div>
              </div>)}
            </nav>
          </motion.div>
        </>}
      </AnimatePresence>,
      document.body
    )}
  </>;
}
