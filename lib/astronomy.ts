import { degToRad } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Celestial math for the 3D globe — sun direction,
   moon position (from phase), terminator lighting.
   Sun equations follow the standard NOAA solar
   position approximation (accuracy ~0.01°).
   ───────────────────────────────────────────── */

export interface CelestialVector {
  /** Normalized direction from Earth's center toward the body. */
  x: number;
  y: number;
  z: number;
}

/**
 * Sun direction in world space (y-up globe).
 * Reference meridian passes through the sun at solar noon.
 */
export function sunDirection(date: Date): CelestialVector {
  const daysSinceEpoch = date.getTime() / 86400000;

  // Mean anomaly, mean longitude (degrees)
  const g = ((357.529 + 0.98560028 * daysSinceEpoch) % 360) * degToRad(1);
  const q =
    ((280.459 + 0.98564736 * daysSinceEpoch) % 360) * degToRad(1);
  const L =
    q + 0.0333 * Math.sin(g) + 0.0003 * Math.sin(2 * g);

  const eclipticObliquity = 23.439 * degToRad(1);

  // Ecliptic → equatorial with the celestial pole along +Y:
  // declination = asin(y), x = vernal equinox direction
  const x = Math.cos(L);
  const y = Math.sin(eclipticObliquity) * Math.sin(L);
  const z = Math.cos(eclipticObliquity) * Math.sin(L);

  // Rotate around the polar axis (Y) by the hour angle so the sun is
  // overhead at the reference meridian at noon. Earth rotates ~360.9856°/day.
  const hourAngle =
    ((date.getUTCHours() + date.getUTCMinutes() / 60 - 12) / 24) * 360.9856 *
    degToRad(1);
  const cosH = Math.cos(-hourAngle);
  const sinH = Math.sin(-hourAngle);

  const rx = x * cosH + z * sinH;
  const ry = y;
  const rz = -x * sinH + z * cosH;

  return normalize(rx, ry, rz);
}

/**
 * Moon direction approximated from phase by rotating the sun's
 * direction around the ECLIPTIC pole (Rodrigues' rotation):
 * phase 0 (new) → moon aligns with the sun
 * phase 0.5 (full) → opposite the sun
 * The moon's orbit lives near the ecliptic, so this keeps its
 * declination physically plausible through the lunation.
 */
export function moonDirection(
  sun: CelestialVector,
  phase: number,
): CelestialVector {
  const p = ((phase % 1) + 1) % 1;
  const angle = p * Math.PI * 2; // elongation from the sun
  const eclipticObliquity = 23.439 * degToRad(1);

  // Ecliptic north pole in equatorial coordinates (y = celestial pole)
  const n = {
    x: 0,
    y: Math.cos(eclipticObliquity),
    z: -Math.sin(eclipticObliquity),
  };
  const s = normalize(sun.x, sun.y, sun.z);

  // Rodrigues: v' = v·cosθ + (n×v)·sinθ + n(n·v)(1−cosθ)
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const dot = s.x * n.x + s.y * n.y + s.z * n.z;
  const cross = {
    x: n.y * s.z - n.z * s.y,
    y: n.z * s.x - n.x * s.z,
    z: n.x * s.y - n.y * s.x,
  };

  return normalize(
    s.x * cosA + cross.x * sinA + n.x * dot * (1 - cosA),
    s.y * cosA + cross.y * sinA + n.y * dot * (1 - cosA),
    s.z * cosA + cross.z * sinA + n.z * dot * (1 - cosA),
  );
}

/** Latitude/longitude → unit vector on the globe (y-up). */
export function latLonToVector(
  lat: number,
  lon: number,
): { x: number; y: number; z: number } {
  const phi = degToRad(90 - lat);
  const theta = degToRad(lon);
  return {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  };
}

/** Vector → lat/lon (inverse of latLonToVector). */
export function vectorToLatLon(v: { x: number; y: number; z: number }): {
  lat: number;
  lon: number;
} {
  const lat = 90 - (Math.acos(clampVec(v.y, -1, 1)) * 180) / Math.PI;
  const lon = (Math.atan2(v.z, v.x) * 180) / Math.PI;
  return { lat, lon };
}

/**
 * Moon phase from a date — 0 = new moon, 0.5 = full moon.
 * Standard synodic formula based on the known new moon of
 * 2000-01-06 18:14 UTC (J2000 epoch), accurate to ~1 day
 * over many decades.
 */
export function moonPhaseAt(date: Date): number {
  const synodic = 29.53058867;
  const epoch = Date.UTC(2000, 0, 6, 18, 14, 0);
  const days = (date.getTime() - epoch) / 86400000;
  const phase = ((days % synodic) + synodic) % synodic / synodic;
  return phase;
}

/** Is a point on the globe currently sunlit? */
export function isSunlit(
  lat: number,
  lon: number,
  sun: CelestialVector,
): boolean {
  const p = latLonToVector(lat, lon);
  return p.x * sun.x + p.y * sun.y + p.z * sun.z > 0;
}

function normalize(x: number, y: number, z: number): CelestialVector {
  const len = Math.hypot(x, y, z) || 1;
  return { x: x / len, y: y / len, z: z / len };
}

function clampVec(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
