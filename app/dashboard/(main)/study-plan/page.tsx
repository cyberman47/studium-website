"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ClipboardCheck, Clock3, Flame, Layers, PartyPopper, Target } from "lucide-react";
import { Field, inputClass } from "@/components/ui";
import {
  ClaimResult, getLevelInfo, getStreak, getStudyPlan, getStudyPlanProgress, logFlashcards, logQuiz, logStudyMinutes,
  saveStudyPlan, StudyPlanGoals, StudyPlanProgress
} from "@/lib/progress";

const defaultProgress: StudyPlanProgress = {
  goals: { minutes: 30, flashcards: 50, quizzes: 1 },
  minutes: 0, flashcards: 0, quizzes: 0,
  minutesComplete: false, flashcardsComplete: false, quizzesComplete: false, complete: false
};

export default function StudyPlanPage() {
  const [progress, setProgress] = useState<StudyPlanProgress>(defaultProgress);
  const [streak, setStreak] = useState(0);
  const [goalsDraft, setGoalsDraft] = useState<StudyPlanGoals>(defaultProgress.goals);
  const [savedGoals, setSavedGoals] = useState(false);
  const [floatingKP, setFloatingKP] = useState<number | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);

  function refresh() {
    const p = getStudyPlanProgress();
    setProgress(p);
    setGoalsDraft(p.goals);
    setStreak(getStreak());
  }

  useEffect(() => { refresh(); }, []);

  function handleResult(result: ClaimResult | null) {
    refresh();
    if (result?.awarded) {
      setFloatingKP(result.kpAwarded);
      setTimeout(() => setFloatingKP(null), 1400);
      if (result.leveledUp) {
        const info = getLevelInfo(result.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
  }

  function handleSaveGoals(e: React.FormEvent) {
    e.preventDefault();
    const goals: StudyPlanGoals = {
      minutes: Math.max(5, goalsDraft.minutes),
      flashcards: Math.max(5, goalsDraft.flashcards),
      quizzes: Math.max(1, goalsDraft.quizzes)
    };
    saveStudyPlan(goals);
    setSavedGoals(true);
    refresh();
    setTimeout(() => setSavedGoals(false), 2000);
  }

  const rows = [
    { key: "minutes", label: "Study time", icon: Clock3, current: progress.minutes, goal: progress.goals.minutes, suffix: "min", done: progress.minutesComplete, addLabel: "+15 min", onLog: () => handleResult(logStudyMinutes(15)) },
    { key: "flashcards", label: "Flashcards", icon: Layers, current: progress.flashcards, goal: progress.goals.flashcards, suffix: "cards", done: progress.flashcardsComplete, addLabel: "+10 cards", onLog: () => handleResult(logFlashcards(10)) },
    { key: "quizzes", label: "Quizzes", icon: ClipboardCheck, current: progress.quizzes, goal: progress.goals.quizzes, suffix: "quizzes", done: progress.quizzesComplete, addLabel: "+1 quiz", onLog: () => handleResult(logQuiz()) }
  ];

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Target size={13} />Study Plan</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Your daily plan.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Set how long you want to study today, how many flashcards, and how many quizzes. Complete all three to keep your streak alive.</p>

    <div className="mt-10 max-w-2xl space-y-6">
      <div className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-600"><Flame size={17} /></span>
            <p className="text-sm font-bold text-slate-500">{streak} day{streak === 1 ? "" : "s"} streak</p>
          </div>
          {progress.complete && <span className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-700"><Check size={13} strokeWidth={3} />Today's plan complete</span>}
        </div>

        <div className="mt-6 space-y-5">
          {rows.map(row => {
            const percent = Math.min(100, Math.round((row.current / row.goal) * 100));
            return <div key={row.key}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${row.done ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-400"}`}><row.icon size={15} /></span>
                  <p className="text-sm font-bold text-ink">{row.label}</p>
                </div>
                <p className="text-xs font-extrabold text-slate-500">{row.current} / {row.goal} {row.suffix}</p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${row.done ? "bg-teal-500" : "bg-teal-400"}`} style={{ width: `${percent}%` }} /></div>
              {!row.done && <button type="button" onClick={row.onLog} className="mt-2.5 cursor-pointer rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">{row.addLabel}</button>}
            </div>;
          })}
        </div>

        <AnimatePresence>
          {floatingKP !== null && <motion.span
            initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -28 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
            className="pointer-events-none absolute right-6 top-6 text-sm font-extrabold text-teal-600"
          >+{floatingKP} KP</motion.span>}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSaveGoals} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-lg font-extrabold tracking-tight">Customize your goals</h2>
        <p className="mt-1 text-sm text-slate-500">Set your own targets—adjust them any time.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Field label="Study time (min)"><input type="number" min={5} step={5} value={goalsDraft.minutes} onChange={e => setGoalsDraft(g => ({ ...g, minutes: Number(e.target.value) }))} className={inputClass} /></Field>
          <Field label="Flashcards"><input type="number" min={5} step={5} value={goalsDraft.flashcards} onChange={e => setGoalsDraft(g => ({ ...g, flashcards: Number(e.target.value) }))} className={inputClass} /></Field>
          <Field label="Quizzes"><input type="number" min={1} value={goalsDraft.quizzes} onChange={e => setGoalsDraft(g => ({ ...g, quizzes: Number(e.target.value) }))} className={inputClass} /></Field>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <button type="submit" className="cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Save goals</button>
          {savedGoals && <span className="text-sm font-bold text-teal-600">Saved ✓</span>}
        </div>
      </form>
    </div>

    <p className="mt-8 max-w-2xl px-1 text-xs leading-relaxed text-slate-400">Your streak now depends on this plan, not just opening the app—hit all three goals each day to keep it going. Logging progress here is simulated for this demo, since flashcards and quizzes aren't fully built yet, but the streak, KP, and stats it produces are genuinely tracked.</p>

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
