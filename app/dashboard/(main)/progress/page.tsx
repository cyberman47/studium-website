"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award, Bone, BookA, BookOpen, Bot, Brain, CheckCircle2, ClipboardCheck, Clock3, Flame,
  FileText, GraduationCap, HeartPulse, Layers, Lightbulb, Lock, Map as MapIcon, Medal, PartyPopper,
  Sparkles, Star, Stethoscope, Target, TrendingUp, Trophy
} from "lucide-react";
import { Reveal } from "@/components/ui";
import { showKnowledgeToast } from "@/lib/kpToast";
import {
  Achievement, ClaimResult, claimStudySession,
  getAchievements, getAverageQuizScore, getDaysActive, getKPGrowthSeries, getLevelInfo, getLongestStreak,
  getRewardsStatus, getStats, getStreak, getTotalHours, getTotalKP, getWeeklyActivity, KPGrowthPoint,
  LevelInfo, levelDefs, recordVisit, rewardDefs, Stats
} from "@/lib/progress";
import { getTerminologyStats, TerminologyStats } from "@/lib/terminology";
import {
  EvolvingInsight, getEvolvingInsight, getLearningProfileInsights, getMedicalJourneySections, getMedicalProfile,
  getStrengthsWeaknesses, JourneySection, LearningInsight, MedicalProfile, StrengthsWeaknesses
} from "@/lib/medicalProfile";
import { SectionTour } from "@/components/product-tour/SectionTour";
import { progressTourSteps } from "@/lib/productTour";

const rewardIcons: Record<string, typeof Flame> = {
  dailyLogin: Flame,
  studySession: BookOpen,
  flashcards100: Brain,
  aiQuiz: ClipboardCheck,
  dailyGoal: Target,
  clinicalCase: Stethoscope,
  termsReviewed: BookA,
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

const emptyStats: Stats = { studySessions: 0, flashcardsCompleted: 0, aiQuizzesCompleted: 0, studyMinutes: 0, notesCreated: 0, aiChats: 0, quizScores: [], longestSessionMinutes: 0, casesCompleted: 0, lessonsCreated: 0, flashcardsCreated: 0, quizzesCreated: 0, materialsUploaded: 0 };
const emptyWeekly = { minutes: 0, flashcards: 0, notes: 0, aiChats: 0, quizzes: 0 };
const emptyTermStats: TerminologyStats = { totalLearned: 0, masteredCount: 0, dueForReview: 0, masteryPercent: 0, todayCount: 0, dailyGoal: 20 };
const emptyMedicalProfile: MedicalProfile = {
  subjects: [], subjectsMasteredCount: 0, strongestSubject: null, weakestSubject: null,
  learningConsistencyPercent: 0, questionAccuracyPercent: null, questionsAnswered: 0, totalKP: 0,
  currentPathLabel: "Your Learning Journey", currentPathEmoji: "🗺️", overallKnowledgeDevelopmentPercent: 0, hasAnyRealData: false,
  trackContentAvailable: true
};
const emptyStrengthsWeaknesses: StrengthsWeaknesses = { strengths: [], weaknesses: [], recommendation: null };

// Mastery-status visual language (spec: "not simply percentages")—one
// consistent color/weight per status everywhere it appears on this page.
const masteryStyles: Record<string, string> = {
  Mastered: "bg-teal-600 text-white",
  Strong: "bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700",
  Developing: "bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-700",
  "Needs Work": "bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300 text-rose-700",
  Unfamiliar: "bg-slate-100 dark:bg-white/10 text-slate-400"
};

function EmptyNote({ text }: { text: string }) {
  return <p className="mt-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 text-xs leading-relaxed text-slate-400">{text}</p>;
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-100 dark:border-white/10 bg-white/80 dark:bg-[#0d1917]/80 p-4 backdrop-blur">
    <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 truncate text-base font-extrabold text-heading">{value}</p>
  </div>;
}

// Builds a small SVG area+line path for the Knowledge Growth chart from a
// real cumulative-KP series—no charting dependency, just plain coordinate
// math, so an all-zero (brand-new account) series still renders a flat,
// honest line at the bottom instead of erroring or faking a curve.
function buildGrowthPaths(points: KPGrowthPoint[], width: number, height: number, padding = 6) {
  if (points.length === 0) return { line: "", area: "" };
  const values = points.map(p => p.cumulativeKP);
  const max = Math.max(...values, 1);
  const min = Math.min(0, ...values);
  const range = Math.max(1, max - min);
  const stepX = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const coords = values.map((v, i) => {
    const x = padding + i * stepX;
    const y = padding + (height - padding * 2) * (1 - (v - min) / range);
    return [x, y] as const;
  });
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${coords[coords.length - 1][0].toFixed(1)},${height - padding} L${coords[0][0].toFixed(1)},${height - padding} Z`;
  return { line, area };
}

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
  const [termStats, setTermStats] = useState<TerminologyStats>(emptyTermStats);

  // Real Medical Profile data—lib/medicalProfile.ts, built on top of the
  // Study Planner's real per-subject signals. Refreshed on every
  // refreshAll() call alongside everything else on this page.
  const [profile, setProfile] = useState<MedicalProfile>(emptyMedicalProfile);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [journey, setJourney] = useState<JourneySection[]>([]);
  const [strengthsWeaknesses, setStrengthsWeaknesses] = useState<StrengthsWeaknesses>(emptyStrengthsWeaknesses);
  const [evolvingInsight, setEvolvingInsight] = useState<EvolvingInsight>(null);
  const [growthSeries, setGrowthSeries] = useState<KPGrowthPoint[]>([]);

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
    setTermStats(getTerminologyStats());
    setProfile(getMedicalProfile());
    setInsights(getLearningProfileInsights());
    setJourney(getMedicalJourneySections());
    setStrengthsWeaknesses(getStrengthsWeaknesses());
    setEvolvingInsight(getEvolvingInsight());
    setGrowthSeries(getKPGrowthSeries(30));
  }

  useEffect(() => {
    recordVisit();
    refreshAll();
  }, []);

  // Only Study Session still needs a manual "Claim" button—100 Flashcards
  // and AI Quiz are now auto-detected for real (lib/progress.ts's
  // ensureFlashcards100Claimed, and the Quizzes page's real completion
  // handler), so a manual claim for those would let a student self-award KP
  // for something they didn't do.
  const claimFns: Record<string, () => ClaimResult> = {
    studySession: claimStudySession
  };

  function handleClaim(id: string) {
    const result = claimFns[id]();
    if (!result.awarded) return;
    refreshAll();
    showKnowledgeToast(result.kpAwarded);
    if (result.newlyUnlockedAchievements.length) {
      setJustUnlockedIds(new Set(result.newlyUnlockedAchievements));
      setTimeout(() => setJustUnlockedIds(new Set()), 2000);
    }
    if (result.leveledUp) {
      const info = getLevelInfo(result.totalKP);
      setLevelUpInfo({ level: info.level, name: info.name });
    }
  }

  const growthPaths = useMemo(() => buildGrowthPaths(growthSeries, 600, 160), [growthSeries]);

  const performanceStats = [
    { label: "Knowledge Points", value: `${totalKP.toLocaleString()} KP`, icon: Star },
    { label: "Questions answered", value: profile.questionsAnswered.toLocaleString(), icon: ClipboardCheck },
    { label: "Accuracy", value: profile.questionAccuracyPercent !== null ? `${profile.questionAccuracyPercent}%` : "—", icon: Target },
    { label: "Topics studied", value: `${profile.subjects.filter(s => s.hasData).length}`, icon: BookOpen },
    { label: "Study consistency", value: `${profile.learningConsistencyPercent}%`, icon: Flame },
    { label: "Current streak", value: `${streak} day${streak === 1 ? "" : "s"}`, icon: Trophy },
    { label: "Total study time", value: `${totalHours} hrs`, icon: Clock3 }
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
    { label: "Terms Learned", value: termStats.totalLearned.toLocaleString() },
    { label: "Terms Mastered", value: termStats.masteredCount.toLocaleString() },
    { label: "Lessons Created", value: stats.lessonsCreated.toLocaleString() },
    { label: "Flashcards Created", value: stats.flashcardsCreated.toLocaleString() },
    { label: "Quizzes Created", value: stats.quizzesCreated.toLocaleString() },
    { label: "Materials Uploaded", value: stats.materialsUploaded.toLocaleString() },
    { label: "Current Streak", value: `${streak} days` },
    { label: "Longest Streak", value: `${longestStreak} days` }
  ];

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Progress</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Who you're becoming.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Studium doesn't just track hours—it learns what kind of student you are from what you actually study, answer, and improve at.</p>

    {/* Your Medical Profile—the page's visual centerpiece. Tour anchor lives
        here, not on the whole <section>—see the same note on
        app/dashboard/(main)/flashcards/page.tsx. */}
    <Reveal>
      <div data-tour="progress-main" className="relative mt-10 overflow-hidden rounded-3xl border border-teal-100 dark:border-teal-500/20 bg-gradient-to-br from-teal-50 via-white to-white dark:from-[#0d2b29] dark:via-[#0d1917] dark:to-[#0d1917] p-7 shadow-soft dark:shadow-none sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-200/40 dark:bg-teal-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="eyebrow"><Sparkles size={13} />Your Medical Profile</span>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500">A living picture of your knowledge—built from what you've actually studied and answered, not a guess.</p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-white/85 dark:bg-[#0d1917]/85 px-5 py-3 text-right backdrop-blur">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Current path</p>
            <p className="mt-0.5 text-sm font-extrabold text-heading">{profile.currentPathEmoji} {profile.currentPathLabel}</p>
          </div>
        </div>

        {profile.hasAnyRealData ? <>
          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {profile.subjects.filter(s => s.hasData).slice(0, 8).map(s => <Link key={s.subjectId} href={s.href} className="group rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-lg">{s.emoji}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${masteryStyles[s.status]}`}>{s.status}</span>
              </div>
              <p className="mt-2 truncate text-sm font-bold text-heading">{s.subjectName}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500" style={{ width: `${s.score}%` }} /></div>
              <p className="mt-1 text-[11px] font-bold text-slate-400">{s.score}%</p>
            </Link>)}
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ProfileStat label="Strength" value={profile.strongestSubject ? `${profile.strongestSubject.emoji} ${profile.strongestSubject.subjectName}` : "—"} />
            <ProfileStat label="Needs work" value={profile.weakestSubject ? `${profile.weakestSubject.emoji} ${profile.weakestSubject.subjectName}` : "—"} />
            <ProfileStat label="Subjects mastered" value={`${profile.subjectsMasteredCount}`} />
            <ProfileStat label="Knowledge Points" value={profile.totalKP.toLocaleString()} />
          </div>
        </> : <div className="relative mt-7 rounded-2xl border border-dashed border-teal-200 bg-white/70 dark:bg-[#0d1917]/70 p-6 text-center">
          {profile.trackContentAvailable ? <>
            <p className="text-sm font-bold text-heading">Your profile is still forming.</p>
            <p className="mt-1 text-xs text-slate-500">Complete a lesson, a practice quiz, or a flashcard session—this fills in with your real subject-by-subject mastery.</p>
          </> : <>
            <p className="text-sm font-bold text-heading">{profile.currentPathEmoji} {profile.currentPathLabel} content is still being built.</p>
            <p className="mt-1 text-xs text-slate-500">Subject-by-subject mastery is only tracked for MCAT Preparation today. Switch tracks from the menu above, or keep an eye out as {profile.currentPathLabel} content lands.</p>
          </>}
        </div>}
      </div>
    </Reveal>

    {/* Your Learning Profile—dynamic, real-data-only insights */}
    <div className="mt-8">
      <h2 className="text-lg font-extrabold tracking-tight">Your Learning Profile</h2>
      <p className="mt-1 text-sm text-slate-500">Generated from your real activity—this evolves the more you use Studium.</p>
      {insights.length > 0 ? <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {insights.map(insight => <div key={insight.title} className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft">
          <span className="text-xl">{insight.emoji}</span>
          <p className="mt-2 text-sm font-extrabold text-heading">{insight.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{insight.description}</p>
        </div>)}
      </div> : <EmptyNote text="Keep studying—insights appear here once there's enough real activity to say something true about how you learn." />}
    </div>

    {/* Performance Overview + Knowledge Growth */}
    <div className="mt-8">
      <h2 className="text-lg font-extrabold tracking-tight">Performance Overview</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {performanceStats.map((stat, i) => <Reveal key={stat.label} delay={i * 0.03}>
          <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><stat.icon size={18} /></span>
            <p className="mt-3 text-xl font-extrabold text-heading">{stat.value}</p>
            <p className="mt-0.5 text-xs font-bold text-slate-500">{stat.label}</p>
          </div>
        </Reveal>)}
      </div>

      <div className="mt-4 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-extrabold text-heading">Knowledge Growth</p>
            <p className="mt-0.5 text-xs text-slate-500">Your cumulative Knowledge Points over the last 30 days.</p>
          </div>
          <TrendingUp size={18} className="shrink-0 text-teal-500" />
        </div>
        <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="mt-4 h-40 w-full">
          <defs><linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" /><stop offset="100%" stopColor="#14b8a6" stopOpacity="0" /></linearGradient></defs>
          {growthPaths.area && <path d={growthPaths.area} fill="url(#growthFill)" />}
          {growthPaths.line && <path d={growthPaths.line} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>{growthSeries[0]?.date ?? ""}</span>
          <span>Today</span>
        </div>
      </div>
    </div>

    {/* Strengths & Weaknesses */}
    <div className="mt-8">
      <h2 className="text-lg font-extrabold tracking-tight">Strengths &amp; Weaknesses</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft">
          <h3 className="text-sm font-extrabold tracking-tight text-heading">Your Strengths</h3>
          {strengthsWeaknesses.strengths.length > 0 ? <div className="mt-4 space-y-3">
            {strengthsWeaknesses.strengths.map((s, i) => <Link key={s.subjectId} href={s.href} className="flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-teal-50/60 dark:bg-teal-500/15">
              <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span>
              <span className="flex-1 truncate text-sm font-bold text-heading">{s.emoji} {s.subjectName}</span>
              <span className="shrink-0 text-sm font-extrabold text-teal-700">{s.score}%</span>
            </Link>)}
          </div> : <EmptyNote text="Your strongest subjects will show up here once you've built a real practice record." />}
        </div>
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft">
          <h3 className="text-sm font-extrabold tracking-tight text-heading">Areas to Improve</h3>
          {strengthsWeaknesses.weaknesses.length > 0 ? <div className="mt-4 space-y-3">
            {strengthsWeaknesses.weaknesses.map(s => <Link key={s.subjectId} href={s.href} className="flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-amber-50/60 dark:bg-amber-500/15">
              <span className="text-lg">⚠️</span>
              <span className="flex-1 truncate text-sm font-bold text-heading">{s.emoji} {s.subjectName}</span>
              <span className="shrink-0 text-sm font-extrabold text-amber-700">{s.score}%</span>
            </Link>)}
          </div> : <EmptyNote text="This fills in once you've built a real practice record in at least two subjects—so there's something honest to contrast." />}
        </div>
      </div>

      {strengthsWeaknesses.recommendation && <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-teal-100 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 p-5">
        <p className="text-sm font-bold text-teal-900 dark:text-teal-300">Studium recommends: {strengthsWeaknesses.recommendation.message}</p>
        <Link href={strengthsWeaknesses.recommendation.href} className="shrink-0 cursor-pointer rounded-full bg-teal-600 px-5 py-2.5 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-teal-700">Study {strengthsWeaknesses.recommendation.subjectName} →</Link>
      </div>}
    </div>

    {/* Medical Journey */}
    <div className="mt-8 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Medical Journey</h2>
          <p className="mt-1 text-sm text-slate-500">{profile.currentPathEmoji} {profile.currentPathLabel}</p>
        </div>
        <MapIcon size={20} className="shrink-0 text-teal-500" />
      </div>
      {journey.length > 0 ? <>
        <div className="mt-5 space-y-4">
          {journey.map(section => <div key={section.sectionId}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500"><span>{section.sectionTitle}</span><span>{section.percent}%</span></div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><motion.div className="h-full rounded-full bg-teal-500" initial={{ width: 0 }} animate={{ width: `${section.percent}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} /></div>
          </div>)}
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-slate-400">This reflects your developing knowledge across foundational science areas—not a prediction of what medical specialty you'll pursue.</p>
      </> : <EmptyNote text={`Foundational-area tracking isn't built for ${profile.currentPathLabel} yet—this fills in on the MCAT Preparation track today.`} />}
    </div>

    {/* Evolving Student Insights—only appears once there's real volume behind it */}
    {evolvingInsight && <div className="mt-8 rounded-3xl border border-teal-100 dark:border-teal-500/20 bg-gradient-to-br from-teal-50 to-white dark:from-[#0d2b29] dark:to-[#0d1917] p-6 shadow-soft dark:shadow-none sm:p-7">
      <span className="eyebrow"><Lightbulb size={13} />New Insight</span>
      <p className="mt-3 text-sm leading-relaxed text-heading">{evolvingInsight.description}</p>
    </div>}

    {/* Rewards & Achievements—kept, but secondary to the Medical Profile above */}
    <div className="mt-14">
      <h2 className="text-lg font-extrabold tracking-tight text-slate-700 dark:text-slate-300">Rewards &amp; Achievements</h2>
      <p className="mt-1 text-sm text-slate-500">Levels, streaks, and lifetime stats—separate from your Medical Profile above, just for motivation.</p>

      <div className="mt-6 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Level {level.level}</p>
            <p className="display mt-1 text-2xl">{level.name}</p>
          </div>
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><Medal size={26} /></span>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{level.totalKP.toLocaleString()} KP</span>
            <span>{level.isMaxLevel ? "Max level reached" : `${level.nextThreshold?.toLocaleString()} KP`}</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <motion.div className="h-full rounded-full bg-teal-500" initial={{ width: 0 }} animate={{ width: `${level.progressPercent}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">{level.isMaxLevel ? "You've reached the highest level—more milestones are coming soon." : `${level.kpForNextLevel.toLocaleString()} KP to Level ${level.level + 1}`}</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {levelDefs.map(def => {
            const reached = level.level >= def.level;
            const current = level.level === def.level;
            return <div key={def.level} className={`rounded-2xl border p-3 text-center ${current ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300" : reached ? "border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917]" : "border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 opacity-50"}`}>
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Lvl {def.level}</p>
              <p className="mt-0.5 truncate text-xs font-bold text-heading">{def.name}</p>
            </div>;
          })}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h3 className="text-base font-extrabold tracking-tight">Daily Rewards</h3>
        <p className="mt-1 text-sm text-slate-500">Earn Knowledge Points for showing up and completing activities.</p>
        <div className="mt-4">
          {rewardDefs.map(reward => {
            const Icon = rewardIcons[reward.id];
            const completed = !!rewardsStatus[reward.id];
            const isCase = reward.id === "clinicalCase";
            const isPlan = reward.id === "dailyGoal";
            const isTerms = reward.id === "termsReviewed";
            const claimable = reward.id === "studySession" && !completed;
            return <div key={reward.id} className="relative flex flex-wrap items-center gap-4 border-b border-slate-100 dark:border-white/10 py-4 last:border-0 last:pb-0">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${completed ? "bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700" : "bg-slate-100 dark:bg-white/10 text-slate-400"}`}><Icon size={19} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-heading">{reward.title}</p><span className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-2 py-0.5 text-[11px] font-extrabold text-teal-700">+{reward.kp} KP</span></div>
                <p className="mt-0.5 text-xs text-slate-500">{reward.description}</p>
              </div>
              {claimable
                ? <button type="button" onClick={() => handleClaim(reward.id)} className="shrink-0 cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Claim</button>
                : isCase && !completed
                  ? <Link href="/dashboard/case-of-the-day" className="shrink-0 cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Open case</Link>
                  : isPlan && !completed
                    ? <Link href="/dashboard" className="shrink-0 cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">View plan</Link>
                    : isTerms && !completed
                      ? <Link href="/dashboard/terminology/review" className="shrink-0 cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_20px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Review terms</Link>
                      : completed
                      ? <span className="flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-teal-600"><CheckCircle2 size={16} />{reward.kind === "milestone" ? "Unlocked" : "Done today"}</span>
                      : <span className="shrink-0 text-xs font-bold text-slate-400">Not yet</span>}
            </div>;
          })}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-extrabold tracking-tight">Weekly Activity</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {weeklyCards.map(card => <div key={card.label} className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><card.icon size={17} /></span>
            <p className="mt-3 text-xl font-extrabold text-heading">{card.value}</p>
            <p className="mt-0.5 text-xs font-bold text-slate-500">{card.label}</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500" style={{ width: `${card.percent}%` }} /></div>
          </div>)}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-extrabold tracking-tight">Achievements</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {achievements.map(a => {
            const Icon = achievementIcons[a.id];
            const justUnlocked = justUnlockedIds.has(a.id);
            return <motion.div key={a.id}
              initial={justUnlocked ? { scale: 0.5, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className={`flex flex-col items-center rounded-3xl border p-5 text-center ${a.unlocked ? "border-teal-100 dark:border-teal-500/20 bg-white dark:bg-[#0d1917] shadow-soft" : "border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5"}`}
            >
              <span className={`grid h-14 w-14 place-items-center rounded-2xl ${a.unlocked ? "bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700" : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500"}`}>
                {a.unlocked ? <Icon size={24} /> : <Lock size={20} />}
              </span>
              <p className={`mt-3 text-sm font-extrabold ${a.unlocked ? "text-heading" : "text-slate-400"}`}>{a.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{a.unlocked ? "Unlocked" : a.requirement}</p>
            </motion.div>;
          })}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h3 className="text-base font-extrabold tracking-tight">Lifetime Statistics</h3>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
          {statisticsList.map(stat => <div key={stat.label}>
            <p className="text-lg font-extrabold text-heading">{stat.value}</p>
            <p className="mt-0.5 text-xs font-bold text-slate-500">{stat.label}</p>
          </div>)}
        </div>
      </div>

      <p className="mt-8 px-1 text-xs leading-relaxed text-slate-400">The Study Session reward above is claimed manually—there's no single event that reliably marks "a study session" happened. 100 Flashcards and AI Quiz now claim themselves the moment you actually hit 100 real flashcards or finish a real AI-generated quiz. Everything on this page—KP, streaks, levels, achievements, and your Medical Profile above—is genuinely tracked from what you do in this browser.</p>
    </div>

    {/* Level-up modal */}
    <AnimatePresence>
      {levelUpInfo && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setLevelUpInfo(null)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0d1917] p-8 text-center shadow-lift"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-600"><PartyPopper size={30} /></span>
          <h2 className="display mt-5 text-2xl">🎉 Level Up!</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Congratulations! You've reached <span className="font-extrabold text-heading">Level {levelUpInfo.level} · {levelUpInfo.name}</span>.</p>
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Awesome!</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
    <SectionTour id="progress" steps={progressTourSteps} />
  </section>;
}
