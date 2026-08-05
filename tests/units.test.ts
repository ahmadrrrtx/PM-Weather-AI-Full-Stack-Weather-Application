import { describe, expect, it } from "vitest";
import {
  UNIT_PRESETS,
  celsiusToFahrenheit,
  formatPrecipitation,
  formatSpeed,
  formatTemperature,
  formatTemperatureLong,
  formatVisibility,
  kmhToKnots,
  kmhToMph,
  kmhToMs,
  mmToInch,
} from "@/lib/units";

describe("temperature", () => {
  it("converts C → F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it("formats per unit system", () => {
    expect(formatTemperature(24.4, UNIT_PRESETS.metric)).toBe("24°");
    expect(formatTemperature(24.4, UNIT_PRESETS.imperial)).toBe("76°");
    expect(formatTemperatureLong(24.4, UNIT_PRESETS.metric)).toBe("24.4°C");
    expect(formatTemperatureLong(24.4, UNIT_PRESETS.imperial)).toBe("75.9°F");
  });
});

describe("wind speed", () => {
  it("converts kmh → mph", () => {
    expect(kmhToMph(100)).toBeCloseTo(62.14, 1);
  });
  it("converts kmh → m/s and knots", () => {
    expect(kmhToMs(36)).toBeCloseTo(10, 5);
    expect(kmhToKnots(100)).toBeCloseTo(54, 0);
  });
  it("formats per unit system", () => {
    expect(formatSpeed(18, UNIT_PRESETS.metric)).toBe("18");
    expect(formatSpeed(18, UNIT_PRESETS.imperial)).toBe("11");
  });
});

describe("precipitation", () => {
  it("converts mm → inch", () => {
    expect(mmToInch(25.4)).toBeCloseTo(1, 5);
  });
  it("formats per unit system", () => {
    expect(formatPrecipitation(12.3, UNIT_PRESETS.metric)).toBe("12.3");
    expect(formatPrecipitation(12.3, UNIT_PRESETS.imperial)).toBe("0.5");
  });
});

describe("visibility", () => {
  it("formats metric", () => {
    expect(formatVisibility(10000, UNIT_PRESETS.metric)).toBe("10 km");
    expect(formatVisibility(2500, UNIT_PRESETS.metric)).toBe("2.5 km");
  });
  it("formats imperial", () => {
    expect(formatVisibility(16093, UNIT_PRESETS.imperial)).toBe("10.0 mi");
  });
});
