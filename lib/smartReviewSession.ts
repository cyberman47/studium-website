// The in-session retry queue for the Simple Smart Flashcard Review System.
// Deliberately separate from lib/spacedRepetitionCore.ts: that file decides
// *when a card is next due* (persisted, survives a refresh); this file only
// decides *what order to show cards in during one sitting* (ephemeral,
// forgotten on refresh/exit—exactly like every ordinary flashcard app).
// Pure functions, no localStorage, no React—easy to reason about and to
// unit-test each of the scenarios this feature was built against.

import { LibraryCard } from "./flashcardLibrary";

// A wrong card is reinserted this many positions later, never immediately—
// "Ideally place 2–5 other cards between the failed card and its retry."
const MIN_REQUEUE_GAP = 2;
const MAX_REQUEUE_GAP = 5;

// Guarantees the session always finishes: a card that's still wrong after
// this many of its own attempts is set aside instead of requeued again, so
// one stubborn card can never turn into an infinite loop.
const MAX_ATTEMPTS_PER_CARD = 5;

type QueueItem = { card: LibraryCard; attempts: number };

export type ReviewSessionState = {
  queue: QueueItem[];
  answered: { card: LibraryCard; correct: boolean }[];
  // Cards that hit MAX_ATTEMPTS_PER_CARD without ever landing a correct
  // answer this session—still genuinely due (their persisted nextReviewAt
  // was already set to "now" by the first wrong answer), just not shown
  // again *today*, so the student isn't stuck repeating one card forever.
  setAside: LibraryCard[];
};

export function buildReviewSession(cards: LibraryCard[]): ReviewSessionState {
  return { queue: cards.map(card => ({ card, attempts: 0 })), answered: [], setAside: [] };
}

export function currentSessionCard(state: ReviewSessionState): LibraryCard | null {
  return state.queue[0]?.card ?? null;
}

export function isSessionDone(state: ReviewSessionState): boolean {
  return state.queue.length === 0;
}

export function sessionTotalRemaining(state: ReviewSessionState): number {
  return state.queue.length;
}

// Applies one answer for whichever card is currently at the front of the
// queue. Correct → the card leaves the session for good (spec: it "does
// NOT need to appear again during the current session"). Incorrect → it's
// reinserted MIN_REQUEUE_GAP–MAX_REQUEUE_GAP cards later, clamped to
// however many cards are actually left so a 3-5 card deck never tries to
// insert past the end of the queue (it just goes to the back in that case,
// which still satisfies "only retried after other available cards have
// been shown" as long as there *is* at least one other card left).
export function answerSessionCard(state: ReviewSessionState, correct: boolean): ReviewSessionState {
  const [item, ...rest] = state.queue;
  if (!item) return state;
  const answered = [...state.answered, { card: item.card, correct }];

  if (correct) return { ...state, queue: rest, answered };

  const attempts = item.attempts + 1;
  if (attempts >= MAX_ATTEMPTS_PER_CARD) {
    return { ...state, queue: rest, answered, setAside: [...state.setAside, item.card] };
  }
  const gap = MIN_REQUEUE_GAP + Math.floor(Math.random() * (MAX_REQUEUE_GAP - MIN_REQUEUE_GAP + 1));
  const insertAt = Math.min(gap, rest.length);
  const requeued = [...rest.slice(0, insertAt), { card: item.card, attempts }, ...rest.slice(insertAt)];
  return { ...state, queue: requeued, answered };
}
