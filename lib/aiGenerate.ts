// Real AI-backed study content generation—flashcards and quizzes, from
// either real user-provided text (pasted notes or a .txt file's actual
// contents) or a real list of curriculum topics. Calls the secure server
// route /api/generate (app/api/generate/route.ts), which holds the
// Anthropic key server-side, same architecture as the AI Tutor
// (lib/tutorChat.ts).
import { Difficulty, GeneratedFlashcard, GeneratedQuestion } from "./create";

export type ContentSource = { kind: "topics"; topics: string[] } | { kind: "text"; text: string; fileName?: string };

type GenerateResult<T> = { items: T } | { error: string };

async function callGenerate<T>(mode: "flashcards" | "quiz", source: ContentSource, count: number, difficulty: Difficulty | "Mixed"): Promise<GenerateResult<T>> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, source, count, difficulty })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { error: (data && typeof data.error === "string") ? data.error : "Generation failed—try again." };
    if (!data || !Array.isArray(data.items)) return { error: "Generation failed—try again." };
    return { items: data.items as T };
  } catch {
    return { error: "Couldn't reach the AI generator—check your connection and try again." };
  }
}

export function generateFlashcards(source: ContentSource, count: number, difficulty: Difficulty | "Mixed") {
  return callGenerate<GeneratedFlashcard[]>("flashcards", source, count, difficulty);
}

export function generateQuiz(source: ContentSource, count: number, difficulty: Difficulty | "Mixed") {
  return callGenerate<GeneratedQuestion[]>("quiz", source, count, difficulty);
}

// ---- Handoff between pages ----
// Real captured text (pasted, or a real .txt file's contents) needs to
// reach the flashcards/quiz generator pages. sessionStorage, not
// localStorage, so a stale pending source can't silently resurface in a
// later, unrelated session.

const PENDING_SOURCE_KEY = "studium_create_pending_source";

export function setPendingSource(source: ContentSource) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_SOURCE_KEY, JSON.stringify(source));
}

export function consumePendingSource(): ContentSource | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_SOURCE_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_SOURCE_KEY);
  try { return JSON.parse(raw); } catch { return null; }
}

// Same handoff pattern for already-generated flashcards (e.g. from the
// curriculum topic-picker at /dashboard/create/build-flashcards) reaching
// the flashcards editor page to be reviewed/edited before saving.
const PENDING_CARDS_KEY = "studium_create_pending_cards";

export function setPendingFlashcards(cards: GeneratedFlashcard[], sourceLabel: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_CARDS_KEY, JSON.stringify({ cards, sourceLabel }));
}

export function consumePendingFlashcards(): { cards: GeneratedFlashcard[]; sourceLabel: string } | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_CARDS_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_CARDS_KEY);
  try { return JSON.parse(raw); } catch { return null; }
}
