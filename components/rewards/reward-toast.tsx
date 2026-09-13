"use client";

import React, { useEffect } from "react";
import { Sparkles, Coins, Flame } from "lucide-react";

export interface RewardToastPayload {
  xp: number;
  gold: number;
  attribute: string;
  attributeGain: number;
  streak: number;
}

interface RewardToastProps {
  payload: RewardToastPayload | null;
  onDismiss: () => void;
}

export function RewardToast({ payload, onDismiss }: RewardToastProps) {
  useEffect(() => {
    if (!payload) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [payload, onDismiss]);

  if (!payload) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 flex items-center gap-3 p-4 rounded-2xl border border-[var(--accent-active)]/50 bg-[var(--surface-panel)]/95 backdrop-blur-md shadow-2xl shadow-[var(--primary-purple)]/20 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-[var(--primary-purple)]/15 border border-[var(--accent-active)]/40 flex items-center justify-center text-[var(--accent-active)]">
        <Sparkles className="w-5 h-5" />
      </div>

      <div className="space-y-0.5">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-active)] font-mono">
          Quest Slain! Loot Secured
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
          <span className="text-[var(--xp-progress)]">+{payload.xp} XP</span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="flex items-center gap-1 text-[var(--gold-reward)]">
            <Coins className="w-3.5 h-3.5 inline" />+{payload.gold} Gold
          </span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="text-[var(--gold-highlight)]">
            +{payload.attributeGain} {payload.attribute}
          </span>
          {payload.streak > 0 && (
            <>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="flex items-center gap-0.5 text-[var(--gold-reward)]">
                <Flame className="w-3.5 h-3.5 inline" /> {payload.streak}-day streak!
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
