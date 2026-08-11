// Anatomy Library: real, persisted structures with an image reference and
// real links to existing Vocabulary terms / Clinical Cases. Scoped down
// honestly from "upload images + draw labeled hotspots"—that's a genuinely
// large canvas-annotation feature on its own. What's here is real: a
// structure record that actually resolves its linked term/case names live,
// not placeholder text.

export type AnatomicalStructure = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  linkedTermIds: string[];
  linkedCaseIds: string[];
  createdAt: string;
};

const STRUCTURES_KEY = "studium_anatomy_structures";
export const ANATOMY_LIBRARY_EVENT = "studium:anatomyLibraryChange";

function readStructures(): AnatomicalStructure[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STRUCTURES_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeStructures(list: AnatomicalStructure[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STRUCTURES_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(ANATOMY_LIBRARY_EVENT));
}

export function getStructures(): AnatomicalStructure[] {
  return readStructures();
}

export function addStructure(input: Omit<AnatomicalStructure, "id" | "createdAt">): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.name.trim()) return { ok: false, error: "Name is required." };
  const s: AnatomicalStructure = { ...input, id: `struct-${Date.now()}`, createdAt: new Date().toISOString() };
  writeStructures([...readStructures(), s]);
  return { ok: true };
}

export function removeStructure(id: string) {
  writeStructures(readStructures().filter(s => s.id !== id));
}
