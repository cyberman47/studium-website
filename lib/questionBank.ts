// A standalone question bank, separate from Clinical Cases and spaced-
// repetition flashcards (both already real, elsewhere)—this is genuinely
// new storage for admin-authored MCQ/image/ECG/case-based questions, real
// CRUD backed by localStorage. Not yet wired into a student-facing quiz
// flow (that would be a separate, sizable feature); the admin bank here is
// the honest first half: real authored content with no fake "usage" stats
// bolted on until a real quiz consumer exists.

export type QuestionType = "mcq" | "image" | "ecg" | "case" | "flashcard";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type BankQuestion = {
  id: string;
  type: QuestionType;
  category: string; // free-text subject/category, e.g. "Cardiology"
  difficulty: Difficulty;
  question: string;
  imageUrl?: string; // for image/ecg types
  options: string[]; // empty for flashcard
  correctIndex: number; // -1 for flashcard
  explanation: string;
  relatedLessonId?: string;
  createdAt: string;
};

const BANK_KEY = "studium_question_bank";
export const QUESTION_BANK_EVENT = "studium:questionBankChange";

function readBank(): BankQuestion[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(BANK_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeBank(list: BankQuestion[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BANK_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(QUESTION_BANK_EVENT));
}

export function getQuestions(): BankQuestion[] {
  return readBank().slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function slugifyId(text: string): string {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

export function addQuestion(input: Omit<BankQuestion, "id" | "createdAt">): { ok: true; question: BankQuestion } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.question.trim()) return { ok: false, error: "Question text is required." };
  if (input.type !== "flashcard") {
    if (input.options.filter(o => o.trim()).length < 2) return { ok: false, error: "At least 2 answer options are required." };
    if (input.correctIndex < 0 || input.correctIndex >= input.options.length) return { ok: false, error: "Correct answer index is out of range." };
  }
  const base = slugifyId(input.question) || "question";
  let id = base;
  let n = 1;
  const existing = readBank();
  while (existing.some(q => q.id === id)) { id = `${base}-${++n}`; }
  const q: BankQuestion = { ...input, id, createdAt: new Date().toISOString() };
  writeBank([...existing, q]);
  return { ok: true, question: q };
}

export function updateQuestion(id: string, updates: Partial<Omit<BankQuestion, "id" | "createdAt">>): { ok: true } | { ok: false; error: string } {
  const existing = readBank();
  const idx = existing.findIndex(q => q.id === id);
  if (idx === -1) return { ok: false, error: "Question not found." };
  const next = [...existing];
  next[idx] = { ...next[idx], ...updates };
  writeBank(next);
  return { ok: true };
}

export function removeQuestion(id: string) {
  writeBank(readBank().filter(q => q.id !== id));
}

export const questionTypeLabels: Record<QuestionType, string> = {
  mcq: "Multiple Choice",
  image: "Image-Based",
  ecg: "ECG Interpretation",
  case: "Case-Based",
  flashcard: "Flashcard"
};
