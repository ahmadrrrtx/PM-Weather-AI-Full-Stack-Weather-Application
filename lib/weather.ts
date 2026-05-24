import type {
  WeatherData,
  GeoResult,
  CurrentWeather,
  DailyForecast,
  HourlyData,
  OpenMeteoForecastResponse,
} from "./types";

const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

/**
 * WMO Weather Code → description + emoji
 */
export function decodeWeatherCode(
  code: number,
  isDay = 1
): { label: string; emoji: string; bg: string } {
  const day = isDay === 1;
  const map: Record<
    number,
    { label: string; emoji: string; bg: string }
  > = {
    0: {
      label: "Clear Sky",
      emoji: day ? "☀️" : "🌙",
      bg: day ? "from-amber-400 to-orange-500" : "from-indigo-900 to-blue-950",
    },
    1: {
      label: "Mainly Clear",
      emoji: day ? "🌤️" : "🌙",
      bg: day ? "from-amber-300 to-sky-400" : "from-indigo-900 to-slate-900",
    },
    2: {
      label: "Partly Cloudy",
      emoji: "⛅",
      bg: "from-slate-400 to-sky-500",
    },
    3: { label: "Overcast", emoji: "☁️", bg: "from-slate-500 to-slate-700" },
    45: { label: "Foggy", emoji: "🌫️", bg: "from-slate-400 to-slate-600" },
    48: {
      label: "Icy Fog",
      emoji: "🌫️",
      bg: "from-slate-400 to-slate-600",
    },
    51: {
      label: "Light Drizzle",
      emoji: "🌦️",
      bg: "from-sky-500 to-slate-600",
    },
    53: {
      label: "Drizzle",
      emoji: "🌧️",
      bg: "from-sky-600 to-slate-700",
    },
    55: {
      label: "Heavy Drizzle",
      emoji: "🌧️",
      bg: "from-sky-700 to-slate-800",
    },
    61: {
      label: "Light Rain",
      emoji: "🌦️",
      bg: "from-blue-500 to-slate-600",
    },
    63: { label: "Rain", emoji: "🌧️", bg: "from-blue-600 to-slate-700" },
    65: {
      label: "Heavy Rain",
      emoji: "🌧️",
      bg: "from-blue-700 to-slate-900",
    },
    66: {
      label: "Freezing Rain",
      emoji: "🌨️",
      bg: "from-blue-300 to-slate-700",
    },
    67: {
      label: "Heavy Freezing Rain",
      emoji: "🌨️",
      bg: "from-blue-400 to-slate-800",
    },
    71: {
      label: "Light Snow",
      emoji: "❄️",
      bg: "from-sky-200 to-slate-400",
    },
    73: { label: "Snow", emoji: "❄️", bg: "from-sky-100 to-slate-500" },
    75: {
      label: "Heavy Snow",
      emoji: "❄️",
      bg: "from-white to-slate-500",
    },
    77: {
      label: "Snow Grains",
      emoji: "🌨️",
      bg: "from-sky-200 to-slate-500",
    },
    80: {
      label: "Light Showers",
      emoji: "🌦️",
      bg: "from-sky-500 to-blue-700",
    },
    81: {
      label: "Showers",
      emoji: "🌧️",
      bg: "from-sky-600 to-blue-800",
    },
    82: {
      label: "Violent Showers",
      emoji: "⛈️",
      bg: "from-sky-700 to-slate-900",
    },
    85: {
      label: "Light Snow Showers",
      emoji: "🌨️",
      bg: "from-sky-200 to-slate-600",
    },
    86: {
      label: "Heavy Snow Showers",
      emoji: "🌨️",
      bg: "from-white to-slate-700",
    },
    95: {
      label: "Thunderstorm",
      emoji: "⛈️",
      bg: "from-slate-700 to-purple-900",
    },
    96: {
      label: "Thunderstorm with Hail",
      emoji: "⛈️",
      bg: "from-slate-800 to-purple-950",
    },
    99: {
      label: "Thunderstorm with Heavy Hail",
      emoji: "⛈️",
      bg: "from-slate-900 to-purple-950",
    },
  };
  return (
    map[code] ?? {
      label: "Unknown",
      emoji: "🌡️",
      bg: "from-slate-500 to-slate-700",
    }
  );
}

/**
 * Wind direction in degrees → compass label
 */
export function windDirection(degrees: number): string {
  const dirs = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return dirs[index];
}

/**
 * Fetch full weather data from Open-Meteo
 */
export async function fetchWeatherData(
  location: GeoResult
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "rain",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "is_day",
      "uv_index",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "uv_index_max",
      "sunrise",
      "sunset",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "wind_speed_10m",
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
    wind_speed_unit: "kmh",
    temperature_unit: "celsius",
    precipitation_unit: "mm",
  });

  const url = `${FORECAST_BASE}?${params}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Weather API error ${res.status}: ${text || res.statusText}`
    );
  }

  const raw: OpenMeteoForecastResponse = await res.json();

  const current: CurrentWeather = {
    temperature: raw.current.temperature_2m,
    feelsLike: raw.current.apparent_temperature,
    humidity: raw.current.relative_humidity_2m,
    windSpeed: raw.current.wind_speed_10m,
    windDirection: raw.current.wind_direction_10m,
    precipitation: raw.current.precipitation,
    weatherCode: raw.current.weather_code,
    isDay: raw.current.is_day,
    uvIndex: raw.current.uv_index ?? 0,
    rain: raw.current.rain,
  };

  const daily: DailyForecast[] = raw.daily.time.map((date, i) => ({
    date,
    weatherCode: raw.daily.weather_code[i],
    tempMax: raw.daily.temperature_2m_max[i],
    tempMin: raw.daily.temperature_2m_min[i],
    precipitationSum: raw.daily.precipitation_sum[i],
    precipitationProbability: raw.daily.precipitation_probability_max[i],
    windSpeedMax: raw.daily.wind_speed_10m_max[i],
    uvIndexMax: raw.daily.uv_index_max[i],
    sunrise: raw.daily.sunrise[i],
    sunset: raw.daily.sunset[i],
  }));

  // Only keep next 24h of hourly data
  const now = new Date();
  const hourlySlice = 48;
  const hourly: HourlyData = {
    time: raw.hourly.time.slice(0, hourlySlice),
    temperature: raw.hourly.temperature_2m.slice(0, hourlySlice),
    precipitationProbability:
      raw.hourly.precipitation_probability.slice(0, hourlySlice),
    windSpeed: raw.hourly.wind_speed_10m.slice(0, hourlySlice),
  };

  return {
    location,
    current,
    daily,
    hourly,
    timezone: raw.timezone,
    fetchedAt: now.toISOString(),
  };
}

/**
 * Format a date string nicely
 */
export function formatDate(
  dateStr: string,
  opts?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...opts,
  });
}

/**
 * Format time from full ISO string
 */
export function formatTime(isoStr: string): string {
  const date = new Date(isoStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
