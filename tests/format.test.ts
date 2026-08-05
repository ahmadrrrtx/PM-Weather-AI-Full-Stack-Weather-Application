import { describe, expect, it } from "vitest";
import {
  aqiLabel,
  dayLabel,
  durationLabel,
  formatTime,
  isSameHour,
  monthDayLabel,
  moonPhaseLabel,
  parseDateOnly,
  uvLabel,
  weekdayLabel,
  windDirectionLabel,
} from "@/lib/format";

describe("windDirectionLabel", () => {
  it("maps 16-point compass", () => {
    expect(windDirectionLabel(0)).toBe("N");
    expect(windDirectionLabel(90)).toBe("E");
    expect(windDirectionLabel(180)).toBe("S");
    expect(windDirectionLabel(270)).toBe("W");
    expect(windDirectionLabel(22.5)).toBe("NNE");
    expect(windDirectionLabel(348)).toBe("NNW");
  });

  it("handles negative and >360 inputs", () => {
    expect(windDirectionLabel(-90)).toBe("W");
    expect(windDirectionLabel(450)).toBe("E");
  });
});

describe("date helpers", () => {
  it("parses YYYY-MM-DD without UTC drift", () => {
    const d = parseDateOnly("2026-08-05");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(7); // August
    expect(d.getDate()).toBe(5);
  });

  it("labels weekdays", () => {
    // 2026-08-05 is a Wednesday
    expect(weekdayLabel("2026-08-05")).toBe("Wed");
    expect(dayLabel("2026-08-05")).toContain("Aug");
    expect(monthDayLabel("2026-08-05")).toBe("Aug 5");
  });
});

describe("formatTime", () => {
  it("formats in target timezone", () => {
    const iso = "2026-08-05T12:00:00Z";
    expect(formatTime(iso, "Asia/Karachi", { hour: "2-digit", minute: "2-digit", hour12: false })).toBe("17:00");
    expect(formatTime(iso, "UTC", { hour: "2-digit", minute: "2-digit", hour12: false })).toBe("12:00");
  });

  it("falls back gracefully on bad timezone", () => {
    expect(() => formatTime("2026-08-05T12:00:00Z", "Not/AZone")).not.toThrow();
  });
});

describe("isSameHour", () => {
  it("matches same hour", () => {
    const ref = new Date("2026-08-05T14:30:00");
    expect(isSameHour("2026-08-05T14:00:00", ref)).toBe(true);
    expect(isSameHour("2026-08-05T13:59:00", ref)).toBe(false);
  });
});

describe("uvLabel", () => {
  it("bands UV correctly", () => {
    expect(uvLabel(2).label).toBe("Low");
    expect(uvLabel(5).label).toBe("Moderate");
    expect(uvLabel(7).label).toBe("High");
    expect(uvLabel(10).label).toBe("Very High");
    expect(uvLabel(11).label).toBe("Extreme");
  });
});

describe("aqiLabel", () => {
  it("bands AQI correctly", () => {
    expect(aqiLabel(50).label).toBe("Good");
    expect(aqiLabel(100).label).toBe("Moderate");
    expect(aqiLabel(150).label).toBe("Unhealthy (Sensitive)");
    expect(aqiLabel(250).label).toBe("Very Unhealthy");
    expect(aqiLabel(301).label).toBe("Hazardous");
  });
});

describe("moonPhaseLabel", () => {
  it("labels all phases", () => {
    expect(moonPhaseLabel(0)).toBe("New Moon");
    expect(moonPhaseLabel(0.25)).toBe("First Quarter");
    expect(moonPhaseLabel(0.5)).toBe("Full Moon");
    expect(moonPhaseLabel(0.75)).toBe("Last Quarter");
    expect(moonPhaseLabel(0.1)).toBe("Waxing Crescent");
    expect(moonPhaseLabel(0.9)).toBe("Waning Crescent");
    expect(moonPhaseLabel(0.999)).toBe("New Moon");
  });
});

describe("durationLabel", () => {
  it("formats durations", () => {
    expect(durationLabel(3661)).toBe("1h 1m");
    expect(durationLabel(3599)).toBe("1h 0m");
    expect(durationLabel(45)).toBe("1m"); // sub-minute rounds up
  });
});
