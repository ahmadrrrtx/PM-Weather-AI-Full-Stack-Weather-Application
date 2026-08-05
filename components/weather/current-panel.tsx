"use client";

import { motion } from "framer-motion";
import { Thermometer } from "lucide-react";
import type { CurrentWeather, UnitPrefs } from "@/lib/types";
import { getCondition } from "@/lib/weather-codes";
import { currentMetrics } from "@/lib/format";
import { formatTemperature } from "@/lib/units";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SectionLabel } from "@/components/ui/section-label";
import { WeatherIconForCode } from "@/components/icons/weather-icons";

/* ─────────────────────────────
   CurrentPanel — the mission briefing:
   hero temperature + condition and the
   full telemetry grid.
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
    <section aria-label={`Current weather in ${locationName}`} className="space-y-5">
      {/* Hero */}
      <div className="flex items-center gap-5">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.35, duration: 0.8 }}
          className="h-20 w-20 shrink-0 drop-shadow-[0_0_28px_rgba(103,232,249,0.25)]"
        >
          <WeatherIconForCode
            code={current.weatherCode}
            isDay={current.isDay}
            label={`${condition.label} in ${locationName}`}
          />
        </motion.div>

        <div>
          <div className="flex items-end gap-1.5">
            <NumberTicker
              value={Math.round(current.temperature)}
              className="tabular font-display text-6xl font-bold leading-none text-white text-glow-cyan"
            />
            <span className="pb-1 text-2xl font-light text-aurora-cyan/80">
              {units.temperature === "fahrenheit" ? "°F" : "°C"}
            </span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-white/75">{condition.label}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
            <Thermometer className="h-3.5 w-3.5" aria-hidden />
            Feels like {formatTemperature(current.apparentTemperature, units)}
          </p>
        </div>
      </div>

      {/* Telemetry grid */}
      <div>
        <SectionLabel>Telemetry</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-2.5 xl:grid-cols-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.045, duration: 0.4, ease: "easeOut" }}
              className="glass rounded-xl px-3 py-2.5"
            >
              <p className="hud-label !text-[8.5px]">{m.label}</p>
              <p className="tabular mt-1 text-lg font-semibold text-white">
                {m.value}
                {m.sub && (
                  <span className="ml-1.5 text-[10px] font-normal text-white/40">
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
