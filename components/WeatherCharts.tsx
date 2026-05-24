"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import type { HourlyData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  hourly: HourlyData;
}

type ChartTab = "temperature" | "precipitation" | "wind";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 border border-white/15 shadow-xl text-xs">
      <p className="text-white/60 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
          {p.name === "Temperature"
            ? "°C"
            : p.name === "Precipitation"
            ? "%"
            : " km/h"}
        </p>
      ))}
    </div>
  );
}

export default function WeatherCharts({ hourly }: Props) {
  const [activeTab, setActiveTab] = useState<ChartTab>("temperature");

  // Build chart data — show every 3 hours for cleanliness
  const chartData = hourly.time
    .filter((_, i) => i % 3 === 0)
    .map((time, idx) => {
      const realIdx = idx * 3;
      const hour = new Date(time);
      const label = hour.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
        day: "numeric",
        month: "short",
      });
      return {
        time: label,
        shortTime: hour.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        }),
        temperature: hourly.temperature[realIdx],
        precipitation: hourly.precipitationProbability[realIdx],
        wind: hourly.windSpeed[realIdx],
      };
    });

  const tabs: { key: ChartTab; label: string; emoji: string }[] = [
    { key: "temperature", label: "Temperature", emoji: "🌡️" },
    { key: "precipitation", label: "Rain Probability", emoji: "🌧️" },
    { key: "wind", label: "Wind Speed", emoji: "💨" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass rounded-2xl p-6"
      aria-label="Weather charts"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-white">48-Hour Trends</h3>

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                activeTab === tab.key
                  ? "bg-sky-500/30 text-sky-300 shadow-sm"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <span>{tab.emoji}</span>
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {activeTab === "temperature" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="tempGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#38bdf8"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#38bdf8"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="shortTime"
                tick={{ fontSize: 10 }}
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                unit="°"
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={0}
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="4 4"
              />
              <Area
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fill="url(#tempGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#38bdf8",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === "precipitation" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <defs>
                <linearGradient
                  id="rainGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#60a5fa"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0.6}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="shortTime"
                tick={{ fontSize: 10 }}
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                unit="%"
                domain={[0, 100]}
                width={38}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={50}
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="4 4"
                label={{
                  value: "50%",
                  fill: "rgba(255,255,255,0.3)",
                  fontSize: 10,
                }}
              />
              <Bar
                dataKey="precipitation"
                name="Precipitation"
                fill="url(#rainGradient)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === "wind" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="windGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#a78bfa"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#a78bfa"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="shortTime"
                tick={{ fontSize: 10 }}
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                unit=" km/h"
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="wind"
                name="Wind"
                stroke="#a78bfa"
                strokeWidth={2.5}
                fill="url(#windGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#a78bfa",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="text-xs text-white/30 text-center mt-3">
        Hourly data from Open-Meteo · showing every 3 hours for clarity
      </p>
    </motion.section>
  );
}
