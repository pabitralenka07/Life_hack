"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Coins,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Flame,
  Brain,
  Sword,
  Heart,
  Target,
} from "lucide-react";
import { QuestItem } from "@/types";
import { useQuests } from "@/hooks/use-quests";
import { useAppPreferences } from "@/components/providers";
import { playQuestComplete, playCyberClick } from "@/lib/sound";
import { broadcastReward } from "@/lib/reward-bus";
import { getAttributeMeta } from "@/lib/utils";

interface QuestCardProps {
  quest: QuestItem;
  onEdit?: (quest: QuestItem) => void;
  onDelete?: (id: string, title: string) => void;
}

export function QuestCard({ quest, onEdit, onDelete }: QuestCardProps) {
  const { completeQuest, isCompleting } = useQuests();
  const { soundEnabled } = useAppPreferences();
  const [floatingBonus, setFloatingBonus] = useState<{ xp: number; gold: number } | null>(null);

  const attrMeta = getAttributeMeta(quest.attribute);

  const getAttributeIcon = () => {
    switch (quest.attribute) {
      case "STRENGTH":
        return <Sword className="w-5 h-5 text-[var(--gold)]" />;
      case "INTELLECT":
        return <Brain className="w-5 h-5 text-[var(--accent-active)]" />;
      case "VITALITY":
        return <Heart className="w-5 h-5 text-[var(--primary)]" />;
      case "DISCIPLINE":
        return <Target className="w-5 h-5 text-[var(--gold-highlight)]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[var(--accent-active)]" />;
    }
  };

  const handleComplete = async () => {
    if (quest.status === "COMPLETED") return;

    // Trigger local float feedback immediately
    setFloatingBonus({ xp: quest.xpReward, gold: quest.goldReward });
    if (soundEnabled) {
      playQuestComplete(true);
    }

    try {
      const res = await completeQuest(quest.id);

      // Broadcast to reward bus for LevelUp modal and toast
      broadcastReward({
        xp: quest.xpReward,
        gold: quest.goldReward,
        streak: res.newStreak,
        leveledUp: res.leveledUp,
        newLevel: res.newLevel,
        bonusGold: res.bonusGold,
      });
    } catch (err) {
      setFloatingBonus(null);
      console.error("Failed to complete quest:", err);
    }
  };

  const isCompleted = quest.status === "COMPLETED";

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
        isCompleted
          ? "border-[var(--border-subtle)] bg-[var(--bg-subtle)]/80 opacity-70"
          : "border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-[var(--border-active)]/60 hover:shadow-lg"
      }`}
    >
      {/* Floating XP/Gold Animation Badge */}
      {floatingBonus && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none animate-in slide-out-to-top-8 fade-out duration-1000 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-active)] text-[#FFFFFF] font-black text-xs shadow-lg">
          <span>+{floatingBonus.xp} XP</span>
          <span>•</span>
          <span className="text-[var(--gold)]">+{floatingBonus.gold} G</span>
        </div>
      )}

      {/* Top Header & Badge */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${attrMeta.bg} ${attrMeta.border}`}
            >
              {getAttributeIcon()}
            </div>
            <div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider font-mono ${attrMeta.color}`}
              >
                {attrMeta.name}
              </span>
              <span className="text-[var(--text-muted)] text-xs ml-1.5 font-mono">
                • {quest.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[var(--gold)] text-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < quest.difficulty ? "text-[var(--gold)]" : "text-[var(--border-subtle)]"}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Title & Description */}
        <h4
          className={`text-base font-bold tracking-tight mb-1 ${
            isCompleted ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"
          }`}
        >
          {quest.title}
        </h4>
        {quest.description && (
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3">
            {quest.description}
          </p>
        )}

        {/* Rewards Ribbon */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[var(--xp)]/15 border border-[var(--xp)]/30 text-[var(--xp)]">
            <Sparkles className="w-3 h-3" />+{quest.xpReward} XP
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[var(--gold)]">
            <Coins className="w-3 h-3" />+{quest.goldReward} GOLD
          </span>
          {quest.dueDate && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-[var(--text-muted)] bg-[var(--surface-panel)] border border-[var(--border-subtle)]">
              <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
              {quest.dueDate}
            </span>
          )}
          {quest.frequency !== "ONCE" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] bg-[var(--gold)]/15 border border-[var(--gold)]/30">
              <Flame className="w-2.5 h-2.5" />
              {quest.frequency}
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-panel)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {onEdit && !isCompleted && (
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playCyberClick(true);
                onEdit(quest);
              }}
              title="Edit Quest Parameters"
              aria-label="Edit Quest"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-active)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playCyberClick(true);
                onDelete(quest.id, quest.title);
              }}
              title="Abort Quest"
              aria-label="Delete Quest"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/15 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isCompleted ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-[var(--accent-active)] bg-[var(--primary)]/15 border border-[var(--border-active)]/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            QUEST SLAIN
          </span>
        ) : (
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleting}
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono text-white shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isCompleting ? "Completing..." : "COMPLETE QUEST"}
          </button>
        )}
      </div>
    </div>
  );
}
