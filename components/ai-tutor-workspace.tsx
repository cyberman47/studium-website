"use client";

// The full-page "Studium AI" workspace (app/dashboard/(main)/ai-tutor) —
// distinct from AiTutorPanel, which stays a compact docked sidebar for the
// 3 in-lesson embed sites. This shares the same underlying data/logic
// (lib/tutorChat.ts, lib/personalFlashcards.ts, lib/savedHighlights.ts, and
// the SavedTab/CardsTab/quickActions/modeIcons/TypingDots pieces exported
// from ai-tutor-panel.tsx) but with its own expansive, chat-app-style
// layout: a slim top bar, a wide breathing-room message feed, and an
// input bar anchored to the bottom of the workspace.
import { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, Layers, Send, Sparkles, Star } from "lucide-react";
import {
  ChatMessage, getChatHistory, getTutorMode, modeLabels, sendMessage, setTutorMode, TUTOR_CHAT_EVENT, TutorContext, TutorMode
} from "@/lib/tutorChat";
import { CardsTab, modeIcons, quickActions, SavedTab, TypingDots } from "./ai-tutor-panel";
import { InteractiveText } from "./interactive-text";

type Tab = "chat" | "saved" | "cards";
const tabDefs: { id: Tab; label: string; icon: typeof Bot }[] = [
  { id: "chat", label: "Chat", icon: Bot },
  { id: "saved", label: "Saved", icon: Star },
  { id: "cards", label: "My Cards", icon: Layers }
];

export function AiTutorWorkspace({ context, externalPrompt, onExternalPromptHandled }: {
  context: TutorContext;
  // The Studium AI SectionTour's "Try it →" step sets this on the same page
  // (app/dashboard/(main)/ai-tutor/page.tsx)—no navigation involved, so a
  // real reply appears immediately instead of waiting on a page transition.
  externalPrompt?: string | null;
  onExternalPromptHandled?: () => void;
}) {
  const [mode, setMode] = useState<TutorMode>("tutor");
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<Tab>("chat");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMode(getTutorMode());
    setMessages(getChatHistory(context.lessonId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.lessonId]);

  useEffect(() => {
    function refresh() { setMessages(getChatHistory(context.lessonId)); }
    window.addEventListener(TUTOR_CHAT_EVENT, refresh);
    return () => window.removeEventListener(TUTOR_CHAT_EVENT, refresh);
  }, [context.lessonId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, tab]);

  const isStreaming = messages.some(m => m.streaming);

  function handleModeChange(m: TutorMode) {
    setMode(m);
    setTutorMode(m);
    setModeMenuOpen(false);
  }

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    const next = sendMessage(context.lessonId, trimmed, mode, context);
    setMessages(next);
    setInput("");
  }

  useEffect(() => {
    if (!externalPrompt) return;
    handleSend(externalPrompt);
    onExternalPromptHandled?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt]);

  const ModeIcon = modeIcons[mode];

  return <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-[#0d1917]">
    {/* Slim top bar — title, tab switcher, mode dropdown. No headline, no
        intro copy: everything a returning student needs is one glance. */}
    <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 dark:border-white/10 px-5 py-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><Bot size={16} /></span>
      <p className="shrink-0 text-sm font-extrabold text-heading">Studium AI</p>
      <span className="hidden truncate text-xs text-slate-400 sm:block">{context.subjectName} · {context.lessonTitle}</span>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {/* Chat / Saved / My Cards — compact segmented control */}
        <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-0.5">
          {tabDefs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return <button
              key={t.id} type="button" onClick={() => setTab(t.id)} title={t.label}
              className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition ${active ? "bg-white dark:bg-[#0d1917] text-teal-700 shadow-soft" : "text-slate-500 hover:text-heading"}`}
            ><Icon size={13} className={active ? "text-teal-600" : "text-slate-400"} /><span className="hidden md:inline">{t.label}</span></button>;
          })}
        </div>

        {/* Mode — compact dropdown */}
        <div className="relative">
          <button
            type="button" onClick={() => setModeMenuOpen(o => !o)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-2.5 py-1.5 text-xs font-bold text-heading transition hover:border-teal-200"
          ><ModeIcon size={13} className="text-teal-600" /><span className="hidden md:inline">{modeLabels[mode]}</span><ChevronDown size={12} className="text-slate-400" /></button>
          {modeMenuOpen && <>
            <button type="button" aria-label="Close mode menu" onClick={() => setModeMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />
            <div className="absolute right-0 z-20 mt-1.5 w-40 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-1 shadow-lg">
              {(Object.keys(modeLabels) as TutorMode[]).map(m => {
                const Icon = modeIcons[m];
                const active = mode === m;
                return <button
                  key={m} type="button" onClick={() => handleModeChange(m)}
                  className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs font-bold transition ${active ? "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "text-slate-600 hover:bg-[#f9fcfc] dark:bg-white/5"}`}
                ><Icon size={13} className={active ? "text-teal-600" : "text-slate-400"} />{modeLabels[m]}</button>;
              })}
            </div>
          </>}
        </div>
      </div>
    </div>

    {tab === "chat" && <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-8 sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.length === 0 && <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><Sparkles size={22} /></span>
            <div>
              <p className="text-base font-extrabold text-heading">Ask anything about {context.lessonTitle.toLowerCase()}.</p>
              <p className="mt-1 text-sm text-slate-400">Pick a mode above, then start typing—or try a prompt below.</p>
            </div>
            <div className="flex max-w-xl flex-wrap justify-center gap-2">
              {quickActions.map(qa => <button key={qa.label} type="button" onClick={() => handleSend(qa.build(context))} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-3.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 hover:text-teal-700">{qa.label}</button>)}
            </div>
          </div>}

          {messages.map(m => {
            if (m.role === "user") {
              return <div key={m.id} className="ml-auto max-w-[75%] whitespace-pre-wrap rounded-2xl bg-teal-600 px-4 py-3 text-sm leading-relaxed text-white">{m.text}</div>;
            }
            const bubbleClass = m.error
              ? "border border-rose-200 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 text-rose-700"
              : "border border-slate-100 dark:border-white/10 bg-[#fcfdfd] dark:bg-[#0d1917] text-slate-600 dark:text-slate-200 shadow-soft";
            return <div key={m.id} className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${bubbleClass}`}>
              {m.streaming && !m.text ? <TypingDots /> : <InteractiveText text={m.text} />}
              {m.streaming && m.text && <span className="ml-0.5 inline-block h-3.5 w-1 translate-y-0.5 animate-pulse bg-teal-400 align-middle" />}
            </div>;
          })}
        </div>
      </div>

      {/* Input bar — anchored to the bottom of the workspace */}
      <div data-tour="ai-composer" className="shrink-0 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] px-5 py-4 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={e => { e.preventDefault(); handleSend(input); }} className="flex items-end gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-2 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] transition focus-within:border-teal-300">
            <input
              value={input} onChange={e => setInput(e.target.value)} disabled={isStreaming}
              placeholder={isStreaming ? "Studium AI is replying..." : "Message Studium AI..."}
              className="w-full bg-transparent px-2.5 py-2 text-sm text-heading outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
            <button type="submit" disabled={!input.trim() || isStreaming} className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl bg-accent-500 text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"><Send size={15} /></button>
          </form>
          <div className="mt-2 flex items-center justify-between gap-3 px-1">
            <p className="truncate text-[11px] text-slate-400">Context: {context.subjectName} · {context.lessonTitle}</p>
            <p className="shrink-0 text-[11px] text-slate-400">Studium AI can make mistakes. Please check important info.</p>
          </div>
        </div>
      </div>
    </>}

    {tab === "saved" && <SavedTab />}
    {tab === "cards" && <CardsTab />}
  </div>;
}
