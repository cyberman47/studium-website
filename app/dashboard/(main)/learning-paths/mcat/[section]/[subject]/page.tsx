"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Lock, PlayCircle, Sparkles } from "lucide-react";
import { findSubject, getLessonContent, getLessonStatus, getSubjectProgress, LessonStatus, SubjectProgress } from "@/lib/mcatPath";

export default function MCATSubjectPage({ params }: { params: { section: string; subject: string } }) {
  const subject = findSubject(params.section, params.subject);
  const lessonIds = subject?.lessons.map(l => l.id) ?? [];
  const [statuses, setStatuses] = useState<Record<string, LessonStatus>>({});
  const [progress, setProgress] = useState<SubjectProgress | null>(null);

  useEffect(() => {
    if (!subject) return;
    const next: Record<string, LessonStatus> = {};
    for (const id of lessonIds) next[id] = getLessonStatus(lessonIds, id);
    setStatuses(next);
    setProgress(getSubjectProgress(lessonIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.subject]);

  if (!subject) {
    return <section className="relative py-10 sm:py-14">
      <p className="text-sm text-slate-500">Subject not found.</p>
      <Link href={`/dashboard/learning-paths/mcat/${params.section}`} className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back</Link>
    </section>;
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href={`/dashboard/learning-paths/mcat/${params.section}`} className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600">← Back</Link>
    <span className="eyebrow"><Sparkles size={13} />MCAT</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{subject.name}.</h1>

    {lessonIds.length === 0
      ? <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center shadow-soft">
        <p className="text-base font-extrabold text-ink">This subject's lessons are still being written.</p>
        <p className="max-w-xs text-sm leading-relaxed text-slate-500">Check back soon—Biology is fully built out as a preview of what's coming.</p>
      </div>
      : <>
        {progress && <p className="mt-4 text-sm font-bold text-slate-500">{progress.completed} / {progress.total} lessons complete · {progress.hoursRemaining} hrs remaining</p>}
        <div className="relative mt-10 max-w-lg">
          <div className="absolute bottom-6 left-[19px] top-6 w-px bg-slate-200" aria-hidden="true" />
          <div className="space-y-3">
            {subject.lessons.map(lesson => {
              const status = statuses[lesson.id];
              const content = getLessonContent(lesson.id);
              const locked = status === "locked" || !status;
              const completed = status === "completed";
              const row = <div className={`relative flex items-center gap-4 rounded-2xl border p-4 transition ${locked ? "border-slate-100 bg-slate-50" : completed ? "border-teal-100 bg-white shadow-soft hover:-translate-y-0.5 hover:shadow-lift" : "border-teal-500 bg-teal-50 shadow-soft hover:-translate-y-0.5 hover:shadow-lift"}`}>
                <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-[#fcfdfd] ${completed ? "bg-teal-500 text-white" : locked ? "bg-slate-200 text-slate-400" : "bg-accent-500 text-white"}`}>
                  {completed ? <Check size={16} strokeWidth={3} /> : locked ? <Lock size={14} /> : <PlayCircle size={18} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold ${locked ? "text-slate-400" : "text-ink"}`}>{lesson.title}</p>
                  <p className="text-xs text-slate-500">{completed ? `Completed · ${content?.difficulty}` : locked ? "Locked" : `${content?.estimatedMinutes ?? 20} min · ${content?.difficulty ?? "Beginner"}`}</p>
                </div>
              </div>;
              return locked
                ? <div key={lesson.id}>{row}</div>
                : <Link key={lesson.id} href={`/dashboard/learning-paths/mcat/${params.section}/${params.subject}/${lesson.id}`}>{row}</Link>;
            })}
          </div>
        </div>
      </>}
  </section>;
}
