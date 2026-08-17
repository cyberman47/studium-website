"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Bot, Bookmark, Check, HelpCircle, Layers, PartyPopper, PenLine, Stethoscope, Volume2, Wand2, X
} from "lucide-react";
import { AiTutorPanel } from "@/components/ai-tutor-panel";
import { DeckPicker } from "@/components/deck-picker";
import { addCardsToDeck } from "@/lib/flashcardDecks";
import { showKnowledgeToast } from "@/lib/kpToast";
import { ClaimResult, getLevelInfo, getTotalKP } from "@/lib/progress";
import { detectTerms } from "@/lib/termDetection";
import { getConditionsForTerm } from "@/lib/termConditions";
import {
  awardTermClickKP, ConfidenceLevel, findTermCategory, getTerm, getTermConfidence, getTermMasteryState, getTermNote,
  isTermFavorited, learnTerm, MasteryState, recordTermView, saveTermNote, setTermConfidence, Term, TERM_PROGRESS_EVENT,
  toggleTermFavorite
} from "@/lib/terminology";
import { TutorContext } from "@/lib/tutorChat";

// Same three real states everywhere a familiarity control appears—labels and
// colors match the Terminology homepage exactly, no separate vocabulary.
const familiarityLevels: { level: ConfidenceLevel; label: string; dot: string; active: string }[] = [
  { level: "dont-know", label: "Unfamiliar", dot: "bg-rose-500", active: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300" },
  { level: "somewhat", label: "Learning", dot: "bg-amber-500", active: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300" },
  { level: "know-well", label: "Know", dot: "bg-teal-500", active: "border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300" }
];

// Speaks a term aloud using the browser's built-in Web Speech API—genuinely
// works offline, no backend or API key needed. Silently no-ops on browsers
// without speechSynthesis support instead of throwing.
function speakTerm(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel(); // don't stack overlapping utterances
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

// Drop-in replacement for plain text content: detects real Terminology terms
// in the string and highlights each one according to the reader's own
// mastery of it—Unknown (yellow), Learning (subtle blue underline), or
// Mastered (no highlight at all, blends into normal text). Two readers with
// different learning histories see different words highlighted for the
// exact same lesson.
//
// `interactive` (default true) turns this off entirely, rendering plain,
// unstyled text instead—used by flashcard review (components/flashcard-
// focus-mode.tsx, components/smart-review-session.tsx), where hovering a
// term to reveal its definition would let a student see the answer without
// actually recalling it, defeating the point of the review.
export function InteractiveText({ text, interactive = true }: { text: string; interactive?: boolean }) {
  const segments = detectTerms(text);
  if (!interactive) return <>{segments.map((seg, i) => <span key={i}>{seg.value}</span>)}</>;
  return <>{segments.map((seg, i) => seg.type === "term"
    ? <HighlightedTerm key={`${seg.term.id}-${i}`} term={seg.term} matchedText={seg.value} />
    : <span key={i}>{seg.value}</span>)}</>;
}

const knowledgeLevels: { level: ConfidenceLevel; symbol: string | null; title: string; border: string; filled: string }[] = [
  { level: "dont-know", symbol: "1", title: "I don't know this", border: "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-500/40 dark:text-amber-300 dark:hover:bg-amber-500/10", filled: "bg-amber-500 text-white" },
  { level: "somewhat", symbol: "2", title: "I'm learning this", border: "border-sky-300 text-sky-700 hover:bg-sky-50 dark:border-sky-500/40 dark:text-sky-300 dark:hover:bg-sky-500/10", filled: "bg-sky-500 text-white" },
  // Mastered uses the app's own accent teal rather than a level-specific
  // color, since it's the "complete" state rather than one more rung on
  // the same ladder—symbol is null here; the ✓ icon is rendered specially.
  { level: "know-well", symbol: null, title: "I know this well", border: "border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-500/40 dark:text-teal-300 dark:hover:bg-teal-500/10", filled: "bg-teal-500 text-white" }
];

// Mastery state depends on localStorage, which isn't available during SSR.
// We default to "unknown" (the safe, SSR-matching state) and correct it
// right after mount—same pattern used everywhere else in this app for
// localStorage-derived UI.
function HighlightedTerm({ term, matchedText }: { term: Term; matchedText: string }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mastery, setMastery] = useState<MasteryState>("unknown");
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [justMastered, setJustMastered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMastery(getTermMasteryState(term.id));
    function onProgressChange() { setMastery(getTermMasteryState(term.id)); }
    window.addEventListener(TERM_PROGRESS_EVENT, onProgressChange);
    return () => window.removeEventListener(TERM_PROGRESS_EVENT, onProgressChange);
  }, [term.id]);

  useEffect(() => {
    if (!pinned) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setPinned(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [pinned]);

  function handleResult(result: ClaimResult | null) {
    if (result?.awarded) {
      showKnowledgeToast(result.kpAwarded);
      if (result.leveledUp) {
        const info = getLevelInfo(result.totalKP);
        setLevelUpInfo({ level: info.level, name: info.name });
      }
    }
  }

  // One click, no confirmation: setTermConfidence both rates the term AND
  // creates its progress entry if none exists yet (that entry *is* the
  // flashcard—same spaced-repetition record Terminology review uses), so a
  // single call already satisfies "save + auto-generate flashcard + update
  // spaced repetition". The progress-change event it fires updates every
  // highlighted instance of this term on the page instantly.
  function handleKnowledge(level: ConfidenceLevel) {
    setConfidence(level);
    handleResult(setTermConfidence(term.id, level));
    if (level === "know-well") {
      // Give the reward pulse a moment to actually be seen before the
      // popup closes—everything still resolves well under 200ms.
      setJustMastered(true);
      setTimeout(() => { setJustMastered(false); setPinned(false); }, 200);
    } else {
      setPinned(false);
    }
  }

  // Opening the popup is the "press" moment: awards 1 KP (once ever per
  // term, so re-opening the same word can't be farmed), auto-adds the term
  // to the student's terminology library (learnTerm—idempotent, so this is
  // a no-op on a term that's already in it), loads any note already saved
  // for it, and loads the student's prior rating (if any) so the correct
  // circle shows filled instead of always starting blank. Adding it here
  // rather than only on a confidence pick is what makes the yellow "unknown"
  // highlight clear the moment a word is pressed, before the student has
  // rated it at all—getTermMasteryState now treats "in the library" and
  // "rated" as separate things.
  function togglePopup() {
    if (!pinned) {
      handleResult(awardTermClickKP(term.id));
      handleResult(learnTerm(term.id));
      recordTermView(term.id);
      setNoteText(getTermNote(term.id));
      setNoteOpen(false);
      setNoteSaved(false);
      setConfidence(getTermConfidence(term.id));
    }
    setPinned(p => !p);
  }

  function handleSaveNote() {
    saveTermNote(term.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1200);
  }

  // Mastered terms visually blend into the reading text at rest—no
  // background, no underline—but stay real, clickable buttons rather than
  // going fully inert. Locking a word out entirely once mastered meant
  // there was no way back in: no reviewing the definition, no hearing it
  // pronounced, no changing your mind and re-rating it. A faint hover cue
  // keeps it discoverable without adding visual clutter while reading.
  const triggerClass = mastery === "unknown"
    ? "cursor-pointer rounded px-0.5 font-semibold bg-amber-200/70 text-heading transition-all duration-200 ease-out hover:bg-amber-300/80 hover:shadow-[0_0_0_3px_rgba(217,119,6,0.18)] dark:bg-amber-500/25 dark:text-amber-100 dark:hover:bg-amber-500/35 dark:hover:shadow-[0_0_0_3px_rgba(217,119,6,0.25)]"
    : mastery === "learning"
      ? "cursor-pointer border-b border-sky-400/60 font-normal text-heading transition-all duration-200 ease-out hover:border-sky-500 hover:bg-sky-50 dark:text-white dark:hover:bg-sky-500/10"
      : "cursor-pointer rounded px-0.5 font-normal text-heading transition-all duration-200 ease-out hover:bg-slate-100 dark:text-white dark:hover:bg-white/10";

  const visible = hovered || pinned;

  return <span ref={ref} className="relative inline-block" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    {/* stopPropagation matters here: this trigger now shows up inside
        surfaces with their own click handlers on an ancestor (a flashcard
        that flips on click, a quiz option that grades on click)—without it,
        opening a term's popup would also fire whatever the parent does. */}
    <button type="button" data-tour-term={term.id} onClick={e => { e.stopPropagation(); togglePopup(); }} className={triggerClass}>
      {matchedText}
    </button>
    {/* Rendered as <span>s throughout (never <div>/<p>) since this popover can be
        nested inside a parent <p> at the call site—block elements there would be
        invalid HTML, which browsers "fix" by force-closing the parent <p> early,
        corrupting the DOM React expects and breaking event handling downstream. */}
    <AnimatePresence>
      {visible && <motion.span
        initial={{ opacity: 0, y: 4, scale: 0.97, x: "-50%" }}
        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
        exit={{ opacity: 0, y: 4, scale: 0.97, x: "-50%" }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto absolute bottom-full left-1/2 z-40 mb-3 w-72 cursor-auto rounded-2xl border border-[#EEF2F7] bg-white px-5 pb-4 pt-5 text-left shadow-[0_12px_32px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#0d1917] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
      >
        {/* Header: name + pronunciation, perfectly baseline-aligned */}
        <span className="flex items-center justify-between gap-3">
          <span className="block truncate text-[15px] font-bold tracking-tight text-heading dark:text-white">{term.name}</span>
          <button
            type="button" title="Pronounce" aria-label="Pronounce" onClick={() => speakTerm(term.name)}
            className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-[#0F8B8D] active:scale-95 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-teal-300"
          ><Volume2 size={14} /></button>
        </span>

        {/* Definition, with a small muted label for hierarchy */}
        <span className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Definition</span>
        <span className={`mt-1.5 block text-[13px] leading-[1.6] text-slate-600 dark:text-slate-300 ${pinned ? "" : "line-clamp-3"}`}>{term.definition}</span>

        {pinned && <>
          <span className="mt-4 block border-t border-[#EEF2F7] dark:border-white/10" />

          <span className="mt-3.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Understanding</span>
          <span className="mt-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              {knowledgeLevels.map(lvl => {
                const active = confidence === lvl.level;
                const pulsing = justMastered && lvl.level === "know-well";
                return <motion.button
                  key={lvl.level}
                  type="button"
                  title={lvl.title}
                  aria-label={lvl.title}
                  aria-pressed={active}
                  onClick={() => handleKnowledge(lvl.level)}
                  animate={pulsing ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full text-[13px] font-bold transition-colors duration-150 ${active ? lvl.filled : `border ${lvl.border}`}`}
                >{lvl.symbol ?? <Check size={13} strokeWidth={3} />}</motion.button>;
              })}
            </span>
            <span className="flex items-center gap-0.5">
              <button
                type="button"
                title={noteText ? "Edit your note" : "Add a note"}
                aria-label="Notes"
                onClick={() => setNoteOpen(o => !o)}
                className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-bold transition-all duration-150 active:scale-95 ${noteOpen || noteText ? "bg-[#effbfa] text-[#0F8B8D] dark:bg-teal-500/15 dark:text-teal-300" : "text-slate-400 hover:bg-slate-100 hover:text-[#0F8B8D] dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-teal-300"}`}
              ><PenLine size={12} />Edit</button>
              <button
                type="button"
                title="Expand for more detail"
                aria-label="Expand"
                onClick={() => { setExpanded(true); setPinned(false); }}
                className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-bold text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-[#0F8B8D] active:scale-95 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-teal-300"
              >Expand<ArrowRight size={12} /></button>
            </span>
          </span>

          {noteOpen && <span className="mt-3.5 block border-t border-[#EEF2F7] pt-3.5 dark:border-white/10">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={2}
              placeholder={`Note about ${term.name}...`}
              className="w-full resize-none rounded-lg border border-slate-200 p-2 text-[13px] leading-relaxed text-heading outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-[#0F8B8D]/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            />
            <button type="button" onClick={handleSaveNote} className="mt-2 flex cursor-pointer items-center gap-1 rounded-full bg-accent-500 px-3 py-1.5 text-[11px] font-extrabold text-white transition-all duration-150 hover:bg-accent-600 active:scale-95">
              {noteSaved ? <Check size={11} /> : null}{noteSaved ? "Saved" : "Save Note"}
            </button>
          </span>}
        </>}

        <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[#EEF2F7] bg-white dark:border-white/10 dark:bg-[#0d1917]" />
      </motion.span>}
    </AnimatePresence>

    <AnimatePresence>
      {expanded && <ExpandedTermPanel initialTermId={term.id} onClose={() => setExpanded(false)} />}
    </AnimatePresence>

    <AnimatePresence>
      {levelUpInfo && <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setLevelUpInfo(null)}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="block w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-lift dark:bg-[#0d1917] dark:shadow-none dark:ring-1 dark:ring-white/10"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300"><PartyPopper size={30} /></span>
          <span className="display mt-5 block text-2xl text-heading dark:text-white">🎉 Level Up!</span>
          <span className="mt-2 block text-sm leading-relaxed text-slate-500 dark:text-slate-400">Congratulations! You've reached <span className="font-extrabold text-heading dark:text-white">Level {levelUpInfo.level} · {levelUpInfo.name}</span>.</span>
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Awesome!</button>
        </motion.span>
      </motion.span>}
    </AnimatePresence>
  </span>;
}

// The deep-dive view, only ever reached by explicitly clicking the arrow—
// the default click-a-term experience above never opens this, so reading
// stays uninterrupted unless the student asks for more. Exported so other
// "click a term" surfaces (e.g. the Terminology category browse list) can
// reuse this exact same on-page summary instead of navigating away.
export function ExpandedTermPanel({ initialTermId, onClose }: { initialTermId: string; onClose: () => void }) {
  const router = useRouter();
  const [currentId, setCurrentId] = useState(initialTermId);
  const term = getTerm(currentId);
  const [favorited, setFavorited] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [deckPickerOpen, setDeckPickerOpen] = useState(false);
  const [addedToDeck, setAddedToDeck] = useState(false);
  // "Ask Studium AI" used to navigate to the standalone /dashboard/ai-tutor
  // page—a real chat, but a generic one with no idea which term you'd
  // opened it from. This docks the same real AiTutorPanel on the right of
  // the screen instead, scoped to this exact term, so asking about it
  // doesn't mean losing your place. Left open (not reset) across "Related
  // concepts" clicks—liveTutorContext below is rebuilt from whatever term
  // is current on every render, same live-context pattern as the flashcard
  // Focus Mode's own docked panel.
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    if (!term) return;
    setFavorited(isTermFavorited(term.id));
    setConfidence(getTermConfidence(term.id));
    setNoteText(getTermNote(term.id));
    setNoteOpen(false);
    setNoteSaved(false);
    setAddedToDeck(false);
    recordTermView(term.id);
  }, [term?.id]);

  if (!term) return null;

  const liveTutorContext: TutorContext = {
    sectionName: findTermCategory(term.categoryId)?.name ?? "",
    subjectName: "Terminology",
    lessonTitle: term.name,
    lessonId: `term:${term.id}`,
    currentStep: "Term Lookup",
    currentFlashcard: null,
    currentPracticeQuestion: null,
    recentMistakes: [],
    studentLevel: (() => { const l = getLevelInfo(getTotalKP()); return `Level ${l.level} · ${l.name}`; })(),
    currentOnScreenText: [
      `Term: ${term.name}`,
      `Definition: ${term.definition}`,
      term.aiExplanation && `Simple explanation: ${term.aiExplanation}`,
      term.clinicalRelevance && `Clinical relevance: ${term.clinicalRelevance}`
    ].filter(Boolean).join("\n")
  };

  const relatedTerms = term.relatedTermIds.map(id => getTerm(id)).filter((t): t is Term => !!t);
  const conditions = getConditionsForTerm(term.id);

  function toggleFavorite() {
    if (!term) return;
    setFavorited(toggleTermFavorite(term.id));
  }

  function handleFamiliarity(level: ConfidenceLevel) {
    if (!term) return;
    setConfidence(level);
    setTermConfidence(term.id, level);
  }

  function handleSaveNote() {
    if (!term) return;
    saveTermNote(term.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1500);
  }

  return <motion.span
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
    onClick={onClose}
    className="fixed inset-0 z-[65] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
  >
    <motion.span
      initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      onClick={e => e.stopPropagation()}
      className="block max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-black/[0.06] bg-white p-6 text-left shadow-lift dark:border-white/10 dark:bg-[#0d1917] dark:shadow-none sm:p-7"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="eyebrow text-[#0F8B8D]">Medical Term</span>
          <span className="display mt-2 block text-2xl leading-tight text-heading dark:text-white">{term.name}</span>
        </span>
        <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-heading dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white"><X size={16} /></button>
      </span>

      <span className="mt-5 block text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Definition</span>
      <span className="mt-2 block text-sm leading-relaxed text-heading dark:text-white">{term.definition}</span>

      {/* Both optional in practice, even though the Term type requires a
          string—a student's own custom term (components/add-term-modal.tsx)
          saves these empty rather than fabricating filler text, so both
          sections just don't render for one instead of showing an
          awkward blank line under a bold label. */}
      {term.aiExplanation && <span className="mt-4 block rounded-2xl bg-[#f9fcfc] p-4 dark:bg-white/5">
        <span className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700 dark:text-teal-300"><Wand2 size={13} />Simple Explanation</span>
        <span className="mt-1.5 block text-sm leading-relaxed text-slate-600 dark:text-slate-300">{term.aiExplanation}</span>
      </span>}

      {term.clinicalRelevance && <>
        <span className="mt-5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400"><Stethoscope size={13} />Why This Matters Clinically</span>
        <span className="mt-2 block text-sm leading-relaxed text-slate-600 dark:text-slate-300">{term.clinicalRelevance}</span>
      </>}

      <span className="mt-5 block text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Common Conditions</span>
      {conditions.length > 0
        ? <span className="mt-2.5 flex flex-wrap gap-2">
          {conditions.map(c => <span key={c.id} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-heading dark:border-white/10 dark:bg-white/5 dark:text-white">{c.title} <span className="font-medium text-slate-400 dark:text-slate-500">· {c.category}</span></span>)}
        </span>
        : <span className="mt-1.5 block text-xs text-slate-400 dark:text-slate-500">Not yet featured in a Clinical Case.</span>}

      {relatedTerms.length > 0 && <>
        <span className="mt-5 block text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Related concepts</span>
        <span className="mt-2.5 flex flex-wrap gap-2">
          {relatedTerms.map(rt => <button key={rt.id} type="button" onClick={() => setCurrentId(rt.id)} className="cursor-pointer rounded-full bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-700 transition hover:bg-teal-100 dark:bg-teal-500/15 dark:text-teal-300 dark:hover:bg-teal-500/25">{rt.name}</button>)}
        </span>
      </>}

      <span className="mt-5 block border-t border-[#EEF2F7] pt-5 dark:border-white/10">
        <span className="block text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Your familiarity</span>
        <span className="mt-2.5 flex gap-2">
          {familiarityLevels.map(lvl => {
            const active = confidence === lvl.level;
            return <button
              key={lvl.level}
              type="button"
              onClick={() => handleFamiliarity(lvl.level)}
              aria-pressed={active}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-extrabold transition ${active ? lvl.active : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5"}`}
            ><span className={`h-2 w-2 shrink-0 rounded-full ${lvl.dot}`} />{lvl.label}</button>;
          })}
        </span>
      </span>

      <span className="mt-5 block text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</span>
      <span className="mt-2.5 grid grid-cols-2 gap-2">
        <button type="button" onClick={toggleFavorite} aria-pressed={favorited} className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition ${favorited ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300" : "border-slate-200 text-slate-600 hover:border-teal-200 hover:bg-[#f9fcfc] hover:text-heading dark:border-white/10 dark:text-slate-300 dark:hover:border-teal-500/30 dark:hover:bg-white/5 dark:hover:text-white"}`}>
          <Bookmark size={14} className="shrink-0" fill={favorited ? "currentColor" : "none"} />{favorited ? "Saved" : "Save term"}
        </button>
        <button type="button" onClick={() => setDeckPickerOpen(true)} className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-[#f9fcfc] hover:text-heading dark:border-white/10 dark:text-slate-300 dark:hover:border-teal-500/30 dark:hover:bg-white/5 dark:hover:text-white"><Layers size={14} className="shrink-0 text-teal-600 dark:text-teal-300" />Create flashcard</button>
        <button type="button" onClick={() => router.push(`/dashboard/terminology/quiz-me/${term.id}`)} className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-[#f9fcfc] hover:text-heading dark:border-white/10 dark:text-slate-300 dark:hover:border-teal-500/30 dark:hover:bg-white/5 dark:hover:text-white"><HelpCircle size={14} className="shrink-0 text-teal-600 dark:text-teal-300" />Quiz me on this</button>
        <button type="button" onClick={() => setAiOpen(o => !o)} aria-pressed={aiOpen} className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition ${aiOpen ? "border-teal-200 bg-[#f9fcfc] text-heading dark:border-teal-500/30 dark:bg-white/5 dark:text-white" : "border-slate-200 text-slate-600 hover:border-teal-200 hover:bg-[#f9fcfc] hover:text-heading dark:border-white/10 dark:text-slate-300 dark:hover:border-teal-500/30 dark:hover:bg-white/5 dark:hover:text-white"}`}><Bot size={14} className="shrink-0 text-teal-600 dark:text-teal-300" />Ask Studium AI</button>
      </span>

      {deckPickerOpen && typeof document !== "undefined" && createPortal(
        // Rendered via a portal straight to <body>, not nested in this
        // span-only tree—ExpandedTermPanel can be embedded arbitrarily deep
        // inside a lesson <p>, and DeckPicker's own <div> root would be
        // invalid HTML nested in a <p> (same reasoning this file already
        // documents for why the panel itself is span-only).
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={() => setDeckPickerOpen(false)}>
          <div className="w-full max-w-sm" onClick={e => e.stopPropagation()}>
            {addedToDeck
              ? <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 text-center dark:border-teal-500/25 dark:bg-teal-500/10">
                <p className="text-sm font-extrabold text-teal-700 dark:text-teal-300">Added to deck ✓</p>
                <button type="button" onClick={() => setDeckPickerOpen(false)} className="mt-3 cursor-pointer text-xs font-bold text-teal-700 underline dark:text-teal-300">Close</button>
              </div>
              : <DeckPicker
                confirmLabel="Add card"
                onCancel={() => setDeckPickerOpen(false)}
                onConfirm={deckId => { addCardsToDeck(deckId, [`term:${term.id}`]); setAddedToDeck(true); }}
              />}
          </div>
        </div>,
        document.body
      )}

      <span className="mt-2 block">
        {!noteOpen
          ? <button type="button" onClick={() => setNoteOpen(true)} className="flex w-full cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-[#f9fcfc] hover:text-heading dark:border-white/10 dark:text-slate-300 dark:hover:border-teal-500/30 dark:hover:bg-white/5 dark:hover:text-white"><PenLine size={14} className="shrink-0 text-teal-600 dark:text-teal-300" />{noteText ? "Edit Note" : "Create Notes"}</button>
          : <span className="block rounded-xl border border-slate-200 p-3 dark:border-white/10">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} placeholder={`Jot a quick note about ${term.name}...`} className="w-full resize-none text-xs leading-relaxed text-heading outline-none placeholder:text-slate-400 dark:bg-transparent dark:text-white dark:placeholder:text-slate-500" />
            <span className="mt-2 flex items-center gap-2">
              <button type="button" onClick={handleSaveNote} className="flex cursor-pointer items-center gap-1 rounded-full bg-accent-500 px-3.5 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-accent-600">{noteSaved ? <Check size={12} /> : null}{noteSaved ? "Saved" : "Save Note"}</button>
              <button type="button" onClick={() => setNoteOpen(false)} className="cursor-pointer text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">Close</button>
            </span>
          </span>}
      </span>

      {/* Docked Studium AI, scoped to this exact term—portaled straight to
          <body> for the same reason DeckPicker's portal above is: this
          whole panel is span-only so it can be embedded inside a lesson
          <p>, and a fixed-position <aside> wouldn't be valid nested there. */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {aiOpen && <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-[110] h-full w-full max-w-[400px] border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-lift"
          >
            <AiTutorPanel context={liveTutorContext} proactiveTip={null} onDismissTip={() => {}} onCollapse={() => setAiOpen(false)} />
          </motion.aside>}
        </AnimatePresence>,
        document.body
      )}
    </motion.span>
  </motion.span>;
}
