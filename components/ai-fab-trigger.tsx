"use client";

// The one persistent way to open Studium AI, used everywhere the assistant
// is available—in-lesson pages and the fullscreen flashcard overlay alike.
// Replaces the old per-surface triggers (a header pill button, a slim
// right-edge re-open tab, a small icon button in Focus Mode's header) with
// a single floating action button so the control looks and behaves
// identically no matter which view state it's opened from.
import { useEffect } from "react";
import { Bot } from "lucide-react";

export function AiFabTrigger({
  open, onToggle, hasContext = false, contextLabel, zIndexClassName = "z-50"
}: {
  open: boolean;
  onToggle: () => void;
  /** True when a specific lesson/card is attached as context—shows a status dot + glow. */
  hasContext?: boolean;
  /** Tooltip text when context is attached, e.g. `Context: Flashcard - "Independent variable"`. */
  contextLabel?: string;
  zIndexClassName?: string;
}) {
  // Cmd/Ctrl+K toggles the drawer from anywhere this trigger is mounted—
  // kept active even while the button itself is hidden (see below), so the
  // shortcut still closes an open panel.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onToggle();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onToggle]);

  // Once the panel is open, its own header already has a real close control
  // (AiTutorPanel's collapse chevron)—showing the FAB on top too just
  // covers part of the chat (the composer, in narrower layouts) for no
  // benefit, so it steps aside entirely rather than turning into a
  // "Close AI" button.
  if (open) return null;

  return <button
    type="button"
    onClick={onToggle}
    title={contextLabel ?? "Ask Studium AI (⌘K)"}
    aria-label="Ask Studium AI"
    // Always a plain teal circle with a robot glyph—no expanding text pill
    // on wider screens—so the same unmistakably-AI icon appears identically
    // on every flashcard surface in the app, full screen or embedded.
    className={`fixed bottom-6 right-6 ${zIndexClassName} flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-teal-600 text-white shadow-xl transition-all hover:bg-teal-700 hover:shadow-2xl ${hasContext ? "ring-4 ring-teal-300/50" : ""}`}
  >
    <Bot size={24} className="shrink-0" />
    {hasContext && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />}
  </button>;
}
