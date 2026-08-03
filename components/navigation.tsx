"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./ui";

const links = ["Features", "How it works", "Pricing", "FAQ"];
function linkHref(x: string) { return x === "Pricing" ? "/pricing" : `#${x.toLowerCase().replaceAll(" ", "-")}`; }
const languages = [
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "nl", flag: "🇳🇱", name: "Nederlands" },
  { code: "pt", flag: "🇵🇹", name: "Português" }
] as const;

export function LanguageBar({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof languages)[number]>(languages[0]);
  const [notice, setNotice] = useState(false);

  function choose(lang: (typeof languages)[number]) {
    setSelected(lang);
    setOpen(false);
    setNotice(lang.code !== "en");
  }

  return <div className={`border-b border-slate-100 bg-[#f9fcfc] ${className}`}>
    <div className="container-page flex h-9 items-center justify-end gap-3">
      {notice && <span className="text-[11px] font-bold text-teal-600">{selected.name} translation coming soon</span>}
      <div className="relative">
        <button type="button" onClick={() => setOpen(!open)} className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-ink">
          <span>{selected.flag}</span><span>{selected.name}</span><ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && <div className="absolute right-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-xl border border-slate-100 bg-white py-1.5 shadow-lift">
          {languages.map(l => <button key={l.code} type="button" onClick={() => choose(l)} className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs font-bold transition hover:bg-slate-50 ${l.code === selected.code ? "text-teal-600" : "text-slate-600"}`}>
            <span>{l.flag}</span><span>{l.name}</span>
          </button>)}
        </div>}
      </div>
    </div>
  </div>;
}
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) { return <Image src="/images/studium-logo.png" alt="Studium logo" width={64} height={64} className={`${className} rounded-[10px] object-cover shadow-sm`} priority />; }
export function Wordmark({ className = "h-6 w-auto" }: { className?: string }) { return <Image src="/images/studium-wordmark.png" alt="Studium" width={920} height={230} className={className} priority />; }
export function Logo({ href = "/" }: { href?: string }) { return <Link href={href} className="flex cursor-pointer items-center gap-2"><LogoMark /><Wordmark /></Link>; }
export function Navigation() {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); onScroll(); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <><LanguageBar className="fixed inset-x-0 top-0 z-[60]" /><header className={`fixed inset-x-0 top-9 z-50 transition-all duration-300 ${scrolled ? "border-b border-slate-200/70 bg-white/85 py-3 shadow-sm backdrop-blur-xl" : "py-5"}`}><nav className="container-page flex items-center justify-between"><Logo /><div className="hidden items-center gap-7 md:flex">{links.map(x => <a key={x} href={linkHref(x)} className="cursor-pointer text-sm font-bold text-slate-500 transition hover:text-ink">{x}</a>)}<a href="/login" className="cursor-pointer text-sm font-bold text-slate-600 hover:text-ink">Log in</a><PrimaryButton className="px-4 py-2.5">Get started</PrimaryButton></div><button type="button" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-slate-200 bg-white md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X size={19} /> : <Menu size={19} />}</button></nav>{open && <div className="container-page mt-3 md:hidden"><div className="rounded-2xl border bg-white p-3 shadow-lift">{links.map(x => <a onClick={() => setOpen(false)} key={x} href={linkHref(x)} className="block cursor-pointer rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">{x}</a>)}<a href="/login" onClick={() => setOpen(false)} className="block cursor-pointer rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Log in</a><a href="/signup" onClick={() => setOpen(false)} className="mt-1 block cursor-pointer rounded-xl bg-accent-500 px-4 py-3 text-center text-sm font-bold text-white">Start studying free</a></div></div>}</header></>;
}
