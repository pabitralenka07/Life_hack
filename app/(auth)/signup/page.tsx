"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sun, Moon } from "lucide-react";
import { api } from "@/lib/api-client";
import { playSound } from "@/lib/sound";
import { useAppPreferences } from "@/components/providers";
import SpecularButton from "@/components/shared/SpecularButton";

export default function SignupPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useAppPreferences();
  const isLight = theme === "light";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    playSound("click");

    if (password !== confirmPassword) {
      setError("Security keys do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Security key must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/api/auth/register", {
        username,
        email,
        password,
      });

      playSound("levelup");
      router.push("/dashboard");
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj?.message || "Registration failed. Codename or email may already be reserved.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col items-center justify-center p-4 selection:bg-[var(--primary)] selection:text-[#FFFFFF] relative overflow-hidden transition-colors duration-200">
      {/* Ambient radial glow – sits below card */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--primary)]/15 rounded-full blur-3xl pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--accent-active)]/12 rounded-full blur-3xl pointer-events-none" style={{ zIndex: 1 }} />

      {/* Signup Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] backdrop-blur-xl p-6 sm:p-8 shadow-2xl transition-colors duration-200" style={{ zIndex: 10 }}>
        {/* Top bar with quick theme toggle */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--primary)] via-[var(--accent-active)] to-[var(--gold)] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[var(--surface-panel)] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[var(--accent-active)]" />
              </div>
            </div>
            <span className="text-base font-black font-mono tracking-wider text-[var(--text-primary)]">
              LIFE<span className="text-[var(--accent-active)]">//</span>RPG
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isLight ? "Switch to Dark Theme" : "Switch to Light Theme"}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-active)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
          >
            {isLight ? (
              <Sun className="w-4 h-4 text-[var(--primary)]" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--accent-active)]" />
            )}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black font-mono tracking-tight text-[var(--text-primary)]">
            OPERATIVE RECRUITMENT
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Initialize your profile to convert daily discipline into XP.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-[var(--error)]/15 border border-[var(--error)]/40 text-[var(--error)] text-xs mb-5 animate-in fade-in"
          >
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5"
            >
              Operative Codename *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Cypher_07"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)] transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5"
            >
              Uplink Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@matrix.io"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)] transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5"
            >
              Security Key (Min. 6 chars) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)] transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5"
            >
              Confirm Security Key *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)] transition-all font-mono"
              />
            </div>
          </div>

          {/* Primary Submit Button: Orange on Light, Specular Violet on Dark */}
          {isLight ? (
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 px-4 rounded-xl text-sm font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
            >
              <span>{isLoading ? "Enlisting Operative..." : "Initialize Operative Sheet"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <SpecularButton
              type="submit"
              disabled={isLoading}
              size="md"
              radius={12}
              lineColor="#A855F7"
              baseColor="#6D28D9"
              textColor="#F8FAFC"
              intensity={1.2}
              autoAnimate
              className="w-full mt-2"
            >
              <span className="flex items-center justify-center gap-2">
                <span>{isLoading ? "Enlisting Operative..." : "Initialize Operative Sheet"}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </SpecularButton>
          )}
        </form>

        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-[var(--accent-active)] hover:underline font-bold font-mono"
          >
            Connect Neural Link
          </Link>
        </div>
      </div>
    </div>
  );
}
