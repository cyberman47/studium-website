"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Gift } from "lucide-react";
import { getReferralProgress, REFERRALS_PER_MONTH } from "@/lib/referrals";

// A small, tasteful promotional card for the dashboard—not a permanent
// sidebar nav item (per the referral program's own scope: two entry
// points only, Profile/Account and this card). Reads real referral
// progress once signed in; degrades to a plain, unpersonalized invite for
// a signed-out/local-only visitor rather than fabricating a fake 0/5.
export function ReferEarnCard() {
  const [loaded, setLoaded] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [inCycle, setInCycle] = useState(0);
  const [monthsEarned, setMonthsEarned] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getReferralProgress().then(p => {
      if (cancelled) return;
      setSignedIn(p.signedIn);
      setInCycle(p.eligibleCount % REFERRALS_PER_MONTH);
      setMonthsEarned(p.monthsEarned);
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  if (!loaded) return null;

  const remaining = REFERRALS_PER_MONTH - inCycle;
  const percent = Math.round((inCycle / REFERRALS_PER_MONTH) * 100);
  // Once at least one month has already been earned, the card compacts
  // down to a single quiet line instead of the full pitch + progress bar—
  // "continuously visible without becoming annoying," per the feature spec.
  const compact = signedIn && monthsEarned > 0;

  return <Link href="/dashboard/settings/invite" className="group block rounded-3xl border border-teal-100 dark:border-teal-500/20 bg-teal-50/40 dark:bg-teal-500/[0.06] p-5 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-soft">
    {compact ? <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><Gift size={16} /></span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-heading">Your next month of Pro</p>
          <p className="mt-0.5 text-xs text-slate-500">Invite {remaining} more friend{remaining === 1 ? "" : "s"} to earn another free month.</p>
        </div>
      </div>
      <ChevronRight size={16} className="shrink-0 text-teal-500 transition group-hover:translate-x-0.5" />
    </div> : <>
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><Gift size={16} /></span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-heading">Learn together. Earn Pro.</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">Invite {REFERRALS_PER_MONTH} friends to Studium and get 1 month of Pro free.</p>
        </div>
      </div>
      {signedIn && <div className="mt-3.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400"><span>{inCycle} / {REFERRALS_PER_MONTH}</span></div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white dark:bg-white/10"><div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${percent}%` }} /></div>
      </div>}
      <span className="mt-3.5 inline-flex items-center gap-1 text-xs font-extrabold text-teal-700 dark:text-teal-300">Invite Friends<ChevronRight size={13} className="transition group-hover:translate-x-0.5" /></span>
    </>}
  </Link>;
}
