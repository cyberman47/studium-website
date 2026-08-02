import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Briefcase, MapPin, Sparkles } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";

const jobs = [
  {
    title: "Director of Online Marketing",
    type: "Full-time",
    location: "Remote",
    description: "Own Studium's growth story end to end—shape how medical students discover us, lead our brand and performance marketing, and build the team that gets us there. You'll set strategy across content, paid, and lifecycle channels while working closely with product to keep our voice authentic to the students we serve."
  }
] as const;

export default function CareersPage() {
  return <main className="min-h-screen overflow-hidden bg-[#fcfdfd]"><LanguageBar /><header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl"><div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div></header><section className="relative py-24 sm:py-32"><div className="absolute inset-x-0 top-0 -z-10 h-[470px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" /><div className="container-page"><div className="mx-auto max-w-3xl text-center"><span className="eyebrow"><Sparkles size={13} />Join our team</span><h1 className="display mt-6 text-5xl leading-[.98] sm:text-7xl">Help us build the future of <span className="text-teal-500">medical education</span>.</h1><p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">We're a small team on a mission to make studying medicine feel calmer and smarter. Here's where we're hiring right now.</p></div><div className="mx-auto mt-14 max-w-3xl space-y-4">{jobs.map(job => <article key={job.title} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-soft sm:p-8"><div className="flex flex-wrap items-center gap-2 text-xs font-bold text-teal-600"><span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1"><Briefcase size={13} />{job.type}</span><span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1"><MapPin size={13} />{job.location}</span></div><h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">{job.title}</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">{job.description}</p><Link href="/careers/apply" className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-accent-600">Apply now <ArrowUpRight size={16} /></Link></article>)}</div><p className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-500">Don't see the right role? Reach out anyway at <a href="mailto:careers@studium.app" className="font-bold text-teal-600 hover:text-teal-700">careers@studium.app</a>.</p></div></section></main>;
}
