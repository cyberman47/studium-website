import { Bot, Sparkles } from "lucide-react";

export default function AiTutorPage() {
  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />AI Tutor</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Ask Studium anything.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Your AI study partner for clear explanations, hints, and a plan whenever you need one.</p>
    <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center shadow-soft">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 text-teal-700"><Bot size={26} /></span>
      <p className="text-base font-extrabold text-ink">Your AI Tutor isn't connected yet.</p>
      <p className="max-w-xs text-sm leading-relaxed text-slate-500">We're still building this section—check back soon.</p>
    </div>
  </section>;
}
