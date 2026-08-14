"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BookmarkCheck, Bookmark, Check, ChevronRight, Circle, Gauge,
  PauseCircle, PlayCircle, Rewind, FastForward, Sparkles, Volume2
} from "lucide-react";
import { InteractiveText } from "@/components/interactive-text";
import { QuickCheck } from "@/components/scientific-method/quick-check";
import { useLessonSpeech } from "@/components/scientific-method/use-lesson-speech";
import { bigPicture, concepts, Concept, Difficulty, lessonIntro } from "@/lib/scientificMethodLesson";
import { isInLibrary, toggleLibrarySave } from "@/lib/myLibrary";
import { LessonContent } from "@/lib/mcatPath";
import { SectionTour } from "@/components/product-tour/SectionTour";
import { lessonTourSteps } from "@/lib/productTour";

const PROGRESS_KEY = "studium_sm_concepts_v1";

function loadProgress(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "[]")); } catch { return new Set(); }
}
function saveProgress(ids: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(ids)));
}

// Shared text-scale tokens so every "Learn"/"Core Idea"/etc. label reads as
// the same document typographic system rather than each concept improvising
// its own heading size.
const sectionLabel = "text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500";
const prose = "max-w-[68ch] text-[15px] leading-[1.85] text-slate-700 dark:text-slate-300";

const difficultyTone: Record<Difficulty, string> = {
  UNDERSTAND: "text-teal-600 dark:text-teal-300",
  IDENTIFY: "text-teal-700 dark:text-teal-300",
  INTERPRET: "text-amber-600 dark:text-amber-300",
  REASON: "text-amber-700 dark:text-amber-300"
};

// The Scientific Method lesson's own redesigned "Learn" experience: one
// large document-styled container (premium-textbook aesthetic, not a
// dashboard card) containing a lesson intro, a "Big Picture" overview, and
// four concepts each following Core Idea → Learn → Visualize/Analyze →
// MCAT Connection → Apply → Key Takeaway. Deliberately isolated here (not
// folded into the shared lesson page's markup) so no other lesson's Learn
// step is touched; see this component's call site in
// app/dashboard/learning-paths/mcat/[section]/[subject]/[lesson]/page.tsx
// for the exact one-lesson gate.
export function ScientificMethodLesson({
  lesson, onOpenAI, onContinueToFlashcards
}: {
  lesson: LessonContent;
  onOpenAI: (prompt?: string) => void;
  onContinueToFlashcards: () => void;
}) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDone(loadProgress());
    setSaved(isInLibrary("lesson", lesson.id));
  }, [lesson.id]);

  function markDone(id: string) {
    setDone(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      saveProgress(next);
      return next;
    });
  }

  function toggleSave() {
    setSaved(toggleLibrarySave("lesson", lesson.id));
  }

  const speechText = useMemo(() => concepts.map(c => `${c.title}. ${c.coreIdea} ${c.learn.join(" ")}`).join(" "), []);
  const speech = useLessonSpeech(speechText);

  const percent = Math.round((done.size / concepts.length) * 100);
  const allDone = done.size === concepts.length;

  function scrollToConcept(id: string) {
    document.getElementById(`concept-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return <div>
    {/* The document: one large bordered surface, deliberately not the
        app's usual rounded-3xl/shadow-soft card idiom—a moderate radius,
        a restrained shadow, and a paper-toned surface distinct from both
        the dashboard background and a standard white card, so it reads as
        a study document placed inside Studium rather than another widget. */}
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-[#fdfcf9] dark:bg-[#0d1917] px-6 py-10 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.14)] dark:shadow-none dark:ring-1 dark:ring-white/[0.03] sm:px-12 sm:py-14 lg:px-16 lg:py-16">

      {/* Document header: title block + a quiet utility row, not a bold
          toolbar competing with the title. */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <span className={sectionLabel}>{lesson.difficulty}</span>
          <h1 className="display mt-3 text-3xl leading-tight text-heading sm:text-4xl">{lesson.title}</h1>
          <p className="mt-2 text-xs font-bold text-slate-500">{lesson.estimatedMinutes} min · {lesson.difficulty}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 pt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
          <button type="button" onClick={() => onOpenAI()} className="flex cursor-pointer items-center gap-1.5 transition hover:text-teal-700 dark:hover:text-teal-300"><Sparkles size={13} />Studium AI</button>
          <span className="text-slate-200 dark:text-white/10">|</span>
          <button type="button" onClick={toggleSave} className="flex cursor-pointer items-center gap-1.5 transition hover:text-teal-700 dark:hover:text-teal-300">
            {saved ? <BookmarkCheck size={13} className="text-teal-600 dark:text-teal-300" /> : <Bookmark size={13} />}
            {saved ? "Saved" : "Save"}
          </button>
          {speech.supported && <>
            <span className="text-slate-200 dark:text-white/10">|</span>
            {!speech.playing && !speech.paused
              ? <button type="button" onClick={speech.play} className="flex cursor-pointer items-center gap-1.5 transition hover:text-teal-700 dark:hover:text-teal-300"><Volume2 size={13} />Listen</button>
              : <span className="flex items-center gap-1">
                <button type="button" onClick={() => speech.skip(-1)} title="Back" className="cursor-pointer p-1 transition hover:text-teal-700 dark:hover:text-teal-300"><Rewind size={12} /></button>
                <button type="button" onClick={speech.paused ? speech.play : speech.pause} title={speech.paused ? "Resume" : "Pause"} className="cursor-pointer p-1 text-teal-700 dark:text-teal-300"><span className="sr-only">Toggle</span>{speech.paused ? <PlayCircle size={14} /> : <PauseCircle size={14} />}</button>
                <button type="button" onClick={() => speech.skip(1)} title="Forward" className="cursor-pointer p-1 transition hover:text-teal-700 dark:hover:text-teal-300"><FastForward size={12} /></button>
                <button type="button" onClick={speech.cycleRate} className="cursor-pointer px-1 transition hover:text-teal-700 dark:hover:text-teal-300">{speech.rate}×</button>
                <button type="button" onClick={speech.stop} className="cursor-pointer px-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Stop</button>
              </span>}
          </>}
        </div>
      </div>

      {/* Progress + contents—styled as a document table of contents, not a
          row of dashboard chips. */}
      <div data-tour="lesson-concept-nav" className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-slate-100 dark:border-white/10 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${percent}%` }} /></div>
          <span className="text-[11px] font-bold text-slate-400">{done.size} of {concepts.length} concepts</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {concepts.map(c => {
            const isDone = done.has(c.id);
            return <button key={c.id} type="button" onClick={() => scrollToConcept(c.id)} className={`flex cursor-pointer items-center gap-1.5 text-xs font-bold transition ${isDone ? "text-teal-700 dark:text-teal-300" : "text-slate-500 dark:text-slate-400 hover:text-heading"}`}>
              {isDone ? <Check size={11} /> : <Circle size={7} />}{c.title}
            </button>;
          })}
        </div>
      </div>

      {/* Lesson introduction */}
      <div className={`${prose} mt-10`}>
        <p>{lessonIntro.description}</p>
      </div>
      <div className="mt-6 max-w-[68ch]">
        <p className={sectionLabel}>What You&apos;ll Learn</p>
        <ul className="mt-3 space-y-2">
          {lessonIntro.objectives.map(o => <li key={o} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-500" />{o}</li>)}
        </ul>
      </div>

      {/* THE BIG PICTURE */}
      <div className="mt-14 border-t border-slate-100 dark:border-white/10 pt-14">
        <p className={sectionLabel}>The Big Picture</p>
        <FlowDiagram steps={bigPicture.flow as unknown as string[]} />
        <p className="mt-3 max-w-[62ch] text-xs leading-relaxed text-slate-400">{bigPicture.caption}</p>
      </div>

      {/* Concepts */}
      {concepts.map(c => <ConceptSection
        key={c.id}
        concept={c}
        onAnswered={() => markDone(c.id)}
        onTeachMe={() => onOpenAI(`Before we continue in the Scientific Method lesson, quiz me on "${c.title}"—ask me one question and evaluate my answer.`)}
      />)}
    </div>

    {/* Bridge out of the document into the app's normal completion UI,
        which leads into the existing (unchanged) Flashcards step. */}
    <div className="mt-8 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-7 shadow-soft sm:p-8">
      <p className="text-sm font-extrabold text-heading">You should now be able to:</p>
      <ul className="mt-3 space-y-2">
        {concepts.map(c => c.keyTakeaway).map(t => <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <Check size={15} className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-400" />{t}
        </li>)}
      </ul>

      <div className="mt-6 border-t border-slate-100 dark:border-white/10 pt-6">
        <p className="text-sm font-bold text-heading">Ready to test yourself?</p>
        <p className="mt-1 text-xs text-slate-500">{allDone ? "You've completed the lesson." : `${concepts.length - done.size} concept${concepts.length - done.size === 1 ? "" : "s"} left before you're done reading—flashcards are ready whenever you are.`}</p>
        <button type="button" onClick={onContinueToFlashcards} className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Review Flashcards<ChevronRight size={16} /></button>
      </div>
    </div>

    <p className="mt-3 px-1 text-xs text-slate-400">Tip: highlight any sentence above for more options.</p>
    <SectionTour id="lesson" steps={lessonTourSteps} />
  </div>;
}

function FlowDiagram({ steps }: { steps: string[] }) {
  return <div className="mt-4 flex flex-wrap items-center gap-2">
    {steps.map((step, i) => <div key={step} className="flex items-center gap-2">
      <span className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-heading">{step}</span>
      {i < steps.length - 1 && <ArrowRight size={13} className="shrink-0 text-slate-300 dark:text-slate-600" />}
    </div>)}
  </div>;
}

function ConceptSection({ concept: c, onAnswered, onTeachMe }: { concept: Concept; onAnswered: () => void; onTeachMe: () => void }) {
  return <div id={`concept-${c.id}`} className="scroll-mt-24 mt-16 border-t border-slate-100 dark:border-white/10 pt-16">
    <div className="flex items-baseline gap-3">
      <span className="font-display text-2xl font-extrabold text-slate-300 dark:text-slate-700">{c.number}</span>
      <div>
        <p className={`text-[10px] font-extrabold uppercase tracking-[0.1em] ${difficultyTone[c.difficulty]}`}>{c.difficulty}</p>
        <h2 className="font-display text-xl font-extrabold tracking-tight text-heading">{c.title}</h2>
      </div>
    </div>

    {/* Core Idea — subtle highlighted thesis statement, not a boxed card */}
    <div className="mt-5 max-w-[62ch] border-l-2 border-teal-300 dark:border-teal-500/40 pl-4">
      <p className={sectionLabel}>Core Idea</p>
      <p className="mt-1.5 text-base font-medium leading-relaxed text-heading">{c.coreIdea}</p>
    </div>

    {/* Learn — plain document prose */}
    <div className="mt-7">
      <p className={sectionLabel}>Learn</p>
      <div className={`${prose} mt-3 space-y-4`}>
        {c.learn.map(p => <p key={p}><InteractiveText text={p} /></p>)}
      </div>
    </div>

    {/* Visualize / Analyze */}
    {c.variableFlow && <div className="mt-8">
      <p className={sectionLabel}>Visualize</p>
      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center gap-1.5">
          <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-2.5 text-center">
            <p className="text-xs font-extrabold text-heading">Independent Variable</p>
            <p className="text-[10px] text-slate-500">What you change</p>
          </div>
          <div className="h-5 w-px bg-slate-300 dark:bg-white/20" />
          <div className="rounded-lg border border-teal-300 dark:border-teal-500/40 bg-teal-50/70 dark:bg-teal-500/10 px-4 py-1.5 text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-700 dark:text-teal-300">Experiment</p>
          </div>
          <div className="h-5 w-px bg-slate-300 dark:bg-white/20" />
          <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-2.5 text-center">
            <p className="text-xs font-extrabold text-heading">Dependent Variable</p>
            <p className="text-[10px] text-slate-500">What you measure</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 sm:pl-4">
          <p className="text-xs leading-relaxed text-slate-500"><span className="font-extrabold text-heading">Control group</span> — baseline, receives no treatment, isolates the effect.</p>
          <p className="text-xs leading-relaxed text-slate-500"><span className="font-extrabold text-heading">Confounding variable</span> — left uncontrolled, can mimic or hide a real effect.</p>
        </div>
      </div>
    </div>}

    {c.number === "01" && <div className="mt-8">
      <p className={sectionLabel}>Visualize</p>
      <FlowDiagram steps={bigPicture.flow as unknown as string[]} />
    </div>}

    {c.dataTable && <div className="mt-8">
      <p className={sectionLabel}>Analyze</p>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c.dataTable.caption}</p>
      <div className="mt-3 max-w-lg divide-y divide-slate-100 dark:divide-white/10 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
        {c.dataTable.rows.map(r => <div key={r.label} className="flex items-center justify-between gap-3 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-xs">
          <span className="font-bold text-slate-500">{r.label}</span>
          <span className="font-extrabold text-heading">{r.value}</span>
        </div>)}
      </div>
    </div>}

    {c.correlationExample && <div className="mt-8">
      <p className={sectionLabel}>Visualize</p>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c.correlationExample.relationship}</p>
      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-2 text-center text-xs font-extrabold text-heading">Ice cream sales</span>
          <span className="text-[11px] font-bold text-slate-400">↕</span>
          <span className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-2 text-center text-xs font-extrabold text-heading">Drowning incidents</span>
        </div>
        <div className="h-5 w-px bg-amber-300 dark:bg-amber-500/50" />
        <span className="rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-500/10 px-4 py-1.5 text-center text-[11px] font-extrabold uppercase tracking-wide text-amber-800 dark:text-amber-300">Warm weather → influences both</span>
      </div>
      <p className="mt-4 max-w-[62ch] text-xs leading-relaxed text-slate-500">{c.correlationExample.confound}</p>
    </div>}

    {/* MCAT Connection — restrained callout, quieter than Core Idea */}
    <div className="mt-8 max-w-[62ch] border-l-2 border-amber-300 dark:border-amber-500/40 pl-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-amber-700 dark:text-amber-400">MCAT Connection</p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c.mcatConnection}</p>
    </div>

    {/* Apply — the one place that reads as a distinct interactive area */}
    <div className="mt-8">
      <p className={sectionLabel}>Apply</p>
      <QuickCheck data={c.quickCheck} onAnswered={onAnswered} />
      <button type="button" onClick={onTeachMe} className="mt-3 cursor-pointer text-xs font-bold text-slate-400 transition hover:text-teal-700 dark:hover:text-teal-300">Teach me this concept →</button>
    </div>

    {/* Key Takeaway — clean concluding treatment, no box */}
    <div className="mt-8 border-t border-slate-100 dark:border-white/10 pt-5">
      <p className={sectionLabel}>Key Takeaway</p>
      <p className="mt-1.5 max-w-[62ch] text-sm font-bold leading-relaxed text-heading">{c.keyTakeaway}</p>
    </div>
  </div>;
}
