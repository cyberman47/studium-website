"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/navigation";
import { LearningPathSwitcher, MobileNav, NotificationsBell, StudyStreak, UserMenu } from "@/components/dashboard-shell";
import { CommandSearch } from "@/components/command-search";
import { KnowledgeToastHost } from "@/components/knowledge-toast";
import { EmailVerifyPrompt } from "@/components/email-verify-prompt";
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

  // The product tour is no longer a single global cross-page walkthrough
  // mounted here—each section now owns a small self-contained
  // components/product-tour/SectionTour instance on its own page (see
  // app/dashboard/(main)/page.tsx, .../learning-paths/page.tsx, etc.), so
  // nothing needs to be mounted at this shared layout level at all.
  return <div className="min-h-screen bg-[#fcfdfd] dark:bg-[#070d0c]">
    <header className="border-b border-slate-200 bg-slate-50 py-4 dark:border-transparent dark:bg-transparent">
      <div className="dashboard-shell flex items-center justify-between gap-2 sm:gap-4"><div className="flex items-center gap-1 sm:gap-3"><MobileNav /><Logo href="/dashboard" /></div><div className="flex flex-1 justify-center"><CommandSearch /></div><div className="flex items-center gap-2 sm:gap-3"><div className="hidden sm:block"><LearningPathSwitcher /></div><StudyStreak /><NotificationsBell /><UserMenu name={name} avatar={avatar} onLogOut={logOut} /></div></div>
    </header>
    {children}
    <KnowledgeToastHost />
    <EmailVerifyPrompt />
  </div>;
}
