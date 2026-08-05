import type { SectionDef } from "./mcatPath";

// Medical School is organized into core course topics. "Anatomy" links out to the
// standalone Anatomy path instead of duplicating it. The rest are a navigation
// shell—real, standard subject names, but no lessons written yet.

export type MedicalSchoolTopic = SectionDef & { externalHref?: string };

export const medicalSchoolTopics: MedicalSchoolTopic[] = [
  { id: "anatomy", title: "Anatomy", shortTitle: "Anatomy", externalHref: "/dashboard/learning-paths/anatomy", subjects: [] },
  {
    id: "physiology",
    title: "Physiology",
    shortTitle: "Physiology",
    subjects: [
      { id: "cardiovascular-physiology", name: "Cardiovascular Physiology", lessons: [] },
      { id: "respiratory-physiology", name: "Respiratory Physiology", lessons: [] },
      { id: "renal-physiology", name: "Renal Physiology", lessons: [] },
      { id: "endocrine-physiology", name: "Endocrine Physiology", lessons: [] },
      { id: "neurophysiology", name: "Neurophysiology", lessons: [] },
      { id: "gi-physiology", name: "Gastrointestinal Physiology", lessons: [] }
    ]
  },
  {
    id: "pathology",
    title: "Pathology",
    shortTitle: "Pathology",
    subjects: [
      { id: "cell-injury-death", name: "Cell Injury & Death", lessons: [] },
      { id: "inflammation-repair", name: "Inflammation & Repair", lessons: [] },
      { id: "neoplasia", name: "Neoplasia", lessons: [] },
      { id: "systemic-pathology", name: "Systemic Pathology", lessons: [] }
    ]
  },
  {
    id: "pharmacology",
    title: "Pharmacology",
    shortTitle: "Pharmacology",
    subjects: [
      { id: "pharmacokinetics", name: "Pharmacokinetics", lessons: [] },
      { id: "pharmacodynamics", name: "Pharmacodynamics", lessons: [] },
      { id: "autonomic-pharmacology", name: "Autonomic Pharmacology", lessons: [] },
      { id: "cardiovascular-drugs", name: "Cardiovascular Drugs", lessons: [] },
      { id: "antimicrobial-agents", name: "Antimicrobial Agents", lessons: [] }
    ]
  },
  {
    id: "microbiology",
    title: "Microbiology",
    shortTitle: "Microbiology",
    subjects: [
      { id: "bacteriology", name: "Bacteriology", lessons: [] },
      { id: "virology", name: "Virology", lessons: [] },
      { id: "mycology", name: "Mycology", lessons: [] },
      { id: "parasitology", name: "Parasitology", lessons: [] },
      { id: "clinical-microbiology", name: "Clinical Microbiology", lessons: [] }
    ]
  },
  {
    id: "immunology",
    title: "Immunology",
    shortTitle: "Immunology",
    subjects: [
      { id: "innate-immunity", name: "Innate Immunity", lessons: [] },
      { id: "adaptive-immunity", name: "Adaptive Immunity", lessons: [] },
      { id: "hypersensitivity-reactions", name: "Hypersensitivity Reactions", lessons: [] },
      { id: "immunodeficiency-autoimmunity", name: "Immunodeficiency & Autoimmunity", lessons: [] }
    ]
  },
  {
    id: "biochemistry",
    title: "Biochemistry",
    shortTitle: "Biochemistry",
    subjects: [
      { id: "metabolism-bioenergetics", name: "Metabolism & Bioenergetics", lessons: [] },
      { id: "enzymes-kinetics", name: "Enzymes & Kinetics", lessons: [] },
      { id: "molecular-biology-biochem", name: "Molecular Biology", lessons: [] },
      { id: "nutritional-biochemistry", name: "Nutritional Biochemistry", lessons: [] }
    ]
  },
  {
    id: "clinical-medicine",
    title: "Clinical Medicine",
    shortTitle: "Clinical Medicine",
    subjects: [
      { id: "cardiology", name: "Cardiology", lessons: [] },
      { id: "pulmonology", name: "Pulmonology", lessons: [] },
      { id: "gastroenterology", name: "Gastroenterology", lessons: [] },
      { id: "endocrinology", name: "Endocrinology", lessons: [] },
      { id: "nephrology", name: "Nephrology", lessons: [] },
      { id: "neurology", name: "Neurology", lessons: [] }
    ]
  },
  {
    id: "clinical-skills",
    title: "Clinical Skills",
    shortTitle: "Clinical Skills",
    subjects: [
      { id: "history-taking", name: "History Taking", lessons: [] },
      { id: "physical-examination", name: "Physical Examination", lessons: [] },
      { id: "clinical-reasoning", name: "Clinical Reasoning", lessons: [] },
      { id: "communication-skills", name: "Communication Skills", lessons: [] },
      { id: "procedural-skills", name: "Procedural Skills", lessons: [] }
    ]
  }
];

export function findMedicalSchoolTopic(topicId: string): MedicalSchoolTopic | undefined {
  return medicalSchoolTopics.find(t => t.id === topicId);
}
