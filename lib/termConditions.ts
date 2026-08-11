// "Common conditions where this term appears" for the expanded term panel.
// Rather than hand-writing a condition list per term (94 terms and
// growing—high risk of drifting out of sync with reality), this derives the
// answer for real by scanning the actual Clinical Cases library for exact
// mentions of the term, using the same matching rules as the live
// highlighter. If a term isn't genuinely used in any case yet, it honestly
// returns an empty list instead of a fabricated one.

import { ClinicalCase, getAllCases } from "./clinicalCases";
import { terms } from "./terminology";

export type ConditionMatch = { id: string; title: string; category: string };

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function caseText(c: ClinicalCase): string {
  return `${c.stem} ${c.question} ${c.explanation}`;
}

export function getConditionsForTerm(termId: string): ConditionMatch[] {
  const term = terms.find(t => t.id === termId);
  if (!term) return [];
  const pattern = new RegExp(`\\b${escapeRegExp(term.name)}\\b`, "i");
  return getAllCases()
    .filter(c => pattern.test(caseText(c)))
    .map(c => ({ id: c.id, title: c.title, category: c.category }));
}
