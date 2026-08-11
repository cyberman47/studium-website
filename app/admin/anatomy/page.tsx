"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ImageOff, Plus, Trash2, X } from "lucide-react";
import { addStructure, AnatomicalStructure, ANATOMY_LIBRARY_EVENT, getStructures, removeStructure } from "@/lib/anatomyLibrary";
import { getAllCases } from "@/lib/clinicalCases";
import { getAllTerms } from "@/lib/terminology";

const fieldClass = "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40";

export default function AnatomyPage() {
  const [structures, setStructures] = useState<AnatomicalStructure[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  function refresh() { setStructures(getStructures()); }
  useEffect(() => {
    refresh();
    window.addEventListener(ANATOMY_LIBRARY_EVENT, refresh);
    return () => window.removeEventListener(ANATOMY_LIBRARY_EVENT, refresh);
  }, []);

  const allTerms = getAllTerms();
  const allCases = getAllCases();

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-extrabold text-white">Anatomy Library</h1>
        <p className="mt-1 text-xs text-slate-500">Real structures with real links to Vocabulary and Clinical Cases. Scoped down honestly from a full labeled-hotspot image editor—that's a separate, larger feature; this is image-by-URL plus real cross-references.</p>
      </div>
      <button type="button" onClick={() => setModalOpen(true)} className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-teal-600"><Plus size={14} />New Structure</button>
    </div>

    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {structures.map(s => <div key={s.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="flex h-32 items-center justify-center bg-white/[0.02]">
          {s.imageUrl ? <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" /> : <ImageOff size={22} className="text-slate-600" />}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-extrabold text-white">{s.name}</p>
            <button type="button" onClick={() => removeStructure(s.id)} className="shrink-0 cursor-pointer text-slate-500 hover:text-rose-400"><Trash2 size={13} /></button>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{s.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {s.linkedTermIds.map(id => {
              const t = allTerms.find(term => term.id === id);
              return t && <span key={id} className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-300">{t.name}</span>;
            })}
            {s.linkedCaseIds.map(id => {
              const c = allCases.find(cs => cs.id === id);
              return c && <span key={id} className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-300">{c.title}</span>;
            })}
          </div>
        </div>
      </div>)}
      {structures.length === 0 && <p className="col-span-full py-8 text-center text-xs text-slate-500">No structures yet.</p>}
    </div>

    <AnimatePresence>
      {modalOpen && <StructureModal allTerms={allTerms} allCases={allCases} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); refresh(); }} />}
    </AnimatePresence>
  </div>;
}

function StructureModal({ allTerms, allCases, onClose, onSaved }: { allTerms: ReturnType<typeof getAllTerms>; allCases: ReturnType<typeof getAllCases>; onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", imageUrl: "", description: "" });
  const [linkedTermIds, setLinkedTermIds] = useState<string[]>([]);
  const [linkedCaseIds, setLinkedCaseIds] = useState<string[]>([]);

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = addStructure({ ...form, linkedTermIds, linkedCaseIds });
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
        <h3 className="text-lg font-extrabold text-white">New Structure</h3>
        <button type="button" onClick={onClose} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"><X size={15} /></button>
      </div>
      {error && <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300">{error}</p>}
      <div className="mt-4 space-y-3">
        <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Structure name" className={fieldClass} />
        <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="Image URL" className={fieldClass} />
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Description" className={`${fieldClass} resize-none`} />
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Link Vocabulary Terms</p>
          <div className="max-h-28 space-y-1 overflow-y-auto rounded-lg border border-white/10 p-2">
            {allTerms.slice(0, 60).map(t => <label key={t.id} className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={linkedTermIds.includes(t.id)} onChange={() => toggle(linkedTermIds, setLinkedTermIds, t.id)} className="cursor-pointer accent-teal-500" />{t.name}
            </label>)}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Link Clinical Cases</p>
          <div className="max-h-28 space-y-1 overflow-y-auto rounded-lg border border-white/10 p-2">
            {allCases.map(c => <label key={c.id} className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={linkedCaseIds.includes(c.id)} onChange={() => toggle(linkedCaseIds, setLinkedCaseIds, c.id)} className="cursor-pointer accent-teal-500" />{c.title}
            </label>)}
          </div>
        </div>
      </div>
      <button type="submit" className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-500 py-2.5 text-sm font-bold text-white transition hover:bg-teal-600"><Check size={14} />Create Structure</button>
    </motion.form>
  </motion.div>;
}
