// The same 5-box Leitner math that powers Terminology review
// (lib/terminology.ts), factored out so other card types (personal
// highlight-cards, lesson-embedded flashcards) can get real spaced
// repetition without duplicating the logic or being forced into the
// Terminology data model. lib/terminology.ts is NOT refactored to use
// this—it already works and stays untouched; this is a second, separate
// instance of the same rules for a different keyspace (its own copy of
// this same again/hard/good/easy logic lives in lib/terminology.ts).

export type Rating = "again" | "hard" | "good" | "easy";

export type ReviewEntry = {
  box: number;
  nextReview: string; // yyyy-mm-dd
  timesReviewed: number;
  lastRating: Rating | null;
  learnedAt: string;
  lastReviewedAt: string; // ISO timestamp, updated every review()—drives "Recently studied" sorting
};

// Mastery is never permanent: a box-5 card whose nextReview has arrived
// displays as "due" (ready for re-review), not "mastered", until it's
// reviewed again. This one function is the single source of truth for that
// display state everywhere in the app, so "mastered" can't quietly drift
// out of sync between the homepage, a deck view, and a study session.
export type CardDisplayStatus = "new" | "learning" | "mastered" | "due";

export function getEntryStatus(entry: ReviewEntry | null, today: string = toDateKey(new Date())): CardDisplayStatus {
  if (!entry) return "new";
  if (entry.box < MAX_BOX) return "learning";
  return entry.nextReview <= today ? "due" : "mastered";
}

const MAX_BOX = 5;
const boxIntervalDays = [1, 2, 4, 8, 16];

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

function freshEntry(): ReviewEntry {
  const now = new Date();
  return { box: 1, nextReview: toDateKey(now), timesReviewed: 0, lastRating: null, learnedAt: toDateKey(now), lastReviewedAt: now.toISOString() };
}

// Again/Hard/Good/Easy, the same real four-point scale Anki-style spaced
// repetition uses (not the old 3-button easy/medium/hard this replaces):
//   Again — didn't recall it at all → back to box 1, review again tomorrow.
//   Hard  — recalled with real effort → drop one box, slower progress.
//   Good  — recalled it → advance one box, the normal path forward.
//   Easy  — recalled it instantly → advance two boxes, skip ahead.
function nextBox(box: number, rating: Rating): number {
  if (rating === "again") return 1;
  if (rating === "hard") return Math.max(1, box - 1);
  if (rating === "good") return Math.min(MAX_BOX, box + 1);
  return Math.min(MAX_BOX, box + 2); // easy
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

// One factory call per independent keyspace—each gets its own
// localStorage key and change event, same pattern as every other real
// store in the app (personalFlashcards, savedHighlights, etc).
export function createProgressStore(storageKey: string, eventName: string): ProgressStore {
  function readMap(): Record<string, ReviewEntry> {
    if (typeof window === "undefined") return {};
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
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
      return !!entry && entry.nextReview <= toDateKey(new Date());
    },
    isStarted(cardId) {
      return !!readMap()[cardId];
    },
    isMastered(cardId) {
      return (readMap()[cardId]?.box ?? 0) >= MAX_BOX;
    },
    getStatus(cardId) {
      return getEntryStatus(readMap()[cardId] ?? null);
    },
    review(cardId, rating) {
      const map = readMap();
      const existing = map[cardId] ?? freshEntry();
      const box = nextBox(existing.box, rating);
      const interval = boxIntervalDays[Math.min(box, boxIntervalDays.length) - 1];
      const entry: ReviewEntry = {
        box,
        nextReview: toDateKey(addDays(new Date(), interval)),
        timesReviewed: existing.timesReviewed + 1,
        lastRating: rating,
        learnedAt: existing.learnedAt,
        lastReviewedAt: new Date().toISOString()
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
