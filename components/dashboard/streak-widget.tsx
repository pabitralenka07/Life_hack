"use client";

import React from "react";
import { Flame, Trophy, CheckCircle2, Circle, Gift } from "lucide-react";
import { useCharacter } from "@/hooks/use-character";
import { useStats } from "@/hooks/use-stats";

export function StreakWidget() {
  const { character } = useCharacter();
  const { stats } = useStats();

  const currentStreak = character?.streakCurrent || 1;
  const bestStreak = character?.streakBest || 1;

  // 7-day history from stats or fallback to days
  const weeklyDays = stats?.weeklyActivity || [
    { day: "M", active: true },
    { day: "T", active: true },
    { day: "W", active: true },
    { day: "T", active: true },
    { day: "F", active: true },
    { day: "S", active: false },
    { day: "S", active: false },
  ];

  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : 30;

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-lg relative overflow-hidden transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)]">
            <Flame className="w-4 h-4 text-[var(--gold)] animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              CYBER STREAK
            </h4>
            <span className="text-[11px] text-[var(--text-muted)]">
              Unbroken Daily Progression
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-panel)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]">
          <Trophy className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span>Record: {bestStreak}d</span>
        </div>
      </div>

      {/* Main Streak Counter */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl sm:text-4xl font-black font-mono text-[var(--gold)]">
          {currentStreak}
        </span>
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
          Consecutive Days Active
        </span>
      </div>

      {/* 7-Day Activity Row */}
      <div className="bg-[var(--bg-app)]/70 rounded-xl p-3 border border-[var(--border-subtle)] mb-3">
        <div className="text-[11px] font-mono text-[var(--text-muted)] mb-2">
          PAST 7 DAYS ACTIVITY
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weeklyDays.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {item.day[0]}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                  item.active
                    ? "bg-[var(--gold)]/20 border-[var(--gold)]/50 text-[var(--gold)] shadow-sm shadow-[var(--gold)]/20"
                    : "bg-[var(--surface-panel)] border-[var(--border-subtle)] text-[var(--text-muted)]/30"
                }`}
              >
                {item.active ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Reward Milestone */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--primary)]/15 border border-[var(--accent-active)]/30 text-xs">
        <div className="flex items-center gap-2 text-[var(--text-primary)]">
          <Gift className="w-4 h-4 text-[var(--accent-active)]" />
          <span>Next Milestone: Day {nextMilestone}</span>
        </div>
        <span className="font-mono text-[11px] text-[var(--gold)] font-bold">
          +100 Gold & Badge
        </span>
      </div>
    </div>
  );
}
