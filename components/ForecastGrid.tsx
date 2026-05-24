"use client";

import { motion } from "framer-motion";
import { Wind, Droplets, Sun } from "lucide-react";
import type { DailyForecast } from "@/lib/types";
import { decodeWeatherCode, formatDate } from "@/lib/weather";
import { cn } from "@/lib/utils";

interface Props {
  daily: DailyForecast[];
}

export default function ForecastGrid({ daily }: Props) {
  const days = daily.slice(0, 7);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      aria-label="7-day forecast"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          7-Day Forecast
        </h3>
        <span className="text-xs text-white/40">Open-Meteo API</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((day, i) => {
          const { emoji, label, bg } = decodeWeatherCode(
            day.weatherCode,
            1
          );
          const isToday = i === 0;

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className={cn(
                "relative rounded-xl p-4 transition-all duration-200 cursor-default",
                "hover:scale-105 hover:shadow-lg hover:shadow-black/30",
                isToday
                  ? `bg-gradient-to-br ${bg} opacity-90`
                  : "glass hover:bg-white/10"
              )}
            >
              {isToday && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20 text-white font-medium">
                    Today
                  </span>
                </div>
              )}

              <div className="flex flex-col items-center gap-2 text-center">
                {/* Day */}
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    isToday ? "text-white" : "text-white/60"
                  )}
                >
                  {isToday
                    ? "Today"
                    : formatDate(day.date, {
                        weekday: "short",
                      }).split(",")[0]}
                </p>
                <p className="text-xs text-white/40">
                  {formatDate(day.date, { month: "short", day: "numeric" })
                    .split(",")[0]
                    .trim()
                    .replace(/.*?,/, "")
                    .trim()}
                </p>

                {/* Emoji */}
                <span className="text-3xl drop-shadow">{emoji}</span>
                <p className="text-xs text-white/60 leading-tight">{label}</p>

                {/* Temp range */}
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  <span className="text-red-400">
                    {Math.round(day.tempMax)}°
                  </span>
                  <span className="text-white/30">/</span>
                  <span className="text-blue-400">
                    {Math.round(day.tempMin)}°
                  </span>
                </div>

                {/* Stats */}
                <div className="w-full space-y-1 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-blue-400">
                      <Droplets className="w-3 h-3" />
                      <span>{day.precipitationProbability}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/50">
                      <Wind className="w-3 h-3" />
                      <span>{Math.round(day.windSpeedMax)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Sun className="w-3 h-3" />
                    <span>UV {Math.round(day.uvIndexMax)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
