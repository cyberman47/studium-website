"use client";

// Study Groups: real, discoverable groups (lib/studyGroups.ts, backed by
// supabase/migrations/0011_study_groups.sql)—every member count below is a
// live count of real rows, never a hand-set number.
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";
import { categoryLabels } from "@/lib/community";
import { fetchGroups, joinGroup, leaveGroup, StudyGroup } from "@/lib/studyGroups";
import { createClient } from "@/lib/supabase/client";

const cardClass = "rounded-3xl border border-black/[0.06] dark:border-white/10 bg-white dark:bg-[#0d1917] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]";

type Mode = "loading" | "signedOut" | "ready";

export default function StudyGroupsPage() {
  const [mode, setMode] = useState<Mode>("loading");
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setGroups(await fetchGroups());
    setMode(user ? "ready" : "signedOut");
  }

  useEffect(() => { refresh(); }, []);

  async function toggleMembership(group: StudyGroup) {
    setBusyId(group.id);
    if (group.isMember) await leaveGroup(group.id); else await joinGroup(group.id);
    await refresh();
    setBusyId(null);
  }

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[280px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><UsersRound size={13} />Study Groups</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Find your people.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Join a group built around your subject, exam, or program—real members, real discussions.</p>

    {mode === "signedOut" && <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/10 px-4 py-3 text-xs font-bold text-amber-800 dark:text-amber-300">Sign in to join a group and post in its discussions.</div>}

    {mode === "loading" ? <div className={`${cardClass} mt-8 max-w-2xl p-8 text-center text-sm text-slate-400`}>Loading groups…</div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.length === 0 && <p className="text-sm text-slate-400">No groups yet.</p>}
      {groups.map(group => <div key={group.id} className={`${cardClass} flex flex-col p-6`}>
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"><UsersRound size={20} /></span>
          {group.category && <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[10px] font-extrabold text-slate-500 dark:text-slate-300">{categoryLabels[group.category]}</span>}
        </div>
        <Link href={`/dashboard/community/study-groups/${group.slug}`} className="mt-3 cursor-pointer text-base font-extrabold text-heading hover:text-teal-700 dark:text-white">{group.name}</Link>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">{group.description}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-slate-400">{group.memberCount} member{group.memberCount === 1 ? "" : "s"}</p>
          <div className="flex items-center gap-2">
            {mode === "ready" && <button
              type="button"
              disabled={busyId === group.id}
              onClick={() => toggleMembership(group)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition disabled:opacity-50 ${group.isMember ? "border border-slate-200 dark:border-white/10 text-slate-500 hover:border-rose-200 hover:text-rose-600" : "bg-accent-500 text-white hover:-translate-y-0.5 hover:bg-accent-600"}`}
            >{busyId === group.id ? "…" : group.isMember ? "Joined" : "Join"}</button>}
            <Link href={`/dashboard/community/study-groups/${group.slug}`} className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-slate-300 transition hover:bg-slate-50 hover:text-teal-600 dark:hover:bg-white/5"><ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>)}
    </div>}
  </section>;
}
