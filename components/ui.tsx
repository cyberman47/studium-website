"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .65, delay, ease: [0.22, 1, .36, 1] }}>{children}</motion.div>;
}

export function PrimaryButton({ children, href = "/signup", className = "" }: { children: React.ReactNode; href?: string; className?: string }) {
  return <a href={href} className={`group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-accent-100 ${className}`}>{children}<ArrowRight size={16} className="transition group-hover:translate-x-1" /></a>;
}

export function VideoButton() { return <button type="button" className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-3 text-sm font-bold text-slate-600 transition hover:text-ink"><span className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white"><Play size={11} fill="currentColor" /></span>See how it works</button>; }

export function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null); const active = useInView(ref, { once: true, amount: .5 }); const [count, setCount] = useState(0);
  useEffect(() => { if (!active) return; const duration = 1100, start = performance.now(); const tick = (now: number) => { const progress = Math.min((now - start) / duration, 1); setCount(Math.floor(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, [active, value]);
  return <div ref={ref}><div className="display text-3xl sm:text-4xl">{count.toLocaleString()}{suffix}</div><div className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-slate-500">{label}</div></div>;
}

export function CheckLine({ children }: { children: React.ReactNode }) { return <li className="flex items-center gap-2 text-sm font-medium text-slate-600"><span className="grid h-5 w-5 place-items-center rounded-full bg-teal-50 text-teal-600"><Check size={12} strokeWidth={3} /></span>{children}</li>; }

export const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-100";

export function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-extrabold text-slate-600">{label}{required && <span className="text-teal-500"> *</span>}</span>{children}</label>;
}

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" /><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" /><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" /><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" /></svg>;
}

export function AppleIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.415-3.099c.836-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.71-.688 3.559-1.701z" /></svg>;
}

export function GooglePlayIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 34 38" width={size} height={size} className={className}><path fill="#34A853" d="M3 2.2 20.5 19 3 35.8Z" /><path fill="#4285F4" d="m3 2.2 20.5 12.1-6 4.7Z" /><path fill="#FBBC04" d="m3 35.8 14.5-16 6 4.7Z" /><path fill="#EA4335" d="m23.5 14.3 6.6 3.9a1 1 0 0 1 0 1.6l-6.6 3.9-6-4.7Z" /></svg>;
}

export function TikTokIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" /></svg>;
}

export function OAuthButtons({ actionLabel }: { actionLabel: string }) {
  const [notice, setNotice] = useState("");
  function handle(provider: string) {
    setNotice(`${provider} isn't connected yet — please use email for now.`);
  }
  return <>
    <div className="mt-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Or</span><div className="h-px flex-1 bg-slate-200" /></div>
    <div className="mt-6 space-y-3">
      <button type="button" onClick={() => handle("Google")} className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-slate-200 bg-white py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-slate-50"><GoogleIcon />{actionLabel} with Google</button>
      <button type="button" onClick={() => handle("Apple")} className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-ink py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"><AppleIcon size={18} />{actionLabel} with Apple</button>
    </div>
    {notice && <p className="mt-4 text-center text-xs font-bold text-teal-600">{notice}</p>}
  </>;
}
