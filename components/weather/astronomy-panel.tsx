"use client";

import { Moon, Sunrise } from "lucide-react";
import type { AstronomyDay } from "@/lib/open-meteo";
import { durationLabel, moonPhaseLabel } from "@/lib/format";
import { SectionLabel } from "@/components/ui/section-label";

/* ─────────────────────────────
   AstronomyPanel — sun & moon:
   daylight arc, moon phase,
   rise/set times.
   ───────────────────────────── */

interface Props {
  days: AstronomyDay[];
  timezone: string;
  locationName: string;
}

/** SVG moon phase visual. */
function MoonPhaseVisual({ phase }: { phase: number }) {
  const p = ((phase % 1) + 1) % 1;
  const R = 20;
  const term = Math.abs(Math.cos(p * Math.PI)) * R;
  const waxing = p < 0.5;

  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
      <defs>
        <clipPath id="moon-left">
          <rect x="0" y="0" width="32" height="64" />
        </clipPath>
        <clipPath id="moon-right">
          <rect x="32" y="0" width="32" height="64" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r={R} fill="#dfe9ff" />
      <circle cx="32" cy="32" r={R} fill="#0a1220" clipPath="url(#moon-left)" />
      <ellipse
        cx={waxing ? 32 + term : 32 - term}
        cy="32"
        rx={term}
        ry={R}
        fill="#0a1220"
        clipPath={`url(#moon-${waxing ? "right" : "left"})`}
      />
      <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
  );
}

/** Sun day arc. */
function DayArc({ day }: { day: AstronomyDay }) {
  const sunrise = day.sunrise ? new Date(day.sunrise) : null;
  const sunset = day.sunset ? new Date(day.sunset) : null;
  const now = new Date();
  let progress = 0.5;

  if (sunrise && sunset && sunrise < now && now < sunset) {
    progress = (now.getTime() - sunrise.getTime()) / (sunset.getTime() - sunrise.getTime());
  } else if (sunrise && sunset) {
    progress = now < sunrise ? 0 : 1;
  }

  const x = 8 + progress * 84;
  const y = 40 - Math.sin(progress * Math.PI) * 34;
  const isNight = progress <= 0 || progress >= 1;

  return (
    <div className="relative mt-1">
      <svg viewBox="0 0 100 48" className="w-full" aria-hidden>
        <rect x="0" y="36" width="100" height="12" rx="6" fill="rgba(255,255,255,0.02)" />
        <path
          d="M 8 40 Q 50 -22 92 40"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
        <circle cx={x} cy={y} r="3" fill={isNight ? "rgba(255,255,255,0.15)" : "#f59e0b"} />
      </svg>
    </div>
  );
}

export function AstronomyPanel({ days, timezone, locationName }: Props) {
  const today = days[0];
  if (!today) return null;
  const phaseLabel = moonPhaseLabel(today.moonPhase);
  const daylight = durationLabel(today.daylight);
  const tz = timezone || "UTC";
  const sunriseT = today.sunrise ? new Date(today.sunrise).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz }) : "—";
  const sunsetT = today.sunset ? new Date(today.sunset).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz }) : "—";
  const moonriseT = today.moonrise ? new Date(today.moonrise).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz }) : null;
  const moonsetT = today.moonset ? new Date(today.moonset).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz }) : null;

  return (
    <section aria-label={`Sun and moon in ${locationName}`} className="space-y-5">
      <div>
        <SectionLabel icon={<Sunrise className="h-3 w-3" aria-hidden />}>Solar</SectionLabel>
        <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] px-2 py-2.5">
            <p className="text-[9px] font-medium uppercase tracking-wider text-white/20">Sunrise</p>
            <p className="tabular mt-1 text-[13px] font-semibold text-warm/70">{sunriseT}</p>
          </div>
          <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] px-2 py-2.5">
            <p className="text-[9px] font-medium uppercase tracking-wider text-white/20">Daylight</p>
            <p className="tabular mt-1 text-[13px] font-semibold text-white/70">{daylight}</p>
          </div>
          <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] px-2 py-2.5">
            <p className="text-[9px] font-medium uppercase tracking-wider text-white/20">Sunset</p>
            <p className="tabular mt-1 text-[13px] font-semibold text-white/40">{sunsetT}</p>
          </div>
        </div>
        <DayArc day={today} />
      </div>

      <div>
        <SectionLabel icon={<Moon className="h-3 w-3" aria-hidden />}>Lunar</SectionLabel>
        <div className="mt-2.5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <MoonPhaseVisual phase={today.moonPhase} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-white/70">{phaseLabel}</p>
            <p className="tabular mt-0.5 text-[10px] text-white/25">
              Rise {moonriseT ?? "—"} · Set {moonsetT ?? "—"}
            </p>
            <p className="mt-0.5 text-[10px] text-white/20">
              {Math.round(today.moonPhase * 100)}% of lunation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
