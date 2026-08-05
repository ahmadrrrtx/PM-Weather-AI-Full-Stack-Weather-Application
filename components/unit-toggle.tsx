"use client";

import { useAppStore } from "@/lib/store";
import type { UnitSystem } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   UnitToggle — °C / °F.
   Minimal segmented control.
   ───────────────────────────── */

export function UnitToggle() {
  const system = useAppStore((s) => s.unitSystem);
  const setUnitSystem = useAppStore((s) => s.setUnitSystem);

  const options: Array<{ id: UnitSystem; label: string; title: string }> = [
    { id: "metric", label: "°C", title: "Metric" },
    { id: "imperial", label: "°F", title: "Imperial" },
  ];

  return (
    <div
      role="group"
      aria-label="Units"
      className="hidden shrink-0 items-center gap-0.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5 sm:flex"
    >
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => setUnitSystem(o.id)}
          aria-pressed={system === o.id}
          title={o.title}
          className={cn(
            "h-7 w-9 rounded-md text-xs font-semibold transition-all duration-150",
            system === o.id
              ? "bg-white/[0.08] text-white/90"
              : "text-white/30 hover:text-white/50",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
