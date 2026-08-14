// Client-side wrapper around app/api/study-plan—the only place in the app
// that calls the Study Planner's AI layer. Builds the exact structured
// summary lib/studyPlanner.ts already computed (never raw student content),
// posts it, and on success merges the result into today's cached plan via
// attachAIRecommendation. On any failure, this quietly leaves the
// deterministic plan untouched—the planner stays fully usable without AI,
// per the spec's "must remain functional even if the AI request fails."
//
// Caching: Claude is only called when the real underlying signals actually
// changed (a new day, or a subject's quadrant/confidence/accuracy shifted)
// or the student explicitly asks for a refresh—not on every page view.
//
// Daily cap: real API spend, so every actual call (cache-skips don't count)
// is capped at MAX_AI_CALLS_PER_DAY real days—enough for a setup + a
// couple of plan edits, not enough to be pinged on every keystroke.

import {
  attachAIRecommendation, calculateDailyTarget, getAllSubjectSignals, getDaysRemaining, getExamConfig, getExamStage,
  SubjectSignals
} from "./studyPlanner";

const AI_CACHE_KEY = "studium_study_plan_ai_cache";
const AI_CALLS_KEY = "studium_study_plan_ai_calls";
export const MAX_AI_CALLS_PER_DAY = 3;

type AICacheEntry = { dateKey: string; inputsHash: string };
type AICallRecord = { dateKey: string; count: number };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function readCallRecord(): AICallRecord {
  if (typeof window === "undefined") return { dateKey: today(), count: 0 };
  const raw = localStorage.getItem(AI_CALLS_KEY);
  const parsed: AICallRecord | null = raw ? JSON.parse(raw) : null;
  // A stored count from a previous day doesn't carry over—the cap resets
  // with the real calendar day, not a rolling 24h window.
  return parsed && parsed.dateKey === today() ? parsed : { dateKey: today(), count: 0 };
}

function bumpCallCount() {
  if (typeof window === "undefined") return;
  const rec = readCallRecord();
  localStorage.setItem(AI_CALLS_KEY, JSON.stringify({ dateKey: today(), count: rec.count + 1 }));
}

export function getAICallsRemainingToday(): number {
  return Math.max(0, MAX_AI_CALLS_PER_DAY - readCallRecord().count);
}

function hashInputs(signals: SubjectSignals[], dailyTarget: number): string {
  return JSON.stringify({
    target: dailyTarget,
    subjects: signals.map(s => `${s.subject.subjectId}:${s.quadrant.label}:${s.confidence}:${s.accuracy.percent}`)
  });
}

function readCache(): AICacheEntry | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AI_CACHE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function writeCache(entry: AICacheEntry) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AI_CACHE_KEY, JSON.stringify(entry));
}

export type AIPlanResult = { ok: true; skipped: boolean } | { ok: false; error: string; limitReached?: boolean };

export async function refreshAIRecommendation(force = false): Promise<AIPlanResult> {
  const config = getExamConfig();
  if (!config) return { ok: false, error: "No exam configured yet." };

  const signals = getAllSubjectSignals();
  const { dailyKPTarget, intensity } = calculateDailyTarget(config, signals);
  const stage = getExamStage(config);

  const inputsHash = hashInputs(signals, dailyKPTarget);
  const cache = readCache();
  if (!force && cache && cache.dateKey === today() && cache.inputsHash === inputsHash) {
    return { ok: true, skipped: true };
  }

  // Hard daily cap, checked before ever touching the network—applies even
  // when force=true (an explicit plan edit), since that's exactly the
  // repeatable action a cap needs to guard against.
  if (getAICallsRemainingToday() <= 0) {
    return {
      ok: false,
      limitReached: true,
      error: `You've used today's ${MAX_AI_CALLS_PER_DAY} AI recommendations. Your plan still updates for real—just without a fresh note until tomorrow.`
    };
  }

  const body = {
    daysRemaining: getDaysRemaining(config.examDate),
    hoursPerDay: config.hoursPerDay,
    stage,
    overallConfidence: config.overallConfidence,
    deterministicDailyKPTarget: dailyKPTarget,
    deterministicIntensity: intensity,
    subjects: signals.map(s => ({
      subjectName: s.subject.subjectName,
      sectionTitle: s.subject.sectionTitle,
      confidence: s.confidence,
      accuracyPercent: s.accuracy.percent,
      progressPercent: s.progressPercent,
      trend: s.trend,
      weakConceptCount: s.weakConcepts.length,
      quadrant: s.quadrant.label
    }))
  };

  try {
    const res = await fetch("/api/study-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) {
      let message = "The AI recommendation isn't available right now.";
      try {
        const data = await res.json();
        if (data && typeof data.error === "string") message = data.error;
      } catch {
        // Non-JSON error body—keep the generic message above.
      }
      return { ok: false, error: message };
    }
    const data = await res.json();
    attachAIRecommendation(data.recommendation, data.daily_kp_target);
    writeCache({ dateKey: today(), inputsHash });
    bumpCallCount();
    return { ok: true, skipped: false };
  } catch {
    return { ok: false, error: "Couldn't reach the AI recommendation service." };
  }
}
