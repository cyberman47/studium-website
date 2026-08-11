"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Layers, Minus, Search, Sparkles, X } from "lucide-react";
import { inputClass } from "@/components/ui";
import { mcatQuizSections, QuizSection, QuizTopic } from "@/lib/mcatQuizCurriculum";
import { generateFlashcards, setPendingFlashcards } from "@/lib/aiGenerate";
import { Difficulty as ApiDifficulty } from "@/lib/create";

type Difficulty = "easy" | "medium" | "hard" | "mixed";

const difficultyOptions: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "Easy" }, { id: "medium", label: "Medium" }, { id: "hard", label: "Hard" }, { id: "mixed", label: "Mixed" }
];

function toApiDifficulty(d: Difficulty): ApiDifficulty | "Mixed" {
  if (d === "mixed") return "Mixed";
  return (d.charAt(0).toUpperCase() + d.slice(1)) as ApiDifficulty;
}

function leafKey(sectionId: string, topicId: string, subtopicId?: string): string {
  return subtopicId ? `${sectionId}::${topicId}::${subtopicId}` : `${sectionId}::${topicId}`;
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

export default function BuildFlashcardsPage() {
  const router = useRouter();
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const [count, setCount] = useState(12);
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");

  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  function toggleSection(id: string) {
    setOpenSectionIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  function toggleTopicExpanded(key: string) {
    setExpandedTopics(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
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
    setSelected(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
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

  function removeLeaf(key: string) {
    setSelected(prev => { const next = new Set(prev); next.delete(key); return next; });
  }

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

  async function handleGenerate() {
    setGenerating(true);
    setGenError(null);
    const result = await generateFlashcards({ kind: "topics", topics: selectedLeafNames }, count, toApiDifficulty(difficulty));
    setGenerating(false);
    if ("error" in result) { setGenError(result.error); return; }
    const label = selectedLeafNames.length === 1 ? selectedLeafNames[0] : `${selectedLeafNames[0]} +${selectedLeafNames.length - 1} more`;
    setPendingFlashcards(result.items, label);
    router.push("/dashboard/create/flashcards");
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <Link href="/dashboard/create" className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to Create</Link>
    <span className="eyebrow"><Layers size={13} />Create Flashcards</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Build a flashcard deck.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Choose exactly what you want to study. Real AI-generated cards, grounded in your selected topics.</p>

    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="min-w-0 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {mcatQuizSections.map(section => {
            const count2 = Array.from(selected).filter(key => key.startsWith(`${section.id}::`)).length;
            return <SectionCard key={section.id} section={section} open={openSectionIds.has(section.id)} onToggle={() => toggleSection(section.id)} count={count2} />;
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

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-sm font-extrabold tracking-tight text-ink">Deck settings</h2>
          <p className="mt-4 text-xs font-extrabold text-slate-500">Number of cards</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[5, 12, 20, 30].map(n => <button key={n} type="button" onClick={() => setCount(n)} className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${count === n ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>{n}</button>)}
          </div>
          <p className="mt-5 text-xs font-extrabold text-slate-500">Difficulty</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {difficultyOptions.map(d => <button key={d.id} type="button" onClick={() => setDifficulty(d.id)} role="radio" aria-checked={difficulty === d.id} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-extrabold transition ${difficulty === d.id ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:border-teal-200"}`}>
              <span className={`grid h-3.5 w-3.5 place-items-center rounded-full border-2 ${difficulty === d.id ? "border-teal-500" : "border-slate-300"}`}>{difficulty === d.id && <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />}</span>
              {d.label}
            </button>)}
          </div>
        </div>

        {genError && <p className="text-xs font-bold text-rose-600">{genError}</p>}
        <button type="button" onClick={handleGenerate} disabled={selectedLeafNames.length === 0 || generating} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
          {generating ? "Generating…" : <>Generate Flashcards with AI<Sparkles size={15} /></>}
        </button>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-tight text-ink">Your selection</h2>
            {totalSelected > 0 && <button type="button" onClick={() => setSelected(new Set())} className="cursor-pointer text-[11px] font-bold text-slate-400 hover:text-rose-600">Clear all</button>}
          </div>

          {selectionGroups.length === 0
            ? <p className="mt-3 text-xs leading-relaxed text-slate-400">Nothing selected yet. Open a section and check the topics you want cards for.</p>
            : <div className="mt-3 max-h-[420px] space-y-4 overflow-y-auto pr-1">
              {selectionGroups.map(group => <div key={group.section.id}>
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-700">{group.section.shortName}</p>
                <div className="mt-1.5 space-y-2.5">
                  {group.items.map(item => <div key={item.topic.id}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-extrabold text-ink">{item.topic.name}</p>
                      <button type="button" onClick={() => { if (item.subtopicNames.length === 0) removeLeaf(leafKey(group.section.id, item.topic.id)); else item.topic.subtopics?.forEach(st => removeLeaf(leafKey(group.section.id, item.topic.id, st.id))); }} aria-label={`Remove ${item.topic.name}`} className="cursor-pointer rounded-full p-0.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"><X size={12} /></button>
                    </div>
                    {item.subtopicNames.length > 0 && <ul className="mt-1 space-y-1 pl-2">
                      {item.subtopicNames.map(name => {
                        const subtopicId = item.topic.subtopics?.find(st => st.name === name)?.id ?? "";
                        return <li key={name} className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1.5">· {name}</span>
                          <button type="button" onClick={() => removeLeaf(leafKey(group.section.id, item.topic.id, subtopicId))} aria-label={`Remove ${name}`} className="cursor-pointer rounded-full p-0.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"><X size={11} /></button>
                        </li>;
                      })}
                    </ul>}
                  </div>)}
                </div>
              </div>)}
            </div>}

          <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-bold text-slate-500">{totalSelected} topic{totalSelected === 1 ? "" : "s"} selected</p>
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
    className={`flex cursor-pointer flex-col rounded-3xl border p-6 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift ${open ? "border-teal-500 bg-teal-50/60" : "border-slate-100 bg-white"}`}
  >
    <div className="flex items-start justify-between gap-3">
      <h2 className="text-base font-extrabold leading-snug tracking-tight text-ink">{section.name}</h2>
      {open ? <ChevronDown size={18} className="mt-1 shrink-0 text-teal-600" /> : <ChevronRight size={18} className="mt-1 shrink-0 text-slate-300" />}
    </div>
    <p className="mt-2 text-xs leading-relaxed text-slate-500">{section.description}</p>
    {count > 0 && <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-extrabold text-teal-700">{count} selected</span>}
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

  return <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-extrabold tracking-tight text-ink">{section.shortName}</h3>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSelectAll} className="cursor-pointer text-[11px] font-bold text-teal-700 hover:text-teal-800">Select all</button>
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
                className={`grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded transition ${state === "all" ? "bg-teal-500 text-white" : state === "some" ? "border-2 border-teal-500 bg-teal-50 text-teal-600" : "border-2 border-slate-300 text-transparent hover:border-teal-300"}`}
              >{state === "all" ? <Check size={13} strokeWidth={3} /> : state === "some" ? <Minus size={12} strokeWidth={3} /> : null}</button>

              <button type="button" onClick={() => hasSubtopics && onToggleExpanded(topicKey)} className={`flex flex-1 cursor-pointer items-center justify-between gap-2 rounded-lg py-1 text-left ${hasSubtopics ? "" : "cursor-default"}`}>
                <span className="text-sm font-bold text-ink">{topic.name}</span>
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
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1 text-left transition hover:bg-slate-50"
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
