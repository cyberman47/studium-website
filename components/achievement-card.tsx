"use client";

// The Passport's achievement card. Locked achievements stay fully visible
// (title/description/requirement) but visually muted—per spec, "students
// should see what they can work toward," not a mystery-box silhouette.
// Rarity is expressed through color, not iconography or size, keeping the
// grid calm and consistent rather than gamified.
import {
  Award, Bone, BookA, BookOpen, Bot, Brain, ClipboardCheck, Flame, GraduationCap, HandHeart, HeartPulse,
  Layers, Lock, MessagesSquare, Star, Stethoscope, Target, Trophy
} from "lucide-react";
import { AchievementRarity, PassportAchievement, rarityLabels } from "@/lib/achievements";

// Exported so the Passport History timeline can resolve the same icon key
// to the same glyph, without a second map drifting out of sync.
export const achievementIconMap: Record<string, typeof Star> = {
  star: Star, bookOpen: BookOpen, flame: Flame, graduationCap: GraduationCap, layers: Layers,
  clipboardCheck: ClipboardCheck, target: Target, brain: Brain, stethoscope: Stethoscope,
  bookA: BookA, bot: Bot, bone: Bone, heartPulse: HeartPulse, award: Award, trophy: Trophy,
  messagesSquare: MessagesSquare, handHeart: HandHeart
};

// Muted, sophisticated palette per rarity—no neon, no gradients that read
// as a mobile game. Common is the quietest; Legendary is the only one that
// reaches for gold.
const rarityStyles: Record<AchievementRarity, { badge: string; iconBg: string; ring: string }> = {
  common: { badge: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300", iconBg: "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400", ring: "border-slate-100 dark:border-white/10" },
  uncommon: { badge: "bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-700", iconBg: "bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700", ring: "border-teal-100 dark:border-teal-500/20" },
  rare: { badge: "bg-blue-50 dark:bg-blue-500/15 dark:text-blue-300 text-blue-700", iconBg: "bg-blue-100 dark:bg-blue-500/20 dark:text-blue-300 text-blue-700", ring: "border-blue-100 dark:border-blue-500/20" },
  epic: { badge: "bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300 text-violet-700", iconBg: "bg-violet-100 dark:bg-violet-500/20 dark:text-violet-300 text-violet-700", ring: "border-violet-100 dark:border-violet-500/20" },
  legendary: { badge: "bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 text-amber-700", iconBg: "bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-700", ring: "border-amber-200 dark:border-amber-500/25" }
};

function formatEarnedDate(iso: string | null): string {
  if (!iso) return "Earned";
  return `Earned ${new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`;
}

export function AchievementCard({ achievement }: { achievement: PassportAchievement }) {
  const Icon = achievementIconMap[achievement.icon] ?? Star;
  const style = rarityStyles[achievement.rarity];

  if (!achievement.unlocked) {
    return <div className="flex flex-col items-center rounded-3xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 text-center opacity-70">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500"><Icon size={22} /></span>
      <p className="mt-3 text-sm font-extrabold text-slate-500 dark:text-slate-300">{achievement.title}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{achievement.description}</p>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">{achievement.requirement}</p>
      <span className="mt-3 flex items-center gap-1 rounded-full bg-slate-200/70 dark:bg-white/10 px-2.5 py-1 text-[10px] font-extrabold text-slate-500 dark:text-slate-400"><Lock size={10} />{rarityLabels[achievement.rarity]}</span>
    </div>;
  }

  return <div className={`flex flex-col items-center rounded-3xl border ${style.ring} bg-white dark:bg-[#0d1917] p-5 text-center shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift`}>
    <span className={`grid h-14 w-14 place-items-center rounded-2xl ${style.iconBg}`}><Icon size={24} /></span>
    <p className="mt-3 text-sm font-extrabold text-heading">{achievement.title}</p>
    <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{achievement.description}</p>
    <span className={`mt-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${style.badge}`}>{rarityLabels[achievement.rarity]}</span>
    <p className="mt-2 text-[10px] font-bold text-slate-400">{formatEarnedDate(achievement.unlockedAt)}</p>
  </div>;
}
