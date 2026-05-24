// ─── Geocoding ───────────────────────────────────────────────────────────────

export interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

// ─── Weather ──────────────────────────────────────────────────────────────────

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  weatherCode: number;
  isDay: number;
  uvIndex: number;
  rain: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyData {
  time: string[];
  temperature: number[];
  precipitationProbability: number[];
  windSpeed: number[];
}

export interface WeatherData {
  location: GeoResult;
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyData;
  timezone: string;
  fetchedAt: string;
}

// ─── Records ──────────────────────────────────────────────────────────────────

export interface WeatherRecord {
  id: string;
  locationInput: string;
  resolvedName: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  weatherJson: WeatherData | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordFormData {
  locationInput: string;
  startDate: string;
  endDate: string;
  notes: string;
}

// ─── Tips ─────────────────────────────────────────────────────────────────────

export interface WeatherTip {
  icon: string;
  category: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "danger" | "success";
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface OpenMeteoGeoResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code: string;
    admin1?: string;
    admin2?: string;
    timezone?: string;
    population?: number;
  }>;
}

export interface OpenMeteoForecastResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    is_day: number;
    uv_index?: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
  };
  timezone: string;
}

// ─── Export ───────────────────────────────────────────────────────────────────

export type ExportFormat = "json" | "csv" | "markdown";
