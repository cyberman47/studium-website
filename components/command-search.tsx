"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookA, Compass, FileText, Globe, Link2, Map, Search } from "lucide-react";
import { getDefaultSuggestions, search, SearchResult } from "@/lib/search";

const groupIcons: Record<SearchResult["group"], typeof Search> = {
  "Go to": Compass,
  Terminology: BookA,
  "MCAT Lessons": Map,
  Community: Globe,
  Articles: FileText,
  Resources: Link2
};

export function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Framer-motion fully owns the `transform` style once any motion value
  // (x/y/scale) is present—a Tailwind `-translate-x-1/2` class on the same
  // element gets silently clobbered by its inline style, not composed with
  // it. So the horizontal centering has to be one of framer's own animated
  // values (x: "-50%"), not a class—but that only makes sense once the
  // panel is actually anchored under the wide, centered desktop search bar.
  // On a narrow viewport the icon-only trigger isn't centered in the page,
  // so centering under it can push the panel off the left edge entirely;
  // below the sm breakpoint the panel switches to viewport-fixed
  // (inset-x-3) instead, which needs x: 0, not -50%.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    function onChange() { setIsDesktop(mq.matches); }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    // Esc-to-close only—the Ctrl/Cmd+K global shortcut to open search was
    // removed by request.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Anchored dropdown, not a spotlight-style centered modal—closes the same
  // way every other header dropdown in this app does (click anywhere
  // outside its own box), instead of a full-screen dimming backdrop.
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

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

  return <div ref={containerRef} className="relative w-9 sm:w-full sm:max-w-sm">
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      className="hidden w-full cursor-pointer items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400 transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-teal-500/30 dark:hover:bg-white/10 sm:flex"
    >
      <Search size={15} className="shrink-0" />
      <span className="flex-1 text-left">Search...</span>
    </button>
    <button type="button" onClick={() => setOpen(o => !o)} aria-label="Search" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5 sm:hidden"><Search size={18} /></button>

    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98, x: isDesktop ? "-50%" : 0 }}
        animate={{ opacity: 1, y: 0, scale: 1, x: isDesktop ? "-50%" : 0 }}
        exit={{ opacity: 0, y: -8, scale: 0.98, x: isDesktop ? "-50%" : 0 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-3 top-16 z-50 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_20px_50px_-15px_rgba(16,40,41,0.35)] dark:border-white/10 dark:bg-[#0d1917] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] sm:absolute sm:inset-x-auto sm:left-1/2 sm:top-full sm:mt-2 sm:w-[440px]"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-white/10">
          <Search size={17} className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search lessons, terms, library..."
            className="w-full bg-transparent text-sm text-heading outline-none placeholder:text-slate-400"
          />
          <kbd className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500">Esc</kbd>
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
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${idx === activeIndex ? "bg-[#effbfa] dark:bg-teal-500/15" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300"><Icon size={14} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-heading">{r.title}</p>
                  <p className="truncate text-xs text-slate-500">{r.subtitle}</p>
                </div>
              </button>;
            })}
          </div>)}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
