"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Award, Zap, Coins, Sparkles, X } from "lucide-react";
import { playLevelUp } from "@/lib/sound";
import { useAppPreferences } from "@/components/providers";

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  bonusGold: number;
  onClose: () => void;
}

export function LevelUpModal({
  isOpen,
  newLevel,
  bonusGold,
  onClose,
}: LevelUpModalProps) {
  const { soundEnabled, reducedMotion } = useAppPreferences();

  useEffect(() => {
    if (isOpen) {
      if (soundEnabled) {
        playLevelUp(true);
      }
      if (!reducedMotion && typeof window !== "undefined") {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#6D28D9", "#A855F7", "#F59E0B", "#FCD34D", "#FFFFFF"],
          });
        } catch {
          // ignore if canvas not supported
        }
      }
    }
  }, [isOpen, soundEnabled, reducedMotion]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-[var(--accent-active)]/60 bg-[var(--surface-panel)] p-8 text-center shadow-2xl shadow-[var(--primary-purple)]/30 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--primary-purple)]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--accent-active)]/15 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#A855F7] to-[#F59E0B] p-0.5 shadow-xl shadow-[#6D28D9]/40 mb-5 animate-bounce">
            <div className="w-full h-full bg-[var(--surface-card)] rounded-2xl flex items-center justify-center">
              <Award className="w-10 h-10 text-[var(--gold-reward)]" />
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--primary-purple)]/15 text-[var(--accent-active)] border border-[var(--accent-active)]/40 mb-2 font-mono">
            NEURAL THRESHOLD EXCEEDED
          </span>

          <h2
            id="levelup-title"
            className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)] mb-2 font-mono"
          >
            OPERATIVE LEVEL {newLevel}
          </h2>

          <p className="text-sm text-[var(--text-muted)] max-w-sm mb-6 leading-relaxed">
            Your real-world accomplishments have permanently ascended your neural
            capacities. Welcome to higher clearance.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
              <Zap className="w-6 h-6 text-[var(--xp-progress)] shrink-0" />
              <div className="text-left">
                <div className="text-xs text-[var(--xp-progress)] font-medium font-mono">+1 Attribute</div>
                <div className="text-xs text-[var(--text-muted)]">Core Capacity</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
              <Coins className="w-6 h-6 text-[var(--gold-reward)] shrink-0" />
              <div className="text-left">
                <div className="text-xs text-[var(--gold-reward)] font-medium font-mono">
                  +{bonusGold} Gold
                </div>
                <div className="text-xs text-[var(--text-muted)]">Guild Stipend</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-primary w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-sm font-mono shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>CLAIM ASCENSION REWARDS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
