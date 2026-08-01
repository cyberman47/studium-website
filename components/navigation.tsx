"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./ui";

const links = ["Features", "How it works", "Pricing", "FAQ"];
export function Logo() { return <a href="#home" className="flex items-center gap-2 text-lg font-extrabold tracking-[-.05em]"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-teal-500 text-lg text-white shadow-sm">S</span>studium</a>; }
export function Navigation() {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); onScroll(); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-slate-200/70 bg-white/85 py-3 shadow-sm backdrop-blur-xl" : "py-5"}`}><nav className="container-page flex items-center justify-between"><Logo /><div className="hidden items-center gap-7 md:flex">{links.map(x => <a key={x} href={`#${x.toLowerCase().replaceAll(" ", "-")}`} className="text-sm font-bold text-slate-500 transition hover:text-ink">{x}</a>)}<a href="#login" className="text-sm font-bold text-slate-600 hover:text-ink">Log in</a><PrimaryButton className="px-4 py-2.5">Get started</PrimaryButton></div><button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X size={19} /> : <Menu size={19} />}</button></nav>{open && <div className="container-page mt-3 md:hidden"><div className="rounded-2xl border bg-white p-3 shadow-lift">{links.map(x => <a onClick={() => setOpen(false)} key={x} href={`#${x.toLowerCase().replaceAll(" ", "-")}`} className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">{x}</a>)}<a href="#pricing" onClick={() => setOpen(false)} className="mt-1 block rounded-xl bg-teal-500 px-4 py-3 text-center text-sm font-bold text-white">Start studying free</a></div></div>}</header>;
}
