"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark, Bot, ChevronsRight, Eye, EyeOff, Flag, GraduationCap, Layers, Lightbulb, Microscope, Send, Sparkles,
  Star, Trash2, Wand2, X
} from "lucide-react";
import {
  ChatMessage, getChatHistory, getTutorMode, modeLabels, sendMessage, setTutorMode, TUTOR_CHAT_EVENT, TutorContext, TutorMode
} from "@/lib/tutorChat";
import { InteractiveText } from "./interactive-text";
import { getPersonalFlashcards, PersonalFlashcard, PERSONAL_FLASHCARDS_EVENT, removePersonalFlashcard } from "@/lib/personalFlashcards";
import { getSavedHighlights, removeSavedHighlight, SavedHighlight, SAVED_HIGHLIGHTS_EVENT } from "@/lib/savedHighlights";
import { getSavedQuestionIds, SAVED_QUESTIONS_EVENT, toggleSavedQuestion } from "@/lib/practiceHistory";
import { getAllMcatPracticeQuestions, SectionPracticeQuestion } from "@/lib/mcatConcepts";
import { BOOKMARKED_CARDS_EVENT, getAllBookmarkedCards, getLessonContent, toggleBookmarkedCard } from "@/lib/mcatPath";

// actionLabel/actionPrompt are optional so every existing caller
// (practice-quiz.tsx, flashcard-focus-mode.tsx pass proactiveTip={null} and
// never touch this) keeps compiling untouched; the lesson page sets both
// per trigger so the button's label and what it actually asks match the
// tip's own content (e.g. "Get a hint" defaults to a real hint prompt,
// while a takeaway tip asks about that takeaway specifically).
export type ProactiveTip = { icon: string; text: string; sourceLabel: string; actionLabel?: string; actionPrompt?: string } | null;

export const modeIcons: Record<TutorMode, typeof GraduationCap> = { tutor: GraduationCap, deepdive: Microscope, simplify: Lightbulb };

// General-purpose study utilities—useful for any subject, not locked to one
// exam or curriculum.
export const quickActions: { label: string; build: (ctx: TutorContext) => string }[] = [
  { label: "💡 Give me a hint", build: () => "Give me a hint, don't tell me the answer yet." },
  { label: "⚡ Explain simply", build: ctx => `Explain ${ctx.currentFlashcard?.front ?? ctx.lessonTitle} in the simplest way possible.` },
  { label: "📝 Give me an example", build: ctx => `Give me a real-world example of ${ctx.currentFlashcard?.front ?? ctx.lessonTitle}.` },
  { label: "🎯 Test my knowledge", build: ctx => `Test my knowledge of ${ctx.currentFlashcard?.front ?? ctx.lessonTitle} with a quick question.` }
];

type Tab = "chat" | "saved" | "cards";

export function AiTutorPanel({ context, proactiveTip, onDismissTip, onCollapse }: { context: TutorContext; proactiveTip: ProactiveTip; onDismissTip: () => void; onCollapse?: () => void }) {
  const [mode, setMode] = useState<TutorMode>("tutor");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<Tab>("chat");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMode(getTutorMode());
    setMessages(getChatHistory(context.lessonId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.lessonId]);

  // Refresh when a message is sent from elsewhere (e.g. the highlight
  // popup's "Explain"/"Ask AI" actions in the lesson content), not just
  // from this panel's own input—same chat, same real history.
  useEffect(() => {
    function refresh() { setMessages(getChatHistory(context.lessonId)); }
    window.addEventListener(TUTOR_CHAT_EVENT, refresh);
    return () => window.removeEventListener(TUTOR_CHAT_EVENT, refresh);
  }, [context.lessonId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, tab]);

  function handleModeChange(m: TutorMode) {
    setMode(m);
    setTutorMode(m);
  }

  const isStreaming = messages.some(m => m.streaming);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    const next = sendMessage(context.lessonId, trimmed, mode, context);
    setMessages(next);
    setInput("");
  }

  // The tip's own action re-uses the same "hint" prompt regardless of which
  // trigger fired it—simple and consistent, and it's what the copy in every
  // current trigger (takeaway/connection/miss-streak) is steering toward
  // anyway. onDismissTip immediately after so it doesn't linger once acted on.
  function handleTipAction() {
    if (proactiveTip) handleSend(proactiveTip.actionPrompt ?? quickActions[0].build(context));
    onDismissTip();
  }

  return <div className="flex h-full flex-col bg-white dark:bg-[#0d1917]">
    {/* Header: identity + a couple of compact icon actions—Saved/My Cards
        moved out of a full-width tab row so this stays short and the mode
        switcher below it is the first thing that reads as "primary." */}
    <div className="border-b border-slate-100 dark:border-white/10 p-4">
      <div className="flex items-center gap-2.5">
        <button type="button" onClick={() => setTab("chat")} className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><Bot size={18} /></span>
          <span className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-heading">Studium AI</p>
            <p className="truncate text-[11px] text-slate-400">{context.subjectName} · {context.lessonTitle}</p>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" title="Saved" onClick={() => setTab(t => t === "saved" ? "chat" : "saved")} className={`grid h-7 w-7 cursor-pointer place-items-center rounded-lg transition ${tab === "saved" ? "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600" : "text-slate-400 hover:bg-slate-100 dark:bg-white/10 hover:text-heading"}`}><Star size={14} /></button>
          <button type="button" title="My Cards" onClick={() => setTab(t => t === "cards" ? "chat" : "cards")} className={`grid h-7 w-7 cursor-pointer place-items-center rounded-lg transition ${tab === "cards" ? "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600" : "text-slate-400 hover:bg-slate-100 dark:bg-white/10 hover:text-heading"}`}><Layers size={14} /></button>
          {onCollapse && <button type="button" onClick={onCollapse} title="Collapse panel" className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><ChevronsRight size={15} /></button>}
        </div>
      </div>

      {/* Mode switcher — clean full-width segmented control, the sidebar's
          primary control now that the header above it is minimal. Module/
          step/card/recent-misses context still flows to the model via
          `context` on every send below—just no longer rendered as UI clutter. */}
      <div className="mt-3 flex rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-1">
        {(Object.keys(modeLabels) as TutorMode[]).map(m => {
          const Icon = modeIcons[m];
          const active = mode === m;
          return <button
            key={m} type="button" onClick={() => handleModeChange(m)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold transition ${active ? "bg-white dark:bg-[#0d1917] text-teal-700 shadow-soft" : "text-slate-500 hover:text-heading"}`}
          ><Icon size={12} className={active ? "text-teal-600" : "text-slate-400"} />{modeLabels[m]}</button>;
        })}
      </div>
    </div>

    {tab === "chat" && <>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#fcfdfd] dark:bg-[#070d0c] p-4">
        {messages.length === 0 && <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Sparkles size={20} className="text-slate-300" />
          <p className="text-xs leading-relaxed text-slate-400">Ask anything about {context.lessonTitle.toLowerCase()}, or use a quick action below.</p>
        </div>}
        {messages.map(m => {
          if (m.role === "user") {
            return <div key={m.id} className="ml-auto max-w-[90%] whitespace-pre-wrap rounded-2xl bg-teal-600 px-3.5 py-2.5 text-xs leading-relaxed text-white">{m.text}</div>;
          }
          const bubbleClass = m.error
            ? "border border-rose-200 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 text-rose-700"
            : "border border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-200";
          return <div key={m.id} className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${bubbleClass}`}>
            {m.streaming && !m.text ? <TypingDots /> : <InteractiveText text={m.text} />}
            {m.streaming && m.text && <span className="ml-0.5 inline-block h-3 w-1 translate-y-0.5 animate-pulse bg-teal-400 align-middle" />}
          </div>;
        })}
      </div>

      {/* Composer: an inline proactive-tip callout (replaces the old
          persistent top banner), quick-action chips, and the input all live
          in this one bottom-anchored block. */}
      <div className="border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-3">
        <AnimatePresence>
          {proactiveTip && <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-2 flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-500/25 bg-amber-50 dark:bg-amber-500/10 px-3 py-2.5">
              <span className="mt-0.5 shrink-0 text-xs leading-none">{proactiveTip.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">{proactiveTip.text}</p>
                <p className="mt-0.5 text-[10px] font-bold text-amber-600/70 dark:text-amber-400/60">{proactiveTip.sourceLabel}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" disabled={isStreaming} onClick={handleTipAction} className="cursor-pointer whitespace-nowrap rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40">{proactiveTip.actionLabel ?? "Ask about this"}</button>
                <button type="button" onClick={onDismissTip} className="cursor-pointer p-0.5 text-amber-500/70 hover:text-amber-700" aria-label="Dismiss"><X size={12} /></button>
              </div>
            </div>
          </motion.div>}
        </AnimatePresence>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-2.5 shadow-soft">
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickActions.map(qa => <button key={qa.label} type="button" disabled={isStreaming} onClick={() => handleSend(qa.build(context))} className="shrink-0 cursor-pointer whitespace-nowrap rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-600 transition hover:bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40">{qa.label}</button>)}
          </div>
          <form onSubmit={e => { e.preventDefault(); handleSend(input); }} className="mt-2 flex items-center gap-2 border-t border-slate-100 dark:border-white/10 pt-2">
            <input value={input} onChange={e => setInput(e.target.value)} disabled={isStreaming} placeholder={isStreaming ? "Studium AI is replying..." : "Ask your tutor..."} className="w-full bg-transparent px-1 text-xs text-heading outline-none placeholder:text-slate-400 disabled:cursor-not-allowed" />
            <button type="submit" disabled={!input.trim() || isStreaming} className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg bg-accent-500 text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"><Send size={14} /></button>
          </form>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400">Studium AI can make mistakes. Please check important info.</p>
      </div>
    </>}

    {tab === "saved" && <SavedTab />}
    {tab === "cards" && <CardsTab />}
  </div>;
}

export function TypingDots() {
  return <span className="inline-flex items-center gap-1 py-0.5">
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
  </span>;
}

export function SavedTab() {
  const [items, setItems] = useState<SavedHighlight[]>([]);
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>([]);
  const [bookmarkedCards, setBookmarkedCards] = useState<{ lessonId: string; cardIndex: number }[]>([]);
  const allQuestions = useMemo(() => getAllMcatPracticeQuestions(), []);

  function refresh() {
    setItems(getSavedHighlights());
    setSavedQuestionIds(getSavedQuestionIds());
    setBookmarkedCards(getAllBookmarkedCards());
  }
  useEffect(() => {
    refresh();
    window.addEventListener(SAVED_HIGHLIGHTS_EVENT, refresh);
    window.addEventListener(SAVED_QUESTIONS_EVENT, refresh);
    window.addEventListener(BOOKMARKED_CARDS_EVENT, refresh);
    return () => {
      window.removeEventListener(SAVED_HIGHLIGHTS_EVENT, refresh);
      window.removeEventListener(SAVED_QUESTIONS_EVENT, refresh);
      window.removeEventListener(BOOKMARKED_CARDS_EVENT, refresh);
    };
  }, []);

  const savedQuestions: SectionPracticeQuestion[] = savedQuestionIds
    .map(id => allQuestions.find(q => q.id === id))
    .filter((q): q is SectionPracticeQuestion => !!q);

  const resolvedBookmarks = bookmarkedCards
    .map(b => {
      const front = getLessonContent(b.lessonId)?.flashcards[b.cardIndex]?.front;
      return front ? { ...b, front } : null;
    })
    .filter((b): b is { lessonId: string; cardIndex: number; front: string } => !!b);

  return <div className="flex-1 space-y-4 overflow-y-auto bg-[#fcfdfd] dark:bg-[#070d0c] p-3">
    <div className="space-y-2">
      {items.map(h => <div key={h.id} className="rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-3 shadow-soft">
        <div className="flex items-start justify-between gap-2">
          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-600"><Star size={12} className="mt-0.5 shrink-0 text-amber-400" fill="currentColor" />{h.text}</p>
          <button type="button" onClick={() => removeSavedHighlight(h.id)} className="shrink-0 cursor-pointer text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
        </div>
        <p className="mt-1.5 pl-4 text-[10px] font-bold text-slate-400">{h.sourceLessonTitle}</p>
      </div>)}
      {items.length === 0 && <p className="py-8 text-center text-xs leading-relaxed text-slate-400">Highlight text in the lesson and tap ⭐ Save to collect it here.</p>}
    </div>

    {savedQuestions.length > 0 && <div>
      <p className="px-1 pb-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Flagged Questions</p>
      <div className="space-y-2">
        {savedQuestions.map(q => <div key={q.id} className="rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-3 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <p className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-600"><Flag size={12} className="mt-0.5 shrink-0 text-rose-400" fill="currentColor" />{q.question.question}</p>
            <button type="button" onClick={() => toggleSavedQuestion(q.id)} className="shrink-0 cursor-pointer text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
          </div>
          <p className="mt-1.5 pl-4 text-[10px] font-bold text-slate-400">{q.lessonTitle}</p>
        </div>)}
      </div>
    </div>}

    {resolvedBookmarks.length > 0 && <div>
      <p className="px-1 pb-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Bookmarked Flashcards</p>
      <div className="space-y-2">
        {resolvedBookmarks.map(b => <div key={`${b.lessonId}:${b.cardIndex}`} className="rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-3 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <p className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-600"><Bookmark size={12} className="mt-0.5 shrink-0 text-teal-500" fill="currentColor" />{b.front}</p>
            <button type="button" onClick={() => toggleBookmarkedCard(b.lessonId, b.cardIndex)} className="shrink-0 cursor-pointer text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
          </div>
        </div>)}
      </div>
    </div>}
  </div>;
}

export function CardsTab() {
  const [cards, setCards] = useState<PersonalFlashcard[]>([]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  function refresh() { setCards(getPersonalFlashcards()); }
  useEffect(() => {
    refresh();
    window.addEventListener(PERSONAL_FLASHCARDS_EVENT, refresh);
    return () => window.removeEventListener(PERSONAL_FLASHCARDS_EVENT, refresh);
  }, []);

  function toggle(id: string) {
    setRevealed(s => { const next = new Set(s); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  return <div className="flex-1 space-y-2 overflow-y-auto bg-[#fcfdfd] dark:bg-[#070d0c] p-3">
    {cards.map(c => <div key={c.id} className="rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-3 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-start gap-1.5 text-xs font-bold leading-relaxed text-heading"><Wand2 size={12} className="mt-0.5 shrink-0 text-teal-600" />{c.front}</p>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={() => toggle(c.id)} className="cursor-pointer text-slate-400 hover:text-teal-600">{revealed.has(c.id) ? <EyeOff size={12} /> : <Eye size={12} />}</button>
          <button type="button" onClick={() => removePersonalFlashcard(c.id)} className="cursor-pointer text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
        </div>
      </div>
      {revealed.has(c.id) && <p className="mt-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 p-2 pl-4 text-[11px] leading-relaxed text-teal-800">{c.back || "(no answer written yet—edit this card to add one)"}</p>}
      <p className="mt-1.5 pl-4 text-[10px] font-bold text-slate-400">{c.sourceLessonTitle}</p>
    </div>)}
    {cards.length === 0 && <p className="flex flex-col items-center gap-2 py-8 text-center text-xs leading-relaxed text-slate-400"><Bookmark size={16} className="text-slate-300" />Highlight text and tap 📝 Create Flashcard to build your personal deck.</p>}
  </div>;
}
