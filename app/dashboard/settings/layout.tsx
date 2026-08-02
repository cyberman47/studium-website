"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Bell, BookOpen, Contact, CreditCard, Gift, Globe, RotateCcw, SlidersHorizontal, User, Zap } from "lucide-react";

const settingsNav = [
  { label: "Account", href: "/dashboard/settings/account", icon: User },
  { label: "Profile", href: "/dashboard/settings/profile", icon: Contact },
  { label: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
  { label: "Points", href: "/dashboard/settings/points", icon: Zap },
  { label: "Invite Friends", href: "/dashboard/settings/invite", icon: Gift }
];

const appSettingsNav = [
  { label: "General", href: "/dashboard/settings/general", icon: SlidersHorizontal },
  { label: "Reader", href: "/dashboard/settings/reader", icon: BookOpen },
  { label: "Review", href: "/dashboard/settings/review", icon: RotateCcw },
  { label: "Languages", href: "/dashboard/settings/languages", icon: Globe }
];

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: typeof User; label: string; active: boolean }) {
  return <Link href={href} className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-white hover:text-ink"}`}>
    <Icon size={17} className={active ? "text-teal-600" : "text-slate-400"} />{label}
  </Link>;
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <div className="dashboard-shell flex items-start gap-8">
    <aside className="hidden w-56 shrink-0 py-6 sm:block">
      <Link href="/dashboard" className="mb-4 flex cursor-pointer items-center gap-2 px-3 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back to dashboard</Link>
      <nav className="sticky top-24 space-y-1 rounded-3xl border border-slate-200 bg-slate-50 p-3">
        <p className="px-3 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Settings</p>
        {settingsNav.map(item => <NavLink key={item.href} {...item} active={pathname === item.href} />)}
        <p className="px-3 pb-1 pt-4 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">App settings</p>
        <div className="space-y-1 border-l-2 border-slate-200 pl-2">
          {appSettingsNav.map(item => <NavLink key={item.href} {...item} active={pathname === item.href} />)}
        </div>
        <div className="pt-4"><NavLink href="/dashboard/settings/billing" icon={CreditCard} label="Billing" active={pathname === "/dashboard/settings/billing"} /></div>
      </nav>
    </aside>
    <div className="min-w-0 flex-1">{children}</div>
  </div>;
}
