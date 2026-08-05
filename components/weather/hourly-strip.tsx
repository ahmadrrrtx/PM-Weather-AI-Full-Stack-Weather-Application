"use client";

import type { HourlyPoint, UnitPrefs } from "@/lib/types";
import { formatTemperature } from "@/lib/units";
import { isSameHour } from "@/lib/format";
import { WeatherIconForCode } from "@/components/icons/weather-icons";

/* ─────────────────────────────
   HourlyStrip — the next 24 hours
   in a smooth horizontal rail.
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
      className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1"
      role="list"
      aria-label="Hourly forecast for the next 24 hours"
    >
      {next24.map((h) => {
        const now = isSameHour(h.time, new Date());
        return (
          <div
            key={h.time}
            role="listitem"
            className={`glass flex w-[74px] shrink-0 snap-start flex-col items-center gap-1.5 rounded-xl px-2 py-3 transition-all duration-200 hover:border-aurora-cyan/35 ${
              now ? "border-aurora-cyan/40 bg-aurora-cyan/[0.07]" : ""
            }`}
          >
            <span className={`text-[10px] font-semibold ${now ? "text-aurora-cyan" : "text-white/45"}`}>
              {now ? "Now" : h.time.slice(11, 16)}
            </span>
            <span className="h-7 w-7">
              <WeatherIconForCode code={h.weatherCode} isDay={h.isDay} />
            </span>
            <span className="tabular text-sm font-semibold text-white">
              {formatTemperature(h.temperature, units)}
            </span>
            {h.precipitationProbability >= 5 && (
              <span className="tabular text-[9px] text-aurora-sky/90">
                💧 {h.precipitationProbability}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
