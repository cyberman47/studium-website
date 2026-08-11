import type { SectionDef } from "./mcatPath";

// USMLE content organized by the real, published organ-system outline the
// exam itself uses (Step 1/Step 2 CK share this structure)—same "real
// structure, no lessons written yet" navigation-shell convention as
// Nursing/Anatomy/Pharmacology.

export const usmleTopics: SectionDef[] = [
  {
    id: "general-principles",
    title: "General Principles",
    shortTitle: "General Principles",
    subjects: [
      { id: "biochemistry-genetics", name: "Biochemistry & Genetics", lessons: [] },
      { id: "immunology", name: "Immunology", lessons: [] },
      { id: "microbiology-pathology", name: "Microbiology & Pathology", lessons: [] },
      { id: "pharmacology-basics", name: "Pharmacology Basics", lessons: [] },
      { id: "biostatistics-epidemiology", name: "Biostatistics & Epidemiology", lessons: [] }
    ]
  },
  {
    id: "cardiovascular-system",
    title: "Cardiovascular System",
    shortTitle: "Cardiovascular",
    subjects: [
      { id: "cardiac-physiology", name: "Cardiac Physiology", lessons: [] },
      { id: "ischemic-heart-disease", name: "Ischemic Heart Disease", lessons: [] },
      { id: "heart-failure", name: "Heart Failure", lessons: [] },
      { id: "arrhythmias", name: "Arrhythmias", lessons: [] },
      { id: "valvular-disease", name: "Valvular Disease", lessons: [] }
    ]
  },
  {
    id: "respiratory-system",
    title: "Respiratory System",
    shortTitle: "Respiratory",
    subjects: [
      { id: "pulmonary-physiology", name: "Pulmonary Physiology", lessons: [] },
      { id: "obstructive-lung-disease", name: "Obstructive Lung Disease", lessons: [] },
      { id: "restrictive-lung-disease", name: "Restrictive Lung Disease", lessons: [] },
      { id: "pulmonary-vascular-disease", name: "Pulmonary Vascular Disease", lessons: [] }
    ]
  },
  {
    id: "gastrointestinal-system",
    title: "Gastrointestinal System",
    shortTitle: "Gastrointestinal",
    subjects: [
      { id: "gi-physiology", name: "GI Physiology", lessons: [] },
      { id: "hepatobiliary-disease", name: "Hepatobiliary Disease", lessons: [] },
      { id: "inflammatory-bowel-disease", name: "Inflammatory Bowel Disease", lessons: [] },
      { id: "gi-malignancies", name: "GI Malignancies", lessons: [] }
    ]
  },
  {
    id: "renal-urinary-system",
    title: "Renal & Urinary System",
    shortTitle: "Renal & Urinary",
    subjects: [
      { id: "renal-physiology", name: "Renal Physiology", lessons: [] },
      { id: "acid-base-disorders", name: "Acid-Base Disorders", lessons: [] },
      { id: "glomerular-disease", name: "Glomerular Disease", lessons: [] },
      { id: "acute-chronic-kidney-injury", name: "Acute & Chronic Kidney Injury", lessons: [] }
    ]
  },
  {
    id: "reproductive-system",
    title: "Reproductive System",
    shortTitle: "Reproductive",
    subjects: [
      { id: "reproductive-physiology", name: "Reproductive Physiology", lessons: [] },
      { id: "pregnancy-complications", name: "Pregnancy Complications", lessons: [] },
      { id: "gynecologic-disorders", name: "Gynecologic Disorders", lessons: [] },
      { id: "breast-prostate-disease", name: "Breast & Prostate Disease", lessons: [] }
    ]
  },
  {
    id: "endocrine-system",
    title: "Endocrine System",
    shortTitle: "Endocrine",
    subjects: [
      { id: "endocrine-physiology", name: "Endocrine Physiology", lessons: [] },
      { id: "diabetes-mellitus", name: "Diabetes Mellitus", lessons: [] },
      { id: "thyroid-adrenal-disorders", name: "Thyroid & Adrenal Disorders", lessons: [] },
      { id: "pituitary-disorders", name: "Pituitary Disorders", lessons: [] }
    ]
  },
  {
    id: "musculoskeletal-system",
    title: "Musculoskeletal System",
    shortTitle: "Musculoskeletal",
    subjects: [
      { id: "bone-joint-disorders", name: "Bone & Joint Disorders", lessons: [] },
      { id: "rheumatologic-disease", name: "Rheumatologic Disease", lessons: [] },
      { id: "musculoskeletal-trauma", name: "Musculoskeletal Trauma", lessons: [] }
    ]
  },
  {
    id: "nervous-system",
    title: "Nervous System & Special Senses",
    shortTitle: "Nervous System",
    subjects: [
      { id: "neuroanatomy-physiology", name: "Neuroanatomy & Physiology", lessons: [] },
      { id: "stroke-cerebrovascular-disease", name: "Stroke & Cerebrovascular Disease", lessons: [] },
      { id: "seizure-disorders", name: "Seizure Disorders", lessons: [] },
      { id: "ophthalmology-otolaryngology", name: "Ophthalmology & Otolaryngology", lessons: [] }
    ]
  },
  {
    id: "hematology-oncology",
    title: "Hematology & Oncology",
    shortTitle: "Heme/Onc",
    subjects: [
      { id: "anemias", name: "Anemias", lessons: [] },
      { id: "coagulation-disorders", name: "Coagulation Disorders", lessons: [] },
      { id: "leukemias-lymphomas", name: "Leukemias & Lymphomas", lessons: [] },
      { id: "oncologic-emergencies", name: "Oncologic Emergencies", lessons: [] }
    ]
  },
  {
    id: "behavioral-health",
    title: "Behavioral Health & Biostatistics",
    shortTitle: "Behavioral Health",
    subjects: [
      { id: "mood-anxiety-disorders", name: "Mood & Anxiety Disorders", lessons: [] },
      { id: "personality-disorders", name: "Personality Disorders", lessons: [] },
      { id: "substance-use-disorders", name: "Substance Use Disorders", lessons: [] },
      { id: "ethics-patient-safety", name: "Ethics & Patient Safety", lessons: [] }
    ]
  },
  {
    id: "multisystem-processes",
    title: "Multisystem Processes & Disorders",
    shortTitle: "Multisystem",
    subjects: [
      { id: "infectious-disease", name: "Infectious Disease", lessons: [] },
      { id: "shock-sepsis", name: "Shock & Sepsis", lessons: [] },
      { id: "fluid-electrolyte-disorders", name: "Fluid & Electrolyte Disorders", lessons: [] },
      { id: "nutritional-disorders", name: "Nutritional Disorders", lessons: [] }
    ]
  }
];

export function findUsmleTopic(topicId: string): SectionDef | undefined {
  return usmleTopics.find(t => t.id === topicId);
}
