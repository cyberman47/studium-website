"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";
import { Field, inputClass, OAuthButtons } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Email and password are required."); return; }
    setError("");
    setSubmitting(true);
    // No backend is connected yet, so this simulates the round trip.
    // Swap this block for a real fetch() to an auth endpoint when one exists.
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return <main className="min-h-screen bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div></header><section className="container-page flex min-h-[70vh] items-center justify-center py-24 text-center"><div className="mx-auto max-w-md"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-600"><CheckCircle2 size={30} /></span><h1 className="display mt-6 text-3xl sm:text-4xl">Welcome back.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">You're signed in as {email}.</p><Link href="/" className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-accent-600">Back to home</Link></div></section></main>;
  }

  return <main className="min-h-screen bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div></header><section className="relative py-20 sm:py-28"><div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" /><div className="container-page"><div className="mx-auto max-w-md"><span className="eyebrow"><Sparkles size={13} />Welcome back</span><h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Log in to Studium.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">Pick up your study plan right where you left off.</p><form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
    <Field label="Email" required><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@email.com" className={inputClass} /></Field>
    <Field label="Password" required><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" className={inputClass} /></Field>
    {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
    <button type="submit" disabled={submitting} className="w-full cursor-pointer rounded-full bg-accent-500 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">{submitting ? "Logging in…" : "Log in"}</button>
  </form>
  <OAuthButtons actionLabel="Log in" />
  <p className="mt-6 text-center text-sm text-slate-500">Don't have an account? <Link href="/signup" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Sign up</Link></p></div></div></section></main>;
}
