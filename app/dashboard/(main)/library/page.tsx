"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, Calendar, Check, ChevronLeft, ChevronRight, Clock3, FileText, Flame,
  Globe, Layers, Link2, Search, Sparkles, Stethoscope, TriangleAlert, X
} from "lucide-react";
import { CaseAttempt, ClinicalCase, getAllCaseAttempts, getCaseAttemptsByDate, getCaseOfTheDay, getCaseStreak, getTodayCaseAttempt } from "@/lib/clinicalCases";
import { getDecks } from "@/lib/flashcardDecks";
import { getAllRealLessons } from "@/lib/mcatPath";
import { getMissedQuestionIds, getSavedQuestionIds } from "@/lib/practiceHistory";
import { getSavedHighlights } from "@/lib/savedHighlights";
import { getCommunityLessons } from "@/lib/communityLessons";
import { getArticles } from "@/lib/articles";
import { getResources } from "@/lib/resources";
import { getLibrarySaveCount } from "@/lib/myLibrary";

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function LibraryPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [todaysCase, setTodaysCase] = useState<ClinicalCase | null>(null);
  const [todayAttempt, setTodayAttempt] = useState<CaseAttempt | null>(null);
  const [caseAccuracy, setCaseAccuracy] = useState({ correct: 0, total: 0 });
  const [caseStreak, setCaseStreak] = useState(0);
  const [attemptsByDate, setAttemptsByDate] = useState<Record<string, CaseAttempt>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [reviewDateKey, setReviewDateKey] = useState<string | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [counts, setCounts] = useState({ lessons: 0, saved: 0, community: 0, articles: 0, resources: 0, decks: 0, missed: 0, flagged: 0, highlights: 0 });

  function refresh() {
    setTodaysCase(getCaseOfTheDay());
    setTodayAttempt(getTodayCaseAttempt());
    const accuracy = getAllCaseAttempts();
    setCaseAccuracy({ correct: accuracy.filter(a => a.correct).length, total: accuracy.length });
    setCaseStreak(getCaseStreak());
    setAttemptsByDate(getCaseAttemptsByDate());

    setCounts({
      lessons: getAllRealLessons().length,
      saved: getLibrarySaveCount(),
      community: getCommunityLessons().length,
      articles: getArticles().length,
      resources: getResources().length,
      decks: getDecks().length,
      missed: getMissedQuestionIds().length,
      flagged: getSavedQuestionIds().length,
      highlights: getSavedHighlights().length
    });
    setLoaded(true);
  }

  useEffect(() => { refresh(); }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/dashboard/library/search?q=${encodeURIComponent(q)}`);
  }

  if (!loaded) return null;

  const todayKey = toDateKey(new Date());

  const categories = [
    { href: "/dashboard/library/lessons", icon: BookOpen, label: "All Lessons", desc: "Every official Studium lesson, browsable by subject and difficulty.", count: `${counts.lessons} lesson${counts.lessons === 1 ? "" : "s"}` },
    { href: "/dashboard/library/saved", icon: Layers, label: "Saved", desc: "Everything you've bookmarked—Studium content and Community content together.", count: `${counts.saved} saved` },
    { href: "/dashboard/library/recent", icon: Clock3, label: "Recently Added", desc: "The newest official lessons and community study guides.", count: "Updated regularly" },
    { href: "/dashboard/library/community", icon: Globe, label: "Community", desc: "Study guides published by fellow students—preview, then add to your Library.", count: `${counts.community} shared` },
    { href: "/dashboard/library/articles", icon: FileText, label: "Articles", desc: "Short, focused reads on real study skills and exam concepts.", count: `${counts.articles} article${counts.articles === 1 ? "" : "s"}` },
    { href: "/dashboard/library/resources", icon: Link2, label: "Resources", desc: "Real reference material and official sources worth bookmarking.", count: `${counts.resources} resource${counts.resources === 1 ? "" : "s"}` }
  ];

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Library</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Library.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Explore lessons, articles, resources, and community content.</p>

    <form onSubmit={submitSearch} className="relative mt-6 max-w-xl">
      <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search the library…"
        className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-ink outline-none focus:border-teal-400"
      />
    </form>

    {/* Daily Case—kept as a compact real widget, not one of the 6 main
        categories (it's clinical-case practice, not lesson/article/resource
        content), same real data as before. */}
    {todaysCase && <div className="relative mt-8 overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-lift sm:p-7">
      <Stethoscope size={160} className="pointer-events-none absolute -right-6 -top-6 text-white/5" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-teal-300">🔥 Daily Case</span>
          <h2 className="display mt-3 text-xl sm:text-2xl">{todaysCase.title}</h2>
          <p className="mt-1.5 text-xs font-bold text-slate-300">{caseAccuracy.total > 0 ? `${Math.round((caseAccuracy.correct / caseAccuracy.total) * 100)}% your accuracy` : "No attempts yet"} · {caseStreak}-day streak</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <Link href="/dashboard/case-of-the-day" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">
            <Stethoscope size={14} />{todayAttempt ? "Review Your Answer" : "Solve Today's Case"}
          </Link>
          <button type="button" onClick={() => setCalendarOpen(true)} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
            <Calendar size={14} />Archive
          </button>
        </div>
      </div>
    </div>}

    {/* The 6 main Library categories */}
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c, i) => <Link key={c.href} href={c.href} className="group flex cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lift" style={{ transitionDelay: `${i * 15}ms` }}>
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-50 text-teal-600"><c.icon size={20} /></span>
          <ArrowRight size={16} className="mt-2 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500" />
        </div>
        <h3 className="mt-4 text-base font-extrabold tracking-tight text-ink">{c.label}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500">{c.desc}</p>
        <p className="mt-4 text-[11px] font-extrabold uppercase tracking-wide text-teal-600">{c.count}</p>
      </Link>)}
    </div>

    {/* Real existing workspace features that predate this redesign—kept
        reachable, not deleted, just no longer the primary structure. */}
    <div className="mt-10">
      <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-400">More from your workspace</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Link href="/dashboard/flashcards" className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-soft">
          <div><p className="text-sm font-extrabold text-ink">My Decks</p><p className="mt-0.5 text-xs text-slate-500">{counts.decks} deck{counts.decks === 1 ? "" : "s"}</p></div>
          <ArrowRight size={15} className="text-slate-300" />
        </Link>
        <Link href="/dashboard/library/saved#flagged" className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-soft">
          <div><p className="text-sm font-extrabold text-ink">Flagged Questions</p><p className="mt-0.5 text-xs text-slate-500">{counts.flagged} flagged</p></div>
          <ArrowRight size={15} className="text-slate-300" />
        </Link>
        <Link href="/dashboard/library/saved#mistakes" className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-soft">
          <div className="flex items-center gap-2.5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600"><TriangleAlert size={14} /></span><div><p className="text-sm font-extrabold text-ink">Mistake Vault</p><p className="mt-0.5 text-xs text-slate-500">{counts.missed} to review</p></div></div>
          <ArrowRight size={15} className="text-slate-300" />
        </Link>
      </div>
    </div>

    {/* Past Cases calendar */}
    <AnimatePresence>
      {calendarOpen && <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
        onClick={() => { setCalendarOpen(false); setReviewDateKey(null); }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 12 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift sm:p-7"
        >
          {reviewDateKey
            ? <CaseReview dateKey={reviewDateKey} attempt={attemptsByDate[reviewDateKey]} onBack={() => setReviewDateKey(null)} onClose={() => { setCalendarOpen(false); setReviewDateKey(null); }} />
            : <CalendarView
              month={calendarMonth}
              setMonth={setCalendarMonth}
              attemptsByDate={attemptsByDate}
              todayKey={todayKey}
              streak={caseStreak}
              onSelectDay={key => { if (attemptsByDate[key]) setReviewDateKey(key); }}
              onClose={() => setCalendarOpen(false)}
            />}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}

function CalendarView({ month, setMonth, attemptsByDate, todayKey, streak, onSelectDay, onClose }: {
  month: Date;
  setMonth: (d: Date) => void;
  attemptsByDate: Record<string, CaseAttempt>;
  todayKey: string;
  streak: number;
  onSelectDay: (key: string) => void;
  onClose: () => void;
}) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  // Every real dateKey in this app is UTC-derived (toDateKey uses
  // toISOString—see clinicalCases.ts), so building each cell's key has to
  // stay in UTC the whole way through, not round-trip through a local-
  // midnight Date. Doing that shifted every cell by a day for any
  // positive-UTC-offset timezone (caught via live testing in UTC+2), which
  // detached "today"'s ring and every attempt dot from the right cell.
  const leadingBlanks = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [...Array(leadingBlanks).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => toDateKey(new Date(Date.UTC(year, monthIndex, i + 1))))];

  return <>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-base font-extrabold text-ink">Past Cases Archive</h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-extrabold text-amber-600"><Flame size={13} />{streak}-Day Case Streak</p>
      </div>
      <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink" aria-label="Close"><X size={16} /></button>
    </div>

    <div className="mt-5 flex items-center justify-between">
      <button type="button" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-ink" aria-label="Previous month"><ChevronLeft size={16} /></button>
      <p className="text-sm font-extrabold text-ink">{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
      <button type="button" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-ink" aria-label="Next month"><ChevronRight size={16} /></button>
    </div>

    <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
    </div>
    <div className="mt-1.5 grid grid-cols-7 gap-1.5">
      {cells.map((key, i) => {
        if (!key) return <span key={i} />;
        const attempt = attemptsByDate[key];
        const isFuture = key > todayKey;
        const isToday = key === todayKey;
        const day = Number(key.slice(-2));
        const dotClass = attempt ? (attempt.correct ? "bg-teal-500" : "bg-rose-400") : "bg-slate-200";
        return <button
          key={i} type="button" onClick={() => onSelectDay(key)} disabled={!attempt}
          className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl text-xs font-bold transition ${isToday ? "ring-2 ring-teal-500" : ""} ${attempt ? "hover:bg-slate-50" : "cursor-default"} ${isFuture ? "text-slate-300" : "text-ink"}`}
        >
          {day}
          {!isFuture && <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />}
        </button>;
      })}
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-[11px] font-bold text-slate-500">
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-500" />Correct</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" />Incorrect</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-200" />Unattempted</span>
    </div>
  </>;
}

function CaseReview({ dateKey, attempt, onBack, onClose }: { dateKey: string; attempt: CaseAttempt; onBack: () => void; onClose: () => void }) {
  // dateKey is UTC-derived (toDateKey uses toISOString), so the lookup must
  // reconstruct UTC midnight too—parsing it as local midnight would shift
  // the day-index by one for any timezone ahead of UTC, pulling up the
  // wrong day's case (caught via live testing in a UTC+2 browser).
  const caseForDay = getCaseOfTheDay(new Date(`${dateKey}T00:00:00Z`));
  const [year, month, day] = dateKey.split("-").map(Number);
  const displayDate = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  return <>
    <div className="flex items-center justify-between">
      <button type="button" onClick={onBack} className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600"><ArrowLeft size={13} />Back to calendar</button>
      <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink" aria-label="Close"><X size={16} /></button>
    </div>
    <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-slate-400">{displayDate}</p>
    <h3 className="mt-1 text-lg font-extrabold text-ink">{caseForDay.title}</h3>
    <p className={`mt-2 text-sm font-extrabold ${attempt.correct ? "text-teal-700" : "text-rose-600"}`}>{attempt.correct ? "You got this correct." : "You missed this one."}</p>
    <div className="mt-4 space-y-2">
      {caseForDay.options.map((option, i) => {
        const isCorrect = i === caseForDay.correctIndex;
        const isSelected = i === attempt.selectedIndex;
        return <div key={i} className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-bold text-ink ${isCorrect ? "border-teal-500 bg-teal-50" : isSelected ? "border-rose-300 bg-rose-50" : "border-slate-100 opacity-60"}`}>
          <span>{option}</span>
          {isCorrect && <Check size={15} className="shrink-0 text-teal-600" />}
          {isSelected && !isCorrect && <X size={15} className="shrink-0 text-rose-500" />}
        </div>;
      })}
    </div>
    <p className="mt-4 text-xs leading-relaxed text-slate-500">{caseForDay.explanation}</p>
  </>;
}
