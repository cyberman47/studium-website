// Real feedback/moderation inbox. Reports genuinely persist to localStorage
// and the admin inbox genuinely reads/resolves them—there's just one real
// "reporter" possible today (this browser), since there's no multi-user
// backend to collect reports from other people. The submit function is
// exported so any real student-facing surface (a term panel, a case view)
// can wire in a "Report an issue" action for real.

export type ReportType = "definition" | "anatomy-label" | "ai-mistake" | "feedback" | "bug";
export type ReportStatus = "open" | "resolved" | "dismissed";

export type Report = {
  id: string;
  type: ReportType;
  targetType?: "term" | "case";
  targetId?: string;
  targetLabel?: string;
  message: string;
  status: ReportStatus;
  createdAt: string;
};

const REPORTS_KEY = "studium_reports";
export const REPORTS_EVENT = "studium:reportsChange";

function readReports(): Report[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(REPORTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeReports(list: Report[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(REPORTS_EVENT));
}

export function getReports(): Report[] {
  return readReports().slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function submitReport(input: { type: ReportType; targetType?: "term" | "case"; targetId?: string; targetLabel?: string; message: string }): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.message.trim()) return { ok: false, error: "Please describe the issue." };
  const report: Report = { ...input, id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, status: "open", createdAt: new Date().toISOString() };
  writeReports([...readReports(), report]);
  return { ok: true };
}

export function setReportStatus(id: string, status: ReportStatus) {
  writeReports(readReports().map(r => r.id === id ? { ...r, status } : r));
}

export const reportTypeLabels: Record<ReportType, string> = {
  definition: "Incorrect definition",
  "anatomy-label": "Wrong anatomy label",
  "ai-mistake": "AI mistake",
  feedback: "General feedback",
  bug: "Bug report"
};
