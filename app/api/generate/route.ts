// Real study-content generator: quizzes and flashcards, grounded in either a
// real list of curriculum topics or real user-provided text (pasted notes,
// or a .txt file's actual contents). Non-streaming—callers need one
// complete, valid JSON payload to parse, not a token stream—so this waits
// for the full Anthropic response before returning. Same security posture
// as /api/tutor (app/api/tutor/route.ts): key stays server-side only,
// protected by the same real per-user/per-IP rate limit (lib/aiRateLimit.ts).
import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkAiRateLimit, rateLimitResponse } from "@/lib/aiRateLimit";

export const runtime = "nodejs";

type Mode = "flashcards" | "quiz" | "lesson" | "summary" | "terms";
type Difficulty = "Easy" | "Medium" | "Hard" | "Mixed";
type Source = { kind: "topics"; topics: string[] } | { kind: "text"; text: string; fileName?: string };

// "lesson" and "summary" each produce exactly one structured object, not a
// list—every other mode produces an array of independent items.
const objectModes = new Set<Mode>(["lesson", "summary"]);

const termCategoryIds = ["anatomy", "biology", "microbiology", "pharmacology", "pathology", "clinical", "abbreviations"];

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 4096;
const MAX_TOPICS = 25;
const MAX_TEXT_LENGTH = 20000;
const MAX_COUNT = 30;
// The most expensive of the three routes (largest MAX_TOKENS, can process
// up to 20k characters of pasted text), so it gets the tightest window.
const RATE_LIMIT = { windowMinutes: 15, maxRequests: 10 };

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
}

function isMode(v: unknown): v is Mode { return v === "flashcards" || v === "quiz" || v === "lesson" || v === "summary" || v === "terms"; }
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

function buildPrompt(mode: Mode, source: Source, count: number, difficulty: Difficulty, track: string | null): { system: string; user: string } {
  const sourceLine = source.kind === "topics"
    ? `Base every item strictly on these medical study topics: ${source.topics.join(", ")}.`
    : `Base every item strictly on the real study material below${source.fileName ? ` (from "${source.fileName}")` : ""}. Do not invent facts absent from it.\n\n---\n${source.text}\n---`;

  const difficultyLine = difficulty === "Mixed" ? "Mix difficulties across Easy, Medium, and Hard." : `Target difficulty: ${difficulty}.`;
  const shape = objectModes.has(mode) ? "a single valid JSON object" : "a single valid JSON array";
  // Frames content for the student's actual field when known (e.g. "Nursing"
  // vs "MCAT Preparation")—falls back to the original generic medical/MCAT
  // framing when no track was sent (older client, or none selected yet).
  const audienceLine = track ? `a study content generator for a ${track} student` : "a medical/MCAT study content generator";
  const system = `You are ${audienceLine}. Output ONLY ${shape}, no prose, no markdown code fences, no commentary before or after.`;

  if (mode === "flashcards") {
    return {
      system,
      user: `Generate exactly ${count} flashcards. ${sourceLine}\n${difficultyLine}\n\nReturn a JSON array where each item is exactly: {"question": string, "answer": string, "difficulty": "Easy"|"Medium"|"Hard"}. The question should be a clear prompt (a term, concept, or "what/why/how" question); the answer should be concise but complete (1-3 sentences).`
    };
  }
  if (mode === "quiz") {
    return {
      system,
      user: `Generate exactly ${count} quiz questions. ${sourceLine}\n${difficultyLine}\nUse a mix of question types.\n\nReturn a JSON array where each item is exactly: {"type": "multiple-choice"|"true-false"|"short-answer"|"clinical-scenario", "question": string, "options": string[] (exactly 4 options, only for multiple-choice; omit for other types), "correctAnswer": string, "explanation": string, "difficulty": "Easy"|"Medium"|"Hard"}. For multiple-choice, correctAnswer must exactly match one of the options.`
    };
  }
  if (mode === "lesson") {
    return {
      system,
      user: `Write one complete, structured study lesson. ${sourceLine}\n\nReturn a single JSON object, exactly: {"title": string, "introduction": string (2-4 sentences), "mainConcepts": [{"heading": string, "body": string (3-5 sentences)}] (3-5 items), "examples": string[] (2-4 concrete examples), "keyTakeaways": string[] (3-5 items), "practiceQuestions": [{"question": string, "correctAnswer": string}] (3-5 items), "summary": string (2-3 sentences), "flashcards": [{"question": string, "answer": string}] (4-6 items)}.`
    };
  }
  if (mode === "summary") {
    return {
      system,
      user: `Write one real study summary. ${sourceLine}\n\nReturn a single JSON object, exactly: {"shortSummary": string (3-5 sentences), "highYieldNotes": string[] (4-8 short, exam-focused bullet points), "importantConcepts": string[] (4-8 short concept names), "keyDefinitions": [{"term": string, "definition": string}] (3-6 items), "examTips": string[] (2-4 items)}.`
    };
  }
  // terms
  return {
    system,
    user: `Extract the ${count} most important, specific medical/scientific terms actually present in the material below (not generic words). ${sourceLine}\n\nReturn a JSON array where each item is exactly: {"name": string (the term itself), "definition": string (1-2 sentences, grounded in how the material uses it), "categoryId": one of ${termCategoryIds.map(id => `"${id}"`).join("|")}, "wordBreakdown": [{"part": string, "meaning": string}] (the term's real word roots/prefixes/suffixes if it has any medical ones worth breaking down, otherwise an empty array—never invent a breakdown for a term that doesn't have one)}.`
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

function extractJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    const parsed = JSON.parse(trimmed.slice(start, end + 1));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
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

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map(x => x.trim()) : [];
}

function validateLesson(raw: Record<string, unknown>) {
  const mainConcepts = Array.isArray(raw.mainConcepts)
    ? raw.mainConcepts
        .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
        .map(x => ({ heading: str(x.heading), body: str(x.body) }))
        .filter(c => c.heading && c.body)
    : [];
  const practiceQuestions = Array.isArray(raw.practiceQuestions)
    ? raw.practiceQuestions
        .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
        .map(x => ({ question: str(x.question), correctAnswer: str(x.correctAnswer) }))
        .filter(q => q.question && q.correctAnswer)
    : [];
  const flashcards = Array.isArray(raw.flashcards)
    ? raw.flashcards
        .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
        .map(x => ({ question: str(x.question), answer: str(x.answer), difficulty: coerceDifficulty(x.difficulty) }))
        .filter(c => c.question && c.answer)
    : [];
  const lesson = {
    title: str(raw.title), introduction: str(raw.introduction), mainConcepts,
    examples: strArray(raw.examples), keyTakeaways: strArray(raw.keyTakeaways),
    practiceQuestions, summary: str(raw.summary), flashcards
  };
  const valid = !!lesson.title && !!lesson.introduction && mainConcepts.length > 0;
  return valid ? lesson : null;
}

function validateSummary(raw: Record<string, unknown>) {
  const keyDefinitions = Array.isArray(raw.keyDefinitions)
    ? raw.keyDefinitions
        .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
        .map(x => ({ term: str(x.term), definition: str(x.definition) }))
        .filter(d => d.term && d.definition)
    : [];
  const summary = {
    shortSummary: str(raw.shortSummary), highYieldNotes: strArray(raw.highYieldNotes),
    importantConcepts: strArray(raw.importantConcepts), keyDefinitions, examTips: strArray(raw.examTips)
  };
  const valid = !!summary.shortSummary && summary.highYieldNotes.length > 0;
  return valid ? summary : null;
}

function validateTerms(raw: unknown[]) {
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map(x => ({
      name: str(x.name),
      definition: str(x.definition),
      categoryId: termCategoryIds.includes(x.categoryId as string) ? (x.categoryId as string) : "clinical",
      wordBreakdown: Array.isArray(x.wordBreakdown)
        ? x.wordBreakdown
            .filter((w): w is Record<string, unknown> => !!w && typeof w === "object")
            .map(w => ({ part: str(w.part), meaning: str(w.meaning) }))
            .filter(w => w.part && w.meaning)
        : []
    }))
    .filter(t => t.name && t.definition);
}

function describeAnthropicError(err: APIError): string {
  if (err.status === 401) return "The AI generator's API key is invalid or missing.";
  if (err.status === 429) return "The AI generator is rate-limited right now—try again in a moment.";
  if (err.status && err.status >= 500) return "Anthropic's API is having trouble right now—try again shortly.";
  return "The AI generator couldn't process that request.";
}

export async function POST(req: NextRequest) {
  const rateLimit = await checkAiRateLimit(req, RATE_LIMIT);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

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
  // The student's real "Currently Studying" track label (lib/currentPath.ts,
  // sent by lib/aiGenerate.ts)—optional, so an older cached client without
  // it still works exactly as before (generic medical/MCAT framing).
  const track = typeof body.track === "string" && body.track.trim().length > 0 ? body.track.trim().slice(0, 60) : null;

  const { system, user } = buildPrompt(mode, source, count, difficulty, track);

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

  if (objectModes.has(mode)) {
    const parsedObject = extractJsonObject(text);
    if (!parsedObject) return jsonError("The AI response wasn't valid JSON—try generating again.", 502);
    const item = mode === "lesson" ? validateLesson(parsedObject) : validateSummary(parsedObject);
    if (!item) return jsonError("The AI didn't return a usable result—try again.", 502);
    return new Response(JSON.stringify({ items: item }), { headers: { "Content-Type": "application/json" } });
  }

  const parsed = extractJsonArray(text);
  if (!parsed) return jsonError("The AI response wasn't valid JSON—try generating again.", 502);

  const items = mode === "flashcards" ? validateFlashcards(parsed) : mode === "quiz" ? validateQuiz(parsed) : validateTerms(parsed);
  if (items.length === 0) return jsonError("The AI didn't return any usable items—try again or adjust your topics.", 502);

  return new Response(JSON.stringify({ items }), { headers: { "Content-Type": "application/json" } });
}
