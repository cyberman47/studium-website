"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar, Check, Circle, Clock3, HelpCircle, Layers, Plus, Sparkles, Stethoscope, Target, Trash2, Zap
} from "lucide-react";
import { PROGRESS_EVENT } from "@/lib/progress";
import { ensureShieldSecured, getTodayShieldProgress, ShieldProgress } from "@/lib/studyShield";
import {
  ADAPTIVE_PACING_EVENT, addCustomTask, AdaptivePace, deleteCustomTask, getAdaptivePace, getDaysRemaining, getExamDate,
  getIntensity, getSyllabusProgress, getTodaysPacingTasks, Intensity, intensityLabels, PacingTask, setExamDate,
  setIntensity, SyllabusProgress, toggleCustomTask
} from "@/lib/adaptivePacing";

const cardClass = "rounded-3xl border border-black/[0.06] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

const paceMeta = {
  relaxed: { icon: "🐢", label: "Relaxed Pace", classes: "border-sky-200 bg-sky-50 text-sky-700" },
  optimal: { icon: "🎯", label: "Optimal Pace", classes: "border-[#0F8B8D]/30 bg-[#effbfa] text-[#0c6c6e]" },
  sprint: { icon: "⚡", label: "Sprint Pace", classes: "border-amber-200 bg-amber-50 text-amber-700" }
} as const;

const taskIcon: Record<PacingTask["kind"], typeof Layers> = { case: Stethoscope, flashcards: Layers, quiz: HelpCircle, custom: Circle };
const intensityOrder: Intensity[] = ["comfort", "balanced", "aggressive"];

// The Adaptive Pacing & Daily Execution Hub—one real exam-date anchor plus
// a real syllabus-completion percentage drive a dynamically recalculated
// daily KP target (lib/adaptivePacing.ts), which IS the same number that
// secures today's streak (lib/studyShield.ts reads the same adaptive
// target). Replaces the earlier per-topic Mastery Goals planner entirely.
export default function StudyPlanPage() {
  const [loaded, setLoaded] = useState(false);
  const [examDate, setExamDateState] = useState<string | null>(null);
  const [intensity, setIntensityState] = useState<Intensity>("balanced");
  const [pace, setPace] = useState<AdaptivePace | null>(null);
  const [syllabus, setSyllabus] = useState<SyllabusProgress | null>(null);
  const [shield, setShield] = useState<ShieldProgress | null>(null);
  const [tasks, setTasks] = useState<PacingTask[]>([]);

  const [editingDate, setEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [taskInput, setTaskInput] = useState("");

  function refresh() {
    const date = getExamDate();
    const int = getIntensity();
    setExamDateState(date);
    setIntensityState(int);
    setSyllabus(getSyllabusProgress());

    const p = getAdaptivePace(date, int);
    setPace(p);
    setTasks(p ? getTodaysPacingTasks(p) : []);

    let s = getTodayShieldProgress();
    ensureShieldSecured(s);
    if (s.secured) s = getTodayShieldProgress();
    setShield(s);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
    window.addEventListener(ADAPTIVE_PACING_EVENT, refresh);
    window.addEventListener(PROGRESS_EVENT, refresh);
    return () => {
      window.removeEventListener(ADAPTIVE_PACING_EVENT, refresh);
      window.removeEventListener(PROGRESS_EVENT, refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveExamDate() {
    if (!dateInput) return;
    setExamDate(dateInput);
    setEditingDate(false);
  }

  function submitCustomTask() {
    if (!taskInput.trim()) return;
    addCustomTask(taskInput);
    setTaskInput("");
    setAddingTask(false);
  }

  if (!loaded) return null; // hydration-safe: real localStorage reads happen post-mount only

  const todayMin = new Date().toISOString().slice(0, 10);

  if (!examDate) {
    return <section className="mx-auto max-w-xl bg-[#F8FAFC] px-4 py-10 sm:px-6 sm:py-14">
      <span className="eyebrow"><Target size={13} />Study Planner</span>
      <h1 className="display mt-4 text-3xl leading-tight sm:text-4xl">Set your target exam date.</h1>
      <p className="mt-3 text-base leading-relaxed text-slate-500">Studium works backward from a single real date—your daily KP target adapts automatically as it gets closer or as you cover more of the syllabus.</p>
      <div className={`${cardClass} mt-6 p-6 sm:p-7`}>
        <label className="flex items-center gap-1.5 text-sm font-bold text-ink"><Calendar size={15} className="text-[#0F8B8D]" />Exam date</label>
        <input
          type="date" min={todayMin} value={dateInput}
          onChange={e => setDateInput(e.target.value)}
          className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-ink outline-none focus:border-[#0F8B8D]"
        />
        <button type="button" onClick={saveExamDate} disabled={!dateInput} className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0F8B8D] py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375] disabled:cursor-not-allowed disabled:opacity-40">Activate Adaptive Pacing</button>
      </div>
    </section>;
  }

  const daysRemaining = getDaysRemaining(examDate);
  const meta = pace ? paceMeta[pace.paceState] : null;

  return <section className="mx-auto max-w-2xl bg-[#F8FAFC] px-4 py-10 sm:px-6 sm:py-14">
    <span className="eyebrow"><Sparkles size={13} />Study Planner</span>
    <h1 className="display mt-4 text-3xl leading-tight sm:text-4xl">Today's Plan.</h1>

    {/* Exam Anchor Banner */}
    <div className={`${cardClass} mt-6 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6`}>
      <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink">
        <Target size={15} className="text-[#0F8B8D]" />Target: MCAT Exam — {new Date(`${examDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        <span className="text-slate-300">•</span>{daysRemaining} Days Remaining
        <span className="text-slate-300">•</span>{syllabus?.percent ?? 0}% Syllabus Covered
      </p>
      <button type="button" onClick={() => { setDateInput(examDate); setEditingDate(true); }} className="shrink-0 cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-ink transition hover:border-[#0F8B8D]/40 hover:text-[#0F8B8D]">Adjust Exam Date</button>
    </div>
    {syllabus && syllabus.totalLessonsWithContent < 20 && <p className="mt-2 text-[11px] leading-relaxed text-slate-400">Syllabus % only counts the {syllabus.totalLessonsWithContent} lessons that are actually written so far (Biology is the current preview)—it'll reflect more of the real MCAT curriculum as more gets built out.</p>}

    {editingDate && <div className={`${cardClass} mt-4 p-5`}>
      <label className="text-xs font-bold text-slate-500">New exam date</label>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input type="date" min={todayMin} value={dateInput} onChange={e => setDateInput(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-ink outline-none focus:border-[#0F8B8D]" />
        <button type="button" onClick={saveExamDate} className="cursor-pointer rounded-full bg-[#0F8B8D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0c7375]">Save</button>
        <button type="button" onClick={() => setEditingDate(false)} className="cursor-pointer text-xs font-bold text-slate-500 hover:text-ink">Cancel</button>
      </div>
    </div>}

    {/* Pace Meter */}
    {pace && meta && <div className={`mt-4 rounded-3xl border p-5 sm:p-6 ${meta.classes}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{meta.icon}</span>
        <span className="text-sm font-extrabold">{meta.label}</span>
        <span className="ml-auto text-sm font-extrabold">{pace.dailyKPTarget} KP/day</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed opacity-90">{pace.message}</p>
    </div>}

    {/* Daily Target & Intensity Bar */}
    {pace && <div className={`${cardClass} mt-4 p-5 sm:p-6`}>
      <p className="flex flex-wrap items-center gap-3 text-sm font-extrabold text-ink">
        Today's Target:
        <span className="flex items-center gap-1"><Target size={13} className="text-[#0F8B8D]" />{pace.dailyKPTarget} KP</span>
        <span className="flex items-center gap-1"><Layers size={13} className="text-[#0F8B8D]" />{pace.flashcardsTarget} Flashcards</span>
        <span className="flex items-center gap-1"><HelpCircle size={13} className="text-[#0F8B8D]" />{pace.quizTarget} Quiz{pace.quizTarget === 1 ? "" : "zes"}</span>
      </p>
      <div className="mt-4 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {intensityOrder.map(level => <button
          key={level} type="button" onClick={() => setIntensity(level)}
          className={`flex-1 cursor-pointer rounded-lg py-2 text-xs font-extrabold transition ${intensity === level ? "bg-white text-ink shadow-sm" : "text-slate-500 hover:text-ink"}`}
        >{intensityLabels[level]}</button>)}
      </div>
    </div>}

    {/* Today's Progress */}
    {shield && <div className={`${cardClass} mt-4 p-5 sm:p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Today's Progress</p>
        <span className="text-sm font-extrabold text-ink">{shield.currentKP} / {shield.targetKP} KP</span>
      </div>
      <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-[width] duration-500 ${shield.secured ? "bg-[#0F8B8D]" : "bg-amber-400"}`} style={{ width: `${shield.percent}%` }} />
      </div>
      {shield.secured
        ? <p className="mt-2 flex items-center gap-1.5 text-xs font-extrabold text-[#0c6c6e]"><Check size={13} strokeWidth={3} />Streak secured for today</p>
        : <p className="mt-2 flex items-center gap-1.5 text-xs font-extrabold text-amber-700"><Zap size={13} />{shield.kpUntilSecured} KP remaining to secure today's streak</p>}
    </div>}

    {/* Live Daily Execution Checklist */}
    <div className="mt-6 space-y-2.5">
      {tasks.map(task => {
        const Icon = taskIcon[task.kind];
        const content = <>
          <button
            type="button"
            onClick={() => task.kind === "custom" ? toggleCustomTask(task.id) : undefined}
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${task.done ? "bg-[#0F8B8D] text-white" : task.kind === "custom" ? "cursor-pointer border-2 border-slate-200 text-transparent hover:border-[#0F8B8D]/40" : "border-2 border-slate-200"}`}
            aria-label={task.done ? "Completed" : "Not completed"}
          >{task.done && <Check size={14} strokeWidth={3} />}</button>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#effbfa] text-[#0F8B8D]"><Icon size={18} /></span>
          <span className="min-w-0 flex-1">
            <span className={`block truncate text-sm font-extrabold ${task.done ? "text-slate-400 line-through" : "text-ink"}`}>{task.title}</span>
            <span className="mt-0.5 block truncate text-xs text-slate-500">{task.detail}</span>
          </span>
          {task.kp > 0 && <span className="shrink-0 text-xs font-extrabold text-[#0F8B8D]">+{task.kp} KP</span>}
        </>;

        if (task.kind === "custom") {
          return <div key={task.id} className={`${cardClass} flex items-center gap-4 p-4 sm:p-5`}>
            {content}
            <button type="button" onClick={() => deleteCustomTask(task.id)} className="shrink-0 cursor-pointer rounded-full p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500" aria-label="Delete task"><Trash2 size={14} /></button>
          </div>;
        }

        return <Link key={task.id} href={task.href ?? "#"} className={`${cardClass} flex cursor-pointer items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lift sm:p-5`}>
          {content}
          {!task.done && <span className="shrink-0 rounded-full bg-[#0F8B8D] px-4 py-2 text-xs font-bold text-white">{task.kind === "case" ? "Solve" : task.kind === "quiz" ? "Start Quiz" : "Review"}</span>}
        </Link>;
      })}

      {addingTask
        ? <div className={`${cardClass} flex items-center gap-3 p-4 sm:p-5`}>
          <input
            autoFocus value={taskInput} onChange={e => setTaskInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitCustomTask()}
            placeholder="Custom task name…"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-[#0F8B8D]"
          />
          <button type="button" onClick={submitCustomTask} className="shrink-0 cursor-pointer rounded-full bg-[#0F8B8D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0c7375]">Add</button>
          <button type="button" onClick={() => { setAddingTask(false); setTaskInput(""); }} className="shrink-0 cursor-pointer text-xs font-bold text-slate-500 hover:text-ink">Cancel</button>
        </div>
        : <button type="button" onClick={() => setAddingTask(true)} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 py-3.5 text-xs font-extrabold text-slate-500 transition hover:border-[#0F8B8D]/50 hover:text-[#0F8B8D]"><Plus size={14} />Add Custom Task</button>}
    </div>

    <p className="mt-4 text-[11px] leading-relaxed text-slate-400">Custom tasks are a personal checklist—completing one doesn't award KP, since real Knowledge Points stay tied to verified study activity.</p>
  </section>;
}
