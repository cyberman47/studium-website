"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Bookmark, FileText, Globe, Layers, Link2, TriangleAlert, X } from "lucide-react";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";
import { getLibrarySaves, LIBRARY_SAVES_EVENT, LibrarySave, removeFromLibrary } from "@/lib/myLibrary";
import { getLessonContent } from "@/lib/mcatPath";
import { getCommunityLesson } from "@/lib/communityLessons";
import { getArticle } from "@/lib/articles";
import { getResource } from "@/lib/resources";
import { getAllMcatPracticeQuestions, SectionPracticeQuestion } from "@/lib/mcatConcepts";
import { mcatSections } from "@/lib/mcatPath";
import { getMissedQuestionIds, getSavedQuestionIds, logAttempt } from "@/lib/practiceHistory";
import { getSavedHighlights, removeSavedHighlight, SavedHighlight } from "@/lib/savedHighlights";
import { getPersonalFlashcards, PERSONAL_FLASHCARDS_EVENT, PersonalFlashcard, removePersonalFlashcard } from "@/lib/personalFlashcards";
import { BOOKMARKED_CARDS_EVENT, BookmarkedCard, getAllBookmarkedCards, toggleBookmarkedCard } from "@/lib/mcatPath";

function toQuizItem(q: SectionPracticeQuestion): PracticeQuizItem {
  return { ...q.question, id: q.id, lessonTitle: q.lessonTitle };
}

type ActiveQuiz = { title: string; questions: PracticeQuizItem[] } | null;

export default function SavedLibraryPage() {
  const [loaded, setLoaded] = useState(false);
  const [saves, setSaves] = useState<LibrarySave[]>([]);
  const [missedQuestionIds, setMissedQuestionIds] = useState<string[]>([]);
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<SavedHighlight[]>([]);
  const [personalCards, setPersonalCards] = useState<PersonalFlashcard[]>([]);
  const [bookmarkedCards, setBookmarkedCards] = useState<BookmarkedCard[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz>(null);

  const allQuestions = useMemo(() => getAllMcatPracticeQuestions(), []);

  function refresh() {
    setSaves(getLibrarySaves());
    setMissedQuestionIds(getMissedQuestionIds());
    setSavedQuestionIds(getSavedQuestionIds());
    setHighlights(getSavedHighlights());
    setPersonalCards(getPersonalFlashcards());
    setBookmarkedCards(getAllBookmarkedCards());
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
    window.addEventListener(LIBRARY_SAVES_EVENT, refresh);
    window.addEventListener(PERSONAL_FLASHCARDS_EVENT, refresh);
    window.addEventListener(BOOKMARKED_CARDS_EVENT, refresh);
    return () => {
      window.removeEventListener(LIBRARY_SAVES_EVENT, refresh);
      window.removeEventListener(PERSONAL_FLASHCARDS_EVENT, refresh);
      window.removeEventListener(BOOKMARKED_CARDS_EVENT, refresh);
    };
  }, []);

  const resolvedBookmarks = useMemo(() => bookmarkedCards
    .map(b => {
      const lesson = getLessonContent(b.lessonId);
      const card = lesson?.flashcards[b.cardIndex];
      return card ? { ...b, card, lesson } : null;
    })
    .filter((x): x is { lessonId: string; cardIndex: number; card: { front: string; back: string }; lesson: NonNullable<ReturnType<typeof getLessonContent>> } => !!x),
    [bookmarkedCards]);

  const lessonSaves = saves.filter(s => s.contentType === "lesson").map(s => ({ save: s, content: getLessonContent(s.contentId) })).filter(x => x.content);
  const communitySaves = saves.filter(s => s.contentType === "community-lesson").map(s => ({ save: s, content: getCommunityLesson(s.contentId) })).filter(x => x.content);
  const articleSaves = saves.filter(s => s.contentType === "article").map(s => ({ save: s, content: getArticle(s.contentId) })).filter(x => x.content);
  const resourceSaves = saves.filter(s => s.contentType === "resource").map(s => ({ save: s, content: getResource(s.contentId) })).filter(x => x.content);

  const savedQuestions = useMemo(() => {
    const ids = new Set(savedQuestionIds);
    return allQuestions.filter(q => ids.has(q.id));
  }, [allQuestions, savedQuestionIds]);
  const filteredSavedQuestions = useMemo(
    () => subjectFilter ? savedQuestions.filter(q => q.sectionId === subjectFilter) : savedQuestions,
    [savedQuestions, subjectFilter]
  );

  function handleQuizAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    logAttempt(q.id.split(":")[0], q.concept, correct, q.id);
  }
  function openSavedQuestions() {
    setActiveQuiz({ title: "Saved Questions", questions: filteredSavedQuestions.map(toQuizItem) });
  }
  function openMistakeVault() {
    const ids = new Set(missedQuestionIds);
    setActiveQuiz({ title: "Mistake Vault", questions: allQuestions.filter(q => ids.has(q.id)).map(toQuizItem) });
  }

  if (!loaded) return null;

  if (activeQuiz) {
    return <PracticeQuiz
      questions={activeQuiz.questions}
      title={activeQuiz.title}
      completeLabel="Done"
      onAnswer={handleQuizAnswer}
      onComplete={() => { setActiveQuiz(null); refresh(); }}
      defaultFullscreen
      onExit={() => setActiveQuiz(null)}
    />;
  }

  const totalMain = lessonSaves.length + communitySaves.length + articleSaves.length + resourceSaves.length;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/library" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Library</Link>
    <span className="eyebrow"><Bookmark size={13} />Saved</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">My Library.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Everything you've saved—official Studium content and community content together.</p>

    {totalMain === 0
      ? <div className="mt-10 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-10 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><Bookmark size={26} /></span>
        <p className="mt-4 text-base font-extrabold text-heading">Your Library is empty.</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">Save lessons from Studium or discover something from the Community.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard/library/lessons" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600"><BookOpen size={15} />Explore Lessons</Link>
          <Link href="/dashboard/library/community" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] px-6 py-3 text-sm font-bold text-heading transition hover:-translate-y-0.5 hover:border-teal-200"><Globe size={15} />Explore Community</Link>
        </div>
      </div>
      : <div className="mt-8 space-y-10">
        {lessonSaves.length > 0 && <div>
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-400"><BookOpen size={14} />Official Studium</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lessonSaves.map(({ content }) => content && <div key={content.id} className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-600">Studium</p>
              <Link href={`/dashboard/learning-paths/mcat/${content.sectionId}/${content.subjectId}/${content.id}`} className="mt-1 cursor-pointer text-sm font-extrabold text-heading hover:text-teal-700">{content.title}</Link>
              <p className="mt-1 text-xs text-slate-500">{content.estimatedMinutes} min · {content.difficulty}</p>
              <button type="button" onClick={() => removeFromLibrary("lesson", content.id)} className="mt-3 self-start text-[11px] font-bold text-slate-400 hover:text-rose-600">Remove</button>
            </div>)}
          </div>
        </div>}

        {communitySaves.length > 0 && <div>
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-400"><Globe size={14} />Community</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {communitySaves.map(({ content }) => content && <div key={content.id} className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-[#fdfefe] dark:bg-[#0d1917] p-4 shadow-soft">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-violet-600">Community · by {content.creatorName}</p>
              <Link href={`/dashboard/library/community/${content.id}`} className="mt-1 cursor-pointer text-sm font-extrabold text-heading hover:text-teal-700">{content.title}</Link>
              <p className="mt-1 text-xs text-slate-500">{content.estimatedMinutes} min · {content.concepts.length} concepts</p>
              <button type="button" onClick={() => removeFromLibrary("community-lesson", content.id)} className="mt-3 self-start text-[11px] font-bold text-slate-400 hover:text-rose-600">Remove</button>
            </div>)}
          </div>
        </div>}

        {articleSaves.length > 0 && <div>
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-400"><FileText size={14} />Articles</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {articleSaves.map(({ content }) => content && <div key={content.id} className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft">
              <Link href={`/dashboard/library/articles/${content.id}`} className="cursor-pointer text-sm font-extrabold text-heading hover:text-teal-700">{content.title}</Link>
              <p className="mt-1 text-xs text-slate-500">{content.topic} · {content.readingMinutes} min read</p>
              <button type="button" onClick={() => removeFromLibrary("article", content.id)} className="mt-3 self-start text-[11px] font-bold text-slate-400 hover:text-rose-600">Remove</button>
            </div>)}
          </div>
        </div>}

        {resourceSaves.length > 0 && <div>
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-400"><Link2 size={14} />Resources</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {resourceSaves.map(({ content }) => content && <div key={content.id} className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft">
              <a href={content.url} target="_blank" rel="noreferrer" className="cursor-pointer text-sm font-extrabold text-heading hover:text-teal-700">{content.title}</a>
              <p className="mt-1 text-xs text-slate-500">{content.type} · {content.source}</p>
              <button type="button" onClick={() => removeFromLibrary("resource", content.id)} className="mt-3 self-start text-[11px] font-bold text-slate-400 hover:text-rose-600">Remove</button>
            </div>)}
          </div>
        </div>}
      </div>}

    {/* Real pre-existing saved content that doesn't fit the lesson-shaped
        model above—kept reachable, not deleted. */}
    <div id="flagged" className="mt-14 scroll-mt-24 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold tracking-tight">Flagged Practice Questions</h3>
          <p className="mt-1 text-xs text-slate-500">Questions you've bookmarked with the flag icon while practicing.</p>
        </div>
        <button type="button" onClick={openSavedQuestions} disabled={filteredSavedQuestions.length === 0} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40">Practice Saved Questions</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setSubjectFilter(null)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${subjectFilter === null ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>All Subjects</button>
        {mcatSections.map(s => <button key={s.id} type="button" onClick={() => setSubjectFilter(s.id)} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${subjectFilter === s.id ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{s.shortTitle}</button>)}
      </div>
      <div className="mt-4">
        {filteredSavedQuestions.length === 0
          ? <p className="text-sm text-slate-500">No flagged questions{subjectFilter ? " in this subject" : " yet"}—flag one with the bookmark icon while practicing.</p>
          : <div className="space-y-2">
            {filteredSavedQuestions.map(q => <div key={q.id} className="rounded-2xl border border-slate-100 dark:border-white/10 p-4">
              <p className="line-clamp-2 text-sm font-bold text-heading">{q.question.question}</p>
              <p className="mt-1.5 text-[11px] font-bold text-slate-400">{mcatSections.find(s => s.id === q.sectionId)?.shortTitle ?? q.sectionId} · {q.question.concept}</p>
            </div>)}
          </div>}
      </div>
    </div>

    <div id="mistakes" className="mt-5 scroll-mt-24 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300 text-rose-600"><TriangleAlert size={20} /></span>
        <div>
          <h3 className="text-base font-extrabold text-heading">Mistake Vault</h3>
          <p className="mt-0.5 text-xs text-slate-500">Auto-collected—every question whose most recent attempt was wrong.</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <p className="text-2xl font-extrabold text-heading">{missedQuestionIds.length}</p>
        <button type="button" onClick={openMistakeVault} disabled={missedQuestionIds.length === 0} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40">Practice Mistakes</button>
      </div>
    </div>

    <div className="mt-5 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold tracking-tight">My Flashcards</h3>
          <p className="mt-1 text-xs text-slate-500">Cards you've created from highlighted lesson text.</p>
        </div>
        {personalCards.length > 0 && <Link href="/dashboard/ai-tutor" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-heading transition hover:-translate-y-0.5 hover:border-teal-200"><Layers size={13} />Review in Studium AI</Link>}
      </div>
      {personalCards.length === 0
        ? <p className="mt-4 text-sm text-slate-500">Nothing here yet—select text in a lesson and choose "Create Flashcard" to add one.</p>
        : <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {personalCards.map(c => <div key={c.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 dark:border-white/10 p-4">
            <div className="min-w-0">
              <p className="text-sm font-bold leading-relaxed text-heading">{c.front}</p>
              {c.back && <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{c.back}</p>}
              <p className="mt-2 text-[11px] font-bold text-slate-400">From {c.sourceLessonTitle}</p>
            </div>
            <button type="button" onClick={() => { removePersonalFlashcard(c.id); refresh(); }} className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-full p-1.5 text-slate-300 hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-600" aria-label="Remove"><X size={14} /></button>
          </div>)}
        </div>}
    </div>

    <div className="mt-5 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <h3 className="text-base font-extrabold tracking-tight">Bookmarked Flashcards</h3>
      <p className="mt-1 text-xs text-slate-500">Cards you've starred while reviewing a lesson's flashcard step.</p>
      {resolvedBookmarks.length === 0
        ? <p className="mt-4 text-sm text-slate-500">Nothing bookmarked yet—tap the star on a flashcard during a lesson to collect it here.</p>
        : <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {resolvedBookmarks.map(({ lessonId, cardIndex, card, lesson }) => <div key={`${lessonId}:${cardIndex}`} className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 dark:border-white/10 p-4">
            <div className="min-w-0">
              <p className="text-sm font-bold leading-relaxed text-heading">{card.front}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{card.back}</p>
              <Link href={`/dashboard/learning-paths/mcat/${lesson.sectionId}/${lesson.subjectId}/${lessonId}`} className="mt-2 inline-block cursor-pointer text-[11px] font-bold text-teal-600 hover:text-teal-700">{lesson.title} →</Link>
            </div>
            <button type="button" onClick={() => { toggleBookmarkedCard(lessonId, cardIndex); refresh(); }} className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-full p-1.5 text-slate-300 hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-600" aria-label="Remove bookmark"><X size={14} /></button>
          </div>)}
        </div>}
    </div>

    <div className="mt-5 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <h3 className="text-base font-extrabold tracking-tight">Saved Explanations</h3>
      <p className="mt-1 text-xs text-slate-500">Highlights you've saved with ⭐ while reading a lesson.</p>
      {highlights.length === 0
        ? <p className="mt-4 text-sm text-slate-500">Nothing saved yet—select text in a lesson and choose "Save" to add it here.</p>
        : <div className="mt-4 space-y-2.5">
          {highlights.map(h => <div key={h.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 dark:border-white/10 p-4">
            <div className="min-w-0"><p className="text-sm leading-relaxed text-heading">&ldquo;{h.text}&rdquo;</p><p className="mt-2 text-[11px] font-bold text-slate-400">From {h.sourceLessonTitle}</p></div>
            <button type="button" onClick={() => { removeSavedHighlight(h.id); refresh(); }} className="shrink-0 cursor-pointer rounded-full p-1.5 text-slate-300 hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-600" aria-label="Remove"><X size={14} /></button>
          </div>)}
        </div>}
    </div>
  </section>;
}
