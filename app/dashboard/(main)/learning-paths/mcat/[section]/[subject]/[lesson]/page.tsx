"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Bookmark, Check, CheckCircle2, ChevronRight, Clock3, Frown, Layers,
  Lightbulb, Meh, PartyPopper, Sparkles, Wand2, X
} from "lucide-react";
import { getLevelInfo } from "@/lib/progress";
import { awardLessonKP, ClaimResult, logFlashcards, logQuiz, logStudyMinutes } from "@/lib/progress";
import {
  completeLesson, getBookmarkedCards, getLessonContent, setLessonConfidence, toggleBookmarkedCard
} from "@/lib/mcatPath";
import { InteractiveText } from "@/components/interactive-text";

type Step = "intro" | "learn" | "takeaways" | "knowledge-check" | "flashcards" | "practice" | "review" | "complete";
type Confidence = "understand" | "practice" | "confused";

const stepOrder: Step[] = ["learn", "takeaways", "knowledge-check", "flashcards", "practice", "review", "complete"];
const stepLabels: Record<Step, string> = { intro: "", learn: "Learn", takeaways: "Key Takeaways", "knowledge-check": "Knowledge Check", flashcards: "Flashcards", practice: "Practice", review: "AI Review", complete: "Complete" };

export default function MCATLessonPage({ params }: { params: { section: string; subject: string; lesson: string } }) {
  const lesson = getLessonContent(params.lesson);

  const [step, setStep] = useState<Step>("intro");
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [aiPanelText, setAiPanelText] = useState<string | null>(null);

  const [revealedKC, setRevealedKC] = useState<Set<number>>(new Set());

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardRatings, setCardRatings] = useState<Record<number, "easy" | "medium" | "hard">>({});
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<{ correct: boolean }[]>([]);

  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);
  const [showMistakes, setShowMistakes] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  useEffect(() => {
    if (lesson) setBookmarks(getBookmarkedCards(lesson.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.lesson]);

  if (!lesson) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Lesson content isn't available yet.</p>
      <Link href={`/dashboard/learning-paths/mcat/${params.section}/${params.subject}`} className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back</Link>
    </section>;
  }

  function handleMouseUp() {
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    if (!sel || sel.isCollapsed || !sel.toString().trim()) { setSelection(null); return; }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelection({ text: sel.toString().trim().slice(0, 200), x: rect.left + rect.width / 2, y: rect.top });
  }

  function toggleTerm(term: string) {
    setExpandedTerms(s => { const next = new Set(s); if (next.has(term)) next.delete(term); else next.add(term); return next; });
  }

  function flipCard() { setFlipped(f => !f); }

  function rateCard(rating: "easy" | "medium" | "hard") {
    setCardRatings(r => ({ ...r, [cardIndex]: rating }));
    setFlipped(false);
    if (cardIndex + 1 < lesson!.flashcards.length) setCardIndex(i => i + 1);
    else setStep("practice");
  }

  function toggleBookmark() {
    toggleBookmarkedCard(lesson!.id, cardIndex);
    setBookmarks(getBookmarkedCards(lesson!.id));
  }

  function selectOption(i: number) {
    if (answered) return;
    setSelectedOption(i);
    setAnswered(true);
    setResults(r => [...r, { correct: i === lesson!.practiceQuestions[qIndex].correctIndex }]);
  }

  function nextQuestion() {
    setSelectedOption(null);
    setAnswered(false);
    if (qIndex + 1 < lesson!.practiceQuestions.length) setQIndex(q => q + 1);
    else setStep("review");
  }

  function retryFlashcards() {
    setCardIndex(0);
    setFlipped(false);
    setStep("flashcards");
  }

  function retryPractice() {
    setQIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setResults([]);
    setStep("practice");
  }

  function finishLesson() {
    const accuracy = results.length ? Math.round((results.filter(r => r.correct).length / results.length) * 100) : 0;
    const timeSpentMinutes = Math.max(1, Math.round((Date.now() - (startedAt ?? Date.now())) / 60000));
    const kp = 40 + Math.round((accuracy / 100) * 20);
    completeLesson(lesson!.id, { timeSpentMinutes, quizScore: accuracy, flashcardsCompleted: lesson!.flashcards.length });
    logStudyMinutes(timeSpentMinutes);
    logFlashcards(lesson!.flashcards.length);
    logQuiz();
    const result = awardLessonKP(kp);
    setClaimResult(result);
    if (result.leveledUp) {
      const info = getLevelInfo(result.totalKP);
      setLevelUpInfo({ level: info.level, name: info.name });
    }
    setStep("complete");
  }

  function answerConfidence(conf: Confidence) {
    setLessonConfidence(lesson!.id, conf);
    setConfidence(conf);
  }

  const accuracy = results.length ? Math.round((results.filter(r => r.correct).length / results.length) * 100) : 0;
  const conceptResults: Record<string, boolean[]> = {};
  lesson.practiceQuestions.forEach((q, i) => { (conceptResults[q.concept] ??= []).push(!!results[i]?.correct); });
  const strongConcepts = Object.entries(conceptResults).filter(([, arr]) => arr.every(Boolean)).map(([c]) => c);
  const weakConcepts = Object.entries(conceptResults).filter(([, arr]) => arr.some(r => !r)).map(([c]) => c);
  const missedQuestions = lesson.practiceQuestions.filter((_, i) => results[i] && !results[i].correct);

  const stepIndex = stepOrder.indexOf(step);
  const lessonProgressPercent = step === "intro" ? 0 : Math.round(((stepIndex + 1) / stepOrder.length) * 100);

  return <section className="relative py-10 sm:py-14" onMouseUp={step === "learn" ? handleMouseUp : undefined}>
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href={`/dashboard/learning-paths/mcat/${params.section}/${params.subject}`} className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to path</Link>

    <div className="max-w-2xl">
      <span className="eyebrow"><Sparkles size={13} />{lesson.difficulty}</span>
      <h1 className="display mt-5 text-3xl leading-tight sm:text-4xl">{lesson.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1"><Clock3 size={13} />{lesson.estimatedMinutes} min</span>
        <span>{lesson.difficulty}</span>
        {step !== "intro" && <span>{stepLabels[step]}</span>}
      </div>
      {step !== "intro" && <div className="mt-3 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${lessonProgressPercent}%` }} /></div>}
    </div>

    <div className="mt-8 max-w-2xl">
      {step === "intro" && <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-soft">
        <p className="text-sm leading-relaxed text-slate-500">This lesson walks through a short reading, key takeaways, a quick knowledge check, flashcards, and practice questions—finishing with a performance review.</p>
        <button type="button" onClick={() => { setStartedAt(Date.now()); setStep("learn"); }} className="mt-6 cursor-pointer rounded-full bg-accent-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Start</button>
      </div>}

      {step === "learn" && <div className="space-y-5">
        {lesson.sections.map(sec => <div key={sec.heading} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
          <h2 className="text-lg font-extrabold tracking-tight">{sec.heading}</h2>
          <p className="mt-3 select-text text-sm leading-relaxed text-slate-600"><InteractiveText text={sec.body} /></p>
          {sec.keyTerms.length > 0 && <div className="mt-4 flex flex-wrap gap-2">
            {sec.keyTerms.map(kt => <button key={kt.term} type="button" onClick={() => toggleTerm(kt.term)} className="cursor-pointer rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100">{kt.term}</button>)}
          </div>}
          {sec.keyTerms.filter(kt => expandedTerms.has(kt.term)).map(kt => <p key={kt.term} className="mt-2 rounded-xl bg-[#f9fcfc] p-3 text-xs leading-relaxed text-slate-600"><span className="font-extrabold text-ink">{kt.term}:</span> {kt.definition}</p>)}
        </div>)}
        <p className="px-1 text-xs text-slate-400">Tip: highlight any sentence above to ask the AI to explain it.</p>
        <button type="button" onClick={() => setStep("takeaways")} className="cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Continue to Key Takeaways</button>
      </div>}

      {step === "takeaways" && <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight"><Lightbulb size={18} className="text-amber-500" />Key Takeaways</h2>
        <ul className="mt-4 space-y-3">
          {lesson.keyTakeaways.map(t => <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-500" />{t}</li>)}
        </ul>
        <button type="button" onClick={() => setStep("knowledge-check")} className="mt-6 cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Continue to Knowledge Check</button>
      </div>}

      {step === "knowledge-check" && <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-lg font-extrabold tracking-tight">Knowledge Check</h2>
        <p className="mt-1 text-sm text-slate-500">Try to answer from memory before revealing the response.</p>
        <div className="mt-5 space-y-5">
          {lesson.knowledgeCheck.map((kc, i) => <div key={kc.question} className="rounded-2xl border border-slate-100 p-4">
            <p className="text-sm font-bold text-ink">{kc.question}</p>
            {revealedKC.has(i)
              ? <p className="mt-2 rounded-xl bg-teal-50 p-3 text-sm leading-relaxed text-teal-800">{kc.answer}</p>
              : <button type="button" onClick={() => setRevealedKC(s => new Set(s).add(i))} className="mt-2 cursor-pointer rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">Show answer</button>}
          </div>)}
        </div>
        <button type="button" onClick={() => setStep("flashcards")} className="mt-6 cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Continue to Flashcards</button>
      </div>}

      {step === "flashcards" && <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight"><Layers size={18} className="text-teal-600" />Flashcards</h2>
          <p className="text-xs font-bold text-slate-500">{cardIndex + 1} / {lesson.flashcards.length}</p>
        </div>
        <div className="mt-5" style={{ perspective: 1200 }}>
          <motion.div
            onClick={flipCard}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.45 }}
            className="relative h-48 w-full cursor-pointer select-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-[#f9fcfc] p-6 text-center" style={{ backfaceVisibility: "hidden" }}>
              <p className="text-base font-extrabold text-ink">{lesson.flashcards[cardIndex].front}</p>
              <p className="mt-3 text-xs font-bold text-slate-400">Click to flip</p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <p className="text-sm leading-relaxed text-teal-900">{lesson.flashcards[cardIndex].back}</p>
            </div>
          </motion.div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button type="button" onClick={() => { setAiPanelText(lesson.flashcards[cardIndex].front); }} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]"><Wand2 size={13} />Ask AI</button>
            <button type="button" onClick={toggleBookmark} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition ${bookmarks.includes(cardIndex) ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-ink hover:border-amber-200 hover:bg-amber-50"}`}><Bookmark size={13} fill={bookmarks.includes(cardIndex) ? "currentColor" : "none"} />Bookmark</button>
          </div>
        </div>
        {flipped && <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => rateCard("hard")} className="flex-1 cursor-pointer rounded-full border border-rose-200 bg-rose-50 py-2.5 text-xs font-extrabold text-rose-700 transition hover:bg-rose-100">Hard</button>
          <button type="button" onClick={() => rateCard("medium")} className="flex-1 cursor-pointer rounded-full border border-amber-200 bg-amber-50 py-2.5 text-xs font-extrabold text-amber-700 transition hover:bg-amber-100">Medium</button>
          <button type="button" onClick={() => rateCard("easy")} className="flex-1 cursor-pointer rounded-full border border-teal-200 bg-teal-50 py-2.5 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100">Easy</button>
        </div>}
      </div>}

      {step === "practice" && <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">Practice Questions</h2>
          <p className="text-xs font-bold text-slate-500">{qIndex + 1} / {lesson.practiceQuestions.length}</p>
        </div>
        <p className="mt-4 text-sm font-bold text-ink">{lesson.practiceQuestions[qIndex].question}</p>
        <div className="mt-4 space-y-2.5">
          {lesson.practiceQuestions[qIndex].options.map((opt, i) => {
            const isCorrect = i === lesson.practiceQuestions[qIndex].correctIndex;
            const isSelected = selectedOption === i;
            let cls = "border-slate-200 hover:border-teal-200 hover:bg-[#f9fcfc]";
            if (answered) cls = isCorrect ? "border-teal-500 bg-teal-50" : isSelected ? "border-rose-300 bg-rose-50" : "border-slate-100 opacity-60";
            return <div key={i}>
              <button type="button" disabled={answered} onClick={() => selectOption(i)} className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold text-ink transition ${answered ? "cursor-default" : "cursor-pointer"} ${cls}`}>
                <span>{opt}</span>
                {answered && isCorrect && <Check size={16} className="shrink-0 text-teal-600" />}
                {answered && isSelected && !isCorrect && <X size={16} className="shrink-0 text-rose-500" />}
              </button>
              {answered && <p className={`mt-1.5 px-1 text-xs leading-relaxed ${isCorrect ? "text-teal-700" : "text-slate-500"}`}>{lesson.practiceQuestions[qIndex].optionExplanations[i]}</p>}
            </div>;
          })}
        </div>
        {answered && <button type="button" onClick={nextQuestion} className="mt-5 cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">{qIndex + 1 < lesson.practiceQuestions.length ? "Next question" : "See AI Review"}</button>}
      </div>}

      {step === "review" && <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-lg font-extrabold tracking-tight">AI Review</h2>
        <p className="mt-1 text-sm text-slate-500">You scored {accuracy}% on this lesson's practice questions.</p>
        {strongConcepts.length > 0 && <p className="mt-4 text-sm leading-relaxed text-slate-600"><span className="font-extrabold text-teal-700">You performed well on:</span> {strongConcepts.join(", ")}.</p>}
        {weakConcepts.length > 0 && <p className="mt-2 text-sm leading-relaxed text-slate-600"><span className="font-extrabold text-rose-600">You should review:</span> {weakConcepts.join(", ")}.</p>}
        {weakConcepts.length === 0 && <p className="mt-2 text-sm leading-relaxed text-slate-600">You got every question right—nice work.</p>}

        {showMistakes && missedQuestions.length > 0 && <div className="mt-5 space-y-3 rounded-2xl bg-[#f9fcfc] p-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">What you missed</p>
          {missedQuestions.map(q => <div key={q.question} className="border-t border-slate-100 pt-3 first:border-0 first:pt-0">
            <p className="text-sm font-bold text-ink">{q.question}</p>
            <p className="mt-1 text-xs leading-relaxed text-teal-700">{q.optionExplanations[q.correctIndex]}</p>
          </div>)}
        </div>}

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button type="button" onClick={() => setStep("learn")} className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">Review Lesson</button>
          <button type="button" onClick={() => setAiNotice("Generating new questions isn't connected in this demo yet.")} className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">Generate More Questions</button>
          <button type="button" onClick={() => setAiNotice("Generating new flashcards isn't connected in this demo yet.")} className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">Generate More Flashcards</button>
          {missedQuestions.length > 0 && <button type="button" onClick={() => setShowMistakes(s => !s)} className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">{showMistakes ? "Hide Mistakes" : "Explain My Mistakes"}</button>}
        </div>
        {aiNotice && <p className="mt-3 text-xs font-bold text-slate-400">{aiNotice}</p>}

        <button type="button" onClick={finishLesson} className="mt-6 cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Finish Lesson</button>
      </div>}

      {step === "complete" && claimResult && <div className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-600"><PartyPopper size={30} /></span>
          <h2 className="display mt-4 text-2xl">Lesson complete!</h2>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-[#f9fcfc] p-4 text-center"><p className="text-xl font-extrabold text-ink">{accuracy}%</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Accuracy</p></div>
          <div className="rounded-2xl bg-[#f9fcfc] p-4 text-center"><p className="text-xl font-extrabold text-ink">{Math.max(1, Math.round((Date.now() - (startedAt ?? Date.now())) / 60000))} min</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Time spent</p></div>
          <div className="relative rounded-2xl bg-[#f9fcfc] p-4 text-center">
            <p className="text-xl font-extrabold text-teal-600">+{claimResult.kpAwarded}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">KP earned</p>
            <AnimatePresence>
              <motion.span initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} transition={{ duration: 1.4 }} className="pointer-events-none absolute -top-2 right-3 text-xs font-extrabold text-teal-600">+{claimResult.kpAwarded} KP</motion.span>
            </AnimatePresence>
          </div>
          <div className="rounded-2xl bg-[#f9fcfc] p-4 text-center"><p className="text-xl font-extrabold text-ink">Lvl {claimResult.toLevel}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">Updated level</p></div>
        </div>

        {confidence === null ? <div className="mt-7 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm font-bold text-ink">How confident do you feel with this topic?</p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <button type="button" onClick={() => answerConfidence("understand")} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-teal-200 bg-teal-50 py-3 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100"><CheckCircle2 size={15} />I understand it well</button>
            <button type="button" onClick={() => answerConfidence("practice")} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 py-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-100"><Meh size={15} />I need more practice</button>
            <button type="button" onClick={() => answerConfidence("confused")} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 py-3 text-xs font-extrabold text-rose-700 transition hover:bg-rose-100"><Frown size={15} />I'm still confused</button>
          </div>
        </div> : <div className="mt-7 border-t border-slate-100 pt-6">
          {confidence === "understand" && <p className="text-center text-sm text-teal-700">Nice work—the next lesson is unlocked.</p>}
          {confidence === "practice" && <div className="text-center">
            <p className="text-sm text-slate-600">No problem—here's another pass at the flashcards and practice questions.</p>
            <div className="mt-4 flex justify-center gap-2.5">
              <button type="button" onClick={retryFlashcards} className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">Practice flashcards again</button>
              <button type="button" onClick={retryPractice} className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-extrabold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">Retry practice questions</button>
            </div>
          </div>}
          {confidence === "confused" && <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Simplified explanation</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{lesson.simplifiedExplanation}</p>
            {lesson.prerequisiteLessonId && <Link href={`/dashboard/learning-paths/mcat/${params.section}/${params.subject}/${lesson.prerequisiteLessonId}`} className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Review the prerequisite lesson</Link>}
          </div>}

          <div className="mt-6 text-center">
            <Link href={`/dashboard/learning-paths/mcat/${params.section}/${params.subject}`} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Continue to Next Lesson<ChevronRight size={16} /></Link>
          </div>
        </div>}
      </div>}
    </div>

    {/* Text-selection "Explain with AI" popover */}
    {selection && step === "learn" && <button
      type="button"
      onClick={() => { setAiPanelText(selection.text); setSelection(null); }}
      style={{ position: "fixed", left: selection.x, top: Math.max(8, selection.y - 44) }}
      className="z-40 -translate-x-1/2 cursor-pointer whitespace-nowrap rounded-full bg-ink px-3.5 py-2 text-xs font-extrabold text-white shadow-lift"
    >✨ Explain with AI</button>}

    {/* Inline AI panel, stays anchored so it doesn't take the user away from the lesson */}
    <AnimatePresence>
      {aiPanelText && <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-5 right-5 z-40 w-full max-w-xs rounded-2xl border border-slate-100 bg-white p-4 shadow-lift"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700"><Wand2 size={13} />AI Explanation</p>
          <button type="button" onClick={() => setAiPanelText(null)} aria-label="Close" className="cursor-pointer text-slate-400 hover:text-ink"><X size={14} /></button>
        </div>
        <p className="mt-2 rounded-lg bg-[#f9fcfc] p-2 text-xs italic text-slate-500">"{aiPanelText}"</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">AI explanations aren't connected in this demo yet—this is where a live, tailored explanation of your selection would appear.</p>
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
