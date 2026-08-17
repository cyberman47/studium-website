"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive, ArchiveRestore, BookA, Brain, CheckCircle2, CheckSquare, ChevronRight, CircleDot, FolderPlus, Layers,
  ListChecks, Plus, RotateCcw, Search, Sparkles, Square, Star, Trash2, X
} from "lucide-react";
import { Reveal } from "@/components/ui";
import { DeckPicker } from "@/components/deck-picker";
import { SmartReviewSession } from "@/components/smart-review-session";
import {
  CardSource, filterLibraryCards, getAllLibraryCards, getCardDisplayStatus, getDueTodaySummary, getLibraryPathGroups,
  LibraryCard, sortLabels, SortOption, sortLibraryCards, CARD_PROGRESS_EVENT
} from "@/lib/flashcardLibrary";
import { CardDisplayStatus } from "@/lib/spacedRepetitionCore";
import {
  addCardsToDeck, deleteDeck, getArchivedDecks, getDeckStats, getDecks, unarchiveDeck, STUDY_DECKS_EVENT, StudyDeck
} from "@/lib/flashcardDecks";
import { PERSONAL_FLASHCARDS_EVENT } from "@/lib/personalFlashcards";
import { TERM_PROGRESS_EVENT } from "@/lib/terminology";

const sourceLabels: Record<CardSource, string> = { terminology: "Terminology", lesson: "Lesson", personal: "My Cards" };
const sourceIcons: Record<CardSource, typeof BookA> = { terminology: BookA, lesson: Layers, personal: Star };

// The one real color language for mastery/review state across the whole
// page—every card row and every deck breakdown reads from this single map,
// so "what does orange mean here" never has two different answers.
const statusStyles: Record<CardDisplayStatus, { label: string; dot: string; border: string; bg: string; text: string }> = {
  new: { label: "New", dot: "bg-sky-500", border: "border-sky-200", bg: "bg-sky-50 dark:bg-sky-500/15 dark:text-sky-300 dark:bg-sky-500/15 dark:text-sky-300", text: "text-sky-700" },
  learning: { label: "Learning", dot: "bg-amber-500", border: "border-amber-200", bg: "bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300", text: "text-amber-700" },
  mastered: { label: "Mastered", dot: "bg-teal-500", border: "border-teal-200", bg: "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300", text: "text-teal-700" },
  due: { label: "Due", dot: "bg-orange-500", border: "border-orange-200", bg: "bg-orange-50 dark:bg-orange-500/15 dark:text-orange-300", text: "text-orange-700" }
};

const statusOrder: CardDisplayStatus[] = ["due", "learning", "new", "mastered"];
const sortOptions: SortOption[] = ["dueFirst", "recentlyStudied", "recentlyCreated", "leastMastered", "mostMastered", "alphabetical", "subject"];

type View = "decks" | "cards";

export default function FlashcardsPage() {
  const router = useRouter();
  const [allCards, setAllCards] = useState<LibraryCard[]>([]);
  const [decks, setDecks] = useState<StudyDeck[]>([]);
  const [archivedDecks, setArchivedDecks] = useState<StudyDeck[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>("decks");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CardDisplayStatus | null>(null);
  const [source, setSource] = useState<CardSource | null>(null);
  const [pathId, setPathId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [deckId, setDeckId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("dueFirst");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showDeckPicker, setShowDeckPicker] = useState(false);
  const [creatingDeck, setCreatingDeck] = useState(false);
  const [studyQueue, setStudyQueue] = useState<{ title: string; cards: LibraryCard[] } | null>(null);

  useEffect(() => {
    function refreshCards() { setAllCards(getAllLibraryCards()); }
    function refreshDecks() { setDecks(getDecks()); setArchivedDecks(getArchivedDecks()); }
    refreshCards();
    refreshDecks();
    setLoaded(true);
    window.addEventListener(PERSONAL_FLASHCARDS_EVENT, refreshCards);
    window.addEventListener(TERM_PROGRESS_EVENT, refreshCards);
    window.addEventListener(CARD_PROGRESS_EVENT, refreshCards);
    window.addEventListener(STUDY_DECKS_EVENT, refreshDecks);
    return () => {
      window.removeEventListener(PERSONAL_FLASHCARDS_EVENT, refreshCards);
      window.removeEventListener(TERM_PROGRESS_EVENT, refreshCards);
      window.removeEventListener(CARD_PROGRESS_EVENT, refreshCards);
      window.removeEventListener(STUDY_DECKS_EVENT, refreshDecks);
    };
  }, []);

  // Real two-level categorization—path first (MCAT, Terminology, My Cards,
  // ...), then subject within whichever path is selected.
  const pathGroups = useMemo(() => getLibraryPathGroups(allCards), [allCards]);
  const activePathGroup = useMemo(() => pathGroups.find(p => p.pathId === pathId) ?? null, [pathGroups, pathId]);
  const visibleSubjects: { subject: string; count: number; pathName: string }[] = activePathGroup
    ? activePathGroup.subjects.map(s => ({ ...s, pathName: activePathGroup.pathName }))
    : pathGroups.flatMap(p => p.subjects.map(s => ({ ...s, pathName: p.pathName })));

  function selectPath(id: string | null) {
    setPathId(id);
    setSubject(null); // subject list depends on the selected path—stale picks would silently vanish otherwise
  }

  // The 5 real overview numbers—what do I have, what do I know, what's left.
  const overview = useMemo(() => {
    const counts: Record<CardDisplayStatus, number> = { new: 0, learning: 0, mastered: 0, due: 0 };
    for (const c of allCards) counts[getCardDisplayStatus(c.id)]++;
    return { total: allCards.length, ...counts };
  }, [allCards]);

  // Simple Smart Flashcard Review System's "Due Today" summary—real counts,
  // not a decorative widget: "Study Due Cards" below launches a session with
  // exactly these cards.
  const dueSummary = useMemo(() => getDueTodaySummary(allCards), [allCards]);
  const dueCards = useMemo(() => allCards.filter(c => { const s = getCardDisplayStatus(c.id); return s === "learning" || s === "due"; }), [allCards]);

  const deckFiltered = useMemo(() => deckId ? allCards.filter(c => decks.find(d => d.id === deckId)?.cardIds.includes(c.id)) : allCards, [allCards, decks, deckId]);

  const filtered = useMemo(() => {
    const base = filterLibraryCards(deckFiltered, {
      query,
      source: source ?? undefined,
      pathId: pathId ?? undefined,
      subject: subject ?? undefined,
      status: status ?? undefined
    });
    return sortLibraryCards(base, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckFiltered, query, source, pathId, subject, status, sort]);

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // Bulk selection: select/deselect a whole group of ids at once—the "Select
  // all" row above the list and each subject group header both call this,
  // so picking "all of Biology" (or all filtered cards) is one click instead
  // of one click per card.
  function toggleSelectGroup(ids: string[]) {
    const allSelected = ids.length > 0 && ids.every(id => selected.has(id));
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) ids.forEach(id => next.delete(id));
      else ids.forEach(id => next.add(id));
      return next;
    });
  }

  // Sorting by Subject gets real visual grouping (a header per subject, each
  // with its own "select all" toggle)—every other sort stays a flat list,
  // since only Subject order actually clusters same-subject cards together.
  const groupedBySubject = useMemo(() => {
    if (sort !== "subject") return null;
    const groups: { subject: string; cards: LibraryCard[] }[] = [];
    for (const c of filtered) {
      const last = groups[groups.length - 1];
      if (last && last.subject === c.subject) last.cards.push(c);
      else groups.push({ subject: c.subject, cards: [c] });
    }
    return groups;
  }, [filtered, sort]);

  function startStudy(title: string, cards: LibraryCard[]) {
    if (cards.length === 0) return;
    setStudyQueue({ title, cards });
  }

  function startDeckStudy(deck: StudyDeck, statuses?: CardDisplayStatus[]) {
    const deckCards = allCards.filter(c => deck.cardIds.includes(c.id) && (!statuses || statuses.includes(getCardDisplayStatus(c.id))));
    startStudy(deck.name, deckCards);
  }

  if (!loaded) return null;

  if (studyQueue) {
    return <SmartReviewSession
      deckTitle={studyQueue.title}
      cards={studyQueue.cards}
      onExit={() => setStudyQueue(null)}
    />;
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <span className="eyebrow"><Sparkles size={13} />Flashcards</span>
        <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Your cards, all in one place.</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Every term, lesson card, and highlight you've saved—organized, tracked, and ready to review.</p>
      </div>
      <Link href="/dashboard/flashcards/create" className="mt-1 inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Plus size={16} />Create Flashcards</Link>
    </div>

    {/* Today's Review—the Simple Smart Flashcard Review System's real Due
        Today summary. "Learning" (🔴) still needs its 1st/2nd correct
        answer; "Ready for review" (🟢) was mastered and its 4-day (or
        later) interval has now come due. */}
    {dueSummary.due > 0 && <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-teal-100 dark:border-teal-500/20 bg-teal-50/60 dark:bg-teal-500/10 p-5 sm:p-6">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-teal-700 dark:text-teal-300"><Brain size={14} />Today's Review</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-heading">
          <span>🧠 {dueSummary.due} card{dueSummary.due === 1 ? "" : "s"} due</span>
          {dueSummary.learning > 0 && <span className="text-rose-600 dark:text-rose-300">🔴 {dueSummary.learning} learning</span>}
          {dueSummary.readyForReview > 0 && <span className="text-emerald-600 dark:text-emerald-300">🟢 {dueSummary.readyForReview} ready for review</span>}
        </div>
      </div>
      <button type="button" onClick={() => setStudyQueue({ title: "Today's Review", cards: dueCards })} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#0d9488] transition hover:-translate-y-0.5 hover:bg-teal-700"><RotateCcw size={15} />Study Due Cards</button>
    </div>}

    {/* 5 real overview stats: what do I have / what do I know / what's left. */}
    <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {[
        { key: "total" as const, label: "Total Cards", value: overview.total, icon: Layers, classes: "text-heading" },
        { key: "mastered" as const, label: "Mastered", value: overview.mastered, icon: CheckCircle2, classes: statusStyles.mastered.text },
        { key: "learning" as const, label: "Learning", value: overview.learning, icon: ListChecks, classes: statusStyles.learning.text },
        { key: "new" as const, label: "New", value: overview.new, icon: CircleDot, classes: statusStyles.new.text },
        { key: "due" as const, label: "Due", value: overview.due, icon: RotateCcw, classes: statusStyles.due.text }
      ].map((s, i) => <Reveal key={s.label} delay={i * 0.04}>
        <button
          type="button"
          onClick={() => { setView("cards"); setStatus(s.key === "total" ? null : s.key); }}
          className="w-full cursor-pointer rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><s.icon size={13} />{s.label}</div>
          <p className={`mt-3 text-2xl font-extrabold ${s.classes}`}>{s.value}</p>
        </button>
      </Reveal>)}
    </div>

    {/* Decks | Cards */}
    <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-1 shadow-soft">
        {(["decks", "cards"] as View[]).map(v => <button
          key={v}
          type="button"
          onClick={() => setView(v)}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-extrabold capitalize transition ${view === v ? "bg-accent-500 text-white shadow-[0_8px_18px_-10px_#047857]" : "text-slate-500 hover:text-heading"}`}
        >{v}</button>)}
      </div>
      {view === "decks" && <div className="flex items-center gap-4">
        {archivedDecks.length > 0 && <button type="button" onClick={() => setShowArchived(v => !v)} className={`inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold transition ${showArchived ? "text-heading" : "text-slate-400 hover:text-heading"}`}><Archive size={13} />{showArchived ? "Hide" : "Show"} archived ({archivedDecks.length})</button>}
        <button type="button" onClick={() => { setCreatingDeck(true); setShowDeckPicker(true); }} className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700"><FolderPlus size={15} />New deck</button>
      </div>}
    </div>

    {view === "decks" && showArchived && <div className="mt-6 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft">
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Archived decks</p>
      <div className="mt-3 space-y-1.5">
        {archivedDecks.map(d => <div key={d.id} className="flex items-center justify-between rounded-2xl px-3 py-2.5 transition hover:bg-slate-50 dark:bg-white/5">
          <Link href={`/dashboard/flashcards/decks/${d.id}`} className="min-w-0 cursor-pointer">
            <p className="truncate text-sm font-bold text-heading hover:text-teal-700">{d.name}</p>
            <p className="text-xs text-slate-400">{d.cardIds.length} card{d.cardIds.length === 1 ? "" : "s"}</p>
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={() => unarchiveDeck(d.id)} title="Unarchive" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 hover:text-teal-600"><ArchiveRestore size={15} /></button>
            <button type="button" onClick={() => { if (confirm(`Delete "${d.name}"? Cards themselves won't be deleted.`)) deleteDeck(d.id); }} title="Delete" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-600"><Trash2 size={15} /></button>
          </div>
        </div>)}
      </div>
    </div>}

    {view === "decks"
      ? <div className="mt-6">
        {decks.length === 0
          ? <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-10 text-center shadow-soft">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><Layers size={26} /></span>
            <p className="mt-4 text-base font-extrabold text-heading">No decks yet.</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Group cards into a deck to study them together, or browse everything in Cards view.</p>
            <button type="button" onClick={() => { setCreatingDeck(true); setShowDeckPicker(true); }} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><FolderPlus size={15} />Create a deck</button>
          </div>
          : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((d, i) => {
              const stats = getDeckStats(d);
              return <Reveal key={d.id} delay={i * 0.03}>
                <div className="flex h-full flex-col rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/dashboard/flashcards/decks/${d.id}`} className="min-w-0 cursor-pointer">
                      <p className="truncate text-sm font-extrabold text-heading hover:text-teal-700">{d.name}</p>
                      <p className="mt-0.5 text-xs font-bold text-slate-400">{stats.total} card{stats.total === 1 ? "" : "s"}</p>
                    </Link>
                    <Link href={`/dashboard/flashcards/create?deckId=${d.id}`} title="Add cards" className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full border border-slate-200 dark:border-white/10 text-slate-400 transition hover:border-teal-200 hover:text-teal-600"><Plus size={15} /></Link>
                  </div>

                  {stats.total === 0
                    ? <p className="mt-4 flex-1 text-xs leading-relaxed text-slate-400">Empty deck—add cards from Terminology, your lessons, or create your own.</p>
                    : <>
                      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${stats.masteredPercent}%` }} />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                        {statusOrder.map(s => stats[s] > 0 && <span key={s} className={`flex items-center gap-1.5 text-[11px] font-bold ${statusStyles[s].text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[s].dot}`} />{stats[s]} {statusStyles[s].label}
                        </span>)}
                      </div>
                      <div className="mt-4 flex-1" />
                      <div className="mt-4 flex flex-wrap gap-2">
                        {stats.due > 0 && <button type="button" onClick={() => startDeckStudy(d, ["due"])} className="cursor-pointer rounded-full bg-accent-500 px-3.5 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-accent-600">Study Due ({stats.due})</button>}
                        {stats.due === 0 && <button type="button" onClick={() => startDeckStudy(d)} className="cursor-pointer rounded-full bg-accent-500 px-3.5 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-accent-600">Study All</button>}
                        {stats.new > 0 && <button type="button" onClick={() => startDeckStudy(d, ["new"])} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-3.5 py-1.5 text-[11px] font-extrabold text-heading transition hover:border-teal-200">New ({stats.new})</button>}
                        {stats.learning > 0 && <button type="button" onClick={() => startDeckStudy(d, ["learning"])} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-3.5 py-1.5 text-[11px] font-extrabold text-heading transition hover:border-teal-200">Continue ({stats.learning})</button>}
                      </div>
                    </>}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-3">
                    <Link href={`/dashboard/flashcards/decks/${d.id}`} className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-teal-600">Manage deck<ChevronRight size={13} /></Link>
                    {stats.total > 0 && <button type="button" onClick={() => startDeckStudy(d)} className="cursor-pointer text-xs font-bold text-slate-400 hover:text-heading">Study all</button>}
                  </div>
                </div>
              </Reveal>;
            })}
          </div>}
      </div>
      : <div className="mt-6">
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search cards…"
            className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-2.5 pl-10 pr-4 text-sm font-semibold text-heading outline-none focus:border-teal-400"
          />
        </div>

        {/* Status */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setStatus(null)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${!status ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All statuses</button>
          {statusOrder.map(s => <button key={s} type="button" onClick={() => setStatus(status === s ? null : s)} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${status === s ? `${statusStyles[s].border} ${statusStyles[s].bg} ${statusStyles[s].text}` : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[s].dot}`} />{statusStyles[s].label} ({overview[s]})
          </button>)}
        </div>

        {/* Source, Deck, Sort */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {(["terminology", "lesson", "personal"] as CardSource[]).map(s => <button
            key={s}
            type="button"
            onClick={() => setSource(source === s ? null : s)}
            className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${source === s ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}
          >{sourceLabels[s]}</button>)}
          {decks.length > 0 && <select
            value={deckId ?? ""}
            onChange={e => setDeckId(e.target.value || null)}
            className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-3.5 py-1.5 text-xs font-extrabold text-slate-500 outline-none focus:border-teal-400"
          >
            <option value="">Any deck</option>
            {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>}
          <span className="mx-1 hidden w-px self-stretch bg-slate-200 sm:block" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-3.5 py-1.5 text-xs font-extrabold text-heading outline-none focus:border-teal-400"
          >
            {sortOptions.map(o => <option key={o} value={o}>Sort: {sortLabels[o]}</option>)}
          </select>
        </div>

        {/* Path/subject */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => selectPath(null)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${!pathId ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All ({allCards.length})</button>
          {pathGroups.map(g => <button key={g.pathId} type="button" onClick={() => selectPath(pathId === g.pathId ? null : g.pathId)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${pathId === g.pathId ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{g.pathName} ({g.count})</button>)}
        </div>
        {visibleSubjects.length > 0 && <div className="mt-2.5 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pr-1">
          <button type="button" onClick={() => setSubject(null)} className={`cursor-pointer rounded-full border px-3 py-1 text-[11px] font-bold transition ${!subject ? "border-teal-400 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All subjects</button>
          {visibleSubjects.map(s => <button key={`${s.pathName}:${s.subject}`} type="button" onClick={() => setSubject(subject === s.subject ? null : s.subject)} className={`cursor-pointer rounded-full border px-3 py-1 text-[11px] font-bold transition ${subject === s.subject ? "border-teal-400 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{pathId ? s.subject : `${s.pathName}: ${s.subject}`} ({s.count})</button>)}
        </div>}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => toggleSelectGroup(filtered.map(c => c.id))}
              disabled={filtered.length === 0}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {filtered.length > 0 && filtered.every(c => selected.has(c.id)) ? <CheckSquare size={16} className="text-teal-600" /> : <Square size={16} />}
              Select all
            </button>
            <p className="text-xs font-bold text-slate-400">{filtered.length} card{filtered.length === 1 ? "" : "s"}</p>
          </div>
          <button type="button" onClick={() => startStudy("Flashcard Library", filtered)} disabled={filtered.length === 0} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"><RotateCcw size={14} />Study {filtered.length > 0 ? `all ${filtered.length}` : ""}</button>
        </div>

        <div className="mt-4 max-h-[560px] space-y-1.5 overflow-y-auto rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-2 shadow-soft">
          {filtered.length === 0 && <p className="py-16 text-center text-sm text-slate-400">No cards match these filters.</p>}
          {groupedBySubject
            ? groupedBySubject.map(group => <div key={group.subject}>
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-xl bg-white/95 dark:bg-[#0d1917]/95 px-2 py-1.5 backdrop-blur-sm">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">{group.subject} ({group.cards.length})</p>
                <button type="button" onClick={() => toggleSelectGroup(group.cards.map(c => c.id))} className="flex cursor-pointer items-center gap-1 text-[11px] font-bold text-slate-400 transition hover:text-teal-600">
                  {group.cards.every(c => selected.has(c.id)) ? <CheckSquare size={13} className="text-teal-600" /> : <Square size={13} />}
                  Select all
                </button>
              </div>
              <div className="space-y-1.5 pb-2">
                {group.cards.map(card => <CardRow key={card.id} card={card} selected={selected.has(card.id)} onToggle={toggleSelect} />)}
              </div>
            </div>)
            : filtered.map(card => <CardRow key={card.id} card={card} selected={selected.has(card.id)} onToggle={toggleSelect} />)}
        </div>
      </div>}

    {selected.size > 0 && <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-5 py-3 shadow-lift">
        <span className="text-sm font-bold text-heading">{selected.size} selected</span>
        <button type="button" onClick={() => startStudy("Selected Cards", allCards.filter(c => selected.has(c.id)))} className="cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-600">Study selected</button>
        <button type="button" onClick={() => { setCreatingDeck(false); setShowDeckPicker(true); }} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-heading transition hover:border-teal-200">Add to deck</button>
        <button type="button" onClick={() => setSelected(new Set())} className="cursor-pointer text-slate-400 hover:text-heading" aria-label="Clear selection"><X size={16} /></button>
      </div>
    </div>}

    {showDeckPicker && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={() => setShowDeckPicker(false)}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-sm">
        <DeckPicker
          confirmLabel="Add cards"
          startCreating={creatingDeck}
          onCancel={() => setShowDeckPicker(false)}
          onConfirm={pickedDeckId => {
            if (selected.size > 0) addCardsToDeck(pickedDeckId, Array.from(selected));
            setShowDeckPicker(false);
            setSelected(new Set());
            router.push(`/dashboard/flashcards/decks/${pickedDeckId}`);
          }}
        />
      </div>
    </div>}
  </section>;
}

// Shared by both the flat list and the subject-grouped list—one real row
// definition instead of two copies drifting apart.
function CardRow({ card, selected, onToggle }: { card: LibraryCard; selected: boolean; onToggle: (id: string) => void }) {
  const Icon = sourceIcons[card.source];
  const style = statusStyles[getCardDisplayStatus(card.id)];
  return <div className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${selected ? "border-teal-300 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300" : `${style.border} ${style.bg}`}`}>
    <button type="button" onClick={() => onToggle(card.id)} className="shrink-0 cursor-pointer text-slate-300 hover:text-teal-600" aria-label="Select card">
      {selected ? <CheckSquare size={18} className="text-teal-600" /> : <Square size={18} />}
    </button>
    <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/70 dark:bg-[#0d1917]/70 text-slate-500"><Icon size={15} /></span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-bold text-heading">{card.front}</p>
      <p className="truncate text-xs text-slate-400">{card.subject} · {sourceLabels[card.source]}</p>
    </div>
    <span className={`shrink-0 rounded-full bg-white dark:bg-[#0d1917] px-2.5 py-1 text-[11px] font-extrabold ${style.text}`}>{style.label}</span>
  </div>;
}
