"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Check, Pencil, Sparkles, Trash2, X } from "lucide-react";
import { inputClass } from "@/components/ui";
import { Difficulty, GeneratedFlashcard, sampleDocument, sampleFlashcards, saveFlashcardDeck } from "@/lib/create";
import { consumePendingFlashcards, consumePendingSource, generateFlashcards } from "@/lib/aiGenerate";

const difficultyClasses: Record<Difficulty, string> = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-rose-50 text-rose-700"
};

type LoadState = "loading" | "generating" | "ready" | "error";

export default function CreateFlashcardsPage() {
  // Two real entry points land here: (1) an already-generated card set
  // (e.g. from the curriculum topic-picker at /dashboard/create/build-
  // flashcards) handed off via consumePendingFlashcards, or (2) real
  // source text from the Create page's upload/paste flow, handed off via
  // consumePendingSource—generated here on arrival. Neither present means
  // a direct/bookmarked visit, which falls back to the honest sample walk-
  // through exactly as before.
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [genError, setGenError] = useState<string | null>(null);
  const [cards, setCards] = useState<GeneratedFlashcard[]>([]);
  const [title, setTitle] = useState(`${sampleDocument.fileName.replace(/\.[^.]+$/, "")} — Flashcards`);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<GeneratedFlashcard | null>(null);
  const [saved, setSaved] = useState(false);

  // Guards the one-shot sessionStorage read below against React Strict
  // Mode's dev double-invoke of effects: without this, the first run
  // legitimately consumes (and clears) the pending real cards, then the
  // second run finds nothing left and silently overwrites them with the
  // sample fallback. The ref persists across that double-invoke, so only
  // the first run's result ever lands in state.
  const consumedRef = useRef(false);

  useEffect(() => {
    if (consumedRef.current) return;
    consumedRef.current = true;

    const pendingCards = consumePendingFlashcards();
    if (pendingCards) {
      setCards(pendingCards.cards);
      setTitle(`${pendingCards.sourceLabel} — Flashcards`);
      setLoadState("ready");
      return;
    }

    const pendingSource = consumePendingSource();
    if (pendingSource) {
      if (pendingSource.kind === "text" && pendingSource.fileName) setTitle(`${pendingSource.fileName.replace(/\.[^.]+$/, "")} — Flashcards`);
      setLoadState("generating");
      generateFlashcards(pendingSource, 12, "Mixed").then(result => {
        if ("error" in result) { setGenError(result.error); setLoadState("error"); return; }
        setCards(result.items);
        setLoadState("ready");
      });
      return;
    }

    setCards(sampleFlashcards);
    setLoadState("ready");
  }, []);

  function startEdit(i: number) {
    setEditingIndex(i);
    setDraft(cards[i]);
  }

  function saveEdit(i: number) {
    if (!draft) return;
    setCards(c => c.map((card, idx) => idx === i ? draft : card));
    setEditingIndex(null);
    setDraft(null);
  }

  function deleteCard(i: number) {
    setCards(c => c.filter((_, idx) => idx !== i));
  }

  function handleSaveDeck() {
    saveFlashcardDeck(title.trim() || "Untitled Deck", cards);
    setSaved(true);
  }

  if (loadState === "loading") return null;

  if (loadState === "generating") return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <div className="mt-16 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center shadow-soft">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 text-teal-700"><Sparkles size={22} /></span>
      <p className="text-sm font-extrabold text-heading">Generating flashcards from your notes…</p>
      <p className="max-w-xs text-xs leading-relaxed text-slate-500">A real AI call is reading your text and writing cards. This takes a few seconds.</p>
    </div>
  </section>;

  if (loadState === "error") return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <div className="mt-16 flex flex-col items-center gap-3 rounded-3xl border border-rose-200 bg-rose-50 py-16 text-center">
      <p className="text-sm font-extrabold text-rose-700">Generation failed.</p>
      <p className="max-w-sm text-xs leading-relaxed text-rose-600">{genError}</p>
      <Link href="/dashboard/create" className="mt-2 inline-block cursor-pointer text-sm font-bold text-teal-700 underline">Back to Create</Link>
    </div>
  </section>;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><Brain size={13} />Generate Flashcards</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Created {cards.length} Flashcards.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Edit or remove any card, then save the deck.</p>

    <div className="mt-8 max-w-2xl">
      {saved ? <div className="rounded-3xl border border-teal-100 bg-teal-50 p-6 text-center">
        <p className="text-sm font-extrabold text-teal-700">Deck saved to My Creations ✓</p>
        <Link href="/dashboard/create" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-700 underline">Back to Create</Link>
      </div> : <>
        <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">Deck title</span><input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} /></label>

        <div className="mt-5 space-y-3">
          {cards.map((card, i) => <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
            {editingIndex === i && draft ? <div className="space-y-2.5">
              <textarea value={draft.question} onChange={e => setDraft({ ...draft, question: e.target.value })} rows={2} className={`${inputClass} resize-none`} placeholder="Question" />
              <textarea value={draft.answer} onChange={e => setDraft({ ...draft, answer: e.target.value })} rows={2} className={`${inputClass} resize-none`} placeholder="Answer" />
              <div className="flex items-center gap-2">
                <select value={draft.difficulty} onChange={e => setDraft({ ...draft, difficulty: e.target.value as Difficulty })} className={inputClass}>
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
                <button type="button" onClick={() => saveEdit(i)} className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-teal-500 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-teal-600"><Check size={13} />Done</button>
              </div>
            </div> : <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-heading">{card.question}</p>
                  <p className="mt-1.5 text-sm text-slate-500">{card.answer}</p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold ${difficultyClasses[card.difficulty]}`}>{card.difficulty}</span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => startEdit(i)} aria-label="Edit" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-heading"><Pencil size={14} /></button>
                  <button type="button" onClick={() => deleteCard(i)} aria-label="Delete" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><X size={14} /></button>
                </div>
              </div>
            </>}
          </div>)}
          {cards.length === 0 && <p className="text-sm text-slate-500">No cards left—undo by refreshing, or save an empty deck.</p>}
        </div>

        <button type="button" onClick={handleSaveDeck} disabled={cards.length === 0} className="mt-6 flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60">
          <Sparkles size={16} />Save Deck ({cards.length} cards)
        </button>
      </>}
    </div>
  </section>;
}
