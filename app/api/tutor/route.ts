// Real backend endpoint for the Studium AI Tutor. Holds the Anthropic API
// key server-side only (never sent to the client) and streams a genuine
// model reply back to lib/tutorChat.ts's fetch call. No auth/session system
// exists in this app yet, so this endpoint is honestly reachable by anyone
// who can reach the server—mitigated by a real per-user/per-IP rate limit
// (lib/aiRateLimit.ts, backed by Supabase) below, on top of request
// validation and whatever spend cap is set on the key in the Anthropic
// Console.

import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkAiRateLimit, rateLimitResponse } from "@/lib/aiRateLimit";

export const runtime = "nodejs";

// Chat is the most frequently-called of the three AI routes (a normal study
// session sends many short messages), so its window is the most generous.
const RATE_LIMIT = { windowMinutes: 15, maxRequests: 30 };

type TutorMode = "tutor" | "deepdive" | "simplify";

type TutorContext = {
  sectionName: string;
  subjectName: string;
  lessonTitle: string;
  lessonId: string;
  currentStep: string;
  currentFlashcard: { front: string; back: string } | null;
  currentPracticeQuestion: { question: string; studentAnswer: string | null } | null;
  recentMistakes: string[];
  studentLevel: string;
};

type HistoryTurn = { role: "user" | "assistant"; text: string };

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 1024;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_TURNS = 20;
const MAX_MISTAKES = 20;

// Same real prose that used to power buildPlaceholderReply's "if it were
// connected, I'd..." line—now it's genuinely the model's instruction.
const modeInstructions: Record<TutorMode, string> = {
  tutor: "Explain concepts clearly and directly, like a patient one-on-one tutor.",
  deepdive: "Give a comprehensive, structured, end-to-end breakdown: explain the underlying mechanism, walk through the logic step-by-step, and connect it to related concepts the student should already know.",
  simplify: "Break the explanation down into the simplest, most beginner-friendly terms possible—lean on a plain-language analogy."
};

// Deep Dive is the one mode where real length is the point, not a flaw—every
// other mode stays deliberately short since this renders in a small chat
// panel. Kept separate from modeInstructions (which shapes *what* to say)
// so this only shapes *how much*.
const modeLengthGuidance: Record<TutorMode, string> = {
  tutor: "Keep replies focused and concise—this renders in a small chat panel, not an essay.",
  deepdive: "Thoroughness is the point here: structure the reply into short labeled sections or numbered steps so a long answer still stays easy to follow. Don't pad it with repetition just to seem thorough.",
  simplify: "Keep it short—one clear analogy plus a one-line takeaway is usually enough."
};

const modeLabels: Record<TutorMode, string> = { tutor: "Tutor", deepdive: "Deep Dive", simplify: "Simplify" };

function isTutorMode(v: unknown): v is TutorMode {
  return v === "tutor" || v === "deepdive" || v === "simplify";
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
}

function sanitizeContext(raw: unknown): TutorContext | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  if (typeof c.lessonTitle !== "string") return null;
  const flashcard = c.currentFlashcard as Record<string, unknown> | null | undefined;
  const practice = c.currentPracticeQuestion as Record<string, unknown> | null | undefined;
  return {
    sectionName: typeof c.sectionName === "string" ? c.sectionName : "",
    subjectName: typeof c.subjectName === "string" ? c.subjectName : "",
    lessonTitle: c.lessonTitle,
    lessonId: typeof c.lessonId === "string" ? c.lessonId : "",
    currentStep: typeof c.currentStep === "string" ? c.currentStep : "",
    currentFlashcard: flashcard && typeof flashcard.front === "string"
      ? { front: flashcard.front, back: typeof flashcard.back === "string" ? flashcard.back : "" }
      : null,
    currentPracticeQuestion: practice && typeof practice.question === "string"
      ? { question: practice.question, studentAnswer: typeof practice.studentAnswer === "string" ? practice.studentAnswer : null }
      : null,
    recentMistakes: Array.isArray(c.recentMistakes) ? c.recentMistakes.filter((m): m is string => typeof m === "string").slice(0, MAX_MISTAKES) : [],
    studentLevel: typeof c.studentLevel === "string" ? c.studentLevel : ""
  };
}

function sanitizeHistory(raw: unknown): HistoryTurn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((h): h is { role: string; text: string } => !!h && (h.role === "user" || h.role === "assistant") && typeof h.text === "string")
    .slice(-MAX_HISTORY_TURNS)
    .map(h => ({ role: h.role as "user" | "assistant", text: h.text.slice(0, MAX_MESSAGE_LENGTH) }));
}

function buildSystemPrompt(mode: TutorMode, context: TutorContext): string {
  const lines = [
    "You are Studium AI, an in-lesson study tutor for a medical/MCAT-prep student.",
    modeInstructions[mode],
    "",
    "Current context:",
    `Subject: ${context.subjectName} (${context.sectionName})`,
    `Lesson: ${context.lessonTitle} · step: ${context.currentStep}`,
    `Student self-reported level: ${context.studentLevel || "not specified"}`
  ];
  if (context.currentFlashcard) {
    lines.push(`Current flashcard: front = "${context.currentFlashcard.front}", back = "${context.currentFlashcard.back}"`);
  }
  if (context.currentPracticeQuestion) {
    const { question, studentAnswer } = context.currentPracticeQuestion;
    lines.push(`Current practice question: "${question}"${studentAnswer ? ` — student answered: "${studentAnswer}"` : " (not yet answered)"}`);
  }
  if (context.recentMistakes.length > 0) {
    lines.push(`Recent mistakes/misses: ${context.recentMistakes.join(", ")}`);
  }
  lines.push(
    "",
    `Mode: ${modeLabels[mode]}. ${modeLengthGuidance[mode]} Plain text only (no markdown headers or tables); short paragraphs or a simple dashed list are fine.`
  );
  return lines.join("\n");
}

function describeAnthropicError(err: APIError): string {
  if (err.status === 401) return "The AI Tutor's API key is invalid or missing.";
  if (err.status === 429) return "The AI Tutor is rate-limited right now—try again in a moment.";
  if (err.status && err.status >= 500) return "Anthropic's API is having trouble right now—try again shortly.";
  return "The AI Tutor couldn't process that request.";
}

export async function POST(req: NextRequest) {
  const rateLimit = await checkAiRateLimit(req, RATE_LIMIT);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError("The AI Tutor isn't configured yet—no Anthropic API key is set on the server.", 500);
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  const body = (raw ?? {}) as Record<string, unknown>;

  const message = body.message;
  if (typeof message !== "string" || !message.trim() || message.length > MAX_MESSAGE_LENGTH) {
    return jsonError("Message is missing, empty, or too long.", 400);
  }
  if (!isTutorMode(body.mode)) {
    return jsonError("Unknown tutor mode.", 400);
  }
  const context = sanitizeContext(body.context);
  if (!context) {
    return jsonError("Missing or invalid lesson context.", 400);
  }
  const history = sanitizeHistory(body.history);

  const anthropic = new Anthropic({ apiKey });
  const messages: Anthropic.MessageParam[] = [
    ...history.map(h => ({ role: h.role, content: h.text }) as Anthropic.MessageParam),
    { role: "user", content: message }
  ];

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: buildSystemPrompt(body.mode, context),
    messages
  });

  // The SDK's MessageStream is an async-iterable of raw server-sent events
  // (message_start, content_block_delta, ...), not a plain text stream—pull
  // the `text_delta` payloads out of it ourselves. Iterate manually (rather
  // than for-await) so we can peek the first real text chunk before
  // constructing the Response: an immediate failure (bad key, rate limit)
  // then becomes a clean JSON error with the right status, instead of the
  // client having to parse a broken stream.
  const iterator = stream[Symbol.asyncIterator]();

  function extractText(event: Anthropic.Messages.MessageStreamEvent): string | null {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") return event.delta.text;
    return null;
  }

  let firstText: string | null = null;
  try {
    while (firstText === null) {
      const { value, done } = await iterator.next();
      if (done) break;
      firstText = extractText(value);
    }
  } catch (err) {
    if (err instanceof APIError) {
      return jsonError(describeAnthropicError(err), err.status ?? 500);
    }
    return jsonError("The AI Tutor is temporarily unavailable.", 500);
  }

  const encoder = new TextEncoder();
  const responseBody = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (firstText) controller.enqueue(encoder.encode(firstText));
        while (true) {
          const { value, done } = await iterator.next();
          if (done) break;
          const text = extractText(value);
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch {
        // A genuine mid-flight failure after streaming had already started.
        // The response is already text/plain, so an honest inline notice is
        // the cleanest way to surface it without a separate error protocol.
        controller.enqueue(encoder.encode("\n\n⚠️ The response was interrupted—please try again."));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(responseBody, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
