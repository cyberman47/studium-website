"use client";

// The real, cross-device referral system (supabase/migrations/0005_referrals.sql
// —NOT applied yet; see the standing note in this repo about Supabase
// migrations needing to be run from the Supabase Dashboard SQL editor).
// Every call here degrades honestly (signed-out → not signed in; migration
// not live yet → empty/zero state) rather than faking success, matching
// the same pattern lib/leaderboardSync.ts and lib/community.ts already use
// for real Supabase reads that might hit a table/RPC that isn't live yet.
import { createClient } from "./supabase/client";

const PENDING_REF_KEY = "studium_pending_ref_code";
export const REFERRALS_PER_MONTH = 5;

// ---- Capturing a referral code at signup, before the visitor even has an account ----

// Called once from app/ref/[code]/page.tsx the moment someone opens a
// referral link—stashed locally so it survives the redirect into /signup
// (and a possible OAuth round-trip) without ever asking the new student to
// type a code in themselves.
export function capturePendingReferralCode(code: string) {
  if (typeof window === "undefined" || !code) return;
  localStorage.setItem(PENDING_REF_KEY, code.toUpperCase());
}

export function getPendingReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PENDING_REF_KEY);
}

// Cleared once the code has actually been sent along with a real signUp
// call, so a later signup (e.g. a different account, or after declining)
// doesn't silently reuse a stale code.
export function clearPendingReferralCode() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_REF_KEY);
}

export function getReferralLink(code: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/ref/${code}`;
}

// ---- The signed-in student's own referral code + progress ----

export async function getMyReferralCode(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.rpc("ensure_referral_code", { uid: user.id });
  if (error) return null; // RPC not live yet (migration not applied)—honest null, not a fabricated code
  return data as string;
}

export type ReferralEntry = { id: string; eligible: boolean; joinedAt: string };
export type ReferralProgress = {
  signedIn: boolean;
  entries: ReferralEntry[];
  eligibleCount: number;
  monthsEarned: number;
  proUntil: string | null;
};

const emptyProgress: ReferralProgress = { signedIn: false, entries: [], eligibleCount: 0, monthsEarned: 0, proUntil: null };

export async function getReferralProgress(): Promise<ReferralProgress> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return emptyProgress;

  const { data: rows, error } = await supabase
    .from("my_referrals")
    .select("id, eligible, joined_at")
    .eq("referrer_id", user.id)
    .order("joined_at", { ascending: true });
  const { data: profileRow } = await supabase.from("profiles").select("pro_until").eq("id", user.id).maybeSingle();

  if (error || !rows) return { ...emptyProgress, signedIn: true }; // view/columns not live yet—signed in, honestly zero progress

  const entries: ReferralEntry[] = rows.map(r => ({ id: r.id, eligible: r.eligible, joinedAt: r.joined_at }));
  const eligibleCount = entries.filter(e => e.eligible).length;
  return {
    signedIn: true,
    entries,
    eligibleCount,
    monthsEarned: Math.floor(eligibleCount / REFERRALS_PER_MONTH),
    proUntil: profileRow?.pro_until ?? null
  };
}

// Grants any newly-earned free months (server-side, idempotent—see the SQL
// function's own comment). Safe to call opportunistically whenever the
// referral page loads; a call with nothing new to grant is a no-op.
export async function claimReferralReward(): Promise<{ proUntil: string | null; monthsClaimed: number } | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.rpc("claim_referral_reward", { uid: user.id });
  if (error || !data || !data[0]) return null;
  return { proUntil: data[0].pro_until, monthsClaimed: data[0].months_claimed };
}

export function isReferralProActive(proUntil: string | null): boolean {
  return !!proUntil && new Date(proUntil).getTime() > Date.now();
}
