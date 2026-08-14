// The Progress page's aggregation layer—turns real signals already tracked
// elsewhere (lib/studyPlanner.ts's per-subject mastery/accuracy/confidence,
// lib/progress.ts's KP history, lib/mcatConcepts.ts's readiness blend,
// lib/currentPath.ts's stated path) into the shapes "Your Medical Profile,"
// "Your Learning Profile," "Strengths & Weaknesses," and "Medical Journey"
// actually need. Nothing here re-derives real data a lib already computes,
// and nothing here invents a number that isn't backed by something the
// student has actually done—every function is written to degrade to "no
// data yet" rather than a fabricated placeholder.

import { getAllSubjectSignals, getMasteryStatus, getSubjectMasteryScore, MasteryStatus, practiceHref, SubjectSignals } from "./studyPlanner";
import { getMcatReadiness } from "./mcatConcepts";
import { getOverallAccuracy } from "./practiceHistory";
import { getKPGrowthSeries, getTotalKP } from "./progress";
import { CurrentPathId, findCurrentPathDef, getCurrentPathId, pathEmoji } from "./currentPath";
import { mcatSections } from "./mcatPath";

// Purely decorative per-subject glyphs for the real MCAT subject taxonomy—
// no bearing on the mastery math, just a visual identity per subject id.
const subjectEmoji: Record<string, string> = {
  biology: "🧬",
  "cell-biology": "🔬",
  "genetics-molecular-biology": "🧫",
  biochemistry: "⚗️",
  "organ-systems": "🫀",
  "evolution-ecology": "🌱",
  "general-chemistry": "🧪",
  "organic-chemistry": "💠",
  physics: "⚛️",
  psychology: "🧠",
  "social-psychology": "👥",
  sociology: "🏛️",
  "biological-bases": "🧠",
  "cars-skills": "📖"
};

export type SubjectMastery = {
  subjectId: string;
  subjectName: string;
  sectionId: string;
  sectionTitle: string;
  emoji: string;
  score: number;
  status: MasteryStatus;
  hasData: boolean;
  href: string;
};

function toSubjectMastery(s: SubjectSignals): SubjectMastery {
  return {
    subjectId: s.subject.subjectId,
    subjectName: s.subject.subjectName,
    sectionId: s.subject.sectionId,
    sectionTitle: s.subject.sectionTitle,
    emoji: subjectEmoji[s.subject.subjectId] ?? "🩺",
    score: s.masteryScore,
    status: s.masteryStatus,
    hasData: s.masteryStatus !== "Unfamiliar",
    href: practiceHref(s.subject)
  };
}

// ---- Current path → honest "journey" framing ----
// The spec's example ("Pre-med → Medicine") is only literally true for a
// student on the MCAT path—every other real path in lib/currentPath.ts gets
// its own honest two-stage framing instead of the same borrowed phrase.
const journeyLabels: Record<CurrentPathId, string> = {
  mcat: "Pre-Med → Medical School",
  "medical-school": "Medical School → Residency",
  nursing: "Nursing Student → Registered Nurse",
  pharmacy: "Pharmacy Student → Pharmacist",
  dentistry: "Dental Student → Dentist",
  "biomedical-sciences": "Biomedical Sciences → Research & Clinical Practice",
  other: "Your Learning Journey"
};

export function getCurrentPathLabel(): string {
  const id = getCurrentPathId();
  if (!id) return "Your Learning Journey";
  return journeyLabels[id] ?? findCurrentPathDef(id)?.label ?? "Your Learning Journey";
}

export function getCurrentPathEmoji(): string {
  const id = getCurrentPathId();
  return id ? pathEmoji[id] : "🗺️";
}

// ---- Learning consistency ----
// % of the trailing window's real days that had any real KP-earning
// activity—reuses the same daily-activity store the KP Growth chart reads,
// no separate consistency counter.
export function getLearningConsistencyPercent(windowDays: number = 14): number {
  const series = getKPGrowthSeries(windowDays);
  const activeDays = series.filter(p => p.kp > 0).length;
  return Math.round((activeDays / windowDays) * 100);
}

// ---- Your Medical Profile ----

export type MedicalProfile = {
  subjects: SubjectMastery[]; // every real subject, sorted strongest-first (undated ones last)
  subjectsMasteredCount: number;
  strongestSubject: SubjectMastery | null;
  weakestSubject: SubjectMastery | null;
  learningConsistencyPercent: number;
  questionAccuracyPercent: number | null;
  questionsAnswered: number;
  totalKP: number;
  currentPathLabel: string;
  currentPathEmoji: string;
  overallKnowledgeDevelopmentPercent: number;
  hasAnyRealData: boolean;
};

export function getMedicalProfile(): MedicalProfile {
  const signals = getAllSubjectSignals();
  const allSubjects = signals.map(toSubjectMastery).sort((a, b) => (b.hasData ? b.score : -1) - (a.hasData ? a.score : -1));
  const withData = allSubjects.filter(s => s.hasData);
  const readiness = getMcatReadiness();
  const accuracy = getOverallAccuracy();

  return {
    subjects: allSubjects,
    subjectsMasteredCount: allSubjects.filter(s => s.status === "Mastered").length,
    strongestSubject: withData[0] ?? null,
    // Only call out a "weakest" once there are 2+ real subjects with data to
    // contrast—with just one, it's also the strongest, and labeling it
    // "needs work" would contradict the strength callout right next to it.
    weakestSubject: withData.length >= 2 ? withData[withData.length - 1] : null,
    learningConsistencyPercent: getLearningConsistencyPercent(14),
    questionAccuracyPercent: accuracy.total > 0 ? accuracy.percent : null,
    questionsAnswered: accuracy.total,
    totalKP: getTotalKP(),
    currentPathLabel: getCurrentPathLabel(),
    currentPathEmoji: getCurrentPathEmoji(),
    overallKnowledgeDevelopmentPercent: readiness.readinessPercent,
    hasAnyRealData: withData.length > 0
  };
}

// ---- Strengths & Weaknesses ----

export type StrengthsWeaknesses = {
  strengths: SubjectMastery[]; // top 3 by mastery score, real data only
  weaknesses: SubjectMastery[]; // bottom 3 by mastery score, real data only
  recommendation: { subjectName: string; message: string; href: string } | null;
};

export function getStrengthsWeaknesses(): StrengthsWeaknesses {
  const withData = getAllSubjectSignals().filter(s => s.masteryStatus !== "Unfamiliar");
  const byScoreDesc = [...withData].sort((a, b) => b.masteryScore - a.masteryScore);
  const byScoreAsc = [...withData].sort((a, b) => a.masteryScore - b.masteryScore);

  // Weaknesses (and the recommendation built from them) need at least 2 real
  // subjects with data—with only one, it's the same subject as the top
  // strength, and calling it out as something to fix would contradict
  // praising it a moment earlier.
  const hasContrast = withData.length >= 2;
  const weakest = hasContrast ? byScoreAsc[0] : null;
  const recommendation = weakest ? {
    subjectName: weakest.subject.subjectName,
    message: `Spend your next 3 study sessions strengthening ${weakest.subject.subjectName}.`,
    href: practiceHref(weakest.subject)
  } : null;

  return {
    strengths: byScoreDesc.slice(0, 3).map(toSubjectMastery),
    weaknesses: hasContrast ? byScoreAsc.slice(0, 3).map(toSubjectMastery) : [],
    recommendation
  };
}

// ---- Medical Journey ----
// The spec's example categories (Anatomy/Pharmacology/Neuroscience/Clinical
// Reasoning) don't correspond to Studium's real authored curriculum, which
// is MCAT-only—these are the app's real 4 foundational sections instead,
// each blended from real per-subject completion + accuracy, weighted by
// lesson count so a section isn't skewed by one small subject.

export type JourneySection = { sectionId: string; sectionTitle: string; percent: number };

export function getMedicalJourneySections(): JourneySection[] {
  const signals = getAllSubjectSignals();
  return mcatSections.map(section => {
    const inSection = signals.filter(s => s.subject.sectionId === section.id);
    if (inSection.length === 0) return { sectionId: section.id, sectionTitle: section.shortTitle, percent: 0 };
    const totalLessons = inSection.reduce((sum, s) => sum + s.lessonsTotal, 0) || 1;
    const weightedScore = inSection.reduce((sum, s) => sum + s.masteryScore * s.lessonsTotal, 0);
    return { sectionId: section.id, sectionTitle: section.shortTitle, percent: Math.round(weightedScore / totalLessons) };
  });
}

// ---- Your Learning Profile ----
// Every insight below is gated behind its own real-data threshold—an
// insight simply doesn't appear until there's enough behavior to honestly
// support it, per the spec's "should evolve as the student uses Studium
// more." Nothing here is a hard-coded description; every sentence is built
// from a real number computed above or in lib/studyPlanner.ts.

export type LearningInsight = { emoji: string; title: string; description: string };

export function getLearningProfileInsights(): LearningInsight[] {
  const insights: LearningInsight[] = [];
  const signals = getAllSubjectSignals();
  const accuracy = getOverallAccuracy();

  const last7 = getKPGrowthSeries(7);
  const activeLast7 = last7.filter(p => p.kp > 0).length;
  if (activeLast7 >= 3) {
    insights.push({ emoji: "🔥", title: "Consistent Learner", description: `You've studied ${activeLast7} of the last 7 days.` });
  }

  if (accuracy.total >= 5) {
    if (accuracy.percent >= 80) insights.push({ emoji: "🎯", title: "Strong Recall", description: `Your current question accuracy is ${accuracy.percent}%.` });
    else if (accuracy.percent < 55) insights.push({ emoji: "🧮", title: "Building Accuracy", description: `Your current question accuracy is ${accuracy.percent}%—targeted practice on your weaker subjects will move this fast.` });
  }

  for (const s of signals) {
    if (s.trend === "improving") {
      insights.push({ emoji: "📈", title: `Improving in ${s.subject.subjectName}`, description: `Your ${s.subject.subjectName} accuracy has been trending up over the last week.` });
    }
  }

  const underratesSelf = signals.find(s => s.quadrant.label === "lacksConfidence");
  if (underratesSelf) {
    insights.push({ emoji: "💡", title: "You Know More Than You Think", description: `You're performing well in ${underratesSelf.subject.subjectName} despite rating your confidence low there.` });
  }

  const sectionsWithData = new Set(signals.filter(s => s.masteryStatus !== "Unfamiliar").map(s => s.subject.sectionId));
  if (sectionsWithData.size >= 3) {
    insights.push({ emoji: "🧭", title: "Well-Rounded Learner", description: `You're building real knowledge across ${sectionsWithData.size} of the MCAT's 4 foundational sections.` });
  }

  if (accuracy.total >= 50) {
    insights.push({ emoji: "📚", title: "Deep Practice", description: `You've answered ${accuracy.total} practice questions so far.` });
  }

  return insights.slice(0, 6);
}

// ---- Evolving Student Insights ----
// A single, higher-bar "New Insight" callout—only appears once there's
// real volume behind it, per the spec's "only when there is enough
// behavioral data to support them."

export type EvolvingInsight = { description: string } | null;

const EVOLVING_INSIGHT_MIN_ATTEMPTS = 20;

export function getEvolvingInsight(): EvolvingInsight {
  const accuracy = getOverallAccuracy();
  if (accuracy.total < EVOLVING_INSIGHT_MIN_ATTEMPTS) return null;
  const withEnoughData = getAllSubjectSignals().filter(s => s.accuracy.total >= 5 && s.accuracy.percent !== null);
  if (withEnoughData.length === 0) return null;
  const best = [...withEnoughData].sort((a, b) => (b.accuracy.percent ?? 0) - (a.accuracy.percent ?? 0))[0];
  return {
    description: `You've answered ${accuracy.total}+ practice questions, and your strongest performance comes from ${best.subject.subjectName} (${best.accuracy.percent}% accuracy).`
  };
}
