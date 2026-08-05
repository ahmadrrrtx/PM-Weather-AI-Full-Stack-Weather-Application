/* ─────────────────────────────────────────────
   WMO Weather Code → condition metadata
   Drives icons, labels, and aurora color theming.
   ───────────────────────────────────────────── */

export type ConditionGroup =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "freezing-rain"
  | "snow"
  | "snow-showers"
  | "showers"
  | "thunder"
  | "thunder-hail";

export interface ConditionMeta {
  code: number;
  label: string;
  group: ConditionGroup;
  /** aurora accent used for theming panels */
  accent: string;
}

const TABLE: Record<number, Omit<ConditionMeta, "code">> = {
  0: { label: "Clear Sky", group: "clear", accent: "#67e8f9" },
  1: { label: "Mainly Clear", group: "clear", accent: "#7dd3fc" },
  2: { label: "Partly Cloudy", group: "partly-cloudy", accent: "#93c5fd" },
  3: { label: "Overcast", group: "overcast", accent: "#94a3b8" },
  45: { label: "Fog", group: "fog", accent: "#a5b4c8" },
  48: { label: "Icy Fog", group: "fog", accent: "#b6c3d6" },
  51: { label: "Light Drizzle", group: "drizzle", accent: "#7dd3fc" },
  53: { label: "Drizzle", group: "drizzle", accent: "#60a5fa" },
  55: { label: "Heavy Drizzle", group: "drizzle", accent: "#3b82f6" },
  56: { label: "Freezing Drizzle", group: "freezing-rain", accent: "#93c5fd" },
  57: { label: "Freezing Drizzle", group: "freezing-rain", accent: "#7dd3fc" },
  61: { label: "Light Rain", group: "rain", accent: "#38bdf8" },
  63: { label: "Rain", group: "rain", accent: "#2f8ff8" },
  65: { label: "Heavy Rain", group: "rain", accent: "#2563eb" },
  66: { label: "Freezing Rain", group: "freezing-rain", accent: "#818cf8" },
  67: { label: "Freezing Rain", group: "freezing-rain", accent: "#6366f1" },
  71: { label: "Light Snow", group: "snow", accent: "#c7d8f5" },
  73: { label: "Snow", group: "snow", accent: "#a8c4ee" },
  75: { label: "Heavy Snow", group: "snow", accent: "#8fb0de" },
  77: { label: "Snow Grains", group: "snow", accent: "#b8cce8" },
  80: { label: "Light Showers", group: "showers", accent: "#38bdf8" },
  81: { label: "Showers", group: "showers", accent: "#2f8ff8" },
  82: { label: "Violent Showers", group: "showers", accent: "#1d4ed8" },
  85: { label: "Snow Showers", group: "snow-showers", accent: "#a8c4ee" },
  86: { label: "Snow Showers", group: "snow-showers", accent: "#8fb0de" },
  95: { label: "Thunderstorm", group: "thunder", accent: "#a78bfa" },
  96: { label: "Thunderstorm + Hail", group: "thunder-hail", accent: "#8b5cf6" },
  99: { label: "Thunderstorm + Hail", group: "thunder-hail", accent: "#7c3aed" },
};

export function getCondition(code: number): ConditionMeta {
  const meta = TABLE[code];
  if (!meta) return { code, label: "Unknown", group: "cloudy", accent: "#94a3b8" };
  return { code, ...meta };
}

/** Icon key used by the animated icon system. */
export function iconKey(code: number, isDay: boolean): string {
  const { group } = getCondition(code);
  if (group === "clear") return isDay ? "clear-day" : "clear-night";
  if (group === "partly-cloudy") return isDay ? "partly-day" : "partly-night";
  return group;
}

/** Condition group → severity color for accents (tailwind-safe hex). */
export function conditionColor(code: number): string {
  return getCondition(code).accent;
}

/** Short human label (used in markers/tooltips). */
export function conditionShort(code: number, isDay = true): string {
  const meta = getCondition(code);
  if (meta.group === "clear") return isDay ? "Clear" : "Clear";
  return meta.label;
}
