"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Bot, BookOpen, Flag, Gauge, GitBranch, Layers, LayoutGrid, ListChecks, Map, Shield,
  ShieldQuestion, Sparkles, Stethoscope, Trophy, User, Wrench
} from "lucide-react";
import { ADMIN_ROLE_EVENT, adminRoleDefs, AdminRole, getPreviewRole, isHrefAllowed } from "@/lib/adminRoles";

type NavItem = { label: string; href: string; icon: typeof Shield };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { label: "", items: [{ label: "Overview", href: "/admin", icon: Gauge }] },
  {
    label: "Content",
    items: [
      { label: "Vocabulary", href: "/admin/vocabulary", icon: Layers },
      { label: "Clinical Cases", href: "/admin/cases", icon: Stethoscope },
      { label: "Anatomy Library", href: "/admin/anatomy", icon: LayoutGrid },
      { label: "Reference Database", href: "/admin/references", icon: BookOpen }
    ]
  },
  {
    label: "Learning",
    items: [
      { label: "Learning Paths", href: "/admin/paths", icon: Map },
      { label: "Lesson Builder", href: "/admin/lessons", icon: GitBranch },
      { label: "Question Bank", href: "/admin/questions", icon: ListChecks }
    ]
  },
  {
    label: "Engagement",
    items: [
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Gamification", href: "/admin/gamification", icon: Trophy },
      { label: "Reports & Feedback", href: "/admin/reports", icon: Flag }
    ]
  },
  {
    label: "Platform",
    items: [
      { label: "AI Management", href: "/admin/ai", icon: Bot },
      { label: "Analytics", href: "/admin/analytics", icon: Sparkles },
      { label: "Feature Management", href: "/admin/flags", icon: Wrench },
      { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldQuestion },
      { label: "Account", href: "/admin/account", icon: User }
    ]
  }
];

// Internal ops view—not a real backend admin panel (Studium has none), just
// an honest inspector + override layer over the same data every student
// page reads. No page in this app links here; reachable at /admin or via
// Ctrl+Shift+A from anywhere in the dashboard (see app/dashboard/layout.tsx).
// That's obscurity, not real security—there's no auth server to enforce a
// boundary with, so the UI doesn't pretend there is one. Sections below are
// real wherever the data can genuinely be real (localStorage-backed CRUD
// that live student pages actually read); anything that would need a real
// backend, multi-user auth, or a live AI service to be genuine says so
// plainly instead of faking it.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [previewRole, setPreviewRoleState] = useState<AdminRole>("super-admin");

  useEffect(() => {
    function refresh() { setPreviewRoleState(getPreviewRole()); }
    refresh();
    window.addEventListener(ADMIN_ROLE_EVENT, refresh);
    return () => window.removeEventListener(ADMIN_ROLE_EVENT, refresh);
  }, []);

  const visibleGroups = navGroups
    .map(group => ({ ...group, items: group.items.filter(item => isHrefAllowed(previewRole, item.href)) }))
    .filter(group => group.items.length > 0);
  const roleLabel = adminRoleDefs.find(r => r.id === previewRole)?.label;

  return <div className="min-h-screen bg-[#0B0F14] font-sans text-slate-200">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F14]/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500/15 text-teal-400"><Shield size={16} /></span>
          <div>
            <p className="text-sm font-bold text-white">Studium Internal Ops</p>
            <p className="text-[11px] text-slate-500">Not linked from student UI · localStorage-backed, no real backend</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {previewRole !== "super-admin" && <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-[11px] font-bold text-violet-300">Previewing as {roleLabel}</span>}
          <a href="/dashboard" className="cursor-pointer rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-400 transition hover:border-white/20 hover:text-white">← Back to app</a>
        </div>
      </div>
    </header>

    <div className="mx-auto flex max-w-[1400px] items-start gap-6 px-6 py-6">
      <aside className="hidden w-56 shrink-0 lg:block">
        <nav className="sticky top-20 space-y-5">
          {visibleGroups.map(group => <div key={group.label || "root"}>
            {group.label && <p className="mb-1.5 px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">{group.label}</p>}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href;
                return <Link
                  key={item.href}
                  href={item.href}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold transition ${active ? "bg-teal-500/10 text-teal-300" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                ><item.icon size={15} className={active ? "text-teal-400" : "text-slate-500"} />{item.label}</Link>;
              })}
            </div>
          </div>)}
        </nav>
      </aside>

      {/* Mobile section switcher (below lg breakpoint, no persistent sidebar) */}
      <nav className="mb-2 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
        {visibleGroups.flatMap(g => g.items).map(item => {
          const active = pathname === item.href;
          return <Link key={item.href} href={item.href} className={`shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold ${active ? "bg-teal-500/15 text-teal-300" : "bg-white/5 text-slate-400"}`}>{item.label}</Link>;
        })}
      </nav>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  </div>;
}
