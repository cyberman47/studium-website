"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/navigation";
import { UserMenu } from "@/components/dashboard-shell";
import { getUser } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/client";

// A deliberately bare shell for the Forum—no sidebar, no search bar, no
// streak/notifications, just the logo (back to the real dashboard) and
// account access at top right. A real standalone page (own route outside
// /dashboard, own layout tree), not a tab reusing the dashboard chrome, so
// navigating here is a genuine page transition rather than an instant
// client-side swap.
export default function ForumLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    setName(user?.name?.split(" ")[0] || "there");
    setAvatar(user?.avatar ?? null);
  }, []);

  async function logOut() {
    await createClient().auth.signOut();
    localStorage.removeItem("studium_user");
    localStorage.removeItem("studium_onboarding_answers");
    localStorage.removeItem("studium_onboarding_complete");
    router.push("/");
  }

  return <div className="min-h-screen bg-[#fcfdfd]">
    <header className="border-b border-slate-200 bg-slate-50 py-4">
      <div className="container-page flex items-center justify-between">
        <Logo href="/dashboard" />
        <UserMenu name={name} avatar={avatar} onLogOut={logOut} />
      </div>
    </header>
    <div className="container-page">{children}</div>
  </div>;
}
