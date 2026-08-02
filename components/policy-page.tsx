import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { LanguageBar, Logo } from "./navigation";

export function PolicyPage({ title }: { title: string }) {
  return <main className="min-h-screen bg-[#fcfdfd]">
    <LanguageBar />
    <header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div>
    </header>
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-teal-600"><FileText size={26} /></span>
      <h1 className="display mt-6 text-4xl sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-slate-500">We're still finalizing this page. Check back soon, or reach out at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a> if you have questions in the meantime.</p>
      <Link href="/" className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-accent-600">Back to home</Link>
    </section>
  </main>;
}
