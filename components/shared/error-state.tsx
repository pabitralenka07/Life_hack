"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "NEURAL LINK INTERRUPTED",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-sm my-4">
      <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-3 text-rose-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold uppercase tracking-wider text-rose-300 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-300 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reconnect Neural Stream
        </button>
      )}
    </div>
  );
}
