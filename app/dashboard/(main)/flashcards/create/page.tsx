"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, BookA, Check, CheckSquare, ChevronRight, Copy, FileUp, Layers,
  Pencil, Plus, Sparkles, Square, Trash2
} from "lucide-react";
import { DeckPicker } from "@/components/deck-picker";
import { mcatSections } from "@/lib/mcatPath";
import { getLessonContent } from "@/lib/mcatPath";
import { ConfidenceLevel, getAllTerms, getTermConfidence, Term } from "@/lib/terminology";
import { addPersonalFlashcard } from "@/lib/personalFlashcards";
import { addCardsToDeck, getDeck, StudyDeck } from "@/lib/flashcardDecks";

type Method = "terminology" | "content" | "manual" | "files" | "ai";

const confidenceLabels: Record<ConfidenceLevel, string> = { "know-well": "Know well", somewhat: "Learning", "dont-know": "Don't know" };
const confidenceDots: Record<ConfidenceLevel, string> = { "know-well": "bg-teal-500", somewhat: "bg-amber-500", "dont-know": "bg-orange-500" };

// useSearchParams() bails out of static rendering and needs a Suspense
// boundary above it—without one, the server render (no query string
// available yet) and the client render (deckId already known) briefly
// disagree, which shows up as a real hydration mismatch on first load.
export default function CreateFlashcardsPage() {
  return <Suspense fallback={null}><CreateFlashcardsContent /></Suspense>;
}

function CreateFlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetDeckId = searchParams.get("deckId");

  const [method, setMethod] = useState<Method | null>(null);
  const [pendingIds, setPendingIds] = useState<string[] | null>(null);
  // Deck lookup is a real localStorage read, unavailable during SSR (unlike
  // targetDeckId, which comes straight from the real URL and is already
  // consistent server/client)—populate it post-mount only, same
  // hydration-safety pattern as every other localStorage-derived value in
  // this app, so the server and first client render agree.
  const [targetDeck, setTargetDeck] = useState<StudyDeck | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTargetDeck(targetDeckId ? getDeck(targetDeckId) ?? null : null);
    setLoaded(true);
  }, [targetDeckId]);

  function finishAdding(ids: string[]) {
    if (ids.length === 0) return;
    if (targetDeckId) {
      addCardsToDeck(targetDeckId, ids);
      router.push(`/dashboard/flashcards/decks/${targetDeckId}`);
    } else {
      setPendingIds(ids);
    }
  }

  const heading = targetDeck ? `Add cards to "${targetDeck.name}"` : "Create Flashcards";
  const backHref = targetDeckId ? `/dashboard/flashcards/decks/${targetDeckId}` : "/dashboard/flashcards";
  const backLabel = targetDeckId ? "Back to deck" : "Back to Flashcards";

  if (!loaded) return null;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href={method ? "#" : backHref} onClick={method ? (e => { e.preventDefault(); setMethod(null); }) : undefined} className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />{method ? "Choose a different method" : backLabel}</Link>
    <span className="eyebrow"><Sparkles size={13} />Create</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{heading}.</h1>
    {!method && <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Pick where these cards come from—every method adds real, study-ready cards, never placeholders.</p>}

    {!method && <div className="mt-10 grid gap-4 sm:grid-cols-2">
      <MethodTile icon={BookA} title="From Terminology" description="Turn medical terms you're studying into real flashcards, filtered by how well you know them." onClick={() => setMethod("terminology")} />
      <MethodTile icon={Layers} title="From Studium Lessons" description="Add the real flashcards already written for MCAT lessons straight into a deck." onClick={() => setMethod("content")} />
      <MethodTile icon={Pencil} title="Create Manually" description="Write your own front/back cards from scratch, for anything not covered elsewhere." onClick={() => setMethod("manual")} />
      <MethodTile icon={FileUp} title="From Files" description="Upload notes or a PDF and generate cards from them." comingSoon reason="File parsing needs a real backend Studium doesn't have yet—uploading wouldn't produce real cards, so this stays honestly off until it does." />
      <MethodTile icon={Sparkles} title="Generate with Studium AI" description="Describe a topic and preview AI-written cards before adding any." comingSoon reason="Studium isn't connected to a live AI model yet (same as the AI Tutor)—so there's nothing real to generate from." />
    </div>}

    {method === "terminology" && <TerminologyMethod onSubmit={finishAdding} />}
    {method === "content" && <ContentMethod onSubmit={finishAdding} />}
    {method === "manual" && <ManualMethod onSubmit={finishAdding} />}

    {pendingIds && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={() => setPendingIds(null)}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-sm">
        <DeckPicker
          confirmLabel="Add cards"
          onCancel={() => setPendingIds(null)}
          onConfirm={pickedDeckId => {
            addCardsToDeck(pickedDeckId, pendingIds);
            setPendingIds(null);
            router.push(`/dashboard/flashcards/decks/${pickedDeckId}`);
          }}
        />
      </div>
    </div>}
  </section>;
}

function MethodTile({ icon: Icon, title, description, onClick, comingSoon, reason }: {
  icon: typeof BookA; title: string; description: string; onClick?: () => void; comingSoon?: boolean; reason?: string;
}) {
  if (comingSoon) return <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 opacity-80">
    <div className="flex items-start justify-between gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-400"><Icon size={20} /></span>
      <span className="shrink-0 rounded-full bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-700">Coming Soon</span>
    </div>
    <p className="mt-4 text-sm font-extrabold text-heading">{title}</p>
    <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
    {reason && <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{reason}</p>}
  </div>;

  return <button type="button" onClick={onClick} className="group cursor-pointer rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lift">
    <div className="flex items-start justify-between gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><Icon size={20} /></span>
      <ChevronRight size={16} className="mt-2 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500" />
    </div>
    <p className="mt-4 text-sm font-extrabold text-heading">{title}</p>
    <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
  </button>;
}

// ---- From Terminology ----

function TerminologyMethod({ onSubmit }: { onSubmit: (ids: string[]) => void }) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [query, setQuery] = useState("");
  const [confidence, setConfidence] = useState<ConfidenceLevel | "unrated" | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => { setTerms(getAllTerms()); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter(t => {
      if (q && !t.name.toLowerCase().includes(q) && !t.definition.toLowerCase().includes(q)) return false;
      const c = getTermConfidence(t.id);
      if (confidence === "unrated" && c !== null) return false;
      if (confidence && confidence !== "unrated" && c !== confidence) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, query, confidence]);

  function toggle(id: string) {
    setSelected(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  return <div className="mt-8">
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search terms…"
      className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-4 py-2.5 text-sm font-semibold text-heading outline-none focus:border-teal-400"
    />
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={() => setConfidence(null)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${!confidence ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All ({terms.length})</button>
      {(["dont-know", "somewhat", "know-well"] as ConfidenceLevel[]).map(c => <button key={c} type="button" onClick={() => setConfidence(confidence === c ? null : c)} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${confidence === c ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}><span className={`h-1.5 w-1.5 rounded-full ${confidenceDots[c]}`} />{confidenceLabels[c]}</button>)}
      <button type="button" onClick={() => setConfidence(confidence === "unrated" ? null : "unrated")} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${confidence === "unrated" ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>Not rated yet</button>
    </div>

    <div className="mt-4 max-h-[440px] space-y-1.5 overflow-y-auto rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-2 shadow-soft">
      {filtered.length === 0 && <p className="py-16 text-center text-sm text-slate-400">No terms match these filters.</p>}
      {filtered.map(t => {
        const isSelected = selected.has(t.id);
        return <button key={t.id} type="button" onClick={() => toggle(t.id)} className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${isSelected ? "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300" : "hover:bg-slate-50 dark:bg-white/5"}`}>
          {isSelected ? <CheckSquare size={18} className="shrink-0 text-teal-600" /> : <Square size={18} className="shrink-0 text-slate-300" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-heading">{t.name}</p>
            <p className="truncate text-xs text-slate-400">{t.definition}</p>
          </div>
        </button>;
      })}
    </div>

    <div className="sticky bottom-4 mt-4 flex justify-end">
      <button type="button" onClick={() => onSubmit(Array.from(selected).map(id => `term:${id}`))} disabled={selected.size === 0} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">Create cards from selected terms ({selected.size})</button>
    </div>
  </div>;
}

// ---- From Studium Lessons ----

function ContentMethod({ onSubmit }: { onSubmit: (ids: string[]) => void }) {
  const [sectionId, setSectionId] = useState(mcatSections[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const section = mcatSections.find(s => s.id === sectionId);
  const subject = section?.subjects.find(s => s.id === subjectId);
  const lessonContent = lessonId ? getLessonContent(lessonId) : undefined;

  function selectSection(id: string) { setSectionId(id); setSubjectId(null); setLessonId(null); setSelected(new Set()); }
  function selectSubject(id: string) { setSubjectId(id); setLessonId(null); setSelected(new Set()); }
  function selectLesson(id: string, cardCount: number) {
    setLessonId(id);
    setSelected(new Set(Array.from({ length: cardCount }, (_, i) => i))); // default: everything selected
  }
  function toggle(i: number) {
    setSelected(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; });
  }

  return <div className="mt-8">
    <div className="flex flex-wrap gap-2">
      {mcatSections.map(s => <button key={s.id} type="button" onClick={() => selectSection(s.id)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${sectionId === s.id ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{s.shortTitle}</button>)}
    </div>

    {section && <div className="mt-3 flex flex-wrap gap-1.5">
      {section.subjects.map(s => <button key={s.id} type="button" onClick={() => selectSubject(s.id)} className={`cursor-pointer rounded-full border px-3 py-1 text-[11px] font-bold transition ${subjectId === s.id ? "border-teal-400 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{s.name}</button>)}
    </div>}

    {subject && <div className="mt-4 space-y-1.5">
      {subject.lessons.map(l => {
        const content = getLessonContent(l.id);
        const count = content?.flashcards.length ?? 0;
        const available = count > 0;
        return <button
          key={l.id}
          type="button"
          disabled={!available}
          onClick={() => selectLesson(l.id, count)}
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${!available ? "cursor-not-allowed border-slate-100 dark:border-white/10 text-slate-300" : lessonId === l.id ? "cursor-pointer border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "cursor-pointer border-slate-100 dark:border-white/10 text-heading hover:border-teal-200"}`}
        >
          <span>{l.title}</span>
          <span className="text-xs font-bold text-slate-400">{available ? `${count} cards` : "No flashcards yet"}</span>
        </button>;
      })}
    </div>}

    {lessonContent && <>
      <div className="mt-5 max-h-[380px] space-y-1.5 overflow-y-auto rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-2 shadow-soft">
        {lessonContent.flashcards.map((fc, i) => {
          const isSelected = selected.has(i);
          return <button key={i} type="button" onClick={() => toggle(i)} className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition ${isSelected ? "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300" : "hover:bg-slate-50 dark:bg-white/5"}`}>
            {isSelected ? <CheckSquare size={18} className="mt-0.5 shrink-0 text-teal-600" /> : <Square size={18} className="mt-0.5 shrink-0 text-slate-300" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-heading">{fc.front}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{fc.back}</p>
            </div>
          </button>;
        })}
      </div>
      <div className="sticky bottom-4 mt-4 flex justify-end">
        <button type="button" onClick={() => onSubmit(Array.from(selected).map(i => `lesson:${lessonId}:${i}`))} disabled={selected.size === 0} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">Add {selected.size} card{selected.size === 1 ? "" : "s"} to deck</button>
      </div>
    </>}
  </div>;
}

// ---- Create Manually ----

type DraftCard = { front: string; back: string };

function ManualMethod({ onSubmit }: { onSubmit: (ids: string[]) => void }) {
  const [cards, setCards] = useState<DraftCard[]>([{ front: "", back: "" }]);

  function update(i: number, field: keyof DraftCard, value: string) {
    setCards(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  }
  function addCard() { setCards(prev => [...prev, { front: "", back: "" }]); }
  function duplicateCard(i: number) { setCards(prev => [...prev.slice(0, i + 1), { ...prev[i] }, ...prev.slice(i + 1)]); }
  function deleteCard(i: number) { setCards(prev => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)); }

  const readyCards = cards.filter(c => c.front.trim() && c.back.trim());

  function save() {
    const ids = readyCards.map(c => addPersonalFlashcard({
      front: c.front.trim(),
      back: c.back.trim(),
      sourceLessonId: "manual",
      sourceLessonTitle: "Manually created"
    }).id);
    onSubmit(ids);
  }

  return <div className="mt-8 space-y-3">
    {cards.map((c, i) => <div key={i} className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Card {i + 1}</p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => duplicateCard(i)} title="Duplicate" className="cursor-pointer rounded-full p-1.5 text-slate-300 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><Copy size={14} /></button>
          <button type="button" onClick={() => deleteCard(i)} disabled={cards.length === 1} title="Delete" className="cursor-pointer rounded-full p-1.5 text-slate-300 transition hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 size={14} /></button>
        </div>
      </div>
      <textarea value={c.front} onChange={e => update(i, "front", e.target.value)} placeholder="Front—question or term" rows={2} className="mt-2 w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm font-semibold text-heading outline-none focus:border-teal-400" />
      <textarea value={c.back} onChange={e => update(i, "back", e.target.value)} placeholder="Back—answer or definition" rows={2} className="mt-2 w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-sm text-heading outline-none focus:border-teal-400" />
    </div>)}

    <button type="button" onClick={addCard} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 py-3 text-sm font-bold text-slate-500 transition hover:border-teal-300 hover:text-teal-600"><Plus size={15} />Add another card</button>

    <div className="sticky bottom-4 flex justify-end pt-2">
      <button type="button" onClick={save} disabled={readyCards.length === 0} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"><Check size={16} />Save {readyCards.length} card{readyCards.length === 1 ? "" : "s"}</button>
    </div>
  </div>;
}
