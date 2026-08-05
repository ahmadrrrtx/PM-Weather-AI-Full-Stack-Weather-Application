import { describe, expect, it } from "vitest";
import {
  conditionShort,
  getCondition,
  iconKey,
} from "@/lib/weather-codes";

const ALL_CODES = [
  0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67,
  71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
];

describe("getCondition", () => {
  it("maps every WMO code", () => {
    for (const code of ALL_CODES) {
      const c = getCondition(code);
      expect(c.label.length).toBeGreaterThan(0);
      expect(c.group.length).toBeGreaterThan(0);
      expect(c.accent).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("falls back for unknown codes", () => {
    const c = getCondition(999);
    expect(c.label).toBe("Unknown");
    expect(c.group).toBe("cloudy");
  });

  it("labels known conditions", () => {
    expect(getCondition(0).label).toBe("Clear Sky");
    expect(getCondition(63).label).toBe("Rain");
    expect(getCondition(95).label).toBe("Thunderstorm");
  });
});

describe("iconKey", () => {
  it("distinguishes day/night for clear + partly cloudy", () => {
    expect(iconKey(0, true)).toBe("clear-day");
    expect(iconKey(0, false)).toBe("clear-night");
    expect(iconKey(2, true)).toBe("partly-day");
    expect(iconKey(2, false)).toBe("partly-night");
  });

  it("uses group key otherwise", () => {
    expect(iconKey(63, true)).toBe("rain");
    expect(iconKey(63, false)).toBe("rain");
    expect(iconKey(75, false)).toBe("snow");
    expect(iconKey(95, true)).toBe("thunder");
  });
});

describe("conditionShort", () => {
  it("returns short labels", () => {
    expect(conditionShort(0, true)).toBe("Clear");
    expect(conditionShort(61, true)).toBe("Light Rain");
  });
});
