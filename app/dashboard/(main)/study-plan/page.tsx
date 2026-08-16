"use client";

// The AI Study Planner: a personal study coach, not a calendar. Every
// number on this page comes from lib/studyPlanner.ts's deterministic
// engine (itself built entirely from real tracked signals elsewhere in the
// app—lesson completion, quiz accuracy, weak concepts, self-rated
// confidence) with an optional short interpretation layered on top by
// lib/studyPlannerAI.ts. The page stays fully useful with the AI card
// simply absent if that call fails—nothing here depends on it to function.
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, ArrowRight, BookOpen, Calendar, Check, ChevronLeft, ChevronRight, Clock3, Flag, HelpCircle, Layers,
  Sparkles, Target, TrendingDown, TrendingUp, Type, Zap
} from "lucide-react";
import { PROGRESS_EVENT } from "@/lib/progress";
import { getMcatReadiness } from "@/lib/mcatConcepts";
import { PRACTICE_HISTORY_EVENT } from "@/lib/practiceHistory";
import { TERM_PROGRESS_EVENT } from "@/lib/terminology";
import {
  ActivityKind, Adjustment, ConfidenceLevel, ExamConfig, generateDailyPlan, getAdjustments, getAllSubjectSignals,
  getDaysRemaining, getExamConfig, getRealSubjects, getTodayPlannerKPProgress, getTodaysPlan, getWeeklyKPProgress,
  intensityMeta, PlannedTask, RealSubject, refreshTodaysPlan, setExamConfig, setTopicConfidence,
  STUDY_PLANNER_EVENT, SubjectSignals, Weekday, weekdayOptions
} from "@/lib/studyPlanner";
import { getAICallsRemainingToday, refreshAIRecommendation } from "@/lib/studyPlannerAI";

const cardClass = "rounded-3xl border border-black/[0.06] bg-white dark:bg-[#0d1917] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

const activityIcon: Record<ActivityKind, typeof BookOpen> = { lesson: BookOpen, practice: HelpCircle, flashcards: Layers, terminology: Type };

const confidenceOptions: { level: ConfidenceLevel; label: string }[] = [
  { level: 1, label: "I don't understand this" },
  { level: 2, label: "I struggle with this" },
  { level: 3, label: "I somewhat understand this" },
  { level: 4, label: "I'm comfortable with this" },
  { level: 5, label: "I could teach this" }
];

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60), m = total % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function trendIcon(trend: SubjectSignals["trend"]) {
  if (trend === "improving") return <TrendingUp size={12} className="text-teal-600" />;
  if (trend === "declining") return <TrendingDown size={12} className="text-rose-500" />;
  return null;
}

export default function StudyPlanPage() {
  const [loaded, setLoaded] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [creatingMode, setCreatingMode] = useState<"creating" | "updating">("creating");
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [signals, setSignals] = useState<SubjectSignals[]>([]);
  const [plan, setPlan] = useState<ReturnType<typeof getTodaysPlan>>(null);
  const [todayProgress, setTodayProgress] = useState({ earned: 0, target: 0, percent: 0 });
  const [weeklyProgress, setWeeklyProgress] = useState({ earned: 0, target: 0 });
  const [readiness, setReadiness] = useState(0);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  function refresh() {
    const c = getExamConfig();
    setConfig(c);
    setSignals(getAllSubjectSignals());
    setPlan(getTodaysPlan());
    setTodayProgress(getTodayPlannerKPProgress());
    setWeeklyProgress(getWeeklyKPProgress());
    setReadiness(getMcatReadiness().readinessPercent);
    setAdjustments(getAdjustments());
    setLoaded(true);
  }

  // Real adaptive scheduling (spec §8): a practice attempt or a terminology
  // rating anywhere else in the app is exactly the kind of signal change
  // that should shift today's priorities, so those events force a genuine
  // recompute (not just a re-read of the cached plan) rather than waiting
  // for tomorrow's regeneration.
  function onSignalChange() {
    refreshTodaysPlan();
    refresh();
  }

  useEffect(() => {
    refresh();
    window.addEventListener(STUDY_PLANNER_EVENT, refresh);
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener(PRACTICE_HISTORY_EVENT, onSignalChange);
    window.addEventListener(TERM_PROGRESS_EVENT, onSignalChange);
    return () => {
      window.removeEventListener(STUDY_PLANNER_EVENT, refresh);
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener(PRACTICE_HISTORY_EVENT, onSignalChange);
      window.removeEventListener(TERM_PROGRESS_EVENT, onSignalChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runAIRecommendation(force: boolean) {
    setAiLoading(true);
    setAiError("");
    const result = await refreshAIRecommendation(force);
    setAiLoading(false);
    if (!result.ok) setAiError(result.error);
    else refresh();
  }

  // Fallback only: catches a plan that somehow has no cached AI
  // recommendation yet outside of a regeneratePlan run (e.g. this feature
  // shipped after the plan already existed). Gated on !creatingPlan
  // because setExamConfig's change event fires (and this effect's
  // examDate dependency changes) *while* regeneratePlan's own call is
  // already in flight for the exact same change—without this guard, this
  // effect races it and burns a second real request on every setup/edit.
  useEffect(() => {
    if (config && !creatingPlan && !plan?.aiRecommendation && !aiLoading && !aiError) runAIRecommendation(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.examDate]);

  // Owns every "the plan changed" sequence—initial setup, adjusting exam
  // date/hours/days, and re-rating a subject's confidence all funnel
  // through here, showing the loading screen and getting a fresh AI take
  // every time, per your "automatic every time you change your study
  // plan" ask. Kept up here in the parent rather than inside a child
  // component because setExamConfig's own change notification makes THIS
  // component swap render branches synchronously, which would otherwise
  // unmount a child (and any loading state nested inside it) before the
  // async work even finishes.
  async function regeneratePlan(mutate: () => void, mode: "creating" | "updating") {
    setCreatingMode(mode);
    setCreatingPlan(true);
    mutate();
    generateDailyPlan();
    // Real API spend is capped at MAX_AI_CALLS_PER_DAY/day (see
    // lib/studyPlannerAI.ts)—once that's used up, skip straight to a
    // short "your plan updated" beat instead of pretending to think.
    if (getAICallsRemainingToday() > 0) {
      await Promise.all([refreshAIRecommendation(true), new Promise(resolve => setTimeout(resolve, 2400))]);
    } else {
      await new Promise(resolve => setTimeout(resolve, 900));
    }
    refresh();
    setCreatingPlan(false);
  }

  async function activateStudyPlan(input: {
    examDate: string; hoursPerDay: number; availableDays: Weekday[]; overallConfidence: ConfidenceLevel;
    topicDrafts: Record<string, ConfidenceLevel>;
  }) {
    // Order matters: topic confidence must be saved *before* the exam
    // config. setExamConfig's notification is what triggers the very first
    // plan generation—saving confidence afterward would let that first
    // plan get generated and cached with stale "unrated" data, one event
    // tick before the real ratings landed.
    await regeneratePlan(() => {
      for (const [subjectId, level] of Object.entries(input.topicDrafts)) setTopicConfidence(subjectId, level);
      setExamConfig({ examDate: input.examDate, hoursPerDay: input.hoursPerDay, availableDays: input.availableDays, overallConfidence: input.overallConfidence });
    }, "creating");
  }

  function applyConfigEdit(patch: { examDate: string; hoursPerDay: number; availableDays: Weekday[] }) {
    if (!config) return;
    regeneratePlan(() => setExamConfig({ ...patch, overallConfidence: config.overallConfidence }), "updating");
  }

  function applyConfidenceChange(subjectId: string, level: ConfidenceLevel) {
    regeneratePlan(() => setTopicConfidence(subjectId, level), "updating");
  }

  if (!loaded) return null; // hydration-safe: real localStorage reads happen post-mount only

  if (creatingPlan) return <CreatingScreen mode={creatingMode} />;

  if (!config) {
    return <SetupWizard onActivate={activateStudyPlan} />;
  }

  const daysRemaining = getDaysRemaining(config.examDate);
  const intensity = plan ? intensityMeta[plan.intensity] : null;
  const totalMinutes = plan ? plan.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0) : 0;
  const weaknesses = signals.filter(s => s.quadrant.label === "weakness" || s.quadrant.label === "overconfident");
  const strengths = signals.filter(s => s.quadrant.label === "strength");

  return <section className="mx-auto max-w-3xl bg-[#F8FAFC] dark:bg-[#070d0c] px-4 py-10 sm:px-6 sm:py-14">
    <span className="eyebrow"><Sparkles size={13} />Study Planner</span>
    <h1 className="display mt-4 text-3xl leading-tight sm:text-4xl">Your plan adapts as you learn.</h1>

    {/* Header: exam countdown, readiness, KP goals */}
    <div className={`${cardClass} mt-6 grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 sm:p-6`}>
      <HeaderStat icon={Calendar} label="Exam" value={`${daysRemaining}d`} sub="days remaining" />
      <HeaderStat icon={Target} label="Readiness" value={`${readiness}%`} sub="learn + practice" />
      <HeaderStat icon={Zap} label="Today" value={`${todayProgress.target} KP`} sub="daily goal" />
      <HeaderStat icon={Flag} label="This Week" value={`${weeklyProgress.target} KP`} sub="weekly goal" />
    </div>
    <EditPlanBar config={config} onSave={applyConfigEdit} />

    {/* Today's Goal */}
    {plan && intensity && <div className={`${cardClass} mt-4 p-5 sm:p-6`}>
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Today's Goal</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-2xl font-extrabold text-heading"><Target size={20} className="text-[#0F8B8D]" />{plan.kpTarget} KP</span>
        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500"><Clock3 size={14} />Approximately {formatMinutes(totalMinutes)}</span>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-sm font-extrabold"><span>{intensity.emoji}</span>{intensity.label}</p>
      {plan.focusSubjectIds.length > 0 && <p className="mt-1 text-xs text-slate-500">Focus: {signals.filter(s => plan.focusSubjectIds.includes(s.subject.subjectId)).slice(0, 3).map(s => s.subject.subjectName).join(" + ")}</p>}

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-extrabold text-heading">
          <span>{todayProgress.earned} / {todayProgress.target} KP</span>
          <span className="text-slate-400">{Math.max(0, todayProgress.target - todayProgress.earned)} KP remaining</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div className="h-full rounded-full bg-[#0F8B8D] transition-[width] duration-500" style={{ width: `${Math.min(100, todayProgress.percent)}%` }} />
        </div>
      </div>
    </div>}

    {/* AI Recommendation */}
    <div className={`${cardClass} mt-4 p-5 sm:p-6`}>
      <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-400"><Sparkles size={12} className="text-[#0F8B8D]" />Studium AI Recommends</p>
      {plan?.aiRecommendation
        ? <p className="mt-2 text-sm leading-relaxed text-heading">{plan.aiRecommendation}</p>
        : aiLoading
          ? <p className="mt-2 text-sm text-slate-400">Thinking through your recent performance…</p>
          : aiError
            ? <p className="mt-2 text-sm text-slate-400">{aiError} The plan above is still real and fully usable without it.</p>
            : <p className="mt-2 text-sm text-slate-400">No recommendation yet.</p>}
    </div>

    {/* Recent adjustments—transparency for spec §8's adaptive scheduling:
        real, specific reasons the plan changed, not silent reshuffling. */}
    {adjustments.length > 0 && <div className="mt-3 space-y-1.5 rounded-2xl border border-slate-100 dark:border-white/10 bg-white/60 dark:bg-[#0d1917]/60 p-4">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Recent adjustments</p>
      {adjustments.slice(0, 3).map(a => <p key={a.id} className="text-xs text-slate-500">{a.message}</p>)}
    </div>}

    {/* Today's Plan tasks */}
    {plan && plan.tasks.length > 0 && <div className="mt-6 space-y-2.5">
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Today's Plan</p>
      {plan.tasks.map(task => <TaskCard key={task.id} task={task} />)}
    </div>}

    {/* Weaknesses */}
    {weaknesses.length > 0 && <div className="mt-6">
      <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><AlertTriangle size={13} className="text-rose-500" />Needs Attention</p>
      <div className="mt-2.5 space-y-2">
        {weaknesses.map(s => <SubjectSignalCard key={s.subject.subjectId} signals={s} tone="rose" onRate={level => applyConfidenceChange(s.subject.subjectId, level)} />)}
      </div>
    </div>}

    {/* Strengths */}
    {strengths.length > 0 && <div className="mt-6">
      <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Check size={13} className="text-teal-600" />Maintenance—Your Strengths</p>
      <div className="mt-2.5 space-y-2">
        {strengths.map(s => <SubjectSignalCard key={s.subject.subjectId} signals={s} tone="teal" onRate={level => applyConfidenceChange(s.subject.subjectId, level)} />)}
      </div>
    </div>}

    {/* Weekly schedule */}
    <div className={`${cardClass} mt-6 p-5 sm:p-6`}>
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">This Week</p>
      <div className="mt-3 flex items-center justify-between gap-2 text-sm font-bold text-heading">
        <span>{weeklyProgress.earned} / {weeklyProgress.target} KP</span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div className="h-full rounded-full bg-[#0F8B8D] transition-[width] duration-500" style={{ width: `${weeklyProgress.target > 0 ? Math.min(100, Math.round((weeklyProgress.earned / weeklyProgress.target) * 100)) : 0}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {weekdayOptions.map(d => <div key={d.id} className={`rounded-xl py-2 text-center text-[10px] font-extrabold uppercase ${config.availableDays.includes(d.id) ? "bg-[#effbfa] dark:bg-teal-500/15 text-[#0c6c6e]" : "bg-slate-50 dark:bg-white/5 text-slate-300"}`}>{d.label}</div>)}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">Highlighted days are your planned study days ({config.availableDays.length}/week, {config.hoursPerDay}h each).</p>
    </div>

    {signals.length === 0 && <p className="mt-6 text-center text-sm text-slate-400">No MCAT subjects with real content are available to plan around yet.</p>}
  </section>;
}

function HeaderStat({ icon: Icon, label, value, sub }: { icon: typeof Target; label: string; value: string; sub: string }) {
  return <div>
    <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-400"><Icon size={12} className="text-[#0F8B8D]" />{label}</p>
    <p className="mt-1 text-xl font-extrabold text-heading">{value}</p>
    <p className="text-[11px] text-slate-400">{sub}</p>
  </div>;
}

function TaskCard({ task }: { task: PlannedTask }) {
  const Icon = activityIcon[task.activity];
  // Real completion only—this circle is a status indicator, not a button.
  // It reflects lib/studyPlanner.ts's live done-computation (the specific
  // lesson finished, a real practice attempt logged today, a real
  // flashcard/term reviewed today), never a manual self-report.
  return <div className={`${cardClass} flex items-center gap-4 p-4 sm:p-5`}>
    <span
      aria-label={task.done ? "Completed" : "Not yet completed"}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${task.done ? "bg-[#0F8B8D] text-white" : "border-2 border-slate-200 dark:border-white/10 text-transparent"}`}
    >{task.done && <Check size={14} strokeWidth={3} />}</span>
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#effbfa] dark:bg-teal-500/15 text-[#0F8B8D]"><Icon size={18} /></span>
    <span className="min-w-0 flex-1">
      <span className={`block truncate text-sm font-extrabold ${task.done ? "text-slate-400 line-through" : "text-heading"}`}>{task.subjectName} — {task.label}</span>
      <span className="mt-0.5 block truncate text-xs text-slate-500">{task.priorityReason}</span>
      <span className="mt-0.5 flex items-center gap-2 text-[11px] font-bold text-slate-400"><Clock3 size={11} />{task.estimatedMinutes} min<span className="text-[#0F8B8D]">+{task.kp} KP</span></span>
    </span>
    {!task.done && <Link href={task.href} className="shrink-0 rounded-full bg-[#0F8B8D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0c7375]">Start</Link>}
  </div>;
}

const quadrantTone: Record<string, string> = {
  rose: "border-rose-100 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-500/10",
  teal: "border-teal-100 dark:border-teal-500/20 bg-teal-50/40 dark:bg-teal-500/10"
};

function SubjectSignalCard({ signals, tone, onRate }: { signals: SubjectSignals; tone: "rose" | "teal"; onRate: (level: ConfidenceLevel) => void }) {
  const [rating, setRating] = useState(false);
  return <div className={`rounded-2xl border p-4 ${quadrantTone[tone]}`}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="flex items-center gap-1.5 text-sm font-extrabold text-heading">{signals.subject.subjectName}{trendIcon(signals.trend)}</p>
      <button type="button" onClick={() => setRating(r => !r)} className="cursor-pointer text-[11px] font-bold text-slate-400 hover:text-heading">{rating ? "Close" : "Re-rate confidence"}</button>
    </div>
    <p className="mt-1 text-xs leading-relaxed text-slate-500">{signals.quadrant.insight}</p>
    <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
      <span>Confidence: {signals.confidence ?? "not rated"}/5</span>
      <span>Accuracy: {signals.accuracy.percent === null ? "no data yet" : `${signals.accuracy.percent}%`}</span>
      <span>Progress: {signals.progressPercent}%</span>
    </div>
    {rating && <div className="mt-3 flex flex-wrap gap-1.5">
      {confidenceOptions.map(o => <button key={o.level} type="button" title={o.label} onClick={() => { onRate(o.level); setRating(false); }} className={`grid h-7 w-7 cursor-pointer place-items-center rounded-full border-2 text-xs font-bold transition ${signals.confidence === o.level ? "border-[#0F8B8D] bg-[#0F8B8D] text-white" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-[#0F8B8D]/40"}`}>{o.level}</button>)}
    </div>}
  </div>;
}

function EditPlanBar({ config, onSave }: { config: ExamConfig; onSave: (patch: { examDate: string; hoursPerDay: number; availableDays: Weekday[] }) => void }) {
  const [open, setOpen] = useState(false);
  const [dateDraft, setDateDraft] = useState(config.examDate);
  const [hoursDraft, setHoursDraft] = useState(config.hoursPerDay);
  const [daysDraft, setDaysDraft] = useState<Weekday[]>(config.availableDays);
  const todayMin = new Date().toISOString().slice(0, 10);

  function toggleDay(day: Weekday) {
    setDaysDraft(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  // Reports the change upward—the parent page owns actually saving it and
  // showing the loading screen (see regeneratePlan), since saving the exam
  // config is what makes the parent unmount this whole dashboard branch.
  function save() {
    setOpen(false);
    onSave({ examDate: dateDraft, hoursPerDay: hoursDraft, availableDays: daysDraft });
  }

  if (!open) return <button type="button" onClick={() => setOpen(true)} className="mt-2 cursor-pointer text-xs font-bold text-slate-500 hover:text-[#0F8B8D]">Adjust exam date, hours, or days →</button>;

  return <div className={`${cardClass} mt-2 p-5`}>
    <label className="text-xs font-bold text-slate-500">Exam date</label>
    <input type="date" min={todayMin} value={dateDraft} onChange={e => setDateDraft(e.target.value)} className="mt-1.5 block rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm font-bold text-heading outline-none focus:border-[#0F8B8D]" />
    <label className="mt-3 block text-xs font-bold text-slate-500">Hours per day</label>
    <input type="number" min={0.5} max={12} step={0.5} value={hoursDraft} onChange={e => setHoursDraft(Number(e.target.value))} className="mt-1.5 block w-24 rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm font-bold text-heading outline-none focus:border-[#0F8B8D]" />
    <label className="mt-3 block text-xs font-bold text-slate-500">Study days</label>
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {weekdayOptions.map(d => <button key={d.id} type="button" onClick={() => toggleDay(d.id)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-extrabold transition ${daysDraft.includes(d.id) ? "border-[#0F8B8D] bg-[#effbfa] dark:bg-teal-500/15 text-[#0c6c6e]" : "border-slate-200 dark:border-white/10 text-slate-500"}`}>{d.label}</button>)}
    </div>
    <div className="mt-4 flex items-center gap-3">
      <button type="button" onClick={save} className="cursor-pointer rounded-full bg-[#0F8B8D] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0c7375]">Save</button>
      <button type="button" onClick={() => setOpen(false)} className="cursor-pointer text-xs font-bold text-slate-500 hover:text-heading">Cancel</button>
    </div>
  </div>;
}

// ---- Setup wizard (spec §5/§6): exam basics, then real-subject confidence ----

// Cosmetic message sequence for the creating-screen—each one names a real
// step that's genuinely happening (quadrant/priority scoring runs
// synchronously right before this shows; the AI call is real and in
// flight), not a fabricated progress narrative.
const creatingMessages = [
  "Analyzing your confidence and progress…",
  "Calculating your personalized KP target…",
  "Getting a recommendation from Studium AI…"
];

const creatingCopy = {
  creating: { heading: "Creating your study plan…", subtext: "Built just for you—from your exam date, your confidence, and what Studium already knows about your progress." },
  updating: { heading: "Updating your study plan…", subtext: "Recalculating your KP target and getting a fresh take from Studium AI." }
};

function CreatingScreen({ mode }: { mode: "creating" | "updating" }) {
  const [index, setIndex] = useState(0);
  const copy = creatingCopy[mode];
  useEffect(() => {
    const id = setInterval(() => setIndex(i => Math.min(i + 1, creatingMessages.length - 1)), 850);
    return () => clearInterval(id);
  }, []);

  return <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#070d0c] px-4 py-16 text-center sm:px-6">
    <motion.span
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className="grid h-16 w-16 place-items-center rounded-full bg-[#effbfa] dark:bg-teal-500/15 text-[#0F8B8D]"
    ><Sparkles size={28} /></motion.span>
    <h1 className="display mt-6 text-3xl leading-tight sm:text-4xl">{copy.heading}</h1>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{copy.subtext}</p>
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="mt-5 text-xs font-extrabold uppercase tracking-wide text-[#0F8B8D]"
      >{creatingMessages[index]}</motion.p>
    </AnimatePresence>
    <div className="mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
      <motion.div className="h-full rounded-full bg-[#0F8B8D]" initial={{ width: "0%" }} animate={{ width: "92%" }} transition={{ duration: 2.4, ease: "easeOut" }} />
    </div>
  </section>;
}

function SetupWizard({ onActivate }: {
  onActivate: (input: { examDate: string; hoursPerDay: number; availableDays: Weekday[]; overallConfidence: ConfidenceLevel; topicDrafts: Record<string, ConfidenceLevel> }) => void;
}) {
  const [step, setStep] = useState(0);
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [availableDays, setAvailableDays] = useState<Weekday[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [overallConfidence, setOverallConfidence] = useState<ConfidenceLevel>(3);
  const [topicDrafts, setTopicDrafts] = useState<Record<string, ConfidenceLevel>>({});
  const todayMin = new Date().toISOString().slice(0, 10);
  const realSubjects: RealSubject[] = getRealSubjects();

  function toggleDay(day: Weekday) {
    setAvailableDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  // Just hands the collected form data up—the parent page owns actually
  // saving it and showing the loading screen (see activateStudyPlan), since
  // saving the exam config is what makes the parent unmount this wizard.
  function finish() {
    onActivate({ examDate, hoursPerDay, availableDays, overallConfidence, topicDrafts });
  }

  const step0Valid = !!examDate && hoursPerDay > 0 && availableDays.length > 0;

  return <section className="mx-auto max-w-xl bg-[#F8FAFC] dark:bg-[#070d0c] px-4 py-10 sm:px-6 sm:py-14">
    <span className="eyebrow"><Target size={13} />Study Planner</span>
    <h1 className="display mt-4 text-3xl leading-tight sm:text-4xl">Let's build your plan.</h1>
    <p className="mt-3 text-base leading-relaxed text-slate-500">A few real questions, then Studium calculates exactly how much and what to study—using what it already knows about your progress.</p>

    {step === 0 && <div className={`${cardClass} mt-6 space-y-5 p-6 sm:p-7`}>
      <div>
        <label className="flex items-center gap-1.5 text-sm font-bold text-heading"><Calendar size={15} className="text-[#0F8B8D]" />What exam are you preparing for?</label>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full border-2 border-[#0F8B8D] bg-[#effbfa] dark:bg-teal-500/15 px-4 py-2 text-xs font-extrabold text-[#0c6c6e]">MCAT</span>
          <span title="Coming soon—no authored content yet" className="cursor-not-allowed rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-300">USMLE (coming soon)</span>
          <span title="Coming soon—no authored content yet" className="cursor-not-allowed rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-300">Pharmacology (coming soon)</span>
        </div>
      </div>
      <div>
        <label className="text-sm font-bold text-heading">When is your exam?</label>
        <input type="date" min={todayMin} value={examDate} onChange={e => setExamDate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm font-bold text-heading outline-none focus:border-[#0F8B8D]" />
      </div>
      <div>
        <label className="text-sm font-bold text-heading">How many hours can you study per day?</label>
        <input type="number" min={0.5} max={12} step={0.5} value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))} className="mt-2 w-28 rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm font-bold text-heading outline-none focus:border-[#0F8B8D]" />
      </div>
      <div>
        <label className="text-sm font-bold text-heading">Which days can you study?</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {weekdayOptions.map(d => <button key={d.id} type="button" onClick={() => toggleDay(d.id)} className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs font-extrabold transition ${availableDays.includes(d.id) ? "border-[#0F8B8D] bg-[#effbfa] dark:bg-teal-500/15 text-[#0c6c6e]" : "border-slate-200 dark:border-white/10 text-slate-500"}`}>{d.label}</button>)}
        </div>
      </div>
      <button type="button" onClick={() => setStep(1)} disabled={!step0Valid} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0F8B8D] py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375] disabled:cursor-not-allowed disabled:opacity-40">Next<ChevronRight size={15} /></button>
    </div>}

    {step === 1 && <div className={`${cardClass} mt-6 space-y-5 p-6 sm:p-7`}>
      <label className="text-sm font-bold text-heading">Overall, how confident do you feel right now?</label>
      <div className="space-y-2">
        {confidenceOptions.map(o => <button key={o.level} type="button" onClick={() => setOverallConfidence(o.level)} className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition ${overallConfidence === o.level ? "border-[#0F8B8D] bg-[#effbfa] dark:bg-teal-500/15 text-[#0c6c6e]" : "border-slate-200 dark:border-white/10 text-heading hover:border-[#0F8B8D]/30"}`}>
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-extrabold ${overallConfidence === o.level ? "bg-[#0F8B8D] text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500"}`}>{o.level}</span>{o.label}
        </button>)}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setStep(0)} className="cursor-pointer text-sm font-bold text-slate-500 hover:text-heading"><ChevronLeft size={15} className="mr-1 inline" />Back</button>
        <button type="button" onClick={() => setStep(2)} className="ml-auto flex cursor-pointer items-center gap-2 rounded-full bg-[#0F8B8D] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0c7375]">Next<ChevronRight size={15} /></button>
      </div>
    </div>}

    {step === 2 && <div className={`${cardClass} mt-6 space-y-4 p-6 sm:p-7`}>
      <div>
        <label className="text-sm font-bold text-heading">Rate your confidence by subject.</label>
        <p className="mt-1 text-xs text-slate-500">Only subjects with real lesson content are shown—Studium will combine this with your actual quiz/practice performance as you go.</p>
      </div>
      {realSubjects.length === 0
        ? <p className="text-sm text-slate-400">No subjects with real content are available yet.</p>
        : <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {realSubjects.map(s => <div key={s.subjectId} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 dark:border-white/10 p-3">
            <span className="text-sm font-bold text-heading">{s.subjectName}<span className="ml-1.5 text-[11px] font-medium text-slate-400">{s.sectionTitle}</span></span>
            <div className="flex gap-1">
              {confidenceOptions.map(o => <button key={o.level} type="button" title={o.label} onClick={() => setTopicDrafts(prev => ({ ...prev, [s.subjectId]: o.level }))} className={`grid h-7 w-7 cursor-pointer place-items-center rounded-full border-2 text-xs font-bold transition ${topicDrafts[s.subjectId] === o.level ? "border-[#0F8B8D] bg-[#0F8B8D] text-white" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-[#0F8B8D]/40"}`}>{o.level}</button>)}
            </div>
          </div>)}
        </div>}
      <div className="flex items-center gap-3 pt-2">
        <button type="button" onClick={() => setStep(1)} className="cursor-pointer text-sm font-bold text-slate-500 hover:text-heading"><ChevronLeft size={15} className="mr-1 inline" />Back</button>
        <button type="button" onClick={finish} className="ml-auto flex cursor-pointer items-center gap-2 rounded-full bg-[#0F8B8D] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375]">Activate My Study Plan<ArrowRight size={15} /></button>
      </div>
    </div>}
  </section>;
}
