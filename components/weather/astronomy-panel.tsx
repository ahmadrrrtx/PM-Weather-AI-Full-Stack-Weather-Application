"use client";

import { Moon, Sunrise } from "lucide-react";
import type { AstronomyDay } from "@/lib/open-meteo";
import { durationLabel, moonPhaseLabel } from "@/lib/format";
import { SectionLabel } from "@/components/ui/section-label";

/* ─────────────────────────────
   AstronomyPanel — sun & moon watch:
   daylight arc, moon phase visual,
   rise/set times.
   ───────────────────────────── */

interface Props {
  days: AstronomyDay[];
  timezone: string;
  locationName: string;
}

/** SVG moon phase visual (0=new, 0.5=full). */
function MoonPhaseVisual({ phase }: { phase: number }) {
  const p = ((phase % 1) + 1) % 1;
  const R = 22;
  const term = Math.abs(Math.cos(p * Math.PI)) * R; // terminator ellipse width
  const waxing = p < 0.5;

  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
      <defs>
        <clipPath id="moon-left">
          <rect x="0" y="0" width="32" height="64" />
        </clipPath>
        <clipPath id="moon-right">
          <rect x="32" y="0" width="32" height="64" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r={R} fill="#e6eeff" />
      <circle cx="32" cy="32" r={R} fill="#0a1220" clipPath="url(#moon-left)" />
      <ellipse
        cx={waxing ? 32 + term : 32 - term}
        cy="32"
        rx={term}
        ry={R}
        fill="#0a1220"
        clipPath={`url(#moon-${waxing ? "right" : "left"})`}
      />
      <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(148,180,255,0.25)" strokeWidth="1" />
    </svg>
  );
}

/** Sun day arc — sun position between sunrise and sunset. */
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
        {/* night ground */}
        <rect x="0" y="36" width="100" height="12" rx="6" fill="rgba(148,180,255,0.05)" />
        {/* arc */}
        <path
          d="M 8 40 Q 50 -22 92 40"
          fill="none"
          stroke="rgba(103,232,249,0.25)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
        {/* sun position */}
        <circle cx={x} cy={y} r="3.4" fill={isNight ? "rgba(148,180,255,0.3)" : "#fbbf24"}>
          {!isNight && (
            <animate attributeName="opacity" values="1;0.6;1" dur="2.6s" repeatCount="indefinite" />
          )}
        </circle>
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
    <section aria-label={`Sun and moon in ${locationName}`} className="space-y-4">
      <div>
        <SectionLabel icon={<Sunrise className="h-3 w-3" aria-hidden />}>Solar Watch</SectionLabel>
        <div className="mt-2.5 grid grid-cols-3 gap-2.5 text-center">
          <div className="glass rounded-xl px-2 py-2.5">
            <p className="hud-label !text-[8.5px]">Sunrise</p>
            <p className="tabular mt-1 text-sm font-semibold text-aurora-amber">{sunriseT}</p>
          </div>
          <div className="glass rounded-xl px-2 py-2.5">
            <p className="hud-label !text-[8.5px]">Daylight</p>
            <p className="tabular mt-1 text-sm font-semibold text-white">{daylight}</p>
          </div>
          <div className="glass rounded-xl px-2 py-2.5">
            <p className="hud-label !text-[8.5px]">Sunset</p>
            <p className="tabular mt-1 text-sm font-semibold text-aurora-violet">{sunsetT}</p>
          </div>
        </div>
        <DayArc day={today} />
      </div>

      <div>
        <SectionLabel icon={<Moon className="h-3 w-3" aria-hidden />}>Lunar Watch</SectionLabel>
        <div className="mt-2.5 flex items-center gap-4">
          <div className="glass flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl">
            <MoonPhaseVisual phase={today.moonPhase} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{phaseLabel}</p>
            <p className="tabular mt-1 text-[10px] text-white/45">
              Moonrise {moonriseT ?? "—"} · Moonset {moonsetT ?? "—"}
            </p>
            <p className="mt-0.5 text-[10px] text-white/30">
              Phase {Math.round(today.moonPhase * 100)}% of lunation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
