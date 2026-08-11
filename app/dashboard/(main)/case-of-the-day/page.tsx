"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, Flag, PartyPopper, Stethoscope, X } from "lucide-react";
import { CaseAttempt, getCaseOfTheDay, getTodayCaseAttempt, submitCaseAnswer } from "@/lib/clinicalCases";
import { claimClinicalCase, getLevelInfo } from "@/lib/progress";
import { reportTypeLabels, ReportType, submitReport } from "@/lib/reports";
import { InteractiveText } from "@/components/interactive-text";

const difficultyClasses: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700"
};

export default function CaseOfTheDayPage() {
  const todaysCase = getCaseOfTheDay();
  const [selected, setSelected] = useState<number | null>(null);
  const [attempt, setAttempt] = useState<CaseAttempt | null>(null);
  const [kpAwarded, setKpAwarded] = useState<number | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [reportType, setReportType] = useState<ReportType>("bug");
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const existing = getTodayCaseAttempt();
    if (existing && existing.caseId === todaysCase.id) {
      setAttempt(existing);
      setSelected(existing.selectedIndex);
    }
  }, [todaysCase.id]);

  function handleSubmit() {
    if (selected === null || attempt) return;
    const result = submitCaseAnswer(todaysCase.id, selected);
    setAttempt(result);
    const claimResult = claimClinicalCase();
    if (claimResult.awarded) {
      setKpAwarded(claimResult.kpAwarded);
      if (claimResult.leveledUp) {
        const info = getLevelInfo(claimResult.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
  }

  function handleReportSubmit() {
    const result = submitReport({ type: reportType, targetType: "case", targetId: todaysCase.id, targetLabel: todaysCase.title, message: reportMessage });
    if (result.ok) {
      setReportSent(true);
      setReportMessage("");
      setTimeout(() => { setReportOpen(false); setReportSent(false); }, 1500);
    }
  }

  const solved = !!attempt;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to dashboard</Link>
    <span className="eyebrow"><Stethoscope size={13} />Clinical Case of the Day</span>
    <h1 className="display mt-5 text-3xl leading-tight sm:text-4xl">{todaysCase.title}</h1>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">{todaysCase.category}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${difficultyClasses[todaysCase.difficulty]}`}>{todaysCase.difficulty}</span>
      {solved && <span className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-700"><CheckCircle2 size={13} />Solved today</span>}
    </div>

    <div className="mt-8 max-w-2xl space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <p className="text-sm leading-relaxed text-slate-600"><InteractiveText text={todaysCase.stem} /></p>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-lg font-extrabold tracking-tight"><InteractiveText text={todaysCase.question} /></h2>
        <div className="mt-4 space-y-2.5">
          {todaysCase.options.map((option, i) => {
            const isCorrect = i === todaysCase.correctIndex;
            const isSelected = selected === i;
            let stateClasses = "border-slate-200 hover:border-teal-200 hover:bg-[#f9fcfc]";
            if (solved) {
              if (isCorrect) stateClasses = "border-teal-500 bg-teal-50";
              else if (isSelected) stateClasses = "border-rose-300 bg-rose-50";
              else stateClasses = "border-slate-100 opacity-60";
            } else if (isSelected) {
              stateClasses = "border-teal-500 bg-teal-50";
            }
            return <button key={i} type="button" disabled={solved} onClick={() => setSelected(i)} className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold text-ink transition ${solved ? "cursor-default" : "cursor-pointer"} ${stateClasses}`}>
              <span>{option}</span>
              {solved && isCorrect && <Check size={16} className="shrink-0 text-teal-600" />}
              {solved && isSelected && !isCorrect && <X size={16} className="shrink-0 text-rose-500" />}
            </button>;
          })}
        </div>

        {!solved && <button type="button" onClick={handleSubmit} disabled={selected === null} className="mt-5 cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">Submit answer</button>}

        {attempt && <div className="mt-6 rounded-2xl bg-[#f9fcfc] p-5">
          <p className={`text-sm font-extrabold ${attempt.correct ? "text-teal-700" : "text-rose-600"}`}>{attempt.correct ? "Correct!" : "Not quite."}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600"><InteractiveText text={todaysCase.explanation} /></p>
          {kpAwarded !== null && <p className="mt-3 text-xs font-extrabold text-teal-600">+{kpAwarded} KP earned</p>}
        </div>}
      </div>

      {solved && <p className="px-1 text-xs leading-relaxed text-slate-400">Come back tomorrow for a new case.</p>}

      <button type="button" onClick={() => setReportOpen(true)} className="flex cursor-pointer items-center gap-1.5 px-1 text-xs font-bold text-slate-400 transition hover:text-rose-500"><Flag size={12} />Something wrong with this case? Report it</button>
    </div>

    <AnimatePresence>
      {reportOpen && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setReportOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift"
        >
          <h3 className="text-base font-extrabold text-ink">Report an issue</h3>
          <p className="mt-1 text-xs text-slate-500">On "{todaysCase.title}". Sent to the admin Reports inbox on this browser.</p>
          {reportSent ? <p className="mt-4 rounded-xl bg-teal-50 px-3 py-2 text-sm font-bold text-teal-700">Thanks—your report was submitted.</p> : <>
            <select value={reportType} onChange={e => setReportType(e.target.value as ReportType)} className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400">
              {(Object.keys(reportTypeLabels) as ReportType[]).map(t => <option key={t} value={t}>{reportTypeLabels[t]}</option>)}
            </select>
            <textarea value={reportMessage} onChange={e => setReportMessage(e.target.value)} rows={3} placeholder="What's wrong?" className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400" />
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setReportOpen(false)} className="flex-1 cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500">Cancel</button>
              <button type="button" onClick={handleReportSubmit} disabled={!reportMessage.trim()} className="flex-1 cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Submit</button>
            </div>
          </>}
        </motion.div>
      </motion.div>}
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
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Awesome!</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}
