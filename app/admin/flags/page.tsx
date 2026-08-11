"use client";

import { useEffect, useState } from "react";
import { GitCommit, ToggleLeft, ToggleRight } from "lucide-react";
import { APP_VERSION, FEATURE_FLAGS_EVENT, FeatureFlagDef, getAllFlags, setFlagEnabled } from "@/lib/featureFlags";

export default function FlagsPage() {
  const [flags, setFlags] = useState<(FeatureFlagDef & { enabled: boolean })[]>([]);

  function refresh() { setFlags(getAllFlags()); }
  useEffect(() => {
    refresh();
    window.addEventListener(FEATURE_FLAGS_EVENT, refresh);
    return () => window.removeEventListener(FEATURE_FLAGS_EVENT, refresh);
  }, []);

  return <div>
    <h1 className="text-lg font-extrabold text-white">Feature Management</h1>
    <p className="mt-1 text-xs text-slate-500">Real flags—toggling one here genuinely changes what this browser's UI renders wherever it's wired in (see each flag's note below). No remote config server exists, so this can't gate a build or a server response, only this browser's client state.</p>

    <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><GitCommit size={13} className="text-slate-500" />App Version</div>
      <p className="mt-1.5 text-lg font-extrabold text-white">v{APP_VERSION}</p>
      <p className="mt-1 text-[11px] text-slate-500">Read-only—there's no deploy pipeline here to "control" a release against.</p>
    </div>

    <div className="mt-5 space-y-2">
      {flags.map(f => <div key={f.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-white">{f.label}</p>
          <p className="mt-0.5 text-xs text-slate-400">{f.description}</p>
          <p className="mt-1 text-[11px] text-slate-600">Wired into: {f.wiredInto}</p>
        </div>
        <button type="button" onClick={() => setFlagEnabled(f.id, !f.enabled)} className={`shrink-0 cursor-pointer transition ${f.enabled ? "text-teal-400" : "text-slate-600"}`}>
          {f.enabled ? <ToggleRight size={30} /> : <ToggleLeft size={30} />}
        </button>
      </div>)}
    </div>
  </div>;
}
