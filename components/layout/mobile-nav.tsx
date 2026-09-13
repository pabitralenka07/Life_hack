"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Scroll,
  User,
  Backpack,
  Store,
  BarChart3,
} from "lucide-react";

const MOBILE_NAV_ITEMS = [
  { label: "Quests", href: "/quests", icon: Scroll },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Character", href: "/character", icon: User },
  { label: "Shop", href: "/shop", icon: Store },
  { label: "Bag", href: "/inventory", icon: Backpack },
  { label: "Stats", href: "/stats", icon: BarChart3 },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-[var(--border-subtle)] bg-[var(--bg-app)]/95 backdrop-blur-lg flex items-center justify-around px-2 transition-colors duration-200"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
              isActive
                ? "text-[var(--accent-active)] font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-[var(--accent-active)]" : ""}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
