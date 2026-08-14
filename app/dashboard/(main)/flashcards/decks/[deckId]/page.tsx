"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive, ArrowLeft, BookA, Check, Copy, Layers, Pencil, Plus, RotateCcw, Sparkles, Star, Trash2, X
} from "lucide-react";
import { SmartReviewSession } from "@/components/smart-review-session";
import {
  CardSource, getCardDisplayStatus, getLibraryCardsByIds, LibraryCard, sortLabels, SortOption, sortLibraryCards,
  CARD_PROGRESS_EVENT
} from "@/lib/flashcardLibrary";
import { CardDisplayStatus } from "@/lib/spacedRepetitionCore";
import {
  archiveDeck, deleteDeck, duplicateDeck, getDeck, getDeckStats, mergeDecks, getDecks, removeCardFromDeck,
  renameDeck, unarchiveDeck, STUDY_DECKS_EVENT, StudyDeck
} from "@/lib/flashcardDecks";
import { PERSONAL_FLASHCARDS_EVENT } from "@/lib/personalFlashcards";
import { TERM_PROGRESS_EVENT } from "@/lib/terminology";

const sourceIcons: Record<CardSource, typeof BookA> = { terminology: BookA, lesson: Layers, personal: Star };

// Same real color language as the Flashcards homepage—one card's status
// means the same thing everywhere in the app.
const statusStyles: Record<CardDisplayStatus, { label: string; dot: string; border: string; bg: string; text: string }> = {
  new: { label: "New", dot: "bg-sky-500", border: "border-sky-200", bg: "bg-sky-50 dark:bg-sky-500/15 dark:text-sky-300 dark:bg-sky-500/15 dark:text-sky-300", text: "text-sky-700" },
  learning: { label: "Learning", dot: "bg-amber-500", border: "border-amber-200", bg: "bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300", text: "text-amber-700" },
  mastered: { label: "Mastered", dot: "bg-teal-500", border: "border-teal-200", bg: "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300", text: "text-teal-700" },
  due: { label: "Due", dot: "bg-orange-500", border: "border-orange-200", bg: "bg-orange-50 dark:bg-orange-500/15 dark:text-orange-300", text: "text-orange-700" }
};

const statusOrder: CardDisplayStatus[] = ["due", "learning", "new", "mastered"];
const sortOptions: SortOption[] = ["dueFirst", "recentlyStudied", "recentlyCreated", "leastMastered", "mostMastered", "alphabetical", "subject"];

type DeckFilter = "all" | CardDisplayStatus;

export default function DeckDetailPage({ params }: { params: { deckId: string } }) {
  const router = useRouter();
  const [deck, setDeck] = useState<StudyDeck | null | undefined>(undefined);
  const [otherDecks, setOtherDecks] = useState<StudyDeck[]>([]);
  const [filter, setFilter] = useState<DeckFilter>("all");
  const [sort, setSort] = useState<SortOption>("dueFirst");
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [merging, setMerging] = useState(false);
  const [mergeSelection, setMergeSelection] = useState<Set<string>>(new Set());
  const [studyQueue, setStudyQueue] = useState<{ title: string; cards: LibraryCard[] } | null>(null);

  useEffect(() => {
    function refresh() {
      const d = getDeck(params.deckId);
      setDeck(d ?? null);
      setOtherDecks(getDecks().filter(x => x.id !== params.deckId));
    }
    refresh();
    window.addEventListener(STUDY_DECKS_EVENT, refresh);
    window.addEventListener(PERSONAL_FLASHCARDS_EVENT, refresh);
    window.addEventListener(TERM_PROGRESS_EVENT, refresh);
    window.addEventListener(CARD_PROGRESS_EVENT, refresh);
    return () => {
      window.removeEventListener(STUDY_DECKS_EVENT, refresh);
      window.removeEventListener(PERSONAL_FLASHCARDS_EVENT, refresh);
      window.removeEventListener(TERM_PROGRESS_EVENT, refresh);
      window.removeEventListener(CARD_PROGRESS_EVENT, refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.deckId]);

  const cards = useMemo(() => deck ? getLibraryCardsByIds(deck.cardIds) : [], [deck]);
  const stats = useMemo(() => deck ? getDeckStats(deck) : null, [deck, cards]);
  const filtered = useMemo(() => {
    const base = filter === "all" ? cards : cards.filter(c => getCardDisplayStatus(c.id) === filter);
    return sortLibraryCards(base, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, filter, sort]);

  function startStudy(title: string, studyCards: LibraryCard[]) {
    if (studyCards.length === 0) return;
    setStudyQueue({ title, cards: studyCards });
  }

  if (studyQueue) {
    return <SmartReviewSession
      deckTitle={studyQueue.title}
      cards={studyQueue.cards}
      onExit={() => setStudyQueue(null)}
    />;
  }

  if (deck === undefined) return null;

  if (deck === null) return <section className="relative py-10 sm:py-14">
    <p className="text-sm text-slate-500">Deck not found.</p>
    <Link href="/dashboard/flashcards" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back to Flashcards</Link>
  </section>;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/flashcards" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Flashcards</Link>
    <span className="eyebrow"><Sparkles size={13} />Deck{deck.archived && " · Archived"}</span>

    {renaming
      ? <div className="mt-5 flex items-center gap-2">
        <input autoFocus value={nameDraft} onChange={e => setNameDraft(e.target.value)} className="display w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-2 text-3xl leading-tight outline-none focus:border-teal-400 sm:text-4xl" />
        <button type="button" onClick={() => { if (nameDraft.trim()) renameDeck(deck!.id, nameDraft.trim()); setRenaming(false); }} className="cursor-pointer rounded-full bg-accent-500 p-2.5 text-white hover:bg-accent-600"><Check size={16} /></button>
        <button type="button" onClick={() => setRenaming(false)} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 p-2.5 text-slate-500 hover:text-heading"><X size={16} /></button>
      </div>
      : <h1 className="display mt-5 flex items-center gap-3 text-4xl leading-tight sm:text-5xl">{deck.name}.
        <button type="button" onClick={() => { setNameDraft(deck!.name); setRenaming(true); }} className="cursor-pointer text-slate-300 transition hover:text-teal-600" aria-label="Rename deck"><Pencil size={20} /></button>
      </h1>}
    {deck.description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">{deck.description}</p>}

    {stats && stats.total > 0 && <div className="mt-6 max-w-xl">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${stats.masteredPercent}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="text-xs font-bold text-slate-500">{stats.total} card{stats.total === 1 ? "" : "s"}</span>
        {statusOrder.map(s => stats[s] > 0 && <span key={s} className={`flex items-center gap-1.5 text-xs font-bold ${statusStyles[s].text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[s].dot}`} />{stats[s]} {statusStyles[s].label}
        </span>)}
      </div>
    </div>}

    <div className="mt-6 flex flex-wrap gap-3">
      {stats && stats.due > 0
        ? <button type="button" onClick={() => startStudy(deck.name, cards.filter(c => getCardDisplayStatus(c.id) === "due"))} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><RotateCcw size={16} />Study Due ({stats.due})</button>
        : <button type="button" onClick={() => startStudy(deck.name, cards)} disabled={cards.length === 0} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw size={16} />Study All</button>}
      {stats && stats.due > 0 && <button type="button" onClick={() => startStudy(deck.name, cards)} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Study All ({stats.total})</button>}
      {stats && stats.new > 0 && <button type="button" onClick={() => startStudy(deck.name, cards.filter(c => getCardDisplayStatus(c.id) === "new"))} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Study New ({stats.new})</button>}
      {stats && stats.learning > 0 && <button type="button" onClick={() => startStudy(deck.name, cards.filter(c => getCardDisplayStatus(c.id) === "learning"))} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Continue Learning ({stats.learning})</button>}
      <Link href={`/dashboard/flashcards/create?deckId=${deck.id}`} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"><Plus size={16} />Add Cards</Link>
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={() => setMerging(true)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading">Merge decks</button>
      <button type="button" onClick={() => router.push(`/dashboard/flashcards/decks/${duplicateDeck(deck!.id)?.id}`)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><Copy size={13} />Duplicate</button>
      {deck.archived
        ? <button type="button" onClick={() => unarchiveDeck(deck!.id)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><Archive size={13} />Unarchive</button>
        : <button type="button" onClick={() => archiveDeck(deck!.id)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><Archive size={13} />Archive</button>}
      <button
        type="button"
        onClick={() => { if (confirm(`Delete "${deck!.name}"? Cards themselves won't be deleted.`)) { deleteDeck(deck!.id); router.push("/dashboard/flashcards"); } }}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300"
      ><Trash2 size={13} />Delete deck</button>
    </div>

    {merging && <div className="mt-6 max-w-md rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft">
      <p className="text-sm font-extrabold text-heading">Merge into a new deck</p>
      <p className="mt-1 text-xs text-slate-500">Combines this deck with the ones you pick below—no cards are duplicated or removed from their current decks.</p>
      <div className="mt-3 max-h-40 space-y-1.5 overflow-y-auto">
        {otherDecks.length === 0 && <p className="py-2 text-xs text-slate-400">No other decks to merge with.</p>}
        {otherDecks.map(d => {
          const checked = mergeSelection.has(d.id);
          return <button key={d.id} type="button" onClick={() => setMergeSelection(prev => { const next = new Set(prev); if (next.has(d.id)) next.delete(d.id); else next.add(d.id); return next; })} className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-bold transition ${checked ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-100 dark:border-white/10 text-heading hover:border-teal-200"}`}>
            <span>{d.name}</span><span className="text-xs font-bold text-slate-400">{d.cardIds.length} cards{checked && <Check size={14} className="ml-1.5 inline text-teal-600" />}</span>
          </button>;
        })}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={() => { setMerging(false); setMergeSelection(new Set()); }} className="cursor-pointer rounded-full px-4 py-2 text-xs font-bold text-slate-500 hover:text-heading">Cancel</button>
        <button
          type="button"
          disabled={mergeSelection.size === 0}
          onClick={() => {
            const merged = mergeDecks([deck!.id, ...Array.from(mergeSelection)], `${deck!.name} + ${mergeSelection.size} more`);
            setMerging(false);
            setMergeSelection(new Set());
            router.push(`/dashboard/flashcards/decks/${merged.id}`);
          }}
          className="cursor-pointer rounded-full bg-accent-500 px-5 py-2 text-xs font-bold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
        >Merge {mergeSelection.size > 0 ? `(${mergeSelection.size + 1} decks)` : ""}</button>
      </div>
    </div>}

    {cards.length === 0
      ? <div className="mt-8 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-10 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><Layers size={26} /></span>
        <p className="mt-4 text-base font-extrabold text-heading">This deck is empty.</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Add cards from Terminology, your lessons, or create your own—this deck is never locked to one source.</p>
        <Link href={`/dashboard/flashcards/create?deckId=${deck.id}`} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Plus size={16} />Add Cards</Link>
      </div>
      : <>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setFilter("all")} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${filter === "all" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All cards</button>
            {statusOrder.map(s => <button key={s} type="button" onClick={() => setFilter(filter === s ? "all" : s)} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${filter === s ? `${statusStyles[s].border} ${statusStyles[s].bg} ${statusStyles[s].text}` : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[s].dot}`} />{statusStyles[s].label}{stats ? ` (${stats[s]})` : ""}
            </button>)}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-3.5 py-1.5 text-xs font-extrabold text-heading outline-none focus:border-teal-400"
          >
            {sortOptions.map(o => <option key={o} value={o}>Sort: {sortLabels[o]}</option>)}
          </select>
        </div>

        <div className="mt-4 space-y-1.5 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-2 shadow-soft">
          {filtered.length === 0 && <p className="py-16 text-center text-sm text-slate-400">No cards match this filter.</p>}
          {filtered.map(card => {
            const Icon = sourceIcons[card.source];
            const style = statusStyles[getCardDisplayStatus(card.id)];
            return <div key={card.id} className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${style.border} ${style.bg}`}>
              <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/70 dark:bg-[#0d1917]/70 text-slate-500"><Icon size={15} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-heading">{card.front}</p>
                <p className="truncate text-xs text-slate-400">{card.subject}</p>
              </div>
              <span className={`shrink-0 rounded-full bg-white dark:bg-[#0d1917] px-2.5 py-1 text-[11px] font-extrabold ${style.text}`}>{style.label}</span>
              <button type="button" onClick={() => removeCardFromDeck(deck!.id, card.id)} className="shrink-0 cursor-pointer rounded-full p-1.5 text-slate-300 hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-600" aria-label="Remove from deck"><X size={15} /></button>
            </div>;
          })}
        </div>
      </>}
  </section>;
}
