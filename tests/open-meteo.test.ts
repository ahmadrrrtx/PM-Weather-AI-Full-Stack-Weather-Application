import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchClimate,
  fetchForecast,
  parseCoordinateQuery,
} from "@/lib/open-meteo";
import type { GeoLocation } from "@/lib/types";

/* ─────────────────────────────
   Open-Meteo client tests —
   fetch mocked, mappers verified.
   ───────────────────────────── */

const LOCATION: GeoLocation = {
  name: "Islamabad",
  latitude: 33.68,
  longitude: 73.04,
  country: "Pakistan",
  timezone: "Asia/Karachi",
};

const FORECAST_FIXTURE = {
  latitude: 33.68,
  longitude: 73.04,
  elevation: 528,
  timezone: "Asia/Karachi",
  utc_offset_seconds: 18000,
  current: {
    time: "2026-08-05T14:00",
    temperature_2m: 32.4,
    apparent_temperature: 34.1,
    relative_humidity_2m: 55,
    precipitation: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
    weather_code: 1,
    cloud_cover: 18,
    pressure_msl: 1008.4,
    wind_speed_10m: 12.6,
    wind_direction_10m: 280,
    wind_gusts_10m: 21.3,
    visibility: 24000,
    is_day: 1,
    uv_index: 7.2,
    dew_point_2m: 19.8,
  },
  hourly: {
    time: Array.from({ length: 48 }, (_, i) => {
      const d = new Date("2026-08-05T14:00:00");
      d.setHours(d.getHours() + i);
      return d.toISOString().slice(0, 13).replace("T", "-") + "T" + d.toISOString().slice(11, 16).replace(":", "") ;
    }),
    temperature_2m: Array.from({ length: 48 }, (_, i) => 28 + Math.sin(i / 5) * 4),
    apparent_temperature: Array.from({ length: 48 }, (_, i) => 29 + Math.sin(i / 5) * 4),
    precipitation_probability: Array.from({ length: 48 }, (_, i) => (i % 8 === 0 ? 40 : 5)),
    precipitation: Array.from({ length: 48 }, () => 0),
    weather_code: Array.from({ length: 48 }, () => 1),
    wind_speed_10m: Array.from({ length: 48 }, () => 12),
    wind_gusts_10m: Array.from({ length: 48 }, () => 20),
    cloud_cover: Array.from({ length: 48 }, () => 20),
    uv_index: Array.from({ length: 48 }, (_, i) => Math.max(0, 7 - Math.abs(i - 14) / 2)),
    relative_humidity_2m: Array.from({ length: 48 }, () => 55),
    is_day: Array.from({ length: 48 }, (_, i) => (i >= 6 && i <= 18 ? 1 : 0)),
  },
  daily: {
    time: ["2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08", "2026-08-09", "2026-08-10", "2026-08-11"],
    weather_code: [1, 2, 3, 61, 63, 95, 0],
    temperature_2m_max: [34, 33, 31, 28, 26, 25, 30],
    temperature_2m_min: [24, 23, 22, 20, 19, 18, 21],
    apparent_temperature_max: [36, 35, 33, 30, 28, 27, 32],
    apparent_temperature_min: [26, 25, 24, 22, 21, 20, 23],
    precipitation_sum: [0, 0, 0.4, 8.2, 15.1, 22, 0],
    precipitation_probability_max: [0, 10, 30, 80, 95, 100, 5],
    wind_speed_10m_max: [14, 16, 18, 22, 26, 30, 12],
    wind_gusts_10m_max: [28, 30, 34, 40, 48, 55, 24],
    uv_index_max: [8, 7, 6, 4, 3, 2, 7],
    sunrise: ["2026-08-05T05:22", "2026-08-06T05:23", "2026-08-07T05:24", "2026-08-08T05:25", "2026-08-09T05:26", "2026-08-10T05:27", "2026-08-11T05:28"],
    sunset: ["2026-08-05T19:01", "2026-08-06T19:00", "2026-08-07T18:59", "2026-08-08T18:58", "2026-08-09T18:57", "2026-08-10T18:56", "2026-08-11T18:55"],
    daylight_duration: Array.from({ length: 7 }, (_, i) => 49200 - i * 60),
  },
};

const CLIMATE_FIXTURE = {
  daily: {
    time: Array.from({ length: 30 }, (_, i) => {
      const d = new Date("2026-07-07");
      d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    }),
    temperature_2m_max: Array.from({ length: 30 }, (_, i) => 30 + (i % 7)),
    temperature_2m_min: Array.from({ length: 30 }, (_, i) => 20 + (i % 5)),
    temperature_2m_mean: Array.from({ length: 30 }, (_, i) => 25 + (i % 4)),
    precipitation_sum: Array.from({ length: 30 }, (_, i) => (i % 5 === 0 ? 10 : 0)),
    weather_code: Array.from({ length: 30 }, (_, i) => (i % 5 === 0 ? 63 : 1)),
    wind_speed_10m_max: Array.from({ length: 30 }, (_, i) => 12 + i),
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseCoordinateQuery", () => {
  it("parses lat,lon inputs", () => {
    expect(parseCoordinateQuery("33.68,73.04")).toEqual({ lat: 33.68, lon: 73.04 });
    expect(parseCoordinateQuery(" -40.7 ; -74.0 ")).toEqual({ lat: -40.7, lon: -74.0 });
  });

  it("rejects non-coordinates", () => {
    expect(parseCoordinateQuery("Islamabad")).toBeNull();
    expect(parseCoordinateQuery("33.68")).toBeNull();
    expect(parseCoordinateQuery("999,73")).toBeNull();
    expect(parseCoordinateQuery("abc,def")).toBeNull();
  });
});

describe("fetchForecast", () => {
  it("maps the raw API into typed models", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify(FORECAST_FIXTURE), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const result = await fetchForecast(LOCATION);

    expect(result.location.name).toBe("Islamabad");
    expect(result.timezone).toBe("Asia/Karachi");
    expect(result.current.temperature).toBe(32.4);
    expect(result.current.isDay).toBe(true);
    expect(result.current.weatherCode).toBe(1);
    expect(result.hourly).toHaveLength(48);
    expect(result.hourly[0]?.temperature).toBeGreaterThan(20);
    expect(result.daily).toHaveLength(7);
    expect(result.daily[0]?.tempMax).toBe(34);
    expect(result.daily[3]?.weatherCode).toBe(61);
  });

  it("throws descriptive errors on API failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 })),
    );
    await expect(fetchForecast(LOCATION)).rejects.toThrow("API 500");
  });
});

describe("fetchClimate", () => {
  it("computes the summary correctly", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify(CLIMATE_FIXTURE), { status: 200 }),
      ),
    );

    const summary = await fetchClimate(LOCATION);

    expect(summary.points).toHaveLength(30);
    expect(summary.avgMax).toBeCloseTo(33, 0);
    expect(summary.avgMin).toBeCloseTo(22, 0);
    expect(summary.hottest?.tempMax).toBe(36);
    expect(summary.coldest?.tempMin).toBe(20);
    expect(summary.totalPrecipitation).toBe(60);
    expect(summary.conditionDays[63]).toBe(6);
    expect(summary.conditionDays[1]).toBe(24);
  });
});
