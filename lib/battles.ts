"use client";

// Studium Battles: real 1v1 KP races, started by directly challenging a
// specific real student off the leaderboard—no queue, no random
// matchmaking, no separate section to visit first. Every write goes
// through the SECURITY DEFINER functions in supabase/migrations/
// 0007_leaderboard_tiers_and_battles.sql (challenge_to_battle/
// settle_battle)—this file never writes to public.battles directly,
// matching its RLS (select-only for a client; see the migration's
// comments). Settlement is lazy, not cron-driven (same "no cron
// dependency" pattern as lib/leaderboardSync.ts's weekly reset): whichever
// client reads a battle past its ends_at is the one that finalizes it.

import { createClient } from "./supabase/client";

export type ChallengeResult = { battleId: string; endsAt: string; alreadyActive: boolean } | null;

// Challenges a specific opponent (e.g. a row on the real leaderboard) to a
// 24-hour KP race. Idempotent per opponent—calling it again while a battle
// against that same person is already active just returns that battle
// instead of starting a duplicate.
export async function challengeToBattle(opponentId: string): Promise<ChallengeResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === opponentId) return null;
  const { data, error } = await supabase.rpc("challenge_to_battle", { opponent_id: opponentId }).maybeSingle();
  if (error || !data) return null;
  const row = data as { battle_id: string; ends_at: string; already_active: boolean };
  return { battleId: row.battle_id, endsAt: row.ends_at, alreadyActive: row.already_active };
}

export type BattleProgress = {
  id: string;
  status: "active" | "completed";
  startedAt: string;
  endsAt: string;
  winnerId: string | null;
  you: { id: string; name: string; kpGained: number };
  opponent: { id: string; name: string; kpGained: number };
};

type BattleProgressRow = {
  id: string; status: "active" | "completed"; started_at: string; ends_at: string; winner_id: string | null;
  player_a: string; player_a_name: string; player_a_kp_gained: number;
  player_b: string; player_b_name: string; player_b_kp_gained: number;
};

function toBattleProgress(row: BattleProgressRow, userId: string): BattleProgress {
  const youAreA = row.player_a === userId;
  return {
    id: row.id, status: row.status, startedAt: row.started_at, endsAt: row.ends_at, winnerId: row.winner_id,
    you: youAreA
      ? { id: row.player_a, name: row.player_a_name, kpGained: row.player_a_kp_gained }
      : { id: row.player_b, name: row.player_b_name, kpGained: row.player_b_kp_gained },
    opponent: youAreA
      ? { id: row.player_b, name: row.player_b_name, kpGained: row.player_b_kp_gained }
      : { id: row.player_a, name: row.player_a_name, kpGained: row.player_a_kp_gained }
  };
}

// Every battle the caller is in (active and completed alike—the UI splits
// them). Any row whose ends_at has already passed gets settled first (real
// winner computed from real current KP), so the list this returns always
// reflects the true, final state rather than a stale "still active".
export async function getMyBattles(): Promise<BattleProgress[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("my_battle_progress").select("*");
  const rows = (data ?? []) as BattleProgressRow[];

  const now = Date.now();
  const toSettle = rows.filter(r => r.status === "active" && new Date(r.ends_at).getTime() <= now);
  if (toSettle.length > 0) {
    await Promise.all(toSettle.map(r => supabase.rpc("settle_battle", { target_battle_id: r.id })));
    const { data: fresh } = await supabase.from("my_battle_progress").select("*");
    return ((fresh ?? []) as BattleProgressRow[]).map(r => toBattleProgress(r, user.id));
  }

  return rows.map(r => toBattleProgress(r, user.id));
}
