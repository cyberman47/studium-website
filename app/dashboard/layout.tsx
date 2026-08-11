"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/navigation";
import { LearningPathSwitcher, NotificationsBell, StudyStreak, UserMenu } from "@/components/dashboard-shell";
import { CommandSearch } from "@/components/command-search";
import { getUser } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    setName(user?.name?.split(" ")[0] || "there");
    setAvatar(user?.avatar ?? null);
  }, []);

  // Easter-egg style route to the internal ops view (see app/admin/page.tsx).
  // This is not real access control—there's no auth server behind it, just
  // an unlisted page—so it's a convenience shortcut, not a security boundary.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/admin");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  async function logOut() {
    await createClient().auth.signOut();
    localStorage.removeItem("studium_user");
    localStorage.removeItem("studium_onboarding_answers");
    localStorage.removeItem("studium_onboarding_complete");
    router.push("/");
  }

  return <div className="min-h-screen bg-[#fcfdfd]">
    <header className="border-b border-slate-200 bg-slate-50 py-4">
      <div className="dashboard-shell flex items-center justify-between gap-4"><Logo href="/dashboard" /><div className="flex flex-1 justify-center"><CommandSearch /></div><div className="flex items-center gap-3"><LearningPathSwitcher /><StudyStreak /><NotificationsBell /><UserMenu name={name} avatar={avatar} onLogOut={logOut} /></div></div>
    </header>
    {children}
  </div>;
}
