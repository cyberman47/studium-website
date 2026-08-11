"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import {
  addPromptTemplate, AiSettings, getAiSettings, getPromptTemplates, PromptTemplate, removePromptTemplate, setAiSettings
} from "@/lib/aiConfig";

const fieldClass = "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40";

export default function AiManagementPage() {
  const [settings, setSettings] = useState<AiSettings>({ tone: "encouraging", explanationLength: "medium", allowHints: true });
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [form, setForm] = useState({ name: "", scenario: "", template: "" });

  function refresh() { setSettings(getAiSettings()); setPrompts(getPromptTemplates()); }
  useEffect(() => { refresh(); }, []);

  function handleSettingChange(patch: Partial<AiSettings>) {
    setAiSettings(patch);
    refresh();
  }

  function handleAddPrompt(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.template.trim()) return;
    addPromptTemplate(form);
    setForm({ name: "", scenario: "", template: "" });
    refresh();
  }

  return <div>
    <h1 className="text-lg font-extrabold text-white">AI Management</h1>

    <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
      <div>
        <p className="text-sm font-bold text-amber-300">Not connected to a live model</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">/dashboard/ai-tutor is an explicit "isn't connected yet" placeholder—there's no real AI backend in this app today. Settings and prompts below are real, persisted config (not fabricated), built as the surface a future live integration would read from—so wiring one in later is "point the tutor at this config," not another ground-up build. There's no usage to monitor because there's no real usage yet, so no fake charts are shown here.</p>
      </div>
    </div>

    <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Tutor Settings</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-[11px] font-bold text-slate-500">Tone</span>
          <select value={settings.tone} onChange={e => handleSettingChange({ tone: e.target.value as AiSettings["tone"] })} className={fieldClass}>
            <option value="concise" className="bg-[#12171F] text-white">Concise</option>
            <option value="encouraging" className="bg-[#12171F] text-white">Encouraging</option>
            <option value="clinical" className="bg-[#12171F] text-white">Clinical</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-bold text-slate-500">Explanation Length</span>
          <select value={settings.explanationLength} onChange={e => handleSettingChange({ explanationLength: e.target.value as AiSettings["explanationLength"] })} className={fieldClass}>
            <option value="short" className="bg-[#12171F] text-white">Short</option>
            <option value="medium" className="bg-[#12171F] text-white">Medium</option>
            <option value="long" className="bg-[#12171F] text-white">Long</option>
          </select>
        </label>
        <label className="flex items-end gap-2 pb-2">
          <input type="checkbox" checked={settings.allowHints} onChange={e => handleSettingChange({ allowHints: e.target.checked })} className="cursor-pointer accent-teal-500" />
          <span className="text-sm text-slate-300">Allow hints</span>
        </label>
      </div>
    </div>

    <div className="mt-6">
      <h2 className="text-sm font-bold text-white">Prompt Library <span className="font-normal text-slate-500">— {prompts.length} templates</span></h2>
      <form onSubmit={handleAddPrompt} className="mt-3 grid gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[1fr_1fr_2fr_auto]">
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className={fieldClass} />
        <input value={form.scenario} onChange={e => setForm(f => ({ ...f, scenario: e.target.value }))} placeholder="Scenario (e.g. Term explanation)" className={fieldClass} />
        <input value={form.template} onChange={e => setForm(f => ({ ...f, template: e.target.value }))} placeholder="Explain {{term}} simply for a med student..." className={fieldClass} />
        <button type="submit" className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-500 px-3 py-2 text-xs font-bold text-white hover:bg-teal-600"><Plus size={13} />Add</button>
      </form>
      <div className="mt-3 space-y-2">
        {prompts.map(p => <div key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">{p.name} <span className="ml-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-400">{p.scenario}</span></p>
            <p className="mt-1 truncate font-mono text-xs text-slate-500">{p.template}</p>
          </div>
          <button type="button" onClick={() => { removePromptTemplate(p.id); refresh(); }} className="shrink-0 cursor-pointer text-slate-500 hover:text-rose-400"><Trash2 size={14} /></button>
        </div>)}
        {prompts.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No prompt templates yet.</p>}
      </div>
    </div>
  </div>;
}
