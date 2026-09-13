"use client";

import React, { useState } from "react";
import { Plus, Sparkles, Brain, Sword, Heart, Target } from "lucide-react";
import { useQuests } from "@/hooks/use-quests";
import { AttributeName } from "@/types";
import { playCyberClick } from "@/lib/sound";
import { useAppPreferences } from "@/components/providers";

export function QuickCreateQuest({ onOpenFullModal }: { onOpenFullModal: () => void }) {
  const { createQuest, isCreating } = useQuests();
  const { soundEnabled } = useAppPreferences();
  const [title, setTitle] = useState("");
  const [attribute, setAttribute] = useState<AttributeName>("INTELLECT");

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isCreating) return;

    try {
      if (soundEnabled) playCyberClick(true);
      await createQuest({
        title: title.trim(),
        category: attribute === "INTELLECT" ? "Coding" : attribute === "STRENGTH" ? "Fitness" : attribute === "VITALITY" ? "Health" : "Personal",
        attribute,
        difficulty: 2,
        xpReward: 85,
        goldReward: 35,
        frequency: "DAILY",
        status: "ACTIVE",
      });
      setTitle("");
    } catch (err) {
      console.error("Quick quest creation failed:", err);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-md mb-6 transition-colors duration-200">
      <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Title Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Deploy a quick quest (e.g. 30m Deep Work, 5km Run, Read 10 pgs)..."
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--border-active)] transition-all font-mono"
          />
        </div>

        {/* Attribute Picker Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(["INTELLECT", "STRENGTH", "VITALITY", "DISCIPLINE"] as AttributeName[]).map((attr) => {
            const isSelected = attribute === attr;
            const Icon =
              attr === "INTELLECT"
                ? Brain
                : attr === "STRENGTH"
                ? Sword
                : attr === "VITALITY"
                ? Heart
                : Target;

            return (
              <button
                key={attr}
                type="button"
                onClick={() => setAttribute(attr)}
                title={`Target ${attr}`}
                className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[var(--primary)]/20 border-[var(--border-active)] text-[var(--accent-active)] shadow-sm shadow-[var(--primary)]/20"
                    : "bg-[var(--surface-panel)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Submit & Expand */}
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!title.trim() || isCreating}
            className="btn-primary flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? "Forging..." : "Add"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenFullModal}
            title="Configure advanced quest parameters"
            className="px-3 py-2.5 rounded-xl text-xs font-mono text-[var(--accent-active)] hover:text-[var(--text-primary)] bg-[var(--surface-panel)] border border-[var(--border-subtle)] hover:border-[var(--border-active)]/40 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Advanced</span>
          </button>
        </div>
      </form>
    </div>
  );
}
