"use client";

import { motion } from "framer-motion";
import { Droplets, Sunrise, Sunset, Wind } from "lucide-react";
import type { DailyPoint, UnitPrefs } from "@/lib/types";
import { formatTemperature } from "@/lib/units";
import { formatPrecipitation } from "@/lib/units";
import { weekdayLabel } from "@/lib/format";
import { getCondition } from "@/lib/weather-codes";
import { WeatherIconForCode } from "@/components/icons/weather-icons";

/* ─────────────────────────────
   DailyList — 7-day forecast
   with temperature range bar.
   ───────────────────────────── */

interface Props {
  daily: DailyPoint[];
  units: UnitPrefs;
  detailed?: boolean;
}

export function DailyList({ daily, units, detailed = false }: Props) {
  if (daily.length === 0) return null;

  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const span = Math.max(globalMax - globalMin, 1);

  return (
    <div role="list" aria-label="Seven day forecast" className="space-y-1">
      {daily.map((d, i) => {
        const cond = getCondition(d.weatherCode);
        const leftPct = ((d.tempMin - globalMin) / span) * 100;
        const widthPct = Math.max(((d.tempMax - d.tempMin) / span) * 100, 6);
        const isToday = i === 0;

        return (
          <motion.div
            key={d.date}
            role="listitem"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.03 * i, duration: 0.3, ease: "easeOut" }}
            className={`group rounded-lg border px-3.5 py-2 transition-colors duration-150 ${
              isToday
                ? "border-accent/15 bg-accent/[0.02]"
                : "border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-10 text-[12px] font-medium ${isToday ? "text-accent/70" : "text-white/40"}`}
              >
                {isToday ? "Today" : weekdayLabel(d.date)}
              </span>

              <span className="h-6 w-6 shrink-0" aria-hidden>
                <WeatherIconForCode code={d.weatherCode} isDay />
              </span>

              <span className="hidden w-20 truncate text-[10px] text-white/25 sm:block">
                {cond.label}
              </span>

              <span className="tabular w-8 text-right text-[11px] font-medium text-white/30">
                {formatTemperature(d.tempMin, units)}
              </span>

              {/* Range bar */}
              <div className="relative h-1 flex-1 rounded-full bg-white/[0.04]">
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-white/20 to-white/40 transition-all duration-300 group-hover:from-accent/40 group-hover:to-accent/60"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  aria-hidden
                />
              </div>

              <span className="tabular w-8 text-[12px] font-semibold text-white/70">
                {formatTemperature(d.tempMax, units)}
              </span>

              {d.precipitationProbabilityMax >= 5 && (
                <span className="tabular hidden w-10 items-center gap-0.5 text-[9px] text-white/25 sm:inline-flex">
                  <Droplets className="h-2.5 w-2.5" aria-hidden />
                  {d.precipitationProbabilityMax}%
                </span>
              )}
            </div>

            {detailed && (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/[0.03] pt-2 text-[10px] text-white/25">
                <span className="inline-flex items-center gap-1">
                  <Sunrise className="h-3 w-3 text-warm/60" aria-hidden />
                  {d.sunrise.slice(11, 16)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sunset className="h-3 w-3 text-white/20" aria-hidden />
                  {d.sunset.slice(11, 16)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Wind className="h-3 w-3 text-white/20" aria-hidden />
                  {Math.round(d.windSpeedMax)}{" "}
                  {units.speed === "mph" ? "mph" : "km/h"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-white/20" aria-hidden />
                  {formatPrecipitation(d.precipitationSum, units)}{" "}
                  {units.precipitation === "inch" ? "in" : "mm"}
                </span>
                <span className="text-white/20">UV {Math.round(d.uvIndexMax)}</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
