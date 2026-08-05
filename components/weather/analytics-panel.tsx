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
    loading: () => <Skeleton className="h-52 w-full rounded-xl" label="Loading chart" />,
  },
);

/* ─────────────────────────────
   AnalyticsPanel — climate pulse:
   30-day stats, extremes, and the
   dominant weather signature.
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
      icon: <TrendingUp className="h-3.5 w-3.5 text-aurora-amber" aria-hidden />,
    },
    {
      label: "Avg Low",
      value: Math.round(climate.avgMin),
      suffix: units.temperature === "fahrenheit" ? "°F" : "°C",
      icon: <TrendingDown className="h-3.5 w-3.5 text-aurora-sky" aria-hidden />,
    },
    {
      label: "Total Precip",
      value: Math.round(climate.totalPrecipitation),
      suffix: units.precipitation === "inch" ? "in" : "mm",
      icon: <CloudRain className="h-3.5 w-3.5 text-aurora-sky" aria-hidden />,
    },
    {
      label: "Avg Wind Max",
      value: Math.round(climate.avgWindMax),
      suffix: units.speed === "mph" ? "mph" : "km/h",
      icon: <Wind className="h-3.5 w-3.5 text-aurora-mint" aria-hidden />,
    },
  ];

  const conditionEntries = Object.entries(climate.conditionDays)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCount = conditionEntries[0]?.[1] ?? 1;

  return (
    <section aria-label={`Climate analytics for ${locationName}`} className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="glass rounded-xl px-3.5 py-3"
          >
            <p className="flex items-center gap-1.5 hud-label !text-[8.5px]">
              {s.icon}
              {s.label}
            </p>
            <p className="tabular mt-1.5 font-display text-xl font-bold text-white">
              <NumberTicker value={s.value} />
              <span className="ml-1 text-[11px] font-light text-white/40">{s.suffix}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Extremes */}
      <div className="grid grid-cols-2 gap-2.5">
        {climate.hottest && (
          <div className="glass rounded-xl px-3.5 py-3">
            <p className="flex items-center gap-1.5 hud-label !text-[8.5px]">
              <Flame className="h-3 w-3 text-aurora-amber" aria-hidden />
              Hottest Day
            </p>
            <p className="tabular mt-1.5 text-lg font-semibold text-white">
              {formatTemperature(climate.hottest.tempMax, units)}
              <span className="ml-2 text-[10px] font-normal text-white/40">
                {monthDayLabel(climate.hottest.date)}
              </span>
            </p>
          </div>
        )}
        {climate.coldest && (
          <div className="glass rounded-xl px-3.5 py-3">
            <p className="flex items-center gap-1.5 hud-label !text-[8.5px]">
              <Snowflake className="h-3 w-3 text-aurora-sky" aria-hidden />
              Coldest Day
            </p>
            <p className="tabular mt-1.5 text-lg font-semibold text-white">
              {formatTemperature(climate.coldest.tempMin, units)}
              <span className="ml-2 text-[10px] font-normal text-white/40">
                {monthDayLabel(climate.coldest.date)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* 30-day chart */}
      <div>
        <SectionLabel>30-Day Climate Pulse</SectionLabel>
        <div className="mt-2.5">
          <ClimateChart climate={climate} units={units} />
        </div>
      </div>

      {/* Condition signature */}
      {conditionEntries.length > 0 && (
        <div>
          <SectionLabel>Weather Signature</SectionLabel>
          <div className="mt-2.5 space-y-2">
            {conditionEntries.map(([code, count], i) => {
              const cond = getCondition(Number(code));
              const pct = Math.round((count / Math.max(climate.points.length, 1)) * 100);
              return (
                <div key={code} className="flex items-center gap-3">
                  <span className="w-32 truncate text-[10px] text-white/55">{cond.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: cond.accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCount) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                    />
                  </div>
                  <span className="tabular w-14 text-right text-[10px] text-white/45">
                    {count} days · {pct}%
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
