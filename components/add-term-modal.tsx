"use client";

// Two real ways to grow "My Terminology" beyond just clicking a highlighted
// word in a lesson: look up an existing word from Studium's built-in
// medical dictionary (lib/terminology.ts's ~100 built-in terms) and add it
// straight to your list, or write a brand-new term of your own that isn't
// in the dictionary yet. Either path calls the same real learnTerm() every
// other "I know this term" action in the app already uses—so the moment a
// term lands here, it's a real personal term (counted in stats, reviewable,
// due for spaced repetition) AND a real flashcard: the Flashcard Library
// sources its "terminology" cards from getMyTerms() (lib/flashcardLibrary.ts),
// so nothing extra has to be created for that to happen.
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookMarked, Check, ClipboardList, Plus, Search, Sparkles, X } from "lucide-react";
import { Field, inputClass } from "./ui";
import { addCustomTerm, findTermCategory, getAllTerms, getMyTerms, learnTerm, Term, termCategories } from "@/lib/terminology";

type Mode = "lookup" | "create";

export function AddTermModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [mode, setMode] = useState<Mode>("lookup");

  // Snapshot of what's already yours at the moment the modal opened—good
  // enough for "already added" labeling in a short-lived picker session;
  // onAdded() still refreshes the real page-level list behind this modal
  // on every add, so the actual data is never stale.
  const myTermIds = useMemo(() => new Set(getMyTerms().map(t => t.id)), []);
  const [justAddedIds, setJustAddedIds] = useState<Set<string>>(new Set());

  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getAllTerms()
      .filter(t => t.name.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
      .slice(0, 30);
  }, [query]);

  function addFromLookup(term: Term) {
    if (myTermIds.has(term.id) || justAddedIds.has(term.id)) return;
    learnTerm(term.id);
    setJustAddedIds(s => new Set(s).add(term.id));
    onAdded();
  }

  const [name, setName] = useState("");
  const [definition, setDefinition] = useState("");
  const [categoryId, setCategoryId] = useState(termCategories[0].id);
  const [exampleSentence, setExampleSentence] = useState("");
  const [createError, setCreateError] = useState("");
  const [created, setCreated] = useState<Term | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    const result = addCustomTerm({
      name: name.trim(),
      definition: definition.trim(),
      categoryId,
      wordBreakdown: [],
      relatedTermIds: [],
      aiExplanation: "",
      exampleSentence: exampleSentence.trim(),
      clinicalRelevance: ""
    });
    if (!result.ok) { setCreateError(result.error); return; }
    // A custom term isn't "yours" just by existing in the shared dictionary
    // (it's genuinely creatable by anyone using this browser, same as an
    // admin-added one)—learnTerm() is what actually puts it in My
    // Terminology and, through that, generates its real flashcard.
    learnTerm(result.term.id);
    setCreated(result.term);
    onAdded();
  }

  function createAnother() {
    setCreated(null);
    setName("");
    setDefinition("");
    setExampleSentence("");
  }

  return <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
    onClick={onClose}
    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      onClick={e => e.stopPropagation()}
      className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-lift dark:border-white/10 dark:bg-[#0d1917] dark:shadow-none"
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/10 p-6 pb-5">
        <div>
          <span className="eyebrow text-[#0F8B8D]"><Plus size={13} />Add a term</span>
          <h2 className="display mt-2 text-2xl text-heading dark:text-white">Grow your vocabulary.</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-heading dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white"><X size={16} /></button>
      </div>

      <div className="flex gap-1.5 border-b border-slate-100 dark:border-white/10 px-6 pt-4">
        <button type="button" onClick={() => setMode("lookup")} className={`flex cursor-pointer items-center gap-1.5 rounded-t-lg border-b-2 px-3 pb-3 text-sm font-bold transition ${mode === "lookup" ? "border-teal-500 text-teal-700 dark:text-teal-300" : "border-transparent text-slate-400 hover:text-heading dark:hover:text-white"}`}><BookMarked size={14} />Look up a word</button>
        <button type="button" onClick={() => setMode("create")} className={`flex cursor-pointer items-center gap-1.5 rounded-t-lg border-b-2 px-3 pb-3 text-sm font-bold transition ${mode === "create" ? "border-teal-500 text-teal-700 dark:text-teal-300" : "border-transparent text-slate-400 hover:text-heading dark:hover:text-white"}`}><ClipboardList size={14} />Create your own</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {mode === "lookup" ? <>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search Studium's medical dictionary..."
              className={`${inputClass} pl-10`}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Searches every built-in term Studium knows—not just ones you've already encountered.</p>

          <div className="mt-4 space-y-1.5">
            {query.trim() === "" && <p className="py-8 text-center text-xs text-slate-400">Start typing a word to search the dictionary.</p>}
            {query.trim() !== "" && results.length === 0 && <p className="py-8 text-center text-xs text-slate-400">No matches for "{query}"—try Create your own instead.</p>}
            {results.map(term => {
              const already = myTermIds.has(term.id) || justAddedIds.has(term.id);
              return <div key={term.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 dark:border-white/10 p-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-heading dark:text-white">{term.name}</p>
                  <p className="text-[11px] font-bold text-slate-400">{findTermCategory(term.categoryId)?.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{term.definition}</p>
                </div>
                <button
                  type="button"
                  disabled={already}
                  onClick={() => addFromLookup(term)}
                  className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${already ? "cursor-not-allowed bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" : "bg-accent-500 text-white hover:-translate-y-0.5 hover:bg-accent-600"}`}
                >{already ? <><Check size={13} />Added</> : <><Plus size={13} />Add</>}</button>
              </div>;
            })}
          </div>
        </> : <>
          {created ? <div className="flex flex-col items-center py-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300"><Sparkles size={24} /></span>
            <h3 className="mt-4 text-lg font-extrabold text-heading dark:text-white">"{created.name}" added.</h3>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">It's in My Terminology now, ready for review—and a flashcard for it is already waiting in your Flashcard Library.</p>
            <div className="mt-6 flex gap-2.5">
              <button type="button" onClick={createAnother} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-5 py-2.5 text-sm font-bold text-heading transition hover:bg-slate-50 dark:bg-white/5">Add another</button>
              <button type="button" onClick={onClose} className="cursor-pointer rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-600">Done</button>
            </div>
          </div> : <form onSubmit={handleCreate} className="space-y-4">
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">Not in Studium's dictionary yet? Write your own term and definition—it becomes real, personal vocabulary (and a real flashcard) the moment you save it.</p>
            <Field label="Term" required><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Anastomosis" className={inputClass} /></Field>
            <Field label="Definition" required><textarea value={definition} onChange={e => setDefinition(e.target.value)} rows={3} placeholder="A plain-language definition you'll actually understand later." className={`${inputClass} resize-none`} /></Field>
            <Field label="Category">
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
                {termCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Example sentence (optional)"><input value={exampleSentence} onChange={e => setExampleSentence(e.target.value)} placeholder="Use it in a real sentence to help it stick." className={inputClass} /></Field>
            {createError && <p className="text-xs font-bold text-rose-600">{createError}</p>}
            <button type="submit" disabled={!name.trim() || !definition.trim()} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"><Plus size={16} />Create term</button>
          </form>}
        </>}
      </div>
    </motion.div>
  </motion.div>;
}
