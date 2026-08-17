"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Bell, Bot, ChevronDown, Clock3, Flame, Play, Search, Send, Sparkles, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import Image from "next/image";

export function DashboardMockup({ hero = false }: { hero?: boolean }) {
  // The browser-window chrome (traffic lights + address bar) and the coded
  // dashboard content below are shared by both sizes—content mirrors the
  // real dashboard (grouped sidebar, Continue Studying, Daily Case
  // Challenge, Study Planner, Leaderboard) with generic placeholder data
  // rather than one real account's actual numbers, so the preview reads as
  // a designed product shot rather than someone's personal screenshot.
  const card = <div className="overflow-hidden rounded-[22px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-[0_32px_80px_-30px_rgba(15,60,61,.35)]">
    <div className="flex h-11 items-center gap-1.5 border-b bg-slate-50/80 dark:bg-white/5 px-4"><i className="h-2 w-2 rounded-full bg-[#ff625b]" /><i className="h-2 w-2 rounded-full bg-[#ffbd44]" /><i className="h-2 w-2 rounded-full bg-[#00ca4e]" /><div className="ml-4 h-5 w-36 rounded-md bg-white dark:bg-[#0d1917]" /></div>
    <div className="flex min-h-[330px] sm:min-h-[600px]">
      <aside className="hidden w-40 shrink-0 border-r bg-[#fbfcfc] dark:bg-[#070d0c] p-4 sm:block">
        <div className="mb-6 flex items-center"><Image src="/images/studium-logo-full.png" alt="Studium" width={779} height={303} className="h-4 w-auto object-contain" /></div>
        <NavGroup label="Study" items={["Home", "Learning Paths", "Study Planner"]} activeIndex={0} />
        <NavGroup label="Review" items={["Flashcards", "Quizzes", "Terminology"]} />
        <NavGroup label="Tools" items={["Create", "Studium AI", "Progress", "Passport"]} />
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6">
        {/* Top bar: search + the same cluster the real header uses (track
            pill, streak/KP pill, notifications, avatar)—condensed to fit
            this preview's scale, but the same pieces, not simplified away. */}
        <div className="flex items-center gap-2.5">
          <div className="hidden h-7 flex-1 items-center rounded-lg border border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 text-[8px] font-medium text-slate-400 sm:flex"><Search size={9} className="mr-1.5" />Search...</div>
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <span className="hidden items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-500/15 px-2 py-1 text-[7px] font-extrabold text-teal-700 dark:text-teal-300 md:inline-flex">🚀 MCAT Preparation<ChevronDown size={8} /></span>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-500/15 px-2 py-1 text-[7px] font-extrabold text-teal-700 dark:text-teal-300"><Flame size={9} className="text-orange-400" fill="currentColor" />4d · 90/15 KP</span>
            <span className="hidden grid h-6 w-6 place-items-center rounded-lg text-slate-400 sm:grid"><Bell size={11} /></span>
            <span className="hidden items-center gap-1 sm:flex"><span className="grid h-6 w-6 place-items-center rounded-full bg-teal-500 text-[8px] font-extrabold text-white">M</span><ChevronDown size={8} className="text-slate-400" /></span>
          </div>
        </div>

        <span className="mt-3 inline-flex items-center rounded-full bg-teal-50 dark:bg-teal-500/15 px-2 py-0.5 text-[7px] font-extrabold uppercase tracking-wide text-teal-700 dark:text-teal-300">Your dashboard</span>
        <h3 className="mt-2 text-sm font-extrabold tracking-tight sm:text-base">Good morning, Maya <span>👋</span></h3>

        <div className="mt-3 grid gap-2.5 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 p-3 text-white sm:p-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[7px] font-extrabold uppercase tracking-wide"><Zap size={8} fill="currentColor" />Continue Studying</span>
            <p className="mt-2 text-sm font-extrabold sm:text-base">Cell Structure</p>
            <p className="mt-0.5 text-[8px] text-teal-100">Next lesson · 2/9 in Biology</p>
            <button type="button" className="mt-2.5 inline-flex cursor-pointer items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[8px] font-extrabold text-teal-700"><Play size={7} fill="currentColor" />Resume</button>
          </div>
          <div className="hidden rounded-xl bg-ink p-3 text-white sm:block">
            <p className="text-[7px] font-extrabold uppercase tracking-wide text-teal-300">Daily Case Challenge</p>
            <div className="mt-1.5 flex gap-1"><span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[6px] font-extrabold uppercase tracking-wide text-teal-200">Neurology</span><span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[6px] font-extrabold uppercase tracking-wide text-teal-200">Beginner</span></div>
            <p className="mt-2 text-[10px] font-extrabold leading-snug">Fainting in a Crowded Room</p>
            <p className="mt-2 flex items-center gap-1 text-[8px] font-bold text-teal-300">Review answer <ArrowUpRight size={9} /></p>
          </div>
        </div>

        <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-slate-100 dark:border-white/10 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-extrabold">Study Planner</p>
              <p className="flex items-center gap-1 text-[7px] font-bold text-teal-600">View plan <ArrowUpRight size={8} /></p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[7px] font-bold text-slate-500">399 days to exam</span>
              <span className="rounded-full bg-teal-50 dark:bg-teal-500/15 px-2 py-0.5 text-[7px] font-bold text-teal-700 dark:text-teal-300">Streak secured</span>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-[8px]"><span className="font-bold text-slate-500">Today&apos;s goal</span><span className="font-extrabold">90 / 15 KP</span></div>
              <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full w-[85%] rounded-full bg-teal-500" /></div>
              <div className="flex items-center justify-between pt-1 text-[8px]"><span className="font-bold text-slate-500">Exam readiness</span><span className="font-extrabold">25%</span></div>
              <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full w-[25%] rounded-full bg-accent-500" /></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniCard icon={<Clock3 size={12} />} title="Study time today" value="30m" color="bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300 text-violet-500" />
              <MiniCard icon={<Target size={12} />} title="Overall mastery" value="22%" color="bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600" />
            </div>
          </div>
          <div className="hidden flex-col gap-2.5 sm:flex">
            <div className="rounded-xl border border-slate-100 dark:border-white/10 p-2.5">
              <div className="flex items-center justify-between"><p className="flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wide text-slate-500"><Trophy size={9} className="text-amber-500" />Leaderboard</p><p className="text-[7px] font-bold text-slate-400">Weekly</p></div>
              <div className="mt-2 flex items-center gap-1.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-teal-500 text-[7px] font-extrabold text-white">M</span><p className="text-[8px] font-extrabold">Maya · 755 KP</p></div>
              <p className="mt-1.5 text-[6.5px] leading-snug text-slate-400">Log in to see other real students.</p>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-white/10 p-2.5">
              <p className="flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wide text-slate-500"><TrendingUp size={9} className="text-teal-600" />Performance</p>
              <div className="mt-2 flex items-center gap-2">
                <ProgressRing percent={100} />
                <div><p className="text-[9px] font-extrabold">Level 2</p><p className="text-[7px] font-bold text-slate-500">Learner</p></div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-[7px] font-bold text-slate-500"><span className="flex items-center gap-0.5"><Zap size={8} className="text-teal-500" fill="currentColor" />755 pts</span><span className="flex items-center gap-0.5"><Flame size={8} className="text-orange-400" fill="currentColor" />4 days</span></div>
            </div>
          </div>
        </div>

        <div className="mt-2.5 hidden rounded-xl border border-slate-100 dark:border-white/10 p-3 sm:block">
          <p className="flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wide text-slate-500"><Target size={9} className="text-violet-500" />Recommended for today</p>
          <p className="mt-2 text-[10px] font-extrabold">Biology · Lesson review</p>
          <p className="mt-1 text-[7px] leading-relaxed text-slate-500">Low confidence and low accuracy—major weakness.</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[7px] font-bold text-slate-500"><span className="text-teal-600">+45 KP</span><span>~25 min</span></span>
            <button type="button" className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-teal-600 px-2.5 py-1 text-[8px] font-extrabold text-white"><Play size={7} fill="currentColor" />Start studying</button>
          </div>
        </div>
      </main>
    </div>
  </div>;

  if (!hero) {
    return <div className="relative">
      <div className="absolute -inset-8 -z-10 rounded-[48px] bg-teal-100/70 dark:bg-teal-500/15 blur-3xl" />
      {card}
    </div>;
  }

  // Hero size: the same premium treatment DashboardHeroScreenshot used
  // (radial-gradient back-light, single rounded-3xl/border-gray-200/
  // shadow-2xl frame with a subtle hover tilt, two glassmorphic floating
  // cards)—just wrapping this coded mockup instead of a real screenshot,
  // so the hero never shows one real account's actual data.
  return <div className="group relative mx-auto max-w-5xl">
    <div className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,155,119,.28),rgba(0,155,119,0)_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(15,139,141,.22),rgba(15,139,141,0)_65%)]" />
    <div className="rounded-3xl border border-gray-200 bg-white p-1.5 shadow-2xl shadow-[#0F1B2B]/15 transition-transform duration-500 ease-out group-hover:-rotate-[0.6deg] group-hover:scale-[1.012] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
      {card}
    </div>

    {/* Top-left — Study Shield streak protection */}
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -left-5 -top-5 z-20 hidden items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl shadow-[#0F1B2B]/10 backdrop-blur-md dark:border-white/10 dark:bg-[#0d1917]/90 sm:flex">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#009B77]/10"><Flame size={17} className="text-[#009B77]" /></span>
      <div>
        <p className="whitespace-nowrap text-xs font-extrabold text-[#0F1B2B] dark:text-white">12 Day Streak</p>
        <p className="whitespace-nowrap text-[10px] font-bold text-[#0F1B2B]/50 dark:text-slate-400">Protected by Study Shield</p>
      </div>
    </motion.div>

    {/* Top-right — Ask Studium AI assistant */}
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: .3 }} className="absolute -right-5 -top-5 z-20 hidden items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl shadow-[#0F1B2B]/10 backdrop-blur-md dark:border-white/10 dark:bg-[#0d1917]/90 sm:flex">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#009B77]/10"><Sparkles size={17} className="text-[#009B77]" /></span>
      <p className="whitespace-nowrap text-xs font-extrabold text-[#0F1B2B] dark:text-white">Ask Studium</p>
    </motion.div>
  </div>;
}
function NavGroup({ label, items, activeIndex = -1 }: { label: string; items: string[]; activeIndex?: number }) {
  return <div className="mb-4 last:mb-0"><p className="mb-1 px-2 text-[7px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>{items.map((x, i) => <div key={x} className={`mb-0.5 rounded-lg px-2 py-1.5 text-[9px] font-bold ${i === activeIndex ? "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "text-slate-500"}`}>{x}</div>)}</div>;
}
function MiniCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) { return <div className="rounded-lg border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-2"><span className={`grid h-5 w-5 place-items-center rounded-md ${color}`}>{icon}</span><p className="mt-1.5 truncate text-[7px] font-medium text-slate-500">{title}</p><p className="mt-0.5 text-[9px] font-extrabold">{value}</p></div>; }
// Small SVG ring (stroke-dasharray trick, not a library) for the
// Performance card—same visual language as the real dashboard's progress
// ring, at mockup scale.
function ProgressRing({ percent }: { percent: number }) {
  const r = 12, c = 2 * Math.PI * r;
  return <svg width="30" height="30" viewBox="0 0 30 30" className="shrink-0 -rotate-90">
    <circle cx="15" cy="15" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-white/10" />
    <circle cx="15" cy="15" r={r} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - percent / 100)} className="text-teal-500" />
  </svg>;
}
export function AIChat() { return <div className="rounded-2xl border border-teal-100 bg-white dark:bg-[#0d1917] p-4 shadow-soft"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-500 text-white"><Bot size={16} /></span><div><p className="text-xs font-extrabold">Studium AI</p><p className="text-[10px] text-teal-600">Online now</p></div></div><div className="mt-5 rounded-xl rounded-tl-sm bg-slate-50 dark:bg-white/5 p-3 text-xs leading-relaxed text-slate-600">Want to revise photosynthesis? I&apos;ve made a 10-minute recap based on your notes.</div><div className="mt-3 flex items-center rounded-xl border bg-white dark:bg-[#0d1917] px-3 py-2 text-[11px] text-slate-500">Ask anything...<Send size={14} className="ml-auto text-teal-500" /></div></div>; }
