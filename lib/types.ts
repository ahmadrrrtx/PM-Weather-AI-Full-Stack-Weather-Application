/* ─────────────────────────────────────────────
   NovaWeather domain types
   All numeric values are METRIC canon:
   °C · km/h · mm · hPa · m · % — conversion happens
   only at the display layer (see lib/units.ts).
   ───────────────────────────────────────────── */

export interface GeoLocation {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
  elevation?: number;
  /** true when the location came from GPS/browser geolocation */
  fromGps?: boolean;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  visibility: number;
  isDay: boolean;
  uvIndex: number;
  dewPoint: number;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windGusts: number;
  cloudCover: number;
  uvIndex: number;
  relativeHumidity: number;
  isDay: boolean;
}

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  daylightSeconds: number;
  moonrise: string | null;
  moonset: string | null;
  moonPhase: number; // 0 = new moon, 0.5 = full moon
}

export interface AirQualityPoint {
  time: string;
  usAqi: number;
  euAqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

export interface WeatherForecast {
  location: GeoLocation;
  timezone: string;
  timezoneOffsetSeconds: number;
  elevation: number;
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  fetchedAt: string;
}

export interface ClimatePoint {
  date: string;
  tempMax: number;
  tempMin: number;
  tempMean: number;
  precipitation: number;
  weatherCode: number;
  windMax: number;
}

export interface ClimateSummary {
  points: ClimatePoint[];
  avgMax: number;
  avgMin: number;
  avgMean: number;
  hottest: ClimatePoint | null;
  coldest: ClimatePoint | null;
  wettest: ClimatePoint | null;
  totalPrecipitation: number;
  avgWindMax: number;
  conditionDays: Record<number, number>;
}

/** Live conditions for the globe's city markers (multi-location call). */
export interface GlobalPulsePoint {
  location: GeoLocation;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
}

export type UnitSystem = "metric" | "imperial";

export interface UnitPrefs {
  system: UnitSystem;
  temperature: "celsius" | "fahrenheit";
  speed: "kmh" | "mph";
  precipitation: "mm" | "inch";
}

export type DashboardTab = "overview" | "forecast" | "map" | "analytics";

/** Ambient query errors — single shape for UI. */
export interface FetchError {
  status?: number;
  message: string;
}
