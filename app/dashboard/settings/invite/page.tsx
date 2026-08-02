"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Gift, Sparkles } from "lucide-react";
import { getUser } from "@/lib/onboarding";

export default function InviteFriendsPage() {
  const [code, setCode] = useState("STUDIUM");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = getUser();
    const base = (user?.name || "friend").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 8) || "FRIEND";
    setCode(base);
  }, []);

  const link = typeof window !== "undefined" ? `${window.location.origin}/signup?ref=${code}` : `/signup?ref=${code}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Invite friends.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Share Studium with your study group.</p>

    <div className="mt-10 max-w-xl">
      <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-lift sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="relative">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-400 text-teal-950"><Gift size={22} /></span>
          <h2 className="display mt-5 text-2xl">Your invite link</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-300">Anyone who signs up with your link gets started faster—and so do you.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <div className="min-w-0 flex-1 truncate rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white">{link}</div>
            <button type="button" onClick={copyLink} className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-600">
              {copied ? <><Check size={16} />Copied</> : <><Copy size={16} />Copy link</>}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 px-1 text-xs leading-relaxed text-slate-400">This is a demo referral link—no rewards are actually tracked or granted yet.</p>
    </div>
  </section>;
}
