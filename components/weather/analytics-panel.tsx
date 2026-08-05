"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CloudRain, Flame, Snowflake, TrendingDown, TrendingUp, Wind } from "lucide-react";
import type { ClimateSummary, UnitPrefs } from "@/lib/types";
import { getCondition } from "@/lib/weather-codes";
import { formatTemperature } from "@/lib/units";
import { monthDayLabel } from "@/lib/format";
import { SectionLabel } from "@/components/ui/section-label";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Skeleton } from "@/components/ui/skeleton";

const ClimateChart = dynamic(
  () => import("@/components/charts/climate-chart").then((m) => m.ClimateChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full rounded-xl" label="Loading chart" />,
  },
);

/* ─────────────────────────────
   AnalyticsPanel — climate data:
   30-day stats, extremes, trends.
   ───────────────────────────── */

interface Props {
  climate: ClimateSummary;
  units: UnitPrefs;
  locationName: string;
}

export function AnalyticsPanel({ climate, units, locationName }: Props) {
  const stats = [
    {
      label: "Avg High",
      value: Math.round(climate.avgMax),
      suffix: units.temperature === "fahrenheit" ? "°F" : "°C",
      icon: <TrendingUp className="h-3 w-3 text-warm/60" aria-hidden />,
    },
    {
      label: "Avg Low",
      value: Math.round(climate.avgMin),
      suffix: units.temperature === "fahrenheit" ? "°F" : "°C",
      icon: <TrendingDown className="h-3 w-3 text-white/25" aria-hidden />,
    },
    {
      label: "Precip",
      value: Math.round(climate.totalPrecipitation),
      suffix: units.precipitation === "inch" ? "in" : "mm",
      icon: <CloudRain className="h-3 w-3 text-white/25" aria-hidden />,
    },
    {
      label: "Wind",
      value: Math.round(climate.avgWindMax),
      suffix: units.speed === "mph" ? "mph" : "km/h",
      icon: <Wind className="h-3 w-3 text-white/25" aria-hidden />,
    },
  ];

  const conditionEntries = Object.entries(climate.conditionDays)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCount = conditionEntries[0]?.[1] ?? 1;

  return (
    <section aria-label={`Climate analytics for ${locationName}`} className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="rounded-lg border border-white/[0.04] bg-white/[0.01] px-3 py-2.5"
          >
            <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-white/20">
              {s.icon}
              {s.label}
            </p>
            <p className="tabular mt-1 font-display text-lg font-bold text-white/85">
              <NumberTicker value={s.value} />
              <span className="ml-1 text-[10px] font-light text-white/25">{s.suffix}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Extremes */}
      <div className="grid grid-cols-2 gap-2">
        {climate.hottest && (
          <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] px-3 py-2.5">
            <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-white/20">
              <Flame className="h-3 w-3 text-warm/50" aria-hidden />
              Hottest
            </p>
            <p className="tabular mt-1 text-[15px] font-semibold text-white/80">
              {formatTemperature(climate.hottest.tempMax, units)}
              <span className="ml-2 text-[10px] font-normal text-white/25">
                {monthDayLabel(climate.hottest.date)}
              </span>
            </p>
          </div>
        )}
        {climate.coldest && (
          <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] px-3 py-2.5">
            <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-white/20">
              <Snowflake className="h-3 w-3 text-white/20" aria-hidden />
              Coldest
            </p>
            <p className="tabular mt-1 text-[15px] font-semibold text-white/80">
              {formatTemperature(climate.coldest.tempMin, units)}
              <span className="ml-2 text-[10px] font-normal text-white/25">
                {monthDayLabel(climate.coldest.date)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* 30-day chart */}
      <div>
        <SectionLabel>30-Day Trend</SectionLabel>
        <div className="mt-2.5">
          <ClimateChart climate={climate} units={units} />
        </div>
      </div>

      {/* Condition signature */}
      {conditionEntries.length > 0 && (
        <div>
          <SectionLabel>Weather Patterns</SectionLabel>
          <div className="mt-2.5 space-y-1.5">
            {conditionEntries.map(([code, count], i) => {
              const cond = getCondition(Number(code));
              const pct = Math.round((count / Math.max(climate.points.length, 1)) * 100);
              return (
                <div key={code} className="flex items-center gap-3">
                  <span className="w-28 truncate text-[10px] text-white/30">{cond.label}</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.03]">
                    <motion.div
                      className="h-full rounded-full bg-white/15"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCount) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                    />
                  </div>
                  <span className="tabular w-12 text-right text-[10px] text-white/25">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
