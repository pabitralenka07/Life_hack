"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Coins, Volume2, VolumeX, LogOut, Shield, Sun, Moon } from "lucide-react";
import { useCharacter } from "@/hooks/use-character";
import { useAppPreferences } from "@/components/providers";
import { api } from "@/lib/api-client";
import { playCyberClick } from "@/lib/sound";

export function TopBar() {
  const router = useRouter();
  const { character } = useCharacter();
  const { soundEnabled, setSoundEnabled, theme, toggleTheme } = useAppPreferences();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const level = character?.level || 1;
  const currentXP = character?.currentXP || 0;
  const requiredXP = character?.requiredXP || 100;
  const xpPercent = Math.min(Math.round((currentXP / requiredXP) * 100), 100);
  const streak = character?.streakCurrent || 1;
  const gold = character?.gold || 0;
  const isLight = theme === "light";

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors duration-200">
      {/* Left: Mobile Brand & Level Badge */}
      <div className="flex items-center gap-3">
        <div className="md:hidden text-sm font-black font-mono text-[var(--text-primary)] flex items-center gap-1">
          LIFE<span className="text-[var(--accent-active)]">//</span>RPG
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-xs font-mono font-bold text-[var(--gold)]">
          <Shield className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span>LVL {level}</span>
        </div>

        {/* XP Progress Bar on Desktop */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-32 lg:w-48 h-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-active)] transition-all duration-500 rounded-full"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {currentXP}/{requiredXP} XP ({xpPercent}%)
          </span>
        </div>
      </div>

      {/* Right HUD Stats */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Streak Flame */}
        <div
          title={`${streak}-day quest streak!`}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[var(--text-primary)] text-xs sm:text-sm font-bold font-mono shadow-sm"
        >
          <Flame className="w-4 h-4 text-[var(--gold)] animate-pulse" />
          <span>{streak}d</span>
        </div>

        {/* Gold Counter */}
        <div
          title={`${gold} Gold held`}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[var(--gold)] text-xs sm:text-sm font-bold font-mono shadow-sm"
        >
          <Coins className="w-4 h-4 text-[var(--gold)]" />
          <span>{new Intl.NumberFormat().format(gold)}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => {
            toggleTheme();
            if (soundEnabled) playCyberClick(true);
          }}
          aria-label={isLight ? "Switch to Arcane Obsidian (Dark)" : "Switch to Sunlit Guild (Light)"}
          title={isLight ? "Theme: Sunlit Guild (Click for Dark)" : "Theme: Arcane Obsidian (Click for Light)"}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-active)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
        >
          {isLight ? (
            <Sun className="w-4 h-4 text-[var(--primary)]" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--accent-active)]" />
          )}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) playCyberClick(true);
          }}
          aria-label={soundEnabled ? "Mute cyber audio" : "Enable cyber audio"}
          title={soundEnabled ? "Audio On" : "Audio Muted"}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-active)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[var(--accent-active)]" />
          ) : (
            <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
          )}
        </button>

        {/* User Profile Avatar Link */}
        <Link
          href="/character"
          aria-label="Character profile"
          className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--primary)] via-[var(--accent-active)] to-[var(--gold)] p-0.5"
        >
          <div className="w-full h-full bg-[var(--surface-panel)] rounded-[7px] flex items-center justify-center text-[var(--text-primary)] font-mono text-xs font-bold">
            {character?.username?.[0]?.toUpperCase() || "V"}
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          aria-label="Disconnect neural link"
          title="Disconnect Neural Link"
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
