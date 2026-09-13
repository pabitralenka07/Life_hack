"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Scroll, User, Settings, Sparkles } from "lucide-react";
import { useCharacter } from "@/hooks/use-character";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Quests", href: "/quests", icon: Scroll },
  { label: "Character", href: "/character", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { character } = useCharacter();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-[var(--border-subtle)] bg-[var(--bg-app)] h-screen sticky top-0 transition-colors duration-200">
      <div className="p-6 border-b border-[var(--border-subtle)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--primary)] via-[var(--accent-active)] to-[var(--gold)] p-0.5 shadow-md shadow-[var(--primary)]/30">
          <div className="w-full h-full bg-[var(--surface-panel)] rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--accent-active)]" />
          </div>
        </div>
        <div>
          <div className="text-base font-black tracking-wider text-[var(--text-primary)] font-mono flex items-center gap-1">
            LIFE<span className="text-[var(--accent-active)]">//</span>RPG
          </div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold">
            Productivity OS
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--primary)]/15 text-[var(--text-primary)] border border-[var(--border-active)]/50 shadow-md shadow-[var(--primary)]/20 font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[var(--accent-active)]" : "text-[var(--text-muted)]"}`} />
              <span>{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-active)] shadow-sm shadow-[var(--accent-active)]" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <Link href="/character" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface-hover)] transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--primary)] via-[var(--accent-active)] to-[var(--gold)] p-0.5 border border-[var(--border-active)]/40 flex items-center justify-center text-[#FFFFFF] font-mono font-bold text-sm">
            {(character?.username || character?.email)?.[0]?.toUpperCase() || "V"}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-active)] transition-colors">
              {character?.username || character?.email || "Operative"}
            </div>
            <div className="text-xs font-mono text-[var(--gold)]">
              LVL {character?.level || 1} Operative
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
