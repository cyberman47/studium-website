// Scans a block of plain text and finds real Terminology entries inside it,
// so any paragraph across the app (clinical cases, lesson bodies, generated
// lessons) can become interactive without special-casing content. Only the
// first occurrence of each term per block is tagged, so repeated mentions in
// a long lesson body don't turn into a wall of highlights.

import { getAllTerms, Term } from "./terminology";

export type TextSegment = { type: "text"; value: string } | { type: "term"; value: string; term: Term };

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Built fresh on every call (not memoized at module scope) so that terms
// added through the admin panel are picked up on the very next render,
// without needing a page reload. The term list is small enough that this
// costs nothing measurable.
function buildMatcher() {
  const allTerms = getAllTerms();
  if (allTerms.length === 0) return null;
  // Longest names first so a multi-word term (e.g. "Myocardial Infarction")
  // matches as a whole phrase before any shorter term could grab part of it.
  const sortedByLength = [...allTerms].sort((a, b) => b.name.length - a.name.length);
  const pattern = new RegExp(`\\b(${sortedByLength.map(t => escapeRegExp(t.name)).join("|")})\\b`, "gi");
  const byLowerName = new Map(allTerms.map(t => [t.name.toLowerCase(), t]));
  return { pattern, byLowerName };
}

export function detectTerms(text: string): TextSegment[] {
  const matcher = buildMatcher();
  if (!matcher || !text) return [{ type: "text", value: text }];
  const { pattern, byLowerName } = matcher;

  const segments: TextSegment[] = [];
  const seen = new Set<string>();
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const matchedText = match[0];
    const term = byLowerName.get(matchedText.toLowerCase());
    if (!term || seen.has(term.id)) continue;
    if (match.index > lastIndex) segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    segments.push({ type: "term", value: matchedText, term });
    seen.add(term.id);
    lastIndex = match.index + matchedText.length;
  }
  if (lastIndex < text.length) segments.push({ type: "text", value: text.slice(lastIndex) });
  return segments;
}
