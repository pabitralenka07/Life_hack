"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Compass } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Operative System Error:", error);
  }, [error]);

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--bg-app)] text-[var(--text-primary)] backdrop-blur-sm transition-colors duration-200">
      <div className="w-full max-w-2xl bg-[var(--surface-panel)] text-[var(--text-primary)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-subtle)] text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Top Mini HUD Header */}
        <div className="bg-[var(--surface-card)] text-[var(--text-primary)] px-6 py-3 flex items-center justify-between border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--gold)]">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>SYSTEM//ANOMALY_DETECTED</span>
          </div>
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[var(--gold)]/20 text-[var(--gold)] font-bold border border-[var(--gold)]/30">
            500 EXCEPTION
          </span>
        </div>

        {/* Animated GIF Canvas without overlapping text */}
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
            500
          </h1>

          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-sans tracking-tight">
            System Glitch Detected
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 max-w-md mx-auto">
            An unexpected error disrupted the operative uplink. Don&apos;t worry, your character data is safe.
          </p>

          {error?.message && (
            <div className="mt-3 p-2.5 rounded-xl bg-[var(--error)]/15 border border-[var(--error)]/40 text-xs font-mono text-[var(--error)] max-w-md mx-auto truncate">
              {error.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button
              onClick={() => reset()}
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-mono text-xs uppercase tracking-wider font-bold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--accent-active)] border border-[var(--border-subtle)] font-mono text-xs uppercase tracking-wider font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-mono text-xs uppercase tracking-wider font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
