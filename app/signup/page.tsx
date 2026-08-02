"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";
import { Field, inputClass, OAuthButtons } from "@/components/ui";
import { saveUser } from "@/lib/onboarding";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError("Name, email, and password are required."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setSubmitting(true);
    // No backend is connected yet, so this simulates the round trip.
    // Swap this block for a real fetch() to an auth endpoint when one exists.
    await new Promise(r => setTimeout(r, 900));
    saveUser(name, email);
    router.push("/onboarding");
  }

  return <main className="min-h-screen bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div></header><section className="relative py-20 sm:py-28"><div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" /><div className="container-page"><div className="mx-auto max-w-md"><span className="eyebrow"><Sparkles size={13} />Join Studium</span><h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Start learning for free.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">Create your account and get your first personalized study plan in minutes.</p><form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
    <Field label="Full name" required><input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} /></Field>
    <Field label="Email" required><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@email.com" className={inputClass} /></Field>
    <Field label="Password" required><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" className={inputClass} /></Field>
    {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
    <button type="submit" disabled={submitting} className="w-full cursor-pointer rounded-full bg-accent-500 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">{submitting ? "Creating account…" : "Create free account"}</button>
    <p className="text-center text-[11px] leading-relaxed text-slate-500">By creating an account, you agree to our Terms and Privacy Policy.</p>
  </form>
  <OAuthButtons actionLabel="Sign up" />
  <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Log in</Link></p></div></div></section></main>;
}
