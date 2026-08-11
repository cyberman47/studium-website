"use client";

import { useEffect, useState } from "react";
import { Check, Flag, X } from "lucide-react";
import { getReports, Report, ReportStatus, REPORTS_EVENT, reportTypeLabels, setReportStatus } from "@/lib/reports";

const statusFilters: ("all" | ReportStatus)[] = ["all", "open", "resolved", "dismissed"];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<"all" | ReportStatus>("open");

  function refresh() { setReports(getReports()); }
  useEffect(() => {
    refresh();
    window.addEventListener(REPORTS_EVENT, refresh);
    return () => window.removeEventListener(REPORTS_EVENT, refresh);
  }, []);

  const filtered = filter === "all" ? reports : reports.filter(r => r.status === filter);

  return <div>
    <h1 className="text-lg font-extrabold text-white">Reports & Feedback</h1>
    <p className="mt-1 text-xs text-slate-500">Real moderation inbox. There's a live "Report an issue" trigger on the Case of the Day page today (submitReport is exported so any other real surface can wire in the same action)—there's just one real reporter possible right now (this browser), since there's no multi-user backend to collect reports from other people.</p>

    <div className="mt-4 flex gap-1.5">
      {statusFilters.map(f => <button key={f} type="button" onClick={() => setFilter(f)} className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold capitalize transition ${filter === f ? "bg-teal-500/15 text-teal-300" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>{f} {f !== "all" && `(${reports.filter(r => r.status === f).length})`}</button>)}
    </div>

    <div className="mt-4 space-y-2">
      {filtered.map(r => <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-extrabold text-slate-300">{reportTypeLabels[r.type]}</span>
              {r.targetLabel && <span className="text-[11px] text-slate-500">on "{r.targetLabel}"</span>}
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${r.status === "open" ? "bg-amber-500/15 text-amber-400" : r.status === "resolved" ? "bg-teal-500/15 text-teal-400" : "bg-white/5 text-slate-500"}`}>{r.status}</span>
            </div>
            <p className="mt-1.5 text-sm text-slate-300">{r.message}</p>
            <p className="mt-1 text-[10px] text-slate-600">{new Date(r.createdAt).toLocaleString()}</p>
          </div>
          {r.status === "open" && <div className="flex shrink-0 gap-1.5">
            <button type="button" onClick={() => setReportStatus(r.id, "resolved")} className="flex cursor-pointer items-center gap-1 rounded-lg bg-teal-500/15 px-2.5 py-1.5 text-[11px] font-bold text-teal-300 hover:bg-teal-500/25"><Check size={12} />Resolve</button>
            <button type="button" onClick={() => setReportStatus(r.id, "dismissed")} className="flex cursor-pointer items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-400 hover:bg-white/10"><X size={12} />Dismiss</button>
          </div>}
        </div>
      </div>)}
      {filtered.length === 0 && <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 py-10 text-center">
        <Flag size={20} className="text-slate-600" />
        <p className="text-xs text-slate-500">No {filter !== "all" ? filter : ""} reports.</p>
      </div>}
    </div>
  </div>;
}
