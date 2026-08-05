import type { UnitPrefs } from "@/lib/types";
import { formatPrecipitation, formatSpeed, formatTemperature } from "@/lib/units";

/* ─────────────────────────────────────────────
   Display formatting — dates, times, compass,
   human labels. Pure functions, unit-tested.
   ───────────────────────────────────────────── */

/** Format an ISO time string in a target IANA timezone. */
export function formatTime(
  iso: string,
  timezone: string,
  opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" },
): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      ...opts,
      timeZone: timezone,
    }).format(new Date(iso));
  } catch {
    return new Intl.DateTimeFormat("en-US", opts).format(new Date(iso));
  }
}

/** Short weekday from a YYYY-MM-DD date. */
export function weekdayLabel(dateStr: string, opts: Intl.DateTimeFormatOptions = {}): string {
  const d = parseDateOnly(dateStr);
  return new Intl.DateTimeFormat("en-US", { weekday: "short", ...opts }).format(d);
}

export function dayLabel(dateStr: string): string {
  const d = parseDateOnly(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function monthDayLabel(dateStr: string): string {
  const d = parseDateOnly(dateStr);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}

/** Parse YYYY-MM-DD as local date (avoids UTC off-by-one). */
export function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1, 12, 0, 0);
}

/** 16-point compass label from degrees. */
export function windDirectionLabel(degrees: number): string {
  const dirs = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ];
  const idx = Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16;
  return dirs[idx] ?? "N";
}

export function uvLabel(uv: number): { label: string; tone: string } {
  if (uv <= 2) return { label: "Low", tone: "#6ee7b7" };
  if (uv <= 5) return { label: "Moderate", tone: "#fde047" };
  if (uv <= 7) return { label: "High", tone: "#fb923c" };
  if (uv <= 10) return { label: "Very High", tone: "#f87171" };
  return { label: "Extreme", tone: "#c084fc" };
}

export function aqiLabel(aqi: number): { label: string; tone: string } {
  if (aqi <= 50) return { label: "Good", tone: "#6ee7b7" };
  if (aqi <= 100) return { label: "Moderate", tone: "#fde047" };
  if (aqi <= 150) return { label: "Unhealthy (Sensitive)", tone: "#fb923c" };
  if (aqi <= 200) return { label: "Unhealthy", tone: "#f87171" };
  if (aqi <= 300) return { label: "Very Unhealthy", tone: "#c084fc" };
  return { label: "Hazardous", tone: "#e11d48" };
}

export function moonPhaseLabel(phase: number): string {
  const p = ((phase % 1) + 1) % 1;
  if (p < 0.03 || p > 0.97) return "New Moon";
  if (p < 0.22) return "Waxing Crescent";
  if (p < 0.28) return "First Quarter";
  if (p < 0.47) return "Waxing Gibbous";
  if (p < 0.53) return "Full Moon";
  if (p < 0.72) return "Waning Gibbous";
  if (p < 0.78) return "Last Quarter";
  return "Waning Crescent";
}

/** Convert seconds to "Xh Ym". */
export function durationLabel(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/** "Now" helper for the current-hour marker. */
export function isSameHour(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate() &&
    d.getHours() === ref.getHours()
  );
}

/** Compact "HH:mm" from ISO. */
export function clockTime(iso: string, timezone: string): string {
  return formatTime(iso, timezone, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export interface MetricLine {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}

/** Build the standard metric readout for current conditions. */
export function currentMetrics(
  c: {
    temperature: number;
    apparentTemperature: number;
    relativeHumidity: number;
    windSpeed: number;
    windDirection: number;
    windGusts: number;
    pressureMsl: number;
    visibility: number;
    precipitation: number;
    snowfall: number;
    uvIndex: number;
    dewPoint: number;
    cloudCover: number;
  },
  units: UnitPrefs,
): MetricLine[] {
  return [
    {
      label: "Feels Like",
      value: formatTemperature(c.apparentTemperature, units),
      sub: c.apparentTemperature > c.temperature ? "warmer" : "cooler",
    },
    {
      label: "Humidity",
      value: `${Math.round(c.relativeHumidity)}%`,
      sub: humidityLabel(c.relativeHumidity),
    },
    {
      label: "Wind",
      value: formatSpeed(c.windSpeed, units),
      sub: `${SPEED_UNIT_LABEL[units.speed]} · ${windDirectionLabel(c.windDirection)}`,
    },
    {
      label: "Gusts",
      value: formatSpeed(c.windGusts, units),
      sub: SPEED_UNIT_LABEL[units.speed],
    },
    {
      label: "Pressure",
      value: `${Math.round(c.pressureMsl)}`,
      sub: "hPa",
    },
    {
      label: "Visibility",
      value: visibilityLabel(c.visibility, units),
      sub: visibilityQuality(c.visibility),
    },
    {
      label: "Precipitation",
      value: formatPrecipitation(c.precipitation, units),
      sub: PRECIP_UNIT_LABEL[units.precipitation],
    },
    {
      label: "Snowfall",
      value: `${c.snowfall.toFixed(1)} cm`,
      sub: c.snowfall > 0 ? "on ground" : "none",
    },
    {
      label: "Dew Point",
      value: formatTemperature(c.dewPoint, units),
      sub: comfortLabel(c.dewPoint),
    },
    {
      label: "UV Index",
      value: `${Math.round(c.uvIndex)}`,
      sub: uvLabel(c.uvIndex).label,
    },
    {
      label: "Cloud Cover",
      value: `${Math.round(c.cloudCover)}%`,
      sub: cloudLabel(c.cloudCover),
    },
  ];
}

function visibilityLabel(meters: number, units: UnitPrefs): string {
  const km = meters / 1000;
  if (units.system === "imperial") return `${(km * 0.621371).toFixed(1)} mi`;
  return km >= 10 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
}

function humidityLabel(h: number): string {
  if (h < 30) return "Very Dry";
  if (h < 50) return "Comfortable";
  if (h < 70) return "Moderate";
  if (h < 85) return "Humid";
  return "Very Humid";
}

function visibilityQuality(m: number): string {
  const km = m / 1000;
  if (km < 1) return "Very poor";
  if (km < 4) return "Poor";
  if (km < 10) return "Moderate";
  if (km < 30) return "Good";
  return "Excellent";
}

function cloudLabel(cover: number): string {
  if (cover < 10) return "Clear";
  if (cover < 40) return "Few clouds";
  if (cover < 70) return "Scattered";
  if (cover < 95) return "Broken";
  return "Overcast";
}

function comfortLabel(dew: number): string {
  if (dew < 10) return "Dry";
  if (dew < 16) return "Comfortable";
  if (dew < 21) return "Humid";
  return "Oppressive";
}

export const SPEED_UNIT_LABEL: Record<UnitPrefs["speed"], string> = {
  kmh: "km/h",
  mph: "mph",
};

export const PRECIP_UNIT_LABEL: Record<UnitPrefs["precipitation"], string> = {
  mm: "mm",
  inch: "in",
};
