"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, BookOpen, Bot, BrainCircuit, ChevronDown, ChevronRight, Clock3, FileQuestion, FlaskConical, Gift, GraduationCap, Heart, HeartPulse, Home as HomeIcon, Instagram, Layers3, Linkedin, MessageCircle, Microscope, Orbit, PlayCircle, Quote, Rocket, ShieldCheck, Smartphone, Sparkles, Stethoscope, Target, WandSparkles } from "lucide-react";
import { DashboardMockup, AIChat } from "@/components/dashboard";
import { Logo, Navigation } from "@/components/navigation";
import { AppleIcon, CheckLine, GooglePlayIcon, PrimaryButton, Reveal, TikTokIcon, VideoButton } from "@/components/ui";

const features = [
  [BrainCircuit, "Your AI study partner", "Get clear explanations, helpful hints, and a plan whenever you need one.", "bg-[#e2f5f3] text-teal-700"],
  [Layers3, "Notes that work harder", "Turn any notes into intelligent flashcards and active-recall practice.", "bg-[#f1edff] text-violet-600"],
  [Orbit, "A path made for you", "Studium adapts to your goals, pace, and the places you need help most.", "bg-[#fff3dd] text-amber-600"],
  [FileQuestion, "Practice with purpose", "Build confidence with custom questions and feedback that teaches.", "bg-[#e8f1ff] text-blue-600"],
  [GraduationCap, "See real progress", "A simple, beautiful picture of what you know and what comes next.", "bg-[#ffeaf0] text-rose-600"],
  [MessageCircle, "Feedback, instantly", "Get unstuck in the moment instead of waiting for the next class.", "bg-[#e8f8ed] text-emerald-600"]
] as const;
const faqs = [["What is Studium?", "Studium is an AI-powered learning workspace built for medical professionals—from nursing and pharmacy students to med students and residents. It helps you understand material, remember it longer, and see exactly how you're progressing."], ["Can I try it before paying?", "Absolutely. Start with the free plan and explore the essentials. You can upgrade whenever you need more study power."], ["What subjects can I use it for?", "Nursing, medical school, pharmacy, and everything that comes with them—anatomy, pharmacology, clinical reasoning, terminology, and more. Upload your own materials or start with what we've already built."], ["Is my study material private?", "Yes. Your notes and learning data are protected with industry-standard security and are never sold to third parties."]];

export default function Home() {
  return <main id="home" className="overflow-hidden"><Navigation /><Hero /><Trust /><ImmersiveContent /><Features /><LearningShowcase /><HowItWorks /><DashboardSection /><TrustSignals /><FounderNote /><FAQ /><CTA /><DownloadApps /><GiftCards /><Footer /></main>;
}
function Hero() {
  return <section className="relative overflow-hidden pt-[164px] sm:pt-[196px]">
    {/* Background depth: the dot grid + ambient glow are the same pieces as
        before, just finally dark-mode aware—previously bg-teal-100/60 with
        no dark: variant rendered as a washed-out pale mint blob on the
        app's near-black dark background, the same "gradient dark-mode gap"
        pattern fixed elsewhere in the app this session. */}
    <div className="dot-grid absolute inset-x-0 top-0 -z-10 h-[560px] opacity-45 dark:opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    <div className="absolute left-1/2 top-24 -z-20 h-[420px] w-[min(1000px,100vw)] -translate-x-1/2 rounded-full bg-teal-100/60 blur-[100px] dark:bg-teal-500/10" />
    <div className="container-page">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal><span className="eyebrow"><Sparkles size={13} />The intelligent way to learn</span></Reveal>
        <Reveal delay={.08}><h1 className="display mt-6 text-5xl leading-[.98] sm:text-7xl">Study smarter.<br /><span className="bg-gradient-to-r from-teal-500 to-accent-500 bg-clip-text text-transparent dark:from-teal-300 dark:to-accent-300">Learn deeper.</span></h1></Reveal>
        <Reveal delay={.15}><p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">Everything you need to master your studies in one place—from AI-powered learning and organized notes to flashcards, quizzes, and clinical cases.</p></Reveal>
        <Reveal delay={.22} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"><PrimaryButton className="w-full !px-7 !py-3.5 !text-base sm:w-auto">Start learning for free</PrimaryButton><VideoButton className="w-full sm:w-auto" /></Reveal>
      </div>
      {/* DashboardMockup's hero size now supplies its own top-left "Study
          Shield" streak card, so the standalone badge that used to live
          here was removed rather than kept as a second, overlapping one. */}
      <Reveal delay={.18} className="relative mt-16 pb-6 sm:mt-20">
        <DashboardMockup hero />
      </Reveal>
    </div>
  </section>;
}
function Trust() { return <section className="border-y border-slate-100 dark:border-white/10 bg-white dark:bg-transparent py-7"><div className="container-page text-center"><p className="text-sm font-bold text-slate-600 dark:text-slate-400">Notes, flashcards, quizzes, and AI—built to help you master any subject.</p></div></section>; }
function ImmersiveContent() { return <section className="container-page pb-10 pt-20 sm:pb-12 sm:pt-24"><div className="grid items-center gap-10 overflow-hidden rounded-[30px] border border-teal-100 dark:border-teal-500/15 bg-[#f3fbfa] dark:bg-teal-500/5 p-7 sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:p-12"><Reveal><span className="eyebrow">Built for the real world</span><h2 className="display mt-5 max-w-xl text-4xl leading-tight sm:text-5xl">Immerse yourself in real-world content.</h2><p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">Study with real medical cases, diagnostic challenges, anatomy, and clinical reasoning instead of memorizing isolated facts.</p></Reveal><Reveal delay={.12}><div className="grid grid-cols-2 gap-3"><div className="col-span-2 flex items-center gap-4 rounded-2xl bg-ink p-5 text-white shadow-soft"><span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-400 text-teal-950"><HeartPulse size={22} /></span><div><p className="text-xs font-extrabold">Clinical case of the day</p><p className="mt-1 text-[10px] text-slate-300">Chest pain · Assess, reason, decide</p></div></div><div className="rounded-2xl border border-teal-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4"><Microscope size={20} className="text-teal-600" /><p className="mt-5 text-xs font-extrabold">Explore anatomy</p><p className="mt-1 text-[10px] text-slate-500">See systems in context</p></div><div className="rounded-2xl border border-teal-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4"><BrainCircuit size={20} className="text-violet-500" /><p className="mt-5 text-xs font-extrabold">Think clinically</p><p className="mt-1 text-[10px] text-slate-500">Build diagnostic instinct</p></div></div></Reveal></div></section>; }
function Features() { return <section id="features" className="container-page pb-24 pt-12 sm:pb-32 sm:pt-16"><Reveal className="max-w-xl"><span className="eyebrow">Made to help you thrive</span><h2 className="display mt-5 text-4xl leading-tight sm:text-5xl">Everything you need to learn with confidence.</h2></Reveal><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{features.map(([Icon, title, description, color], i) => <Reveal key={title} delay={i * .05}><motion.article whileHover={{ y: -6 }} className="group h-full rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft transition-shadow hover:shadow-lift"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${color}`}><Icon size={21} /></span><h3 className="mt-6 text-lg font-extrabold tracking-tight">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p><div className="mt-5 h-px w-0 bg-teal-300 transition-all duration-300 group-hover:w-9" /></motion.article></Reveal>)}</div></section>; }
function LearningShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#f3fbfa] dark:bg-teal-500/5 py-24 sm:py-32">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(126,211,209,.32),transparent_66%)]" />
      <div className="container-page relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <Reveal className="order-2 lg:order-1 lg:col-span-5">
          {/* Slim iPhone-15-Pro-style frame: thin bezel, dynamic island,
              and a real status bar + bottom tab bar/home indicator so it
              reads as a real device next to the copy rather than a
              floating blob. `group` + a subtle hover tilt on the frame,
              a proper radial-gradient back-light, and a glassmorphic
              (not flat) floating badge—the same premium treatment already
              applied to the dashboard mockup, brought over here. */}
          <div className="group relative mx-auto w-full max-w-[240px] sm:max-w-[270px]">
            <div className="absolute left-1/2 top-1/2 -z-10 h-[130%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,139,141,.30),rgba(15,139,141,0)_65%)] blur-3xl" />
            {/* True iPhone proportions (9:19.5) instead of a squared-off
                card—an explicit aspect-ratio, a real status bar, and a
                bottom tab bar + home indicator are what make it read as
                a phone rather than a rounded rectangle. */}
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[46px] border-[3px] border-ink bg-white dark:bg-[#0d1917] shadow-[0_28px_55px_-18px_rgba(15,80,80,.35)] transition-transform duration-500 ease-out group-hover:-rotate-1 group-hover:scale-[1.015]">
              <div className="absolute left-1/2 top-2 z-10 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-ink" />
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[8px] font-bold text-heading">
                  <span>9:41</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-ink/60 dark:bg-white/60" /><span className="h-2 w-3.5 rounded-[3px] border border-ink/60 dark:border-white/60" /></span>
                </div>
                <div className="flex flex-1 flex-col px-3.5 pb-2 pt-4">
                  <div className="flex items-center justify-between"><p className="text-[9px] font-extrabold text-heading">Medical revision</p><span className="text-[8px] font-bold text-teal-600">7 / 12</span></div>
                  <div className="mt-3 overflow-hidden rounded-2xl border border-teal-100 dark:border-teal-500/20 bg-[#effbfa] dark:bg-teal-500/10">
                    <div className="flex h-28 items-center justify-center bg-[radial-gradient(circle_at_center,#d8f4f1,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(15,139,141,.25),transparent_70%)]"><div className="relative grid h-16 w-16 place-items-center rounded-full border-4 border-teal-400/40 bg-white dark:bg-[#0d1917] text-teal-600 shadow-sm"><HeartPulse size={28} /><span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-teal-500 text-white"><Activity size={9} /></span></div></div>
                    <div className="bg-white dark:bg-[#0d1917] p-2.5"><p className="text-[8px] font-bold text-slate-500">CARDIOLOGY</p><p className="mt-1 text-[11px] font-extrabold leading-snug text-heading">What does the mitral valve do?</p></div>
                  </div>

                  {/* Rating row—the same real Again/Hard/Good/Easy scale
                      used everywhere flashcards are rated in the actual
                      app (components/flashcard.tsx's FlashcardRatingRow),
                      condensed to mockup scale rather than a new invented
                      control. */}
                  <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                    <div className="rounded-lg border border-rose-200 bg-rose-50 py-1.5 text-center dark:border-rose-500/20 dark:bg-rose-500/10"><p className="text-[7px] font-extrabold text-rose-600">Again</p></div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 py-1.5 text-center dark:border-amber-500/20 dark:bg-amber-500/10"><p className="text-[7px] font-extrabold text-amber-700">Hard</p></div>
                    <div className="rounded-lg border border-teal-200 bg-teal-50 py-1.5 text-center dark:border-teal-500/20 dark:bg-teal-500/10"><p className="text-[7px] font-extrabold text-teal-700">Good</p></div>
                    <div className="rounded-lg bg-teal-600 py-1.5 text-center"><p className="text-[7px] font-extrabold text-white">Easy</p></div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-slate-100 dark:border-white/10 p-2"><Clock3 size={13} className="text-violet-500" /><p className="mt-1.5 text-[7px] font-bold text-slate-500">Studying</p><p className="text-[9px] font-extrabold text-heading">4m 12s</p></div>
                    <div className="rounded-xl border border-slate-100 dark:border-white/10 p-2"><Target size={13} className="text-teal-600" /><p className="mt-1.5 text-[7px] font-bold text-slate-500">Accuracy</p><p className="text-[9px] font-extrabold text-heading">86%</p></div>
                  </div>

                  {/* Up next—a real queue preview, not blank space, so the
                      screen reads as an in-progress session rather than a
                      single card floating alone. */}
                  <div className="mt-2.5">
                    <p className="text-[7px] font-extrabold uppercase tracking-wide text-slate-400">Up next</p>
                    <div className="mt-1.5 space-y-1.5">
                      <div className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-white/10 px-2 py-1.5"><span className="min-w-0 flex-1 truncate text-[8px] font-bold text-heading">Pharmacology · Beta blockers</span><ChevronRight size={10} className="shrink-0 text-slate-300" /></div>
                      <div className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-white/10 px-2 py-1.5"><span className="min-w-0 flex-1 truncate text-[8px] font-bold text-heading">Physiology · Cardiac output</span><ChevronRight size={10} className="shrink-0 text-slate-300" /></div>
                    </div>
                  </div>

                  <div className="mt-3"><div className="flex items-center justify-between text-[7px] font-bold text-slate-500"><span>Deck progress</span><span>58%</span></div><div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full w-[58%] rounded-full bg-teal-500" /></div></div>
                </div>
                <div className="flex items-center justify-around border-t border-slate-100 dark:border-white/10 px-3 py-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-300"><HomeIcon size={13} /></span>
                  <span className="grid h-7 w-7 place-items-center text-slate-300 dark:text-slate-600"><BookOpen size={13} /></span>
                  <span className="grid h-7 w-7 place-items-center text-slate-300 dark:text-slate-600"><Layers3 size={13} /></span>
                  <span className="grid h-7 w-7 place-items-center text-slate-300 dark:text-slate-600"><Bot size={13} /></span>
                </div>
                <div className="flex justify-center pb-1.5 pt-0.5"><div className="h-1 w-20 rounded-full bg-ink/50 dark:bg-white/30" /></div>
              </div>
            </div>
            <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -right-5 -top-4 rounded-2xl border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#0d1917]/85">
              <p className="text-[9px] font-extrabold text-teal-700 dark:text-teal-300">+20 XP</p>
              <p className="mt-1 text-[8px] font-bold text-slate-500">Great recall!</p>
            </motion.div>
          </div>
        </Reveal>
        <Reveal delay={.12} className="order-1 max-w-xl lg:order-2 lg:col-span-7">
          <span className="eyebrow">Study smarter, naturally</span>
          <h2 className="display mt-5 text-4xl leading-tight sm:text-5xl">Learn the Way Your Brain Was Designed To.</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">Forget endless memorization. Studium uses an immersive, science-backed learning approach that helps you understand and retain information naturally.</p>
          <PrimaryButton className="mt-8">Get started for free now</PrimaryButton>
        </Reveal>
      </div>
    </section>
  );
}
function HowItWorks() { const steps = [["01", "Make it yours", "Create your account, add your subjects, and tell Studium what success looks like."], ["02", "Bring your materials", "Upload notes, paste a topic, or pick something new to learn."], ["03", "Learn in your flow", "Get a personalized plan, sharp explanations, and the right questions."], ["04", "Watch yourself grow", "See your knowledge compound, one small win at a time."]]; return <section id="how-it-works" className="bg-ink py-24 text-white sm:py-32"><div className="container-page"><Reveal><span className="eyebrow border-white/10 bg-white/5 text-teal-300">A simpler study system</span><div className="mt-5 flex flex-col justify-between gap-5 md:flex-row"><h2 className="display max-w-lg text-4xl leading-tight text-white sm:text-5xl">From first thought to real understanding.</h2><p className="max-w-xs self-end text-sm leading-relaxed text-slate-300">No more trying to make one-size-fits-all methods fit you.</p></div></Reveal><div className="mt-14 grid gap-4 md:grid-cols-4">{steps.map(([number, title, text], i) => <Reveal key={number} delay={i * .1}><div className="relative h-full rounded-2xl border border-white/10 bg-white/[.04] p-5"><span className="text-sm font-extrabold text-teal-300">{number}</span>{i < 3 && <div className="absolute -right-3 top-10 z-10 hidden h-px w-6 bg-teal-400/50 md:block" />}<h3 className="mt-10 text-lg font-extrabold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{text}</p></div></Reveal>)}</div></div></section>; }
function DashboardSection() { return <section className="container-page py-24 sm:py-32"><div className="grid items-center gap-14 lg:grid-cols-[.78fr_1.22fr]"><Reveal><span className="eyebrow">Clarity, at a glance</span><h2 className="display mt-5 text-4xl leading-tight sm:text-5xl">Know where you are. Know what&apos;s next.</h2><p className="mt-5 max-w-md text-sm leading-relaxed text-slate-500">A calm, focused home for your learning. Your goals, plans, study streaks, and wins—all in one place.</p><ul className="mt-7 space-y-3"><CheckLine>Gentle daily goals that add up</CheckLine><CheckLine>Insights that keep you motivated</CheckLine><CheckLine>One place for every subject</CheckLine></ul><a href="/pricing" className="mt-8 inline-flex cursor-pointer items-center gap-1 text-sm font-extrabold text-teal-600 hover:text-teal-700">Explore the dashboard <span>→</span></a></Reveal><Reveal delay={.12}><DashboardMockup /></Reveal></div></section>; }
// Replaces a row of invented usage numbers (Studium has no real user base
// yet to report honestly). These four claims are all actually true of the
// product as built this session: a real spaced-repetition/active-recall
// engine (lib/spacedRepetitionCore.ts), real clinical case content
// (lib/clinicalCases.ts), a real free tier, and notes/progress that live
// in the user's own account, never sold or shared.
function TrustSignals() {
  const signals = [
    [ShieldCheck, "Private by design", "Your notes, flashcards, and progress are yours alone—never sold, never shared."],
    [FlaskConical, "Evidence-based methods", "Spaced repetition and active recall, not flashcards with a fresh coat of paint."],
    [Stethoscope, "Real clinical content", "Actual cases and terminology, not generic trivia dressed up as medicine."],
    [Gift, "Free to start", "No credit card, and no trial clock quietly running out on you."]
  ] as const;
  return <section className="border-y border-teal-100 dark:border-teal-500/10 bg-teal-50/60 dark:bg-teal-500/5 py-14">
    <div className="container-page grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {signals.map(([Icon, title, text], i) => <Reveal key={title} delay={i * .06}>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white dark:bg-white/10 text-teal-600 dark:text-teal-300 shadow-sm"><Icon size={18} /></span>
          <div><p className="text-sm font-extrabold text-heading">{title}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{text}</p></div>
        </div>
      </Reveal>)}
    </div>
  </section>;
}
// Replaces three invented student testimonials with the one real quote
// Studium actually has: its founder's, already used honestly on /about.
// No fabricated reviewers, no star ratings that don't exist yet.
function FounderNote() {
  return <section className="container-page py-24 sm:py-32">
    <Reveal className="mx-auto max-w-2xl text-center">
      <span className="eyebrow"><Sparkles size={13} />Why we built this</span>
      <Quote size={26} className="mx-auto mt-7 text-teal-300" fill="currentColor" />
      <blockquote className="display mt-5 text-2xl leading-snug sm:text-3xl">“Everyone deserves the opportunity to learn, pursue medicine, and change lives.”</blockquote>
      <div className="mt-7 flex items-center justify-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-500 text-sm font-extrabold text-white">EA</span>
        <div className="text-left"><p className="text-sm font-extrabold text-heading">Eduardo Alvarez</p><p className="text-xs text-slate-500">Founder &amp; CEO — still a medical student</p></div>
      </div>
      <a href="/about" className="mt-6 inline-flex cursor-pointer items-center gap-1 text-sm font-extrabold text-teal-600 hover:text-teal-700">Read our story <span>→</span></a>
    </Reveal>
  </section>;
}
function FAQ() { const [open, setOpen] = useState(0); return <section id="faq" className="container-page py-24 sm:py-32"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><Reveal><span className="eyebrow">Questions, answered</span><h2 className="display mt-5 text-4xl leading-tight sm:text-5xl">A few things you might be wondering.</h2><p className="mt-5 text-sm leading-relaxed text-slate-500">Still curious? Our friendly team is always happy to help.</p><a href="mailto:hello@studium.app" className="mt-6 inline-block text-sm font-extrabold text-teal-600">Talk to us →</a></Reveal><div>{faqs.map(([question, answer], i) => <div key={question} className="border-b border-slate-200"><button type="button" onClick={() => setOpen(i === open ? -1 : i)} className="flex w-full cursor-pointer items-center justify-between py-5 text-left text-sm font-extrabold"><span>{question}</span><ChevronDown size={18} className={`text-teal-600 transition-transform ${open === i ? "rotate-180" : ""}`} /></button><AnimatePresence initial={false}>{open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-xl pb-5 text-sm leading-relaxed text-slate-500">{answer}</p></motion.div>}</AnimatePresence></div>)}</div></div></section>; }
function CTA() { return <section className="container-page pb-24 sm:pb-32"><Reveal><div className="relative overflow-hidden rounded-[34px] bg-teal-600 px-7 py-16 text-center text-white sm:px-16 sm:py-20"><div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-teal-400/50 blur-2xl" /><div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-teal-800/50 blur-2xl" /><div className="relative"><Rocket className="mx-auto text-teal-100" size={30} /><h2 className="display mt-5 text-4xl leading-tight text-white sm:text-5xl">Your next breakthrough<br />starts here.</h2><p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-teal-100">Make your study time feel lighter, sharper, and entirely your own.</p><PrimaryButton className="mt-8 !bg-white !text-teal-700 hover:!bg-teal-50">Start learning for free</PrimaryButton></div></div></Reveal></section>; }
function DownloadApps() { return <section className="border-t border-slate-100 dark:border-white/10 bg-white dark:bg-transparent py-16 sm:py-20"><div className="container-page"><Reveal><div className="flex flex-col items-center justify-between gap-7 rounded-3xl bg-[#f3fbfa] dark:bg-teal-500/5 px-6 py-9 text-center sm:px-10 lg:flex-row lg:text-left"><div className="flex max-w-xl items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-500 text-white shadow-soft"><Smartphone size={22} /></span><div><h2 className="display text-2xl">Carry your momentum with you.</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">A spare ten minutes can become your smartest study session. Keep your cards, goals, and AI tutor close—wherever the day takes you.</p></div></div><div className="flex flex-col gap-2 xs:flex-row sm:flex-row"><a href="#" className="flex min-w-[158px] items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-left text-white transition hover:-translate-y-0.5 hover:bg-slate-800"><AppleIcon size={24} className="shrink-0 text-white" /><span><span className="block text-[8px] font-medium uppercase tracking-wider text-slate-300">Download on the</span><span className="block text-sm font-bold leading-tight">App Store</span></span></a><a href="#" className="flex min-w-[158px] items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-left text-white transition hover:-translate-y-0.5 hover:bg-slate-800"><GooglePlayIcon size={28} className="shrink-0" /><span><span className="block text-[8px] font-medium uppercase tracking-wider text-slate-300">Get it on</span><span className="block text-sm font-bold leading-tight">Google Play</span></span></a></div></div></Reveal></div></section>; }
function GiftCards() { return <section className="container-page pb-16 sm:pb-20"><Reveal><div className="relative overflow-hidden rounded-3xl border border-accent-100 dark:border-accent-500/20 bg-accent-50 dark:bg-accent-500/10 px-6 py-9 sm:px-10"><div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-accent-100/70 dark:bg-accent-500/10 blur-3xl" /><div className="relative flex flex-col items-center justify-between gap-7 text-center lg:flex-row lg:text-left"><div className="flex max-w-xl items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-500 text-white shadow-soft"><Gift size={22} /></span><div><h2 className="display text-2xl">Give the gift of learning.</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">The perfect gift for a future clinician: unlimited flashcards, real clinical cases, and an AI tutor that never sleeps. Choose an amount, add a note, and we'll deliver it straight to their inbox.</p></div></div><a href="/gift-cards" className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Send a gift card</a></div></div></Reveal></section>; }
const footerHrefs: Record<string, string> = {
  About: "/about", Careers: "/careers", Pricing: "/pricing", "Gift cards": "/gift-cards",
  Terms: "/terms", Privacy: "/privacy", "Cookie Settings": "/cookie-settings", Guidelines: "/guidelines",
  Acknowledgements: "/acknowledgements", Licenses: "/licenses", "Company Information": "/company-information"
};
function Footer() { return <footer className="border-t border-slate-100 dark:border-white/10 bg-white dark:bg-transparent py-12"><div className="container-page"><div className="grid gap-10 md:grid-cols-[1.1fr_repeat(4,1fr)]"><div><Logo /><p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-500">A kinder, smarter way to learn. Built around you.</p></div>{[["Product", "Features", "Pricing", "Gift cards", "For educators"], ["Resources", "Help centre", "Study guides", "Community"], ["Company", "About", "Careers", "Contact"], ["Policies", "Terms", "Privacy", "Cookie Settings", "Guidelines", "Acknowledgements", "Licenses", "Company Information"]].map(([head,...links]) => <div key={head}><p className="text-xs font-extrabold text-heading">{head}</p>{links.map(x => <a href={footerHrefs[x] ?? "#"} key={x} className="mt-3 block cursor-pointer text-xs text-slate-500 hover:text-teal-600">{x}</a>)}</div>)}</div><div className="mt-12 flex flex-col items-center gap-6 border-t border-slate-100 dark:border-white/10 pt-6 sm:flex-row sm:justify-between"><div className="flex items-center gap-3"><a href="#" aria-label="Instagram" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-slate-200 dark:border-white/10 text-slate-500 transition hover:border-teal-200 hover:text-teal-600"><Instagram size={16} /></a><a href="#" aria-label="LinkedIn" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-slate-200 dark:border-white/10 text-slate-500 transition hover:border-teal-200 hover:text-teal-600"><Linkedin size={16} /></a><a href="#" aria-label="TikTok" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-slate-200 dark:border-white/10 text-slate-500 transition hover:border-teal-200 hover:text-teal-600"><TikTokIcon size={16} /></a></div><p className="text-[11px] text-slate-500">© 2026 Studium, Inc. All rights reserved.</p><div className="flex gap-5 text-[11px] text-slate-500"><a href="/privacy" className="cursor-pointer hover:text-teal-600">Privacy</a><a href="/terms" className="cursor-pointer hover:text-teal-600">Terms</a></div></div></div></footer>; }
