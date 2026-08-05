"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookA, Compass, Library, Map, Search } from "lucide-react";
import { getDefaultSuggestions, search, SearchResult } from "@/lib/search";

const groupIcons: Record<SearchResult["group"], typeof Search> = {
  "Go to": Compass,
  Terminology: BookA,
  "MCAT Lessons": Map,
  Library: Library
};

export function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) { setQuery(""); setActiveIndex(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const results = open ? search(query) : [];

  useEffect(() => { setActiveIndex(0); }, [query]);

  function go(result: SearchResult) {
    router.push(result.href);
    setOpen(false);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && results[activeIndex]) { go(results[activeIndex]); }
  }

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.group] ??= []).push(r);
    return acc;
  }, {});

  return <>
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="hidden w-full max-w-sm cursor-pointer items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400 transition hover:border-teal-200 hover:bg-[#f9fcfc] sm:flex"
    >
      <Search size={15} className="shrink-0" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">⌘K</kbd>
    </button>
    <button type="button" onClick={() => setOpen(true)} aria-label="Search" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-50 sm:hidden"><Search size={18} /></button>

    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-[12vh] backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_20px_50px_-15px_rgba(16,40,41,0.35)]"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
            <Search size={17} className="shrink-0 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search lessons, terms, library..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
            />
            <kbd className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">Esc</kbd>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-slate-400">No results for &ldquo;{query}&rdquo;.</p>}
            {Object.entries(grouped).map(([group, items]) => <div key={group} className="mb-1">
              <p className="px-3 pb-1 pt-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">{group}</p>
              {items.map(r => {
                const idx = results.indexOf(r);
                const Icon = groupIcons[r.group];
                return <button
                  key={r.id}
                  type="button"
                  onClick={() => go(r)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${idx === activeIndex ? "bg-[#effbfa]" : "hover:bg-slate-50"}`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700"><Icon size={14} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{r.title}</p>
                    <p className="truncate text-xs text-slate-500">{r.subtitle}</p>
                  </div>
                </button>;
              })}
            </div>)}
          </div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
