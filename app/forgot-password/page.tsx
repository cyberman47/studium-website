"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";
import { Field, inputClass } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

// Sends a real Supabase password-reset email. The link inside it lands on
// /auth/callback?next=/reset-password, which exchanges the one-time code for
// a session exactly the way OAuth and email-confirmation links already do—
// /reset-password then just needs that session to let the student set a new
// password.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Enter your email address."); return; }
    setError("");
    setSubmitting(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
    });
    setSubmitting(false);
    // Supabase doesn't reveal whether the email exists either way—shown as
    // "sent" regardless so this can't be used to probe for registered
    // accounts. Only a genuine send failure (bad request, rate limit) shows
    // an error.
    if (resetError) { setError(resetError.message); return; }
    setSent(true);
  }

  if (sent) {
    return <main className="min-h-screen bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div></header><section className="container-page flex min-h-[70vh] items-center justify-center py-24 text-center"><div className="mx-auto max-w-md"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-600"><MailCheck size={30} /></span><h1 className="display mt-6 text-3xl sm:text-4xl">Check your inbox.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">If an account exists for <span className="font-bold text-heading">{email}</span>, we sent a link to reset your password. It expires shortly, so use it soon.</p><Link href="/login" className="mt-8 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">Back to log in</Link></div></section></main>;
  }

  return <main className="min-h-screen bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div></header><section className="relative py-20 sm:py-28"><div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" /><div className="container-page"><div className="mx-auto max-w-md"><span className="eyebrow"><KeyRound size={13} />Reset your password</span><h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Forgot your password?</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">Enter the email on your account and we'll send you a link to set a new one.</p><form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
    <Field label="Email" required><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@email.com" className={inputClass} /></Field>
    {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
    <button type="submit" disabled={submitting} className="w-full cursor-pointer rounded-full bg-accent-500 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">{submitting ? "Sending…" : "Send reset link"}</button>
  </form>
  <p className="mt-6 text-center text-sm text-slate-500">Remembered it after all? <Link href="/login" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Log in</Link></p></div></div></section></main>;
}
