"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Home, Layers, Library } from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Library", href: "/dashboard/library", icon: Library },
  { label: "AI Tutor", href: "/dashboard/ai-tutor", icon: Bot },
  { label: "Flashcards", href: "/dashboard/flashcards", icon: Layers }
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <div className="dashboard-shell flex items-start gap-8">
    <aside className="hidden w-56 shrink-0 py-6 sm:block">
      <nav className="sticky top-24 space-y-1 rounded-3xl border border-slate-200 bg-slate-50 p-3">
        {navItems.map(item => {
          const active = pathname === item.href;
          return <Link key={item.href} href={item.href} className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-white hover:text-ink"}`}>
            <item.icon size={18} className={active ? "text-teal-600" : "text-slate-400"} />{item.label}
          </Link>;
        })}
      </nav>
    </aside>
    <div className="min-w-0 flex-1">{children}</div>
  </div>;
}
