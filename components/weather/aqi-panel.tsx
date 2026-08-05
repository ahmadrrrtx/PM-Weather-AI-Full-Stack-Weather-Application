"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { AirQualityPoint } from "@/lib/types";
import { aqiLabel } from "@/lib/format";
import { SectionLabel } from "@/components/ui/section-label";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Skeleton } from "@/components/ui/skeleton";

const AqiChart = dynamic(
  () => import("@/components/charts/aqi-chart").then((m) => m.AqiChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-36 w-full rounded-xl" label="Loading chart" />,
  },
);

/* ─────────────────────────────
   AqiPanel — air quality index
   with component breakdown.
   ───────────────────────────── */

interface Props {
  current: AirQualityPoint;
  hourly: AirQualityPoint[];
  locationName: string;
}

type ComponentKey = "pm25" | "pm10" | "o3" | "no2" | "so2" | "co";

interface ComponentDef {
  key: ComponentKey;
  label: string;
  unit: string;
  limit: number;
}

const COMPONENTS: ComponentDef[] = [
  { key: "pm25", label: "PM2.5", unit: "µg/m³", limit: 15 },
  { key: "pm10", label: "PM10", unit: "µg/m³", limit: 45 },
  { key: "o3", label: "O₃", unit: "µg/m³", limit: 100 },
  { key: "no2", label: "NO₂", unit: "µg/m³", limit: 25 },
  { key: "so2", label: "SO₂", unit: "µg/m³", limit: 40 },
  { key: "co", label: "CO", unit: "µg/m³", limit: 4000 },
];

export function AqiPanel({ current, hourly, locationName }: Props) {
  const aqi = aqiLabel(current.usAqi);
  const max = Math.max(current.usAqi, 50);

  return (
    <section aria-label={`Air quality in ${locationName}`} className="space-y-5">
      <div className="flex items-center gap-5">
        {/* AQI ring */}
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke={aqi.tone}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(Math.min(current.usAqi, max) / max) * 264} 264`}
              initial={{ strokeDasharray: 0 }}
              animate={{ strokeDasharray: `${(Math.min(current.usAqi, max) / max) * 264} 264` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute text-center">
            <NumberTicker value={Math.round(current.usAqi)} className="tabular font-display text-xl font-bold text-white/90" />
            <p className="text-[7px] uppercase tracking-widest text-white/25">AQI</p>
          </div>
        </div>

        <div>
          <p className="text-[13px] font-semibold" style={{ color: aqi.tone }}>
            {aqi.label}
          </p>
          <p className="mt-0.5 text-[11px] text-white/30">Air quality index</p>
        </div>
      </div>

      {/* Component breakdown */}
      <div>
        <SectionLabel>Particulates &amp; Gases</SectionLabel>
        <div className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-1.5">
          {COMPONENTS.map((c) => {
            const value = current[c.key];
            const pct = Math.min((value / c.limit) * 100, 100);
            const over = value > c.limit;
            return (
              <div key={c.key} className="flex items-center gap-2">
                <span className="w-10 shrink-0 text-[10px] text-white/30">{c.label}</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                  <motion.div
                    className={`h-full rounded-full ${over ? "bg-red-400/60" : "bg-white/20"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
                <span className={`tabular w-14 text-right text-[10px] ${over ? "text-red-400/80" : "text-white/40"}`}>
                  {value >= 1000 ? (value / 1000).toFixed(1) + "k" : Math.round(value)}{" "}
                  <span className="text-white/20">{c.unit}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AqiChart hourly={hourly} />
    </section>
  );
}
