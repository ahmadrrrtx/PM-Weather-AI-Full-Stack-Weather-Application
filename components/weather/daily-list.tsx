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
   DailyList — 7-day forecast rows with
   a relative min/max temperature bar.
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
    <div role="list" aria-label="Seven day forecast" className="space-y-1.5">
      {daily.map((d, i) => {
        const cond = getCondition(d.weatherCode);
        const leftPct = ((d.tempMin - globalMin) / span) * 100;
        const widthPct = Math.max(((d.tempMax - d.tempMin) / span) * 100, 6);
        const isToday = i === 0;

        return (
          <motion.div
            key={d.date}
            role="listitem"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4, ease: "easeOut" }}
            className={`glass group rounded-xl px-3.5 py-2.5 transition-all duration-200 hover:border-aurora-cyan/30 ${
              isToday ? "border-aurora-cyan/30" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-11 text-xs font-semibold ${isToday ? "text-aurora-cyan" : "text-white/60"}`}
              >
                {isToday ? "Today" : weekdayLabel(d.date)}
              </span>

              <span className="h-7 w-7 shrink-0" aria-hidden>
                <WeatherIconForCode code={d.weatherCode} isDay />
              </span>

              <span className="hidden w-24 truncate text-[10px] text-white/40 sm:block">
                {cond.label}
              </span>

              <span className="tabular w-9 text-right text-xs font-medium text-white/45">
                {formatTemperature(d.tempMin, units)}
              </span>

              {/* Range bar */}
              <div className="relative h-1.5 flex-1 rounded-full bg-white/[0.06]">
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-aurora-sky/80 to-aurora-violet/80 transition-all duration-500 group-hover:from-aurora-cyan group-hover:to-aurora-violet"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  aria-hidden
                />
              </div>

              <span className="tabular w-9 text-xs font-semibold text-white">
                {formatTemperature(d.tempMax, units)}
              </span>

              {d.precipitationProbabilityMax >= 5 && (
                <span className="tabular hidden w-12 items-center gap-1 text-[10px] text-aurora-sky/85 sm:inline-flex">
                  <Droplets className="h-3 w-3" aria-hidden />
                  {d.precipitationProbabilityMax}%
                </span>
              )}
            </div>

            {detailed && (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/[0.05] pt-2 text-[10px] text-white/40">
                <span className="inline-flex items-center gap-1">
                  <Sunrise className="h-3 w-3 text-aurora-amber" aria-hidden />
                  {d.sunrise.slice(11, 16)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sunset className="h-3 w-3 text-aurora-violet" aria-hidden />
                  {d.sunset.slice(11, 16)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Wind className="h-3 w-3 text-aurora-mint" aria-hidden />
                  {Math.round(d.windSpeedMax)}{" "}
                  {units.speed === "mph" ? "mph" : "km/h"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-aurora-sky" aria-hidden />
                  {formatPrecipitation(d.precipitationSum, units)}{" "}
                  {units.precipitation === "inch" ? "in" : "mm"}
                </span>
                <span className="text-white/30">UV {Math.round(d.uvIndexMax)}</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
