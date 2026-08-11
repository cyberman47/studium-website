// Real personal flashcard deck built from highlighted lesson text. Separate
// from the term spaced-repetition system (lib/terminology.ts)—that model is
// built around single named concepts with a definition; an arbitrary
// highlighted sentence doesn't fit it cleanly. This is a simpler real deck:
// front is genuinely the highlighted text, back is left for the student to
// write (no live AI to generate a good answer from arbitrary text), fully
// editable, genuinely saved and listable.
//
// Deck membership (lib/flashcardDecks.ts) is intentionally NOT stored here.
// A StudyDeck's cardIds array is the single source of truth for which cards
// belong to which decks—storing it on both sides would just be two records
// that can drift out of sync. Use lib/flashcardDecks.ts's
// decksContainingCard() to look up a card's decks.

export type PersonalFlashcard = {
  id: string;
  front: string;
  back: string;
  sourceLessonId: string;
  sourceLessonTitle: string;
  createdAt: string;
};

const KEY = "studium_personal_flashcards";
export const PERSONAL_FLASHCARDS_EVENT = "studium:personalFlashcardsChange";

function read(): PersonalFlashcard[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

function write(list: PersonalFlashcard[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(PERSONAL_FLASHCARDS_EVENT));
}

export function getPersonalFlashcards(): PersonalFlashcard[] {
  return read().slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPersonalFlashcard(id: string): PersonalFlashcard | undefined {
  return read().find(c => c.id === id);
}

export function addPersonalFlashcard(input: { front: string; back: string; sourceLessonId: string; sourceLessonTitle: string }): PersonalFlashcard {
  const card: PersonalFlashcard = { ...input, id: `pf-${Date.now()}`, createdAt: new Date().toISOString() };
  write([...read(), card]);
  return card;
}

export function updatePersonalFlashcard(id: string, updates: Partial<Pick<PersonalFlashcard, "front" | "back">>) {
  write(read().map(c => c.id === id ? { ...c, ...updates } : c));
}

export function removePersonalFlashcard(id: string) {
  write(read().filter(c => c.id !== id));
}
