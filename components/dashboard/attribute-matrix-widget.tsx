"use client";

import React from "react";
import { Brain, Sword, Heart, Target } from "lucide-react";
import { useCharacter } from "@/hooks/use-character";

export function AttributeMatrixWidget() {
  const { character } = useCharacter();

  const attributes = character?.attributes || [
    { name: "INTELLECT", value: 10, todayGains: 0 },
    { name: "STRENGTH", value: 10, todayGains: 0 },
    { name: "VITALITY", value: 10, todayGains: 0 },
    { name: "DISCIPLINE", value: 10, todayGains: 0 },
  ];

  const getAttrData = (name: string) => {
    switch (name.toUpperCase()) {
      case "INTELLECT":
        return {
          label: "INTELLECT",
          short: "INT",
          icon: Brain,
          color: "text-[var(--accent-active)]",
          bar: "from-[var(--primary)] to-[var(--accent-active)]",
          desc: "Coding & Deep Study",
        };
      case "STRENGTH":
        return {
          label: "STRENGTH",
          short: "STR",
          icon: Sword,
          color: "text-[var(--gold)]",
          bar: "from-[var(--gold)] to-[var(--gold-highlight)]",
          desc: "Gym & Physical Grit",
        };
      case "VITALITY":
        return {
          label: "VITALITY",
          short: "VIT",
          icon: Heart,
          color: "text-[var(--primary)]",
          bar: "from-[var(--primary)] via-[var(--accent-active)] to-[var(--gold)]",
          desc: "Sleep & Recovery",
        };
      case "DISCIPLINE":
        return {
          label: "DISCIPLINE",
          short: "DIS",
          icon: Target,
          color: "text-[var(--gold-highlight)]",
          bar: "from-[var(--gold)] via-[var(--primary)] to-[var(--accent-active)]",
          desc: "Mindfulness & Habits",
        };
      default:
        return {
          label: name,
          short: name.slice(0, 3),
          icon: Brain,
          color: "text-[var(--accent-active)]",
          bar: "from-[var(--primary)] to-[var(--accent-active)]",
          desc: "General Attribute",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-lg transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
          NEURAL ATTRIBUTES
        </h4>
        <span className="text-[11px] font-mono text-[var(--accent-active)] font-semibold">
          LIVE METRICS
        </span>
      </div>

      <div className="space-y-3.5">
        {attributes.map((attr) => {
          const meta = getAttrData(attr.name);
          const Icon = meta.icon;
          const fillPercent = Math.min(Math.round((attr.value / 40) * 100), 100);

          return (
            <div
              key={attr.name}
              className="p-3 rounded-xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] hover:border-[var(--border-active)]/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono hidden sm:inline">
                    • {meta.desc}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {attr.todayGains > 0 && (
                    <span className="text-[10px] font-mono font-bold text-[var(--gold)] bg-[var(--gold)]/15 px-1.5 py-0.5 rounded border border-[var(--gold)]/30">
                      +{attr.todayGains} today
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    {attr.value}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${meta.bar} rounded-full transition-all duration-500`}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
