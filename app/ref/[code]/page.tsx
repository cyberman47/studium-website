"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { capturePendingReferralCode } from "@/lib/referrals";

// studium.app/ref/EDDY123 — the friendly, shareable referral link. Stashes
// the code (no account or session needed yet) and bounces straight into
// signup, which reads it back and shows the "you've been invited" state.
// The new student never sees or types a code.
export default function ReferralLandingPage({ params }: { params: { code: string } }) {
  const router = useRouter();

  useEffect(() => {
    capturePendingReferralCode(params.code);
    router.replace("/signup");
  }, [params.code, router]);

  return <main className="grid min-h-screen place-items-center bg-[#fcfdfd]">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />
  </main>;
}
