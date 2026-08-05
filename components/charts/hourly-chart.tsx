"use client";

import { useMemo, useState } from "react";
import type { EChartsCoreOption } from "echarts/core";
import type { HourlyPoint, UnitPrefs } from "@/lib/types";
import { EChart } from "@/components/charts/echart";
import {
  AXIS_LABEL,
  AXIS_LINE,
  GLASS_TOOLTIP,
  GRID,
  PALETTE,
  SPLIT_LINE,
  makePrecipFormatter,
  makeSpeedFormatter,
  makeTempFormatter,
} from "@/lib/chart-theme";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   HourlyChart — 48h timeline with
   Temperature / Precipitation / Wind.
   ───────────────────────────── */

type Mode = "temperature" | "precipitation" | "wind";

const MODES: Array<{ id: Mode; label: string }> = [
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Precip" },
  { id: "wind", label: "Wind" },
];

function hourLabel(iso: string): string {
  return iso.slice(11, 16);
}

export function HourlyChart({
  hourly,
  units,
}: {
  hourly: HourlyPoint[];
  units: UnitPrefs;
}) {
  const [mode, setMode] = useState<Mode>("temperature");

  const option = useMemo<EChartsCoreOption>(() => {
    const fmtTemp = makeTempFormatter(units);
    const fmtPrecip = makePrecipFormatter(units);
    const fmtSpeed = makeSpeedFormatter(units);

    const labels = hourly.map((h) => hourLabel(h.time));
    const temps = hourly.map((h) => h.temperature);
    const feels = hourly.map((h) => h.apparentTemperature);
    const probs = hourly.map((h) => h.precipitationProbability);
    const precip = hourly.map((h) => h.precipitation);
    const wind = hourly.map((h) => h.windSpeed);
    const gusts = hourly.map((h) => h.windGusts);

    const base = {
      animationDuration: 600,
      animationEasing: "cubicOut" as const,
      grid: GRID,
      tooltip: {
        ...GLASS_TOOLTIP,
        trigger: "axis" as const,
        valueFormatter: (v: unknown) => {
          if (mode === "temperature") return `${fmtTemp(Number(v))}`;
          if (mode === "precipitation") return String(v);
          return String(v);
        },
      },
      xAxis: {
        type: "category" as const,
        data: labels,
        boundaryGap: true,
        axisLabel: { ...AXIS_LABEL, interval: 2 },
        axisLine: AXIS_LINE,
        axisTick: { show: false },
      },
      series: [] as unknown[],
    };

    if (mode === "temperature") {
      return {
        ...base,
        yAxis: [
          {
            type: "value" as const,
            axisLabel: { ...AXIS_LABEL, formatter: "{value}°" },
            splitLine: SPLIT_LINE,
          },
        ],
        series: [
          {
            name: "Temperature",
            type: "line",
            data: temps,
            smooth: 0.3,
            symbol: "circle",
            symbolSize: 3,
            showSymbol: false,
            lineStyle: { width: 2, color: PALETTE.white40 },
            itemStyle: { color: PALETTE.white40 },
            areaStyle: {
              color: {
                type: "linear",
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(255,255,255,0.08)" },
                  { offset: 1, color: "rgba(255,255,255,0.01)" },
                ],
              },
            },
          },
          {
            name: "Feels like",
            type: "line",
            data: feels,
            smooth: 0.3,
            showSymbol: false,
            lineStyle: { width: 1, color: "rgba(255,255,255,0.12)" },
            itemStyle: { color: "rgba(255,255,255,0.12)" },
          },
        ],
      };
    }

    if (mode === "precipitation") {
      return {
        ...base,
        yAxis: [
          {
            type: "value" as const,
            axisLabel: AXIS_LABEL,
            splitLine: SPLIT_LINE,
          },
          {
            type: "value" as const,
            max: 100,
            axisLabel: { ...AXIS_LABEL, formatter: "{value}%" },
            splitLine: { show: false },
          },
        ],
        series: [
          {
            name: "Precipitation",
            type: "bar",
            data: precip,
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [3, 3, 0, 0],
              color: "rgba(255,255,255,0.15)",
            },
            tooltip: { valueFormatter: (v: unknown) => fmtPrecip(Number(v)) },
          },
          {
            name: "Chance",
            type: "line",
            yAxisIndex: 1,
            data: probs,
            smooth: 0.3,
            showSymbol: false,
            lineStyle: { width: 1.2, color: PALETTE.white20, type: "dashed" },
            itemStyle: { color: PALETTE.white20 },
          },
        ],
      };
    }

    // wind
    return {
      ...base,
      yAxis: [
        {
          type: "value" as const,
          axisLabel: AXIS_LABEL,
          splitLine: SPLIT_LINE,
        },
      ],
      series: [
        {
          name: "Wind",
          type: "line",
          data: wind,
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 2, color: PALETTE.white40 },
          itemStyle: { color: PALETTE.white40 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(255,255,255,0.06)" },
                { offset: 1, color: "rgba(255,255,255,0.01)" },
              ],
            },
          },
          tooltip: { valueFormatter: (v: unknown) => fmtSpeed(Number(v)) },
        },
        {
          name: "Gusts",
          type: "line",
          data: gusts,
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 1, color: "rgba(255,255,255,0.1)", type: "dashed" },
          itemStyle: { color: "rgba(255,255,255,0.1)" },
          tooltip: { valueFormatter: (v: unknown) => fmtSpeed(Number(v)) },
        },
      ],
    };
  }, [hourly, units, mode]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Tabs
          ariaLabel="Hourly chart metric"
          items={MODES}
          value={mode}
          onChange={(id) => setMode(id as Mode)}
        />
        <span className="hidden text-[10px] font-medium uppercase tracking-wider text-white/15 sm:block">48h</span>
      </div>
      <EChart
        option={option}
        className={cn("h-52 w-full", mode === "precipitation" && "h-56")}
        ariaLabel={`Hourly ${mode} chart for the next 48 hours`}
      />
    </div>
  );
}
