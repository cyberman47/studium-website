// Simple Smart Flashcard Review System — deliberately NOT an Anki/FSRS-style
// engine. Every card tracks exactly what's needed to answer "when should the
// student see this again," nothing more:
//   reviewCount    — real count of CORRECT answers only (wrong answers don't
//                     count as a "review" for this number, per spec)
//   correctStreak  — consecutive correct answers; any wrong answer resets it
//   status         — "learning" until the streak clears MASTERY_STREAK,
//                     then "mastered" (never reverts back to "learning" in
//                     storage—see getEntryStatus below for why a mastered
//                     card whose review has come due still *displays* as
//                     "due", not "mastered", without needing a third stored
//                     state)
//   lastReviewedAt / nextReviewAt — real ISO timestamps (not date-only
//                     strings), so "due" comparisons are correct to the
//                     minute, not just the calendar day—this matters
//                     because a wrong answer needs to be due again
//                     *immediately*, not merely "sometime today."
//
// Scheduling rule (see INTERVAL_DAYS below): 1st correct answer → 1 day,
// 2nd consecutive correct answer → 4 days and the card is "mastered."
// Wrong at any point → back to square one (streak 0, due immediately).
// This is intentionally the *entire* algorithm—no ease factors, no
// per-card difficulty weighting, no algorithm the student would ever need
// to understand. Extending it later (1 week, 2 weeks, 1 month, 3 months,
// 6 months) is exactly one line: append more numbers to INTERVAL_DAYS.
//
// This file is a factory (createProgressStore) so the same simple engine
// can back more than one independent keyspace without duplicating this
// logic—today that's exactly one real instance, lib/flashcardLibrary.ts's
// `cardProgress` (lesson-embedded + personal highlight-cards). Terminology
// terms keep their own separate, pre-existing box-based engine in
// lib/terminology.ts untouched (a different, long-established feature with
// its own dedicated review UI, daily goals, and settings)—not because this
// file couldn't cover it, but because rewriting Terminology's own engine
// was never part of what was asked, and doing so risks regressing a whole
// separate feature for no requested benefit. lib/flashcardLibrary.ts still
// composes both into one shared `ReviewEntry` shape so the rest of the app
// (status badges, filters, sorting) keeps treating "card progress" as one
// concept regardless of which engine actually backs it.
//
// `Rating` intentionally keeps its historical 4-value shape ("again" |
// "hard" | "good" | "easy") rather than becoming a literal correct/incorrect
// union: components/flashcard-focus-mode.tsx (and every one of its several
// existing callers across MCAT lesson pages, MCAT practice, and Terminology
// review) already renders a 4-button Again/Hard/Good/Easy row and calls
// review(id, rating) with one of these four strings. Changing the type here
// would force-break all of those unrelated pages' compilation for a UI they
// don't even show. Instead, this engine treats it as a simple binary signal
// at the boundary: "again" means incorrect, anything else (hard/good/easy)
// means correct—so every existing caller keeps working unchanged, while the
// new dedicated Smart Review session (components/smart-review-session.tsx,
// lib/flashcardLibrary.ts's reviewCardOutcome) talks to this engine with a
// real correct/incorrect signal via that same translation.
export type Rating = "again" | "hard" | "good" | "easy";

function isCorrectRating(rating: Rating): boolean {
  return rating !== "again";
}

export type EntryStatus = "learning" | "mastered";

export type ReviewEntry = {
  reviewCount: number;
  correctStreak: number;
  status: EntryStatus;
  lastReviewedAt: string; // ISO timestamp
  nextReviewAt: string; // ISO timestamp
};

// Future-proofing (spec requirement): index i is the interval used after the
// (i+1)th consecutive correct answer. Once correctStreak reaches this
// array's length the card is "mastered" and every further correct answer
// reuses the final interval. To add longer-term scheduling later (1 week,
// 2 weeks, 1 month, 3 months, 6 months)—append more numbers here; nothing
// else in this file needs to change.
export const INTERVAL_DAYS = [1, 4];
const MASTERY_STREAK = INTERVAL_DAYS.length;

function intervalDaysForStreak(streak: number): number {
  const idx = Math.min(streak, INTERVAL_DAYS.length) - 1;
  return INTERVAL_DAYS[Math.max(0, idx)];
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// Real display state used everywhere in the app (status badges, filter
// chips, overview counts): a card that reached "mastered" but whose
// nextReviewAt has since arrived displays as "due," not "mastered," until
// it's reviewed again—so mastery is never a permanent, stale label. This is
// purely a *display* derivation; the persisted `status` field only ever
// holds "learning" or "mastered."
export type CardDisplayStatus = "new" | "learning" | "mastered" | "due";

export function getEntryStatus(entry: ReviewEntry | null, nowIso: string = new Date().toISOString()): CardDisplayStatus {
  if (!entry) return "new";
  if (entry.status === "learning") return "learning";
  return entry.nextReviewAt <= nowIso ? "due" : "mastered";
}

// ---- Human-readable "when will I see this again" feedback ----
// Exactly the label set the student is meant to ever see—no box numbers,
// no percentages, no algorithm. `entry` is the state *after* the review
// that just happened.
export function describeNextReview(entry: ReviewEntry, nowIso: string = new Date().toISOString()): string {
  if (entry.correctStreak === 0) return "Again soon"; // just answered wrong—back in the retry queue
  const days = Math.round((new Date(entry.nextReviewAt).getTime() - new Date(nowIso).getTime()) / 86400000);
  if (days <= 0) return "Again soon";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  if (days < 14) return "In 1 week";
  if (days < 30) return "In 2 weeks";
  if (days < 60) return "In 1 month";
  return `In ${days} days`; // sane fallback once longer intervals are added later
}

// ---- Knowledge Points (spec's reward table, additive not alternative) ----
// Incorrect: +0 (never called). First correct in a streak: +1. Any further
// correct answer: +2. The very moment a card's *persisted* status actually
// flips to "mastered" (i.e., it wasn't mastered before this review), an
// additional one-time +2 bonus is layered on top—so reaching mastery nets
// +4 total, but reviewing an already-mastered card again later (its streak
// keeps climbing past MASTERY_STREAK) only ever re-earns the ongoing +2,
// never a repeated mastery bonus. `priorStatus` is the entry's status
// *before* this review (null if the card had never been reviewed).
export function kpForReviewOutcome(priorStatus: EntryStatus | null, newEntry: ReviewEntry): number {
  if (newEntry.correctStreak === 0) return 0;
  let kp = newEntry.correctStreak === 1 ? 1 : 2;
  if (newEntry.status === "mastered" && priorStatus !== "mastered") kp += 2;
  return kp;
}

export type ProgressStore = {
  getProgress(cardId: string): ReviewEntry | null;
  getAllProgress(): Record<string, ReviewEntry>;
  isDue(cardId: string): boolean;
  isStarted(cardId: string): boolean;
  isMastered(cardId: string): boolean;
  getStatus(cardId: string): CardDisplayStatus;
  review(cardId: string, rating: Rating): ReviewEntry;
  restore(cardId: string, snapshot: ReviewEntry | null): void;
  remove(cardId: string): void;
};

// Guards against stale/malformed localStorage entries from a previous
// version of this store's shape (box/nextReview/timesReviewed/...) rather
// than crashing on them—treated the same as "never reviewed," a safe,
// honest default (no fabricated progress) instead of a runtime error.
function isValidEntry(v: unknown): v is ReviewEntry {
  if (!v || typeof v !== "object") return false;
  const e = v as Record<string, unknown>;
  return typeof e.reviewCount === "number" && typeof e.correctStreak === "number"
    && (e.status === "learning" || e.status === "mastered")
    && typeof e.lastReviewedAt === "string" && typeof e.nextReviewAt === "string";
}

// One real store call per independent keyspace—each gets its own
// localStorage key and change event, same pattern as every other real
// store in the app (personalFlashcards, savedHighlights, etc).
export function createProgressStore(storageKey: string, eventName: string): ProgressStore {
  function readMap(): Record<string, ReviewEntry> {
    if (typeof window === "undefined") return {};
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, ReviewEntry> = {};
    for (const [id, entry] of Object.entries(parsed)) if (isValidEntry(entry)) out[id] = entry;
    return out;
  }

  function writeMap(map: Record<string, ReviewEntry>) {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(eventName));
  }

  return {
    getProgress(cardId) {
      return readMap()[cardId] ?? null;
    },
    getAllProgress() {
      return readMap();
    },
    isDue(cardId) {
      const entry = readMap()[cardId];
      return !!entry && entry.nextReviewAt <= new Date().toISOString();
    },
    isStarted(cardId) {
      return !!readMap()[cardId];
    },
    isMastered(cardId) {
      return readMap()[cardId]?.status === "mastered";
    },
    getStatus(cardId) {
      return getEntryStatus(readMap()[cardId] ?? null);
    },
    review(cardId, rating) {
      const map = readMap();
      const existing = map[cardId];
      const now = new Date().toISOString();
      const correct = isCorrectRating(rating);
      const entry: ReviewEntry = correct
        ? (() => {
          const correctStreak = (existing?.correctStreak ?? 0) + 1;
          return {
            reviewCount: (existing?.reviewCount ?? 0) + 1,
            correctStreak,
            status: correctStreak >= MASTERY_STREAK ? "mastered" : "learning",
            lastReviewedAt: now,
            nextReviewAt: addDays(now, intervalDaysForStreak(correctStreak))
          };
        })()
        : {
          reviewCount: existing?.reviewCount ?? 0,
          correctStreak: 0,
          status: "learning",
          lastReviewedAt: now,
          nextReviewAt: now // immediately due—"needing review," per spec
        };
      map[cardId] = entry;
      writeMap(map);
      return entry;
    },
    restore(cardId, snapshot) {
      const map = readMap();
      if (snapshot) map[cardId] = snapshot;
      else delete map[cardId];
      writeMap(map);
    },
    remove(cardId) {
      const map = readMap();
      delete map[cardId];
      writeMap(map);
    }
  };
}
