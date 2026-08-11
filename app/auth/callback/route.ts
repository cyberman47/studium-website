import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Where Supabase redirects back to after a Google/Apple OAuth sign-in (and
// after clicking an email confirmation link)—exchanges the one-time `code`
// in the URL for a real session, then sends the student on to onboarding
// (same destination email/password signup already used) or wherever they
// were headed via `next`.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
