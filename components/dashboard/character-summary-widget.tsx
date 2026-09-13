"use client";

import React from "react";
import Link from "next/link";
import { Shield, Sparkles, ChevronRight, Zap } from "lucide-react";
import { useCharacter } from "@/hooks/use-character";

export function CharacterSummaryWidget() {
  const { character } = useCharacter();

  const level = character?.level || 1;
  const currentXP = character?.currentXP || 0;
  const requiredXP = character?.requiredXP || 100;
  const xpPercent = Math.min(Math.round((currentXP / requiredXP) * 100), 100);

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-lg relative overflow-hidden transition-colors duration-200">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] via-[var(--accent-active)] to-[var(--gold)]" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--primary)] via-[var(--accent-active)] to-[var(--gold)] p-0.5 shadow-md shadow-[var(--primary)]/20">
              <div className="w-full h-full bg-[var(--surface-panel)] rounded-[14px] flex items-center justify-center font-mono font-black text-xl text-[var(--text-primary)]">
                {character?.username?.[0]?.toUpperCase() || "V"}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[var(--gold)] to-[var(--gold-highlight)] text-[10px] font-mono font-bold text-[#FFFFFF] shadow-sm">
              L{level}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
              <span>{character?.username || "Operative"}</span>
              <Shield className="w-3.5 h-3.5 text-[var(--gold)]" />
            </h3>
            <div className="text-xs font-mono text-[var(--accent-active)] flex items-center gap-1">
              <Zap className="w-3 h-3" /> Cyber Operative
            </div>
          </div>
        </div>

        <Link
          href="/character"
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-active)] hover:bg-[var(--surface-hover)] transition-colors"
          title="Open Character Sanctum"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      {/* XP Progression */}
      <div className="space-y-1.5 bg-[var(--bg-app)]/80 rounded-xl p-3 border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--xp)] font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> XP PROGRESS
          </span>
          <span className="text-[var(--text-primary)]">
            {currentXP} / {requiredXP} XP ({xpPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[var(--surface-card)] overflow-hidden border border-[var(--border-subtle)]">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-active)] transition-all duration-500 rounded-full"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <div className="text-[11px] font-mono text-[var(--text-muted)] text-right">
          {requiredXP - currentXP} XP until Level {level + 1}
        </div>
      </div>
    </div>
  );
}
