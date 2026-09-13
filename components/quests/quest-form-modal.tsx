"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Coins, Brain, Sword, Heart, Target } from "lucide-react";
import { QuestItem, AttributeName } from "@/types";
import { getDifficultyRewards } from "@/lib/game-engine";
import { playCyberClick } from "@/lib/sound";
import { useAppPreferences } from "@/components/providers";

interface QuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questData: Partial<QuestItem>) => Promise<void>;
  initialData?: QuestItem | null;
}

const CATEGORIES = [
  "Coding",
  "Study",
  "Fitness",
  "Health",
  "Reading",
  "Mindfulness",
  "Work",
  "Personal",
  "Other",
];

const ATTRIBUTES: { name: AttributeName; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: "INTELLECT", label: "INTELLECT", icon: Brain },
  { name: "STRENGTH", label: "STRENGTH", icon: Sword },
  { name: "VITALITY", label: "VITALITY", icon: Heart },
  { name: "DISCIPLINE", label: "DISCIPLINE", icon: Target },
];

export function QuestFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: QuestFormModalProps) {
  const { soundEnabled } = useAppPreferences();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Coding");
  const [attribute, setAttribute] = useState<AttributeName>("INTELLECT");
  const [difficulty, setDifficulty] = useState(2);
  const [frequency, setFrequency] = useState<"ONCE" | "DAILY" | "WEEKLY">("ONCE");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setCategory(initialData.category);
      setAttribute(initialData.attribute);
      setDifficulty(initialData.difficulty);
      setFrequency(initialData.frequency);
      setDueDate(initialData.dueDate || "");
    } else {
      setTitle("");
      setDescription("");
      setCategory("Coding");
      setAttribute("INTELLECT");
      setDifficulty(2);
      setFrequency("ONCE");
      setDueDate("");
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const rewards = getDifficultyRewards(difficulty);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Quest title cannot be blank.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        ...(initialData ? { id: initialData.id } : {}),
        title: title.trim(),
        description: description.trim(),
        category,
        attribute,
        difficulty,
        xpReward: rewards.xp,
        goldReward: rewards.gold,
        frequency,
        dueDate: dueDate || null,
      });
      if (soundEnabled) playCyberClick(true);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record quest.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-6 sm:p-8 shadow-2xl shadow-[var(--primary-purple)]/15 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary-purple)]/15 border border-[var(--accent-active)]/40 flex items-center justify-center text-[var(--accent-active)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3
              id="quest-modal-title"
              className="text-lg font-bold text-[var(--text-primary)] font-mono tracking-tight"
            >
              {initialData ? "RECONFIGURE QUEST" : "FORGE NEW QUEST"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/40 text-[var(--error)] text-xs mb-5">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Quest Objective *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master React Hooks Architecture"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)] transition-all font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Briefing / Tactical Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key deliverables, steps, or success metrics..."
              className="w-full px-4 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--border-active)] transition-all resize-none font-mono"
            />
          </div>

          {/* Attribute Target */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Target Attribute *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ATTRIBUTES.map((attr) => {
                const Icon = attr.icon;
                const isSelected = attribute === attr.name;
                return (
                  <button
                    key={attr.name}
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playCyberClick(true);
                      setAttribute(attr.name);
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--primary-purple)]/15 border-[var(--accent-active)] text-[var(--text-primary)] shadow-sm shadow-[var(--primary-purple)]/15"
                        : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[var(--accent-active)]" />
                    <span>{attr.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] font-mono"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Cadence
              </label>
              <select
                value={frequency}
                onChange={(e) =>
                  setFrequency(e.target.value as "ONCE" | "DAILY" | "WEEKLY")
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] font-mono"
              >
                <option value="ONCE">Single Run (Once)</option>
                <option value="DAILY">Daily Protocol</option>
                <option value="WEEKLY">Weekly Sprint</option>
              </select>
            </div>
          </div>

          {/* Difficulty Star Rating */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Difficulty Tier ({difficulty} ★)
              </label>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[var(--xp-progress)] font-bold">+{rewards.xp} XP</span>
                <span className="text-[var(--text-muted)]">•</span>
                <span className="text-[var(--gold-reward)] font-bold">
                  <Coins className="w-3 h-3 inline mr-0.5" />+{rewards.gold} G
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playCyberClick(true);
                    setDifficulty(star);
                  }}
                  className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    star <= difficulty
                      ? "bg-[var(--gold-reward)]/15 border-[var(--gold-reward)]/60 text-[var(--gold-reward)]"
                      : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-muted)]/50 hover:text-[var(--text-muted)]"
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] font-mono"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? "Recording..."
                : initialData
                ? "Update Quest"
                : "Initialize Quest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
