"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock3, Globe, Layers, Plus, User } from "lucide-react";
import { CommunityLesson } from "@/lib/communityLessons";
import { isInLibrary, LIBRARY_SAVES_EVENT } from "@/lib/myLibrary";

// Shared card for any Community-lesson grid (discovery page, My Library,
// Recently Added, search results)—one real save-state source
// (lib/myLibrary.ts) so the button never drifts out of sync between views.
export function CommunityLessonCard({ lesson, onSave, onUnsave }: { lesson: CommunityLesson; onSave: (id: string) => void; onUnsave: (id: string) => void }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(isInLibrary("community-lesson", lesson.id));
    function refresh() { setSaved(isInLibrary("community-lesson", lesson.id)); }
    window.addEventListener(LIBRARY_SAVES_EVENT, refresh);
    return () => window.removeEventListener(LIBRARY_SAVES_EVENT, refresh);
  }, [lesson.id]);

  return <div className="flex flex-col rounded-3xl border border-slate-200 dark:border-white/10 bg-[#fdfefe] dark:bg-[#0d1917] p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
    <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-violet-600"><Globe size={12} />Community · {lesson.pathName} · {lesson.subject}</div>
    <Link href={`/dashboard/library/community/${lesson.id}`} className="mt-1.5 cursor-pointer text-base font-extrabold tracking-tight text-heading hover:text-teal-700">{lesson.title}</Link>
    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{lesson.description}</p>
    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-slate-500"><span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500"><User size={10} /></span>Created by {lesson.creatorName}</div>
    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-400">
      <span className="flex items-center gap-1"><Clock3 size={12} />{lesson.estimatedMinutes} min</span>
      <span>·</span>
      <span className="flex items-center gap-1"><Layers size={12} />{lesson.concepts.length} concepts</span>
      <span>·</span>
      <span>{lesson.difficulty}</span>
      {lesson.saveCount > 0 && <span className="ml-auto text-teal-600">Saved by {lesson.saveCount}</span>}
    </div>
    <div className="mt-4 flex gap-2">
      <Link href={`/dashboard/library/community/${lesson.id}`} className="flex-1 cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2.5 text-center text-xs font-bold text-heading transition hover:border-teal-200 hover:bg-white dark:bg-[#0d1917]">Preview</Link>
      {saved
        ? <button type="button" onClick={() => onUnsave(lesson.id)} className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-4 py-2.5 text-xs font-bold text-teal-700"><Check size={13} />In My Library</button>
        : <button type="button" onClick={() => onSave(lesson.id)} className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-accent-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><Plus size={13} />Add to My Library</button>}
    </div>
  </div>;
}
