"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, BookA, Bookmark, Clock3, Eye, Plus, Puzzle, RotateCcw, Search, Sparkles, TrendingUp
} from "lucide-react";
import { AddTermModal } from "@/components/add-term-modal";
import { ExpandedTermPanel } from "@/components/interactive-text";
import { FEATURE_FLAGS_EVENT, isFlagEnabled } from "@/lib/featureFlags";
import {
  ConfidenceLevel, findTermCategory, getMyTerms, getRecentlyLearnedTerms, getRecentlyViewedTerms,
  getTermConfidence, getTerminologyStats, getWeakCategories, isTermFavorited, Term, TERM_PROGRESS_EVENT, TerminologyStats,
  WeakCategory
} from "@/lib/terminology";
import { SectionTour } from "@/components/product-tour/SectionTour";
import { terminologyTourSteps } from "@/lib/productTour";

type StatusFilter = "all" | ConfidenceLevel | "saved";

const statusMeta: Record<ConfidenceLevel, { label: string; dot: string; text: string; ring: string }> = {
  "dont-know": { label: "Unfamiliar", dot: "bg-rose-500", text: "text-rose-700", ring: "border-rose-200 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300" },
  somewhat: { label: "Learning", dot: "bg-amber-500", text: "text-amber-700", ring: "border-amber-200 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300" },
  "know-well": { label: "Know", dot: "bg-teal-500", text: "text-teal-700", ring: "border-teal-200 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300" }
};

const defaultStats: TerminologyStats = { totalLearned: 0, masteredCount: 0, dueForReview: 0, masteryPercent: 0, todayCount: 0, dailyGoal: 20 };
const PAGE_SIZE = 24;

export default function TerminologyPage() {
  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [confidenceMap, setConfidenceMap] = useState<Record<string, ConfidenceLevel | null>>({});
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<TerminologyStats>(defaultStats);
  const [recentlyViewed, setRecentlyViewed] = useState<Term[]>([]);
  const [recentlyLearned, setRecentlyLearned] = useState<Term[]>([]);
  const [weakCategories, setWeakCategories] = useState<WeakCategory[]>([]);
  const [wordBuilderBeta, setWordBuilderBeta] = useState(true);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openTermId, setOpenTermId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // This is a personal list, not a copy of Studium's whole glossary—
  // getMyTerms() only returns terms the student has genuinely encountered
  // (clicked in a lesson or a flashcard, or rated in a review session; see
  // lib/terminology.ts). Every list below (search, filters, "All Terms",
  // the discovery rails) is derived from this same real, personal set.
  function refresh() {
    const terms = getMyTerms();
    setAllTerms(terms);
    const nextConfidence: Record<string, ConfidenceLevel | null> = {};
    for (const t of terms) nextConfidence[t.id] = getTermConfidence(t.id);
    setConfidenceMap(nextConfidence);
    setSavedSet(new Set(terms.filter(t => isTermFavorited(t.id)).map(t => t.id)));
    setStats(getTerminologyStats());
    setRecentlyViewed(getRecentlyViewedTerms(6));
    setRecentlyLearned(getRecentlyLearnedTerms(6));
    setWeakCategories(getWeakCategories());
  }

  useEffect(() => {
    refresh();
    function refreshFlag() { setWordBuilderBeta(isFlagEnabled("beta_word_builder")); }
    refreshFlag();
    window.addEventListener(FEATURE_FLAGS_EVENT, refreshFlag);
    window.addEventListener(TERM_PROGRESS_EVENT, refresh);
    return () => {
      window.removeEventListener(FEATURE_FLAGS_EVENT, refreshFlag);
      window.removeEventListener(TERM_PROGRESS_EVENT, refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Unfamiliar" covers both a term you've explicitly rated Don't-know AND
  // one you've simply never rated—the two used to be separate ("Don't know"
  // vs "Unrated"), which was the bug: a never-rated term showed the
  // "Unrated" label but didn't count toward, or show up under, the "Don't
  // know" filter at all. Now every term falls into exactly one of these
  // three buckets, so the counts genuinely sum to Total.
  const counts = useMemo(() => {
    let unfamiliar = 0, somewhat = 0, knowWell = 0;
    for (const level of Object.values(confidenceMap)) {
      if (level === "somewhat") somewhat++;
      else if (level === "know-well") knowWell++;
      else unfamiliar++; // "dont-know" or never-rated (null)
    }
    return { "dont-know": unfamiliar, somewhat, "know-well": knowWell, total: allTerms.length };
  }, [confidenceMap, allTerms]);

  const filteredTerms = useMemo(() => {
    let list = allTerms;
    if (statusFilter === "saved") list = list.filter(t => savedSet.has(t.id));
    else if (statusFilter === "dont-know") list = list.filter(t => confidenceMap[t.id] === "dont-know" || confidenceMap[t.id] == null);
    else if (statusFilter !== "all") list = list.filter(t => confidenceMap[t.id] === statusFilter);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        (findTermCategory(t.categoryId)?.name.toLowerCase().includes(q) ?? false) ||
        t.relatedTermIds.some(id => allTerms.find(rt => rt.id === id)?.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allTerms, statusFilter, savedSet, confidenceMap, query]);

  const visibleTerms = filteredTerms.slice(0, visibleCount);

  function selectFilter(next: StatusFilter) {
    setStatusFilter(next);
    setVisibleCount(PAGE_SIZE);
  }

  const goalPercent = Math.min(100, Math.round((stats.todayCount / stats.dailyGoal) * 100));

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Terminology</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">My Medical Terminology.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Your own vocabulary list—every term you've actually clicked on in a lesson or a flashcard lands here, not Studium's whole built-in glossary.</p>

    {allTerms.length === 0 ? <div className="mt-10 max-w-lg rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-8 text-center shadow-soft">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-300"><BookA size={26} /></span>
      <h2 className="mt-4 text-lg font-extrabold text-heading dark:text-white">Nothing here yet.</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Studium highlights real medical terms as you read a lesson or flip through a flashcard—click one, and it gets added here. This list is built entirely from what you actually study, not a copy of every term Studium knows.</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard/learning-paths" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Go study a lesson</Link>
        <button type="button" onClick={() => setAddModalOpen(true)} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"><Plus size={16} />Add a term</button>
      </div>
    </div> : <>
      <div className="relative mt-6 max-w-2xl">
        <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
          placeholder="Search your terms..."
          className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] py-3.5 pl-11 pr-4 text-sm text-heading shadow-soft outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
        />
      </div>

      {/* Vocabulary overview */}
      <div data-tour="term-overview" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(["dont-know", "somewhat", "know-well"] as ConfidenceLevel[]).map(level => {
          const meta = statusMeta[level];
          const active = statusFilter === level;
          return <button key={level} type="button" onClick={() => selectFilter(active ? "all" : level)} className={`cursor-pointer rounded-3xl border p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift ${active ? meta.ring : "border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917]"}`}>
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />{meta.label}</div>
            <p className={`mt-3 text-2xl font-extrabold ${active ? meta.text : "text-heading"}`}>{counts[level].toLocaleString()}</p>
            <p className="mt-0.5 text-[11px] font-bold text-slate-400">terms</p>
          </button>;
        })}
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500">Total terms</div>
          <p className="mt-3 text-2xl font-extrabold text-heading">{counts.total.toLocaleString()}</p>
          <p className="mt-0.5 text-[11px] font-bold text-slate-400">in your list</p>
        </div>
      </div>

      <div data-tour="term-actions" className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/terminology/review" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><RotateCcw size={16} />Review Due Terms{stats.dueForReview > 0 && ` (${stats.dueForReview})`}</Link>
        <Link href="/dashboard/terminology/word-builder" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"><Puzzle size={16} />Word Builder{wordBuilderBeta && <span className="rounded-full bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 px-2 py-0.5 text-[10px] font-extrabold text-violet-600">BETA</span>}</Link>
        <button type="button" onClick={() => setAddModalOpen(true)} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"><Plus size={16} />Add a Term</button>
        <span className="ml-auto hidden items-center gap-2 text-xs font-bold text-slate-400 sm:flex">{stats.todayCount} / {stats.dailyGoal} today's goal ({goalPercent}%)</span>
      </div>

      {/* Discovery rails—every one of these already only ever draws from
          real, personal signals (viewed/rated terms), so no separate
          "Recommended" rail pulling in the wider, not-yet-encountered
          glossary belongs here anymore. */}
      <div data-tour="term-discovery" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DiscoveryRail icon={Eye} title="Recently viewed" terms={recentlyViewed} emptyText="Open a term to start building this list." onOpen={setOpenTermId} />
        <DiscoveryRail icon={TrendingUp} title="Recently learned" terms={recentlyLearned} emptyText="Terms you rate “Know” will show up here." onOpen={setOpenTermId} />
        <DiscoveryRail icon={AlertTriangle} title="Needs attention" terms={allTerms.filter(t => confidenceMap[t.id] === "dont-know" || confidenceMap[t.id] == null).slice(0, 6)} emptyText="Nothing marked “Unfamiliar” right now." onOpen={setOpenTermId} />
      </div>

      {weakCategories.length > 0 && <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50/60 dark:bg-amber-500/15 p-5">
        <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-amber-800"><AlertTriangle size={13} />Weak areas</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {weakCategories.map(w => <span key={w.category.id} className="rounded-full border border-amber-200 bg-white dark:bg-[#0d1917] px-3 py-1.5 text-xs font-bold text-amber-800">{w.category.name} <span className="text-amber-500">· {w.dontKnowCount} unfamiliar</span></span>)}
        </div>
        <p className="mt-2.5 text-[11px] leading-relaxed text-amber-700/80">This is where quiz generation, flashcard recommendations, and Learning Path suggestions will eventually target first.</p>
      </div>}

      {/* Term list */}
    <div data-tour="term-list" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight">All Terms</h2>
        <div className="flex flex-wrap gap-2">
          {([["all", "All"], ["dont-know", "Unfamiliar"], ["somewhat", "Learning"], ["know-well", "Know"], ["saved", "Saved"]] as [StatusFilter, string][]).map(([id, label]) => <button key={id} type="button" onClick={() => selectFilter(id)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${statusFilter === id ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{label}</button>)}
        </div>
      </div>

      {filteredTerms.length === 0
        ? <p className="mt-6 text-sm text-slate-500">{query.trim() ? `No terms match "${query}".` : "No terms in this filter yet."}</p>
        : <div className="mt-5 space-y-2.5">
          {visibleTerms.map(term => {
            // A never-rated term is displayed as "Unfamiliar" too, same as
            // an explicit "dont-know" rating—no separate "Unrated" label or
            // styling anymore (see the counts/filteredTerms fix above).
            const level = confidenceMap[term.id] ?? "dont-know";
            const meta = statusMeta[level];
            return <button key={term.id} type="button" onClick={() => setOpenTermId(term.id)} className="flex w-full cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lift sm:p-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-extrabold text-heading">{term.name}</p>
                  {savedSet.has(term.id) && <Bookmark size={12} className="shrink-0 text-amber-500" fill="currentColor" />}
                </div>
                <p className="text-xs font-bold text-slate-400">{findTermCategory(term.categoryId)?.name}</p>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{term.definition}</p>
              </div>
              <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${meta.ring} ${meta.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />{meta.label}
              </span>
            </button>;
          })}
        </div>}

      {visibleCount < filteredTerms.length && <button type="button" onClick={() => setVisibleCount(c => c + PAGE_SIZE)} className="mt-5 w-full cursor-pointer rounded-2xl border border-dashed border-slate-200 dark:border-white/10 py-3 text-xs font-extrabold text-slate-500 transition hover:border-teal-200 hover:text-teal-700">Show more ({filteredTerms.length - visibleCount} remaining)</button>}
      </div>
    </>}

    {openTermId && <ExpandedTermPanel initialTermId={openTermId} onClose={() => setOpenTermId(null)} />}
    {addModalOpen && <AddTermModal onClose={() => setAddModalOpen(false)} onAdded={refresh} />}
    <SectionTour id="terminology" steps={terminologyTourSteps} />
  </section>;
}

function DiscoveryRail({ icon: Icon, title, terms, emptyText, onOpen }: { icon: typeof Eye; title: string; terms: Term[]; emptyText: string; onOpen: (id: string) => void }) {
  return <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft">
    <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Icon size={13} className="text-teal-600" />{title}</p>
    {terms.length === 0
      ? <p className="mt-3 text-xs text-slate-400">{emptyText}</p>
      : <div className="mt-3 flex flex-wrap gap-2">
        {terms.map(t => <button key={t.id} type="button" onClick={() => onOpen(t.id)} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-3 py-1.5 text-xs font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">{t.name}</button>)}
      </div>}
  </div>;
}
