"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./ui";
import { ThemeToggleButton } from "./theme-toggle";

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

  return <div className={`border-b border-slate-100 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 ${className}`}>
    <div className="container-page flex h-9 items-center justify-end gap-3">
      {notice && <span className="text-[11px] font-bold text-teal-600">{selected.name} translation coming soon</span>}
      <div className="relative">
        <button type="button" onClick={() => setOpen(!open)} className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-heading">
          <span>{selected.flag}</span><span>{selected.name}</span><ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && <div className="absolute right-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] py-1.5 shadow-lift">
          {languages.map(l => <button key={l.code} type="button" onClick={() => choose(l)} className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs font-bold transition hover:bg-slate-50 dark:bg-white/5 ${l.code === selected.code ? "text-teal-600" : "text-slate-600"}`}>
            <span>{l.flag}</span><span>{l.name}</span>
          </button>)}
        </div>}
      </div>
    </div>
  </div>;
}
// The brand mark: a serpent curled into the shape of an "S"—a nod to the Rod
// of Asclepius (medicine's own snake-and-staff symbol) doubling as the first
// letter of the wordmark. Both files are tight crops of the same source
// artwork (public/images/Gemini_Generated_Image_ff3rnbff3rnbff3r.png), not
// separately drawn, so the icon and the full lockup always match exactly.
export function LogoMark({ className = "h-8 w-6" }: { className?: string }) {
  return <Image src="/images/studium-logo-icon.png" alt="Studium" width={199} height={303} className={`${className} object-contain`} priority />;
}
export function Logo({ href = "/", className = "h-8 w-auto" }: { href?: string; className?: string }) {
  return <Link href={href} className="flex cursor-pointer items-center" aria-label="Studium">
    {/* Source crop is 779x303—plenty of headroom above any size used here, so
       scaling this className up never looks soft, even at 2-3x pixel density. */}
    <Image src="/images/studium-logo-full.png" alt="Studium" width={779} height={303} className={`${className} object-contain`} priority />
  </Link>;
}
export function Navigation() {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); onScroll(); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <><LanguageBar className="fixed inset-x-0 top-0 z-[60]" /><header className={`fixed inset-x-0 top-9 z-50 transition-all duration-300 ${scrolled ? "border-b border-slate-200/70 dark:border-white/10 bg-white/85 dark:bg-[#0d1917]/85 py-3 shadow-sm backdrop-blur-xl" : "py-5"}`}><nav className="container-page flex items-center justify-between"><Logo className="h-10 w-auto" /><div className="hidden items-center gap-7 md:flex">{links.map(x => <a key={x} href={linkHref(x)} className="cursor-pointer text-sm font-bold text-slate-500 transition hover:text-heading">{x}</a>)}<a href="/login" className="cursor-pointer text-sm font-bold text-slate-600 hover:text-heading">Log in</a><ThemeToggleButton /><PrimaryButton className="px-4 py-2.5">Get started</PrimaryButton></div><div className="flex items-center gap-2 md:hidden"><ThemeToggleButton /><button type="button" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917]" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X size={19} /> : <Menu size={19} />}</button></div></nav>{open && <div className="container-page mt-3 md:hidden"><div className="rounded-2xl border bg-white dark:bg-[#0d1917] p-3 shadow-lift">{links.map(x => <a onClick={() => setOpen(false)} key={x} href={linkHref(x)} className="block cursor-pointer rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:bg-white/5">{x}</a>)}<a href="/login" onClick={() => setOpen(false)} className="block cursor-pointer rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:bg-white/5">Log in</a><a href="/signup" onClick={() => setOpen(false)} className="mt-1 block cursor-pointer rounded-xl bg-accent-500 px-4 py-3 text-center text-sm font-bold text-white">Start studying free</a></div></div>}</header></>;
}
