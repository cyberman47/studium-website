// Real study-content generator: quizzes and flashcards, grounded in either a
// real list of curriculum topics or real user-provided text (pasted notes,
// or a .txt file's actual contents). Non-streaming—callers need one
// complete, valid JSON payload to parse, not a token stream—so this waits
// for the full Anthropic response before returning. Same security posture
// as /api/tutor (app/api/tutor/route.ts): key stays server-side only, no
// auth/rate-limiting exists yet since none exists anywhere in this app.
import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

type Mode = "flashcards" | "quiz";
type Difficulty = "Easy" | "Medium" | "Hard" | "Mixed";
type Source = { kind: "topics"; topics: string[] } | { kind: "text"; text: string; fileName?: string };

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 4096;
const MAX_TOPICS = 25;
const MAX_TEXT_LENGTH = 20000;
const MAX_COUNT = 30;

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
}

function isMode(v: unknown): v is Mode { return v === "flashcards" || v === "quiz"; }
function isDifficulty(v: unknown): v is Difficulty { return v === "Easy" || v === "Medium" || v === "Hard" || v === "Mixed"; }

function sanitizeSource(raw: unknown): Source | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  if (s.kind === "topics" && Array.isArray(s.topics)) {
    const topics = s.topics.filter((t): t is string => typeof t === "string" && t.trim().length > 0).slice(0, MAX_TOPICS);
    if (topics.length === 0) return null;
    return { kind: "topics", topics };
  }
  if (s.kind === "text" && typeof s.text === "string" && s.text.trim().length > 0) {
    return { kind: "text", text: s.text.slice(0, MAX_TEXT_LENGTH), fileName: typeof s.fileName === "string" ? s.fileName : undefined };
  }
  return null;
}

function buildPrompt(mode: Mode, source: Source, count: number, difficulty: Difficulty): { system: string; user: string } {
  const sourceLine = source.kind === "topics"
    ? `Base every item strictly on these medical/MCAT study topics: ${source.topics.join(", ")}.`
    : `Base every item strictly on the real study material below${source.fileName ? ` (from "${source.fileName}")` : ""}. Do not invent facts absent from it.\n\n---\n${source.text}\n---`;

  const difficultyLine = difficulty === "Mixed" ? "Mix difficulties across Easy, Medium, and Hard." : `Target difficulty: ${difficulty}.`;
  const system = "You are a medical/MCAT study content generator. Output ONLY a single valid JSON array, no prose, no markdown code fences, no commentary before or after.";

  if (mode === "flashcards") {
    return {
      system,
      user: `Generate exactly ${count} flashcards. ${sourceLine}\n${difficultyLine}\n\nReturn a JSON array where each item is exactly: {"question": string, "answer": string, "difficulty": "Easy"|"Medium"|"Hard"}. The question should be a clear prompt (a term, concept, or "what/why/how" question); the answer should be concise but complete (1-3 sentences).`
    };
  }
  return {
    system,
    user: `Generate exactly ${count} quiz questions. ${sourceLine}\n${difficultyLine}\nUse a mix of question types.\n\nReturn a JSON array where each item is exactly: {"type": "multiple-choice"|"true-false"|"short-answer"|"clinical-scenario", "question": string, "options": string[] (exactly 4 options, only for multiple-choice; omit for other types), "correctAnswer": string, "explanation": string, "difficulty": "Easy"|"Medium"|"Hard"}. For multiple-choice, correctAnswer must exactly match one of the options.`
  };
}

function extractJsonArray(text: string): unknown[] | null {
  const trimmed = text.trim();
  const start = trimmed.indexOf("[");
  const end = trimmed.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    const parsed = JSON.parse(trimmed.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function coerceDifficulty(v: unknown): "Easy" | "Medium" | "Hard" {
  return v === "Easy" || v === "Medium" || v === "Hard" ? v : "Medium";
}

function validateFlashcards(raw: unknown[]) {
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map(x => ({
      question: typeof x.question === "string" ? x.question.trim() : "",
      answer: typeof x.answer === "string" ? x.answer.trim() : "",
      difficulty: coerceDifficulty(x.difficulty)
    }))
    .filter(c => c.question && c.answer);
}

const questionTypes = new Set(["multiple-choice", "true-false", "short-answer", "clinical-scenario"]);

function validateQuiz(raw: unknown[]) {
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map(x => ({
      type: questionTypes.has(x.type as string) ? (x.type as string) : "short-answer",
      question: typeof x.question === "string" ? x.question.trim() : "",
      options: Array.isArray(x.options) ? x.options.filter((o): o is string => typeof o === "string") : undefined,
      correctAnswer: typeof x.correctAnswer === "string" ? x.correctAnswer.trim() : "",
      explanation: typeof x.explanation === "string" ? x.explanation.trim() : "",
      difficulty: coerceDifficulty(x.difficulty)
    }))
    .filter(q => q.question && q.correctAnswer);
}

function describeAnthropicError(err: APIError): string {
  if (err.status === 401) return "The AI generator's API key is invalid or missing.";
  if (err.status === 429) return "The AI generator is rate-limited right now—try again in a moment.";
  if (err.status && err.status >= 500) return "Anthropic's API is having trouble right now—try again shortly.";
  return "The AI generator couldn't process that request.";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return jsonError("AI generation isn't configured yet—no Anthropic API key is set on the server.", 500);

  let raw: unknown;
  try { raw = await req.json(); } catch { return jsonError("Invalid request body.", 400); }
  const body = (raw ?? {}) as Record<string, unknown>;

  if (!isMode(body.mode)) return jsonError("Unknown generation mode.", 400);
  const mode = body.mode;
  const source = sanitizeSource(body.source);
  if (!source) return jsonError("Missing or invalid source—provide topics or text.", 400);
  const count = typeof body.count === "number" && body.count > 0 ? Math.min(Math.round(body.count), MAX_COUNT) : 10;
  const difficulty = isDifficulty(body.difficulty) ? body.difficulty : "Mixed";

  const { system, user } = buildPrompt(mode, source, count, difficulty);

  const anthropic = new Anthropic({ apiKey });
  let message;
  try {
    message = await anthropic.messages.create({ model: MODEL, max_tokens: MAX_TOKENS, system, messages: [{ role: "user", content: user }] });
  } catch (err) {
    if (err instanceof APIError) return jsonError(describeAnthropicError(err), err.status ?? 500);
    return jsonError("AI generation is temporarily unavailable.", 500);
  }

  const textBlock = message.content.find(b => b.type === "text");
  const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
  const parsed = extractJsonArray(text);
  if (!parsed) return jsonError("The AI response wasn't valid JSON—try generating again.", 502);

  const items = mode === "flashcards" ? validateFlashcards(parsed) : validateQuiz(parsed);
  if (items.length === 0) return jsonError("The AI didn't return any usable items—try again or adjust your topics.", 502);

  return new Response(JSON.stringify({ items }), { headers: { "Content-Type": "application/json" } });
}
