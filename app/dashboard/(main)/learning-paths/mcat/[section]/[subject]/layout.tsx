"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, BookOpen, ListChecks, Sparkles } from "lucide-react";
import { findSubject } from "@/lib/mcatPath";

// Shared shell for every page under a subject (Lessons + Practice)—header,
// single back link, and the two-tab switcher live here exactly once, so
// "Biology" always shows one back button and Practice is a real tab with
// its own URL (/bio-biochem/biology/practice) rather than a second,
// differently-laid-out page you navigate away to.
const tabs = [
  { label: "Lessons", suffix: "", icon: BookOpen },
  { label: "Practice", suffix: "/practice", icon: ListChecks }
];

export default function MCATSubjectLayout({
  children, params
}: { children: React.ReactNode; params: { section: string; subject: string } }) {
  const subject = findSubject(params.section, params.subject);
  const pathname = usePathname();
  const base = `/dashboard/learning-paths/mcat/${params.section}/${params.subject}`;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <Link href={`/dashboard/learning-paths/mcat/${params.section}`} className="mb-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-teal-600"><ArrowLeft size={14} />Back</Link>
    <span className="eyebrow"><Sparkles size={13} />MCAT</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{subject?.name ?? "Subject"}.</h1>

    <nav className="mt-6 flex flex-wrap gap-2">
      {tabs.map(tab => {
        const href = `${base}${tab.suffix}`;
        const active = pathname === href;
        return <Link
          key={tab.suffix}
          href={href}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-extrabold transition ${active ? "border-teal-500 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5"}`}
        >
          <tab.icon size={13} />{tab.label}
        </Link>;
      })}
    </nav>

    <div className="mt-8">{children}</div>
  </section>;
}
