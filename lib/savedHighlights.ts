// Real saved-snippet list ("⭐ Save" from the highlight popup). Genuinely
// persisted and listable in the tutor panel's Saved tab.

export type SavedHighlight = {
  id: string;
  text: string;
  sourceLessonId: string;
  sourceLessonTitle: string;
  createdAt: string;
};

const KEY = "studium_saved_highlights";
export const SAVED_HIGHLIGHTS_EVENT = "studium:savedHighlightsChange";

function read(): SavedHighlight[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

function write(list: SavedHighlight[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(SAVED_HIGHLIGHTS_EVENT));
}

export function getSavedHighlights(): SavedHighlight[] {
  return read().slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addSavedHighlight(input: { text: string; sourceLessonId: string; sourceLessonTitle: string }): SavedHighlight {
  const h: SavedHighlight = { ...input, id: `sh-${Date.now()}`, createdAt: new Date().toISOString() };
  write([...read(), h]);
  return h;
}

export function removeSavedHighlight(id: string) {
  write(read().filter(h => h.id !== id));
}
