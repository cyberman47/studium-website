"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Clock3, Globe, Square, CheckSquare, Trash2, User } from "lucide-react";
import {
  addCommunityLessonToLibrary, CommunityLesson, COMMUNITY_LESSON_PROGRESS_EVENT, COMMUNITY_LESSONS_EVENT,
  deleteCommunityLesson, getCommunityLesson, getCommunityLessonPercent, getCommunityLessonProgress,
  removeCommunityLessonFromLibrary, toggleCommunityConcept
} from "@/lib/communityLessons";
import { isInLibrary, LIBRARY_SAVES_EVENT } from "@/lib/myLibrary";
import { getUser } from "@/lib/onboarding";

export default function CommunityLessonDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<CommunityLesson | null | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function refresh() {
    const l = getCommunityLesson(params.id);
    setLesson(l ?? null);
    setSaved(isInLibrary("community-lesson", params.id));
    setChecked(new Set(getCommunityLessonProgress(params.id)?.checkedConcepts ?? []));
  }

  useEffect(() => {
    refresh();
    window.addEventListener(COMMUNITY_LESSONS_EVENT, refresh);
    window.addEventListener(LIBRARY_SAVES_EVENT, refresh);
    window.addEventListener(COMMUNITY_LESSON_PROGRESS_EVENT, refresh);
    return () => {
      window.removeEventListener(COMMUNITY_LESSONS_EVENT, refresh);
      window.removeEventListener(LIBRARY_SAVES_EVENT, refresh);
      window.removeEventListener(COMMUNITY_LESSON_PROGRESS_EVENT, refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (lesson === undefined) return null;

  if (lesson === null) return <section className="relative py-10 sm:py-14">
    <p className="text-sm text-slate-500">This lesson isn't available—it may have been removed by its creator.</p>
    <Link href="/dashboard/library/community" className="mt-3 inline-block cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">← Back to Community</Link>
  </section>;

  const isMine = getUser()?.username === lesson.creatorUsername;
  const percent = getCommunityLessonPercent(lesson.id, lesson.concepts.length);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/library/community" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Community</Link>

    <div className="mx-auto max-w-2xl">
      <span className="eyebrow"><Globe size={13} />Community · {lesson.pathName} · {lesson.subject}</span>
      <h1 className="display mt-5 text-3xl leading-tight sm:text-4xl">{lesson.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
        <span className="flex items-center gap-1.5"><span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-500"><User size={12} /></span>Created by {lesson.creatorName}</span>
        <span className="flex items-center gap-1.5"><Clock3 size={14} />{lesson.estimatedMinutes} minutes</span>
        <span>{lesson.concepts.length} concepts</span>
        <span>{lesson.difficulty}</span>
      </div>

      <p className="mt-5 text-base leading-relaxed text-slate-600">{lesson.description}</p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {saved
          ? <button type="button" onClick={() => removeCommunityLessonFromLibrary(lesson.id)} className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-teal-500 bg-teal-50 px-6 py-3 text-sm font-bold text-teal-700"><Check size={16} />In My Library</button>
          : <button type="button" onClick={() => addCommunityLessonToLibrary(lesson.id)} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">+ Add to My Library</button>}
        {isMine && <button
          type="button"
          onClick={() => { if (confirm(`Delete "${lesson.title}"? This removes it for everyone who has it saved.`)) { deleteCommunityLesson(lesson.id); router.push("/dashboard/library/community"); } }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-rose-200 px-5 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
        ><Trash2 size={15} />Delete</button>}
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-extrabold tracking-tight text-ink">Contents</h2>
          {saved && <p className="text-xs font-bold text-slate-400">{checked.size} / {lesson.concepts.length} · {percent}%</p>}
        </div>
        {saved && <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${percent}%` }} /></div>}

        <div className="mt-4 space-y-1.5">
          {lesson.concepts.map((concept, i) => {
            const isChecked = checked.has(i);
            if (!saved) return <div key={i} className="flex items-center gap-3 rounded-2xl px-3 py-2.5"><span className="w-5 shrink-0 text-xs font-extrabold text-slate-400">{i + 1}.</span><p className="text-sm font-semibold text-ink">{concept}</p></div>;
            return <button key={i} type="button" onClick={() => toggleCommunityConcept(lesson.id, i)} className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${isChecked ? "bg-teal-50" : "hover:bg-slate-50"}`}>
              {isChecked ? <CheckSquare size={17} className="shrink-0 text-teal-600" /> : <Square size={17} className="shrink-0 text-slate-300" />}
              <p className={`text-sm font-semibold ${isChecked ? "text-teal-800 line-through decoration-teal-300" : "text-ink"}`}>{concept}</p>
            </button>;
          })}
        </div>
        {!saved && <p className="mt-4 text-xs leading-relaxed text-slate-400">Add this to your Library to check off concepts as you study and track your own progress through it.</p>}
      </div>
    </div>
  </section>;
}
