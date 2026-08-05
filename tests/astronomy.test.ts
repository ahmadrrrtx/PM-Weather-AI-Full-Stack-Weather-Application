import { describe, expect, it } from "vitest";
import {
  isSunlit,
  latLonToVector,
  moonDirection,
  moonPhaseAt,
  sunDirection,
  vectorToLatLon,
} from "@/lib/astronomy";

const norm = (v: { x: number; y: number; z: number }) =>
  Math.hypot(v.x, v.y, v.z);

describe("sunDirection", () => {
  it("returns a unit vector", () => {
    const v = sunDirection(new Date("2026-08-05T12:00:00Z"));
    expect(norm(v)).toBeCloseTo(1, 6);
  });

  it("has physically plausible declination in August (~+15°)", () => {
    const v = sunDirection(new Date("2026-08-05T12:00:00Z"));
    // Declination angle above the equatorial plane
    const dec = Math.asin(v.y) * (180 / Math.PI);
    expect(dec).toBeGreaterThan(10);
    expect(dec).toBeLessThan(20);
  });

  it("has plausible declination in January (~−20°)", () => {
    const v = sunDirection(new Date("2026-01-05T12:00:00Z"));
    const dec = Math.asin(v.y) * (180 / Math.PI);
    expect(dec).toBeLessThan(-15);
    expect(dec).toBeGreaterThan(-25);
  });
});

describe("latLonToVector / vectorToLatLon", () => {
  it("round-trips coordinates", () => {
    const cases: Array<[number, number]> = [
      [33.68, 73.04],
      [0, 0],
      [90, 0],
      [-33.86, 151.2],
      [40.71, -74.0],
    ];
    for (const [lat, lon] of cases) {
      const v = latLonToVector(lat, lon);
      expect(norm(v)).toBeCloseTo(1, 6);
      const back = vectorToLatLon(v);
      expect(back.lat).toBeCloseTo(lat, 4);
      expect(back.lon).toBeCloseTo(lon, 4);
    }
  });

  it("places poles correctly", () => {
    expect(latLonToVector(90, 0).y).toBeCloseTo(1, 6);
    expect(latLonToVector(-90, 0).y).toBeCloseTo(-1, 6);
  });
});

describe("isSunlit", () => {
  it("noon at the equator is sunlit", () => {
    const noon = new Date("2026-03-20T12:00:00Z"); // equinox
    const sun = sunDirection(noon);
    expect(isSunlit(0, 0, sun)).toBe(true);
    expect(isSunlit(0, 180, sun)).toBe(false);
  });
});

describe("moonPhaseAt", () => {
  it("returns values in [0, 1)", () => {
    for (const d of [
      "2026-01-01", "2026-08-05", "2030-12-31",
    ]) {
      const p = moonPhaseAt(new Date(d));
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(1);
    }
  });

  it("new moon near the 2000-01-06 epoch", () => {
    const p = moonPhaseAt(new Date("2000-01-06T18:14:00Z"));
    expect(p).toBeLessThan(0.03);
  });

  it("full moon ~14.8 days after a new moon", () => {
    const p = moonPhaseAt(new Date("2000-01-21T12:00:00Z"));
    expect(p).toBeGreaterThan(0.45);
    expect(p).toBeLessThan(0.55);
  });
});

describe("moonDirection", () => {
  it("new moon aligns with the sun, full moon opposes it", () => {
    const sun = sunDirection(new Date("2026-08-05T12:00:00Z"));
    const newMoon = moonDirection(sun, 0);
    const fullMoon = moonDirection(sun, 0.5);
    const dotNew = newMoon.x * sun.x + newMoon.y * sun.y + newMoon.z * sun.z;
    const dotFull = fullMoon.x * sun.x + fullMoon.y * sun.y + fullMoon.z * sun.z;
    expect(dotNew).toBeGreaterThan(0.98);
    expect(dotFull).toBeLessThan(-0.98);
  });
});
