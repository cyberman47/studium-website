import type { SectionDef } from "./mcatPath";

// Pharmacology organized by drug class/system, the standard way pharm
// courses and board review split the subject—distinct from the smaller
// "Pharmacology" subject nested inside the Nursing path (medication
// administration/dosage focus). This is currently a navigation shell: every
// topic and subject name is real, but no lessons have been written yet, same
// convention as Nursing/Anatomy.

export const pharmacologyTopics: SectionDef[] = [
  {
    id: "general-principles",
    title: "General Principles",
    shortTitle: "General Principles",
    subjects: [
      { id: "pharmacokinetics", name: "Pharmacokinetics", lessons: [] },
      { id: "pharmacodynamics", name: "Pharmacodynamics", lessons: [] },
      { id: "drug-metabolism", name: "Drug Metabolism & Elimination", lessons: [] },
      { id: "routes-of-administration", name: "Routes of Administration", lessons: [] }
    ]
  },
  {
    id: "autonomic-cns",
    title: "Autonomic & CNS Drugs",
    shortTitle: "Autonomic & CNS",
    subjects: [
      { id: "cholinergics-anticholinergics", name: "Cholinergics & Anticholinergics", lessons: [] },
      { id: "adrenergics", name: "Adrenergic Agonists & Antagonists", lessons: [] },
      { id: "anesthetics", name: "General & Local Anesthetics", lessons: [] },
      { id: "antipsychotics-antidepressants", name: "Antipsychotics & Antidepressants", lessons: [] },
      { id: "anticonvulsants", name: "Anticonvulsants", lessons: [] }
    ]
  },
  {
    id: "cardiovascular-drugs",
    title: "Cardiovascular Drugs",
    shortTitle: "Cardiovascular",
    subjects: [
      { id: "antihypertensives", name: "Antihypertensives", lessons: [] },
      { id: "antiarrhythmics", name: "Antiarrhythmics", lessons: [] },
      { id: "anticoagulants-antiplatelets", name: "Anticoagulants & Antiplatelets", lessons: [] },
      { id: "lipid-lowering-agents", name: "Lipid-Lowering Agents", lessons: [] },
      { id: "diuretics", name: "Diuretics", lessons: [] }
    ]
  },
  {
    id: "antimicrobials",
    title: "Antimicrobials",
    shortTitle: "Antimicrobials",
    subjects: [
      { id: "antibiotics", name: "Antibiotics", lessons: [] },
      { id: "antivirals", name: "Antivirals", lessons: [] },
      { id: "antifungals", name: "Antifungals", lessons: [] },
      { id: "antiparasitics", name: "Antiparasitics", lessons: [] }
    ]
  },
  {
    id: "endocrine-metabolic",
    title: "Endocrine & Metabolic Drugs",
    shortTitle: "Endocrine & Metabolic",
    subjects: [
      { id: "insulin-diabetes-agents", name: "Insulin & Diabetes Agents", lessons: [] },
      { id: "thyroid-drugs", name: "Thyroid Drugs", lessons: [] },
      { id: "corticosteroids", name: "Corticosteroids", lessons: [] },
      { id: "reproductive-hormones", name: "Reproductive Hormones", lessons: [] }
    ]
  },
  {
    id: "respiratory-gi",
    title: "Respiratory & GI Drugs",
    shortTitle: "Respiratory & GI",
    subjects: [
      { id: "bronchodilators", name: "Bronchodilators", lessons: [] },
      { id: "antihistamines", name: "Antihistamines", lessons: [] },
      { id: "antacids-ppis", name: "Antacids & PPIs", lessons: [] },
      { id: "antiemetics-laxatives", name: "Antiemetics & Laxatives", lessons: [] }
    ]
  },
  {
    id: "oncology-immunology",
    title: "Oncology & Immunology Drugs",
    shortTitle: "Oncology & Immunology",
    subjects: [
      { id: "chemotherapy-agents", name: "Chemotherapy Agents", lessons: [] },
      { id: "immunosuppressants", name: "Immunosuppressants", lessons: [] },
      { id: "biologics", name: "Biologics", lessons: [] }
    ]
  },
  {
    id: "toxicology",
    title: "Toxicology & Drug Interactions",
    shortTitle: "Toxicology",
    subjects: [
      { id: "overdose-antidotes", name: "Overdose & Antidotes", lessons: [] },
      { id: "drug-drug-interactions", name: "Drug-Drug Interactions", lessons: [] },
      { id: "adverse-drug-reactions", name: "Adverse Drug Reactions", lessons: [] }
    ]
  }
];

export function findPharmacologyTopic(topicId: string): SectionDef | undefined {
  return pharmacologyTopics.find(t => t.id === topicId);
}
