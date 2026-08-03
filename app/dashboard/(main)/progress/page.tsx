"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award, Bone, BookOpen, Bot, Brain, CheckCircle2, ClipboardCheck, Clock3, Flame,
  FileText, GraduationCap, HeartPulse, Layers, Lock, Medal, PartyPopper, Sparkles, Star, Stethoscope, Target, Trophy
} from "lucide-react";
import { Reveal } from "@/components/ui";
import {
  Achievement, ClaimResult, claimAIQuiz, claimFlashcards100, claimStudySession,
  getAchievements, getAverageQuizScore, getDaysActive, getLevelInfo, getLongestStreak, getRewardsStatus, getStats,
  getStreak, getTotalHours, getTotalKP, getWeeklyActivity, LevelInfo, levelDefs, recordVisit, rewardDefs, Stats
} from "@/lib/progress";

const rewardIcons: Record<string, typeof Flame> = {
  dailyLogin: Flame,
  studySession: BookOpen,
  flashcards100: Brain,
  aiQuiz: ClipboardCheck,
  dailyGoal: Target,
  clinicalCase: Stethoscope,
  streak7: Trophy,
  streak30: Award
};

const achievementIcons: Record<string, typeof Flame> = {
  firstSession: BookOpen,
  streak7Days: Flame,
  flashcards1000: Brain,
  sessions100: GraduationCap,
  kp10000: Trophy,
  perfectQuiz: Target,
  anatomyMaster: Bone,
  cardiologyExpert: HeartPulse
};

const emptyStats: Stats = { studySessions: 0, flashcardsCompleted: 0, aiQuizzesCompleted: 0, studyMinutes: 0, notesCreated: 0, aiChats: 0, quizScores: [], longestSessionMinutes: 0, casesCompleted: 0 };
const emptyWeekly = { minutes: 0, flashcards: 0, notes: 0, aiChats: 0, quizzes: 0 };

export default function ProgressPage() {
  const [totalKP, setTotalKP] = useState(0);
  const [level, setLevel] = useState<LevelInfo>(getLevelInfo(0));
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [weekly, setWeekly] = useState(emptyWeekly);
  const [daysActive, setDaysActive] = useState(0);
  const [avgQuizScore, setAvgQuizScore] = useState<number | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [rewardsStatus, setRewardsStatus] = useState<Record<string, boolean>>({});
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [floatingReward, setFloatingReward] = useState<{ id: string; amount: number } | null>(null);
  const [justUnlockedIds, setJustUnlockedIds] = useState<Set<string>>(new Set());
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);

  function refreshAll() {
    const kp = getTotalKP();
    setTotalKP(kp);
    setLevel(getLevelInfo(kp));
    setStreak(getStreak());
    setLongestStreak(getLongestStreak());
    setStats(getStats());
    setWeekly(getWeeklyActivity());
    setDaysActive(getDaysActive());
    setAvgQuizScore(getAverageQuizScore());
    setTotalHours(getTotalHours());
    setRewardsStatus(getRewardsStatus());
    setAchievements(getAchievements());
  }

  useEffect(() => {
    recordVisit();
    refreshAll();
  }, []);

  const claimFns: Record<string, () => ClaimResult> = {
    studySession: claimStudySession,
    flashcards100: claimFlashcards100,
    aiQuiz: claimAIQuiz
  };

  function handleClaim(id: string) {
    const result = claimFns[id]();
    if (!result.awarded) return;
    refreshAll();
    setFloatingReward({ id, amount: result.kpAwarded });
    setTimeout(() => setFloatingReward(null), 1100);
    if (result.newlyUnlockedAchievements.length) {
      setJustUnlockedIds(new Set(result.newlyUnlockedAchievements));
      setTimeout(() => setJustUnlockedIds(new Set()), 2000);
    }
    if (result.leveledUp) {
      const info = getLevelInfo(result.totalKP);
      setLevelUpInfo({ level: info.level, name: info.name });
    }
  }

  const overviewStats = [
    { label: "Current Level", value: `${level.level} · ${level.name}`, icon: Medal },
    { label: "Total KP Earned", value: totalKP.toLocaleString(), icon: Star },
    { label: "Current Streak", value: `${streak} day${streak === 1 ? "" : "s"}`, icon: Flame },
    { label: "Longest Streak", value: `${longestStreak} day${longestStreak === 1 ? "" : "s"}`, icon: Trophy },
    { label: "Study Sessions", value: stats.studySessions.toLocaleString(), icon: BookOpen },
    { label: "Flashcards Completed", value: stats.flashcardsCompleted.toLocaleString(), icon: Layers },
    { label: "AI Quizzes Completed", value: stats.aiQuizzesCompleted.toLocaleString(), icon: ClipboardCheck },
    { label: "Total Study Time", value: `${totalHours} hrs`, icon: Clock3 }
  ];

  const weeklyCards = [
    { label: "Study Time", value: `${Math.round((weekly.minutes / 60) * 10) / 10} hrs`, percent: Math.min(100, (weekly.minutes / 600) * 100), icon: Clock3 },
    { label: "Flashcards Completed", value: weekly.flashcards.toLocaleString(), percent: Math.min(100, (weekly.flashcards / 500) * 100), icon: Layers },
    { label: "Notes Created", value: weekly.notes.toLocaleString(), percent: Math.min(100, (weekly.notes / 10) * 100), icon: FileText },
    { label: "AI Chats", value: weekly.aiChats.toLocaleString(), percent: Math.min(100, (weekly.aiChats / 20) * 100), icon: Bot },
    { label: "Quizzes Completed", value: weekly.quizzes.toLocaleString(), percent: Math.min(100, (weekly.quizzes / 5) * 100), icon: ClipboardCheck }
  ];

  const statisticsList = [
    { label: "Hours Studied", value: `${totalHours} hrs` },
    { label: "Days Active", value: daysActive.toLocaleString() },
    { label: "Flashcards Reviewed", value: stats.flashcardsCompleted.toLocaleString() },
    { label: "Notes Created", value: stats.notesCreated.toLocaleString() },
    { label: "AI Questions Asked", value: stats.aiChats.toLocaleString() },
    { label: "Average Quiz Score", value: avgQuizScore !== null ? `${avgQuizScore}%` : "—" },
    { label: "Longest Study Session", value: `${stats.longestSessionMinutes} min` },
    { label: "Clinical Cases Solved", value: stats.casesCompleted.toLocaleString() },
    { label: "Current Streak", value: `${streak} days` },
    { label: "Longest Streak", value: `${longestStreak} days` }
  ];

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Progress &amp; Rewards</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Your progress.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Every session, streak, and quiz adds up. Here's the full picture of how far you've come.</p>

    {/* 1. Progress overview */}
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {overviewStats.map((stat, i) => <Reveal key={stat.label} delay={i * 0.04}>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-100 text-teal-700"><stat.icon size={18} /></span>
          <p className="mt-3 text-xl font-extrabold text-ink">{stat.value}</p>
          <p className="mt-0.5 text-xs font-bold text-slate-500">{stat.label}</p>
        </div>
      </Reveal>)}
    </div>

    {/* 4. Level system */}
    <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Level {level.level}</p>
          <p className="display mt-1 text-2xl">{level.name}</p>
        </div>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 text-teal-700"><Medal size={26} /></span>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>{level.totalKP.toLocaleString()} KP</span>
          <span>{level.isMaxLevel ? "Max level reached" : `${level.nextThreshold?.toLocaleString()} KP`}</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div className="h-full rounded-full bg-teal-500" initial={{ width: 0 }} animate={{ width: `${level.progressPercent}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">{level.isMaxLevel ? "You've reached the highest level—more milestones are coming soon." : `${level.kpForNextLevel.toLocaleString()} KP to Level ${level.level + 1}`}</p>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {levelDefs.map(def => {
          const reached = level.level >= def.level;
          const current = level.level === def.level;
          return <div key={def.level} className={`rounded-2xl border p-3 text-center ${current ? "border-teal-500 bg-teal-50" : reached ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-50"}`}>
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Lvl {def.level}</p>
            <p className="mt-0.5 truncate text-xs font-bold text-ink">{def.name}</p>
          </div>;
        })}
      </div>
    </div>

    {/* 2. Daily rewards */}
    <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
      <h2 className="text-lg font-extrabold tracking-tight">Daily Rewards</h2>
      <p className="mt-1 text-sm text-slate-500">Earn Knowledge Points for showing up and completing activities.</p>
      <div className="mt-4">
        {rewardDefs.map(reward => {
          const Icon = rewardIcons[reward.id];
          const completed = !!rewardsStatus[reward.id];
          const isCase = reward.id === "clinicalCase";
          const isPlan = reward.id === "dailyGoal";
          const claimable = reward.kind === "daily" && reward.id !== "dailyLogin" && !isCase && !isPlan && !completed;
          return <div key={reward.id} className="relative flex flex-wrap items-center gap-4 border-b border-slate-100 py-4 last:border-0 last:pb-0">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${completed ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-400"}`}><Icon size={19} /></span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-ink">{reward.title}</p><span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-extrabold text-teal-700">+{reward.kp} KP</span></div>
              <p className="mt-0.5 text-xs text-slate-500">{reward.description}</p>
            </div>
            {claimable
              ? <button type="button" onClick={() => handleClaim(reward.id)} className="shrink-0 cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Claim</button>
              : isCase && !completed
                ? <Link href="/dashboard/case-of-the-day" className="shrink-0 cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Open case</Link>
                : isPlan && !completed
                  ? <Link href="/dashboard/study-plan" className="shrink-0 cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">View plan</Link>
                  : completed
                    ? <span className="flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-teal-600"><CheckCircle2 size={16} />{reward.kind === "milestone" ? "Unlocked" : "Done today"}</span>
                    : <span className="shrink-0 text-xs font-bold text-slate-400">Not yet</span>}
            <AnimatePresence>
              {floatingReward?.id === reward.id && <motion.span
                initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -28 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
                className="pointer-events-none absolute right-4 top-1 text-sm font-extrabold text-teal-600"
              >+{floatingReward.amount} KP</motion.span>}
            </AnimatePresence>
          </div>;
        })}
      </div>
    </div>

    {/* 3. Weekly progress */}
    <div className="mt-8">
      <h2 className="text-lg font-extrabold tracking-tight">Weekly Progress</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {weeklyCards.map(card => <div key={card.label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-100 text-teal-700"><card.icon size={17} /></span>
          <p className="mt-3 text-xl font-extrabold text-ink">{card.value}</p>
          <p className="mt-0.5 text-xs font-bold text-slate-500">{card.label}</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${card.percent}%` }} /></div>
        </div>)}
      </div>
    </div>

    {/* 5. Achievements */}
    <div className="mt-8">
      <h2 className="text-lg font-extrabold tracking-tight">Achievements</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {achievements.map(a => {
          const Icon = achievementIcons[a.id];
          const justUnlocked = justUnlockedIds.has(a.id);
          return <motion.div key={a.id}
            initial={justUnlocked ? { scale: 0.5, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className={`flex flex-col items-center rounded-3xl border p-5 text-center ${a.unlocked ? "border-teal-100 bg-white shadow-soft" : "border-slate-100 bg-slate-50"}`}
          >
            <span className={`grid h-14 w-14 place-items-center rounded-2xl ${a.unlocked ? "bg-teal-100 text-teal-700" : "bg-slate-200 text-slate-400"}`}>
              {a.unlocked ? <Icon size={24} /> : <Lock size={20} />}
            </span>
            <p className={`mt-3 text-sm font-extrabold ${a.unlocked ? "text-ink" : "text-slate-400"}`}>{a.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{a.unlocked ? "Unlocked" : a.requirement}</p>
          </motion.div>;
        })}
      </div>
    </div>

    {/* 6. Statistics */}
    <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
      <h2 className="text-lg font-extrabold tracking-tight">Lifetime Statistics</h2>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
        {statisticsList.map(stat => <div key={stat.label}>
          <p className="text-lg font-extrabold text-ink">{stat.value}</p>
          <p className="mt-0.5 text-xs font-bold text-slate-500">{stat.label}</p>
        </div>)}
      </div>
    </div>

    <p className="mt-8 px-1 text-xs leading-relaxed text-slate-400">This is a demo Progress &amp; Rewards system—daily activities here are simulated with "Claim" buttons since flashcards, quizzes, and notes aren't fully built yet. KP, streaks, levels, and achievements are genuinely tracked in this browser.</p>

    {/* Level-up modal */}
    <AnimatePresence>
      {levelUpInfo && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setLevelUpInfo(null)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-lift"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-600"><PartyPopper size={30} /></span>
          <h2 className="display mt-5 text-2xl">🎉 Level Up!</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Congratulations! You've reached <span className="font-extrabold text-ink">Level {levelUpInfo.level} · {levelUpInfo.name}</span>.</p>
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Awesome!</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}
