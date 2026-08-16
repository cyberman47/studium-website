"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Check, CheckCircle2, Flag, Lock, PartyPopper, Sparkles, Stethoscope, X, Zap
} from "lucide-react";
import {
  CaseAttempt, CaseRewardTier, getCaseOfTheDay, getCaseRewardKP, getCaseRewardLabel, getCaseRewardTier,
  getProgressiveCase, getTodayCaseAttempt, submitCaseDiagnosis
} from "@/lib/clinicalCases";
import { claimClinicalCase, getLevelInfo } from "@/lib/progress";
import { reportTypeLabels, ReportType, submitReport } from "@/lib/reports";
import { InteractiveText } from "@/components/interactive-text";

const difficultyClasses: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Intermediate: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Advanced: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
};

const tierClasses: Record<CaseRewardTier, string> = {
  highest: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-500/25 dark:bg-teal-500/10 dark:text-teal-300",
  high: "border-teal-100 bg-teal-50/70 text-teal-600 dark:border-teal-500/20 dark:bg-teal-500/[0.07] dark:text-teal-300",
  moderate: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300",
  minimal: "border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
};

export default function CaseOfTheDayPage() {
  const todaysCase = getCaseOfTheDay();
  const progressive = getProgressiveCase(todaysCase);
  const totalBeats = progressive.narrative.length;

  // One counter for the whole unfolding story—no more separate
  // symptoms/tests trackers. The narrative isn't pre-sorted into
  // categories, so there's nothing to gate between "sections" anymore;
  // each beat just reveals the next real thing that happened.
  const [beatsRevealed, setBeatsRevealed] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [attempt, setAttempt] = useState<CaseAttempt | null>(null);
  const [kpAwarded, setKpAwarded] = useState<number | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);
  const [showFullCase, setShowFullCase] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [reportType, setReportType] = useState<ReportType>("bug");
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const existing = getTodayCaseAttempt();
    if (existing && existing.caseId === todaysCase.id) {
      setAttempt(existing);
      setSelected(existing.selectedIndex);
      setBeatsRevealed(existing.beatsRevealed ?? totalBeats);
      setKpAwarded(existing.kpAwarded ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todaysCase.id]);

  const solved = !!attempt;
  const allBeatsRevealed = beatsRevealed >= totalBeats;
  const tier = getCaseRewardTier(beatsRevealed, totalBeats);
  const potentialKP = getCaseRewardKP(beatsRevealed, totalBeats);

  function revealNextBeat() {
    if (!solved && beatsRevealed < totalBeats) setBeatsRevealed(n => n + 1);
  }

  function handleDiagnose() {
    if (selected === null || attempt) return;
    const correct = selected === progressive.correctIndex;
    const kp = correct ? getCaseRewardKP(beatsRevealed, totalBeats) : 0;
    const result = submitCaseDiagnosis(todaysCase.id, selected, beatsRevealed, kp);
    setAttempt(result);
    if (correct) {
      const claimResult = claimClinicalCase(kp);
      if (claimResult.awarded) {
        setKpAwarded(claimResult.kpAwarded);
        if (claimResult.leveledUp) {
          const info = getLevelInfo(claimResult.totalKP);
          setLevelUpInfo({ level: info.level, name: info.name });
        }
      } else {
        setKpAwarded(0);
      }
    } else {
      setKpAwarded(0);
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

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"><ArrowLeft size={14} />Back to dashboard</Link>
    <span className="eyebrow"><Stethoscope size={13} />Daily Medical Case</span>
    <h1 className="display mt-5 text-3xl leading-tight text-heading dark:text-white sm:text-4xl">{todaysCase.title}</h1>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600 dark:bg-white/5 dark:text-slate-300">{todaysCase.category}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${difficultyClasses[todaysCase.difficulty]}`}>{todaysCase.difficulty}</span>
      {solved && <span className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-700 dark:bg-teal-500/15 dark:text-teal-300"><CheckCircle2 size={13} />Solved today</span>}
    </div>

    <div className="mt-8 max-w-5xl">
      {/* Story and diagnosis side by side on larger screens (the diagnosis
          column stays pinned in view while the story scrolls past it), so
          answering never means scrolling down past the narrative first—
          only the post-answer result panel below is expected to need a
          scroll, same as any results reveal. Stacks to one column on
          mobile, where side-by-side wouldn't fit anyway. */}
      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="space-y-5">
      {/* The patient's story—one continuous card. The opening line is
          always visible; every beat after it (symptom, exam finding,
          treatment response, history, a lab result, whatever actually
          happened next) reveals in the order it really occurred, not
          sorted into separate categories. */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-white/[0.08] dark:bg-[#0d1917] dark:shadow-none sm:p-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300"><Stethoscope size={16} /></span>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"><InteractiveText text={progressive.patientIntro} /></p>
        </div>

        {totalBeats > 0 && <>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-white/10">
            {progressive.narrative.map((beat, i) => {
              const revealed = i < beatsRevealed;
              return <AnimatePresence key={i} mode="wait" initial={false}>
                {revealed ? <motion.div
                  key="revealed"
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-[#f9fcfc] px-4 py-3 dark:border-white/10 dark:bg-white/5"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  <p className="text-sm leading-relaxed text-heading dark:text-white"><InteractiveText text={beat} /></p>
                </motion.div> : <div
                  key="locked"
                  className="flex items-center gap-2.5 rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm font-bold text-slate-300 dark:border-white/10 dark:text-slate-600"
                >
                  <Lock size={13} className="shrink-0" />More of the story — not yet revealed
                </div>}
              </AnimatePresence>;
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
            <span className="text-xs font-bold text-slate-400">{beatsRevealed} / {totalBeats} revealed</span>
            {!solved && !allBeatsRevealed && <button type="button" onClick={revealNextBeat} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0d9488] transition hover:-translate-y-0.5 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400">
              <Sparkles size={14} />Continue the Story
            </button>}
          </div>
        </>}
      </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24">
      {/* Live reward stakes—makes the reveal/diagnose tradeoff visible */}
      {!solved && totalBeats > 0 && <div className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${tierClasses[tier]}`}>
        <span className="flex items-center gap-1.5 text-xs font-extrabold"><Zap size={13} fill="currentColor" />{getCaseRewardLabel(tier)}</span>
        <span className="text-sm font-extrabold">+{potentialKP} KP if correct</span>
      </div>}

      {/* Diagnosis — always available, never gated behind revealing everything */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-white/[0.08] dark:bg-[#0d1917] dark:shadow-none sm:p-7">
        <h2 className="text-lg font-extrabold tracking-tight text-heading dark:text-white"><InteractiveText text={todaysCase.question} /></h2>
        <div className="mt-4 space-y-2.5">
          {progressive.options.map((option, i) => {
            const isCorrect = i === progressive.correctIndex;
            const isSelected = selected === i;
            let stateClasses = "border-slate-200 hover:border-teal-200 hover:bg-[#f9fcfc] dark:border-white/10 dark:hover:border-teal-500/30 dark:hover:bg-white/5";
            if (solved) {
              if (isCorrect) stateClasses = "border-teal-500 bg-teal-50 dark:border-teal-500/50 dark:bg-teal-500/10";
              else if (isSelected) stateClasses = "border-rose-300 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10";
              else stateClasses = "border-slate-100 opacity-60 dark:border-white/5";
            } else if (isSelected) {
              stateClasses = "border-teal-500 bg-teal-50 dark:border-teal-500/50 dark:bg-teal-500/10";
            }
            return <button key={i} type="button" disabled={solved} onClick={() => setSelected(i)} className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold text-heading transition dark:text-white ${solved ? "cursor-default" : "cursor-pointer"} ${stateClasses}`}>
              <span>{option}</span>
              {solved && isCorrect && <Check size={16} className="shrink-0 text-teal-600 dark:text-teal-300" />}
              {solved && isSelected && !isCorrect && <X size={16} className="shrink-0 text-rose-500 dark:text-rose-300" />}
            </button>;
          })}
        </div>

        {!solved && <button type="button" onClick={handleDiagnose} disabled={selected === null} className="mt-5 cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">Make Diagnosis</button>}
      </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
      {/* Result */}
      {attempt && <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-white/[0.08] dark:bg-[#0d1917] dark:shadow-none sm:p-7">
        <p className={`text-base font-extrabold ${attempt.correct ? "text-teal-700 dark:text-teal-300" : "text-rose-600 dark:text-rose-300"}`}>{attempt.correct ? "Correct diagnosis!" : "Not quite."}</p>

        <div className="mt-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Why {attempt.correct ? "it was correct" : `the answer is "${progressive.options[progressive.correctIndex]}"`}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"><InteractiveText text={progressive.optionRationales[progressive.correctIndex]} /></p>
        </div>

        {progressive.keyClues.length > 0 && <div className="mt-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Key clues you should have noticed</p>
          <ul className="mt-1.5 space-y-1.5">
            {progressive.keyClues.map(clue => <li key={clue} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"><Sparkles size={13} className="mt-0.5 shrink-0 text-amber-500" /><InteractiveText text={clue} /></li>)}
          </ul>
        </div>}

        <div className="mt-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Why the other options were less likely</p>
          <ul className="mt-1.5 space-y-2">
            {progressive.options.map((option, i) => i === progressive.correctIndex ? null : <li key={i} className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"><span className="font-extrabold text-heading dark:text-white">{option}:</span> <InteractiveText text={progressive.optionRationales[i]} /></li>)}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f9fcfc] p-4 dark:bg-white/5">
          <span className="text-sm font-extrabold text-heading dark:text-white">{attempt.correct && kpAwarded ? `+${kpAwarded} KP earned` : "No KP earned this time"}</span>
          {attempt.beatsRevealed !== undefined && attempt.correct && totalBeats > 0 && <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Diagnosed with {attempt.beatsRevealed} of {totalBeats} details revealed</span>}
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {!showFullCase && totalBeats > 0 && <button type="button" onClick={() => { setShowFullCase(true); setBeatsRevealed(totalBeats); }} className="cursor-pointer rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:border-white/10 dark:text-white dark:hover:border-teal-500/30 dark:hover:bg-white/5">View Full Case</button>}
          <button type="button" disabled title="A new case unlocks tomorrow" className="flex cursor-not-allowed items-center gap-1.5 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-400 opacity-70 dark:border-white/10 dark:text-slate-500">
            <Lock size={13} />Try Tomorrow's Case
          </button>
        </div>
      </div>}

      {solved && <p className="px-1 text-xs leading-relaxed text-slate-400">Come back tomorrow for a new case.</p>}

      <button type="button" onClick={() => setReportOpen(true)} className="flex cursor-pointer items-center gap-1.5 px-1 text-xs font-bold text-slate-400 transition hover:text-rose-500"><Flag size={12} />Something wrong with this case? Report it</button>

      <p className="px-1 text-[11px] leading-relaxed text-slate-300 dark:text-slate-600">Studium Daily Diagnosis cases are for educational and entertainment purposes only and do not constitute medical advice. All cases are fictional. For any health concerns, please consult a qualified healthcare professional.</p>
      </div>
    </div>

    <AnimatePresence>
      {reportOpen && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setReportOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift dark:bg-[#0d1917] dark:shadow-none dark:ring-1 dark:ring-white/10"
        >
          <h3 className="text-base font-extrabold text-heading dark:text-white">Report an issue</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">On "{todaysCase.title}". Sent to the admin Reports inbox on this browser.</p>
          {reportSent ? <p className="mt-4 rounded-xl bg-teal-50 px-3 py-2 text-sm font-bold text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">Thanks—your report was submitted.</p> : <>
            <select value={reportType} onChange={e => setReportType(e.target.value as ReportType)} className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-heading outline-none focus:border-teal-400 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {(Object.keys(reportTypeLabels) as ReportType[]).map(t => <option key={t} value={t} className="text-heading">{reportTypeLabels[t]}</option>)}
            </select>
            <textarea value={reportMessage} onChange={e => setReportMessage(e.target.value)} rows={3} placeholder="What's wrong?" className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-heading outline-none placeholder:text-slate-400 focus:border-teal-400 dark:border-white/10 dark:bg-white/5 dark:text-white" />
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setReportOpen(false)} className="flex-1 cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500 dark:border-white/10 dark:text-slate-300">Cancel</button>
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-lift dark:bg-[#0d1917] dark:shadow-none dark:ring-1 dark:ring-white/10"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300"><PartyPopper size={30} /></span>
          <h2 className="display mt-5 text-2xl text-heading dark:text-white">🎉 Level Up!</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Congratulations! You've reached <span className="font-extrabold text-heading dark:text-white">Level {levelUpInfo.level} · {levelUpInfo.name}</span>.</p>
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Awesome!</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}
