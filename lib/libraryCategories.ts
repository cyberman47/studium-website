import {
  Bookmark, BookOpenCheck, Brain, Film, FileText, HelpCircle, Image as ImageIcon, Star, Stethoscope
} from "lucide-react";

export type LibraryCategory = {
  id: string;
  name: string;
  description: string;
  icon: typeof Bookmark;
  color: string;
};

export const libraryCategories: LibraryCategory[] = [
  { id: "saved", name: "Saved", description: "Everything you've bookmarked or saved for later.", icon: Bookmark, color: "bg-teal-100 text-teal-700" },
  { id: "articles", name: "Articles", description: "High-quality study articles organized by subject.", icon: FileText, color: "bg-sky-100 text-sky-600" },
  { id: "flashcards", name: "Flashcards", description: "Official Studium decks, community decks, and your own collections.", icon: Brain, color: "bg-indigo-100 text-indigo-600" },
  { id: "quizzes", name: "Quizzes", description: "Practice questions, topic quizzes, and full mock exams.", icon: HelpCircle, color: "bg-amber-100 text-amber-600" },
  { id: "clinical-cases", name: "Clinical Cases", description: "Interactive patient scenarios and case-based learning.", icon: Stethoscope, color: "bg-rose-100 text-rose-600" },
  { id: "study-guides", name: "Study Guides", description: "High-yield review sheets, cheat sheets, and exam summaries.", icon: BookOpenCheck, color: "bg-emerald-100 text-emerald-600" },
  { id: "diagrams", name: "Diagrams & Illustrations", description: "Anatomy, physiology, pathways, labeled images, and visual references.", icon: ImageIcon, color: "bg-violet-100 text-violet-600" },
  { id: "animations", name: "Animations", description: "Short educational animations explaining complex concepts.", icon: Film, color: "bg-pink-100 text-pink-600" },
  { id: "community", name: "Community", description: "Browse and discover notes, flashcards, quizzes, and study resources shared by other users.", icon: Star, color: "bg-lime-100 text-lime-700" }
];

export function findLibraryCategory(id: string): LibraryCategory | undefined {
  return libraryCategories.find(c => c.id === id);
}
