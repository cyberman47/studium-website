"use client";

import { useEffect, useState } from "react";
import {
  CURRENT_PATH_EVENT, currentPathOptions, CurrentPathId, findCurrentPathDef, getCurrentPathId, pathEmoji, setCurrentPathId
} from "@/lib/currentPath";
import { contentTracks } from "@/lib/contentTracks";

// Two genuinely different real lists, shown side by side on purpose:
// 1. Content Tracks — real browsable topic/section structures a student can
//    actually open (Medical School, MCAT, Nursing, Anatomy).
// 2. Path Identities — the 7 options in the onboarding/current-path
//    selector (lib/currentPath.ts), used to personalize copy like "Currently
//    studying MCAT Preparation." Four overlap with a real content track;
//    three (Dentistry, Pharmacy, Biomedical Sciences) plus "Other" don't yet
//    have lesson content, so selecting them just routes to the generic
//    Learning Paths page. That mismatch is real, not a bug—this page makes
//    it visible instead of hiding it behind a single misleading count.
export default function PathsPage() {
  const [currentPathId, setCurrentPathIdState] = useState<CurrentPathId | null>(null);

  function refresh() { setCurrentPathIdState(getCurrentPathId()); }
  useEffect(() => {
    refresh();
    window.addEventListener(CURRENT_PATH_EVENT, refresh);
    return () => window.removeEventListener(CURRENT_PATH_EVENT, refresh);
  }, []);

  function handleSelect(id: CurrentPathId) {
    setCurrentPathId(id);
    refresh();
  }

  const currentDef = findCurrentPathDef(currentPathId);

  return <div className="space-y-8">
    <div>
      <h1 className="text-lg font-extrabold text-white">Learning Paths</h1>
      <p className="mt-1 text-xs text-slate-500">Real content tracks plus the real path-identity selector—no fabricated counts.</p>
    </div>

    <div>
      <h2 className="text-sm font-bold text-white">Content Tracks <span className="font-normal text-slate-500">— real, browsable lesson structures</span></h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {contentTracks.map(t => <div key={t.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <span className={`grid h-9 w-9 place-items-center rounded-lg bg-white/5 ${t.tint}`}><t.icon size={16} /></span>
          <p className="mt-3 text-sm font-extrabold text-white">{t.label}</p>
          <p className="text-xs text-slate-500">{t.count} {t.unit}</p>
        </div>)}
      </div>
    </div>

    <div>
      <h2 className="text-sm font-bold text-white">Path Identities <span className="font-normal text-slate-500">— the current-path selector every student sees (Home header, Learning Paths sidebar)</span></h2>
      <p className="mt-1 text-xs text-slate-500">Selecting one here genuinely writes to this browser's <code className="rounded bg-white/10 px-1 py-0.5">studium_current_learning_path</code> value—the same key <code className="rounded bg-white/10 px-1 py-0.5">LearningPathSwitcher</code> writes—so you can preview exactly what a student with that path selected would see.</p>
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5">Path</th>
              <th className="px-4 py-2.5">Has Real Content</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPathOptions.map(p => {
              const hasContent = contentTracks.some(t => t.id === p.id);
              const isCurrent = currentPathId === p.id;
              return <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white">{pathEmoji[p.id]} {p.label}</td>
                <td className="px-4 py-3">
                  <span className={`flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${hasContent ? "bg-teal-500/15 text-teal-400" : "bg-white/5 text-slate-500"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${hasContent ? "bg-teal-400" : "bg-slate-500"}`} />{hasContent ? "Yes" : "Not yet"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleSelect(p.id)}
                    disabled={isCurrent}
                    className="cursor-pointer rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300 transition hover:border-teal-500/40 hover:text-teal-300 disabled:cursor-default disabled:opacity-30"
                  >{isCurrent ? "Current" : "Set as current"}</button>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      {currentDef && <p className="mt-3 text-xs text-slate-500">This browser is currently set to <span className="font-bold text-slate-300">{pathEmoji[currentPathId!]} {currentDef.label}</span>—visit <a href="/dashboard" className="text-teal-400 underline underline-offset-2">Home</a> to see it reflected live.</p>}
    </div>
  </div>;
}
