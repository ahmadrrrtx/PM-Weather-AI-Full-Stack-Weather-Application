"use client";

/* ─────────────────────────────
   SkipLink — keyboard-first jump
   to main content.
   ───────────────────────────── */

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-xl border border-aurora-cyan/40 bg-[#061020] px-4 py-2.5 text-xs font-semibold text-aurora-cyan shadow-2xl transition-transform focus:translate-y-0"
    >
      Skip to main content
    </a>
  );
}
