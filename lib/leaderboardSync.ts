"use client";

// The real, cross-device/cross-student KP system. Every existing
// KP-earning call site in the app (dozens of them, across flashcards,
// lessons, quizzes, terminology, clinical cases, the study planner, ...)
// keeps calling lib/progress.ts's synchronous, localStorage-backed
// functions completely unchanged—rewriting all of those to an async
// Supabase read/write would be a huge, high-risk rewrite for no real
// benefit, since a fast local cache is exactly what a KP counter should
// be. What this file adds is reconciliation at the edges: on load, a
// signed-in student's Supabase-stored total_kp and their local total are
// compared and the *higher* one wins, adopted into whichever side is
// behind (see reconcileKPOnLoad)—so a fresh device catches up to real
// progress instead of showing 0, and an offline session's real progress
// still gets pushed up once it's back online. That reconciliation is what
// makes Supabase the genuine source of truth for "how much KP does this
// student actually have," not just a leaderboard mirror. Streak is pushed
// the same way for the leaderboard's sake, but isn't reconciled back
// on load—getStreak() depends on this browser's full day-by-day history
// (lib/progress.ts's STREAK_DAYS_KEY), which a single synced integer can't
// reconstruct, so streak stays this-device-only for now.

import { createClient } from "./supabase/client";
import { getStreak, getTotalKP, PROGRESS_EVENT, setTotalKPOverride } from "./progress";

export type LeaderboardRow = { id: string; name: string; totalKP: number; streak: number; isYou: boolean };

let syncTimer: ReturnType<typeof setTimeout> | null = null;

// Postgres's date_trunc('week', now())::date—Monday of the ISO week
// containing `d`, as a YYYY-MM-DD string. Kept local to this file (not
// imported from lib/progress.ts's own private mondayOf) since the two
// don't need to share an implementation, just agree on the definition.
function mondayKey(d: Date): string {
  const day = d.getUTCDay(); // 0=Sun..6=Sat
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diffToMonday));
  return monday.toISOString().slice(0, 10);
}

async function syncProfileStatsNow(): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // signed out—nothing shared to sync, local play stays local
  const totalKP = getTotalKP();

  // Lazy weekly reset (matches supabase/migrations/0003_social.sql's
  // weekly_leaderboard comment: "no cron dependency")—if this is the first
  // sync of a new ISO week, snapshot today's total_kp as the new baseline
  // so (total_kp - kp_at_week_start) means "earned this week" starting now,
  // not since whenever week_start last happened to be set.
  const thisMonday = mondayKey(new Date());
  const { data: current } = await supabase.from("profiles").select("week_start").eq("id", user.id).maybeSingle();
  const needsWeeklyReset = !current || current.week_start !== thisMonday;

  await supabase.from("profiles").update({
    total_kp: totalKP,
    current_streak: getStreak(),
    ...(needsWeeklyReset ? { week_start: thisMonday, kp_at_week_start: totalKP } : {})
  }).eq("id", user.id);
}

// Debounced so a burst of local KP claims (several in a row) doesn't fire a
// network request per claim—one sync a second or two after things settle.
function scheduleSync() {
  if (typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(syncProfileStatsNow, 1500);
}

// Call once (e.g. from the dashboard layout's mount effect) to keep a
// signed-in student's shared KP/streak current for as long as they're in
// the app—real push-on-change, not a one-time snapshot.
export function startLeaderboardSync(): () => void {
  scheduleSync(); // catches up anything earned while last signed out/offline
  window.addEventListener(PROGRESS_EVENT, scheduleSync);
  return () => window.removeEventListener(PROGRESS_EVENT, scheduleSync);
}

// The actual cross-device KP restore. Call once per app load, before
// startLeaderboardSync's own catch-up push, so a fresh device adopts real
// prior progress instead of racing to overwrite it with a fresh 0. Whoever
// has more wins in both directions:
//   cloud > local → this is a new/cleared device; adopt the cloud total.
//   local > cloud → real progress happened offline or before this feature
//                    existed; the next scheduled push catches the cloud up.
// Either way KP only ever moves forward, never backward or sideways.
export async function reconcileKPOnLoad(): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data, error } = await supabase.from("profiles").select("total_kp").eq("id", user.id).maybeSingle();
  if (error || !data) return; // e.g. the total_kp column/migration isn't live yet—fail silent, local KP still works
  if (data.total_kp > getTotalKP()) setTotalKPOverride(data.total_kp);
}

export type LeaderboardResult = { signedIn: boolean; rows: LeaderboardRow[] };

// Real top-N by KP, always including the signed-in student's own row even
// if they'd otherwise fall outside the top N (matching what a leaderboard
// widget needs: "here's the field, and here's exactly where you stand").
export async function fetchRealLeaderboard(limit = 5): Promise<LeaderboardResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, rows: [] };

  const { data: top } = await supabase.from("leaderboard").select("id, name, total_kp, current_streak").order("total_kp", { ascending: false }).limit(limit);
  let rows = top ?? [];
  if (!rows.some(r => r.id === user.id)) {
    const { data: mine } = await supabase.from("leaderboard").select("id, name, total_kp, current_streak").eq("id", user.id).maybeSingle();
    if (mine) rows = [...rows, mine].sort((a, b) => b.total_kp - a.total_kp);
  }
  return {
    signedIn: true,
    rows: rows.map(r => ({ id: r.id, name: r.name || "Student", totalKP: r.total_kp, streak: r.current_streak, isYou: r.id === user.id }))
  };
}

// Same shape and rules as fetchRealLeaderboard, sourced from
// supabase/migrations/0003_social.sql's weekly_leaderboard view instead
// (weekly_kp = total_kp - kp_at_week_start, reset lazily on sync above).
// Rows simply stop appearing here once their own next sync rolls week_start
// forward—no cleanup job needed.
export async function fetchWeeklyLeaderboard(limit = 5): Promise<LeaderboardResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, rows: [] };

  const { data: top } = await supabase.from("weekly_leaderboard").select("id, name, weekly_kp").order("weekly_kp", { ascending: false }).limit(limit);
  let rows = top ?? [];
  if (!rows.some(r => r.id === user.id)) {
    const { data: mine } = await supabase.from("weekly_leaderboard").select("id, name, weekly_kp").eq("id", user.id).maybeSingle();
    if (mine) rows = [...rows, mine].sort((a, b) => b.weekly_kp - a.weekly_kp);
  }
  return {
    signedIn: true,
    // Streak isn't part of the weekly view (it's not a weekly concept)—0
    // here just means "not shown", the UI only renders streak for the
    // all-time list.
    rows: rows.map(r => ({ id: r.id, name: r.name || "Student", totalKP: r.weekly_kp, streak: 0, isYou: r.id === user.id }))
  };
}

export type LeaderboardTier = "Diamond" | "Platinum" | "Gold" | "Silver" | "Bronze";

// Named brackets instead of a raw ordinal—so nobody ever sees "you're
// #34,835 of 50,000," which is true but useless. Boundaries are picked so
// each tier is a real, meaningful "top X%" claim.
const tierBounds: { min: number; tier: LeaderboardTier }[] = [
  { min: 99, tier: "Diamond" },
  { min: 95, tier: "Platinum" },
  { min: 85, tier: "Gold" },
  { min: 60, tier: "Silver" },
  { min: 0, tier: "Bronze" }
];

export function tierForPercentile(percentile: number): LeaderboardTier {
  return (tierBounds.find(b => percentile >= b.min) ?? tierBounds[tierBounds.length - 1]).tier;
}

export type LeaderboardStanding = { rank: number; totalStudents: number; percentile: number; tier: LeaderboardTier };

// The real "97th percentile, top 3%" number—computed entirely server-side
// (supabase/migrations/0007's get_my_leaderboard_standing RPC) so it's
// always a true rank among every real onboarded student, without ever
// pulling another student's row to the client to compute it. Null when
// signed out, or when there's no real standing yet (e.g. this student
// hasn't set a name), matching this file's existing fail-silent pattern
// for a migration that hasn't landed yet.
export async function getMyStanding(): Promise<LeaderboardStanding | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.rpc("get_my_leaderboard_standing").maybeSingle();
  if (error || !data) return null;
  // The Supabase client here isn't generated against a Database type (see
  // lib/supabase/client.ts), so a not-yet-generated RPC's row shape comes
  // back as {}—this cast just names the real columns the SQL function
  // (supabase/migrations/0007) actually returns.
  const row = data as { rank: number; total_students: number; percentile: number };
  const percentile = Number(row.percentile);
  return { rank: Number(row.rank), totalStudents: Number(row.total_students), percentile, tier: tierForPercentile(percentile) };
}
