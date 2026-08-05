"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, PartyPopper, Play } from "lucide-react";
import { ClaimResult, getLevelInfo, logFlashcards, logQuiz } from "@/lib/progress";
import { StudyPlanTask, TodaysStudyPlan } from "@/lib/studyPlan";

const cardClass = "relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

export function StudyPlanCard({ plan, onChange }: { plan: TodaysStudyPlan; onChange: () => void }) {
  const router = useRouter();
  const [floatingKP, setFloatingKP] = useState<number | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);

  function handleResult(result: ClaimResult | null) {
    onChange();
    if (result?.awarded) {
      setFloatingKP(result.kpAwarded);
      setTimeout(() => setFloatingKP(null), 1400);
      if (result.leveledUp) {
        const info = getLevelInfo(result.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
  }

  function runTask(task: StudyPlanTask) {
    if (task.done) return;
    if (task.href) { router.push(task.href); return; }
    if (task.id === "flashcards") handleResult(logFlashcards(10));
    else if (task.id === "quiz") handleResult(logQuiz());
  }

  const nextTask = plan.tasks.find(t => !t.done);

  return <div className={`${cardClass} p-5 sm:p-6`}>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <span className="eyebrow text-[#0F8B8D]">📅 Today's Study Plan</span>
        <p className="mt-1.5 text-sm text-slate-500">Your personalized learning schedule</p>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 sm:w-36">
          <motion.div className="h-full rounded-full bg-[#0F8B8D]" initial={false} animate={{ width: `${plan.percent}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <span className="text-xs font-extrabold text-[#0c6c6e]">{plan.percent}%</span>
      </div>
    </div>

    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
      {plan.tasks.map(task => <TaskRow key={task.id} task={task} onRun={() => runTask(task)} />)}
    </div>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
      <p className="text-xs font-bold text-slate-500">{plan.completedCount} of {plan.totalCount} tasks completed</p>
      <button
        type="button"
        onClick={() => nextTask && runTask(nextTask)}
        disabled={!nextTask}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-[#0F8B8D] px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375] disabled:cursor-default disabled:opacity-50 disabled:hover:translate-y-0"
      >
        <Play size={12} fill="currentColor" />{nextTask ? `Start Studying · ${nextTask.title}` : "All caught up"}
      </button>
    </div>

    <p className="mt-4 text-[11px] leading-relaxed text-slate-400">Continue Lesson and Terminology Review are genuinely tracked. Flashcard Review and Practice Quiz log with a quick tap since full decks and quiz banks aren't built yet—streak, KP, and stats stay real.</p>

    <AnimatePresence>
      {floatingKP !== null && <motion.span
        initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -28 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
        className="pointer-events-none absolute right-6 top-6 text-sm font-extrabold text-[#0c6c6e]"
      >+{floatingKP} KP</motion.span>}
    </AnimatePresence>

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
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-[#0F8B8D] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375]">Awesome!</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}

function TaskRow({ task, onRun }: { task: StudyPlanTask; onRun: () => void }) {
  return <button
    type="button"
    onClick={onRun}
    disabled={task.done}
    className={`flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3 text-left transition ${task.done ? "cursor-default border-transparent bg-[#f2faf9]" : "border-black/[0.06] bg-white hover:border-[#0F8B8D]/30 hover:bg-[#f9fcfc]"}`}
  >
    <span className="shrink-0 text-base">{task.emoji}</span>
    <div className="min-w-0 flex-1">
      <p className={`truncate text-xs font-bold leading-tight ${task.done ? "text-slate-400 line-through" : "text-ink"}`}>{task.title}</p>
      <p className="truncate text-[11px] leading-tight text-slate-500">{task.detail} · {task.minutes} min</p>
    </div>
    {task.done
      ? <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0F8B8D] text-white"><Check size={11} strokeWidth={3} /></span>
      : <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" />}
  </button>;
}
