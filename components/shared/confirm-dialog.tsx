"use client";

import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-6 shadow-2xl shadow-[var(--primary-purple)]/20">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDestructive
                ? "bg-[var(--error)]/15 text-[var(--error)] border border-[var(--error)]/30"
                : "bg-[var(--primary-purple)]/15 text-[var(--accent-active)] border border-[var(--accent-active)]/30"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 id="dialog-title" className="text-lg font-bold text-[var(--text-primary)] font-mono">
            {title}
          </h3>
        </div>
        <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              isDestructive
                ? "bg-[var(--error)] hover:brightness-110 text-white shadow-lg shadow-[var(--error)]/20"
                : "btn-primary shadow-lg"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
