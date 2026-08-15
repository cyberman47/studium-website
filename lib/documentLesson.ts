// Shared shape for the "document-style" lesson layout (Core Idea → Learn →
// Visualize/Analyze → MCAT Connection → Apply → Key Takeaway), originally
// built one-off for the Scientific Method lesson (lib/scientificMethodLesson.ts)
// and now generalized so every Biological & Biochemical Foundations lesson
// can use the same real component (components/scientific-method/scientific-method-lesson.tsx,
// exported as DocumentLesson) with its own real content plugged in as props.

export type Difficulty = "UNDERSTAND" | "IDENTIFY" | "INTERPRET" | "REASON";

export type QuickCheck = {
  prompt: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

// A concept can show at most one of these three visual treatments—each
// concept's content dictates which (if any) actually fits, same rule the
// Scientific Method lesson already followed.
export type DataTable = { caption: string; rows: { label: string; value: string }[] };
export type CorrelationExample = { relationship: string; confound: string };

export type Concept = {
  number: string;
  id: string;
  title: string;
  difficulty: Difficulty;
  coreIdea: string;
  learn: string[];
  // A generic labeled-step flow diagram (e.g. "Helicase unwinds" → "DNA
  // polymerase synthesizes" → "Two new double helices")—the same visual
  // the Scientific Method lesson used only for its own Big Picture, now
  // any concept in any lesson can attach its own.
  flowDiagram?: string[];
  // Scientific Method-specific widgets, kept as their own optional fields
  // rather than forced onto unrelated lessons.
  variableFlow?: boolean;
  correlationExample?: CorrelationExample;
  dataTable?: DataTable;
  mcatConnection: string;
  quickCheck: QuickCheck;
  keyTakeaway: string;
};

export type LessonIntro = { description: string; objectives: string[] };
export type BigPicture = { flow: readonly string[]; caption: string };

export type DocumentLessonContent = {
  lessonIntro: LessonIntro;
  bigPicture: BigPicture;
  concepts: Concept[];
};
