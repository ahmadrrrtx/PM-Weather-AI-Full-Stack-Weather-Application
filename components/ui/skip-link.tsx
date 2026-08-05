"use client";

/* ─────────────────────────────
   SkipLink — keyboard-first jump
   to main content.
   ───────────────────────────── */

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg border border-accent/30 bg-[#0c1018] px-4 py-2 text-[12px] font-medium text-accent/80 shadow-xl transition-transform focus:translate-y-0"
    >
      Skip to main content
    </a>
  );
}
