"use client";

import React from "react";
import { Search, Brain, Sword, Heart, Target, Layers } from "lucide-react";
import { AttributeName } from "@/types";

interface QuestFiltersProps {
  selectedAttribute: string;
  onSelectAttribute: (attr: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const ATTRIBUTE_FILTERS = [
  { id: "ALL", label: "All Attributes", icon: Layers, color: "text-[var(--accent-active)]" },
  { id: "INTELLECT", label: "Intellect", icon: Brain, color: "text-[var(--accent-active)]" },
  { id: "STRENGTH", label: "Strength", icon: Sword, color: "text-[var(--gold)]" },
  { id: "VITALITY", label: "Vitality", icon: Heart, color: "text-[var(--primary)]" },
  { id: "DISCIPLINE", label: "Discipline", icon: Target, color: "text-[var(--gold-highlight)]" },
];

export function QuestFilters({
  selectedAttribute,
  onSelectAttribute,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
}: QuestFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Top Search and Status Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Scan active quests & objectives..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--border-active)] transition-all font-mono"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] self-start sm:self-auto">
          {["ACTIVE", "COMPLETED", "ALL"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onSelectStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedStatus === status
                  ? "bg-[var(--primary)] text-white shadow-sm font-black"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Attribute Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {ATTRIBUTE_FILTERS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedAttribute === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectAttribute(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[var(--primary)]/20 border-[var(--border-active)] text-[var(--text-primary)] shadow-sm shadow-[var(--primary)]/20"
                  : "bg-[var(--surface-panel)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)]/40"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
