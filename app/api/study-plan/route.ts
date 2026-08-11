// Real backend endpoint for the AI Study Planner. Mirrors app/api/tutor/route.ts's
// patterns exactly (same validation style, same jsonError shape, same
// Anthropic client construction)—the one real difference is this route asks
// for a single non-streaming, strictly-structured JSON reply instead of a
// streamed chat reply, since the planner needs typed fields it can validate
// and merge into the deterministic plan (lib/studyPlanner.ts), not prose.
//
// This route is deliberately NOT the planning engine. Every number it's
// given (days remaining, per-subject accuracy, mastery, confidence) is
// already computed by lib/studyPlanner.ts from real tracked data—Claude
// only interprets that structured summary into a short explanation and a
// bounded adjustment to the deterministic target, per the spec's "don't
// waste API calls on simple calculations" instruction.

import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 600;
const MAX_SUBJECTS = 12;

type Stage = "early" | "middle" | "final";
type Quadrant = "strength" | "lacksConfidence" | "overconfident" | "weakness" | "unrated";

type SubjectInput = {
  subjectName: string;
  sectionTitle: string;
  confidence: number | null;
  accuracyPercent: number | null;
  progressPercent: number;
  trend: "improving" | "declining" | "flat" | null;
  weakConceptCount: number;
  quadrant: Quadrant;
};

type PlanRequest = {
  daysRemaining: number;
  hoursPerDay: number;
  stage: Stage;
  overallConfidence: number;
  deterministicDailyKPTarget: number;
  deterministicIntensity: string;
  subjects: SubjectInput[];
};

type PlanResponse = {
  overall_readiness: number;
  study_intensity: "light" | "moderate" | "high" | "intensive";
  daily_kp_target: number;
  weekly_kp_target: number;
  priority_subjects: string[];
  recommendation: string;
};

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
}

const validQuadrants: Quadrant[] = ["strength", "lacksConfidence", "overconfident", "weakness", "unrated"];
const validStages: Stage[] = ["early", "middle", "final"];

function sanitizeSubjects(raw: unknown): SubjectInput[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: SubjectInput[] = [];
  for (const item of raw.slice(0, MAX_SUBJECTS)) {
    if (!item || typeof item !== "object") continue;
    const s = item as Record<string, unknown>;
    if (typeof s.subjectName !== "string" || typeof s.sectionTitle !== "string") continue;
    if (typeof s.quadrant !== "string" || !validQuadrants.includes(s.quadrant as Quadrant)) continue;
    out.push({
      subjectName: s.subjectName.slice(0, 80),
      sectionTitle: s.sectionTitle.slice(0, 80),
      confidence: typeof s.confidence === "number" ? Math.max(1, Math.min(5, s.confidence)) : null,
      accuracyPercent: typeof s.accuracyPercent === "number" ? Math.max(0, Math.min(100, s.accuracyPercent)) : null,
      progressPercent: typeof s.progressPercent === "number" ? Math.max(0, Math.min(100, s.progressPercent)) : 0,
      trend: s.trend === "improving" || s.trend === "declining" || s.trend === "flat" ? s.trend : null,
      weakConceptCount: typeof s.weakConceptCount === "number" ? Math.max(0, Math.round(s.weakConceptCount)) : 0,
      quadrant: s.quadrant as Quadrant
    });
  }
  return out.length > 0 ? out : null;
}

function sanitizeRequest(raw: unknown): PlanRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  const subjects = sanitizeSubjects(b.subjects);
  if (!subjects) return null;
  if (typeof b.daysRemaining !== "number" || typeof b.hoursPerDay !== "number") return null;
  if (typeof b.stage !== "string" || !validStages.includes(b.stage as Stage)) return null;
  if (typeof b.deterministicDailyKPTarget !== "number") return null;
  return {
    daysRemaining: Math.max(0, Math.round(b.daysRemaining)),
    hoursPerDay: Math.max(0, b.hoursPerDay),
    stage: b.stage as Stage,
    overallConfidence: typeof b.overallConfidence === "number" ? Math.max(1, Math.min(5, b.overallConfidence)) : 3,
    deterministicDailyKPTarget: Math.max(0, Math.round(b.deterministicDailyKPTarget)),
    deterministicIntensity: typeof b.deterministicIntensity === "string" ? b.deterministicIntensity.slice(0, 20) : "moderate",
    subjects
  };
}

// The exact structured-summary shape the spec asks for (§18)—plain labeled
// text per subject, not a prose paragraph, so Claude is interpreting real
// numbers rather than free-associating.
function buildPrompt(req: PlanRequest): string {
  const lines = [
    "Exam: MCAT",
    `Days remaining: ${req.daysRemaining}`,
    `Available study time: ${req.hoursPerDay} hour(s)/day`,
    `Prep stage: ${req.stage}`,
    `Student's overall self-rated confidence: ${req.overallConfidence}/5`,
    `Deterministic baseline daily KP target: ${req.deterministicDailyKPTarget} (intensity: ${req.deterministicIntensity})`,
    "",
    "Per-subject signals:"
  ];
  for (const s of req.subjects) {
    lines.push(
      `- ${s.subjectName} (${s.sectionTitle}): confidence ${s.confidence ?? "not rated"}/5, ` +
      `accuracy ${s.accuracyPercent === null ? "no practice data yet" : `${s.accuracyPercent}%`}, ` +
      `lesson progress ${s.progressPercent}%, trend ${s.trend ?? "not enough data"}, ` +
      `${s.weakConceptCount} weak concept(s) logged, category: ${s.quadrant}`
    );
  }
  lines.push(
    "",
    "Respond with ONLY a single JSON object, no other text, matching exactly this shape:",
    `{"overall_readiness": number 0-100, "study_intensity": "light"|"moderate"|"high"|"intensive", "daily_kp_target": number, "weekly_kp_target": number, "priority_subjects": string[] (subject names from the list above, at most 4), "recommendation": string (1-2 short sentences, specific and encouraging, referencing real numbers above—never generic filler)}`,
    "daily_kp_target should stay close to the deterministic baseline above (small adjustments only, never more than 30% off it)—you are interpreting and explaining the plan, not replacing the calculation."
  );
  return lines.join("\n");
}

function describeAnthropicError(err: APIError): string {
  if (err.status === 401) return "The Study Planner's API key is invalid or missing.";
  if (err.status === 429) return "The Study Planner is rate-limited right now—try again in a moment.";
  if (err.status && err.status >= 500) return "Anthropic's API is having trouble right now—try again shortly.";
  return "The Study Planner AI couldn't process that request.";
}

function extractJSON(text: string): unknown {
  // The model occasionally wraps JSON in a code fence despite instructions—
  // strip one if present rather than failing on it.
  const stripped = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(stripped);
}

function validateResponse(raw: unknown, req: PlanRequest): PlanResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.overall_readiness !== "number" || typeof r.daily_kp_target !== "number" || typeof r.weekly_kp_target !== "number") return null;
  if (typeof r.recommendation !== "string" || !r.recommendation.trim()) return null;
  const validIntensities = ["light", "moderate", "high", "intensive"];
  if (typeof r.study_intensity !== "string" || !validIntensities.includes(r.study_intensity)) return null;

  const realNames = new Set(req.subjects.map(s => s.subjectName));
  const prioritySubjects = Array.isArray(r.priority_subjects)
    ? r.priority_subjects.filter((n): n is string => typeof n === "string" && realNames.has(n)).slice(0, 4)
    : [];

  // Safety bound (spec §16/§18): the AI can nudge the deterministic target,
  // never override it wholesale—clamp to ±30% of the real baseline that was
  // sent in, regardless of what the model actually returned.
  const min = Math.round(req.deterministicDailyKPTarget * 0.7);
  const max = Math.round(req.deterministicDailyKPTarget * 1.3);
  const dailyKPTarget = Math.max(min, Math.min(max, Math.round(r.daily_kp_target)));

  return {
    overall_readiness: Math.max(0, Math.min(100, Math.round(r.overall_readiness))),
    study_intensity: r.study_intensity as PlanResponse["study_intensity"],
    daily_kp_target: dailyKPTarget,
    weekly_kp_target: Math.max(0, Math.round(r.weekly_kp_target)),
    priority_subjects: prioritySubjects,
    recommendation: r.recommendation.slice(0, 500)
  };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError("The Study Planner AI isn't configured yet—no Anthropic API key is set on the server.", 500);
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const planRequest = sanitizeRequest(raw);
  if (!planRequest) {
    return jsonError("Missing or invalid study plan signals.", 400);
  }

  const anthropic = new Anthropic({ apiKey });

  let message;
  try {
    message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: "You are the AI planning layer behind Studium's Study Planner. You interpret pre-computed real student performance data into a short recommendation and a bounded KP-target adjustment. You never invent data, never see raw student content, and always respond with strictly valid JSON only—no markdown, no commentary outside the JSON object.",
      messages: [{ role: "user", content: buildPrompt(planRequest) }]
    });
  } catch (err) {
    if (err instanceof APIError) return jsonError(describeAnthropicError(err), err.status ?? 500);
    return jsonError("The Study Planner AI is temporarily unavailable.", 500);
  }

  const textBlock = message.content.find((b): b is Anthropic.TextBlock => b.type === "text");
  if (!textBlock) return jsonError("The Study Planner AI returned an empty response.", 502);

  let parsed: unknown;
  try {
    parsed = extractJSON(textBlock.text);
  } catch {
    return jsonError("The Study Planner AI returned malformed JSON.", 502);
  }

  const validated = validateResponse(parsed, planRequest);
  if (!validated) {
    return jsonError("The Study Planner AI's response didn't match the expected shape.", 502);
  }

  return new Response(JSON.stringify(validated), { headers: { "Content-Type": "application/json" } });
}
