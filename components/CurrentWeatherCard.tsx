"use client";

import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Sunrise,
  Sunset,
  Globe,
  Gauge,
  CloudRain,
} from "lucide-react";
import type { WeatherData } from "@/lib/types";
import {
  decodeWeatherCode,
  formatTime,
  windDirection,
} from "@/lib/weather";
import { uvLabel, humidityLabel } from "@/lib/utils";
import WeatherVisual3D from "./WeatherVisual3D";

interface Props {
  data: WeatherData;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  delay?: number;
}

function StatCard({ icon, label, value, sub, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass rounded-xl p-4 hover:bg-white/10 transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0 text-sky-400 group-hover:bg-sky-500/30 transition-colors">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-white/40 text-xs leading-none mb-1">{label}</p>
          <p className="text-white font-semibold text-sm leading-snug truncate">
            {value}
          </p>
          {sub && (
            <p className="text-white/40 text-xs mt-0.5 truncate">{sub}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CurrentWeatherCard({ data }: Props) {
  const { location, current, daily } = data;
  const { label, bg } = decodeWeatherCode(
    current.weatherCode,
    current.isDay
  );
  const today = daily[0];
  const uv = uvLabel(current.uvIndex);
  const windDir = windDirection(current.windDirection);

  const locationName = [
    location.name,
    location.admin1,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-label="Current weather"
    >
      {/* Main hero card */}
      <div
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${bg} p-1 shadow-2xl`}
      >
        <div className="glass rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Location + main temp */}
            <div className="md:col-span-2 space-y-4">
              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span className="text-sky-300 text-xs font-medium uppercase tracking-wide">
                    Current Location
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {locationName}
                </h2>
                <p className="text-white/50 text-xs mt-1">
                  {location.latitude.toFixed(4)}°N,{" "}
                  {location.longitude.toFixed(4)}°E · {data.timezone}
                </p>
              </div>

              {/* Temperature */}
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-7xl sm:text-8xl font-black text-white leading-none">
                    {Math.round(current.temperature)}
                    <span className="text-4xl font-light text-white/60">°C</span>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    Feels like {Math.round(current.feelsLike)}°C
                  </p>
                  <p className="text-white font-medium mt-1">{label}</p>
                </div>

                {/* High/Low */}
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-400 text-xs font-bold">H</span>
                    <span className="text-white text-sm font-semibold">
                      {Math.round(today.tempMax)}°
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-400 text-xs font-bold">L</span>
                    <span className="text-white text-sm font-semibold">
                      {Math.round(today.tempMin)}°
                    </span>
                  </div>
                </div>
              </div>

              {/* Sunrise/Sunset */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-white/40 text-xs">Sunrise</p>
                    <p className="text-white text-sm font-medium">
                      {formatTime(today.sunrise)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sunset className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-white/40 text-xs">Sunset</p>
                    <p className="text-white text-sm font-medium">
                      {formatTime(today.sunset)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3D Visual */}
            <div className="flex items-center justify-center h-48 md:h-auto">
              <WeatherVisual3D
                weatherCode={current.weatherCode}
                isDay={current.isDay}
                temperature={current.temperature}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        <StatCard
          icon={<Droplets className="w-4 h-4" />}
          label="Humidity"
          value={`${current.humidity}%`}
          sub={humidityLabel(current.humidity)}
          delay={0.05}
        />
        <StatCard
          icon={<Wind className="w-4 h-4" />}
          label="Wind"
          value={`${Math.round(current.windSpeed)} km/h`}
          sub={`Direction: ${windDir}`}
          delay={0.1}
        />
        <StatCard
          icon={<CloudRain className="w-4 h-4" />}
          label="Precipitation"
          value={`${current.precipitation} mm`}
          sub={`Rain: ${current.rain} mm`}
          delay={0.15}
        />
        <StatCard
          icon={<Eye className="w-4 h-4" />}
          label="UV Index"
          value={`${current.uvIndex} — ${uv.label}`}
          sub="Sun protection guide"
          delay={0.2}
        />
        <StatCard
          icon={<Thermometer className="w-4 h-4" />}
          label="Feels Like"
          value={`${Math.round(current.feelsLike)}°C`}
          sub="Apparent temperature"
          delay={0.25}
        />
        <StatCard
          icon={<Gauge className="w-4 h-4" />}
          label="Rain Prob."
          value={`${today.precipitationProbability}%`}
          sub="Today's chance"
          delay={0.3}
        />
      </div>
    </motion.section>
  );
}
