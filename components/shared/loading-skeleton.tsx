"use client";

import React from "react";

export function QuestCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-hover)]" />
          <div className="space-y-1.5">
            <div className="w-24 h-3 bg-[var(--surface-hover)] rounded" />
            <div className="w-40 h-4 bg-[var(--border-subtle)] rounded" />
          </div>
        </div>
        <div className="w-16 h-6 bg-[var(--surface-hover)] rounded-full" />
      </div>
      <div className="w-full h-3 bg-[var(--surface-hover)] rounded" />
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-[var(--surface-hover)] rounded-md" />
          <div className="w-16 h-6 bg-[var(--surface-hover)] rounded-md" />
        </div>
        <div className="w-24 h-8 bg-[var(--border-subtle)] rounded-xl" />
      </div>
    </div>
  );
}

export function CharacterSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-[var(--surface-hover)]" />
        <div className="space-y-2">
          <div className="w-32 h-5 bg-[var(--border-subtle)] rounded" />
          <div className="w-24 h-4 bg-[var(--surface-hover)] rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="w-full h-4 bg-[var(--surface-hover)] rounded" />
        <div className="w-full h-2.5 bg-[var(--surface-hover)] rounded-full" />
      </div>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 space-y-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[var(--surface-hover)]" />
            <div className="w-20 h-5 bg-[var(--surface-hover)] rounded-full" />
          </div>
          <div className="w-32 h-4 bg-[var(--border-subtle)] rounded" />
          <div className="w-full h-3 bg-[var(--surface-hover)] rounded" />
          <div className="w-full h-9 bg-[var(--surface-hover)] rounded-xl" />
        </div>
      ))}
    </div>
  );
}
