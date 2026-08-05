// Scans a block of plain text and finds real Terminology entries inside it,
// so any paragraph across the app (clinical cases, lesson bodies, generated
// lessons) can become interactive without special-casing content. Only the
// first occurrence of each term per block is tagged, so repeated mentions in
// a long lesson body don't turn into a wall of highlights.

import { Term, terms } from "./terminology";

export type TextSegment = { type: "text"; value: string } | { type: "term"; value: string; term: Term };

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Longest names first so a multi-word term (e.g. "Myocardial Infarction")
// matches as a whole phrase before any shorter term could grab part of it.
const sortedByLength = [...terms].sort((a, b) => b.name.length - a.name.length);
const matchPattern = sortedByLength.length
  ? new RegExp(`\\b(${sortedByLength.map(t => escapeRegExp(t.name)).join("|")})\\b`, "gi")
  : null;
const termByLowerName = new Map(terms.map(t => [t.name.toLowerCase(), t]));

export function detectTerms(text: string): TextSegment[] {
  if (!matchPattern || !text) return [{ type: "text", value: text }];

  const segments: TextSegment[] = [];
  const seen = new Set<string>();
  let lastIndex = 0;
  matchPattern.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = matchPattern.exec(text)) !== null) {
    const matchedText = match[0];
    const term = termByLowerName.get(matchedText.toLowerCase());
    if (!term || seen.has(term.id)) continue;
    if (match.index > lastIndex) segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    segments.push({ type: "term", value: matchedText, term });
    seen.add(term.id);
    lastIndex = match.index + matchedText.length;
  }
  if (lastIndex < text.length) segments.push({ type: "text", value: text.slice(lastIndex) });
  return segments;
}
