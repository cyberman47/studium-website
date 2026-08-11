"use client";

// The one Supabase client for anything running in the browser (Client
// Components, event handlers). Talks to the real project provisioned via
// the Vercel↔Supabase integration—NEXT_PUBLIC_* vars are safe to ship to
// the browser by design (the anon key is meant to be public; every table it
// can touch is protected by real Row Level Security policies instead).
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
