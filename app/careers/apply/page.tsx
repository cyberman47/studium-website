"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, Sparkles, UploadCloud, X } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";
import { Field, inputClass } from "@/components/ui";

const MAX_FILE_MB = 10;
const ACCEPTED = [".pdf", ".doc", ".docx"];

export default function ApplyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function pickFile(f: File | undefined | null) {
    if (!f) return;
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) { setError("Please upload a PDF or Word document."); return; }
    if (f.size > MAX_FILE_MB * 1024 * 1024) { setError(`File must be under ${MAX_FILE_MB}MB.`); return; }
    setError("");
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !file) { setError("Name, email, and a CV are required."); return; }
    setError("");
    setSubmitting(true);
    // No backend is connected yet, so this simulates the round trip.
    // Swap this block for a real fetch() to an application-handling endpoint when one exists.
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return <main className="min-h-screen bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/careers" className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to careers</Link></div></header><section className="container-page flex min-h-[70vh] items-center justify-center py-24 text-center"><div className="mx-auto max-w-md"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-600"><CheckCircle2 size={30} /></span><h1 className="display mt-6 text-3xl sm:text-4xl">Application received.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">Thanks for applying to Studium, {name.split(" ")[0]}. We'll review your application and get back to you at {email} soon.</p><Link href="/careers" className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-accent-600">Back to open roles</Link></div></section></main>;
  }

  return <main className="min-h-screen bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/careers" className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to careers</Link></div></header><section className="relative py-20 sm:py-28"><div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" /><div className="container-page"><div className="mx-auto max-w-2xl"><span className="eyebrow"><Sparkles size={13} />Director of Online Marketing</span><h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Tell us about you.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">A few details and your CV is all we need to get started.</p><form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Full name" required><input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} /></Field>
      <Field label="Email" required><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@email.com" className={inputClass} /></Field>
      <Field label="Phone"><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional" className={inputClass} /></Field>
      <Field label="LinkedIn / portfolio"><input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="Optional" className={inputClass} /></Field>
    </div>
    <Field label="Why you?"><textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="A short note about why you're a great fit (optional)" className={`${inputClass} resize-none`} /></Field>
    <Field label="CV / resume" required>
      {!file ? <label onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]); }} className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-[#f9fcfc] px-6 py-8 text-center transition hover:border-teal-300 hover:bg-teal-50/40">
        <UploadCloud size={22} className="text-teal-500" />
        <span className="text-sm font-bold text-slate-600">Click to upload or drag and drop</span>
        <span className="text-xs text-slate-500">PDF or Word, up to {MAX_FILE_MB}MB</span>
        <input ref={fileInput} type="file" accept={ACCEPTED.join(",")} onChange={e => pickFile(e.target.files?.[0])} className="hidden" />
      </label> : <div className="flex items-center justify-between rounded-2xl border border-teal-100 bg-teal-50/50 px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-teal-600"><FileText size={17} /></span><div><p className="text-xs font-extrabold text-ink">{file.name}</p><p className="text-[10px] text-slate-500">{(file.size / 1024 / 1024).toFixed(1)}MB</p></div></div><button type="button" onClick={() => { setFile(null); if (fileInput.current) fileInput.current.value = ""; }} className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-slate-500 hover:bg-white hover:text-slate-600"><X size={15} /></button></div>}
    </Field>
    {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
    <button type="submit" disabled={submitting} className="w-full cursor-pointer rounded-full bg-accent-500 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">{submitting ? "Submitting…" : "Submit application"}</button>
  </form></div></div></section></main>;
}
