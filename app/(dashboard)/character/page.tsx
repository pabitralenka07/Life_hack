"use client";

import React, { useState } from "react";
import {
  Shield,
  Sparkles,
  Zap,
  Coins,
  Flame,
  Brain,
  Sword,
  Heart,
  Target,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useCharacter } from "@/hooks/use-character";
import { CharacterSkeleton } from "@/components/shared/loading-skeleton";
import { playCyberClick } from "@/lib/sound";
import { useAppPreferences } from "@/components/providers";

const AVATAR_OPTIONS = [
  { id: "cyber-avatar-1", label: "Neural Runner", color: "from-[#6D28D9] to-[#A855F7]" },
  { id: "cyber-avatar-2", label: "Vanguard Ops", color: "from-[#F59E0B] to-[#FCD34D]" },
  { id: "cyber-avatar-3", label: "Bio Mystic", color: "from-[#6D28D9] to-[#FCD34D]" },
  { id: "cyber-avatar-4", label: "Grid Architect", color: "from-[#A855F7] to-[#F59E0B]" },
];

export default function CharacterPage() {
  const { character, isLoading, updatePreferences } = useCharacter();
  const { soundEnabled } = useAppPreferences();
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  if (isLoading) {
    return <CharacterSkeleton />;
  }

  const level = character?.level || 1;
  const currentXP = character?.currentXP || 0;
  const requiredXP = character?.requiredXP || 100;
  const totalXP = character?.totalXP || 0;
  const xpPercent = Math.min(Math.round((currentXP / requiredXP) * 100), 100);
  const attributes = character?.attributes || [];

  const handleSelectAvatar = async (avatarId: string) => {
    if (soundEnabled) playCyberClick(true);
    setIsUpdatingAvatar(true);
    try {
      await updatePreferences({ avatarUrl: avatarId });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const getAttrDetails = (name: string) => {
    switch (name.toUpperCase()) {
      case "INTELLECT":
        return {
          label: "INTELLECT",
          icon: Brain,
          color: "text-[var(--xp-progress)]",
          barColor: "from-[#6D28D9] to-[#A855F7]",
          desc: "Coding, complex engineering, literature, and analytical problem-solving.",
        };
      case "STRENGTH":
        return {
          label: "STRENGTH",
          icon: Sword,
          color: "text-[var(--gold-reward)]",
          barColor: "from-[#F59E0B] to-[#FCD34D]",
          desc: "Heavy weightlifting, calisthenics, physical power, and stamina.",
        };
      case "VITALITY":
        return {
          label: "VITALITY",
          icon: Heart,
          color: "text-[var(--primary-purple)]",
          barColor: "from-[#6D28D9] to-[#A855F7]",
          desc: "Optimal sleep cycles, cellular nutrition, hydration, and cardiovascular health.",
        };
      case "DISCIPLINE":
        return {
          label: "DISCIPLINE",
          icon: Target,
          color: "text-[var(--gold-highlight)]",
          barColor: "from-[#F59E0B] via-[#A855F7] to-[#6D28D9]",
          desc: "Meditation routines, impulse control, deep work streaks, and habit defense.",
        };
      default:
        return {
          label: name,
          icon: Brain,
          color: "text-[var(--accent-active)]",
          barColor: "from-[#6D28D9] to-[#A855F7]",
          desc: "General Attribute",
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[var(--text-primary)] flex items-center gap-2">
          OPERATIVE SANCTUM
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Neural diagnostics, attribute breakdown, and ascension parameters.
        </p>
      </div>

      {/* Hero Character Card */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary-purple)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* Avatar Display */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-[#6D28D9] via-[#A855F7] to-[#F59E0B] p-1 shadow-2xl shadow-[#6D28D9]/30">
              <div className="w-full h-full bg-[var(--surface-panel)] rounded-[22px] flex items-center justify-center font-mono font-black text-4xl text-[var(--text-primary)]">
                {character?.username?.[0]?.toUpperCase() || "V"}
              </div>
            </div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-xs font-mono font-black text-[#0B0A12] shadow-md">
              LEVEL {level}
            </div>
          </div>

          {/* Profile Details & Overview */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-mono">
                  {character?.username || "Cyber Operative"}
                </h2>
                <span className="inline-flex items-center gap-1 self-center sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--primary-purple)]/15 border border-[var(--accent-active)]/30 text-[var(--accent-active)]">
                  <Shield className="w-3.5 h-3.5 text-[var(--gold-reward)]" /> Class: Cyber Synthesist
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                Neural link established. Persistent SQLite synchronization active.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-3 rounded-2xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] text-center">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Total XP</div>
                <div className="text-base sm:text-lg font-bold font-mono text-[var(--xp-progress)]">
                  {new Intl.NumberFormat().format(totalXP)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] text-center">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Gold Held</div>
                <div className="text-base sm:text-lg font-bold font-mono text-[var(--gold-reward)] flex items-center justify-center gap-1">
                  <Coins className="w-4 h-4 inline" /> {character?.gold || 0}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] text-center">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Active Streak</div>
                <div className="text-base sm:text-lg font-bold font-mono text-[var(--gold-reward)] flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 inline" /> {character?.streakCurrent || 1}d
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="pt-2 max-w-lg space-y-1.5 bg-[var(--surface-panel)] rounded-2xl p-3 border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--xp-progress)] font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> LEVEL PROGRESSION
                </span>
                <span className="text-[var(--text-primary)]">
                  {currentXP} / {requiredXP} XP ({xpPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6D28D9] to-[#A855F7] rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-mono uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--accent-active)]" /> 4-DOMAIN NEURAL MATRIX
          </h3>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Progressed via specific real-life quests
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attributes.map((attr) => {
            const meta = getAttrDetails(attr.name);
            const Icon = meta.icon;
            const progress = Math.min(Math.round((attr.value / 40) * 100), 100);

            return (
              <div
                key={attr.name}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-mono text-[var(--text-primary)]">
                        {meta.label}
                      </h4>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        Tier score: {attr.value}
                      </span>
                    </div>
                  </div>

                  {attr.todayGains > 0 && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[var(--gold-reward)]/15 border border-[var(--gold-reward)]/30 text-[var(--gold-highlight)]">
                      +{attr.todayGains} today
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {meta.desc}
                </p>

                {/* Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${meta.barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Avatar Presets Selector */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6">
        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[var(--text-primary)] mb-2">
          CHOOSE OPERATIVE AVATAR FRAME
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Select your cyber frame aesthetic for rankings and hud display.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AVATAR_OPTIONS.map((opt) => {
            const isSelected = character?.avatarUrl === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectAvatar(opt.id)}
                disabled={isUpdatingAvatar}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[var(--primary-purple)]/15 border-[var(--accent-active)] shadow-md shadow-[var(--primary-purple)]/20"
                    : "bg-[var(--surface-panel)] border-[var(--border-subtle)] hover:border-[var(--border-active)]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${opt.color} p-0.5 mb-2 shadow-sm`}
                >
                  <div className="w-full h-full bg-[var(--surface-card)] rounded-[10px] flex items-center justify-center font-mono font-bold text-[var(--text-primary)] text-base">
                    {character?.username?.[0]?.toUpperCase() || "V"}
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                  {opt.label}
                </span>
                {isSelected && (
                  <span className="text-[10px] text-[var(--accent-active)] font-mono mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
