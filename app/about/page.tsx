import Link from "next/link";
import { ArrowLeft, BrainCircuit, Compass, HeartHandshake, Lightbulb, Quote, Sparkles } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";
import { PrimaryButton, Reveal } from "@/components/ui";

const values = [
  [BrainCircuit, "Learning should feel intelligent", "We combine thoughtfully designed tools with evidence-informed study methods, so every session moves understanding forward."],
  [HeartHandshake, "Students come first", "We build with care for the pressure, ambition, and curiosity that shape a life in medicine."],
  [Lightbulb, "Progress belongs to everyone", "Great learning support should feel clear, motivating, and within reach—not complicated or exclusive."],
  [Compass, "Built from the inside", "We're students and clinicians ourselves. Every feature starts from a real study session, not a boardroom guess."]
] as const;

const milestones = [
  ["Jan 2026", "The first sketch", "Eduardo maps out Studium's first flashcard engine on the back of a lecture handout, between rotations."],
  ["Apr 2026", "Tested by classmates", "A rough prototype goes out to 40 students across three medical schools—and refuses to gather dust."],
  ["Jul 2026", "Studium opens its doors", "The platform launches publicly, built around real clinical cases and adaptive review."],
  ["Now", "Just getting started", "Growing every week, one study session at a time."]
] as const;

export default function AboutPage() {
  return <main className="min-h-screen overflow-hidden bg-[#fcfdfd]">
    <LanguageBar />
    <header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between"><Logo /><Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link></div>
    </header>

    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
      <div className="container-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow"><Sparkles size={13} />Our story</span>
          <Quote size={34} className="mx-auto mt-8 text-teal-300" fill="currentColor" />
          <blockquote className="display mt-6 text-3xl leading-[1.15] sm:text-5xl">“Everyone deserves the opportunity to learn, pursue medicine, and change lives.”</blockquote>
          <p className="mt-6 text-sm font-extrabold uppercase tracking-[.14em] text-teal-600">— Eduardo Alvarez, Founder &amp; CEO</p>
        </Reveal>
      </div>
    </section>

    <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[1fr_.85fr] lg:items-start">
          <Reveal>
            <span className="eyebrow">How it started</span>
            <h2 className="display mt-5 text-4xl leading-tight sm:text-5xl">An idea born between rotations.</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-500">
              <p>Studium began in a hospital library in 2026, somewhere between a pharmacology exam and a shift that ran two hours too long. Eduardo Alvarez was a medical student who'd started to notice a pattern: the students who thrived weren't always the ones who studied the most—they were the ones who'd found a rhythm that actually worked for them.</p>
              <p>Everyone else was left stitching together borrowed flashcards, outdated question banks, and 2 a.m. searches for the fastest way to memorize the brachial plexus. Eduardo started sketching a different idea: a study companion that adapted to the student, instead of asking the student to adapt to it.</p>
              <p>What started as a rough prototype shared with a study group became Studium—a platform built from the inside of medical training, for the people living through it.</p>
            </div>
          </Reveal>
          <Reveal delay={.1}>
            <div className="rounded-3xl border border-teal-100 bg-[#f9fcfc] p-7 shadow-soft">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-500 text-lg font-extrabold text-white shadow-soft">EA</span>
              <h3 className="mt-5 text-lg font-extrabold tracking-tight">Eduardo Alvarez</h3>
              <p className="text-xs font-bold uppercase tracking-[.12em] text-teal-600">Founder &amp; CEO</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">Eduardo started Studium while still in medical school, convinced the tools students rely on to survive their training could be so much better. He's still just as obsessed with flashcards and diagnostic reasoning as the day he started—just with a few thousand more study sessions behind him.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <section className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal className="max-w-xl"><span className="eyebrow">From idea to impact</span><h2 className="display mt-5 text-4xl sm:text-5xl">Our 2026, so far.</h2></Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {milestones.map(([date, title, text], i) => <Reveal key={title} delay={i * .08}>
            <div className="relative h-full rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
              <span className="text-xs font-extrabold uppercase tracking-[.12em] text-teal-600">{date}</span>
              {i < milestones.length - 1 && <div className="absolute -right-3 top-9 z-10 hidden h-px w-6 bg-teal-300 md:block" />}
              <h3 className="mt-5 text-lg font-extrabold tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          </Reveal>)}
        </div>
      </div>
    </section>

    <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
      <div className="container-page">
        <Reveal className="max-w-xl"><span className="eyebrow">What guides us</span><h2 className="display mt-5 text-4xl sm:text-5xl">A more thoughtful way to grow.</h2></Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map(([Icon, title, text], i) => <Reveal key={title} delay={i * .06}>
            <article className="h-full rounded-3xl border border-slate-100 bg-[#f9fcfc] p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-100 text-teal-700"><Icon size={21} /></span><h3 className="mt-6 text-lg font-extrabold tracking-tight">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-500">{text}</p></article>
          </Reveal>)}
        </div>
      </div>
    </section>

    <section className="container-page py-24 text-center sm:py-32">
      <Reveal>
        <span className="eyebrow"><Sparkles size={13} />What's next</span>
        <h2 className="display mx-auto mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">We're just getting started.</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500">Come learn with us, or come build it with us.</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton href="/signup">Explore Studium</PrimaryButton>
          <Link href="/careers" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700">Join our team</Link>
        </div>
      </Reveal>
    </section>
  </main>;
}
