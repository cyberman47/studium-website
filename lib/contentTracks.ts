// Real content tracks that have actual browsable topics/sections (matches
// the tracks shown on /dashboard/learning-paths). Shared between the admin
// Overview and Learning Paths pages so the two never drift out of sync.
import { Bone, ClipboardCheck, GraduationCap, HeartHandshake } from "lucide-react";
import { mcatSections } from "./mcatPath";
import { medicalSchoolTopics } from "./medicalSchoolPath";
import { nursingTopics } from "./nursingPath";
import { anatomySections } from "./anatomyPath";

export const contentTracks = [
  { id: "medical-school" as const, label: "Medical School", icon: GraduationCap, tint: "text-teal-400", count: medicalSchoolTopics.length, unit: "topics" },
  { id: "mcat" as const, label: "MCAT", icon: ClipboardCheck, tint: "text-violet-400", count: mcatSections.length, unit: "sections" },
  { id: "nursing" as const, label: "Nursing", icon: HeartHandshake, tint: "text-pink-400", count: nursingTopics.length, unit: "topics" },
  { id: "anatomy" as const, label: "Anatomy", icon: Bone, tint: "text-red-400", count: anatomySections.length, unit: "regions" }
];
