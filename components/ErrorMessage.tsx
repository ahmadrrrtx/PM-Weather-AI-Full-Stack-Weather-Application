"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, X } from "lucide-react";

interface Props {
  error: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onDismiss, onRetry }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      className="glass rounded-xl border border-red-500/30 bg-red-500/10 p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-red-300 text-sm">Error</p>
          <p className="text-white/70 text-sm mt-0.5 break-words">{error}</p>
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                Try Again
              </button>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all shrink-0"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
