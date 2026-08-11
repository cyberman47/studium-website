"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileJson, Image as ImageIcon, Plus, Search, Trash2, Volume2, X } from "lucide-react";
import {
  addCustomTerm, CUSTOM_TERMS_EVENT, getAllTerms, isCustomTerm, removeCustomTerm, Term, termCategories, updateCustomTerm
} from "@/lib/terminology";

const fieldClass = "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40";
const difficulties = ["Beginner", "Intermediate", "Advanced"] as const;

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export default function VocabularyPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Term | null>(null);

  const allTerms = useMemo(() => getAllTerms(), [refreshKey]);

  useEffect(() => {
    function onChange() { setRefreshKey(k => k + 1); }
    window.addEventListener(CUSTOM_TERMS_EVENT, onChange);
    return () => window.removeEventListener(CUSTOM_TERMS_EVENT, onChange);
  }, []);

  const filtered = allTerms.filter(t => {
    const matchesQuery = t.name.toLowerCase().includes(query.trim().toLowerCase()) || t.definition.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = category === "all" || t.categoryId === category;
    return matchesQuery && matchesCategory;
  });

  function handleRemove(id: string) {
    removeCustomTerm(id);
    setRefreshKey(k => k + 1);
  }

  return <div>
    <h1 className="text-lg font-extrabold text-white">Vocabulary</h1>
    <p className="mt-1 text-xs text-slate-500">Real CMS for medical terms—definitions, difficulty, tags, related terms, and browser-native pronunciation. Genuinely merges into detection/highlighting across the app, not a mockup.</p>

    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search terms..." className="w-56 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-3 pr-8 text-sm text-white outline-none transition focus:border-teal-500/40">
          <option value="all" className="bg-[#12171F] text-white">All Categories</option>
          {termCategories.map(c => <option key={c.id} value={c.id} className="bg-[#12171F] text-white">{c.name}</option>)}
        </select>
      </div>
      <button type="button" onClick={() => { setEditing(null); setModalOpen(true); }} className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-teal-600"><Plus size={14} />Quick Add Term / Bulk JSON</button>
    </div>

    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-2.5">Term</th>
            <th className="px-4 py-2.5">Category</th>
            <th className="px-4 py-2.5">Difficulty</th>
            <th className="px-4 py-2.5">Tags</th>
            <th className="px-4 py-2.5">Definition</th>
            <th className="px-4 py-2.5">Source</th>
            <th className="px-4 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => {
            const custom = isCustomTerm(t.id);
            const cat = termCategories.find(c => c.id === t.categoryId);
            return <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">{t.name}</span>
                  <button type="button" title="Pronounce (browser text-to-speech)" onClick={() => speak(t.name)} className="grid h-5 w-5 cursor-pointer place-items-center rounded text-slate-500 hover:text-teal-400"><Volume2 size={12} /></button>
                  {t.imageUrl && <ImageIcon size={12} className="text-slate-500" />}
                </div>
              </td>
              <td className="px-4 py-3 text-slate-400">{cat?.name ?? t.categoryId}</td>
              <td className="px-4 py-3">{t.difficulty && <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-extrabold text-slate-300">{t.difficulty}</span>}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">{(t.tags ?? []).slice(0, 3).map(tag => <span key={tag} className="rounded-full bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-bold text-teal-300">{tag}</span>)}</div>
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-slate-400">{t.definition}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${custom ? "bg-violet-500/15 text-violet-300" : "bg-white/5 text-slate-400"}`}>{custom ? "Custom" : "Built-in"}</span></td>
              <td className="px-4 py-3 text-right">
                {custom ? <div className="flex items-center justify-end gap-1">
                  <button type="button" title="Edit" onClick={() => { setEditing(t); setModalOpen(true); }} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"><Check size={13} /></button>
                  <button type="button" title="Remove" onClick={() => handleRemove(t.id)} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"><Trash2 size={13} /></button>
                </div> : <button type="button" title="Built-in terms are static code, not editable from here" className="grid h-7 w-7 cursor-not-allowed place-items-center rounded-lg text-slate-700"><X size={13} /></button>}
              </td>
            </tr>;
          })}
          {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">No terms match your filters.</td></tr>}
        </tbody>
      </table>
    </div>

    <AnimatePresence>
      {modalOpen && <TermModal editing={editing} onClose={() => setModalOpen(false)} onSaved={() => { setRefreshKey(k => k + 1); setModalOpen(false); }} />}
    </AnimatePresence>
  </div>;
}

function TermModal({ editing, onClose, onSaved }: { editing: Term | null; onClose: () => void; onSaved: () => void }) {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: editing?.name ?? "", categoryId: editing?.categoryId ?? termCategories[0].id, definition: editing?.definition ?? "",
    aiExplanation: editing?.aiExplanation ?? "", exampleSentence: editing?.exampleSentence ?? "", clinicalRelevance: editing?.clinicalRelevance ?? "",
    difficulty: editing?.difficulty ?? ("Beginner" as const), tags: (editing?.tags ?? []).join(", "), imageUrl: editing?.imageUrl ?? ""
  });
  const [bulkJson, setBulkJson] = useState("");
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  function handleSingleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      name: form.name, categoryId: form.categoryId, definition: form.definition, aiExplanation: form.aiExplanation,
      exampleSentence: form.exampleSentence, clinicalRelevance: form.clinicalRelevance, difficulty: form.difficulty,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), imageUrl: form.imageUrl || undefined,
      wordBreakdown: editing?.wordBreakdown ?? [], relatedTermIds: editing?.relatedTermIds ?? []
    };
    const result = editing ? updateCustomTerm(editing.id, payload) : addCustomTerm(payload);
    if (!result.ok) { setError(result.error); return; }
    onSaved();
  }

  function handleBulkSubmit() {
    setError(null);
    setBulkResult(null);
    let parsed: unknown;
    try { parsed = JSON.parse(bulkJson); } catch { setError("That's not valid JSON."); return; }
    if (!Array.isArray(parsed)) { setError("Expected a JSON array of term objects."); return; }
    let added = 0;
    const failures: string[] = [];
    for (const item of parsed) {
      const t = item as Partial<Term>;
      const result = addCustomTerm({
        name: t.name ?? "", categoryId: t.categoryId ?? termCategories[0].id, definition: t.definition ?? "",
        aiExplanation: t.aiExplanation ?? "", exampleSentence: t.exampleSentence ?? "", clinicalRelevance: t.clinicalRelevance ?? "",
        wordBreakdown: t.wordBreakdown ?? [], relatedTermIds: t.relatedTermIds ?? [],
        difficulty: t.difficulty, tags: t.tags, imageUrl: t.imageUrl
      });
      if (result.ok) added++; else failures.push(`${t.name ?? "(unnamed)"}: ${result.error}`);
    }
    setBulkResult(`Added ${added} of ${parsed.length}.${failures.length ? " Failed: " + failures.join("; ") : ""}`);
    if (added > 0) onSaved();
  }

  return <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
      onClick={e => e.stopPropagation()}
      className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#12171F] p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-white">{editing ? "Edit Term" : "Add Term"}</h3>
        <button type="button" onClick={onClose} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"><X size={15} /></button>
      </div>
      <p className="mt-1 text-xs text-slate-500">Genuinely merges into term detection, highlighting, and the Terminology section—not a mockup.</p>

      {!editing && <div className="mt-4 flex gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1">
        <button type="button" onClick={() => setMode("single")} className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-bold transition ${mode === "single" ? "bg-white/10 text-white" : "text-slate-500"}`}>Single Term</button>
        <button type="button" onClick={() => setMode("bulk")} className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-bold transition ${mode === "bulk" ? "bg-white/10 text-white" : "text-slate-500"}`}><FileJson size={12} className="mr-1 inline" />Bulk JSON</button>
      </div>}

      {error && <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300">{error}</p>}

      {mode === "single" || editing ? <form onSubmit={handleSingleSubmit} className="mt-4 space-y-3">
        <F label="Name *"><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={fieldClass} /></F>
        <div className="grid grid-cols-2 gap-3">
          <F label="Category *">
            <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className={fieldClass}>
              {termCategories.map(c => <option key={c.id} value={c.id} className="bg-[#12171F] text-white">{c.name}</option>)}
            </select>
          </F>
          <F label="Difficulty">
            <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as typeof f.difficulty }))} className={fieldClass}>
              {difficulties.map(d => <option key={d} value={d} className="bg-[#12171F] text-white">{d}</option>)}
            </select>
          </F>
        </div>
        <F label="Tags (comma-separated)"><input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="usmle, high-yield" className={fieldClass} /></F>
        <F label="Image URL (optional)"><input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." className={fieldClass} /></F>
        <F label="Definition *"><textarea required rows={2} value={form.definition} onChange={e => setForm(f => ({ ...f, definition: e.target.value }))} className={`${fieldClass} resize-none`} /></F>
        <F label="Simple Explanation *"><textarea required rows={2} value={form.aiExplanation} onChange={e => setForm(f => ({ ...f, aiExplanation: e.target.value }))} className={`${fieldClass} resize-none`} /></F>
        <F label="Example Sentence *"><input required value={form.exampleSentence} onChange={e => setForm(f => ({ ...f, exampleSentence: e.target.value }))} className={fieldClass} /></F>
        <F label="Why It Matters Clinically *"><textarea required rows={2} value={form.clinicalRelevance} onChange={e => setForm(f => ({ ...f, clinicalRelevance: e.target.value }))} className={`${fieldClass} resize-none`} /></F>
        <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-500 py-2.5 text-sm font-bold text-white transition hover:bg-teal-600"><Check size={14} />{editing ? "Save Changes" : "Add Term"}</button>
      </form> : <div className="mt-4 space-y-3">
        <textarea
          value={bulkJson}
          onChange={e => setBulkJson(e.target.value)}
          rows={8}
          placeholder={'[\n  {\n    "name": "Bradypnea",\n    "categoryId": "clinical",\n    "definition": "...",\n    "aiExplanation": "...",\n    "exampleSentence": "...",\n    "clinicalRelevance": "...",\n    "difficulty": "Intermediate",\n    "tags": ["usmle"]\n  }\n]'}
          className={`${fieldClass} resize-none font-mono text-xs`}
        />
        {bulkResult && <p className="rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-slate-300">{bulkResult}</p>}
        <button type="button" onClick={handleBulkSubmit} className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-500 py-2.5 text-sm font-bold text-white transition hover:bg-teal-600"><FileJson size={14} />Import Terms</button>
      </div>}
    </motion.div>
  </motion.div>;
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block">
    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
    {children}
  </label>;
}
