// Student-owned Custom Decks: named collections of card ids, spanning any
// mix of terminology terms, lesson flashcards, and personal highlight-cards
// (see lib/flashcardLibrary.ts for the unified card id scheme). A deck never
// stores card content—only a list of ids—so the same card can belong to
// many decks and removing it from one deck never touches the others or the
// underlying card.
//
// Deliberately a different type/key from lib/create.ts's SavedDeck
// (studium_create_decks), which stores AI-"generated" demo flashcards from
// the Create tool—a separate, unrelated feature that stays untouched.

import { getCardDisplayStatus } from "./flashcardLibrary";

export type StudyDeck = {
  id: string;
  name: string;
  description?: string;
  cardIds: string[];
  createdAt: string;
  updatedAt: string;
  // Optional so every existing deck needs no backfill—undefined reads the
  // same as false everywhere below.
  archived?: boolean;
};

const KEY = "studium_study_decks";
export const STUDY_DECKS_EVENT = "studium:studyDecksChange";

function read(): StudyDeck[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

function write(list: StudyDeck[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(STUDY_DECKS_EVENT));
}

export function getDecks(): StudyDeck[] {
  return read().filter(d => !d.archived).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getArchivedDecks(): StudyDeck[] {
  return read().filter(d => d.archived).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// Unlike getDecks(), includes archived decks—the deck detail page needs to
// open (and offer "Unarchive") for a deck that's currently archived.
export function getDeck(id: string): StudyDeck | undefined {
  return read().find(d => d.id === id);
}

export function createDeck(name: string, cardIds: string[] = [], description?: string): StudyDeck {
  const now = new Date().toISOString();
  const deck: StudyDeck = { id: `deck-${Date.now()}`, name, description, cardIds, createdAt: now, updatedAt: now };
  write([...read(), deck]);
  return deck;
}

export function renameDeck(id: string, name: string) {
  write(read().map(d => d.id === id ? { ...d, name, updatedAt: new Date().toISOString() } : d));
}

export function setDeckDescription(id: string, description: string) {
  write(read().map(d => d.id === id ? { ...d, description, updatedAt: new Date().toISOString() } : d));
}

export function deleteDeck(id: string) {
  write(read().filter(d => d.id !== id));
}

export function archiveDeck(id: string) {
  write(read().map(d => d.id === id ? { ...d, archived: true, updatedAt: new Date().toISOString() } : d));
}

export function unarchiveDeck(id: string) {
  write(read().map(d => d.id === id ? { ...d, archived: false, updatedAt: new Date().toISOString() } : d));
}

// A real copy—own id, own cardIds array—so editing the duplicate's cards
// never touches the original deck.
export function duplicateDeck(id: string): StudyDeck | null {
  const deck = read().find(d => d.id === id);
  if (!deck) return null;
  return createDeck(`${deck.name} (copy)`, [...deck.cardIds]);
}

// Adds ids without duplicating ones already in the deck.
export function addCardsToDeck(id: string, cardIds: string[]) {
  write(read().map(d => {
    if (d.id !== id) return d;
    const merged = Array.from(new Set([...d.cardIds, ...cardIds]));
    return { ...d, cardIds: merged, updatedAt: new Date().toISOString() };
  }));
}

export function removeCardFromDeck(id: string, cardId: string) {
  write(read().map(d => d.id === id ? { ...d, cardIds: d.cardIds.filter(c => c !== cardId), updatedAt: new Date().toISOString() } : d));
}

// Unions the cards of several existing decks into a brand-new deck—no card
// content is copied, only ids, and the source decks are left untouched.
export function mergeDecks(deckIds: string[], newName: string): StudyDeck {
  const decks = read();
  const merged = Array.from(new Set(decks.filter(d => deckIds.includes(d.id)).flatMap(d => d.cardIds)));
  return createDeck(newName, merged);
}

export function deckCountForCard(cardId: string): number {
  return read().filter(d => d.cardIds.includes(cardId)).length;
}

export function decksContainingCard(cardId: string): StudyDeck[] {
  return read().filter(d => d.cardIds.includes(cardId));
}

// ---- Real per-deck mastery breakdown ----
// Powers the rich deck cards (mastered/learning/new/due + progress bar) and
// the deck detail page's stats header—one real computation over each card's
// already-composed display status (lib/flashcardLibrary.ts), no separate
// deck-level progress store to keep in sync.
export type DeckStats = {
  total: number;
  new: number;
  learning: number;
  mastered: number;
  due: number;
  masteredPercent: number; // of total—drives the deck progress bar
};

export function getDeckStats(deck: StudyDeck): DeckStats {
  const stats = { total: deck.cardIds.length, new: 0, learning: 0, mastered: 0, due: 0 };
  for (const cardId of deck.cardIds) {
    const status = getCardDisplayStatus(cardId);
    if (status === "new") stats.new++;
    else if (status === "learning") stats.learning++;
    else if (status === "mastered") stats.mastered++;
    else stats.due++;
  }
  return { ...stats, masteredPercent: stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0 };
}
