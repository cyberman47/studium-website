"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/navigation";
import { KnowledgePoints, UserMenu } from "@/components/dashboard-shell";
import { getUser } from "@/lib/onboarding";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const user = getUser();
    setName(user?.name?.split(" ")[0] || "there");
  }, []);

  function logOut() {
    localStorage.removeItem("studium_user");
    localStorage.removeItem("studium_onboarding_answers");
    localStorage.removeItem("studium_onboarding_complete");
    router.push("/");
  }

  return <div className="min-h-screen bg-[#fcfdfd]">
    <header className="border-b border-slate-200 bg-slate-50 py-4">
      <div className="dashboard-shell flex items-center justify-between"><Logo /><div className="flex items-center gap-3"><KnowledgePoints /><UserMenu name={name} onLogOut={logOut} /></div></div>
    </header>
    {children}
  </div>;
}
