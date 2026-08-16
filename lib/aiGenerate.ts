// Real AI-backed study content generation—flashcards and quizzes, from
// either real user-provided text (pasted notes or a .txt file's actual
// contents) or a real list of curriculum topics. Calls the secure server
// route /api/generate (app/api/generate/route.ts), which holds the
// Anthropic key server-side, same architecture as the AI Tutor
// (lib/tutorChat.ts).
import { Difficulty, GeneratedExtractedTerm, GeneratedFlashcard, GeneratedLesson, GeneratedQuestion, GeneratedSummary } from "./create";
import { findCurrentPathDef, getCurrentPathId } from "./currentPath";

export type ContentSource = { kind: "topics"; topics: string[] } | { kind: "text"; text: string; fileName?: string };

type Mode = "flashcards" | "quiz" | "lesson" | "summary" | "terms";
type GenerateResult<T> = { items: T } | { error: string };

async function callGenerate<T>(mode: Mode, source: ContentSource, count: number, difficulty: Difficulty | "Mixed"): Promise<GenerateResult<T>> {
  try {
    // Frames generated content for the student's real "Currently Studying"
    // track (lib/currentPath.ts) rather than always assuming MCAT—every
    // existing caller gets this for free since it's read here, not passed
    // in by each page.
    const track = findCurrentPathDef(getCurrentPathId())?.label;
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, source, count, difficulty, track })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { error: (data && typeof data.error === "string") ? data.error : "Generation failed—try again." };
    // "lesson"/"summary" return a single object under items; every other
    // mode returns an array—either way, presence is all this generic
    // layer needs to check, the specific wrapper functions below own the
    // real shape.
    if (!data || data.items === undefined || data.items === null) return { error: "Generation failed—try again." };
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

export function generateLesson(source: ContentSource) {
  return callGenerate<GeneratedLesson>("lesson", source, 1, "Mixed");
}

export function generateSummary(source: ContentSource) {
  return callGenerate<GeneratedSummary>("summary", source, 1, "Mixed");
}

export function generateTerms(source: ContentSource, count: number) {
  return callGenerate<GeneratedExtractedTerm[]>("terms", source, count, "Mixed");
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
