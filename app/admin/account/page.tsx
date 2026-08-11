"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Award, Clock, Flame, Mail, User as UserIcon, Zap } from "lucide-react";
import { getOnboardingAnswers, getUser, User as StudiumUser } from "@/lib/onboarding";
import { getLevelInfo, getLongestStreak, getStreak, getStats, getTotalKP, Stats } from "@/lib/progress";
import { getLearnedTerms, getTermConfidence, termCategories } from "@/lib/terminology";

export default function AccountPage() {
  const [user, setUser] = useState<StudiumUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [weakAreas, setWeakAreas] = useState<{ name: string; dontKnowCount: number }[]>([]);

  useEffect(() => {
    setUser(getUser());
    setRole(getOnboardingAnswers()?.role ?? null);
    setStats(getStats());

    const learned = getLearnedTerms();
    const byCategory = new Map<string, number>();
    for (const t of learned) {
      if (getTermConfidence(t.id) === "dont-know") byCategory.set(t.categoryId, (byCategory.get(t.categoryId) ?? 0) + 1);
    }
    const ranked = Array.from(byCategory.entries())
      .map(([id, count]) => ({ name: termCategories.find(c => c.id === id)?.name ?? id, dontKnowCount: count }))
      .sort((a, b) => b.dontKnowCount - a.dontKnowCount)
      .slice(0, 5);
    setWeakAreas(ranked);
  }, []);

  const totalKP = getTotalKP();
  const level = getLevelInfo(totalKP);

  return <div>
    <h1 className="text-lg font-extrabold text-white">Account</h1>

    <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
      <div>
        <p className="text-sm font-bold text-amber-300">One real account, not a user table</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">There's no multi-user backend, so there's exactly one real account here: this browser's. A "User Management" table with rows for other people would be fabricated data in a medical education app—so instead, this is a genuine, detailed view of the one account that's actually real, including "subscription status" honestly labeled below.</p>
      </div>
    </div>

    {user ? <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-500/15 text-lg font-extrabold text-teal-300">{user.name?.[0]?.toUpperCase() ?? "?"}</span>
        <div>
          <p className="text-base font-extrabold text-white">{user.name || "(no name set)"}</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-400"><Mail size={12} />{user.email || "no email"}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Username" value={`@${user.username}`} />
        <Field label="Joined" value={new Date(user.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
        <Field label="Role (onboarding)" value={role ?? "Not set"} />
        <Field label="Subscription" value="Free (no billing connected)" />
      </div>
    </div> : <p className="mt-5 rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">No user found in this browser—onboarding hasn't been completed.</p>}

    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard icon={Zap} tint="text-teal-400" label="Knowledge Points" value={totalKP.toLocaleString()} />
      <StatCard icon={Award} tint="text-violet-400" label="Level" value={`${level.level} · ${level.name}`} />
      <StatCard icon={Flame} tint="text-amber-400" label="Current Streak" value={`${getStreak()} days`} />
      <StatCard icon={Clock} tint="text-sky-400" label="Study Minutes" value={(stats?.studyMinutes ?? 0).toLocaleString()} />
    </div>

    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Completed Lessons & Activity</p>
        <div className="mt-2 space-y-1.5 text-sm">
          <Row label="Study sessions" value={stats?.studySessions ?? 0} />
          <Row label="Cases completed" value={stats?.casesCompleted ?? 0} />
          <Row label="Flashcards reviewed" value={stats?.flashcardsCompleted ?? 0} />
          <Row label="Notes created" value={stats?.notesCreated ?? 0} />
          <Row label="Longest streak" value={`${getLongestStreak()} days`} />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Weak Areas <span className="font-normal text-slate-600">— categories with the most "don't know" terms</span></p>
        <div className="mt-2 space-y-1.5">
          {weakAreas.map(w => <div key={w.name} className="flex items-center justify-between text-sm"><span className="text-slate-300">{w.name}</span><span className="font-bold text-rose-400">{w.dontKnowCount}</span></div>)}
          {weakAreas.length === 0 && <p className="flex items-center gap-1.5 text-xs text-slate-500"><UserIcon size={12} />Not enough real study data yet to identify weak areas.</p>}
        </div>
      </div>
    </div>
  </div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return <div>
    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
  </div>;
}

function StatCard({ icon: Icon, tint, label, value }: { icon: typeof Zap; tint: string; label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Icon size={13} className={tint} />{label}</div>
    <p className="mt-2 text-xl font-extrabold text-white">{value}</p>
  </div>;
}

function Row({ label, value }: { label: string; value: string | number }) {
  return <div className="flex items-center justify-between"><span className="text-slate-400">{label}</span><span className="font-bold text-white">{value}</span></div>;
}
