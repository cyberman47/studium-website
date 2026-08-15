"use client";

// Replaces the old full-page "Check your inbox" wall that used to block
// signup entirely until the confirmation link was clicked. This is the
// non-blocking version: a real check against the actual Supabase user
// (email_confirmed_at is null until they genuinely click the link Supabase
// sent—not a fabricated flag), shown as a dismissible corner prompt instead
// of gating access to the app. Mounted once in app/dashboard/layout.tsx.
import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DISMISS_KEY = "studium_email_verify_dismissed";

export function EmailVerifyPrompt() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    let cancelled = false;
    createClient().auth.getUser().then(({ data }) => {
      if (cancelled) return;
      const user = data.user;
      // A user signed in via Google/Apple already has a Google/Apple-
      // verified address—email_confirmed_at is set for them immediately,
      // so this naturally never shows for OAuth accounts, only real
      // email/password signups still pending their confirmation click.
      if (user?.email && !user.email_confirmed_at) {
        setEmail(user.email);
        setVisible(true);
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (!visible) return null;

  async function handleVerify() {
    setSending(true);
    const { error } = await createClient().auth.resend({ type: "signup", email });
    setSending(false);
    if (!error) setSent(true);
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  }

  return <div className="pointer-events-none fixed bottom-5 left-5 z-[130] max-w-sm">
    <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-100 dark:border-white/10 bg-white/95 dark:bg-[#0d1917]/95 p-4 shadow-lift backdrop-blur">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300"><Mail size={16} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-heading">Want to secure your Studium account?</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {sent ? <>Confirmation email sent to <span className="font-bold text-heading">{email}</span>—check your inbox.</> : "Verify your email so you can recover your account and access all Studium features."}
        </p>
        {!sent && <div className="mt-3 flex items-center gap-4">
          <button type="button" onClick={handleVerify} disabled={sending} className="cursor-pointer text-xs font-extrabold text-teal-600 transition hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60">{sending ? "Sending…" : "Verify email"}</button>
          <button type="button" onClick={dismiss} className="cursor-pointer text-xs font-bold text-slate-400 transition hover:text-heading">Maybe later</button>
        </div>}
      </div>
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="shrink-0 cursor-pointer rounded-full p-1 text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-heading"><X size={14} /></button>
    </div>
  </div>;
}
