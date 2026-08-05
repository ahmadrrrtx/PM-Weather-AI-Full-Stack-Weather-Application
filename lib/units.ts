import type { UnitPrefs, UnitSystem } from "@/lib/types";

/* ─────────────────────────────────────────────
   Unit system — metric canon in, display units out.
   All conversions are pure and unit-tested.
   ───────────────────────────────────────────── */

export const UNIT_PRESETS: Record<UnitSystem, UnitPrefs> = {
  metric: {
    system: "metric",
    temperature: "celsius",
    speed: "kmh",
    precipitation: "mm",
  },
  imperial: {
    system: "imperial",
    temperature: "fahrenheit",
    speed: "mph",
    precipitation: "inch",
  },
};

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

export function kmhToMs(kmh: number): number {
  return kmh / 3.6;
}

export function kmhToKnots(kmh: number): number {
  return kmh * 0.539957;
}

export function mmToInch(mm: number): number {
  return mm / 25.4;
}

/** Format temperature for display. */
export function formatTemperature(celsius: number, units: UnitPrefs): string {
  const v =
    units.temperature === "fahrenheit" ? celsiusToFahrenheit(celsius) : celsius;
  return `${Math.round(v)}°`;
}

/** Format temperature with unit letter. */
export function formatTemperatureLong(
  celsius: number,
  units: UnitPrefs,
): string {
  const v =
    units.temperature === "fahrenheit" ? celsiusToFahrenheit(celsius) : celsius;
  return `${v.toFixed(1)}°${units.temperature === "fahrenheit" ? "F" : "C"}`;
}

/** Format wind speed. */
export function formatSpeed(kmh: number, units: UnitPrefs): string {
  let v = kmh;
  switch (units.speed) {
    case "mph":
      v = kmhToMph(kmh);
      break;
    case "kmh":
      break;
  }
  const rounded = v < 10 ? Math.round(v * 10) / 10 : Math.round(v);
  return `${rounded}`;
}

export const SPEED_UNIT_LABEL: Record<UnitPrefs["speed"], string> = {
  kmh: "km/h",
  mph: "mph",
};

/** Format precipitation depth ("12.3", "0", "1.2" — no trailing zeros). */
export function formatPrecipitation(
  mm: number,
  units: UnitPrefs,
  decimals = 1,
): string {
  const v = units.precipitation === "inch" ? mmToInch(mm) : mm;
  return v.toFixed(decimals).replace(/\.0+$/, "");
}

export const PRECIP_UNIT_LABEL: Record<UnitPrefs["precipitation"], string> = {
  mm: "mm",
  inch: "in",
};

/** Format visibility (meters → km or mi). */
export function formatVisibility(meters: number, units: UnitPrefs): string {
  const km = meters / 1000;
  if (units.system === "imperial") {
    return `${(km * 0.621371).toFixed(1)} mi`;
  }
  return km >= 10 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
}
