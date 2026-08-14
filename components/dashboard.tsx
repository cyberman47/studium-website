"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Bot, Clock3, Flame, Play, Search, Send, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import Image from "next/image";

export function DashboardMockup({ hero = false }: { hero?: boolean }) {
  // The browser-window chrome (traffic lights + address bar) below is
  // shared by both sizes; hero-only adds a wider frame and a "glass tray"
  // wrapper—a soft translucent, blurred border-panel the window itself
  // sits inside, which is what makes it read as anchoring the whole page
  // rather than floating loose over the background. The content inside
  // mirrors the real dashboard (grouped sidebar, Continue Studying, Daily
  // Case Challenge, Study Planner, Leaderboard) rather than a generic
  // placeholder screen, so the preview is honest about what the app
  // actually looks like.
  return <div className={`relative ${hero ? "mx-auto max-w-5xl" : ""}`}>
    <div className={`absolute -inset-8 -z-10 rounded-[48px] bg-teal-100/70 dark:bg-teal-500/15 blur-3xl ${hero ? "sm:-inset-12" : ""}`} />
    <div className={hero ? "rounded-[30px] border border-white/60 bg-white/40 p-2.5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] sm:p-3.5" : ""}>
      <div className="overflow-hidden rounded-[22px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-[0_32px_80px_-30px_rgba(15,60,61,.35)]">
        <div className="flex h-11 items-center gap-1.5 border-b bg-slate-50/80 dark:bg-white/5 px-4"><i className="h-2 w-2 rounded-full bg-[#ff625b]" /><i className="h-2 w-2 rounded-full bg-[#ffbd44]" /><i className="h-2 w-2 rounded-full bg-[#00ca4e]" /><div className="ml-4 h-5 w-36 rounded-md bg-white dark:bg-[#0d1917]" /></div>
        <div className="flex min-h-[330px] sm:min-h-[410px]">
          <aside className="hidden w-40 shrink-0 border-r bg-[#fbfcfc] dark:bg-[#070d0c] p-4 sm:block">
            <div className="mb-6 flex items-center"><Image src="/images/studium-logo-full.png" alt="Studium" width={779} height={303} className="h-4 w-auto object-contain" /></div>
            <NavGroup label="Study" items={["Home", "Learning Paths", "Study Planner"]} activeIndex={0} />
            <NavGroup label="Review" items={["Flashcards", "Terminology"]} />
            <NavGroup label="Tools" items={["Studium AI", "Progress"]} />
          </aside>
          <main className="min-w-0 flex-1 p-4 sm:p-6">
            <div className="flex items-center gap-2.5">
              <div className="hidden h-7 flex-1 items-center rounded-lg border border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 text-[8px] font-medium text-slate-400 sm:flex"><Search size={9} className="mr-1.5" />Search...</div>
              <div className="ml-auto flex shrink-0 items-center gap-1.5">
                <span className="hidden items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-500/15 px-2 py-1 text-[7px] font-extrabold text-teal-700 dark:text-teal-300 md:inline-flex">🚀 MCAT Prep</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-500/15 px-2 py-1 text-[7px] font-extrabold text-teal-700 dark:text-teal-300"><Flame size={9} className="text-orange-400" fill="currentColor" />4d</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-teal-500 text-[8px] font-extrabold text-white">M</span>
              </div>
            </div>
            <h3 className="mt-3.5 text-sm font-extrabold tracking-tight sm:text-base">Good morning, Maya <span>✦</span></h3>

            <div className="mt-3 grid gap-2.5 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 p-3 text-white sm:p-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[7px] font-extrabold uppercase tracking-wide"><Zap size={8} fill="currentColor" />Continue Studying</span>
                <p className="mt-2 text-sm font-extrabold sm:text-base">Cell Structure</p>
                <p className="mt-0.5 text-[8px] text-teal-100">Next lesson · 2/9 in Biology</p>
                <button type="button" className="mt-2.5 inline-flex cursor-pointer items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[8px] font-extrabold text-teal-700"><Play size={7} fill="currentColor" />Resume</button>
              </div>
              <div className="hidden rounded-xl bg-ink p-3 text-white sm:block">
                <p className="text-[7px] font-extrabold uppercase tracking-wide text-teal-300">Daily Case Challenge</p>
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
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[8px]"><span className="font-bold text-slate-500">Today&apos;s goal</span><span className="font-extrabold">90 / 15 KP</span></div>
                  <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full w-[85%] rounded-full bg-teal-500" /></div>
                  <div className="flex items-center justify-between pt-1 text-[8px]"><span className="font-bold text-slate-500">Exam readiness</span><span className="font-extrabold">25%</span></div>
                  <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full w-[25%] rounded-full bg-accent-500" /></div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <MiniCard icon={<Clock3 size={12} />} title="Study time" value="1h 24m" color="bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300 text-violet-500" />
                  <MiniCard icon={<Target size={12} />} title="Mastery" value="22%" color="bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600" />
                </div>
              </div>
              <div className="hidden flex-col gap-2.5 sm:flex">
                <div className="rounded-xl border border-slate-100 dark:border-white/10 p-2.5">
                  <p className="flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wide text-slate-500"><Trophy size={9} className="text-amber-500" />Leaderboard</p>
                  <div className="mt-2 flex items-center gap-1.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-teal-500 text-[7px] font-extrabold text-white">M</span><p className="text-[8px] font-extrabold">755 KP this week</p></div>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-white/10 p-2.5">
                  <p className="flex items-center gap-1 text-[7px] font-extrabold uppercase tracking-wide text-slate-500"><TrendingUp size={9} className="text-teal-600" />Performance</p>
                  <p className="mt-2 text-[10px] font-extrabold">Level 2 · Learner</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
    {hero && <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -right-5 -top-4 hidden rounded-2xl border border-white/70 bg-white/90 dark:bg-[#0d1917]/90 dark:border-white/10 p-3 shadow-lift backdrop-blur sm:block"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-600"><Bot size={14} /></span><div><p className="text-[9px] font-extrabold">Ask Studium</p><p className="text-[8px] text-slate-500">Always here to help</p></div></div></motion.div>}
  </div>;
}
function NavGroup({ label, items, activeIndex = -1 }: { label: string; items: string[]; activeIndex?: number }) {
  return <div className="mb-4 last:mb-0"><p className="mb-1 px-2 text-[7px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>{items.map((x, i) => <div key={x} className={`mb-0.5 rounded-lg px-2 py-1.5 text-[9px] font-bold ${i === activeIndex ? "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "text-slate-500"}`}>{x}</div>)}</div>;
}
function MiniCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) { return <div className="rounded-lg border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-2"><span className={`grid h-5 w-5 place-items-center rounded-md ${color}`}>{icon}</span><p className="mt-1.5 truncate text-[7px] font-medium text-slate-500">{title}</p><p className="mt-0.5 text-[9px] font-extrabold">{value}</p></div>; }
export function AIChat() { return <div className="rounded-2xl border border-teal-100 bg-white dark:bg-[#0d1917] p-4 shadow-soft"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-500 text-white"><Bot size={16} /></span><div><p className="text-xs font-extrabold">Studium AI</p><p className="text-[10px] text-teal-600">Online now</p></div></div><div className="mt-5 rounded-xl rounded-tl-sm bg-slate-50 dark:bg-white/5 p-3 text-xs leading-relaxed text-slate-600">Want to revise photosynthesis? I&apos;ve made a 10-minute recap based on your notes.</div><div className="mt-3 flex items-center rounded-xl border bg-white dark:bg-[#0d1917] px-3 py-2 text-[11px] text-slate-500">Ask anything...<Send size={14} className="ml-auto text-teal-500" /></div></div>; }
