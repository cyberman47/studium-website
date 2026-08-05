import type { SectionDef } from "./mcatPath";

// Nursing is organized into core program topics, taught with a nursing-specific
// focus distinct from the Medical School path. Navigation shell for now—real,
// standard subject names, no lessons written yet.

export const nursingTopics: SectionDef[] = [
  {
    id: "foundations",
    title: "Foundations of Nursing",
    shortTitle: "Foundations of Nursing",
    subjects: [
      { id: "nursing-process", name: "Nursing Process", lessons: [] },
      { id: "nursing-theory-ethics", name: "Nursing Theory & Ethics", lessons: [] },
      { id: "vital-signs", name: "Vital Signs", lessons: [] },
      { id: "infection-control", name: "Infection Control", lessons: [] },
      { id: "patient-safety", name: "Patient Safety", lessons: [] }
    ]
  },
  {
    id: "anatomy-physiology",
    title: "Anatomy & Physiology",
    shortTitle: "Anatomy & Physiology",
    subjects: [
      { id: "cardiovascular-system", name: "Cardiovascular System", lessons: [] },
      { id: "respiratory-system", name: "Respiratory System", lessons: [] },
      { id: "musculoskeletal-system", name: "Musculoskeletal System", lessons: [] },
      { id: "nervous-system", name: "Nervous System", lessons: [] },
      { id: "renal-fluid-balance", name: "Renal & Fluid Balance", lessons: [] }
    ]
  },
  {
    id: "pharmacology",
    title: "Pharmacology",
    shortTitle: "Pharmacology",
    subjects: [
      { id: "medication-administration", name: "Medication Administration", lessons: [] },
      { id: "dosage-calculations", name: "Dosage Calculations", lessons: [] },
      { id: "drug-classifications", name: "Drug Classifications", lessons: [] },
      { id: "adverse-reactions-interactions", name: "Adverse Reactions & Interactions", lessons: [] }
    ]
  },
  {
    id: "health-assessment",
    title: "Health Assessment",
    shortTitle: "Health Assessment",
    subjects: [
      { id: "health-history", name: "Health History", lessons: [] },
      { id: "head-to-toe-assessment", name: "Head-to-Toe Assessment", lessons: [] },
      { id: "cardio-respiratory-assessment", name: "Cardiovascular & Respiratory Assessment", lessons: [] },
      { id: "neurological-assessment", name: "Neurological Assessment", lessons: [] }
    ]
  },
  {
    id: "medical-surgical",
    title: "Medical-Surgical Nursing",
    shortTitle: "Medical-Surgical Nursing",
    subjects: [
      { id: "perioperative-care", name: "Perioperative Care", lessons: [] },
      { id: "cardiovascular-disorders", name: "Cardiovascular Disorders", lessons: [] },
      { id: "respiratory-disorders", name: "Respiratory Disorders", lessons: [] },
      { id: "endocrine-disorders", name: "Endocrine Disorders", lessons: [] },
      { id: "oncology-nursing", name: "Oncology Nursing", lessons: [] }
    ]
  },
  {
    id: "maternal-child",
    title: "Maternal & Child Nursing",
    shortTitle: "Maternal & Child Nursing",
    subjects: [
      { id: "prenatal-care", name: "Prenatal Care", lessons: [] },
      { id: "labor-delivery", name: "Labor & Delivery", lessons: [] },
      { id: "postpartum-care", name: "Postpartum Care", lessons: [] },
      { id: "newborn-care", name: "Newborn Care", lessons: [] },
      { id: "pediatric-nursing", name: "Pediatric Nursing", lessons: [] }
    ]
  },
  {
    id: "mental-health",
    title: "Mental Health Nursing",
    shortTitle: "Mental Health Nursing",
    subjects: [
      { id: "therapeutic-communication", name: "Therapeutic Communication", lessons: [] },
      { id: "mood-anxiety-disorders", name: "Mood & Anxiety Disorders", lessons: [] },
      { id: "psychotic-disorders", name: "Psychotic Disorders", lessons: [] },
      { id: "substance-use-disorders", name: "Substance Use Disorders", lessons: [] },
      { id: "crisis-intervention", name: "Crisis Intervention", lessons: [] }
    ]
  },
  {
    id: "geriatric",
    title: "Geriatric Nursing",
    shortTitle: "Geriatric Nursing",
    subjects: [
      { id: "aging-physiology", name: "Aging Physiology", lessons: [] },
      { id: "geriatric-syndromes", name: "Common Geriatric Syndromes", lessons: [] },
      { id: "dementia-cognitive-decline", name: "Dementia & Cognitive Decline", lessons: [] },
      { id: "end-of-life-care", name: "End-of-Life Care", lessons: [] }
    ]
  },
  {
    id: "emergency-critical-care",
    title: "Emergency & Critical Care",
    shortTitle: "Emergency & Critical Care",
    subjects: [
      { id: "triage", name: "Triage", lessons: [] },
      { id: "shock-resuscitation", name: "Shock & Resuscitation", lessons: [] },
      { id: "icu-monitoring", name: "ICU Monitoring", lessons: [] },
      { id: "trauma-care", name: "Trauma Care", lessons: [] }
    ]
  },
  {
    id: "clinical-skills",
    title: "Clinical Skills",
    shortTitle: "Clinical Skills",
    subjects: [
      { id: "iv-therapy", name: "IV Therapy", lessons: [] },
      { id: "wound-care", name: "Wound Care", lessons: [] },
      { id: "catheterization", name: "Catheterization", lessons: [] },
      { id: "specimen-collection", name: "Specimen Collection", lessons: [] },
      { id: "documentation", name: "Documentation", lessons: [] }
    ]
  },
  {
    id: "nclex-preparation",
    title: "NCLEX Preparation",
    shortTitle: "NCLEX Preparation",
    subjects: [
      { id: "test-taking-strategies", name: "Test-Taking Strategies", lessons: [] },
      { id: "prioritization-delegation", name: "Prioritization & Delegation", lessons: [] },
      { id: "practice-question-banks", name: "Practice Question Banks", lessons: [] },
      { id: "nclex-content-review", name: "NCLEX Content Review", lessons: [] }
    ]
  }
];

export function findNursingTopic(topicId: string): SectionDef | undefined {
  return nursingTopics.find(t => t.id === topicId);
}
