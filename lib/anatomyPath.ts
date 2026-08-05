import type { SectionDef } from "./mcatPath";

// Anatomy is organized as a regional gross-anatomy course. This is currently a
// navigation shell—every subject is real, but no lessons have been written yet,
// so they all show as "coming soon" until content is authored.

export const anatomySections: SectionDef[] = [
  {
    id: "terminology",
    title: "Anatomical Terminology",
    shortTitle: "Terminology",
    subjects: [
      { id: "anatomical-position-planes", name: "Anatomical Position & Planes", lessons: [] },
      { id: "directional-terms", name: "Directional Terms", lessons: [] },
      { id: "movement-terminology", name: "Movement Terminology", lessons: [] }
    ]
  },
  {
    id: "upper-limb",
    title: "Upper Limb",
    shortTitle: "Upper Limb",
    subjects: [
      { id: "shoulder-pectoral-girdle", name: "Shoulder & Pectoral Girdle", lessons: [] },
      { id: "arm", name: "Arm (Brachium)", lessons: [] },
      { id: "forearm", name: "Forearm", lessons: [] },
      { id: "wrist-hand", name: "Wrist & Hand", lessons: [] },
      { id: "brachial-plexus", name: "Brachial Plexus", lessons: [] }
    ]
  },
  {
    id: "lower-limb",
    title: "Lower Limb",
    shortTitle: "Lower Limb",
    subjects: [
      { id: "hip-gluteal-region", name: "Hip & Gluteal Region", lessons: [] },
      { id: "thigh", name: "Thigh", lessons: [] },
      { id: "leg", name: "Leg", lessons: [] },
      { id: "ankle-foot", name: "Ankle & Foot", lessons: [] },
      { id: "lumbosacral-plexus", name: "Lumbosacral Plexus", lessons: [] }
    ]
  },
  {
    id: "spine-back",
    title: "Spine and Back",
    shortTitle: "Spine and Back",
    subjects: [
      { id: "vertebral-column", name: "Vertebral Column", lessons: [] },
      { id: "intervertebral-discs-joints", name: "Intervertebral Discs & Joints", lessons: [] },
      { id: "back-muscles", name: "Back Muscles", lessons: [] },
      { id: "spinal-nerves", name: "Spinal Nerves", lessons: [] }
    ]
  },
  {
    id: "thorax",
    title: "Thorax",
    shortTitle: "Thorax",
    subjects: [
      { id: "thoracic-wall", name: "Thoracic Wall", lessons: [] },
      { id: "heart-pericardium", name: "Heart & Pericardium", lessons: [] },
      { id: "lungs-pleura", name: "Lungs & Pleura", lessons: [] },
      { id: "mediastinum", name: "Mediastinum", lessons: [] }
    ]
  },
  {
    id: "abdomen",
    title: "Abdomen",
    shortTitle: "Abdomen",
    subjects: [
      { id: "abdominal-wall", name: "Abdominal Wall", lessons: [] },
      { id: "gi-tract-peritoneum", name: "GI Tract & Peritoneum", lessons: [] },
      { id: "liver-pancreas-spleen", name: "Liver, Pancreas & Spleen", lessons: [] },
      { id: "kidneys-posterior-wall", name: "Kidneys & Posterior Abdominal Wall", lessons: [] }
    ]
  },
  {
    id: "pelvic-girdle-floor",
    title: "Pelvic Girdle and Floor",
    shortTitle: "Pelvic Girdle and Floor",
    subjects: [
      { id: "bony-pelvis", name: "Bony Pelvis", lessons: [] },
      { id: "pelvic-floor-muscles", name: "Pelvic Floor Muscles", lessons: [] },
      { id: "pelvic-viscera", name: "Pelvic Viscera", lessons: [] },
      { id: "perineum", name: "Perineum", lessons: [] }
    ]
  },
  {
    id: "head-neck",
    title: "Head and Neck",
    shortTitle: "Head and Neck",
    subjects: [
      { id: "skull-cranial-bones", name: "Skull & Cranial Bones", lessons: [] },
      { id: "face-scalp", name: "Face & Scalp", lessons: [] },
      { id: "neck-triangles", name: "Neck Triangles", lessons: [] },
      { id: "cranial-nerve-distribution", name: "Cranial Nerve Distribution", lessons: [] }
    ]
  },
  {
    id: "neuroanatomy",
    title: "Neuroanatomy",
    shortTitle: "Neuroanatomy",
    subjects: [
      { id: "brain-overview", name: "Brain Overview", lessons: [] },
      { id: "spinal-cord", name: "Spinal Cord", lessons: [] },
      { id: "cranial-nerve-pathways", name: "Cranial Nerve Nuclei & Pathways", lessons: [] },
      { id: "ventricular-system-csf", name: "Ventricular System & CSF", lessons: [] }
    ]
  }
];

export function findAnatomySection(sectionId: string): SectionDef | undefined {
  return anatomySections.find(s => s.id === sectionId);
}
