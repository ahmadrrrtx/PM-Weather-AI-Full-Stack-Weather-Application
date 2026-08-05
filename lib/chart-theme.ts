import type { UnitPrefs } from "@/lib/types";
import { formatPrecipitation, formatSpeed, formatTemperature } from "@/lib/units";

/* ─────────────────────────────────────────────
   Shared ECharts theming — minimal, clean.
   ───────────────────────────────────────────── */

export const AXIS_LABEL = {
  color: "rgba(255,255,255,0.25)",
  fontSize: 10,
  fontFamily: "'Inter', sans-serif",
};

export const AXIS_LINE = {
  lineStyle: { color: "rgba(255,255,255,0.05)" },
};

export const SPLIT_LINE = {
  lineStyle: { color: "rgba(255,255,255,0.03)", type: "dashed" as const },
};

export const GRID = {
  left: 8,
  right: 8,
  top: 24,
  bottom: 4,
  containLabel: true,
};

export const GLASS_TOOLTIP = {
  backgroundColor: "rgba(10,15,26,0.95)",
  borderColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  padding: [10, 14],
  textStyle: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  className: "echarts-tooltip",
  confine: true,
  extraCssText:
    "border-radius:10px;backdrop-filter:blur(12px);box-shadow:0 12px 40px -12px rgba(0,0,0,0.5);",
};

export const PALETTE = {
  cyan: "#5ce1e6",
  sky: "#38bdf8",
  blue: "#4f7cff",
  violet: "#a78bfa",
  amber: "#f59e0b",
  mint: "#6ee7b7",
  rose: "#f87171",
  slate: "#94a3b8",
  white20: "rgba(255,255,255,0.20)",
  white40: "rgba(255,255,255,0.40)",
};

/* ─────────────── Value formatters ─────────────── */

export function makeTempFormatter(units: UnitPrefs) {
  return (v: number) => formatTemperature(v, units);
}

export function makePrecipFormatter(units: UnitPrefs) {
  return (v: number) => `${formatPrecipitation(v, units)} ${units.precipitation === "inch" ? "in" : "mm"}`;
}

export function makeSpeedFormatter(units: UnitPrefs) {
  return (v: number) => `${formatSpeed(v, units)} ${units.speed === "mph" ? "mph" : "km/h"}`;
}
