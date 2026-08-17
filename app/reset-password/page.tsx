"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";
import { PasswordField } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

// Lands here only after /auth/callback has already exchanged the recovery
// link's one-time code for a real session—that session is what makes
// updateUser({ password }) below allowed to act on this account without
// re-asking for the old password. If someone opens this URL cold (no
// session), there's nothing valid to update, so it just points them back to
// requesting a fresh link instead of showing a form that would only fail.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecking(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    setError("");
    setSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    // The recovery session is single-purpose—drop it once the password is
    // changed so the student logs back in with the new one rather than
    // silently staying signed in from a link they may have opened on a
    // shared or borrowed device.
    if (!updateError) await supabase.auth.signOut();
    setSubmitting(false);
    if (updateError) { setError(updateError.message); return; }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  const shell = (children: React.ReactNode) => <main className="min-h-screen bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div></header>{children}</main>;

  if (checking) return shell(<section className="container-page flex min-h-[70vh] items-center justify-center py-24" />);

  if (!hasSession) {
    return shell(<section className="container-page flex min-h-[70vh] items-center justify-center py-24 text-center"><div className="mx-auto max-w-md"><h1 className="display mt-6 text-3xl sm:text-4xl">This link isn't valid.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">Password reset links expire after a while, or this one may have already been used. Request a new one to keep going.</p><Link href="/forgot-password" className="mt-8 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">Request a new link</Link></div></section>);
  }

  if (success) {
    return shell(<section className="container-page flex min-h-[70vh] items-center justify-center py-24 text-center"><div className="mx-auto max-w-md"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-600"><ShieldCheck size={30} /></span><h1 className="display mt-6 text-3xl sm:text-4xl">Password updated.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">Taking you to log in with your new password…</p></div></section>);
  }

  return shell(<section className="relative py-20 sm:py-28"><div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" /><div className="container-page"><div className="mx-auto max-w-md"><span className="eyebrow"><ShieldCheck size={13} />Almost done</span><h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Set a new password.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">Choose something you haven't used on Studium before.</p><form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
    <PasswordField label="New password" required value={password} onChange={setPassword} placeholder="At least 8 characters" autoComplete="new-password" />
    <PasswordField label="Confirm new password" required value={confirmPassword} onChange={setConfirmPassword} placeholder="Type it again" autoComplete="new-password" />
    {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
    <button type="submit" disabled={submitting} className="w-full cursor-pointer rounded-full bg-accent-500 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">{submitting ? "Updating…" : "Update password"}</button>
  </form></div></div></section>);
}
