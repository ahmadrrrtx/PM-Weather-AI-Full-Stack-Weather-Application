"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Wind } from "lucide-react";
import type { AirQualityPoint } from "@/lib/types";
import { aqiLabel } from "@/lib/format";
import { SectionLabel } from "@/components/ui/section-label";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Skeleton } from "@/components/ui/skeleton";

const AqiChart = dynamic(
  () => import("@/components/charts/aqi-chart").then((m) => m.AqiChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-40 w-full rounded-xl" label="Loading chart" />,
  },
);

/* ─────────────────────────────
   AqiPanel — live air quality:
   US AQI hero + component breakdown
   vs WHO guidelines + 24h trend.
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
  limit: number; // WHO guideline (µg/m³, CO in µg/m³)
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
    <section aria-label={`Air quality in ${locationName}`} className="space-y-4">
      <div className="flex items-center gap-5">
        {/* AQI hero */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,180,255,0.1)" strokeWidth="7" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke={aqi.tone}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${(Math.min(current.usAqi, max) / max) * 264} 264`}
              initial={{ strokeDasharray: 0 }}
              animate={{ strokeDasharray: `${(Math.min(current.usAqi, max) / max) * 264} 264` }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute text-center">
            <NumberTicker value={Math.round(current.usAqi)} className="tabular font-display text-2xl font-bold text-white" />
            <p className="text-[8px] uppercase tracking-widest text-white/40">US AQI</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold" style={{ color: aqi.tone }}>
            {aqi.label}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
            <Wind className="h-3.5 w-3.5 text-aurora-violet" aria-hidden />
            Live air quality index
          </p>
        </div>
      </div>

      {/* Component breakdown */}
      <div>
        <SectionLabel>Particulates &amp; Gases</SectionLabel>
        <div className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-2">
          {COMPONENTS.map((c) => {
            const value = current[c.key];
            const pct = Math.min((value / c.limit) * 100, 100);
            const over = value > c.limit;
            return (
              <div key={c.key} className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-[10px] text-white/50">{c.label}</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className={`h-full rounded-full ${over ? "bg-aurora-rose" : "bg-gradient-to-r from-aurora-mint to-aurora-sky"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </div>
                <span className={`tabular w-16 text-right text-[10px] ${over ? "text-aurora-rose" : "text-white/60"}`}>
                  {value >= 1000 ? (value / 1000).toFixed(1) + "k" : Math.round(value)}{" "}
                  <span className="text-white/30">{c.unit}</span>
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
