// Unifies every real flashcard-shaped thing in Studium into one browsable,
// filterable pool—without moving or duplicating any of the underlying data:
//   - Terminology terms (lib/terminology.ts)      → id "term:<termId>"
//   - Lesson-embedded flashcards (lib/mcatPath.ts) → id "lesson:<lessonId>:<index>"
//   - Personal highlight-cards (lib/personalFlashcards.ts) → id (already unique, "pf-...")
//
// Progress/spaced-repetition is *composed*, not reimplemented: term cards
// keep using their own real Leitner engine in lib/terminology.ts untouched
// (a separate, long-established feature with its own review page, daily
// goals, and settings); lesson and personal cards share one instance of the
// Simple Smart Flashcard Review System (lib/spacedRepetitionCore.ts) keyed
// by their unified id. getCardProgress composes both into one shared
// ReviewEntry shape (read-only) so the rest of the app—status badges,
// filters, sorting—can treat "progress" as one concept regardless of
// source. That composed shape is for *display* only, though: a true undo
// needs each source's own real, unconverted data back, which is what
// getCardSnapshot/restoreLibraryCard below use instead.

import { mcatSections } from "./mcatPath";
import { getLessonContent } from "./mcatPath";
import {
  getMyTerms, getTerm, getTermProgress, reviewTerm, restoreTermProgress,
  isTermMastered as isTermMasteredReal, isCustomTerm, findTermCategory, Rating as TermRating, TermProgressEntry
} from "./terminology";
import { getPersonalFlashcards } from "./personalFlashcards";
import { createProgressStore, Rating, ReviewEntry, CardDisplayStatus, getEntryStatus, kpForReviewOutcome } from "./spacedRepetitionCore";
import { awardFlashcardReviewKP, getTotalKP } from "./progress";

export type CardSource = "terminology" | "lesson" | "personal";

export type LibraryCard = {
  id: string;
  front: string;
  back: string;
  hint?: string | null;
  source: CardSource;
  subject: string;       // term category name, or MCAT subject name, or source lesson title
  sectionTitle?: string;  // MCAT section, for lesson cards
  lessonId?: string;
  lessonTitle?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  createdAt?: string;     // only meaningful for personal cards
  selfCreated: boolean;
  // Real top-level grouping ("MCAT", "Terminology", "My Cards")—distinct
  // from `source` (which describes the card's *kind*: term/lesson/personal).
  // `source: "lesson"` today only ever means MCAT, since it's the only path
  // with real written lesson content (see lessonCards() below), but keeping
  // pathId/pathName as their own fields means the Flashcard Library's
  // grouping keeps working with zero UI changes the day another path
  // (USMLE, Nursing, ...) gets its own real lesson flashcards.
  pathId: string;
  pathName: string;
};

const cardProgress = createProgressStore("studium_card_progress", "studium:cardProgressChange");
export const CARD_PROGRESS_EVENT = "studium:cardProgressChange";

function termCard(termId: string): LibraryCard | null {
  const term = getTerm(termId);
  if (!term) return null;
  return {
    id: `term:${term.id}`,
    front: term.name,
    back: term.definition,
    source: "terminology",
    subject: findTermCategory(term.categoryId)?.name ?? term.categoryId,
    difficulty: term.difficulty,
    selfCreated: isCustomTerm(term.id),
    pathId: "terminology",
    pathName: "Terminology"
  };
}

function lessonCards(): LibraryCard[] {
  const cards: LibraryCard[] = [];
  for (const section of mcatSections) {
    for (const subject of section.subjects) {
      for (const lessonSummary of subject.lessons) {
        const content = getLessonContent(lessonSummary.id);
        if (!content) continue;
        content.flashcards.forEach((fc, i) => {
          cards.push({
            id: `lesson:${lessonSummary.id}:${i}`,
            front: fc.front,
            back: fc.back,
            source: "lesson",
            subject: subject.name,
            sectionTitle: section.shortTitle,
            lessonId: lessonSummary.id,
            lessonTitle: lessonSummary.title,
            difficulty: content.difficulty,
            selfCreated: false,
            pathId: "mcat",
            pathName: "MCAT"
          });
        });
      }
    }
  }
  return cards;
}

function personalCards(): LibraryCard[] {
  return getPersonalFlashcards().map(pf => ({
    id: pf.id,
    front: pf.front,
    back: pf.back,
    source: "personal",
    subject: pf.sourceLessonTitle,
    lessonId: pf.sourceLessonId,
    lessonTitle: pf.sourceLessonTitle,
    createdAt: pf.createdAt,
    selfCreated: true,
    pathId: "personal",
    pathName: "My Cards"
  }));
}

// Terminology cards are scoped to getMyTerms()—the student's own personal
// vocabulary list (a term they've actually clicked while reading a lesson
// or a flashcard, or rated in a review session; see lib/terminology.ts)—
// not Studium's entire built-in glossary. The Flashcard Library is meant to
// be "what you're actually studying," and dumping every term Studium knows
// (most of which the student has never even seen) defeated that; lesson and
// personal cards were never the problem, so they're untouched.
export function getAllLibraryCards(): LibraryCard[] {
  return [...getMyTerms().map(t => termCard(t.id)).filter((c): c is LibraryCard => !!c), ...lessonCards(), ...personalCards()];
}

export function getLibraryCard(id: string): LibraryCard | undefined {
  if (id.startsWith("term:")) return termCard(id.slice("term:".length)) ?? undefined;
  if (id.startsWith("lesson:")) return lessonCards().find(c => c.id === id);
  return personalCards().find(c => c.id === id);
}

export function getLibraryCardsByIds(ids: string[]): LibraryCard[] {
  const idSet = new Set(ids);
  return getAllLibraryCards().filter(c => idSet.has(c.id));
}

// ---- Progress, composed across sources ----

// term box (1-5) → an approximate correctStreak/status for cross-source
// display parity only (sorting "least/most mastered," status badges).
// Term cards' *real* scheduling stays entirely inside lib/terminology.ts;
// this never feeds back into it.
function approximateEntryFromTermProgress(p: TermProgressEntry): ReviewEntry {
  const TERM_MAX_BOX = 5;
  return {
    reviewCount: p.timesReviewed,
    correctStreak: Math.max(0, p.box - 1),
    status: p.box >= TERM_MAX_BOX ? "mastered" : "learning",
    lastReviewedAt: p.lastRatedAt ?? p.learnedAt,
    // Term's nextReview is a date-only yyyy-mm-dd string—treated as due
    // starting midnight local-ish (UTC) that day, consistent with how
    // spacedRepetitionCore.ts's own nextReviewAt comparisons work.
    nextReviewAt: new Date(`${p.nextReview}T00:00:00.000Z`).toISOString()
  };
}

export function getCardProgress(id: string): ReviewEntry | null {
  if (id.startsWith("term:")) {
    const p = getTermProgress(id.slice("term:".length));
    return p ? approximateEntryFromTermProgress(p) : null;
  }
  return cardProgress.getProgress(id);
}

// The real, source-native snapshot for undo—deliberately NOT the composed
// display shape above, which term cards can't be losslessly restored from.
export type CardSnapshot = ReviewEntry | TermProgressEntry | null;

export function getCardSnapshot(id: string): CardSnapshot {
  if (id.startsWith("term:")) return getTermProgress(id.slice("term:".length));
  return cardProgress.getProgress(id);
}

export function isCardDue(id: string): boolean {
  if (id.startsWith("term:")) {
    const p = getTermProgress(id.slice("term:".length));
    return !!p && p.nextReview <= new Date().toISOString().slice(0, 10);
  }
  return cardProgress.isDue(id);
}

export function isCardStarted(id: string): boolean {
  if (id.startsWith("term:")) return !!getTermProgress(id.slice("term:".length));
  return cardProgress.isStarted(id);
}

export function isCardMastered(id: string): boolean {
  if (id.startsWith("term:")) return isTermMasteredReal(id.slice("term:".length));
  return cardProgress.isMastered(id);
}

// Real lifetime count of mastered cards across the whole library (terms,
// lesson cards, and personal cards together)—not per-deck. Nothing like
// this existed before; the Passport's "Master N Flashcards" achievements
// need exactly this aggregate.
export function getMasteredFlashcardsCount(): number {
  return getAllLibraryCards().filter(c => isCardMastered(c.id)).length;
}

// One real status—New/Learning/Mastered/Due—for any card regardless of
// source. Built on top of getCardProgress's already-composed ReviewEntry
// shape rather than re-deriving box/nextReview logic a third time, so this
// stays automatically consistent with spacedRepetitionCore's own status
// rules (mastery isn't permanent: a box-5 card whose review is due shows as
// "due", not "mastered", until it's reviewed again).
export function getCardDisplayStatus(id: string): CardDisplayStatus {
  return getEntryStatus(getCardProgress(id));
}

export function reviewLibraryCard(id: string, rating: Rating): void {
  if (id.startsWith("term:")) {
    // TermRating and Rating are now the identical again/hard/good/easy union
    // (both engines were upgraded to the same scale)—the cast is just
    // crossing a module boundary, not reconciling different shapes.
    reviewTerm(id.slice("term:".length), rating as TermRating);
    return;
  }
  cardProgress.review(id, rating);
}

export function restoreLibraryCard(id: string, snapshot: CardSnapshot): void {
  if (id.startsWith("term:")) {
    restoreTermProgress(id.slice("term:".length), snapshot as TermProgressEntry | null);
    return;
  }
  cardProgress.restore(id, snapshot as ReviewEntry | null);
}

// The three-level Unfamiliar/Learning/Known interface the Smart Review
// session (components/smart-review-session.tsx, the Flashcards feature's own
// study flow) calls—a thin translation over the same reviewLibraryCard path
// every other flashcard surface already uses, so lesson/personal/term cards
// all still funnel through the one real engine per keyspace rather than a
// second, competing one. The rating (again/hard/good) passes straight
// through: "again" (Unfamiliar) is the only one spacedRepetitionCore.ts
// treats as incorrect (see its file-top comment), while for term cards
// specifically, "hard" (Learning) genuinely steps the Leitner box back a
// level rather than being treated the same as "good" (Known)—see
// lib/terminology.ts's nextBox. Also awards real KP through the existing
// lib/progress.ts ledger (spec's reward table, via kpForReviewOutcome)—one
// call does the full "answer this card" transaction so callers never have
// to remember the KP step.
export type ReviewOutcome = { entry: ReviewEntry; kpAwarded: number; leveledUp: boolean; totalKP: number };

export function reviewCardOutcome(id: string, rating: Rating): ReviewOutcome {
  const priorStatus = getCardProgress(id)?.status ?? null;
  reviewLibraryCard(id, rating);
  const entry = getCardProgress(id)!;
  const kp = kpForReviewOutcome(priorStatus, entry);
  if (kp <= 0) return { entry, kpAwarded: 0, leveledUp: false, totalKP: getTotalKP() };
  const result = awardFlashcardReviewKP(kp);
  return { entry, kpAwarded: kp, leveledUp: result.leveledUp, totalKP: result.totalKP };
}

// ---- Today's Review (Simple Smart Flashcard Review System) ----
// Real counts over whatever card set the caller hands in (the whole
// library, or one deck's cards)—"due" splits into the same two buckets the
// feature's own status colors already use: still-building-the-streak
// ("learning," 🔴) vs. previously-mastered-and-now-due-again ("due," 🟢,
// shown to the student as "ready for review"). New cards are deliberately
// not part of "due"—they're their own separate count, per spec.
export type DueTodaySummary = { due: number; learning: number; readyForReview: number; newCount: number };

export function getDueTodaySummary(cards: LibraryCard[]): DueTodaySummary {
  let learning = 0, readyForReview = 0, newCount = 0;
  for (const c of cards) {
    const status = getCardDisplayStatus(c.id);
    if (status === "learning") learning++;
    else if (status === "due") readyForReview++;
    else if (status === "new") newCount++;
  }
  return { due: learning + readyForReview, learning, readyForReview, newCount };
}

// ---- Search / filter ----

export type LibraryFilter = {
  query?: string;
  source?: CardSource;
  pathId?: string;
  subject?: string;
  status?: CardDisplayStatus;
  selfCreated?: boolean;
};

export type LibraryPathGroup = { pathId: string; pathName: string; count: number; subjects: { subject: string; count: number }[] };

// The real two-level grouping the Flashcard Library browses by: path first
// (MCAT, Terminology, My Cards, and any future path once it has real lesson
// content), then subject within that path—built straight from whatever
// pathId/subject values actually exist on the given cards, so a path with
// zero cards today just doesn't appear rather than showing as a fake empty
// category.
export function getLibraryPathGroups(cards: LibraryCard[]): LibraryPathGroup[] {
  const paths = new Map<string, { pathName: string; subjects: Map<string, number> }>();
  for (const card of cards) {
    if (!paths.has(card.pathId)) paths.set(card.pathId, { pathName: card.pathName, subjects: new Map() });
    const entry = paths.get(card.pathId)!;
    entry.subjects.set(card.subject, (entry.subjects.get(card.subject) ?? 0) + 1);
  }
  return Array.from(paths.entries())
    .map(([pathId, { pathName, subjects }]) => ({
      pathId,
      pathName,
      count: Array.from(subjects.values()).reduce((a, b) => a + b, 0),
      subjects: Array.from(subjects.entries()).map(([subject, count]) => ({ subject, count })).sort((a, b) => a.subject.localeCompare(b.subject))
    }))
    .sort((a, b) => b.count - a.count);
}

export function filterLibraryCards(cards: LibraryCard[], filter: LibraryFilter): LibraryCard[] {
  const q = filter.query?.trim().toLowerCase();
  return cards.filter(c => {
    if (q && !c.front.toLowerCase().includes(q) && !c.back.toLowerCase().includes(q)) return false;
    if (filter.source && c.source !== filter.source) return false;
    if (filter.pathId && c.pathId !== filter.pathId) return false;
    if (filter.subject && c.subject !== filter.subject) return false;
    if (filter.selfCreated && !c.selfCreated) return false;
    if (filter.status && getCardDisplayStatus(c.id) !== filter.status) return false;
    return true;
  });
}

// ---- Sorting ----
// "Deck" isn't a sort option here—a card can live in several decks at once,
// so grouping by deck is a page-level view concern (the Decks|Cards toggle
// browses by deck directly), not a per-card ordering.
export type SortOption =
  | "dueFirst" | "recentlyCreated" | "recentlyStudied" | "leastMastered" | "mostMastered" | "alphabetical" | "subject";

export const sortLabels: Record<SortOption, string> = {
  dueFirst: "Due first",
  recentlyCreated: "Recently created",
  recentlyStudied: "Recently studied",
  leastMastered: "Least mastered",
  mostMastered: "Most mastered",
  alphabetical: "Alphabetical (A–Z)",
  subject: "Subject"
};

const statusRank: Record<CardDisplayStatus, number> = { due: 0, learning: 1, new: 2, mastered: 3 };

export function sortLibraryCards(cards: LibraryCard[], sort: SortOption): LibraryCard[] {
  const sorted = cards.slice();
  switch (sort) {
    case "dueFirst":
      return sorted.sort((a, b) => statusRank[getCardDisplayStatus(a.id)] - statusRank[getCardDisplayStatus(b.id)]);
    case "recentlyCreated":
      // Cards with no real createdAt (lesson/term cards) sort after every
      // personal card with one, rather than guessing a fake date for them.
      return sorted.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : -Infinity) - (a.createdAt ? new Date(a.createdAt).getTime() : -Infinity));
    case "recentlyStudied":
      return sorted.sort((a, b) => {
        const at = getCardProgress(a.id)?.lastReviewedAt;
        const bt = getCardProgress(b.id)?.lastReviewedAt;
        return (bt ? new Date(bt).getTime() : -Infinity) - (at ? new Date(at).getTime() : -Infinity);
      });
    case "leastMastered":
      return sorted.sort((a, b) => (getCardProgress(a.id)?.correctStreak ?? 0) - (getCardProgress(b.id)?.correctStreak ?? 0));
    case "mostMastered":
      return sorted.sort((a, b) => (getCardProgress(b.id)?.correctStreak ?? 0) - (getCardProgress(a.id)?.correctStreak ?? 0));
    case "alphabetical":
      return sorted.sort((a, b) => a.front.localeCompare(b.front));
    case "subject":
      return sorted.sort((a, b) => a.subject.localeCompare(b.subject) || a.front.localeCompare(b.front));
  }
}
