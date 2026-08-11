// Real "Add to My Library" reference system. Unifies bookmarking official
// Studium content (lessons/articles/resources) with adding a community
// member's published lesson to your personal collection—per the product
// spec's own allowance to fold "Save" and "Add to My Library" into one
// mechanism as long as official vs. community stays visually distinct
// (that distinction lives in the content's own contentType, read back out
// wherever this is displayed).
//
// A save here is a REFERENCE (contentType + contentId), never a copy of the
// underlying content. Removing it from your library never touches the
// original—a lib/mcatPath.ts lesson stays exactly as it was, and another
// student's lib/communityLessons.ts entry keeps existing for everyone else
// who has it saved. Mirrors the isXSaved/toggleXSaved + CustomEvent
// convention already used across the app (terminology.ts, practiceHistory.ts,
// savedHighlights.ts, forum.ts) rather than inventing a new pattern.

export type LibraryContentType = "lesson" | "community-lesson" | "article" | "resource";
export type LibrarySave = { contentType: LibraryContentType; contentId: string; addedAt: string };

const KEY = "studium_library_saves";
export const LIBRARY_SAVES_EVENT = "studium:librarySavesChange";

function refKey(contentType: LibraryContentType, contentId: string): string {
  return `${contentType}:${contentId}`;
}

function readMap(): Record<string, LibrarySave> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeMap(map: Record<string, LibrarySave>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(LIBRARY_SAVES_EVENT));
}

export function getLibrarySaves(): LibrarySave[] {
  return Object.values(readMap()).sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
}

export function getLibrarySavesByType(contentType: LibraryContentType): LibrarySave[] {
  return getLibrarySaves().filter(s => s.contentType === contentType);
}

export function isInLibrary(contentType: LibraryContentType, contentId: string): boolean {
  return refKey(contentType, contentId) in readMap();
}

export function addToLibrary(contentType: LibraryContentType, contentId: string) {
  const map = readMap();
  const k = refKey(contentType, contentId);
  if (map[k]) return; // already saved—don't disturb the original addedAt or double-count elsewhere
  map[k] = { contentType, contentId, addedAt: new Date().toISOString() };
  writeMap(map);
}

export function removeFromLibrary(contentType: LibraryContentType, contentId: string) {
  const map = readMap();
  delete map[refKey(contentType, contentId)];
  writeMap(map);
}

// Returns the new saved state (true = now saved), so callers can update a
// button's label/checkmark from the return value alone.
export function toggleLibrarySave(contentType: LibraryContentType, contentId: string): boolean {
  if (isInLibrary(contentType, contentId)) {
    removeFromLibrary(contentType, contentId);
    return false;
  }
  addToLibrary(contentType, contentId);
  return true;
}

export function getLibrarySaveCount(): number {
  return Object.keys(readMap()).length;
}
