"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, Minus, ShieldCheck, Sparkles } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";
import { Reveal } from "@/components/ui";

const plans: { name: string; price: string; text: string; items: string[]; popular?: boolean }[] = [
  { name: "Starter", price: "0", text: "A better way to begin.", items: ["AI study help", "3 subjects", "Essential flashcards"] },
  { name: "Plus", price: "12", text: "For focused learners.", items: ["Unlimited subjects", "Personal learning plans", "Advanced analytics", "Practice exams"], popular: true },
  { name: "Pro", price: "24", text: "For big academic goals.", items: ["Everything in Plus", "Priority AI support", "Deep-dive insights", "Early access features"] }
];

const comparison = [
  ["AI study help", true, true, true],
  ["Subjects", "3", "Unlimited", "Unlimited"],
  ["Flashcards", "Essential", "Essential", "Essential"],
  ["Personal learning plans", false, true, true],
  ["Advanced analytics", false, true, true],
  ["Practice exams", false, true, true],
  ["Priority AI support", false, false, true],
  ["Deep-dive insights", false, false, true],
  ["Early access features", false, false, true]
] as const;

const pricingFaqs = [
  ["Can I cancel anytime?", "Yes. Cancel whenever you like from your account settings—no calls, no hoops. You'll keep access until the end of your billing period."],
  ["Do you offer student discounts?", "Studium is already priced for students. If you're facing financial hardship, reach out and we'll work something out."],
  ["What payment methods do you accept?", "All major credit and debit cards, plus Apple Pay and Google Pay at checkout."],
  ["Can I switch plans later?", "Anytime. Upgrade or downgrade from your account, and we'll prorate the difference."]
] as const;

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} className="mx-auto text-teal-600" strokeWidth={3} />;
  if (value === false) return <Minus size={14} className="mx-auto text-slate-300" />;
  return <span className="text-xs font-bold text-slate-600">{value}</span>;
}

export default function PricingPage() {
  const [open, setOpen] = useState(0);

  return <main className="min-h-screen overflow-hidden bg-[#fcfdfd]">
    <LanguageBar />
    <header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div>
    </header>

    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow"><Sparkles size={13} />Simple, honest pricing</span>
          <h1 className="display mt-6 text-5xl leading-[.98] sm:text-7xl">Invest in your future self.</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">Start free. Upgrade when your ambition needs more room.</p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
          {plans.map((plan, i) => <Reveal key={plan.name} delay={i * .08}>
            <motion.div whileHover={{ y: -7 }} className={`relative h-full rounded-3xl border p-6 ${plan.popular ? "border-teal-500 bg-ink text-white shadow-lift" : "border-slate-100 bg-white shadow-soft"}`}>
              {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Most popular</span>}
              <h3 className="text-lg font-extrabold">{plan.name}</h3>
              <p className={`mt-2 h-10 text-xs ${plan.popular ? "text-slate-300" : "text-slate-500"}`}>{plan.text}</p>
              <div className="mt-5 flex items-baseline"><span className={`display text-4xl ${plan.popular ? "!text-white" : ""}`}>€{plan.price}</span><span className={`ml-1 text-xs ${plan.popular ? "text-slate-300" : "text-slate-500"}`}>/ month</span></div>
              <Link href="/signup" className={`mt-6 block cursor-pointer rounded-full py-3 text-center text-sm font-extrabold transition ${plan.popular ? "bg-accent-500 text-white hover:bg-accent-600" : "bg-teal-50 text-teal-700 hover:bg-teal-100"}`}>{plan.price === "0" ? "Get started" : "Start free trial"}</Link>
              <ul className="mt-7 space-y-3">{plan.items.map(x => <li key={x} className={`flex gap-2 text-xs font-medium ${plan.popular ? "text-slate-200" : "text-slate-600"}`}><ShieldCheck size={15} className="shrink-0 text-teal-500" />{x}</li>)}</ul>
            </motion.div>
          </Reveal>)}
        </div>
      </div>
    </section>

    <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
      <div className="container-page">
        <Reveal className="max-w-xl"><span className="eyebrow">Compare plans</span><h2 className="display mt-5 text-4xl sm:text-5xl">Every item, side by side.</h2></Reveal>
        <Reveal delay={.08} className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-0 overflow-hidden rounded-3xl border border-slate-100 shadow-soft">
            <thead>
              <tr className="bg-[#f9fcfc]">
                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500">Feature</th>
                {plans.map(p => <th key={p.name} className="px-5 py-4 text-center text-xs font-extrabold uppercase tracking-wider text-slate-500">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {comparison.map(([feature, ...values], i) => <tr key={feature} className={i % 2 ? "bg-white" : "bg-[#fbfdfd]"}>
                <td className="border-t border-slate-100 px-5 py-4 text-sm font-bold text-ink">{feature}</td>
                {values.map((v, j) => <td key={j} className="border-t border-slate-100 px-5 py-4 text-center"><Cell value={v} /></td>)}
              </tr>)}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>

    <section className="container-page py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal><span className="eyebrow">Billing questions</span><h2 className="display mt-5 text-4xl leading-tight sm:text-5xl">Pricing, answered.</h2><p className="mt-5 text-sm leading-relaxed text-slate-500">Still curious? Our friendly team is always happy to help.</p><a href="mailto:hello@studium.app" className="mt-6 inline-block cursor-pointer text-sm font-extrabold text-teal-600">Talk to us →</a></Reveal>
        <div>{pricingFaqs.map(([question, answer], i) => <div key={question} className="border-b border-slate-200">
          <button type="button" onClick={() => setOpen(i === open ? -1 : i)} className="flex w-full cursor-pointer items-center justify-between py-5 text-left text-sm font-extrabold"><span>{question}</span><ChevronDown size={18} className={`text-teal-600 transition-transform ${open === i ? "rotate-180" : ""}`} /></button>
          <AnimatePresence initial={false}>{open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-xl pb-5 text-sm leading-relaxed text-slate-500">{answer}</p></motion.div>}</AnimatePresence>
        </div>)}</div>
      </div>
    </section>
  </main>;
}
