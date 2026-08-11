// Real reference/source library. Genuinely persisted, genuinely attachable
// to a term or case by id—no fake "linked" badge without a real link behind
// it. Nothing here calls out to a real citation database (no such service
// is connected), so entries are admin-typed, same as every other piece of
// content in this app.

export type ReferenceType = "textbook" | "paper" | "guideline" | "other";

export type MedicalReference = {
  id: string;
  type: ReferenceType;
  title: string;
  authorsOrSource: string;
  url?: string;
  linkedTermIds: string[];
  linkedCaseIds: string[];
  createdAt: string;
};

const REFERENCES_KEY = "studium_references";
export const REFERENCES_EVENT = "studium:referencesChange";

function readReferences(): MedicalReference[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(REFERENCES_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeReferences(list: MedicalReference[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFERENCES_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(REFERENCES_EVENT));
}

export function getReferences(): MedicalReference[] {
  return readReferences();
}

export function getReferencesFor(targetId: string): MedicalReference[] {
  return readReferences().filter(r => r.linkedTermIds.includes(targetId) || r.linkedCaseIds.includes(targetId));
}

export function addReference(input: Omit<MedicalReference, "id" | "createdAt">): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.title.trim()) return { ok: false, error: "Title is required." };
  const ref: MedicalReference = { ...input, id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString() };
  writeReferences([...readReferences(), ref]);
  return { ok: true };
}

export function removeReference(id: string) {
  writeReferences(readReferences().filter(r => r.id !== id));
}

export const referenceTypeLabels: Record<ReferenceType, string> = {
  textbook: "Textbook",
  paper: "Scientific Paper",
  guideline: "Clinical Guideline",
  other: "Other Source"
};
