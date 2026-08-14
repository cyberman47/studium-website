"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check, ChevronRight, Copy, Crown, Mail, MessageCircle, MessageSquare, PartyPopper, Share2, Sparkles, Users
} from "lucide-react";
import {
  claimReferralReward, getMyReferralCode, getReferralLink, getReferralProgress, isReferralProActive,
  ReferralEntry, ReferralProgress, REFERRALS_PER_MONTH
} from "@/lib/referrals";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export default function ReferAndEarnPage() {
  const [code, setCode] = useState<string | null>(null);
  const [progress, setProgress] = useState<ReferralProgress | null>(null);
  const [copied, setCopied] = useState(false);
  const [justEarnedMonths, setJustEarnedMonths] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [c, p] = await Promise.all([getMyReferralCode(), getReferralProgress()]);
      if (cancelled) return;
      setCode(c);
      setProgress(p);
      // Opportunistic claim: if this load reveals newly-earned months (real
      // server-side count, not a client guess), grant them now and show the
      // celebration once. Safe to call every load—see claim_referral_reward's
      // own idempotency note in supabase/migrations/0005_referrals.sql.
      if (p.signedIn && p.monthsEarned > 0) {
        const result = await claimReferralReward();
        if (!cancelled && result && result.monthsClaimed > 0) {
          setJustEarnedMonths(result.monthsClaimed);
          setProgress(prev => prev ? { ...prev, proUntil: result.proUntil } : prev);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const link = code ? getReferralLink(code) : null;
  const eligibleCount = progress?.eligibleCount ?? 0;
  const monthsEarned = progress?.monthsEarned ?? 0;
  const inCycle = eligibleCount % REFERRALS_PER_MONTH;
  const remaining = REFERRALS_PER_MONTH - inCycle;
  const cyclePercent = Math.round((inCycle / REFERRALS_PER_MONTH) * 100);
  const proActive = isReferralProActive(progress?.proUntil ?? null);

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable—Copy button label just won't flip to "Copied!" */ }
  }

  async function nativeShare() {
    if (!link) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "Join me on Studium", text: "I've been using Studium to study smarter—join me:", url: link }); }
      catch { /* user cancelled the native share sheet—not an error */ }
    } else {
      copyLink();
    }
  }

  const shareOptions = link ? [
    { label: "Copy Link", icon: Copy, action: copyLink },
    { label: "WhatsApp", icon: MessageCircle, action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on Studium: ${link}`)}`, "_blank") },
    { label: "Messages", icon: MessageSquare, action: () => window.open(`sms:?&body=${encodeURIComponent(`Join me on Studium: ${link}`)}`, "_self") },
    { label: "Email", icon: Mail, action: () => window.open(`mailto:?subject=${encodeURIComponent("Join me on Studium")}&body=${encodeURIComponent(`I've been using Studium to study smarter—join me: ${link}`)}`, "_self") }
  ] : [];

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Refer &amp; Earn</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Invite friends. Earn free Pro.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Share your personal referral link with friends. Every {REFERRALS_PER_MONTH} successful referrals earns you 1 month of Studium Pro—completely free.</p>

    {!progress?.signedIn ? <div className="mt-10 max-w-xl rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-7 text-center shadow-soft">
      <p className="text-sm font-bold text-heading">Log in to get your referral link.</p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">Referrals are tied to your real account so progress follows you across devices.</p>
    </div> : <div className="mt-10 max-w-xl space-y-6">

      {/* Reward earned—shown once per newly-earned month, then folds back
          into the quieter "Pro active until" state below on future visits. */}
      <AnimatePresence>
        {justEarnedMonths > 0 && <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
          className="rounded-3xl border border-teal-200 dark:border-teal-500/25 bg-teal-50 dark:bg-teal-500/10 p-6 text-center sm:p-7"
        >
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-600"><PartyPopper size={26} /></span>
          <h2 className="display mt-4 text-2xl text-heading">You earned {justEarnedMonths} month{justEarnedMonths === 1 ? "" : "s"} of Studium Pro</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Thanks for helping grow the Studium community. Your free time has been added to your account.</p>
          {progress.proUntil && <p className="mt-2 text-xs font-extrabold text-teal-700 dark:text-teal-300">Pro active until {formatDate(progress.proUntil)}</p>}
          <Link href="/dashboard/settings/billing" className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">View Pro Benefits<ChevronRight size={13} /></Link>
        </motion.div>}
      </AnimatePresence>

      {proActive && justEarnedMonths === 0 && <div className="flex items-center gap-3 rounded-2xl border border-teal-100 dark:border-teal-500/20 bg-teal-50/60 dark:bg-teal-500/10 px-5 py-3.5">
        <Crown size={16} className="shrink-0 text-teal-600 dark:text-teal-300" />
        <p className="text-xs font-bold text-teal-800 dark:text-teal-300">Pro active until {formatDate(progress!.proUntil!)}—earned through referrals.</p>
      </div>}

      {/* Progress toward the next reward */}
      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Your progress</p>
            <p className="mt-1 text-3xl font-extrabold text-heading">{inCycle} / {REFERRALS_PER_MONTH} <span className="text-sm font-bold text-slate-400">referrals</span></p>
          </div>
          {monthsEarned > 0 && <span className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-3 py-1 text-xs font-extrabold text-teal-700">{monthsEarned} month{monthsEarned === 1 ? "" : "s"} earned</span>}
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-teal-500 transition-all duration-700" style={{ width: `${cyclePercent}%` }} /></div>
        <p className="mt-3 text-sm text-slate-500">{remaining === REFERRALS_PER_MONTH ? `Invite ${REFERRALS_PER_MONTH} friends to earn your next free month.` : `${remaining} more successful referral${remaining === 1 ? "" : "s"} to earn 1 month of Pro.`}</p>

        {/* Milestone dots for the current cycle */}
        <div className="mt-5 flex flex-wrap gap-2">
          {Array.from({ length: REFERRALS_PER_MONTH }).map((_, i) => {
            const done = i < inCycle;
            return <span key={i} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${done ? "border-teal-200 dark:border-teal-500/25 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300" : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"}`}>
              {done ? <Check size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}Friend {i + 1}
            </span>;
          })}
        </div>
      </div>

      {/* Referral link */}
      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Your referral link</p>
        <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
          <div className="min-w-0 flex-1 truncate rounded-xl border border-slate-200 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 px-4 py-3 text-sm font-bold text-heading">{link ?? "Generating your link…"}</div>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={copyLink} disabled={!link} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50">
              {copied ? <><Check size={16} />Copied!</> : <><Copy size={16} />Copy</>}
            </button>
            <button type="button" onClick={nativeShare} disabled={!link} title="Share" className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm font-bold text-heading transition hover:border-teal-200 disabled:cursor-not-allowed disabled:opacity-50"><Share2 size={16} /></button>
          </div>
        </div>

        {/* Compact, secondary share shortcuts */}
        <div className="mt-4 flex flex-wrap gap-2">
          {shareOptions.map(opt => <button key={opt.label} type="button" onClick={opt.action} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition hover:border-teal-200 hover:text-teal-700 dark:hover:text-teal-300"><opt.icon size={12} />{opt.label}</button>)}
        </div>
      </div>

      {/* Referral history */}
      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <p className="flex items-center gap-2 text-sm font-extrabold text-heading"><Users size={15} className="text-teal-600 dark:text-teal-300" />Referral History</p>
        {progress.entries.length === 0 ? <p className="mt-3 text-sm text-slate-500">No referrals yet—share your link above to get started.</p> : <div className="mt-4 space-y-1.5">
          {progress.entries.map((e, i) => <HistoryRow key={e.id} index={i + 1} entry={e} />)}
        </div>}
      </div>

      <p className="px-1 text-xs leading-relaxed text-slate-400">Friends stay anonymous here—we never show their name or contact details, only whether a referral has gone through.</p>
    </div>}
  </section>;
}

function HistoryRow({ index, entry }: { index: number; entry: ReferralEntry }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f9fcfc] dark:bg-white/5 px-4 py-2.5">
    <span className="text-sm font-bold text-heading">Referral #{index}</span>
    {entry.eligible
      ? <span className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700 dark:text-teal-300"><Check size={13} />Joined</span>
      : <span className="text-xs font-bold text-slate-400">Pending</span>}
  </div>;
}
