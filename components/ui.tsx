"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .65, delay, ease: [0.22, 1, .36, 1] }}>{children}</motion.div>;
}

export function PrimaryButton({ children, href = "#pricing", className = "" }: { children: React.ReactNode; href?: string; className?: string }) {
  return <a href={href} className={`group inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#087478] transition hover:-translate-y-0.5 hover:bg-teal-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-100 ${className}`}>{children}<ArrowRight size={16} className="transition group-hover:translate-x-1" /></a>;
}

export function VideoButton() { return <button className="inline-flex items-center gap-2 px-3 py-3 text-sm font-bold text-slate-600 transition hover:text-ink"><span className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white"><Play size={11} fill="currentColor" /></span>See how it works</button>; }

export function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null); const active = useInView(ref, { once: true, amount: .5 }); const [count, setCount] = useState(0);
  useEffect(() => { if (!active) return; const duration = 1100, start = performance.now(); const tick = (now: number) => { const progress = Math.min((now - start) / duration, 1); setCount(Math.floor(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, [active, value]);
  return <div ref={ref}><div className="display text-3xl sm:text-4xl">{count.toLocaleString()}{suffix}</div><div className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-slate-400">{label}</div></div>;
}

export function CheckLine({ children }: { children: React.ReactNode }) { return <li className="flex items-center gap-2 text-sm font-medium text-slate-600"><span className="grid h-5 w-5 place-items-center rounded-full bg-teal-50 text-teal-600"><Check size={12} strokeWidth={3} /></span>{children}</li>; }
