"use client";

// Studium Community Challenges: real challenge definitions live in
// public.community_challenges (supabase/migrations/0010_challenges.sql,
// seeded there—never fabricated here), and every student's progress is
// computed from a signal Studium already tracks, never invented:
//
//   kp_gained / streak_days  → profiles.total_kp / profiles.current_streak,
//   the same two columns the real Leaderboard already syncs (lib/
//   leaderboardSync.ts), so these two metrics get a genuine cross-user
//   leaderboard (public.leaderboard joined against who's actually
//   participating).
//
//   flashcards_mastered / quizzes_completed / lessons_completed → local-only
//   signals (lib/flashcardLibrary.ts, lib/progress.ts's Stats, lib/
//   mcatPath.ts's real MCAT→Biology lesson completion) that don't sync
//   cross-device yet. A student can still genuinely join and see their own
//   real progress since joining (baseline_value captured at join time), but
//   there is honestly no cross-user leaderboard for these—getChallengeLeaderboard
//   returns null rather than faking one, and the UI discloses this directly.

import { createClient } from "./supabase/client";
import { getStats, getStreak, getTotalKP } from "./progress";
import { getMasteredFlashcardsCount } from "./flashcardLibrary";
import { findSubject, getLessonStatus } from "./mcatPath";

export type ChallengeMetric = "kp_gained" | "streak_days" | "flashcards_mastered" | "quizzes_completed" | "lessons_completed";

export const metricLabels: Record<ChallengeMetric, string> = {
  kp_gained: "Knowledge Points", streak_days: "Day streak",
  flashcards_mastered: "Flashcards mastered", quizzes_completed: "Quizzes completed", lessons_completed: "Lessons completed"
};

// Only these two are backed by a column Studium already syncs cross-device—
// every other metric is honestly personal-only until that changes.
const LEADERBOARD_METRICS: ChallengeMetric[] = ["kp_gained", "streak_days"];

export type ChallengeDef = {
  id: string; slug: string; title: string; description: string;
  metric: ChallengeMetric; targetValue: number; startsAt: string; endsAt: string;
};

type ChallengeRow = { id: string; slug: string; title: string; description: string; metric: ChallengeMetric; target_value: number; starts_at: string; ends_at: string };

function rowToChallenge(r: ChallengeRow): ChallengeDef {
  return { id: r.id, slug: r.slug, title: r.title, description: r.description, metric: r.metric, targetValue: r.target_value, startsAt: r.starts_at, endsAt: r.ends_at };
}

export async function fetchChallengeDefs(): Promise<ChallengeDef[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("community_challenges").select("*").order("target_value", { ascending: true });
  if (error || !data) return [];
  return (data as ChallengeRow[]).map(rowToChallenge);
}

// The real, current value of whatever this challenge measures—every branch
// reads an existing getter, nothing here is a new counter.
function getLocalMetricValue(metric: ChallengeMetric): number {
  switch (metric) {
    case "kp_gained": return getTotalKP();
    case "streak_days": return getStreak();
    case "flashcards_mastered": return getMasteredFlashcardsCount();
    case "quizzes_completed": return getStats().aiQuizzesCompleted;
    case "lessons_completed": {
      const biology = findSubject("bio-biochem", "biology");
      if (!biology) return 0;
      const ids = biology.lessons.map(l => l.id);
      return ids.filter(id => getLessonStatus(ids, id) === "completed").length;
    }
  }
}

export type MyChallengeProgress = {
  challenge: ChallengeDef;
  joined: boolean;
  currentValue: number;
  progressPercent: number;
  completed: boolean;
  hasLeaderboard: boolean;
};

type ParticipantRow = { challenge_id: string; user_id: string; baseline_value: number; completed_at: string | null };

export async function getMyChallenges(): Promise<MyChallengeProgress[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const defs = await fetchChallengeDefs();
  if (!user) return defs.map(challenge => ({ challenge, joined: false, currentValue: 0, progressPercent: 0, completed: false, hasLeaderboard: LEADERBOARD_METRICS.includes(challenge.metric) }));

  const { data: participantData } = await supabase.from("community_challenge_participants").select("*").eq("user_id", user.id);
  const myParticipation = new Map<string, ParticipantRow>((participantData ?? []).map((p: ParticipantRow) => [p.challenge_id, p]));

  const toComplete: string[] = [];
  const result = defs.map(challenge => {
    const participant = myParticipation.get(challenge.id);
    const joined = !!participant;
    let currentValue = 0;
    if (joined) {
      const live = getLocalMetricValue(challenge.metric);
      // "Reach a streak of N" is a threshold on the live number itself, not
      // a delta since joining—every other metric is genuinely "since you
      // joined," so it subtracts the real baseline captured at join time.
      currentValue = challenge.metric === "streak_days" ? live : Math.max(0, live - participant.baseline_value);
    }
    const completed = joined && currentValue >= challenge.targetValue;
    if (completed && participant && !participant.completed_at) toComplete.push(challenge.id);
    return {
      challenge, joined, currentValue,
      progressPercent: Math.min(100, Math.round((currentValue / challenge.targetValue) * 100)),
      completed,
      hasLeaderboard: LEADERBOARD_METRICS.includes(challenge.metric)
    };
  });

  // Lazily stamp completion the first time it's genuinely detected—same
  // "compute live, stamp on first true" pattern as lib/achievements.ts.
  if (toComplete.length > 0) {
    void Promise.all(toComplete.map(id => supabase.from("community_challenge_participants").update({ completed_at: new Date().toISOString() }).eq("challenge_id", id).eq("user_id", user.id)));
  }

  return result;
}

export async function joinChallenge(challenge: ChallengeDef): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in to join a challenge." };
  const baseline = challenge.metric === "streak_days" ? 0 : getLocalMetricValue(challenge.metric);
  const { error } = await supabase.from("community_challenge_participants").insert({ challenge_id: challenge.id, user_id: user.id, baseline_value: baseline });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function leaveChallenge(challengeId: string): Promise<{ ok: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  const { error } = await supabase.from("community_challenge_participants").delete().eq("challenge_id", challengeId).eq("user_id", user.id);
  return { ok: !error };
}

export type ChallengeLeaderboardRow = { userId: string; name: string; value: number; isYou: boolean };

// Returns null (not an empty array) for a metric that honestly has no
// cross-user leaderboard yet—lets the UI tell the two states apart.
export async function getChallengeLeaderboard(challenge: ChallengeDef): Promise<ChallengeLeaderboardRow[] | null> {
  if (!LEADERBOARD_METRICS.includes(challenge.metric)) return null;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: participants } = await supabase.from("community_challenge_participants").select("user_id, baseline_value").eq("challenge_id", challenge.id);
  const rows = participants ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((r: { user_id: string }) => r.user_id);
  const { data: board } = await supabase.from("leaderboard").select("id, name, total_kp, current_streak").in("id", ids);
  const boardMap = new Map((board ?? []).map((b: { id: string; name: string; total_kp: number; current_streak: number }) => [b.id, b]));

  const result: ChallengeLeaderboardRow[] = rows
    .map((p: { user_id: string; baseline_value: number }) => {
      const b = boardMap.get(p.user_id);
      if (!b) return null;
      const value = challenge.metric === "kp_gained" ? Math.max(0, b.total_kp - p.baseline_value) : b.current_streak;
      return { userId: p.user_id, name: b.name, value, isYou: p.user_id === user?.id };
    })
    .filter((r: ChallengeLeaderboardRow | null): r is ChallengeLeaderboardRow => r !== null)
    .sort((a: ChallengeLeaderboardRow, b: ChallengeLeaderboardRow) => b.value - a.value);

  return result;
}
