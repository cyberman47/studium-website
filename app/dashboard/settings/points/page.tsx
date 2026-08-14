"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { StreakSummary } from "@/components/dashboard-shell";
import { getStreak, getTotalKP, getWeekLog, WeekDay } from "@/lib/progress";

export default function PointsPage() {
  const [streak, setStreak] = useState(0);
  const [totalKP, setTotalKP] = useState(0);
  const [week, setWeek] = useState<WeekDay[]>([]);

  useEffect(() => {
    setStreak(getStreak());
    setTotalKP(getTotalKP());
    setWeek(getWeekLog());
  }, []);

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Knowledge Points.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Earn 10 KP for every day you show up. Consistency is what actually moves the needle.</p>

    <div className="mt-10 max-w-md">
      <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft">
        <StreakSummary streak={streak} totalKP={totalKP} week={week} />
      </div>
    </div>
  </section>;
}
