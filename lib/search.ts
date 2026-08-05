// Global Cmd+K search. Purely client-side—there's no backend index—so it searches
// across the real, already-built content that exists in this demo: terminology
// terms, MCAT lessons, library categories, and the app's own nav destinations.

import { terms } from "./terminology";
import { lessonContentMap } from "./mcatPath";
import { libraryCategories } from "./libraryCategories";

export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  group: "Go to" | "Terminology" | "MCAT Lessons" | "Library";
  href: string;
};

const navShortcuts: SearchResult[] = [
  { id: "nav-home", title: "Home", subtitle: "Your dashboard", group: "Go to", href: "/dashboard" },
  { id: "nav-paths", title: "Learning Paths", subtitle: "Medical School, MCAT, Nursing & more", group: "Go to", href: "/dashboard/learning-paths" },
  { id: "nav-library", title: "Library", subtitle: "Everything to study, in one place", group: "Go to", href: "/dashboard/library" },
  { id: "nav-create", title: "Create", subtitle: "Turn your notes into lessons and flashcards", group: "Go to", href: "/dashboard/create" },
  { id: "nav-terminology", title: "Terminology", subtitle: "Learn and review medical terms", group: "Go to", href: "/dashboard/terminology" },
  { id: "nav-ai", title: "Studium AI", subtitle: "Ask your AI tutor", group: "Go to", href: "/dashboard/ai-tutor" },
  { id: "nav-flashcards", title: "Flashcards", subtitle: "Spaced-repetition review", group: "Go to", href: "/dashboard/flashcards" },
  { id: "nav-progress", title: "Progress", subtitle: "Streak, Knowledge Points, achievements", group: "Go to", href: "/dashboard/progress" }
];

const termResults: SearchResult[] = terms.map(t => ({
  id: `term-${t.id}`,
  title: t.name,
  subtitle: t.definition,
  group: "Terminology",
  href: `/dashboard/terminology/${t.categoryId}/${t.id}`
}));

const lessonResults: SearchResult[] = Object.values(lessonContentMap).map(l => ({
  id: `lesson-${l.id}`,
  title: l.title,
  subtitle: `MCAT · ${l.difficulty} · ${l.estimatedMinutes} min`,
  group: "MCAT Lessons",
  href: `/dashboard/learning-paths/mcat/${l.sectionId}/${l.subjectId}/${l.id}`
}));

const libraryResults: SearchResult[] = libraryCategories.map(c => ({
  id: `library-${c.id}`,
  title: c.name,
  subtitle: c.description,
  group: "Library",
  href: `/dashboard/library/${c.id}`
}));

const searchIndex: SearchResult[] = [...navShortcuts, ...termResults, ...lessonResults, ...libraryResults];

export function getDefaultSuggestions(): SearchResult[] {
  return navShortcuts.slice(0, 6);
}

export function search(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return getDefaultSuggestions();
  return searchIndex
    .filter(r => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.title.toLowerCase().startsWith(q) ? 0 : 1;
      return aStarts - bStarts;
    })
    .slice(0, limit);
}
