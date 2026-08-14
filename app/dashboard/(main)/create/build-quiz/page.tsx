"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, CheckSquare, ChevronDown, ChevronRight, HelpCircle, Minus, Search,
  Square, X
} from "lucide-react";
import { inputClass } from "@/components/ui";
import { PracticeQuiz, PracticeQuizItem } from "@/components/practice-quiz";
import { matchRealQuestions, mcatQuizSections, QuizSection, QuizTopic } from "@/lib/mcatQuizCurriculum";
import { SectionPracticeQuestion } from "@/lib/mcatConcepts";
import { logAttempt } from "@/lib/practiceHistory";
import { generateQuiz } from "@/lib/aiGenerate";
import { Difficulty as ApiDifficulty, GeneratedQuestion, saveQuiz } from "@/lib/create";

type Difficulty = "easy" | "medium" | "hard" | "adaptive";

function toApiDifficulty(d: Difficulty): ApiDifficulty | "Mixed" {
  if (d === "adaptive") return "Mixed";
  return (d.charAt(0).toUpperCase() + d.slice(1)) as ApiDifficulty;
}
type FormatId = "multiple-choice" | "passage" | "discrete";
type FocusId = "conceptual" | "application" | "calculations" | "memorization";

const difficultyOptions: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "Easy" }, { id: "medium", label: "Medium" }, { id: "hard", label: "Hard" }, { id: "adaptive", label: "Adaptive" }
];
const formatOptions: { id: FormatId; label: string; note?: string }[] = [
  { id: "multiple-choice", label: "Multiple choice" },
  { id: "passage", label: "Passage-based", note: "No passage content exists yet" },
  { id: "discrete", label: "Discrete questions" }
];
const focusOptions: { id: FocusId; label: string }[] = [
  { id: "conceptual", label: "Conceptual understanding" }, { id: "application", label: "Application" },
  { id: "calculations", label: "Calculations" }, { id: "memorization", label: "Memorization" }
];

function leafKey(sectionId: string, topicId: string, subtopicId?: string): string {
  return subtopicId ? `${sectionId}::${topicId}::${subtopicId}` : `${sectionId}::${topicId}`;
}

function toQuizItem(q: SectionPracticeQuestion): PracticeQuizItem {
  return { ...q.question, id: q.id, lessonTitle: q.lessonTitle };
}

function topicState(section: QuizSection, topic: QuizTopic, selected: Set<string>): "all" | "some" | "none" {
  if (!topic.subtopics || topic.subtopics.length === 0) return selected.has(leafKey(section.id, topic.id)) ? "all" : "none";
  const total = topic.subtopics.length;
  const count = topic.subtopics.filter(st => selected.has(leafKey(section.id, topic.id, st.id))).length;
  return count === 0 ? "none" : count === total ? "all" : "some";
}

function matchesQuery(name: string, query: string): boolean {
  return name.toLowerCase().includes(query.toLowerCase());
}

export default function BuildQuizPage() {
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [formats, setFormats] = useState<Set<FormatId>>(new Set<FormatId>(["multiple-choice"]));
  const [focus, setFocus] = useState<Set<FocusId>>(new Set<FocusId>(["conceptual", "application"]));

  const [generated, setGenerated] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<{ title: string; questions: PracticeQuizItem[] } | null>(null);

  // Real AI generation—calls /api/generate with the exact selected topics
  // once the student confirms their configuration below.
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<GeneratedQuestion[] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSaved, setAiSaved] = useState(false);

  function toggleSection(id: string) {
    setOpenSectionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleTopicExpanded(key: string) {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function toggleTopic(section: QuizSection, topic: QuizTopic) {
    const state = topicState(section, topic, selected);
    setSelected(prev => {
      const next = new Set(prev);
      if (!topic.subtopics || topic.subtopics.length === 0) {
        const key = leafKey(section.id, topic.id);
        if (next.has(key)) next.delete(key); else next.add(key);
        return next;
      }
      topic.subtopics.forEach(st => {
        const key = leafKey(section.id, topic.id, st.id);
        if (state === "all") next.delete(key); else next.add(key);
      });
      return next;
    });
  }

  function toggleSubtopic(section: QuizSection, topic: QuizTopic, subtopicId: string) {
    const key = leafKey(section.id, topic.id, subtopicId);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function selectAllInSection(section: QuizSection) {
    setSelected(prev => {
      const next = new Set(prev);
      section.topics.forEach(t => {
        if (!t.subtopics || t.subtopics.length === 0) next.add(leafKey(section.id, t.id));
        else t.subtopics.forEach(st => next.add(leafKey(section.id, t.id, st.id)));
      });
      return next;
    });
  }

  function clearSection(section: QuizSection) {
    setSelected(prev => {
      const next = new Set(prev);
      for (const key of Array.from(next)) if (key.startsWith(`${section.id}::`)) next.delete(key);
      return next;
    });
  }

  function clearAll() {
    setSelected(new Set());
  }

  function removeLeaf(key: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }

  function toggleFormat(id: FormatId) {
    setFormats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleFocus(id: FocusId) {
    setFocus(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // Grouped Section → Topic → subtopic-names, derived straight from the
  // selection set—single source of truth, no parallel state to drift.
  const selectionGroups = useMemo(() => {
    const groups: { section: QuizSection; items: { topic: QuizTopic; subtopicNames: string[] }[] }[] = [];
    for (const section of mcatQuizSections) {
      const items: { topic: QuizTopic; subtopicNames: string[] }[] = [];
      for (const t of section.topics) {
        if (!t.subtopics || t.subtopics.length === 0) {
          if (selected.has(leafKey(section.id, t.id))) items.push({ topic: t, subtopicNames: [] });
        } else {
          const names = t.subtopics.filter(st => selected.has(leafKey(section.id, t.id, st.id))).map(st => st.name);
          if (names.length > 0) items.push({ topic: t, subtopicNames: names });
        }
      }
      if (items.length > 0) groups.push({ section, items });
    }
    return groups;
  }, [selected]);

  const selectedLeafNames = useMemo(() => selectionGroups.flatMap(g => g.items.flatMap(i => i.subtopicNames.length > 0 ? i.subtopicNames : [i.topic.name])), [selectionGroups]);
  const totalSelected = selected.size;

  const matchedQuestions = useMemo(() => generated ? matchRealQuestions(selectedLeafNames) : [], [generated, selectedLeafNames]);

  function handleQuizAnswer(q: PracticeQuizItem, _index: number, correct: boolean) {
    logAttempt(q.id.split(":")[0], q.concept, correct, q.id);
  }

  function startMatchedQuiz() {
    setActiveQuiz({ title: "Custom Quiz", questions: matchedQuestions.map(toQuizItem) });
  }

  async function handleGenerateWithAI() {
    setAiGenerating(true);
    setAiError(null);
    setAiSaved(false);
    const result = await generateQuiz({ kind: "topics", topics: selectedLeafNames }, questionCount, toApiDifficulty(difficulty));
    setAiGenerating(false);
    if ("error" in result) { setAiError(result.error); return; }
    setAiQuestions(result.items);
  }

  function handleSaveAiQuiz() {
    if (!aiQuestions) return;
    saveQuiz(`Custom Quiz — ${selectedLeafNames[0] ?? "Multiple Topics"}${selectedLeafNames.length > 1 ? ` +${selectedLeafNames.length - 1} more` : ""}`, aiQuestions);
    setAiSaved(true);
  }

  if (activeQuiz) {
    return <PracticeQuiz
      questions={activeQuiz.questions}
      title={activeQuiz.title}
      completeLabel="Done"
      onAnswer={handleQuizAnswer}
      onComplete={() => setActiveQuiz(null)}
      defaultFullscreen
      onExit={() => setActiveQuiz(null)}
    />;
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><HelpCircle size={13} />Create a Quiz</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Create your quiz.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Choose exactly what you want to study. You can select multiple subjects and topics.</p>

    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      {/* Main column */}
      <div className="min-w-0 space-y-5">
        {generated
          ? <GeneratedResult
            groups={selectionGroups}
            questionCount={questionCount}
            difficulty={difficulty}
            formats={formats}
            focus={focus}
            matchedQuestions={matchedQuestions}
            onStartMatched={startMatchedQuiz}
            onEdit={() => setGenerated(false)}
            aiGenerating={aiGenerating}
            aiQuestions={aiQuestions}
            aiError={aiError}
            aiSaved={aiSaved}
            onGenerateAI={handleGenerateWithAI}
            onSaveAiQuiz={handleSaveAiQuiz}
          />
          : <>
            <div className="grid gap-4 sm:grid-cols-2">
              {mcatQuizSections.map(section => {
                const count = Array.from(selected).filter(key => key.startsWith(`${section.id}::`)).length;
                return <SectionCard key={section.id} section={section} open={openSectionIds.has(section.id)} onToggle={() => toggleSection(section.id)} count={count} />;
              })}
            </div>

            {openSectionIds.size > 0 && <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topics..." className={`${inputClass} pl-11`} />
            </div>}

            {mcatQuizSections.filter(s => openSectionIds.has(s.id)).map(section => <TopicTree
              key={section.id}
              section={section}
              search={search}
              expandedTopics={expandedTopics}
              selected={selected}
              onToggleExpanded={toggleTopicExpanded}
              onToggleTopic={toggleTopic}
              onToggleSubtopic={toggleSubtopic}
              onSelectAll={() => selectAllInSection(section)}
              onClearSection={() => clearSection(section)}
            />)}

            <QuizSettings
              questionCount={questionCount} setQuestionCount={setQuestionCount}
              difficulty={difficulty} setDifficulty={setDifficulty}
              formats={formats} onToggleFormat={toggleFormat}
              focus={focus} onToggleFocus={toggleFocus}
            />

            <PreviewCard groups={selectionGroups} questionCount={questionCount} difficulty={difficulty} totalSelected={totalSelected} onGenerate={() => setGenerated(true)} />
          </>}
      </div>

      {/* Persistent selection summary */}
      <aside className="space-y-5 lg:sticky lg:top-24">
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-tight text-heading">Your selection</h2>
            {totalSelected > 0 && <button type="button" onClick={clearAll} className="cursor-pointer text-[11px] font-bold text-slate-400 hover:text-rose-600">Clear all</button>}
          </div>

          {selectionGroups.length === 0
            ? <p className="mt-3 text-xs leading-relaxed text-slate-400">Nothing selected yet. Open a section and check the topics you want to be quizzed on.</p>
            : <div className="mt-3 max-h-[420px] space-y-4 overflow-y-auto pr-1">
              {selectionGroups.map(group => <div key={group.section.id}>
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-700">{group.section.shortName}</p>
                <div className="mt-1.5 space-y-2.5">
                  {group.items.map(item => <div key={item.topic.id}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-extrabold text-heading">{item.topic.name}</p>
                      <button type="button" onClick={() => { if (item.subtopicNames.length === 0) removeLeaf(leafKey(group.section.id, item.topic.id)); else item.topic.subtopics?.forEach(st => removeLeaf(leafKey(group.section.id, item.topic.id, st.id))); }} aria-label={`Remove ${item.topic.name}`} className="cursor-pointer rounded-full p-0.5 text-slate-300 hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-500"><X size={12} /></button>
                    </div>
                    {item.subtopicNames.length > 0 && <ul className="mt-1 space-y-1 pl-2">
                      {item.subtopicNames.map(name => {
                        const subtopicId = item.topic.subtopics?.find(st => st.name === name)?.id ?? "";
                        return <li key={name} className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1.5">· {name}</span>
                          <button type="button" onClick={() => removeLeaf(leafKey(group.section.id, item.topic.id, subtopicId))} aria-label={`Remove ${name}`} className="cursor-pointer rounded-full p-0.5 text-slate-300 hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-500"><X size={11} /></button>
                        </li>;
                      })}
                    </ul>}
                  </div>)}
                </div>
              </div>)}
            </div>}

          <p className="mt-4 border-t border-slate-100 dark:border-white/10 pt-3 text-xs font-bold text-slate-500">{totalSelected} topic{totalSelected === 1 ? "" : "s"} selected</p>
        </div>
      </aside>
    </div>
  </section>;
}

function SectionCard({ section, open, onToggle, count }: { section: QuizSection; open: boolean; onToggle: () => void; count: number }) {
  return <button
    type="button"
    onClick={onToggle}
    aria-expanded={open}
    className={`flex cursor-pointer flex-col rounded-3xl border p-6 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift ${open ? "border-teal-500 bg-teal-50/60 dark:bg-teal-500/15" : "border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917]"}`}
  >
    <div className="flex items-start justify-between gap-3">
      <h2 className="text-base font-extrabold leading-snug tracking-tight text-heading">{section.name}</h2>
      {open ? <ChevronDown size={18} className="mt-1 shrink-0 text-teal-600" /> : <ChevronRight size={18} className="mt-1 shrink-0 text-slate-300" />}
    </div>
    <p className="mt-2 text-xs leading-relaxed text-slate-500">{section.description}</p>
    {count > 0 && <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 px-2.5 py-1 text-[11px] font-extrabold text-teal-700">{count} selected</span>}
  </button>;
}

function TopicTree({ section, search, expandedTopics, selected, onToggleExpanded, onToggleTopic, onToggleSubtopic, onSelectAll, onClearSection }: {
  section: QuizSection;
  search: string;
  expandedTopics: Set<string>;
  selected: Set<string>;
  onToggleExpanded: (key: string) => void;
  onToggleTopic: (section: QuizSection, topic: QuizTopic) => void;
  onToggleSubtopic: (section: QuizSection, topic: QuizTopic, subtopicId: string) => void;
  onSelectAll: () => void;
  onClearSection: () => void;
}) {
  const query = search.trim();
  const visibleTopics = section.topics.filter(t => {
    if (!query) return true;
    if (matchesQuery(t.name, query)) return true;
    return !!t.subtopics?.some(st => matchesQuery(st.name, query));
  });

  return <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-soft sm:p-6">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-extrabold tracking-tight text-heading">{section.shortName}</h3>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSelectAll} className="cursor-pointer text-[11px] font-bold text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200">Select all</button>
        <button type="button" onClick={onClearSection} className="cursor-pointer text-[11px] font-bold text-slate-400 hover:text-rose-600">Clear</button>
      </div>
    </div>

    {visibleTopics.length === 0
      ? <p className="mt-3 text-xs text-slate-400">No topics match "{query}".</p>
      : <div className="mt-3 divide-y divide-slate-100">
        {visibleTopics.map(topic => {
          const topicKey = `${section.id}::${topic.id}`;
          const state = topicState(section, topic, selected);
          const forceOpen = !!query && (!matchesQuery(topic.name, query) && !!topic.subtopics?.some(st => matchesQuery(st.name, query)));
          const isExpanded = expandedTopics.has(topicKey) || forceOpen;
          const hasSubtopics = !!topic.subtopics && topic.subtopics.length > 0;
          const visibleSubtopics = topic.subtopics?.filter(st => !query || matchesQuery(st.name, query) || matchesQuery(topic.name, query)) ?? [];

          return <div key={topic.id} className="py-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={state === "all" ? "true" : state === "some" ? "mixed" : "false"}
                onClick={() => onToggleTopic(section, topic)}
                className={`grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded transition ${state === "all" ? "bg-teal-500 text-white" : state === "some" ? "border-2 border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600" : "border-2 border-slate-300 text-transparent hover:border-teal-300"}`}
              >{state === "all" ? <Check size={13} strokeWidth={3} /> : state === "some" ? <Minus size={12} strokeWidth={3} /> : null}</button>

              <button type="button" onClick={() => hasSubtopics && onToggleExpanded(topicKey)} className={`flex flex-1 cursor-pointer items-center justify-between gap-2 rounded-lg py-1 text-left ${hasSubtopics ? "" : "cursor-default"}`}>
                <span className="text-sm font-bold text-heading">{topic.name}</span>
                {hasSubtopics && (isExpanded ? <ChevronDown size={15} className="shrink-0 text-slate-400" /> : <ChevronRight size={15} className="shrink-0 text-slate-400" />)}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {hasSubtopics && isExpanded && <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden pl-7"
              >
                <div className="space-y-1.5 py-1.5">
                  {visibleSubtopics.map(st => {
                    const checked = selected.has(leafKey(section.id, topic.id, st.id));
                    return <button
                      key={st.id}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => onToggleSubtopic(section, topic, st.id)}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1 text-left transition hover:bg-slate-50 dark:bg-white/5"
                    >
                      <span className={`grid h-4 w-4 shrink-0 place-items-center rounded transition ${checked ? "bg-teal-500 text-white" : "border-2 border-slate-300 text-transparent"}`}>{checked && <Check size={11} strokeWidth={3} />}</span>
                      <span className="text-xs font-semibold text-slate-600">{st.name}</span>
                    </button>;
                  })}
                </div>
              </motion.div>}
            </AnimatePresence>
          </div>;
        })}
      </div>}
  </div>;
}

function QuizSettings({ questionCount, setQuestionCount, difficulty, setDifficulty, formats, onToggleFormat, focus, onToggleFocus }: {
  questionCount: number; setQuestionCount: (n: number) => void;
  difficulty: Difficulty; setDifficulty: (d: Difficulty) => void;
  formats: Set<FormatId>; onToggleFormat: (id: FormatId) => void;
  focus: Set<FocusId>; onToggleFocus: (id: FocusId) => void;
}) {
  return <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft">
    <h2 className="text-sm font-extrabold tracking-tight text-heading">Quiz settings</h2>

    <p className="mt-4 text-xs font-extrabold text-slate-500">Number of questions</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {[5, 10, 20, 30, 50].map(n => <button key={n} type="button" onClick={() => setQuestionCount(n)} className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${questionCount === n ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>{n}</button>)}
    </div>

    <p className="mt-5 text-xs font-extrabold text-slate-500">Difficulty</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {difficultyOptions.map(d => <button key={d.id} type="button" onClick={() => setDifficulty(d.id)} role="radio" aria-checked={difficulty === d.id} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${difficulty === d.id ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>
        <span className={`grid h-3.5 w-3.5 place-items-center rounded-full border-2 ${difficulty === d.id ? "border-teal-500" : "border-slate-300"}`}>{difficulty === d.id && <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />}</span>
        {d.label}
      </button>)}
    </div>

    <p className="mt-5 text-xs font-extrabold text-slate-500">Question format</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {formatOptions.map(f => <button key={f.id} type="button" onClick={() => onToggleFormat(f.id)} role="checkbox" aria-checked={formats.has(f.id)} title={f.note} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${formats.has(f.id) ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>
        {formats.has(f.id) ? <CheckSquare size={13} /> : <Square size={13} />}{f.label}{f.note && <span className="text-[10px] font-bold text-amber-600">(not written yet)</span>}
      </button>)}
    </div>

    <p className="mt-5 text-xs font-extrabold text-slate-500">Question focus</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {focusOptions.map(f => <button key={f.id} type="button" onClick={() => onToggleFocus(f.id)} role="checkbox" aria-checked={focus.has(f.id)} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${focus.has(f.id) ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200"}`}>
        {focus.has(f.id) ? <CheckSquare size={13} /> : <Square size={13} />}{f.label}
      </button>)}
    </div>
  </div>;
}

function PreviewCard({ groups, questionCount, difficulty, totalSelected, onGenerate }: {
  groups: { section: QuizSection; items: { topic: QuizTopic; subtopicNames: string[] }[] }[];
  questionCount: number; difficulty: Difficulty; totalSelected: number; onGenerate: () => void;
}) {
  const difficultyLabel = difficultyOptions.find(d => d.id === difficulty)?.label ?? "Medium";
  const allTopicNames = groups.flatMap(g => g.items.flatMap(i => i.subtopicNames.length > 0 ? i.subtopicNames : [i.topic.name]));

  return <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
    <h2 className="text-sm font-extrabold tracking-tight text-heading">Your quiz</h2>
    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-extrabold">
      <span className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-2.5 py-1 text-teal-700">{questionCount} questions</span>
      <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-slate-600">{difficultyLabel} difficulty</span>
      <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-slate-600">{totalSelected} topic{totalSelected === 1 ? "" : "s"}</span>
    </div>

    {groups.length === 0
      ? <p className="mt-4 text-sm text-slate-500">Select at least one topic above to preview your quiz.</p>
      : <div className="mt-4 space-y-3">
        {groups.map(g => <div key={g.section.id}>
          <p className="text-xs font-extrabold text-heading">MCAT {g.section.shortName}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {g.items.flatMap(i => i.subtopicNames.length > 0 ? i.subtopicNames : [i.topic.name]).map(name => <span key={name} className="rounded-full bg-[#f9fcfc] dark:bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-inset ring-slate-200">{name}</span>)}
          </div>
        </div>)}
      </div>}

    <button type="button" onClick={onGenerate} disabled={allTopicNames.length === 0} className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
      Generate Quiz<ArrowRight size={15} />
    </button>
  </div>;
}

const difficultyClasses: Record<"Easy" | "Medium" | "Hard", string> = {
  Easy: "bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300 text-emerald-700",
  Medium: "bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 text-amber-700",
  Hard: "bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 text-rose-700"
};

const genTypeLabels: Record<string, string> = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  "short-answer": "Short Answer",
  "clinical-scenario": "Clinical Scenario"
};

function GeneratedResult({
  groups, questionCount, difficulty, matchedQuestions, onStartMatched, onEdit,
  aiGenerating, aiQuestions, aiError, aiSaved, onGenerateAI, onSaveAiQuiz
}: {
  groups: { section: QuizSection; items: { topic: QuizTopic; subtopicNames: string[] }[] }[];
  questionCount: number; difficulty: Difficulty; formats: Set<FormatId>; focus: Set<FocusId>;
  matchedQuestions: SectionPracticeQuestion[];
  onStartMatched: () => void; onEdit: () => void;
  aiGenerating: boolean; aiQuestions: GeneratedQuestion[] | null; aiError: string | null; aiSaved: boolean;
  onGenerateAI: () => void; onSaveAiQuiz: () => void;
}) {
  const topicNames = groups.flatMap(g => g.items.flatMap(i => i.subtopicNames.length > 0 ? i.subtopicNames : [i.topic.name]));

  return <div className="space-y-5">
    <button type="button" onClick={onEdit} className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal-600"><ArrowLeft size={13} />Edit selection</button>

    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <h2 className="text-lg font-extrabold tracking-tight text-heading">Ready to generate.</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">A real AI call will write {questionCount} {difficulty === "adaptive" ? "mixed-difficulty" : difficulty} questions grounded in: {topicNames.join(", ")}.</p>

      {aiQuestions === null && <button type="button" onClick={onGenerateAI} disabled={aiGenerating} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60">
        {aiGenerating ? "Generating…" : "Generate Quiz with AI"}
      </button>}
      {aiError && <p className="mt-3 text-xs font-bold text-rose-600">{aiError}</p>}
    </div>

    {aiQuestions && aiQuestions.length > 0 && <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-heading">{aiQuestions.length} AI-generated question{aiQuestions.length === 1 ? "" : "s"}</h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onGenerateAI} disabled={aiGenerating} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60">{aiGenerating ? "Regenerating…" : "Regenerate"}</button>
          <button type="button" onClick={onSaveAiQuiz} disabled={aiSaved} className="cursor-pointer rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60">{aiSaved ? "Saved ✓" : "Save Quiz"}</button>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {aiQuestions.map((q, i) => <div key={i} className="rounded-2xl border border-slate-100 dark:border-white/10 bg-[#fbfdfd] dark:bg-black/20 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[10px] font-extrabold text-slate-600">{genTypeLabels[q.type] ?? q.type}</span>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${difficultyClasses[q.difficulty]}`}>{q.difficulty}</span>
          </div>
          <p className="mt-2.5 text-sm font-bold text-heading">{i + 1}. {q.question}</p>
          {q.options && <ul className="mt-2 space-y-1 pl-4 text-xs text-slate-500">{q.options.map(o => <li key={o} className={o === q.correctAnswer ? "font-extrabold text-teal-700" : ""}>{o}</li>)}</ul>}
          <p className="mt-2 text-xs leading-relaxed text-slate-500"><span className="font-extrabold text-teal-700">Answer:</span> {q.correctAnswer}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{q.explanation}</p>
        </div>)}
      </div>
    </div>}

    {matchedQuestions.length > 0 && <div className="rounded-3xl border border-teal-200 bg-teal-50/60 dark:bg-teal-500/15 p-6 shadow-soft sm:p-7">
      <h3 className="text-sm font-extrabold text-teal-800 dark:text-teal-300">Studium also already has {matchedQuestions.length} pre-written practice question{matchedQuestions.length === 1 ? "" : "s"} matching part of your selection.</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-teal-700/80">These are genuinely written questions, not AI-generated ones—matched by real topic tags on questions that already exist.</p>
      <button type="button" onClick={onStartMatched} className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Start with {matchedQuestions.length} Real Question{matchedQuestions.length === 1 ? "" : "s"}</button>
    </div>}
  </div>;
}
