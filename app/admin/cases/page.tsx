"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Eye, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import {
  addCustomCase, ClinicalCase, clinicalCases, CUSTOM_CASES_EVENT, getAllCases, getCaseOfTheDay, getCaseOverride,
  getNextScheduledDate, isCustomCase, removeCustomCase, setCaseOverride, updateCustomCase
} from "@/lib/clinicalCases";
import { FEATURE_FLAGS_EVENT, isFlagEnabled } from "@/lib/featureFlags";

const fieldClass = "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40";
const difficultyClasses: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20"
};

export default function CasesPage() {
  const [query, setQuery] = useState("");
  const [previewCase, setPreviewCase] = useState<ClinicalCase | null>(null);
  const [editingCase, setEditingCase] = useState<ClinicalCase | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [override, setOverride] = useState<string | null>(null);
  const [todaysCase, setTodaysCase] = useState<ClinicalCase | null>(null);
  const [allCases, setAllCases] = useState<ClinicalCase[]>(clinicalCases);
  const [editorEnabled, setEditorEnabled] = useState(true);

  function refresh() {
    setOverride(getCaseOverride());
    setTodaysCase(getCaseOfTheDay());
    setAllCases(getAllCases());
    setEditorEnabled(isFlagEnabled("admin_case_editor"));
  }

  useEffect(() => {
    refresh();
    window.addEventListener(CUSTOM_CASES_EVENT, refresh);
    window.addEventListener(FEATURE_FLAGS_EVENT, refresh);
    return () => {
      window.removeEventListener(CUSTOM_CASES_EVENT, refresh);
      window.removeEventListener(FEATURE_FLAGS_EVENT, refresh);
    };
  }, []);

  function handleSwap(caseId: string) { setCaseOverride(caseId); refresh(); }
  function handleClearOverride() { setCaseOverride(null); refresh(); }
  function handleRemove(caseId: string) { removeCustomCase(caseId); refresh(); }

  const filtered = allCases.filter(c =>
    c.title.toLowerCase().includes(query.trim().toLowerCase()) || c.category.toLowerCase().includes(query.trim().toLowerCase())
  );

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-extrabold text-white">Clinical Cases</h1>
        <p className="mt-1 text-xs text-slate-500">{editorEnabled ? "Real case editor—created/edited cases genuinely enter the daily rotation." : "Case editor is disabled via Feature Management."}</p>
      </div>
      {editorEnabled && <button type="button" onClick={() => { setEditingCase(null); setModalOpen(true); }} className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-teal-600"><Plus size={14} />New Case</button>}
    </div>

    {override && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
      <div className="flex items-center gap-2 text-sm font-bold text-amber-300"><AlertTriangle size={15} />Override active — today's case is manually forced, real for every page reading it.</div>
      <button type="button" onClick={handleClearOverride} className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/10"><RotateCcw size={12} />Revert to automatic rotation</button>
    </div>}

    <div className="relative mt-4 max-w-sm">
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search cases..." className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40" />
    </div>

    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-2.5">ID</th>
            <th className="px-4 py-2.5">Title</th>
            <th className="px-4 py-2.5">Specialty</th>
            <th className="px-4 py-2.5">Difficulty</th>
            <th className="px-4 py-2.5">Scheduled</th>
            <th className="px-4 py-2.5">Status</th>
            <th className="px-4 py-2.5">Source</th>
            <th className="px-4 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => {
            const isActive = todaysCase?.id === c.id;
            const nextDate = getNextScheduledDate(c.id);
            const custom = isCustomCase(c.id);
            return <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{c.id}</td>
              <td className="px-4 py-3 font-bold text-white">{c.title}</td>
              <td className="px-4 py-3 text-slate-400">{c.category}</td>
              <td className="px-4 py-3"><span className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${difficultyClasses[c.difficulty]}`}>{c.difficulty}</span></td>
              <td className="px-4 py-3 text-slate-400">{isActive ? "Today" : nextDate ? nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</td>
              <td className="px-4 py-3">
                <span className={`flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${isActive ? "bg-teal-500/15 text-teal-400" : "bg-white/5 text-slate-400"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-teal-400" : "bg-slate-500"}`} />{isActive ? "Active" : "Scheduled"}
                </span>
              </td>
              <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${custom ? "bg-violet-500/15 text-violet-300" : "bg-white/5 text-slate-400"}`}>{custom ? "Custom" : "Built-in"}</span></td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  <button type="button" title="Preview Case" onClick={() => setPreviewCase(c)} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"><Eye size={14} /></button>
                  {custom && editorEnabled ? <>
                    <button type="button" title="Edit" onClick={() => { setEditingCase(c); setModalOpen(true); }} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"><Check size={13} /></button>
                    <button type="button" title="Delete" onClick={() => handleRemove(c.id)} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"><Trash2 size={13} /></button>
                  </> : <button type="button" title="Built-in cases are static code, not editable from here" className="grid h-7 w-7 cursor-not-allowed place-items-center rounded-lg text-slate-700"><X size={14} /></button>}
                  <button
                    type="button" title="Trigger Today's Swap" onClick={() => handleSwap(c.id)} disabled={isActive}
                    className="cursor-pointer rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300 transition hover:border-teal-500/40 hover:text-teal-300 disabled:cursor-default disabled:opacity-30"
                  >Swap</button>
                </div>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>

    <AnimatePresence>
      {previewCase && <PreviewModal caseData={previewCase} onClose={() => setPreviewCase(null)} />}
      {modalOpen && <CaseModal editing={editingCase} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); refresh(); }} />}
    </AnimatePresence>
  </div>;
}

function PreviewModal({ caseData, onClose }: { caseData: ClinicalCase; onClose: () => void }) {
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{caseData.category} · {caseData.difficulty}</p>
          <h3 className="mt-1 text-lg font-extrabold text-white">{caseData.title}</h3>
        </div>
        <button type="button" onClick={onClose} className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"><X size={15} /></button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{caseData.stem}</p>
      <p className="mt-4 text-sm font-bold text-white">{caseData.question}</p>
      <div className="mt-2 space-y-1.5">
        {caseData.options.map((opt, i) => <div key={i} className={`rounded-lg border px-3 py-2 text-xs ${i === caseData.correctIndex ? "border-teal-500/30 bg-teal-500/10 text-teal-300" : "border-white/10 text-slate-400"}`}>{opt}{i === caseData.correctIndex ? " ✓" : ""}</div>)}
      </div>
      <p className="mt-4 rounded-lg bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-400">{caseData.explanation}</p>
    </motion.div>
  </motion.div>;
}

function CaseModal({ editing, onClose, onSaved }: { editing: ClinicalCase | null; onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: editing?.title ?? "", category: editing?.category ?? "Cardiology", difficulty: editing?.difficulty ?? ("Beginner" as const),
    stem: editing?.stem ?? "", question: editing?.question ?? "", explanation: editing?.explanation ?? "",
    options: editing?.options ?? ["", "", "", ""], correctIndex: editing?.correctIndex ?? 0
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = { ...form, options: form.options.filter(o => o.trim()) };
    const result = editing ? updateCustomCase(editing.id, payload) : addCustomCase(payload);
    if (!result.ok) { setError(result.error); return; }
    onSaved();
  }

  function updateOption(i: number, value: string) {
    setForm(f => ({ ...f, options: f.options.map((o, idx) => idx === i ? value : o) }));
  }

  return <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
  >
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
      onClick={e => e.stopPropagation()}
      className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#12171F] p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-white">{editing ? "Edit Case" : "New Clinical Case"}</h3>
        <button type="button" onClick={onClose} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"><X size={15} /></button>
      </div>
      <p className="mt-1 text-xs text-slate-500">Real cases—genuinely enters the daily rotation and every place that reads it.</p>

      {error && <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300">{error}</p>}

      <div className="mt-4 space-y-3">
        <F label="Title *"><input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={fieldClass} /></F>
        <div className="grid grid-cols-2 gap-3">
          <F label="Specialty *"><input required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={fieldClass} /></F>
          <F label="Difficulty *">
            <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as typeof f.difficulty }))} className={fieldClass}>
              <option className="bg-[#12171F] text-white">Beginner</option>
              <option className="bg-[#12171F] text-white">Intermediate</option>
              <option className="bg-[#12171F] text-white">Advanced</option>
            </select>
          </F>
        </div>
        <F label="Case Stem *"><textarea required rows={3} value={form.stem} onChange={e => setForm(f => ({ ...f, stem: e.target.value }))} className={`${fieldClass} resize-none`} /></F>
        <F label="Question *"><input required value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} className={fieldClass} /></F>
        <F label="Answer Options * (mark the correct one)">
          <div className="space-y-1.5">
            {form.options.map((opt, i) => <div key={i} className="flex items-center gap-2">
              <input type="radio" name="correctIndex" checked={form.correctIndex === i} onChange={() => setForm(f => ({ ...f, correctIndex: i }))} className="cursor-pointer accent-teal-500" />
              <input value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} className={fieldClass} />
            </div>)}
          </div>
        </F>
        <F label="Explanation *"><textarea required rows={3} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} className={`${fieldClass} resize-none`} /></F>
      </div>

      <button type="submit" className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-500 py-2.5 text-sm font-bold text-white transition hover:bg-teal-600"><Check size={14} />{editing ? "Save Changes" : "Create Case"}</button>
    </motion.form>
  </motion.div>;
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block">
    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
    {children}
  </label>;
}
