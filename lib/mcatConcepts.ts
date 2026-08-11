// The AAMC's real MCAT Foundational Concepts, as a pure grouping/labeling
// layer on top of lib/mcatPath.ts's existing sections/subjects/lessons.
// This file owns no content and no progress logic of its own—it only maps
// existing lesson ids into concept areas and reuses mcatPath.ts's real
// progress functions. Nothing here renames or moves the underlying data,
// so every existing route, id, and piece of saved progress keeps working.

import { getLessonContent, getLessonEntry, getSubjectProgress, LessonContent, mcatSections, PracticeQuestion, SubjectProgress } from "./mcatPath";
import { getTopicRecommendation, Recommendation } from "./recommendations";
import { getAttemptedQuestionIds, getOverallAccuracy, getSavedQuestionIds, getWeakConcepts, WeakConcept } from "./practiceHistory";

export type ConceptArea = {
  id: string;
  name: string;
  foundationalConcept: number; // 1-10, the AAMC's own numbering
  lessonIds: string[]; // in display/lock order
};

export type ConceptCategory = {
  id: string;
  name: string;
  areas: ConceptArea[];
};

export const conceptCategories: ConceptCategory[] = [
  {
    id: "biology-biochemistry",
    name: "Biology & Biochemistry",
    areas: [
      { id: "biomolecules", name: "Biomolecules", foundationalConcept: 1, lessonIds: ["scientific-method", "biomolecules"] },
      { id: "cells", name: "Cells", foundationalConcept: 2, lessonIds: ["cell-structure", "cell-division", "dna", "rna", "protein-synthesis"] },
      { id: "organ-systems", name: "Organ Systems", foundationalConcept: 3, lessonIds: [] },
      { id: "physical-processes", name: "Physical Processes", foundationalConcept: 4, lessonIds: [] },
      { id: "chemical-processes", name: "Chemical Processes", foundationalConcept: 5, lessonIds: [] },
      { id: "processing-environment", name: "Processing the Environment", foundationalConcept: 6, lessonIds: ["evolution", "ecology"] }
    ]
  },
  {
    id: "psychology-sociology",
    name: "Psychology & Sociology",
    areas: [
      { id: "behavior", name: "Behavior", foundationalConcept: 7, lessonIds: [] },
      { id: "individuals-society", name: "Individuals & Society", foundationalConcept: 8, lessonIds: [] },
      { id: "society-culture", name: "Society & Culture", foundationalConcept: 9, lessonIds: [] },
      { id: "social-inequality", name: "Social Inequality", foundationalConcept: 10, lessonIds: [] }
    ]
  }
];

export function getAllConceptAreas(): ConceptArea[] {
  return conceptCategories.flatMap(c => c.areas);
}

export function findConceptArea(areaId: string): ConceptArea | undefined {
  return getAllConceptAreas().find(a => a.id === areaId);
}

export function findConceptCategoryForArea(areaId: string): ConceptCategory | undefined {
  return conceptCategories.find(c => c.areas.some(a => a.id === areaId));
}

// Reverse lookup—used to show "which concept is this lesson part of" from
// the lesson's own page/breadcrumbs without hardcoding the mapping twice.
export function conceptAreaForLesson(lessonId: string): ConceptArea | undefined {
  return getAllConceptAreas().find(a => a.lessonIds.includes(lessonId));
}

// Thin wrapper around the existing, unmodified getSubjectProgress—no new
// progress math, just scoped to a concept area's lesson ids instead of a
// whole subject's.
export function getConceptAreaProgress(area: ConceptArea): SubjectProgress {
  return getSubjectProgress(area.lessonIds);
}

export type ConceptAreaLesson = { id: string; title: string; content: LessonContent | undefined };

// Real lesson rows for a concept area, each carrying its own real
// sectionId/subjectId (from the lesson content itself) so callers can link
// to the existing, unmodified Study Hub route without hardcoding
// "bio-biochem"/"biology" anywhere in this file.
export function getConceptAreaLessons(area: ConceptArea): ConceptAreaLesson[] {
  return area.lessonIds.map(id => ({ id, title: getLessonContent(id)?.title ?? id, content: getLessonContent(id) }));
}

// ---- Start Here: "seen once" tracking ----
// A single real flag—no fake "onboarding progress," just whether the
// student has opened Start Here before, so the Dashboard can nudge toward
// it once and then get out of the way (it stays reachable via the subnav
// either way).

const START_HERE_SEEN_KEY = "studium_mcat_start_here_seen";

export function hasSeenMcatStartHere(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(START_HERE_SEEN_KEY) === "true";
}

export function markMcatStartHereSeen() {
  if (typeof window === "undefined") return;
  localStorage.setItem(START_HERE_SEEN_KEY, "true");
}

// ---- Dashboard "Continue Studying" ----

export type McatContinueRecommendation = {
  lessonId: string;
  lessonTitle: string;
  areaId: string;
  areaName: string;
  recommendation: Recommendation;
};

// ---- Practice, by real exam section ----
// A different axis from concept areas above (exam section, not Foundational
// Concept)—mcatSections' own section→subject→lesson structure already IS
// the real exam-section grouping, so this just aggregates existing lesson
// content across it rather than introducing another taxonomy. Each question
// gets a stable id (lessonId:index within that lesson) so it can be
// bookmarked via lib/practiceHistory.ts's saved-questions store.

export type SectionPracticeQuestion = { id: string; question: PracticeQuestion; lessonId: string; lessonTitle: string; sectionId: string };

export function getSectionLessonIds(sectionId: string): string[] {
  const section = mcatSections.find(s => s.id === sectionId);
  if (!section) return [];
  return section.subjects.flatMap(sub => sub.lessons.map(l => l.id));
}

export function getSectionPracticeQuestions(sectionId: string): SectionPracticeQuestion[] {
  const out: SectionPracticeQuestion[] = [];
  for (const lessonId of getSectionLessonIds(sectionId)) {
    const content = getLessonContent(lessonId);
    if (!content) continue;
    content.practiceQuestions.forEach((q, i) => out.push({ id: `${lessonId}:${i}`, question: q, lessonId, lessonTitle: content.title, sectionId }));
  }
  return out;
}

export function getSectionWeakConcepts(sectionId: string): WeakConcept[] {
  const lessonIds = new Set(getSectionLessonIds(sectionId));
  return getWeakConcepts().filter(w => lessonIds.has(w.lessonId));
}

export function getSavedSectionQuestions(sectionId: string): SectionPracticeQuestion[] {
  const savedIds = new Set(getSavedQuestionIds());
  return getSectionPracticeQuestions(sectionId).filter(q => savedIds.has(q.id));
}

// A question counts as "unused" only if it's never been logged with its
// real id attached (see practiceHistory's questionId)—precise, not a
// concept-level guess.
export function getUnusedMcatPracticeQuestions(pool: SectionPracticeQuestion[]): SectionPracticeQuestion[] {
  const attempted = getAttemptedQuestionIds();
  return pool.filter(q => !attempted.has(q.id));
}

// Real concept tags already used by Weak Areas—no separate topic taxonomy
// invented for the filter drawer, just whatever concepts are actually
// present in the pool currently in view.
export function getUniqueConcepts(pool: SectionPracticeQuestion[]): string[] {
  return Array.from(new Set(pool.map(q => q.question.concept))).sort();
}

export function getAllMcatPracticeQuestions(): SectionPracticeQuestion[] {
  return mcatSections.flatMap(s => getSectionPracticeQuestions(s.id));
}

// ---- Built-in quizzes, by real exam subject ----
// "Already existing quizzes" for the Quizzes section: one real quiz per
// subject, built only from that subject's actually-authored lesson practice
// questions—no invented content, and subjects with zero authored questions
// are simply excluded rather than shown as an empty quiz.

export type BuiltInQuiz = { id: string; title: string; sectionId: string; sectionTitle: string; subjectName: string; questions: SectionPracticeQuestion[] };

export function getBuiltInQuizzes(): BuiltInQuiz[] {
  const out: BuiltInQuiz[] = [];
  for (const section of mcatSections) {
    for (const subject of section.subjects) {
      const lessonIds = new Set(subject.lessons.map(l => l.id));
      const questions = getSectionPracticeQuestions(section.id).filter(q => lessonIds.has(q.lessonId));
      if (questions.length === 0) continue;
      out.push({ id: `${section.id}:${subject.id}`, title: `${subject.name} Quiz`, sectionId: section.id, sectionTitle: section.shortTitle, subjectName: subject.name, questions });
    }
  }
  return out;
}

export function findBuiltInQuiz(id: string): BuiltInQuiz | undefined {
  return getBuiltInQuizzes().find(q => q.id === id);
}

// Deterministic per-day pick from the real question pool—same algorithm as
// getCaseOfTheDay in lib/clinicalCases.ts (day-index modulo pool size), so
// "today's question" is the same for everyone and stable across reloads
// without needing its own persisted schedule.
export function getQuestionOfTheDay(date: Date = new Date()): SectionPracticeQuestion | null {
  const pool = getAllMcatPracticeQuestions();
  if (pool.length === 0) return null;
  const dayIndex = Math.floor(date.getTime() / 86400000);
  const index = ((dayIndex % pool.length) + pool.length) % pool.length;
  return pool[index];
}

// ---- Exam section ↔ concept area bridge ----
// The Learn taxonomy above groups by 2 broad categories (Biology &
// Biochemistry / Psychology & Sociology), not by the 4 real exam sections
// mcatSections.ts models—so a pillar card's "Lessons" button needs this
// explicit bridge to know which concept areas actually belong to which
// exam section, rather than guessing or linking blind.
export const sectionToConceptAreaIds: Record<string, string[]> = {
  "bio-biochem": ["biomolecules", "cells", "organ-systems", "processing-environment"],
  "chem-phys": ["physical-processes", "chemical-processes"],
  "psych-social": ["behavior", "individuals-society", "society-culture", "social-inequality"],
  cars: [] // CARS tests reading/reasoning, not a knowledge concept area
};

export function getConceptAreasForSection(sectionId: string): ConceptArea[] {
  const ids = sectionToConceptAreaIds[sectionId] ?? [];
  return getAllConceptAreas().filter(a => ids.includes(a.id));
}

// Reverse of the table above—which real exam section a given concept area
// belongs to. Used by the concept area's lesson-list page to show that
// area's real share of its exam section's question bank.
export function getSectionForConceptArea(areaId: string): string | undefined {
  return Object.entries(sectionToConceptAreaIds).find(([, ids]) => ids.includes(areaId))?.[0];
}

// ---- Readiness ----

export type McatReadiness = { learnPercent: number; accuracyPercent: number | null; readinessPercent: number };

// A documented blend, not a black box: how much of the real Learn
// curriculum is done, blended with real Practice accuracy once there's any
// practice data to blend with (before that, Readiness is just Learn
// progress—no invented accuracy number).
export function getMcatReadiness(): McatReadiness {
  const areasWithContent = getAllConceptAreas().filter(a => a.lessonIds.length > 0);
  const totals = areasWithContent.reduce((acc, a) => {
    const p = getConceptAreaProgress(a);
    return { completed: acc.completed + p.completed, total: acc.total + p.total };
  }, { completed: 0, total: 0 });
  const learnPercent = totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0;
  const accuracy = getOverallAccuracy();
  const accuracyPercent = accuracy.total > 0 ? accuracy.percent : null;
  const readinessPercent = accuracyPercent !== null ? Math.round((learnPercent + accuracyPercent) / 2) : learnPercent;
  return { learnPercent, accuracyPercent, readinessPercent };
}

// The Dashboard's single "what should I do next" line, built from the same
// real per-lesson recommendation engine the Study Hub uses (lib/recommendations.ts)
// rather than a second one—just picks which lesson to point it at: the
// first lesson (in concept order) that hasn't been completed yet.
export function getMcatContinueRecommendation(): McatContinueRecommendation | null {
  const candidates = getAllConceptAreas().flatMap(area => area.lessonIds.map(lessonId => ({ lessonId, areaId: area.id, areaName: area.name })));
  if (candidates.length === 0) return null;
  const target = candidates.find(c => !getLessonEntry(c.lessonId)) ?? candidates[candidates.length - 1];
  const content = getLessonContent(target.lessonId);
  return {
    lessonId: target.lessonId,
    lessonTitle: content?.title ?? target.lessonId,
    areaId: target.areaId,
    areaName: target.areaName,
    recommendation: getTopicRecommendation(target.lessonId)
  };
}
