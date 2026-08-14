"use client";

// The standalone "Studium AI" nav destination—general Q&A, not tied to any
// one lesson. Uses AiTutorWorkspace (components/ai-tutor-workspace.tsx), a
// full-page chat-app layout distinct from AiTutorPanel's compact docked
// sidebar (which stays as-is for the 3 in-lesson embed sites). Both share
// the same real /api/tutor pipeline (lib/tutorChat.ts). Its own chat thread
// is keyed under lessonId "general" so it doesn't mix with any lesson's
// history.
import { useMemo, useState } from "react";
import { AiTutorWorkspace } from "@/components/ai-tutor-workspace";
import { TutorContext } from "@/lib/tutorChat";
import { getLevelInfo, getTotalKP } from "@/lib/progress";
import { SectionTour } from "@/components/product-tour/SectionTour";
import { studiumAiTourSteps } from "@/lib/productTour";

export default function AiTutorPage() {
  const level = getLevelInfo(getTotalKP());
  const context: TutorContext = {
    sectionName: "General",
    subjectName: "Open Q&A",
    lessonTitle: "your studies",
    lessonId: "general",
    currentStep: "Open chat — not tied to a specific lesson",
    currentFlashcard: null,
    currentPracticeQuestion: null,
    recentMistakes: [],
    studentLevel: `Level ${level.level} · ${level.name}`
  };

  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  // The tour's own step content lives in lib/productTour.ts; the action
  // that actually sends a real preloaded prompt is attached here, since
  // only this page holds the piece of state AiTutorWorkspace watches.
  const tourSteps = useMemo(
    () => studiumAiTourSteps.map(s => ({ ...s, action: () => setPendingPrompt("Explain the scientific method in simple terms.") })),
    []
  );

  // Fills the full remaining content area below the dashboard's top header
  // (77px, measured) with a small breathing margin, rather than a narrow
  // card floating in whitespace.
  return <div className="flex flex-col py-4" style={{ height: "calc(100vh - 77px)" }}>
    <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 shadow-soft">
      <AiTutorWorkspace context={context} externalPrompt={pendingPrompt} onExternalPromptHandled={() => setPendingPrompt(null)} />
    </div>
    <SectionTour id="studium-ai" steps={tourSteps} />
  </div>;
}
