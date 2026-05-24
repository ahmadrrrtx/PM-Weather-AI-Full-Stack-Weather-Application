import type { WeatherData, WeatherTip } from "./types";

/**
 * Generate deterministic smart travel/weather tips based on weather data.
 * No AI API required — pure logic.
 */
export function generateWeatherTips(weather: WeatherData): WeatherTip[] {
  const tips: WeatherTip[] = [];
  const { current, daily } = weather;

  // Next 5 days analysis
  const next5 = daily.slice(0, 5);
  const avgRainProb =
    next5.reduce((sum, d) => sum + d.precipitationProbability, 0) /
    next5.length;
  const maxUV = Math.max(...next5.map((d) => d.uvIndexMax));
  const maxWind = Math.max(...next5.map((d) => d.windSpeedMax));
  const maxTemp = Math.max(...next5.map((d) => d.tempMax));
  const minTemp = Math.min(...next5.map((d) => d.tempMin));

  // --- Rain tips ---
  if (current.rain > 0 || current.precipitation > 0) {
    tips.push({
      icon: "🌧️",
      category: "Precipitation",
      title: "Currently Raining",
      description:
        "Take an umbrella and waterproof footwear. Avoid exposed outdoor activities.",
      severity: "warning",
    });
  } else if (avgRainProb > 70) {
    tips.push({
      icon: "☔",
      category: "Precipitation",
      title: "High Rain Probability",
      description: `Rain likely in the coming days (${Math.round(avgRainProb)}% avg probability). Pack waterproof gear and plan indoor alternatives.`,
      severity: "warning",
    });
  } else if (avgRainProb > 40) {
    tips.push({
      icon: "🌦️",
      category: "Precipitation",
      title: "Possible Showers",
      description: `There's a ${Math.round(avgRainProb)}% chance of rain. Consider carrying a light jacket or compact umbrella.`,
      severity: "info",
    });
  }

  // --- UV tips ---
  if (maxUV >= 11) {
    tips.push({
      icon: "🔆",
      category: "UV Index",
      title: "Extreme UV Radiation",
      description:
        "UV index is extreme. Avoid sun exposure between 10am–4pm. Wear SPF 50+, sunglasses, and a hat. Seek shade frequently.",
      severity: "danger",
    });
  } else if (maxUV >= 8) {
    tips.push({
      icon: "☀️",
      category: "UV Index",
      title: "Very High UV",
      description:
        "UV is very high. Apply SPF 30+ sunscreen, wear protective clothing, and limit direct sun exposure midday.",
      severity: "warning",
    });
  } else if (maxUV >= 6) {
    tips.push({
      icon: "🌤️",
      category: "UV Index",
      title: "High UV Index",
      description:
        "Moderate-high UV levels. Apply sunscreen, wear sunglasses, and be cautious during peak sun hours.",
      severity: "info",
    });
  }

  // --- Wind tips ---
  if (maxWind >= 80) {
    tips.push({
      icon: "🌪️",
      category: "Wind",
      title: "Dangerously High Winds",
      description:
        "Wind speeds may exceed 80 km/h. Avoid outdoor activities, secure loose objects, and check local weather alerts.",
      severity: "danger",
    });
  } else if (maxWind >= 50) {
    tips.push({
      icon: "💨",
      category: "Wind",
      title: "Strong Winds Expected",
      description: `Winds up to ${Math.round(maxWind)} km/h. Cycling, hiking, and outdoor dining may be uncomfortable. Secure lightweight items.`,
      severity: "warning",
    });
  } else if (maxWind >= 30) {
    tips.push({
      icon: "🍃",
      category: "Wind",
      title: "Breezy Conditions",
      description: `Light to moderate winds (${Math.round(maxWind)} km/h). Great for kite flying, but hair and papers may blow. Consider a light jacket.`,
      severity: "info",
    });
  }

  // --- Temperature tips ---
  if (maxTemp >= 38) {
    tips.push({
      icon: "🥵",
      category: "Heat",
      title: "Extreme Heat Warning",
      description:
        "Temperatures exceeding 38°C. Stay hydrated (3L+ water daily), avoid strenuous outdoor activity, and never leave children or pets in vehicles.",
      severity: "danger",
    });
  } else if (maxTemp >= 32) {
    tips.push({
      icon: "🌡️",
      category: "Heat",
      title: "Hot Weather",
      description: `High of ${Math.round(maxTemp)}°C expected. Dress in light, breathable fabrics. Stay hydrated and take breaks in air-conditioned spaces.`,
      severity: "warning",
    });
  } else if (maxTemp >= 25) {
    tips.push({
      icon: "😎",
      category: "Temperature",
      title: "Warm & Pleasant",
      description: `Temperatures around ${Math.round(maxTemp)}°C — great for outdoor activities. Light clothing recommended. Stay sun-safe.`,
      severity: "success",
    });
  }

  if (minTemp <= -10) {
    tips.push({
      icon: "🥶",
      category: "Cold",
      title: "Extreme Cold",
      description:
        "Temperatures dropping below -10°C. Layer up with thermal base, insulating mid-layer, and windproof outer shell. Protect extremities from frostbite.",
      severity: "danger",
    });
  } else if (minTemp <= 0) {
    tips.push({
      icon: "🧊",
      category: "Cold",
      title: "Freezing Temperatures",
      description: `Overnight lows near or below freezing. Watch for ice on roads and sidewalks. Bundle up and check heating systems.`,
      severity: "warning",
    });
  } else if (minTemp <= 10) {
    tips.push({
      icon: "🧥",
      category: "Cold",
      title: "Cool Temperatures",
      description: `Lows around ${Math.round(minTemp)}°C. A jacket or sweater is recommended, especially in the mornings and evenings.`,
      severity: "info",
    });
  }

  // --- Thunderstorm tips ---
  const hasThunder = next5.some((d) =>
    [95, 96, 99].includes(d.weatherCode)
  );
  if (hasThunder) {
    tips.push({
      icon: "⛈️",
      category: "Thunderstorm",
      title: "Thunderstorm Risk",
      description:
        "Thunderstorms possible in the forecast period. Stay indoors during storms, avoid open fields, tall trees, and bodies of water.",
      severity: "danger",
    });
  }

  // --- Snow tips ---
  const hasSnow = next5.some((d) =>
    [71, 73, 75, 77, 85, 86].includes(d.weatherCode)
  );
  if (hasSnow) {
    tips.push({
      icon: "❄️",
      category: "Snow",
      title: "Snow in Forecast",
      description:
        "Snow expected. Allow extra travel time, use winter tires, carry emergency supplies in your vehicle, and dress in waterproof, insulating layers.",
      severity: "warning",
    });
  }

  // --- Perfect weather tip ---
  if (
    tips.length === 0 ||
    tips.every((t) => t.severity === "info" || t.severity === "success")
  ) {
    tips.push({
      icon: "✅",
      category: "Outlook",
      title: "Great Weather Ahead",
      description:
        "Conditions look favorable! An ideal time for outdoor activities, sightseeing, or travel. Enjoy the weather!",
      severity: "success",
    });
  }

  // --- Humidity tip ---
  if (current.humidity >= 80) {
    tips.push({
      icon: "💧",
      category: "Humidity",
      title: "High Humidity",
      description:
        "Humidity above 80% — it will feel warmer than actual temperature. Stay hydrated and wear moisture-wicking fabrics.",
      severity: "info",
    });
  } else if (current.humidity <= 20) {
    tips.push({
      icon: "🏜️",
      category: "Humidity",
      title: "Very Dry Air",
      description:
        "Low humidity can cause dry skin and eyes. Use moisturizer, drink plenty of water, and consider a humidifier indoors.",
      severity: "info",
    });
  }

  return tips;
}
