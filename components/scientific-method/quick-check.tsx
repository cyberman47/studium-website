"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { QuickCheck as QuickCheckData } from "@/lib/scientificMethodLesson";

// The interactive area for a concept's "Apply" subsection—no timer, no
// scoring, just "did that land." Sits under a plain text "Apply" heading
// supplied by the parent, so this component itself carries the minimum
// chrome needed to read as interactive (a single restrained border/tint),
// not a second labeled card on top of the section that already labels it.
export function QuickCheck({ data, onAnswered }: { data: QuickCheckData; onAnswered: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    onAnswered();
  }

  const answered = selected !== null;
  const correct = selected === data.correctIndex;

  return <div className="mt-4 rounded-xl border border-slate-200 dark:border-white/10 bg-[#faf9f6] dark:bg-white/[0.03] p-5">
    {data.scenario && <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{data.scenario}</p>}
    <p className={`${data.scenario ? "mt-2" : ""} text-sm font-bold text-heading`}>{data.prompt}</p>

    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {data.options.map((opt, i) => {
        const isCorrect = i === data.correctIndex;
        const isSelected = i === selected;
        let cls = "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-teal-300 hover:bg-white dark:hover:bg-white/5";
        if (answered) {
          if (isCorrect) cls = "border-teal-400 dark:border-teal-500/50 bg-teal-50/70 dark:bg-teal-500/10 text-teal-800 dark:text-teal-200";
          else if (isSelected) cls = "border-rose-300 dark:border-rose-500/50 bg-rose-50/70 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300";
          else cls = "border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 opacity-60";
        }
        return <button
          key={opt}
          type="button"
          disabled={answered}
          onClick={() => choose(i)}
          className={`flex items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-left text-xs font-bold transition ${answered ? "cursor-default" : "cursor-pointer"} ${cls}`}
        >
          <span>{opt}</span>
          {answered && isCorrect && <Check size={14} className="shrink-0 text-teal-600 dark:text-teal-300" />}
          {answered && isSelected && !isCorrect && <X size={14} className="shrink-0 text-rose-500 dark:text-rose-300" />}
        </button>;
      })}
    </div>

    {answered && <p className={`mt-3 text-xs leading-relaxed ${correct ? "text-teal-800 dark:text-teal-300" : "text-slate-600 dark:text-slate-300"}`}>
      <span className="font-extrabold">{correct ? "Correct — " : "Not quite — "}</span>{data.explanation}
    </p>}
  </div>;
}
