"use client";

// Studium Community's own sub-nav (Feed / Discussions / Ask the
// Community)—same pattern as the Settings section's layout.tsx, kept
// separate from the main sidebar which just links here once.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTree, MessagesSquare, Plus } from "lucide-react";

const tabs = [
  { label: "Feed", href: "/dashboard/community", icon: MessagesSquare },
  { label: "Discussions", href: "/dashboard/community/discussions", icon: ListTree }
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/community") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[260px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-1.5 shadow-soft">
        {tabs.map(tab => {
          const active = isActive(pathname, tab.href);
          return <Link key={tab.href} href={tab.href} className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${active ? "bg-ink text-white" : "text-slate-500 hover:bg-slate-50 dark:bg-white/5 hover:text-heading"}`}>
            <tab.icon size={15} />{tab.label}
          </Link>;
        })}
      </div>
      <Link href="/dashboard/community/ask" className="flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">
        <Plus size={16} />Ask the Community
      </Link>
    </div>

    <div className="mt-8">{children}</div>
  </section>;
}
