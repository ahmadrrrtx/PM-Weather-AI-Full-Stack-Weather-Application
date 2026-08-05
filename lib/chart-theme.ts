import type { UnitPrefs } from "@/lib/types";
import { formatPrecipitation, formatSpeed, formatTemperature } from "@/lib/units";

/* ─────────────────────────────────────────────
   Shared ECharts theming — dark glass charts.
   All option fragments are pure and typed.
   ───────────────────────────────────────────── */

export const AXIS_LABEL = {
  color: "rgba(148,180,255,0.5)",
  fontSize: 10,
  fontFamily: "'Inter', sans-serif",
};

export const AXIS_LINE = {
  lineStyle: { color: "rgba(148,180,255,0.14)" },
};

export const SPLIT_LINE = {
  lineStyle: { color: "rgba(148,180,255,0.07)", type: "dashed" as const },
};

export const GRID = {
  left: 8,
  right: 8,
  top: 24,
  bottom: 4,
  containLabel: true,
};

export const GLASS_TOOLTIP = {
  backgroundColor: "rgba(8,14,28,0.92)",
  borderColor: "rgba(148,180,255,0.28)",
  borderWidth: 1,
  padding: [10, 14],
  textStyle: { color: "#e8f1ff", fontSize: 11 },
  className: "echarts-tooltip",
  confine: true,
  extraCssText:
    "border-radius:12px;backdrop-filter:blur(14px);box-shadow:0 18px 44px -18px rgba(2,6,18,0.9);",
};

export const PALETTE = {
  cyan: "#67e8f9",
  sky: "#38bdf8",
  blue: "#4f7cff",
  violet: "#a78bfa",
  amber: "#fbbf24",
  mint: "#6ee7b7",
  rose: "#fb7185",
  slate: "#94a3b8",
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
