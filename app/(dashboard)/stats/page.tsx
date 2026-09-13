"use client";

import React from "react";
import {
  BarChart3,
  Flame,
  Coins,
  Sparkles,
  Trophy,
  Brain,
  Sword,
  Heart,
  Target,
  Clock,
} from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import { useCharacter } from "@/hooks/use-character";

export default function StatsPage() {
  const { stats, isLoading, isError, refetch } = useStats();
  const { character } = useCharacter();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-[var(--surface-hover)] rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)]" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)]" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-center">
        <p className="text-sm text-[var(--error)] mb-4">
          Could not establish connection with operative telemetry node.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
        >
          Re-query Node
        </button>
      </div>
    );
  }

  const {
    totalQuestsCompleted,
    totalXPEarned,
    totalGoldEarned,
    weeklyActivity,
    attributeDistribution,
    recentCompletions,
  } = stats;

  const currentLevel = character?.level || 1;
  const currentStreak = character?.streakCurrent || 1;
  const bestStreak = character?.streakBest || 1;

  // Max value for scaling weekly activity bars
  const maxWeeklyCount = Math.max(...weeklyActivity.map((d) => d.completedCount), 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[var(--text-primary)] flex items-center gap-2">
          OPERATIVE TELEMETRY <BarChart3 className="w-6 h-6 text-[var(--accent-active)]" />
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Tactical performance logs, habit streaks, and neural attribute growth.
        </p>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] text-center space-y-1">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Quests Slain</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--xp-progress)]">
            {totalQuestsCompleted}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]/60 font-mono">100% Verified</div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] text-center space-y-1">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Total XP</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--xp-progress)] flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 inline" />
            {new Intl.NumberFormat().format(totalXPEarned)}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]/60 font-mono">Lifetime Gains</div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] text-center space-y-1">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Operative Rank</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--gold-reward)]">
            LVL {currentLevel}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]/60 font-mono">Higher Clearance</div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] text-center space-y-1">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Active Streak</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--gold-reward)] flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 inline" />
            {currentStreak}d
          </div>
          <div className="text-[10px] text-[var(--text-muted)]/60 font-mono">Best: {bestStreak}d</div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] text-center space-y-1">
          <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">Gold Accrued</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--gold-reward)] flex items-center justify-center gap-1">
            <Coins className="w-4 h-4 inline" />
            {new Intl.NumberFormat().format(totalGoldEarned)}
          </div>
          <div className="text-[10px] text-[var(--text-muted)]/60 font-mono">Market Currency</div>
        </div>
      </div>

      {/* Charts Section: Weekly Activity Bar Chart & Attribute Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Completion Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[var(--gold-reward)]" /> 7-DAY ACTIVITY HEATMAP
            </h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">Daily Quests</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[var(--border-subtle)]">
            {weeklyActivity.map((day) => {
              const heightPercent = Math.max((day.completedCount / maxWeeklyCount) * 100, 8);
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-mono font-bold text-[var(--xp-progress)]">
                    {day.completedCount > 0 ? day.completedCount : ""}
                  </span>
                  <div
                    className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 ${
                      day.completedCount > 0
                        ? "bg-gradient-to-t from-[#6D28D9] via-[#A855F7] to-[#F59E0B] shadow-md shadow-[#6D28D9]/20"
                        : "bg-[var(--surface-hover)]"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attribute Distribution Breakdown */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
            ATTRIBUTE SPECTRUM
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[var(--xp-progress)] flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" /> INTELLECT
                </span>
                <span className="text-[var(--text-primary)] font-bold">
                  {attributeDistribution.intellect}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full bg-[#A855F7] rounded-full"
                  style={{
                    width: `${Math.min((attributeDistribution.intellect / 40) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[var(--gold-reward)] flex items-center gap-1.5">
                  <Sword className="w-3.5 h-3.5" /> STRENGTH
                </span>
                <span className="text-[var(--text-primary)] font-bold">
                  {attributeDistribution.strength}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full bg-[#F59E0B] rounded-full"
                  style={{
                    width: `${Math.min((attributeDistribution.strength / 40) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[var(--primary-purple)] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> VITALITY
                </span>
                <span className="text-[var(--text-primary)] font-bold">
                  {attributeDistribution.vitality}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full bg-[#6D28D9] rounded-full"
                  style={{
                    width: `${Math.min((attributeDistribution.vitality / 40) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[var(--gold-highlight)] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> DISCIPLINE
                </span>
                <span className="text-[var(--text-primary)] font-bold">
                  {attributeDistribution.discipline}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full bg-[#FCD34D] rounded-full"
                  style={{
                    width: `${Math.min((attributeDistribution.discipline / 40) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Completions Log */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4">
        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--accent-active)]" /> HISTORICAL ACTION LOG
        </h3>

        {recentCompletions.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] font-mono">
            No completed quests logged yet. Complete quests to register telemetry.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {recentCompletions.map((item) => (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {item.questTitle}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)]">
                    {new Date(item.completedAt).toLocaleDateString()} • Attributed to{" "}
                    <span className="text-[var(--xp-progress)] font-semibold">{item.attribute}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-[var(--xp-progress)] font-bold">+{item.xpGranted} XP</span>
                  <span className="text-[var(--gold-reward)] font-bold">+{item.goldGranted} Gold</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
