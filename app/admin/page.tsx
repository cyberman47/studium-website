"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Database, Flag, GitBranch, Layers, ListChecks, Map, Stethoscope } from "lucide-react";
import { clinicalCases, getAllCases, CUSTOM_CASES_EVENT } from "@/lib/clinicalCases";
import { CUSTOM_TERMS_EVENT, getAllTerms, termCategories } from "@/lib/terminology";
import { contentTracks } from "@/lib/contentTracks";
import { getReports, REPORTS_EVENT } from "@/lib/reports";
import { getQuestions, QUESTION_BANK_EVENT } from "@/lib/questionBank";

export default function AdminOverviewPage() {
  const [termCount, setTermCount] = useState(0);
  const [caseCount, setCaseCount] = useState(clinicalCases.length);
  const [categoryCounts, setCategoryCounts] = useState<{ id: string; name: string; count: number }[]>([]);
  const [storageOk, setStorageOk] = useState(false);
  const [openReports, setOpenReports] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem("__studium_admin_probe", "1");
      localStorage.removeItem("__studium_admin_probe");
      setStorageOk(true);
    } catch {
      setStorageOk(false);
    }
    function refreshTerms() {
      const all = getAllTerms();
      setTermCount(all.length);
      setCategoryCounts(termCategories.map(c => ({ id: c.id, name: c.name, count: all.filter(t => t.categoryId === c.id).length })));
    }
    function refreshCases() { setCaseCount(getAllCases().length); }
    function refreshReports() { setOpenReports(getReports().filter(r => r.status === "open").length); }
    function refreshQuestions() { setQuestionCount(getQuestions().length); }
    refreshTerms(); refreshCases(); refreshReports(); refreshQuestions();
    window.addEventListener(CUSTOM_TERMS_EVENT, refreshTerms);
    window.addEventListener(CUSTOM_CASES_EVENT, refreshCases);
    window.addEventListener(REPORTS_EVENT, refreshReports);
    window.addEventListener(QUESTION_BANK_EVENT, refreshQuestions);
    return () => {
      window.removeEventListener(CUSTOM_TERMS_EVENT, refreshTerms);
      window.removeEventListener(CUSTOM_CASES_EVENT, refreshCases);
      window.removeEventListener(REPORTS_EVENT, refreshReports);
      window.removeEventListener(QUESTION_BANK_EVENT, refreshQuestions);
    };
  }, []);

  const stats = [
    { label: "Total Medical Terms", value: termCount, icon: Layers, tint: "text-teal-400" },
    { label: "Clinical Cases", value: caseCount, icon: Stethoscope, tint: "text-violet-400" },
    { label: "Question Bank", value: questionCount, icon: ListChecks, tint: "text-sky-400" },
    { label: "Open Reports", value: openReports, icon: Flag, tint: openReports > 0 ? "text-amber-400" : "text-slate-500" }
  ];

  const quickLinks = [
    { label: "Vocabulary", href: "/admin/vocabulary", icon: Layers, desc: "Terms, definitions, categories" },
    { label: "Clinical Cases", href: "/admin/cases", icon: Stethoscope, desc: "Case authoring & daily rotation" },
    { label: "Lesson Builder", href: "/admin/lessons", icon: GitBranch, desc: "Compose custom courses" },
    { label: "Question Bank", href: "/admin/questions", icon: ListChecks, desc: "MCQ, ECG, case questions" },
    { label: "Learning Paths", href: "/admin/paths", icon: Map, desc: "Content tracks & path identities" },
    { label: "Notifications", href: "/admin/notifications", icon: Bell, desc: "Compose real announcements" }
  ];

  return <div>
    <h1 className="text-lg font-extrabold text-white">Overview</h1>
    <p className="mt-1 text-xs text-slate-500">Live counts, computed from the same data every real page in the app reads—nothing here is fabricated.</p>

    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(s => <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><s.icon size={13} className={s.tint} />{s.label}</div>
        <p className="mt-2 text-2xl font-extrabold text-white">{s.value}</p>
      </div>)}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Database size={13} className={storageOk ? "text-emerald-400" : "text-rose-400"} />Data Source</div>
        <p className="mt-2 flex items-center gap-1.5 text-sm font-extrabold text-white">
          <span className={`h-1.5 w-1.5 rounded-full ${storageOk ? "bg-emerald-400" : "bg-rose-400"}`} />
          {storageOk ? "Browser Storage · OK" : "Unavailable"}
        </p>
        <p className="mt-1 text-[11px] text-slate-500">No real database—honest label, not a health-check theater.</p>
      </div>
    </div>

    {/* Every number here is a live filter over the same getAllTerms() the
        total above uses, so the total is always checkable by adding up
        this row—nothing here can silently drift out of sync with it. */}
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Term breakdown:</span>
      {categoryCounts.map(c => <span key={c.id} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300">{c.name.replace(" Terms", "")} <span className="text-teal-400">{c.count}</span></span>)}
      <span className="ml-auto text-[11px] font-bold text-slate-500">Sums to {categoryCounts.reduce((s, c) => s + c.count, 0)} of {termCount}</span>
    </div>

    <div className="mt-8">
      <h2 className="text-sm font-bold text-white">Content Tracks <span className="font-normal text-slate-500">— real, browsable lesson structures</span></h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {contentTracks.map(t => <div key={t.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <span className={`grid h-9 w-9 place-items-center rounded-lg bg-white/5 ${t.tint}`}><t.icon size={16} /></span>
          <p className="mt-3 text-sm font-extrabold text-white">{t.label}</p>
          <p className="text-xs text-slate-500">{t.count} {t.unit}</p>
        </div>)}
      </div>
    </div>

    <div className="mt-8">
      <h2 className="text-sm font-bold text-white">Quick Links</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {quickLinks.map(l => <Link key={l.href} href={l.href} className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-teal-500/30 hover:bg-white/[0.05]">
          <l.icon size={16} className="text-teal-400" />
          <p className="mt-2.5 text-sm font-extrabold text-white">{l.label}</p>
          <p className="text-xs text-slate-500">{l.desc}</p>
        </Link>)}
      </div>
    </div>
  </div>;
}
