"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { adminRoleDefs, AdminRole, getPreviewRole, setPreviewRole } from "@/lib/adminRoles";

export default function RolesPage() {
  const [role, setRole] = useState<AdminRole>("super-admin");

  useEffect(() => { setRole(getPreviewRole()); }, []);

  function handleSelect(id: AdminRole) {
    setPreviewRole(id);
    setRole(id);
  }

  return <div>
    <h1 className="text-lg font-extrabold text-white">Roles & Permissions</h1>

    <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
      <div>
        <p className="text-sm font-bold text-amber-300">This is a preview tool, not real access control</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">/admin has no auth server behind it—selecting a role below genuinely filters the sidebar to that role's sections (try it), but it can't stop anyone from typing an /admin/* URL directly, since there's nothing server-side to enforce a boundary with. Real RBAC needs real backend authentication, which this app doesn't have.</p>
      </div>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {adminRoleDefs.map(r => <button
        key={r.id} type="button" onClick={() => handleSelect(r.id)}
        className={`cursor-pointer rounded-xl border p-4 text-left transition ${role === r.id ? "border-teal-500/40 bg-teal-500/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-extrabold text-white">{r.label}</p>
          {role === r.id && <ShieldCheck size={16} className="text-teal-400" />}
        </div>
        <p className="mt-1 text-xs text-slate-400">{r.description}</p>
        <p className="mt-2 text-[11px] text-slate-600">{r.allowedHrefs === "all" ? "All sections" : `${r.allowedHrefs.length} sections`}</p>
      </button>)}
    </div>
  </div>;
}
