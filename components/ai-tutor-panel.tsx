"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark, Bot, ChevronsRight, Compass, Eye, EyeOff, GraduationCap, Lightbulb, Send, Sparkles,
  Star, Trash2, Wand2, X
} from "lucide-react";
import {
  ChatMessage, getChatHistory, getTutorMode, modeLabels, sendMessage, setTutorMode, TUTOR_CHAT_EVENT, TutorContext, TutorMode
} from "@/lib/tutorChat";
import { InteractiveText } from "./interactive-text";
import { getPersonalFlashcards, PersonalFlashcard, PERSONAL_FLASHCARDS_EVENT, removePersonalFlashcard } from "@/lib/personalFlashcards";
import { getSavedHighlights, removeSavedHighlight, SavedHighlight, SAVED_HIGHLIGHTS_EVENT } from "@/lib/savedHighlights";

export type ProactiveTip = { icon: string; text: string; sourceLabel: string } | null;

export const modeIcons: Record<TutorMode, typeof GraduationCap> = { tutor: GraduationCap, socratic: Compass, simplify: Lightbulb };

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

  return <div className="flex h-full flex-col bg-white">
    <div className="border-b border-slate-100 p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600"><Bot size={18} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-ink">Studium AI</p>
          <p className="truncate text-[11px] text-slate-400">{context.subjectName} · {context.lessonTitle}</p>
        </div>
        {onCollapse && <button type="button" onClick={onCollapse} title="Collapse panel" className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-ink"><ChevronsRight size={15} /></button>}
      </div>

      {/* Mode switcher — horizontal segmented control */}
      <div className="mt-3 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
        {(Object.keys(modeLabels) as TutorMode[]).map(m => {
          const Icon = modeIcons[m];
          const active = mode === m;
          return <button
            key={m} type="button" onClick={() => handleModeChange(m)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold transition ${active ? "bg-white text-teal-700 shadow-soft" : "text-slate-500 hover:text-ink"}`}
          ><Icon size={12} className={active ? "text-teal-600" : "text-slate-400"} />{modeLabels[m]}</button>;
        })}
      </div>

      <div className="mt-3 space-y-1 rounded-lg border border-slate-100 bg-[#f9fcfc] px-3 py-2 text-[11px] text-slate-500">
        <p><span className="font-bold text-slate-400">Module:</span> {context.lessonTitle}</p>
        <p><span className="font-bold text-slate-400">Step:</span> {context.currentStep}</p>
        {context.currentFlashcard && <p className="truncate"><span className="font-bold text-slate-400">Card:</span> "{context.currentFlashcard.front}"</p>}
        {context.recentMistakes.length > 0 && <p className="truncate"><span className="font-bold text-slate-400">Recent misses:</span> {context.recentMistakes.join(", ")}</p>}
      </div>
    </div>

    <AnimatePresence>
      {proactiveTip && <motion.div
        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden border-b border-slate-100"
      >
        <div className="flex items-start gap-2 bg-amber-50 p-3">
          <span className="shrink-0">{proactiveTip.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs leading-relaxed text-amber-900">{proactiveTip.text}</p>
            <p className="mt-0.5 text-[10px] font-bold text-amber-600/70">{proactiveTip.sourceLabel}</p>
          </div>
          <button type="button" onClick={onDismissTip} className="shrink-0 cursor-pointer text-amber-500/70 hover:text-amber-700"><X size={13} /></button>
        </div>
      </motion.div>}
    </AnimatePresence>

    <div className="flex border-b border-slate-100 text-xs font-bold">
      <button type="button" onClick={() => setTab("chat")} className={`flex-1 cursor-pointer py-2.5 transition ${tab === "chat" ? "border-b-2 border-teal-600 text-teal-700" : "text-slate-400 hover:text-ink"}`}>Chat</button>
      <button type="button" onClick={() => setTab("saved")} className={`flex-1 cursor-pointer py-2.5 transition ${tab === "saved" ? "border-b-2 border-teal-600 text-teal-700" : "text-slate-400 hover:text-ink"}`}>Saved</button>
      <button type="button" onClick={() => setTab("cards")} className={`flex-1 cursor-pointer py-2.5 transition ${tab === "cards" ? "border-b-2 border-teal-600 text-teal-700" : "text-slate-400 hover:text-ink"}`}>My Cards</button>
    </div>

    {tab === "chat" && <>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#fcfdfd] p-4">
        {messages.length === 0 && <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Sparkles size={20} className="text-slate-300" />
          <p className="text-xs leading-relaxed text-slate-400">Ask anything about {context.lessonTitle.toLowerCase()}, or use a quick action below.</p>
        </div>}
        {messages.map(m => {
          if (m.role === "user") {
            return <div key={m.id} className="ml-auto max-w-[90%] whitespace-pre-wrap rounded-2xl bg-teal-600 px-3.5 py-2.5 text-xs leading-relaxed text-white">{m.text}</div>;
          }
          const bubbleClass = m.error
            ? "border border-rose-200 bg-rose-50 text-rose-700"
            : "border border-slate-100 bg-white text-slate-600 shadow-soft";
          return <div key={m.id} className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${bubbleClass}`}>
            {m.streaming && !m.text ? <TypingDots /> : <InteractiveText text={m.text} />}
            {m.streaming && m.text && <span className="ml-0.5 inline-block h-3 w-1 translate-y-0.5 animate-pulse bg-teal-400 align-middle" />}
          </div>;
        })}
      </div>

      {/* Composer: quick-action chips and input live inside one shared card */}
      <div className="border-t border-slate-100 bg-white p-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-soft">
          <div className="flex flex-wrap gap-1.5">
            {quickActions.map(qa => <button key={qa.label} type="button" disabled={isStreaming} onClick={() => handleSend(qa.build(context))} className="cursor-pointer rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 transition hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40">{qa.label}</button>)}
          </div>
          <form onSubmit={e => { e.preventDefault(); handleSend(input); }} className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-2">
            <input value={input} onChange={e => setInput(e.target.value)} disabled={isStreaming} placeholder={isStreaming ? "Studium AI is replying..." : "Ask your tutor..."} className="w-full bg-transparent px-1 text-xs text-ink outline-none placeholder:text-slate-400 disabled:cursor-not-allowed" />
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
  function refresh() { setItems(getSavedHighlights()); }
  useEffect(() => {
    refresh();
    window.addEventListener(SAVED_HIGHLIGHTS_EVENT, refresh);
    return () => window.removeEventListener(SAVED_HIGHLIGHTS_EVENT, refresh);
  }, []);

  return <div className="flex-1 space-y-2 overflow-y-auto bg-[#fcfdfd] p-3">
    {items.map(h => <div key={h.id} className="rounded-xl border border-slate-100 bg-white p-3 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-600"><Star size={12} className="mt-0.5 shrink-0 text-amber-400" fill="currentColor" />{h.text}</p>
        <button type="button" onClick={() => removeSavedHighlight(h.id)} className="shrink-0 cursor-pointer text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
      </div>
      <p className="mt-1.5 pl-4 text-[10px] font-bold text-slate-400">{h.sourceLessonTitle}</p>
    </div>)}
    {items.length === 0 && <p className="py-8 text-center text-xs leading-relaxed text-slate-400">Highlight text in the lesson and tap ⭐ Save to collect it here.</p>}
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

  return <div className="flex-1 space-y-2 overflow-y-auto bg-[#fcfdfd] p-3">
    {cards.map(c => <div key={c.id} className="rounded-xl border border-slate-100 bg-white p-3 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-start gap-1.5 text-xs font-bold leading-relaxed text-ink"><Wand2 size={12} className="mt-0.5 shrink-0 text-teal-600" />{c.front}</p>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={() => toggle(c.id)} className="cursor-pointer text-slate-400 hover:text-teal-600">{revealed.has(c.id) ? <EyeOff size={12} /> : <Eye size={12} />}</button>
          <button type="button" onClick={() => removePersonalFlashcard(c.id)} className="cursor-pointer text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
        </div>
      </div>
      {revealed.has(c.id) && <p className="mt-1.5 rounded-lg bg-teal-50 p-2 pl-4 text-[11px] leading-relaxed text-teal-800">{c.back || "(no answer written yet—edit this card to add one)"}</p>}
      <p className="mt-1.5 pl-4 text-[10px] font-bold text-slate-400">{c.sourceLessonTitle}</p>
    </div>)}
    {cards.length === 0 && <p className="flex flex-col items-center gap-2 py-8 text-center text-xs leading-relaxed text-slate-400"><Bookmark size={16} className="text-slate-300" />Highlight text and tap 📝 Create Flashcard to build your personal deck.</p>}
  </div>;
}
