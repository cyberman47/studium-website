"use client";

import { useEffect, useState } from "react";
import { Check, FolderPlus, Layers } from "lucide-react";
import { createDeck, getDecks, STUDY_DECKS_EVENT, StudyDeck } from "@/lib/flashcardDecks";

// Reusable "choose an existing Study Deck, or create a new one" control.
// Used by the Flashcard Library's multi-select "Add to deck" action and by
// the lesson highlight "Create Flashcard" editor—one component, two callers,
// per the plan to not build a second deck UI.
export function DeckPicker({ onConfirm, onCancel, confirmLabel = "Add", startCreating = false }: {
  onConfirm: (deckId: string) => void;
  onCancel: () => void;
  confirmLabel?: string;
  /** Opens straight into "name a new deck" instead of the pick-existing list—for callers like a "New deck" button where creating is the whole point, not a fallback. */
  startCreating?: boolean;
}) {
  const [decks, setDecks] = useState<StudyDeck[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(startCreating);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    function refresh() { setDecks(getDecks()); }
    refresh();
    window.addEventListener(STUDY_DECKS_EVENT, refresh);
    return () => window.removeEventListener(STUDY_DECKS_EVENT, refresh);
  }, []);

  function handleConfirm() {
    if (creating) {
      const name = newName.trim();
      if (!name) return;
      const deck = createDeck(name);
      onConfirm(deck.id);
      return;
    }
    if (selectedId) onConfirm(selectedId);
  }

  return <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-lift">
    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Add to deck</p>

    {!creating && <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto pr-1">
      {decks.length === 0 && <p className="py-3 text-center text-xs text-slate-400">No decks yet—create your first one.</p>}
      {decks.map(d => <button
        key={d.id}
        type="button"
        onClick={() => setSelectedId(d.id)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-bold transition ${selectedId === d.id ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-100 dark:border-white/10 text-heading hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"}`}
      >
        <span className="flex items-center gap-2 truncate"><Layers size={14} className="shrink-0 text-slate-400" />{d.name}</span>
        <span className="flex shrink-0 items-center gap-2 text-xs font-bold text-slate-400">{d.cardIds.length} cards{selectedId === d.id && <Check size={14} className="text-teal-600" />}</span>
      </button>)}
    </div>}

    {creating
      ? <input
        autoFocus
        value={newName}
        onChange={e => setNewName(e.target.value)}
        placeholder="Deck name, e.g. Biochemistry Midterm"
        className="mt-3 w-full rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm font-semibold text-heading outline-none focus:border-teal-400"
      />
      : <button type="button" onClick={() => setCreating(true)} className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-teal-600 hover:bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300"><FolderPlus size={15} />New deck</button>}

    <div className="mt-4 flex justify-end gap-2">
      <button type="button" onClick={onCancel} className="cursor-pointer rounded-full px-4 py-2 text-xs font-bold text-slate-500 hover:text-heading">Cancel</button>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={creating ? !newName.trim() : !selectedId}
        className="cursor-pointer rounded-full bg-accent-500 px-5 py-2 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
      >{creating ? "Create & add" : confirmLabel}</button>
    </div>
  </div>;
}
