"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Minus, PartyPopper, ShieldCheck, Sparkles } from "lucide-react";
import { getCurrentPlanId, setCurrentPlanId } from "@/lib/billing";
import { Billing, comparison, formatPrice, PlanId, plans } from "@/lib/plans";

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} className="mx-auto text-teal-600 dark:text-teal-400" strokeWidth={3} />;
  if (value === false) return <Minus size={14} className="mx-auto text-slate-300 dark:text-slate-600" />;
  return <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{value}</span>;
}

// The in-app upgrade flow: same real plans and prices as the public
// /pricing page (both read from lib/plans.ts, one source of numbers), but
// rendered inside the dashboard shell so choosing a plan never signs you
// out of the app or drops you on the marketing site. There's no real
// payment processor behind this (see lib/billing.ts)—confirming a plan
// honestly says so and just updates this browser's own demo plan state,
// the same "real per-browser, not a real backend" pattern the rest of the
// app already uses for progress/achievements/etc.
export default function UpgradePlanPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<Billing>("monthly");
  const [currentPlanId, setLocalCurrentPlanId] = useState<PlanId>("free");
  const [confirmingPlan, setConfirmingPlan] = useState<PlanId | null>(null);
  const [justChanged, setJustChanged] = useState<PlanId | null>(null);

  useEffect(() => { setLocalCurrentPlanId(getCurrentPlanId()); }, []);

  function confirmChange() {
    if (!confirmingPlan) return;
    setCurrentPlanId(confirmingPlan);
    setLocalCurrentPlanId(confirmingPlan);
    setJustChanged(confirmingPlan);
    setConfirmingPlan(null);
  }

  const confirmingPlanData = confirmingPlan ? plans.find(p => p.id === confirmingPlan) : null;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />

    <Link href="/dashboard/settings/billing" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"><ArrowLeft size={14} />Back to Billing</Link>
    <span className="eyebrow"><Sparkles size={13} />Upgrade Plan</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Invest in your future self.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Same real plans and pricing as our public pricing page—choose one without leaving your account.</p>

    <div className="mt-8 flex justify-center">
      <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-1 shadow-soft">
        <button type="button" onClick={() => setBilling("monthly")} className={`cursor-pointer rounded-full px-4 py-2 text-xs font-extrabold transition ${billing === "monthly" ? "bg-ink text-white dark:bg-teal-500" : "text-slate-500 hover:text-heading"}`}>Monthly</button>
        <button type="button" onClick={() => setBilling("yearly")} className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition ${billing === "yearly" ? "bg-ink text-white dark:bg-teal-500" : "text-slate-500 hover:text-heading"}`}>Yearly<span className="rounded-full bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 px-2 py-0.5 text-[10px] font-extrabold text-teal-700">Save up to 36%</span></button>
      </div>
    </div>

    <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
      {plans.map(plan => {
        const isFree = plan.monthly === 0;
        const price = billing === "yearly" && plan.yearly !== null ? plan.yearly : plan.monthly;
        const suffix = isFree ? "forever" : billing === "yearly" && plan.yearly !== null ? "/ year" : "/ month";
        const savingsPct = billing === "yearly" && plan.yearly !== null ? Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100) : null;
        const isCurrent = plan.id === currentPlanId;
        return <motion.div key={plan.id} whileHover={{ y: -6 }} className={`relative flex h-full flex-col rounded-3xl border p-6 ${plan.popular ? "border-teal-500 dark:border-teal-500/50 bg-ink text-white shadow-lift" : "border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-soft"}`}>
          {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Most popular</span>}
          <h3 className="text-lg font-extrabold">{plan.name}</h3>
          <p className={`mt-2 h-10 text-xs ${plan.popular ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>{plan.text}</p>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span className="display text-4xl">${formatPrice(price)}</span>
            <span className={`text-xs ${plan.popular ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>{suffix}</span>
            {savingsPct !== null && <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${plan.popular ? "bg-white/15 text-white" : "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700"}`}>Save {savingsPct}%</span>}
          </div>

          {isCurrent
            ? <span className="mt-6 block rounded-full border border-current/20 py-3 text-center text-sm font-extrabold opacity-70">Current plan</span>
            : <button
                type="button"
                onClick={() => setConfirmingPlan(plan.id)}
                className={`mt-6 block w-full cursor-pointer rounded-full py-3 text-center text-sm font-extrabold transition ${plan.popular ? "bg-accent-500 text-white hover:bg-accent-600" : "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700 hover:bg-teal-100"}`}
              >{isFree ? "Downgrade to Free" : `Switch to ${plan.name}`}</button>}

          <ul className="mt-7 space-y-3">{plan.items.map(x => <li key={x} className={`flex gap-2 text-xs font-medium ${plan.popular ? "text-slate-200" : "text-slate-600 dark:text-slate-300"}`}><ShieldCheck size={15} className="shrink-0 text-teal-500" />{x}</li>)}</ul>
        </motion.div>;
      })}
    </div>

    <div className="mx-auto mt-12 max-w-5xl overflow-x-auto">
      <p className="mb-4 text-sm font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Every item, side by side</p>
      <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-3xl border border-slate-100 dark:border-white/10 shadow-soft">
        <thead>
          <tr className="bg-[#f9fcfc] dark:bg-white/5">
            <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Feature</th>
            {plans.map(p => <th key={p.id} className="px-5 py-4 text-center text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{p.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {comparison.map(([feature, ...values], i) => <tr key={feature} className={i % 2 ? "bg-white dark:bg-[#0d1917]" : "bg-[#fbfdfd] dark:bg-white/5"}>
            <td className="border-t border-slate-100 dark:border-white/10 px-5 py-4 text-sm font-bold text-heading">{feature}</td>
            {values.map((v, j) => <td key={j} className="border-t border-slate-100 dark:border-white/10 px-5 py-4 text-center"><Cell value={v} /></td>)}
          </tr>)}
        </tbody>
      </table>
    </div>

    <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-400">Studium isn't connected to a real payment processor yet, so no card is ever charged here—choosing a plan just updates what this browser shows as your plan.</p>

    {/* Confirm dialog — explicit that this is a demo state change, never a
        fake "payment succeeded" screen. No card fields are collected. */}
    <AnimatePresence>
      {confirmingPlanData && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setConfirmingPlan(null)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0d1917] dark:ring-1 dark:ring-white/10 p-6 shadow-lift dark:shadow-none"
        >
          <h3 className="text-base font-extrabold text-heading">{confirmingPlanData.monthly === 0 ? `Downgrade to ${confirmingPlanData.name}?` : `Switch to ${confirmingPlanData.name}?`}</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {confirmingPlanData.monthly === 0
              ? "You'll drop back to the Free plan's limits."
              : `You'll be shown as ${confirmingPlanData.name} on ${billing === "yearly" ? "the yearly" : "the monthly"} price. `}
            No real payment is processed—Studium isn't connected to a payment provider yet, so this only updates what this browser shows as your plan.
          </p>
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={() => setConfirmingPlan(null)} className="flex-1 cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-300">Cancel</button>
            <button type="button" onClick={confirmChange} className="flex-1 cursor-pointer rounded-full bg-accent-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-accent-600">Confirm</button>
          </div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>

    <AnimatePresence>
      {justChanged && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => { setJustChanged(null); router.push("/dashboard/settings/billing"); }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0d1917] dark:ring-1 dark:ring-white/10 p-8 text-center shadow-lift dark:shadow-none"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><PartyPopper size={30} /></span>
          <h2 className="display mt-5 text-2xl text-heading">You're on {getPlanName(justChanged)} now</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Still no real charge behind this—just your account's demo plan, updated in this browser.</p>
          <button type="button" onClick={() => { setJustChanged(null); router.push("/dashboard/settings/billing"); }} className="mt-6 w-full cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Back to Billing</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}

function getPlanName(id: PlanId): string {
  return plans.find(p => p.id === id)?.name ?? "Free";
}
