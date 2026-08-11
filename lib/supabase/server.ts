import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// The Supabase client for Server Components and Route Handlers—reads the
// session from the request's cookies (set by middleware.ts on every
// request) rather than holding its own session state. Server Components
// can't write cookies, so the setAll here is wrapped in a try/catch: it
// silently no-ops there and relies on middleware to have already refreshed
// the session before this ever runs, which is the standard Supabase SSR
// pattern for the Next.js App Router.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component—no-op; middleware.ts already
            // refreshes the session on every request.
          }
        }
      }
    }
  );
}
