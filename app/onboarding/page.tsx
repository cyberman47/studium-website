"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/navigation";
import { completeOnboarding, emptyAnswers, getUser, goalOptions, isOnboardingComplete, OnboardingAnswers, roleOptions, sourceOptions, studyMethodOptions, studyTimeOptions } from "@/lib/onboarding";

type Question = {
  key: keyof Omit<OnboardingAnswers, "studyMethods">;
  question: string;
  subtext?: string;
  options: string[];
  multiple?: false;
} | {
  key: "studyMethods";
  question: string;
  subtext?: string;
  options: string[];
  multiple: true;
};

const questions: Question[] = [
  { key: "role", question: "What best describes you?", options: roleOptions },
  { key: "goal", question: "What is your main goal?", options: goalOptions },
  { key: "studyTime", question: "How much time do you usually study each day?", options: studyTimeOptions },
  { key: "studyMethods", question: "How do you prefer to study?", subtext: "Select all that apply.", options: studyMethodOptions, multiple: true },
  { key: "source", question: "How did you hear about Studium?", options: sourceOptions }
];

const loadingMessages = ["Creating your personalized dashboard…", "Preparing your AI learning tools…", "Setting up your study profile…", "Almost ready…"];

const TOTAL = questions.length; // welcome = step 0, questions = 1..TOTAL, loading = TOTAL + 1

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(emptyAnswers);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (isOnboardingComplete()) { router.replace("/dashboard"); return; }
    setReady(true);
  }, [router]);

  function go(next: number, dir: 1 | -1) {
    setDirection(dir);
    setStep(next);
  }

  function selectSingle(key: Exclude<Question["key"], "studyMethods">, value: string) {
    setAnswers(a => ({ ...a, [key]: value }));
    setTimeout(() => go(step + 1, 1), 320);
  }

  function toggleMulti(value: string) {
    setAnswers(a => ({ ...a, studyMethods: a.studyMethods.includes(value) ? a.studyMethods.filter(v => v !== value) : [...a.studyMethods, value] }));
  }

  function skip() {
    go(step + 1, 1);
  }

  function back() {
    if (step > 0) go(step - 1, -1);
  }

  if (!ready) return null;

  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fcfdfd] px-4 py-10">
    <div className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <div className="w-full max-w-lg">
      {step > 0 && step <= TOTAL && <ProgressBar percent={(step / TOTAL) * 100} />}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: 24 * direction }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 * direction }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 && <WelcomeScreen onStart={() => go(1, 1)} />}
          {step > 0 && step <= TOTAL && <QuestionScreen q={questions[step - 1]} answers={answers} onSelectSingle={selectSingle} onToggleMulti={toggleMulti} onSkip={skip} onBack={back} onContinue={() => go(step + 1, 1)} />}
          {step === TOTAL + 1 && <LoadingScreen answers={answers} />}
        </motion.div>
      </AnimatePresence>
    </div>
  </main>;
}

function ProgressBar({ percent }: { percent: number }) {
  return <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
    <motion.div className="h-full rounded-full bg-[#0F8B8D]" initial={false} animate={{ width: `${percent}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
  </div>;
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-soft sm:p-12">
    <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#effbfa]"><LogoMark className="h-9 w-9" /></span>
    <h1 className="display mt-7 text-3xl leading-tight sm:text-4xl">👋 Welcome to Studium</h1>
    <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base">Let's personalize your learning experience. This will only take a few moments.</p>
    <button type="button" onClick={onStart} className="mt-9 w-full cursor-pointer rounded-full bg-[#0F8B8D] py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375] sm:w-auto sm:px-10">Get Started</button>
  </div>;
}

function QuestionScreen({ q, answers, onSelectSingle, onToggleMulti, onSkip, onBack, onContinue }: {
  q: Question;
  answers: OnboardingAnswers;
  onSelectSingle: (key: Exclude<Question["key"], "studyMethods">, value: string) => void;
  onToggleMulti: (value: string) => void;
  onSkip: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const isMulti = q.multiple === true;
  const selectedSingle = !isMulti ? answers[q.key as Exclude<Question["key"], "studyMethods">] : null;

  return <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-9">
    <div className="flex items-center justify-between">
      <button type="button" onClick={onBack} className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-600" aria-label="Back"><ChevronLeft size={18} /></button>
      <button type="button" onClick={onSkip} className="cursor-pointer text-xs font-bold text-slate-400 transition hover:text-slate-600">Skip</button>
    </div>
    <h2 className="display mt-4 text-2xl leading-tight sm:text-3xl">{q.question}</h2>
    {q.subtext && <p className="mt-2 text-sm text-slate-500">{q.subtext}</p>}
    <div className="mt-7 grid gap-3 sm:grid-cols-2">
      {q.options.map(opt => {
        const selected = isMulti ? answers.studyMethods.includes(opt) : selectedSingle === opt;
        return <button
          key={opt}
          type="button"
          onClick={() => isMulti ? onToggleMulti(opt) : onSelectSingle(q.key as Exclude<Question["key"], "studyMethods">, opt)}
          className={`flex cursor-pointer items-center justify-between gap-2 rounded-2xl border p-4 text-left text-sm font-bold transition ${selected ? "border-[#0F8B8D] bg-[#effbfa] text-[#0c6c6e]" : "border-slate-200 text-slate-700 hover:border-[#0F8B8D]/40 hover:bg-[#f9fcfc]"}`}
        >
          <span>{opt}</span>
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition ${selected ? "border-[#0F8B8D] bg-[#0F8B8D] text-white" : "border-slate-300"}`}>{selected && <Check size={12} strokeWidth={3} />}</span>
        </button>;
      })}
    </div>
    {isMulti && <button type="button" onClick={onContinue} className="mt-7 w-full cursor-pointer rounded-full bg-[#0F8B8D] py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0f8b8d] transition hover:-translate-y-0.5 hover:bg-[#0c7375]">Continue</button>}
  </div>;
}

function LoadingScreen({ answers }: { answers: OnboardingAnswers }) {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => setMessageIndex(i => Math.min(i + 1, loadingMessages.length - 1)), 1150);
    const redirectTimer = setTimeout(() => {
      completeOnboarding(answers);
      router.replace("/dashboard");
    }, 4600);

    return () => { clearInterval(messageTimer); clearTimeout(redirectTimer); };
  }, [answers, router]);

  return <div className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-soft sm:p-14">
    <span className="relative grid h-16 w-16 place-items-center rounded-full bg-[#effbfa]">
      <motion.span className="absolute inset-0 rounded-full border-2 border-[#0F8B8D]/30 border-t-[#0F8B8D]" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
      <Sparkles size={22} className="text-[#0F8B8D]" />
    </span>
    <AnimatePresence initial={false} mode="popLayout">
      <motion.p key={messageIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="mt-7 text-sm font-bold text-slate-600 sm:text-base">
        {loadingMessages[messageIndex]}
      </motion.p>
    </AnimatePresence>
  </div>;
}
