"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Gift, Sparkles } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";
import { Field, inputClass } from "@/components/ui";

const tiers: { label: string; price: number; blurb: string; popular?: boolean }[] = [
  { label: "1 Month", price: 12, blurb: "A perfect nudge to get started." },
  { label: "3 Months", price: 30, blurb: "Enough time to build a real habit.", popular: true },
  { label: "12 Months", price: 96, blurb: "A full year of confident studying." }
];

export default function GiftCardsPage() {
  const [tier, setTier] = useState<(typeof tiers)[number]>(tiers[1]);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [yourName, setYourName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recipientName || !recipientEmail || !yourName) { setError("Recipient name, recipient email, and your name are required."); return; }
    setError("");
    setSubmitting(true);
    // No payment processor is connected yet, so this simulates the round trip.
    // Swap this block for a real checkout flow when one exists.
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return <main className="min-h-screen bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div></header><section className="container-page flex min-h-[70vh] items-center justify-center py-24 text-center"><div className="mx-auto max-w-md"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-50 text-accent-500"><CheckCircle2 size={30} /></span><h1 className="display mt-6 text-3xl sm:text-4xl">Your gift is on its way.</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">A {tier.label} gift card (€{tier.price}) is headed to {recipientName} at {recipientEmail}, from {yourName}.</p><Link href="/" className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-accent-600">Back to home</Link></div></section></main>;
  }

  return <main className="min-h-screen bg-[#fcfdfd]">
    <LanguageBar />
    <header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div>
    </header>

    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_50%_0%,#d1fae5,transparent_65%)]" />
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow"><Gift size={13} />Gift cards</span>
          <h1 className="display mt-6 text-5xl leading-[.98] sm:text-6xl">Give the gift of learning.</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">Studium, sent with a personal note. Perfect for a future clinician working toward something big.</p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
            <span className="mb-3 block text-xs font-extrabold text-slate-600">Choose an amount</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {tiers.map(t => <button type="button" key={t.label} onClick={() => setTier(t)} className={`relative cursor-pointer rounded-2xl border p-4 text-left transition ${tier.label === t.label ? "border-accent-500 bg-accent-50" : "border-slate-200 bg-white hover:border-accent-200"}`}>
                {t.popular && <span className="absolute -top-2.5 right-3 rounded-full bg-accent-500 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">Popular</span>}
                <p className="text-xs font-bold text-slate-500">{t.label}</p>
                <p className="display mt-1 text-2xl">€{t.price}</p>
                <p className="mt-1 text-xs text-slate-500">{t.blurb}</p>
              </button>)}
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Recipient's name" required><input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Jane Doe" className={inputClass} /></Field>
              <Field label="Recipient's email" required><input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder="jane@email.com" className={inputClass} /></Field>
              <Field label="Your name" required><input value={yourName} onChange={e => setYourName(e.target.value)} placeholder="Your name" className={inputClass} /></Field>
            </div>
            <div className="mt-5"><Field label="Personal message"><textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Add a note (optional)" className={`${inputClass} resize-none`} /></Field></div>

            {error && <p className="mt-4 text-xs font-bold text-rose-600">{error}</p>}
            <button type="submit" disabled={submitting} className="mt-7 w-full cursor-pointer rounded-full bg-accent-500 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">{submitting ? "Sending…" : `Send ${tier.label} gift · €${tier.price}`}</button>
          </form>
        </div>
      </div>
    </section>
  </main>;
}
