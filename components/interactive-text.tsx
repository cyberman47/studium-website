"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { detectTerms } from "@/lib/termDetection";
import { isTermLearned, learnTerm, Term } from "@/lib/terminology";
import { useTermPanel } from "@/components/term-panel";

// Drop-in replacement for plain text content: detects real Terminology terms
// in the string and makes each one interactive (hover tooltip, click for the
// full side panel), while leaving everything else as plain text.
export function InteractiveText({ text }: { text: string }) {
  const segments = detectTerms(text);
  return <>{segments.map((seg, i) => seg.type === "term"
    ? <HighlightedTerm key={`${seg.term.id}-${i}`} term={seg.term} matchedText={seg.value} />
    : <span key={i}>{seg.value}</span>)}</>;
}

function HighlightedTerm({ term, matchedText }: { term: Term; matchedText: string }) {
  const { open } = useTermPanel();
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(() => isTermLearned(term.id));

  function quickSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (saved) return;
    learnTerm(term.id);
    setSaved(true);
  }

  return <span className="relative inline" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <button
      type="button"
      onClick={() => open(term.id)}
      className="cursor-pointer rounded-[3px] border-b-2 border-dotted border-teal-400 bg-teal-50/70 px-0.5 font-semibold text-[#0c6c6e] transition hover:bg-teal-100"
    >
      {matchedText}
    </button>
    {/* Rendered as <span>s throughout (never <div>/<p>) since this tooltip can be
        nested inside a parent <p> at the call site—block elements there would be
        invalid HTML, which browsers "fix" by force-closing the parent <p> early,
        corrupting the DOM React expects and breaking event handling downstream. */}
    <AnimatePresence>
      {hovered && <motion.span
        initial={{ opacity: 0, y: 4, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.97 }}
        transition={{ duration: 0.13 }}
        className="pointer-events-auto absolute bottom-full left-1/2 z-40 mb-2 w-64 -translate-x-1/2 rounded-2xl border border-black/[0.06] bg-white p-3.5 text-left shadow-lift"
      >
        <span className="block text-sm font-extrabold text-ink">{term.name}</span>
        <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-slate-500">{term.definition}</span>
        <span className="mt-2.5 flex items-center gap-2">
          <button type="button" onClick={() => open(term.id)} className="cursor-pointer rounded-full bg-teal-50 px-3 py-1.5 text-[11px] font-extrabold text-teal-700 transition hover:bg-teal-100">View Details</button>
          <button type="button" onClick={quickSave} disabled={saved} className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:cursor-default disabled:text-teal-700">
            {saved ? <BookmarkCheck size={11} /> : <Bookmark size={11} />}{saved ? "Saved" : "Save"}
          </button>
        </span>
        <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-black/[0.06] bg-white" />
      </motion.span>}
    </AnimatePresence>
  </span>;
}
