// Real per-caller rate limiting for the Anthropic-backed API routes
// (app/api/tutor, app/api/study-plan, app/api/generate). Backed by a
// Postgres function in Supabase (supabase/migrations/0006_ai_rate_limits.sql)
// that atomically increments a fixed-window counter, so it's genuinely
// race-safe under concurrent requests, not a best-effort in-memory count
// that resets every serverless cold start.
//
// The Anthropic API key itself stays exactly where it already was
// (process.env.ANTHROPIC_API_KEY, read server-side only in each route) --
// this module only decides whether a given request is allowed to spend it.
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  // "unknown" means the limiter itself failed (e.g. Supabase unreachable)
  // and the request was let through rather than blocked -- a rate limiter
  // that takes the whole AI Tutor down when the DB hiccups is a worse
  // failure mode than briefly not limiting anyone.
  source: "checked" | "unknown";
};

function getClientIp(req: NextRequest): string {
  // Vercel (and most reverse proxies) set this; the first entry is the
  // original client, later ones are intermediate hops.
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function checkAiRateLimit(
  req: NextRequest,
  opts: { windowMinutes: number; maxRequests: number }
): Promise<RateLimitResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const identifier = user ? `user:${user.id}` : `ip:${getClientIp(req)}`;

    const { data, error } = await supabase.rpc("check_and_increment_rate_limit", {
      p_identifier: identifier,
      p_window_minutes: opts.windowMinutes,
      p_max_requests: opts.maxRequests
    });

    if (error || !data || !data[0]) {
      console.error("[aiRateLimit] check failed, allowing request through:", error);
      return { allowed: true, retryAfterSeconds: 0, source: "unknown" };
    }

    return { allowed: data[0].allowed, retryAfterSeconds: data[0].retry_after_seconds ?? 0, source: "checked" };
  } catch (err) {
    console.error("[aiRateLimit] check threw, allowing request through:", err);
    return { allowed: true, retryAfterSeconds: 0, source: "unknown" };
  }
}

export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({ error: "You're sending requests a bit too fast. Please wait a moment and try again." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(1, result.retryAfterSeconds))
      }
    }
  );
}
