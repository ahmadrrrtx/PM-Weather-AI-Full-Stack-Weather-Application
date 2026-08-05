"use client";

import type { HourlyPoint, UnitPrefs } from "@/lib/types";
import { formatTemperature } from "@/lib/units";
import { isSameHour } from "@/lib/format";
import { WeatherIconForCode } from "@/components/icons/weather-icons";

/* ─────────────────────────────
   HourlyStrip — next 24 hours
   in a horizontal scroll.
   ───────────────────────────── */

export function HourlyStrip({
  hourly,
  units,
}: {
  hourly: HourlyPoint[];
  units: UnitPrefs;
}) {
  const next24 = hourly.slice(0, 24);

  return (
    <div
      className="no-scrollbar -mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1"
      role="list"
      aria-label="Hourly forecast for the next 24 hours"
    >
      {next24.map((h) => {
        const now = isSameHour(h.time, new Date());
        return (
          <div
            key={h.time}
            role="listitem"
            className={`flex w-[68px] shrink-0 snap-start flex-col items-center gap-1 rounded-lg border px-2 py-2.5 transition-colors duration-150 ${
              now
                ? "border-accent/20 bg-accent/[0.04]"
                : "border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03]"
            }`}
          >
            <span className={`text-[10px] font-medium ${now ? "text-accent/80" : "text-white/30"}`}>
              {now ? "Now" : h.time.slice(11, 16)}
            </span>
            <span className="h-6 w-6">
              <WeatherIconForCode code={h.weatherCode} isDay={h.isDay} />
            </span>
            <span className="tabular text-[13px] font-semibold text-white/80">
              {formatTemperature(h.temperature, units)}
            </span>
            {h.precipitationProbability >= 5 && (
              <span className="tabular text-[9px] text-white/25">
                {h.precipitationProbability}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
