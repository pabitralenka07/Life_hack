"use client";

import React, { useState } from "react";
import {
  Settings,
  Volume2,
  VolumeX,
  Eye,
  RefreshCw,
  CheckCircle2,
  Shield,
  HelpCircle,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useAppPreferences } from "@/components/providers";
import { playCyberClick } from "@/lib/sound";
import { useCharacter } from "@/hooks/use-character";
import { api } from "@/lib/api-client";

export default function SettingsPage() {
  const {
    soundEnabled,
    setSoundEnabled,
    reducedMotion,
    setReducedMotion,
    theme,
    setTheme,
  } = useAppPreferences();
  const { character, refetch } = useCharacter();

  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleTestSound = () => {
    playCyberClick(true);
  };

  const handleResetDemoData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset demo data? This resets character stats and repopulates initial demo quests."
      )
    ) {
      return;
    }

    setIsResetting(true);
    setResetMessage(null);

    try {
      await api.post("/api/quests/seed");
      await refetch();
      setResetMessage("Demo environment successfully restored to factory baseline.");
      if (soundEnabled) playCyberClick(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset demo data.";
      setResetMessage(`Reset failed: ${msg}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[var(--text-primary)] flex items-center gap-2">
          SYSTEM CONFIGURATION <Settings className="w-6 h-6 text-[var(--accent-active)]" />
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Visual theme aesthetics, audio parameters, motion thresholds, and neural telemetry resets.
        </p>
      </div>

      {resetMessage && (
        <div className="p-4 rounded-2xl bg-[var(--primary)]/20 border border-[var(--accent-active)]/40 text-[var(--accent-active)] text-xs sm:text-sm font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {resetMessage}
        </div>
      )}

      {/* Visual Aesthetics (Interface Theme) */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-6 space-y-4 transition-colors duration-200">
        <h2 className="text-base font-bold font-mono text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--accent-active)]" /> INTERFACE THEME (VISUAL AESTHETICS)
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Select between Arcane Obsidian (stealth cyberpunk dark mode) and Sunlit Guild (warm radiant guildhall light mode).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Arcane Obsidian Card */}
          <button
            type="button"
            onClick={() => {
              setTheme("dark");
              if (soundEnabled) playCyberClick(true);
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              theme === "dark"
                ? "bg-[#100E1A] border-[#A855F7] shadow-lg shadow-[#6D28D9]/25 ring-2 ring-[#A855F7]"
                : "bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-active)]/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-[#A855F7]" />
                  <span className="font-mono font-bold text-sm text-[#F8FAFC]">ARCANE OBSIDIAN</span>
                </div>
                {theme === "dark" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6D28D9] text-[#FFFFFF] font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Obsidian dark theme with mystic violet accents, cyber gold highlights, and deep tactical panels.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#252233]">
              <span className="w-4 h-4 rounded-full bg-[#0B0A12] border border-[#252233]" title="Obsidian" />
              <span className="w-4 h-4 rounded-full bg-[#141224]" title="Panel" />
              <span className="w-4 h-4 rounded-full bg-[#6D28D9]" title="Primary Violet" />
              <span className="w-4 h-4 rounded-full bg-[#A855F7]" title="Bright Violet" />
              <span className="w-4 h-4 rounded-full bg-[#F59E0B]" title="Gold Reward" />
            </div>
          </button>

          {/* Sunlit Guild Card */}
          <button
            type="button"
            onClick={() => {
              setTheme("light");
              if (soundEnabled) playCyberClick(true);
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              theme === "light"
                ? "bg-[#FFFDF0] border-[#FF8500] shadow-lg shadow-[#FF8500]/20 ring-2 ring-[#FF8500]"
                : "bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--primary-purple)]/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[#FF8500]" />
                  <span className="font-mono font-bold text-sm text-[#241B35]">SUNLIT GUILD</span>
                </div>
                {theme === "light" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF8500] text-[#FFFFFF] font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B6472] leading-relaxed">
                Radiant guildhall light theme with warm cream grounds, tactical orange buttons, and high contrast.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E8DEB4]">
              <span className="w-4 h-4 rounded-full bg-[#FFF9D8] border border-[#E8DEB4]" title="Cream" />
              <span className="w-4 h-4 rounded-full bg-[#FFFFFF] border border-[#E8DEB4]" title="White Panel" />
              <span className="w-4 h-4 rounded-full bg-[#FF8500]" title="Primary Orange" />
              <span className="w-4 h-4 rounded-full bg-[#6D28D9]" title="XP Violet" />
              <span className="w-4 h-4 rounded-full bg-[#D97706]" title="Amber Gold" />
            </div>
          </button>
        </div>
      </div>

      {/* Audio Preferences */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-6 space-y-4 transition-colors duration-200">
        <h2 className="text-base font-bold font-mono text-[var(--text-primary)] flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[var(--accent-active)]" /> CYBER ACOUSTICS (WEB AUDIO SYNTH)
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Real-time synthesized harmonic feedback for quest completions, level-ups, and market purchases. Zero external MP3 files required.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              Sound Effects
            </div>
            <div className="text-xs text-[var(--text-muted)] font-mono">
              Status: {soundEnabled ? "Enabled" : "Muted"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestSound}
              disabled={!soundEnabled}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--surface-panel)] text-[var(--accent-active)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] disabled:opacity-40 cursor-pointer"
            >
              Test Chime
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playCyberClick(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-gradient-to-r from-[var(--primary)] via-[var(--accent-active)] to-[var(--primary)] text-[#FFFFFF] shadow-md shadow-[var(--primary)]/30"
                  : "bg-[var(--surface-panel)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />}
              <span>{soundEnabled ? "Audio ON" : "Audio MUTED"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual & Motion Accessibility */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-6 space-y-4 transition-colors duration-200">
        <h2 className="text-base font-bold font-mono text-[var(--text-primary)] flex items-center gap-2">
          <Eye className="w-5 h-5 text-[var(--accent-active)]" /> ACCESSIBILITY & MOTION
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Section 21 compliance: Respects prefers-reduced-motion, swapping celebratory animations for reduced instant feedback.
        </p>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              Reduced Motion Mode
            </div>
            <div className="text-xs text-[var(--text-muted)] font-mono">
              Minimizes particle bursts and intense transforms
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              reducedMotion
                ? "bg-[var(--primary)] text-[#FFFFFF] shadow-md shadow-[var(--primary)]/30"
                : "bg-[var(--surface-panel)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
            }`}
          >
            {reducedMotion ? "REDUCED ACTIVE" : "STANDARD MOTION"}
          </button>
        </div>
      </div>

      {/* Operative Credentials */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-6 space-y-4 transition-colors duration-200">
        <h2 className="text-base font-bold font-mono text-[var(--text-primary)] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[var(--gold)]" /> OPERATIVE CLEARANCE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase">Codename</div>
            <div className="text-sm font-mono font-bold text-[var(--text-primary)] mt-1">
              {character?.username || "Operative"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase">Database Engine</div>
            <div className="text-sm font-mono font-bold text-[var(--accent-active)] mt-1">
              SQLite (Prisma ORM) • Local Persistent
            </div>
          </div>
        </div>
      </div>

      {/* Demo Reset Protocol */}
      <div className="rounded-2xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-6 space-y-4 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-[var(--error)]" />
          <h2 className="text-base font-bold font-mono text-[var(--error)]">
            DEMO RE-SEED & FACTORY RECOVERY
          </h2>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Reset local quest telemetry, re-establish baseline starter quests, and initialize character stats back to Level 1.
        </p>

        <button
          type="button"
          onClick={handleResetDemoData}
          disabled={isResetting}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[var(--error)] hover:opacity-90 text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
          <span>{isResetting ? "Restoring Matrix..." : "Execute Factory Re-seed"}</span>
        </button>
      </div>

      {/* Architecture Notes */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-6 space-y-2 transition-colors duration-200">
        <div className="flex items-center gap-2 text-[var(--accent-active)] text-xs font-mono font-bold">
          <HelpCircle className="w-4 h-4" />
          <span>LOCAL PERSISTENCE AUDIT</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          All changes, theme choices, completed quests, custom streaks, and gold stores are persistently written to SQLite and browser storage.
        </p>
      </div>
    </div>
  );
}
