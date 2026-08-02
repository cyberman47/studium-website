"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, LogOut, RotateCcw, Sparkles, User } from "lucide-react";
import { getUser } from "@/lib/onboarding";

export default function AccountPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = getUser();
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, []);

  function resetOnboarding() {
    localStorage.removeItem("studium_onboarding_answers");
    localStorage.removeItem("studium_onboarding_complete");
    router.push("/onboarding");
  }

  function logOut() {
    localStorage.removeItem("studium_user");
    localStorage.removeItem("studium_onboarding_answers");
    localStorage.removeItem("studium_onboarding_complete");
    router.push("/");
  }

  const initial = (name || "?").trim().charAt(0).toUpperCase();

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Account.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Your sign-in details and account actions.</p>

    <div className="mt-10 max-w-2xl space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal-100 text-xl font-extrabold text-teal-700">{initial}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-ink">{name || "Your name"}</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>
        </div>
        <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[#f9fcfc] p-3.5 text-xs leading-relaxed text-slate-500"><User size={14} className="mt-0.5 shrink-0 text-teal-500" />To change your name or email, head to <a href="/dashboard/settings/profile" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Profile</a>.</p>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-lg font-extrabold tracking-tight">Account actions</h2>
        <div className="mt-4 space-y-3">
          <button type="button" onClick={resetOnboarding} className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-teal-200 hover:bg-[#f9fcfc]">
            <span><span className="block text-sm font-bold text-ink">Retake onboarding</span><span className="block text-xs text-slate-500">Redo the welcome questions to update your study profile.</span></span>
            <RotateCcw size={16} className="shrink-0 text-slate-400" />
          </button>
          <button type="button" onClick={logOut} className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-rose-200 hover:bg-rose-50">
            <span className="text-sm font-bold text-rose-600">Log out</span>
            <LogOut size={16} className="shrink-0 text-rose-400" />
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-rose-100 bg-rose-50/40 p-6">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-rose-700"><AlertTriangle size={16} />Danger zone</h2>
        <p className="mt-2 text-xs leading-relaxed text-rose-600/80">Account deletion isn't available in this demo yet—there's no real backend behind it. Reach out at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold underline">hello@studium.app</a> if you need help.</p>
      </div>
    </div>
  </section>;
}
