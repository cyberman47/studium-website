import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LanguageBar, Logo } from "./navigation";

export function LegalDocument({ title, lastUpdated, eyebrow = "Legal", children }: { title: string; lastUpdated: string; eyebrow?: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#fcfdfd]">
    <LanguageBar />
    <header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div>
    </header>
    <section className="relative py-16 sm:py-20">
      <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm font-bold text-slate-500">Last updated: {lastUpdated}</p>
          <div className="mt-10 space-y-8">{children}</div>
        </div>
      </div>
    </section>
  </main>;
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return <div>
    <h2 className="text-xl font-extrabold tracking-tight text-ink">{heading}</h2>
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
  </div>;
}

export const legalList = "list-disc space-y-1.5 pl-5";
