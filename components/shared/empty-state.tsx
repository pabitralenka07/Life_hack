"use client";

import React from "react";
import { Sparkles, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 backdrop-blur-sm">
      <div className="w-14 h-14 rounded-2xl bg-[var(--primary-purple)]/15 border border-[var(--accent-active)]/30 flex items-center justify-center mb-4 text-[var(--accent-active)] shadow-lg shadow-[var(--primary-purple)]/10">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold tracking-wider uppercase font-mono text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-mono uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
