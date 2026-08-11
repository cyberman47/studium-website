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

import {
  attachAIRecommendation, calculateDailyTarget, getAllSubjectSignals, getDaysRemaining, getExamConfig, getExamStage,
  SubjectSignals
} from "./studyPlanner";

const AI_CACHE_KEY = "studium_study_plan_ai_cache";

type AICacheEntry = { dateKey: string; inputsHash: string };

function today(): string {
  return new Date().toISOString().slice(0, 10);
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

export type AIPlanResult = { ok: true; skipped: boolean } | { ok: false; error: string };

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
    return { ok: true, skipped: false };
  } catch {
    return { ok: false, error: "Couldn't reach the AI recommendation service." };
  }
}
