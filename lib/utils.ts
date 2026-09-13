import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// Styled according to Life RPG palette: #0B0A12, #6D28D9, #A855F7, #F59E0B, #FCD34D, #F8FAFC, #A1A1AA, #252233
export function getRarityColor(rarity: string): { border: string; bg: string; text: string; glow: string } {
  switch (rarity.toUpperCase()) {
    case "COMMON":
      return {
        border: "border-[#252233]",
        bg: "bg-[#141222]/80",
        text: "text-[#A1A1AA]",
        glow: "shadow-none",
      };
    case "UNCOMMON":
      return {
        border: "border-[#6D28D9]/60",
        bg: "bg-[#6D28D9]/15",
        text: "text-[#A855F7]",
        glow: "shadow-[#6D28D9]/20",
      };
    case "RARE":
      return {
        border: "border-[#A855F7]/60",
        bg: "bg-[#A855F7]/15",
        text: "text-[#A855F7]",
        glow: "shadow-[#A855F7]/25",
      };
    case "EPIC":
      return {
        border: "border-[#A855F7]",
        bg: "bg-gradient-to-br from-[#18152A] to-[#251b3d]",
        text: "text-[#F8FAFC]",
        glow: "shadow-[#A855F7]/30",
      };
    case "LEGENDARY":
      return {
        border: "border-[#F59E0B]/90",
        bg: "bg-gradient-to-br from-[#F59E0B]/20 via-[#6D28D9]/20 to-[#18152A]",
        text: "text-[#F59E0B]",
        glow: "shadow-[#F59E0B]/40",
      };
    default:
      return {
        border: "border-[#252233]",
        bg: "bg-[#141222]/70",
        text: "text-[#A1A1AA]",
        glow: "shadow-none",
      };
  }
}

export function getAttributeMeta(attribute: string) {
  switch (attribute.toUpperCase()) {
    case "STRENGTH":
      return {
        name: "STRENGTH",
        short: "STR",
        icon: "Sword",
        color: "text-[#F59E0B]",
        bg: "bg-[#F59E0B]/15",
        border: "border-[#F59E0B]/40",
        barColor: "bg-gradient-to-r from-[#F59E0B] to-[#FCD34D]",
        description: "Gym, Fitness, Sports, Physical Endurance",
      };
    case "INTELLECT":
      return {
        name: "INTELLECT",
        short: "INT",
        icon: "Brain",
        color: "text-[#A855F7]",
        bg: "bg-[#A855F7]/15",
        border: "border-[#A855F7]/40",
        barColor: "bg-gradient-to-r from-[#6D28D9] to-[#A855F7]",
        description: "Coding, Studying, Engineering, Reading",
      };
    case "VITALITY":
      return {
        name: "VITALITY",
        short: "VIT",
        icon: "Heart",
        color: "text-[#6D28D9]",
        bg: "bg-[#6D28D9]/15",
        border: "border-[#6D28D9]/40",
        barColor: "bg-gradient-to-r from-[#6D28D9] via-[#A855F7] to-[#F8FAFC]",
        description: "Sleep, Nutrition, Hydration, Recovery",
      };
    case "DISCIPLINE":
      return {
        name: "DISCIPLINE",
        short: "DIS",
        icon: "Target",
        color: "text-[#FCD34D]",
        bg: "bg-[#FCD34D]/15",
        border: "border-[#FCD34D]/40",
        barColor: "bg-gradient-to-r from-[#F59E0B] via-[#A855F7] to-[#6D28D9]",
        description: "Meditation, Focus, Organization, Habit streaks",
      };
    default:
      return {
        name: attribute,
        short: "ATTR",
        icon: "Sparkles",
        color: "text-[#A855F7]",
        bg: "bg-[#A855F7]/10",
        border: "border-[#252233]",
        barColor: "bg-[#A855F7]",
        description: "General Attribute",
      };
  }
}
