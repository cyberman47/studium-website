"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Bookmark, Check, Clock3, Sparkles } from "lucide-react";
import { BrowsableLesson, getAllRealLessons, getLessonEntry } from "@/lib/mcatPath";
import { isInLibrary, LIBRARY_SAVES_EVENT, toggleLibrarySave } from "@/lib/myLibrary";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type DurationBucket = "under15" | "15to30" | "over30";
type SortOption = "title" | "duration" | "difficulty";

const durationBuckets: Record<DurationBucket, { label: string; test: (m: number) => boolean }> = {
  under15: { label: "Under 15 min", test: m => m < 15 },
  "15to30": { label: "15–30 min", test: m => m >= 15 && m <= 30 },
  over30: { label: "30+ min", test: m => m > 30 }
};

const difficultyRank: Record<Difficulty, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };

export default function AllLessonsPage() {
  const [lessons, setLessons] = useState<BrowsableLesson[]>([]);
  const [subject, setSubject] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [duration, setDuration] = useState<DurationBucket | null>(null);
  const [sort, setSort] = useState<SortOption>("title");
  const [savedVersion, setSavedVersion] = useState(0); // bump to re-render save buttons on toggle

  useEffect(() => {
    setLessons(getAllRealLessons());
    function bump() { setSavedVersion(v => v + 1); }
    window.addEventListener(LIBRARY_SAVES_EVENT, bump);
    return () => window.removeEventListener(LIBRARY_SAVES_EVENT, bump);
  }, []);

  const subjects = useMemo(() => Array.from(new Set(lessons.map(l => l.subjectName))).sort(), [lessons]);

  const filtered = useMemo(() => {
    let list = lessons;
    if (subject) list = list.filter(l => l.subjectName === subject);
    if (difficulty) list = list.filter(l => l.content.difficulty === difficulty);
    if (duration) list = list.filter(l => durationBuckets[duration].test(l.content.estimatedMinutes));
    const sorted = list.slice();
    if (sort === "title") sorted.sort((a, b) => a.content.title.localeCompare(b.content.title));
    else if (sort === "duration") sorted.sort((a, b) => a.content.estimatedMinutes - b.content.estimatedMinutes);
    else sorted.sort((a, b) => difficultyRank[a.content.difficulty] - difficultyRank[b.content.difficulty]);
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons, subject, difficulty, duration, sort]);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/library" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Library</Link>
    <span className="eyebrow"><BookOpen size={13} />All Lessons</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Every official lesson.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Real, hand-written Studium lessons—filter by subject, difficulty, or how long you have.</p>

    <div className="mt-8 flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => setSubject(null)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${!subject ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>All subjects</button>
      {subjects.map(s => <button key={s} type="button" onClick={() => setSubject(subject === s ? null : s)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${subject === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{s}</button>)}
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-2">
      {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map(d => <button key={d} type="button" onClick={() => setDifficulty(difficulty === d ? null : d)} className={`cursor-pointer rounded-full border px-3 py-1 text-[11px] font-bold transition ${difficulty === d ? "border-teal-400 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{d}</button>)}
      <span className="mx-1 h-4 w-px bg-slate-200" />
      {(Object.entries(durationBuckets) as [DurationBucket, typeof durationBuckets[DurationBucket]][]).map(([key, b]) => <button key={key} type="button" onClick={() => setDuration(duration === key ? null : key)} className={`cursor-pointer rounded-full border px-3 py-1 text-[11px] font-bold transition ${duration === key ? "border-teal-400 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{b.label}</button>)}
      <select value={sort} onChange={e => setSort(e.target.value as SortOption)} className="ml-auto cursor-pointer rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-extrabold text-ink outline-none focus:border-teal-400">
        <option value="title">Sort: A–Z</option>
        <option value="duration">Sort: Shortest first</option>
        <option value="difficulty">Sort: Easiest first</option>
      </select>
    </div>

    <p className="mt-4 text-xs font-bold text-slate-400">{filtered.length} lesson{filtered.length === 1 ? "" : "s"}</p>

    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.length === 0 && <p className="col-span-full py-16 text-center text-sm text-slate-400">No lessons match these filters.</p>}
      {filtered.map(l => <LessonCard key={l.content.id} lesson={l} saved={isInLibrary("lesson", l.content.id)} onToggleSave={() => toggleLibrarySave("lesson", l.content.id)} />)}
    </div>

    <p className="mt-8 text-xs leading-relaxed text-slate-400">More subjects and sections are on the way—every part of the curriculum is already browsable from <Link href="/dashboard/learning-paths/mcat" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Learning Paths</Link>, and lessons land here the moment they're written.</p>
  </section>;
}

function LessonCard({ lesson, saved, onToggleSave }: { lesson: BrowsableLesson; saved: boolean; onToggleSave: () => void }) {
  const { content, sectionTitle, subjectName } = lesson;
  const entry = getLessonEntry(content.id);
  return <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-600">{sectionTitle} · {subjectName}</p>
        <h3 className="mt-1 text-base font-extrabold tracking-tight text-ink">{content.title}</h3>
      </div>
      <button type="button" onClick={onToggleSave} title={saved ? "Remove from Library" : "Save to Library"} aria-pressed={saved} className={`grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full border transition ${saved ? "border-teal-500 bg-teal-50 text-teal-600" : "border-slate-200 text-slate-400 hover:border-teal-200 hover:text-teal-600"}`}>
        <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
      </button>
    </div>
    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{content.simplifiedExplanation}</p>
    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-400">
      <span className="flex items-center gap-1"><Clock3 size={12} />{content.estimatedMinutes} min</span>
      <span>·</span>
      <span>{content.difficulty}</span>
      {entry?.status === "completed" && <span className="ml-auto flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-extrabold text-teal-700"><Check size={11} />Completed</span>}
    </div>
    <Link href={`/dashboard/learning-paths/mcat/${content.sectionId}/${content.subjectId}/${content.id}`} className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">
      <Sparkles size={13} />{entry?.status === "completed" ? "Review Lesson" : "Start Lesson"}
    </Link>
  </div>;
}
