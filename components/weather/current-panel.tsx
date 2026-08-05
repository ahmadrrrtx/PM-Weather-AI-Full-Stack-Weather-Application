"use client";

import { motion } from "framer-motion";
import type { CurrentWeather, UnitPrefs } from "@/lib/types";
import { getCondition } from "@/lib/weather-codes";
import { currentMetrics } from "@/lib/format";
import { formatTemperature } from "@/lib/units";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SectionLabel } from "@/components/ui/section-label";
import { WeatherIconForCode } from "@/components/icons/weather-icons";

/* ─────────────────────────────
   CurrentPanel — hero temperature
   + condition + telemetry grid.
   ───────────────────────────── */

interface Props {
  current: CurrentWeather;
  locationName: string;
  units: UnitPrefs;
}

export function CurrentPanel({ current, locationName, units }: Props) {
  const condition = getCondition(current.weatherCode);
  const metrics = currentMetrics(current, units);

  return (
    <section aria-label={`Current weather in ${locationName}`} className="space-y-6">
      {/* Hero */}
      <div className="flex items-center gap-5">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
          className="h-16 w-16 shrink-0"
        >
          <WeatherIconForCode
            code={current.weatherCode}
            isDay={current.isDay}
            label={`${condition.label} in ${locationName}`}
          />
        </motion.div>

        <div>
          <div className="flex items-baseline gap-1">
            <NumberTicker
              value={Math.round(current.temperature)}
              className="tabular font-display text-5xl font-bold leading-none text-white/95"
            />
            <span className="text-xl font-light text-white/40">
              {units.temperature === "fahrenheit" ? "°F" : "°C"}
            </span>
          </div>
          <p className="mt-1 text-[13px] font-medium text-white/55">{condition.label}</p>
          <p className="mt-0.5 text-[11px] text-white/30">
            Feels like {formatTemperature(current.apparentTemperature, units)}
          </p>
        </div>
      </div>

      {/* Telemetry grid */}
      <div>
        <SectionLabel>Conditions</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.03, duration: 0.3, ease: "easeOut" }}
              className="rounded-lg border border-white/[0.04] bg-white/[0.015] px-3 py-2.5"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">{m.label}</p>
              <p className="tabular mt-1 text-[15px] font-semibold text-white/85">
                {m.value}
                {m.sub && (
                  <span className="ml-1.5 text-[10px] font-normal text-white/25">
                    {m.sub}
                  </span>
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
