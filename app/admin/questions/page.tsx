"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ImageIcon, Plus, Search, Trash2, X } from "lucide-react";
import {
  addQuestion, BankQuestion, Difficulty, getQuestions, QUESTION_BANK_EVENT, QuestionType, questionTypeLabels, removeQuestion
} from "@/lib/questionBank";

const fieldClass = "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40";
const types: QuestionType[] = ["mcq", "image", "ecg", "case", "flashcard"];
const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | QuestionType>("all");
  const [modalOpen, setModalOpen] = useState(false);

  function refresh() { setQuestions(getQuestions()); }
  useEffect(() => {
    refresh();
    window.addEventListener(QUESTION_BANK_EVENT, refresh);
    return () => window.removeEventListener(QUESTION_BANK_EVENT, refresh);
  }, []);

  const filtered = questions.filter(q => {
    const matchesQuery = q.question.toLowerCase().includes(query.trim().toLowerCase()) || q.category.toLowerCase().includes(query.trim().toLowerCase());
    const matchesType = typeFilter === "all" || q.type === typeFilter;
    return matchesQuery && matchesType;
  });

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-extrabold text-white">Question Bank</h1>
        <p className="mt-1 text-xs text-slate-500">Real, persisted question authoring—MCQ, image-based, ECG, case-based, and flashcard types. Not yet wired to a student quiz flow (that's a separate build); this is the real authoring half.</p>
      </div>
      <button type="button" onClick={() => setModalOpen(true)} className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-teal-600"><Plus size={14} />New Question</button>
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search questions..." className="w-56 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40" />
      </div>
      <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)} className="cursor-pointer rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-3 pr-8 text-sm text-white outline-none transition focus:border-teal-500/40">
        <option value="all" className="bg-[#12171F] text-white">All Types</option>
        {types.map(t => <option key={t} value={t} className="bg-[#12171F] text-white">{questionTypeLabels[t]}</option>)}
      </select>
    </div>

    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-2.5">Question</th>
            <th className="px-4 py-2.5">Type</th>
            <th className="px-4 py-2.5">Category</th>
            <th className="px-4 py-2.5">Difficulty</th>
            <th className="px-4 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(q => <tr key={q.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
            <td className="max-w-sm truncate px-4 py-3 font-bold text-white">{q.imageUrl && <ImageIcon size={12} className="mr-1 inline text-slate-500" />}{q.question}</td>
            <td className="px-4 py-3 text-slate-400">{questionTypeLabels[q.type]}</td>
            <td className="px-4 py-3 text-slate-400">{q.category}</td>
            <td className="px-4 py-3"><span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-extrabold text-slate-300">{q.difficulty}</span></td>
            <td className="px-4 py-3 text-right">
              <button type="button" title="Delete" onClick={() => removeQuestion(q.id)} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"><Trash2 size={13} /></button>
            </td>
          </tr>)}
          {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">No questions yet—add one to build the bank.</td></tr>}
        </tbody>
      </table>
    </div>

    <AnimatePresence>
      {modalOpen && <QuestionModal onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); refresh(); }} />}
    </AnimatePresence>
  </div>;
}

function QuestionModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "mcq" as QuestionType, category: "", difficulty: "Beginner" as Difficulty, question: "",
    imageUrl: "", options: ["", "", "", ""], correctIndex: 0, explanation: ""
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = addQuestion({
      type: form.type, category: form.category || "General", difficulty: form.difficulty, question: form.question,
      imageUrl: form.imageUrl || undefined, options: form.type === "flashcard" ? [] : form.options.filter(o => o.trim()),
      correctIndex: form.type === "flashcard" ? -1 : form.correctIndex, explanation: form.explanation
    });
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
        <h3 className="text-lg font-extrabold text-white">New Question</h3>
        <button type="button" onClick={onClose} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"><X size={15} /></button>
      </div>

      {error && <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300">{error}</p>}

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <F label="Type">
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as QuestionType }))} className={fieldClass}>
              {types.map(t => <option key={t} value={t} className="bg-[#12171F] text-white">{questionTypeLabels[t]}</option>)}
            </select>
          </F>
          <F label="Category"><input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Cardiology" className={fieldClass} /></F>
          <F label="Difficulty">
            <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Difficulty }))} className={fieldClass}>
              {difficulties.map(d => <option key={d} value={d} className="bg-[#12171F] text-white">{d}</option>)}
            </select>
          </F>
        </div>
        {(form.type === "image" || form.type === "ecg") && <F label="Image URL"><input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." className={fieldClass} /></F>}
        <F label="Question *"><textarea required rows={2} value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} className={`${fieldClass} resize-none`} /></F>
        {form.type !== "flashcard" && <F label="Answer Options (mark the correct one)">
          <div className="space-y-1.5">
            {form.options.map((opt, i) => <div key={i} className="flex items-center gap-2">
              <input type="radio" name="qCorrectIndex" checked={form.correctIndex === i} onChange={() => setForm(f => ({ ...f, correctIndex: i }))} className="cursor-pointer accent-teal-500" />
              <input value={opt} onChange={e => setForm(f => ({ ...f, options: f.options.map((o, idx) => idx === i ? e.target.value : o) }))} placeholder={`Option ${i + 1}`} className={fieldClass} />
            </div>)}
          </div>
        </F>}
        <F label="Explanation *"><textarea required rows={2} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} className={`${fieldClass} resize-none`} /></F>
      </div>

      <button type="submit" className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-500 py-2.5 text-sm font-bold text-white transition hover:bg-teal-600"><Check size={14} />Add Question</button>
    </motion.form>
  </motion.div>;
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block">
    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
    {children}
  </label>;
}
