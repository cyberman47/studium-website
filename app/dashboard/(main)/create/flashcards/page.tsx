"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Check, Pencil, Sparkles, Trash2, X } from "lucide-react";
import { inputClass } from "@/components/ui";
import { Difficulty, GeneratedFlashcard, sampleDocument, sampleFlashcards, saveFlashcardDeck } from "@/lib/create";

const difficultyClasses: Record<Difficulty, string> = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-rose-50 text-rose-700"
};

export default function CreateFlashcardsPage() {
  const [cards, setCards] = useState<GeneratedFlashcard[]>(sampleFlashcards);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<GeneratedFlashcard | null>(null);
  const [title, setTitle] = useState(`${sampleDocument.fileName.replace(/\.[^.]+$/, "")} — Flashcards`);
  const [saved, setSaved] = useState(false);

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

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><Brain size={13} />Generate Flashcards</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Created {cards.length} Flashcards.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Sample flashcards generated from {sampleDocument.fileName}. Edit or remove any card, then save the deck.</p>

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
                  <p className="text-sm font-bold text-ink">{card.question}</p>
                  <p className="mt-1.5 text-sm text-slate-500">{card.answer}</p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold ${difficultyClasses[card.difficulty]}`}>{card.difficulty}</span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => startEdit(i)} aria-label="Edit" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-ink"><Pencil size={14} /></button>
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
