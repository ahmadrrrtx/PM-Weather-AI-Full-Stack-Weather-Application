import type { GeoResult, OpenMeteoGeoResponse } from "./types";

const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse";

/**
 * Parse "lat,lon" coordinate string
 */
function parseCoordinates(input: string): { lat: number; lon: number } | null {
  const trimmed = input.trim();
  const match = trimmed.match(
    /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
  );
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lon = parseFloat(match[2]);
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

/**
 * Reverse geocode coordinates to a place name using Nominatim
 */
async function reverseGeocode(
  lat: number,
  lon: number
): Promise<GeoResult | null> {
  try {
    const url = `${NOMINATIM_REVERSE}?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      "Unknown";
    const country = data.address?.country || "Unknown";
    const countryCode = data.address?.country_code?.toUpperCase() || "??";
    return {
      name: city,
      latitude: lat,
      longitude: lon,
      country,
      country_code: countryCode,
      admin1: data.address?.state,
      timezone: undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Geocode a text query using Open-Meteo geocoding API
 */
async function geocodeText(query: string): Promise<GeoResult | null> {
  try {
    const params = new URLSearchParams({
      name: query,
      count: "5",
      language: "en",
      format: "json",
    });
    const url = `${GEO_BASE}?${params}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data: OpenMeteoGeoResponse = await res.json();
    if (!data.results || data.results.length === 0) return null;
    const r = data.results[0];
    return {
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country,
      country_code: r.country_code,
      admin1: r.admin1,
      admin2: r.admin2,
      timezone: r.timezone,
      population: r.population,
    };
  } catch {
    return null;
  }
}

/**
 * Geocode a postal code using Nominatim
 */
async function geocodePostal(query: string): Promise<GeoResult | null> {
  try {
    const params = new URLSearchParams({
      postalcode: query,
      format: "json",
      limit: "1",
    });
    const url = `${NOMINATIM_BASE}?${params}`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.length === 0) return null;
    const r = data[0];
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    const displayParts = (r.display_name || "").split(",");
    return {
      name: displayParts[0]?.trim() || query,
      latitude: lat,
      longitude: lon,
      country: displayParts[displayParts.length - 1]?.trim() || "Unknown",
      country_code: "??",
      admin1: displayParts[1]?.trim(),
    };
  } catch {
    return null;
  }
}

/**
 * Master geocode function — handles coordinates, postal codes, and text
 */
export async function geocodeLocation(
  input: string
): Promise<GeoResult | null> {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Try coordinate parsing
  const coords = parseCoordinates(trimmed);
  if (coords) {
    const reversed = await reverseGeocode(coords.lat, coords.lon);
    if (reversed) return reversed;
    // fallback: return minimal result with raw coords
    return {
      name: `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`,
      latitude: coords.lat,
      longitude: coords.lon,
      country: "Unknown",
      country_code: "??",
    };
  }

  // 2. Try Open-Meteo geocoding (best for city names)
  const geoResult = await geocodeText(trimmed);
  if (geoResult) return geoResult;

  // 3. Try postal code via Nominatim
  if (/^\d{4,10}$/.test(trimmed.replace(/\s/g, ""))) {
    const postalResult = await geocodePostal(trimmed);
    if (postalResult) return postalResult;
  }

  // 4. Final fallback: Nominatim free text search
  try {
    const params = new URLSearchParams({
      q: trimmed,
      format: "json",
      limit: "1",
    });
    const url = `${NOMINATIM_BASE}?${params}`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.length === 0) return null;
    const r = data[0];
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    const displayParts = (r.display_name || "").split(",");
    return {
      name: displayParts[0]?.trim() || trimmed,
      latitude: lat,
      longitude: lon,
      country: displayParts[displayParts.length - 1]?.trim() || "Unknown",
      country_code: "??",
      admin1: displayParts[1]?.trim(),
    };
  } catch {
    return null;
  }
}

/**
 * Get user's current GPS location
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 300000,
      enableHighAccuracy: false,
    });
  });
}

/**
 * Geocode current GPS position
 */
export async function geocodeCurrentPosition(): Promise<GeoResult | null> {
  const pos = await getCurrentPosition();
  const { latitude, longitude } = pos.coords;
  return reverseGeocode(latitude, longitude);
}
