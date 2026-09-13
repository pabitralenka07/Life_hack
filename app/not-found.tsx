"use client";

import React from "react";
import Link from "next/link";
import { Home, Compass, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--bg-app)] text-[var(--text-primary)] backdrop-blur-sm transition-colors duration-200">
      <div className="w-full max-w-2xl bg-[var(--surface-panel)] text-[var(--text-primary)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-subtle)] text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Top Mini HUD Header */}
        <div className="bg-[var(--surface-card)] text-[var(--text-primary)] px-6 py-3 flex items-center justify-between border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-active)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-active)]" />
            <span>OPERATIVE//ERROR_CODE_404</span>
          </div>
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--accent-active)] font-bold border border-[var(--accent-active)]/30">
            SIGNAL LOST
          </span>
        </div>

        {/* 404 Animated GIF Canvas */}
        <div
          className="relative h-[260px] sm:h-[320px] bg-center bg-no-repeat bg-contain select-none opacity-90"
          style={{
            backgroundImage:
              "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
          }}
        />

        {/* Content Box */}
        <div className="p-6 sm:p-10 relative z-10 bg-[var(--surface-panel)] border-t border-[var(--border-subtle)]">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-[var(--text-primary)] font-mono tracking-tight select-none leading-none mb-3">
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-sans tracking-tight">
            Look like you&apos;re lost
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 max-w-md mx-auto">
            The page you are looking for is not available in the operative matrix!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link
              href="/"
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-mono text-xs uppercase tracking-wider font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--accent-active)] border border-[var(--border-subtle)] font-mono text-xs uppercase tracking-wider font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Command Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
