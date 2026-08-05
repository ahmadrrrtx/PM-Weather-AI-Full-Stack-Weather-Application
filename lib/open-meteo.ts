import type {
  AirQualityPoint,
  ClimatePoint,
  ClimateSummary,
  CurrentWeather,
  DailyPoint,
  GeoLocation,
  GlobalPulsePoint,
  HourlyPoint,
  WeatherForecast,
} from "@/lib/types";

/* ─────────────────────────────────────────────
   Open-Meteo client — 100% free, no API key.
   All fetches run client-side (CORS enabled).
   Endpoints:
   · Forecast   api.open-meteo.com/v1/forecast
   · Air Quality  air-quality-api.open-meteo.com/v1/air-quality
   · Astronomy  api.open-meteo.com/v1/forecast?daily=sunrise,...
   · Historical archive-api.open-meteo.com/v1/archive
   ───────────────────────────────────────────── */

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

const DEFAULT_HEADERS: HeadersInit = {
  Accept: "application/json",
};

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { headers: DEFAULT_HEADERS, signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text.slice(0, 160) || res.statusText}`);
  }
  return (await res.json()) as T;
}

function qs(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  return sp.toString();
}

/* ─────────────── Raw API shapes ─────────────── */

interface RawForecast {
  latitude?: number;
  longitude?: number;
  elevation?: number;
  timezone?: string;
  utc_offset_seconds?: number;
  current?: Record<string, number | string | undefined>;
  hourly?: Record<string, Array<number | string> | undefined>;
  daily?: Record<string, Array<number | string> | undefined>;
}

interface RawAirQuality {
  current?: Record<string, number | string | undefined>;
  hourly?: Record<string, Array<number | string> | undefined>;
}

interface RawArchive {
  daily?: Record<string, Array<number | string> | undefined>;
}

interface RawGeocoding {
  results?: Array<{
    id?: number;
    name?: string;
    latitude?: number;
    longitude?: number;
    country?: string;
    country_code?: string;
    admin1?: string;
    admin2?: string;
    timezone?: string;
    population?: number;
    elevation?: number;
  }>;
}

/* ─────────────── Geocoding ─────────────── */

export async function geocodeSearch(
  query: string,
  signal?: AbortSignal,
): Promise<GeoLocation[]> {
  const url = `${GEOCODING_URL}?${qs({
    name: query,
    count: 8,
    language: "en",
    format: "json",
  })}`;
  const raw = await getJson<RawGeocoding>(url, signal);
  return (raw.results ?? [])
    .filter((r) => r.name && r.latitude !== undefined && r.longitude !== undefined)
    .map((r) => ({
      id: r.id,
      name: r.name ?? "Unknown",
      latitude: r.latitude ?? 0,
      longitude: r.longitude ?? 0,
      country: r.country,
      countryCode: r.country_code,
      admin1: r.admin1,
      admin2: r.admin2,
      timezone: r.timezone,
      population: r.population,
      elevation: r.elevation,
    }));
}

/** Accepts "City" or "lat,lon" input. */
export function parseCoordinateQuery(query: string): { lat: number; lon: number } | null {
  const trimmed = query.trim();
  const match = trimmed.match(/^-?\d{1,3}(?:\.\d+)?\s*[,;]\s*-?\d{1,3}(?:\.\d+)?$/);
  if (!match) return null;
  const [latStr, lonStr] = trimmed.split(/[,;]/).map((s) => s.trim());
  const lat = Number(latStr);
  const lon = Number(lonStr);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

/* ─────────────── Forecast bundle ─────────────── */

const FORECAST_VARIABLES = {
  current: [
    "temperature_2m", "apparent_temperature", "relative_humidity_2m",
    "precipitation", "rain", "showers", "snowfall", "weather_code",
    "cloud_cover", "pressure_msl", "wind_speed_10m", "wind_direction_10m",
    "wind_gusts_10m", "visibility", "is_day", "uv_index", "dew_point_2m",
  ].join(","),
  hourly: [
    "temperature_2m", "apparent_temperature", "precipitation_probability",
    "precipitation", "weather_code", "wind_speed_10m", "wind_gusts_10m",
    "cloud_cover", "uv_index", "relative_humidity_2m", "is_day",
  ].join(","),
  daily: [
    "weather_code", "temperature_2m_max", "temperature_2m_min",
    "apparent_temperature_max", "apparent_temperature_min",
    "precipitation_sum", "precipitation_probability_max",
    "wind_speed_10m_max", "wind_gusts_10m_max", "uv_index_max",
    "sunrise", "sunset", "daylight_duration",
  ].join(","),
} as const;

export async function fetchForecast(
  location: GeoLocation,
  signal?: AbortSignal,
): Promise<WeatherForecast> {
  const url = `${FORECAST_URL}?${qs({
    latitude: location.latitude,
    longitude: location.longitude,
    current: FORECAST_VARIABLES.current,
    hourly: FORECAST_VARIABLES.hourly,
    daily: FORECAST_VARIABLES.daily,
    timezone: "auto",
    forecast_days: 7,
    forecast_hours: 72,
    wind_speed_unit: "kmh",
    temperature_unit: "celsius",
    precipitation_unit: "mm",
    models: "best_match",
  })}`;

  const raw = await getJson<RawForecast>(url, signal);

  const current = raw.current ?? {};
  const hourly = raw.hourly ?? {};
  const daily = raw.daily ?? {};

  const num = (v: number | string | undefined, fallback = 0): number =>
    typeof v === "number" ? v : Number(v ?? fallback);
  const str = (v: number | string | undefined, fallback = ""): string =>
    typeof v === "string" ? v : String(v ?? fallback);

  const now: CurrentWeather = {
    time: str(current.time),
    temperature: num(current.temperature_2m),
    apparentTemperature: num(current.apparent_temperature),
    relativeHumidity: num(current.relative_humidity_2m),
    precipitation: num(current.precipitation),
    rain: num(current.rain),
    showers: num(current.showers),
    snowfall: num(current.snowfall),
    weatherCode: num(current.weather_code),
    cloudCover: num(current.cloud_cover),
    pressureMsl: num(current.pressure_msl),
    windSpeed: num(current.wind_speed_10m),
    windDirection: num(current.wind_direction_10m),
    windGusts: num(current.wind_gusts_10m),
    visibility: num(current.visibility),
    isDay: num(current.is_day, 1) === 1,
    uvIndex: num(current.uv_index),
    dewPoint: num(current.dew_point_2m),
  };

  const times = (hourly.time ?? []) as string[];
  const hourlyPoints: HourlyPoint[] = times.slice(0, 48).map((t, i) => ({
    time: t,
    temperature: num(hourly.temperature_2m?.[i]),
    apparentTemperature: num(hourly.apparent_temperature?.[i]),
    precipitationProbability: num(hourly.precipitation_probability?.[i]),
    precipitation: num(hourly.precipitation?.[i]),
    weatherCode: num(hourly.weather_code?.[i]),
    windSpeed: num(hourly.wind_speed_10m?.[i]),
    windGusts: num(hourly.wind_gusts_10m?.[i]),
    cloudCover: num(hourly.cloud_cover?.[i]),
    uvIndex: num(hourly.uv_index?.[i]),
    relativeHumidity: num(hourly.relative_humidity_2m?.[i]),
    isDay: num(hourly.is_day?.[i], 1) === 1,
  }));

  const dates = (daily.time ?? []) as string[];
  const dailyPoints: DailyPoint[] = dates.slice(0, 7).map((d, i) => ({
    date: d,
    weatherCode: num(daily.weather_code?.[i]),
    tempMax: num(daily.temperature_2m_max?.[i]),
    tempMin: num(daily.temperature_2m_min?.[i]),
    apparentMax: num(daily.apparent_temperature_max?.[i]),
    apparentMin: num(daily.apparent_temperature_min?.[i]),
    precipitationSum: num(daily.precipitation_sum?.[i]),
    precipitationProbabilityMax: num(daily.precipitation_probability_max?.[i]),
    windSpeedMax: num(daily.wind_speed_10m_max?.[i]),
    windGustsMax: num(daily.wind_gusts_10m_max?.[i]),
    uvIndexMax: num(daily.uv_index_max?.[i]),
    sunrise: str(daily.sunrise?.[i]),
    sunset: str(daily.sunset?.[i]),
    daylightSeconds: num(daily.daylight_duration?.[i]),
    moonrise: null,
    moonset: null,
    moonPhase: 0,
  }));

  return {
    location,
    timezone: raw.timezone ?? "UTC",
    timezoneOffsetSeconds: num(raw.utc_offset_seconds),
    elevation: num(raw.elevation),
    current: now,
    hourly: hourlyPoints,
    daily: dailyPoints,
    fetchedAt: new Date().toISOString(),
  };
}

/* ─────────────── Astronomy (moon phases, moonrise) ─────────────── */

export interface AstronomyDay {
  date: string;
  sunrise: string;
  sunset: string;
  daylight: number;
  moonrise: string | null;
  moonset: string | null;
  moonPhase: number;
}

export async function fetchAstronomy(
  location: GeoLocation,
  signal?: AbortSignal,
): Promise<AstronomyDay[]> {
  const url = `${FORECAST_URL}?${qs({
    latitude: location.latitude,
    longitude: location.longitude,
    daily: "sunrise,sunset,daylight_duration,moonrise,moonset,moon_phase",
    timezone: "auto",
    forecast_days: 7,
  })}`;
  const raw = await getJson<RawForecast>(url, signal);
  const daily = raw.daily ?? {};
  const dates = (daily.time ?? []) as string[];
  return dates.slice(0, 7).map((d, i) => ({
    date: d,
    sunrise: String(daily.sunrise?.[i] ?? ""),
    sunset: String(daily.sunset?.[i] ?? ""),
    daylight: Number(daily.daylight_duration?.[i] ?? 0),
    moonrise: daily.moonrise?.[i] ? String(daily.moonrise[i]) : null,
    moonset: daily.moonset?.[i] ? String(daily.moonset[i]) : null,
    moonPhase: Number(daily.moon_phase?.[i] ?? 0),
  }));
}

/* ─────────────── Air quality ─────────────── */

export async function fetchAirQuality(
  location: GeoLocation,
  signal?: AbortSignal,
): Promise<{ current: AirQualityPoint; hourly: AirQualityPoint[] }> {
  const url = `${AIR_QUALITY_URL}?${qs({
    latitude: location.latitude,
    longitude: location.longitude,
    current: "us_aqi,eu_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide",
    hourly: "us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide",
    timezone: "auto",
    forecast_days: 1,
  })}`;
  const raw = await getJson<RawAirQuality>(url, signal);

  const toPoint = (
    time: string,
    v: Record<string, number | string | undefined>,
  ): AirQualityPoint => ({
    time,
    usAqi: num(v.us_aqi),
    euAqi: num(v.eu_aqi),
    pm25: num(v.pm2_5),
    pm10: num(v.pm10),
    o3: num(v.ozone),
    no2: num(v.nitrogen_dioxide),
    so2: num(v.sulphur_dioxide),
    co: num(v.carbon_monoxide),
  });

  const current = toPoint(str(raw.current?.time), raw.current ?? {});
  const hourlyRaw = raw.hourly ?? {};
  const times = (hourlyRaw.time ?? []) as string[];
  const hourly = times.slice(0, 24).map((t, i) =>
    toPoint(t, {
      us_aqi: hourlyRaw.us_aqi?.[i],
      pm2_5: hourlyRaw.pm2_5?.[i],
      pm10: hourlyRaw.pm10?.[i],
      ozone: hourlyRaw.ozone?.[i],
      nitrogen_dioxide: hourlyRaw.nitrogen_dioxide?.[i],
      sulphur_dioxide: hourlyRaw.sulphur_dioxide?.[i],
      carbon_monoxide: hourlyRaw.carbon_monoxide?.[i],
    }),
  );

  return { current, hourly };
}

/* ─────────────── Historical archive (30 days) ─────────────── */

export async function fetchClimate(
  location: GeoLocation,
  signal?: AbortSignal,
): Promise<ClimateSummary> {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const url = `${ARCHIVE_URL}?${qs({
    latitude: location.latitude,
    longitude: location.longitude,
    start_date: iso(start),
    end_date: iso(end),
    daily: "temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,weather_code,wind_speed_10m_max",
    timezone: "auto",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  })}`;
  const raw = await getJson<RawArchive>(url, signal);
  const daily = raw.daily ?? {};
  const dates = (daily.time ?? []) as string[];

  const points: ClimatePoint[] = dates.map((d, i) => ({
    date: d,
    tempMax: num(daily.temperature_2m_max?.[i]),
    tempMin: num(daily.temperature_2m_min?.[i]),
    tempMean: num(daily.temperature_2m_mean?.[i]),
    precipitation: num(daily.precipitation_sum?.[i]),
    weatherCode: num(daily.weather_code?.[i]),
    windMax: num(daily.wind_speed_10m_max?.[i]),
  }));

  const avg = (fn: (p: ClimatePoint) => number) =>
    points.length ? points.reduce((s, p) => s + fn(p), 0) / points.length : 0;

  const maxBy = (fn: (p: ClimatePoint) => number) =>
    points.reduce<ClimatePoint | null>(
      (best, p) => (best === null || fn(p) > fn(best) ? p : best),
      null,
    );
  const minBy = (fn: (p: ClimatePoint) => number) =>
    points.reduce<ClimatePoint | null>(
      (best, p) => (best === null || fn(p) < fn(best) ? p : best),
      null,
    );

  const conditionDays: Record<number, number> = {};
  for (const p of points) {
    conditionDays[p.weatherCode] = (conditionDays[p.weatherCode] ?? 0) + 1;
  }

  return {
    points,
    avgMax: avg((p) => p.tempMax),
    avgMin: avg((p) => p.tempMin),
    avgMean: avg((p) => p.tempMean),
    hottest: maxBy((p) => p.tempMax),
    coldest: minBy((p) => p.tempMin),
    wettest: maxBy((p) => p.precipitation),
    totalPrecipitation: points.reduce((s, p) => s + p.precipitation, 0),
    avgWindMax: avg((p) => p.windMax),
    conditionDays,
  };
}

/* ─────────────── Global pulse (live city markers) ─────────────── */

export const GLOBAL_CITIES: GeoLocation[] = [
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503, country: "Japan" },
  { name: "New York", latitude: 40.7128, longitude: -74.006, country: "USA" },
  { name: "London", latitude: 51.5074, longitude: -0.1278, country: "UK" },
  { name: "Dubai", latitude: 25.2048, longitude: 55.2708, country: "UAE" },
  { name: "Singapore", latitude: 1.3521, longitude: 103.8198, country: "Singapore" },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093, country: "Australia" },
  { name: "Paris", latitude: 48.8566, longitude: 2.3522, country: "France" },
  { name: "Moscow", latitude: 55.7558, longitude: 37.6173, country: "Russia" },
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357, country: "Egypt" },
  { name: "São Paulo", latitude: -23.5505, longitude: -46.6333, country: "Brazil" },
  { name: "Mexico City", latitude: 19.4326, longitude: -99.1332, country: "Mexico" },
  { name: "Lagos", latitude: 6.5244, longitude: 3.3792, country: "Nigeria" },
  { name: "Karachi", latitude: 24.8607, longitude: 67.0011, country: "Pakistan" },
  { name: "Islamabad", latitude: 33.6844, longitude: 73.0479, country: "Pakistan" },
  { name: "Mumbai", latitude: 19.076, longitude: 72.8777, country: "India" },
  { name: "Beijing", latitude: 39.9042, longitude: 116.4074, country: "China" },
  { name: "Shanghai", latitude: 31.2304, longitude: 121.4737, country: "China" },
  { name: "Seoul", latitude: 37.5665, longitude: 126.978, country: "South Korea" },
  { name: "Bangkok", latitude: 13.7563, longitude: 100.5018, country: "Thailand" },
  { name: "Jakarta", latitude: -6.2088, longitude: 106.8456, country: "Indonesia" },
  { name: "Istanbul", latitude: 41.0082, longitude: 28.9784, country: "Türkiye" },
  { name: "Berlin", latitude: 52.52, longitude: 13.405, country: "Germany" },
  { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "Spain" },
  { name: "Rome", latitude: 41.9028, longitude: 12.4964, country: "Italy" },
  { name: "Toronto", latitude: 43.6532, longitude: -79.3832, country: "Canada" },
  { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437, country: "USA" },
  { name: "Chicago", latitude: 41.8781, longitude: -87.6298, country: "USA" },
  { name: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, country: "Argentina" },
  { name: "Cape Town", latitude: -33.9249, longitude: 18.4241, country: "South Africa" },
  { name: "Nairobi", latitude: -1.2921, longitude: 36.8219, country: "Kenya" },
];

/** Multi-location current weather (up to 100 per call). */
export async function fetchGlobalPulse(
  signal?: AbortSignal,
): Promise<GlobalPulsePoint[]> {
  const lats = GLOBAL_CITIES.map((c) => c.latitude.toFixed(4)).join(",");
  const lons = GLOBAL_CITIES.map((c) => c.longitude.toFixed(4)).join(",");
  const url = `${FORECAST_URL}?${qs({
    latitude: lats,
    longitude: lons,
    current: "temperature_2m,weather_code,is_day,wind_speed_10m",
    wind_speed_unit: "kmh",
    temperature_unit: "celsius",
  })}`;
  const raw = await getJson<RawForecast>(url, signal);

  const temps = (raw.current?.temperature_2m ?? []) as number[];
  const codes = (raw.current?.weather_code ?? []) as number[];
  const days = (raw.current?.is_day ?? []) as number[];
  const winds = (raw.current?.wind_speed_10m ?? []) as number[];

  return GLOBAL_CITIES.map((location, i) => ({
    location,
    temperature: Number(temps[i] ?? 0),
    weatherCode: Number(codes[i] ?? 0),
    isDay: Number(days[i] ?? 1) === 1,
    windSpeed: Number(winds[i] ?? 0),
  })).filter((p) => p.location.latitude !== undefined);
}

function num(v: number | string | undefined, fallback = 0): number {
  return typeof v === "number" ? v : Number(v ?? fallback);
}

function str(v: number | string | undefined, fallback = ""): string {
  return typeof v === "string" ? v : String(v ?? fallback);
}
