"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Check, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { addReference, getReferences, MedicalReference, REFERENCES_EVENT, ReferenceType, referenceTypeLabels, removeReference } from "@/lib/references";
import { getAllCases } from "@/lib/clinicalCases";
import { getAllTerms } from "@/lib/terminology";

const fieldClass = "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40";
const types: ReferenceType[] = ["textbook", "paper", "guideline", "other"];

export default function ReferencesPage() {
  const [refs, setRefs] = useState<MedicalReference[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  function refresh() { setRefs(getReferences()); }
  useEffect(() => {
    refresh();
    window.addEventListener(REFERENCES_EVENT, refresh);
    return () => window.removeEventListener(REFERENCES_EVENT, refresh);
  }, []);

  const allTerms = getAllTerms();
  const allCases = getAllCases();

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-extrabold text-white">Reference Database</h1>
        <p className="mt-1 text-xs text-slate-500">Real sources, genuinely linkable to specific terms and cases—no citation lookup service is connected, so entries are admin-typed like everything else here.</p>
      </div>
      <button type="button" onClick={() => setModalOpen(true)} className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-teal-600"><Plus size={14} />Add Reference</button>
    </div>

    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-2.5">Title</th>
            <th className="px-4 py-2.5">Type</th>
            <th className="px-4 py-2.5">Source</th>
            <th className="px-4 py-2.5">Linked To</th>
            <th className="px-4 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {refs.map(r => <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
            <td className="px-4 py-3 font-bold text-white">{r.title} {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="ml-1 inline-block text-slate-500 hover:text-teal-400"><ExternalLink size={11} /></a>}</td>
            <td className="px-4 py-3"><span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-extrabold text-slate-300">{referenceTypeLabels[r.type]}</span></td>
            <td className="px-4 py-3 text-slate-400">{r.authorsOrSource}</td>
            <td className="px-4 py-3 text-slate-500">{r.linkedTermIds.length + r.linkedCaseIds.length} item(s)</td>
            <td className="px-4 py-3 text-right"><button type="button" onClick={() => removeReference(r.id)} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"><Trash2 size={13} /></button></td>
          </tr>)}
          {refs.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500 flex items-center justify-center gap-2"><BookOpen size={14} />No references yet.</td></tr>}
        </tbody>
      </table>
    </div>

    <AnimatePresence>
      {modalOpen && <ReferenceModal allTerms={allTerms} allCases={allCases} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); refresh(); }} />}
    </AnimatePresence>
  </div>;
}

function ReferenceModal({ allTerms, allCases, onClose, onSaved }: { allTerms: ReturnType<typeof getAllTerms>; allCases: ReturnType<typeof getAllCases>; onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ type: "textbook" as ReferenceType, title: "", authorsOrSource: "", url: "" });
  const [linkedTermIds, setLinkedTermIds] = useState<string[]>([]);
  const [linkedCaseIds, setLinkedCaseIds] = useState<string[]>([]);

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = addReference({ ...form, url: form.url || undefined, linkedTermIds, linkedCaseIds });
    if (!result.ok) { setError(result.error); return; }
    onSaved();
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
        <h3 className="text-lg font-extrabold text-white">Add Reference</h3>
        <button type="button" onClick={onClose} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"><X size={15} /></button>
      </div>
      {error && <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300">{error}</p>}
      <div className="mt-4 space-y-3">
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ReferenceType }))} className={fieldClass}>
          {types.map(t => <option key={t} value={t} className="bg-[#12171F] text-white">{referenceTypeLabels[t]}</option>)}
        </select>
        <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className={fieldClass} />
        <input value={form.authorsOrSource} onChange={e => setForm(f => ({ ...f, authorsOrSource: e.target.value }))} placeholder="Authors / Source" className={fieldClass} />
        <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="URL (optional)" className={fieldClass} />
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Link Terms</p>
          <div className="max-h-28 space-y-1 overflow-y-auto rounded-lg border border-white/10 p-2">
            {allTerms.slice(0, 60).map(t => <label key={t.id} className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={linkedTermIds.includes(t.id)} onChange={() => toggle(linkedTermIds, setLinkedTermIds, t.id)} className="cursor-pointer accent-teal-500" />{t.name}
            </label>)}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Link Cases</p>
          <div className="max-h-28 space-y-1 overflow-y-auto rounded-lg border border-white/10 p-2">
            {allCases.map(c => <label key={c.id} className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={linkedCaseIds.includes(c.id)} onChange={() => toggle(linkedCaseIds, setLinkedCaseIds, c.id)} className="cursor-pointer accent-teal-500" />{c.title}
            </label>)}
          </div>
        </div>
      </div>
      <button type="submit" className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-500 py-2.5 text-sm font-bold text-white transition hover:bg-teal-600"><Check size={14} />Add Reference</button>
    </motion.form>
  </motion.div>;
}
