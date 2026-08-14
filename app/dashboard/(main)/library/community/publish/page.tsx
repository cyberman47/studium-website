"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Sparkles, Trash2 } from "lucide-react";
import { Field, inputClass } from "@/components/ui";
import { Difficulty, publishCommunityLesson, PUBLISH_CONCEPTS_MAX } from "@/lib/communityLessons";
import { getUser } from "@/lib/onboarding";
import { mcatSections } from "@/lib/mcatPath";

const subjectOptions = Array.from(new Set(mcatSections.flatMap(s => s.subjects.map(sub => sub.name)))).sort();

export default function PublishCommunityLessonPage() {
  const router = useRouter();
  // getUser() reads localStorage, unavailable during SSR—populate post-mount
  // only, same hydration-safety pattern used everywhere else in this app.
  const [signedIn, setSignedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSignedIn(!!getUser());
    setLoaded(true);
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pathName, setPathName] = useState("MCAT");
  const [subject, setSubject] = useState(subjectOptions[0] ?? "Biology");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [concepts, setConcepts] = useState<string[]>(["", ""]);

  const readyConcepts = concepts.map(c => c.trim()).filter(Boolean);
  const canPublish = title.trim().length > 0 && description.trim().length > 0 && readyConcepts.length > 0;

  function updateConcept(i: number, value: string) {
    setConcepts(prev => prev.map((c, idx) => idx === i ? value : c));
  }
  function addConcept() {
    if (concepts.length >= PUBLISH_CONCEPTS_MAX) return;
    setConcepts(prev => [...prev, ""]);
  }
  function removeConcept(i: number) {
    setConcepts(prev => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i));
  }

  function publish() {
    const lesson = publishCommunityLesson({ title, description, pathName, subject, difficulty, estimatedMinutes, concepts: readyConcepts });
    if (lesson) router.push(`/dashboard/library/community/${lesson.id}`);
  }

  if (!loaded) return null;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/library/community" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Community</Link>
    <span className="eyebrow"><Sparkles size={13} />Publish</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Publish a lesson.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Write a real study guide other students can preview and add to their own Library. You'll be credited as the creator.</p>

    {!signedIn
      ? <div className="mt-8 max-w-lg rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-8 text-center shadow-soft">
        <p className="text-sm font-extrabold text-heading">Sign in to publish</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Publishing credits the lesson to your real Studium profile, so you'll need to be signed in first.</p>
        <Link href="/login" className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Sign in</Link>
      </div>
      : <div className="mt-8 max-w-2xl space-y-5">
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
          <Field label="Title" required><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. High-Yield Genetics Review" className={inputClass} /></Field>
          <div className="mt-4"><Field label="Description" required><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What does this lesson cover, and who is it for?" className={`${inputClass} resize-none`} /></Field></div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Path"><input value={pathName} onChange={e => setPathName(e.target.value)} placeholder="MCAT" className={inputClass} /></Field>
            <Field label="Subject">
              <select value={subject} onChange={e => setSubject(e.target.value)} className={inputClass}>
                {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Difficulty">
              <select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} className={inputClass}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </Field>
          </div>

          <div className="mt-4 max-w-[160px]"><Field label="Estimated minutes"><input type="number" min={1} value={estimatedMinutes} onChange={e => setEstimatedMinutes(Math.max(1, Number(e.target.value) || 1))} className={inputClass} /></Field></div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
          <p className="text-sm font-extrabold text-heading">Contents</p>
          <p className="mt-1 text-xs text-slate-500">The list of concepts a student will see and can check off while studying—this is the real body of the lesson.</p>
          <div className="mt-4 space-y-2">
            {concepts.map((c, i) => <div key={i} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-xs font-extrabold text-slate-400">{i + 1}.</span>
              <input value={c} onChange={e => updateConcept(i, e.target.value)} placeholder={`Concept ${i + 1}`} className={inputClass} />
              <button type="button" onClick={() => removeConcept(i)} disabled={concepts.length === 1} title="Remove" className="shrink-0 cursor-pointer rounded-full p-2 text-slate-300 transition hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 size={14} /></button>
            </div>)}
          </div>
          <button type="button" onClick={addConcept} disabled={concepts.length >= PUBLISH_CONCEPTS_MAX} className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 py-2.5 text-xs font-bold text-slate-500 transition hover:border-teal-300 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={14} />Add a concept</button>
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={publish} disabled={!canPublish} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"><Sparkles size={15} />Publish Lesson</button>
        </div>
      </div>}
  </section>;
}
