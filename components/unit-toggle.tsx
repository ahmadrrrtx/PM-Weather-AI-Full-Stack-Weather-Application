"use client";

import { useAppStore } from "@/lib/store";
import type { UnitSystem } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   UnitToggle — °C / °F segmented switch.
   ───────────────────────────── */

export function UnitToggle() {
  const system = useAppStore((s) => s.unitSystem);
  const setUnitSystem = useAppStore((s) => s.setUnitSystem);

  const options: Array<{ id: UnitSystem; label: string; title: string }> = [
    { id: "metric", label: "°C", title: "Metric units" },
    { id: "imperial", label: "°F", title: "Imperial units" },
  ];

  return (
    <div
      role="group"
      aria-label="Units"
      className="glass hidden shrink-0 items-center gap-0.5 rounded-xl p-1 sm:flex"
    >
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => setUnitSystem(o.id)}
          aria-pressed={system === o.id}
          title={o.title}
          className={cn(
            "h-7 w-9 rounded-lg text-xs font-bold transition-all duration-200",
            system === o.id
              ? "bg-gradient-to-r from-aurora-sky/30 to-aurora-violet/30 text-aurora-cyan border border-aurora-cyan/30"
              : "text-white/40 hover:text-white/80",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
