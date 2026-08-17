import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Paths that require a real signed-in Supabase session. Everything else
// (marketing pages, /login, /signup, /pricing, ...) stays open. /admin is
// deliberately excluded—it already carries its own explicit "obscurity,
// not real security, there is no backend to enforce a boundary with"
// disclosure (app/admin/layout.tsx) and gating it here would misrepresent
// it as actually secured when the underlying data behind it still isn't.
const PROTECTED_PREFIXES = ["/dashboard"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// The reverse case: a visitor who's already signed in shouldn't land back
// on the login/signup forms just because they clicked "Log in" or "Sign up"
// from the marketing homepage (or still has an old tab open to one)—send
// them straight to their own dashboard instead. Deliberately just these
// two, not every auth-adjacent page: /forgot-password and /reset-password
// still need to work even for a signed-in visitor (e.g. changing their own
// password), so they're left alone.
const SIGNED_IN_REDIRECT_PATHS = ["/login", "/signup"];

function isSignedInRedirectPath(pathname: string): boolean {
  return SIGNED_IN_REDIRECT_PATHS.includes(pathname);
}

// Refreshes the Supabase auth session on every request that passes through
// middleware.ts, and—this is the actual access-control gate, not just token
// housekeeping—redirects a signed-out visitor away from a protected path
// before any dashboard page ever renders. Session refresh alone (the
// previous version of this function) does nothing to stop someone who was
// never signed in from opening /dashboard directly; this is the real fix
// for that: a server-side check that can't be skipped by disabling
// JavaScript or editing localStorage, since it runs before the page's own
// client-side code ever executes.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        }
      }
    }
  );

  // Also the real access check, not just a refresh trigger—getUser() (unlike
  // reading the session cookie directly) actually revalidates against
  // Supabase, so a forged or stale cookie doesn't pass as a real session.
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isSignedInRedirectPath(request.nextUrl.pathname)) {
    // Respects a real "next" destination if one's present (e.g. an old
    // /login?next=/dashboard/flashcards link opened after already signing
    // in elsewhere) rather than always dropping them on the bare dashboard.
    const next = request.nextUrl.searchParams.get("next");
    return NextResponse.redirect(new URL(next || "/dashboard", request.url));
  }

  return supabaseResponse;
}
