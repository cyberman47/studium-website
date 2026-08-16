"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookmarkCheck, Layers, PartyPopper, Sparkles, Type, Wand2 } from "lucide-react";
import { showKnowledgeToast } from "@/lib/kpToast";
import { getLevelInfo } from "@/lib/progress";
import { GeneratedExtractedTerm, GeneratedFlashcard, sampleDocument, saveFlashcardDeck } from "@/lib/create";
import { consumePendingSource, generateTerms } from "@/lib/aiGenerate";
import { addCustomTerm, getAllTerms, getTerm, isTermLearned, learnTerm } from "@/lib/terminology";

const sampleExtractedIds = ["myocardial-infarction", "arrhythmia", "atherosclerosis"];

// A real extracted term either matches an existing Studium term by name
// (built-in or a previously-added custom one)—in which case it plugs
// straight into the real terminology system under that term's real id—or
// it's genuinely new to Studium, in which case "Add to Terminology" creates
// a real custom term (lib/terminology.ts's addCustomTerm) on click rather
// than pretending an id already exists for it.
type ResolvedTerm = { source: GeneratedExtractedTerm; existingId: string | null; addedId: string | null };

type LoadState = "loading" | "generating" | "ready" | "error";

export default function CreateTerminologyPage() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [genError, setGenError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<ResolvedTerm[]>([]);
  const [isSample, setIsSample] = useState(true);
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [flashcardedIds, setFlashcardedIds] = useState<Set<string>>(new Set());
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string } | null>(null);

  const consumedRef = useRef(false);

  useEffect(() => {
    if (consumedRef.current) return;
    consumedRef.current = true;

    const pendingSource = consumePendingSource();
    if (pendingSource) {
      setLoadState("generating");
      generateTerms(pendingSource, 6).then(result => {
        if ("error" in result) { setGenError(result.error); setLoadState("error"); return; }
        const existingByName = new Map(getAllTerms().map(t => [t.name.toLowerCase(), t.id]));
        setResolved(result.items.map(source => ({ source, existingId: existingByName.get(source.name.toLowerCase()) ?? null, addedId: null })));
        setIsSample(false);
        setLoadState("ready");
      });
      return;
    }

    const sampleTerms = sampleExtractedIds.map(id => getTerm(id)).filter((t): t is NonNullable<ReturnType<typeof getTerm>> => !!t);
    setResolved(sampleTerms.map(t => ({ source: { name: t.name, definition: t.definition, categoryId: t.categoryId, wordBreakdown: t.wordBreakdown }, existingId: t.id, addedId: null })));
    setLoadState("ready");
  }, []);

  useEffect(() => {
    setLearned(new Set(resolved.map(r => r.existingId ?? r.addedId).filter((id): id is string => !!id).filter(isTermLearned)));
  }, [resolved]);

  function handleAddToTerminology(row: ResolvedTerm, index: number) {
    let id = row.existingId ?? row.addedId;
    if (!id) {
      const result = addCustomTerm({
        name: row.source.name, definition: row.source.definition, categoryId: row.source.categoryId,
        wordBreakdown: row.source.wordBreakdown, relatedTermIds: [], aiExplanation: row.source.definition,
        exampleSentence: "", clinicalRelevance: ""
      });
      if (!result.ok) return;
      id = result.term.id;
      setResolved(list => list.map((r, i) => i === index ? { ...r, addedId: id } : r));
    }
    const claim = learnTerm(id);
    setLearned(s => new Set(s).add(id as string));
    if (claim?.awarded) {
      showKnowledgeToast(claim.kpAwarded);
      if (claim.leveledUp) { const info = getLevelInfo(claim.totalKP); setLevelUpInfo({ level: info.level, name: info.name }); }
    }
  }

  function handleCreateFlashcard(row: ResolvedTerm) {
    const key = row.existingId ?? row.addedId ?? row.source.name;
    const card: GeneratedFlashcard = { question: `What is ${row.source.name}?`, answer: row.source.definition, difficulty: "Medium" };
    saveFlashcardDeck(`${row.source.name} Flashcard`, [card]);
    setFlashcardedIds(s => new Set(s).add(key));
  }

  if (loadState === "loading") return null;

  if (loadState === "generating") return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <div className="mt-16 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-20 text-center shadow-soft">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300"><Sparkles size={22} /></span>
      <p className="text-sm font-extrabold text-heading dark:text-white">Extracting terms from your notes…</p>
      <p className="max-w-xs text-xs leading-relaxed text-slate-500">A real AI call is finding the specific medical terms in your text.</p>
    </div>
  </section>;

  if (loadState === "error") return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <div className="mt-16 flex flex-col items-center gap-3 rounded-3xl border border-rose-200 bg-rose-50 dark:bg-rose-500/10 py-16 text-center">
      <p className="text-sm font-extrabold text-rose-700 dark:text-rose-300">Extraction failed.</p>
      <p className="max-w-sm text-xs leading-relaxed text-rose-600 dark:text-rose-300">{genError}</p>
      <Link href="/dashboard/create" className="mt-2 inline-block cursor-pointer text-sm font-bold text-teal-700 underline">Back to Create</Link>
    </div>
  </section>;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><Type size={13} />Extract Terminology</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Extracted terms.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">{isSample ? `Important terms found in ${sampleDocument.fileName}.` : "Real terms a real AI call found in your own notes."} Adding one for real tracks toward your terminology progress.</p>

    <div className="relative mt-8 max-w-2xl space-y-5">
      {resolved.map((row, i) => {
        const id = row.existingId ?? row.addedId;
        const isLearned = !!id && learned.has(id);
        const flashKey = row.existingId ?? row.addedId ?? row.source.name;
        return <div key={`${row.source.name}-${i}`} className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Term</p>
          <h2 className="mt-1 text-xl font-extrabold text-heading">{row.source.name}</h2>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">Definition</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{row.source.definition}</p>
          {row.source.wordBreakdown.length > 0 && <>
            <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">Word Breakdown</p>
            <div className="mt-1.5 flex flex-wrap gap-2">{row.source.wordBreakdown.map(wp => <span key={wp.part} className="rounded-full border border-slate-200 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 px-3 py-1 text-xs font-bold text-heading">{wp.part} <span className="font-medium text-slate-500">= {wp.meaning}</span></span>)}</div>
          </>}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button type="button" onClick={() => handleAddToTerminology(row, i)} disabled={isLearned} className="flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
              {isLearned ? <><BookmarkCheck size={13} />Added</> : <><Layers size={13} />Add to Terminology</>}
            </button>
            <button type="button" onClick={() => handleCreateFlashcard(row)} disabled={flashcardedIds.has(flashKey)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60">
              {flashcardedIds.has(flashKey) ? "Flashcard created ✓" : "Create Flashcard"}
            </button>
            <Link href="/dashboard/ai-tutor" className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-extrabold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"><Wand2 size={13} />Ask Studium AI</Link>
          </div>
        </div>;
      })}
    </div>

    <AnimatePresence>
      {levelUpInfo && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setLevelUpInfo(null)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0d1917] p-8 text-center shadow-lift"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-600"><PartyPopper size={30} /></span>
          <h2 className="display mt-5 text-2xl">🎉 Level Up!</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Congratulations! You've reached <span className="font-extrabold text-heading">Level {levelUpInfo.level} · {levelUpInfo.name}</span>.</p>
          <button type="button" onClick={() => setLevelUpInfo(null)} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Awesome!</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}
