"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Sparkles } from "lucide-react";
import { getCurrentPlan, PLAN_CHANGE_EVENT } from "@/lib/billing";
import { Plan } from "@/lib/plans";

export default function BillingPage() {
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    function refresh() { setPlan(getCurrentPlan()); }
    refresh();
    window.addEventListener(PLAN_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(PLAN_CHANGE_EVENT, refresh);
  }, []);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Billing.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Your plan and payment details.</p>

    <div className="mt-10 max-w-2xl space-y-6">
      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Current plan</p>
            <p className="mt-1 text-2xl font-extrabold text-heading">{plan?.name ?? "Free"}</p>
          </div>
          <Link href="/dashboard/settings/billing/upgrade" className="cursor-pointer rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">{plan && plan.id !== "free" ? "Change plan" : "Upgrade plan"}</Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-heading"><CreditCard size={18} className="text-teal-600" />Payment method</h2>
        <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 py-10 text-center">
          <p className="text-sm font-bold text-heading">No payment method on file</p>
          <p className="max-w-xs text-xs leading-relaxed text-slate-500">{plan && plan.id !== "free" ? "Your plan above is a demo state, not a real subscription—" : "You're on the free plan, so there's nothing to charge. "}Billing isn't connected to a real payment processor yet.</p>
        </div>
      </div>
    </div>
  </section>;
}
