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
   Temperature / Precipitation / Wind
   perspectives (dual-axis where needed).
   ───────────────────────────── */

type Mode = "temperature" | "precipitation" | "wind";

const MODES: Array<{ id: Mode; label: string }> = [
  { id: "temperature", label: "Temperature" },
  { id: "precipitation", label: "Precipitation" },
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
      animationDuration: 700,
      animationEasing: "cubicOut" as const,
      grid: GRID,
      tooltip: {
        ...GLASS_TOOLTIP,
        trigger: "axis" as const,
        valueFormatter: (v: unknown, _dataIndex?: number) => {
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
            smooth: 0.35,
            symbol: "circle",
            symbolSize: 4,
            showSymbol: false,
            lineStyle: { width: 2.5, color: PALETTE.cyan },
            itemStyle: { color: PALETTE.cyan },
            areaStyle: {
              color: {
                type: "linear",
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(103,232,249,0.28)" },
                  { offset: 1, color: "rgba(103,232,249,0.02)" },
                ],
              },
            },
            markLine: {
              silent: true,
              symbol: "none",
              label: { color: "rgba(148,180,255,0.5)", fontSize: 9, formatter: "feels {c}°" },
              lineStyle: { color: "rgba(167,139,250,0.35)", type: "dashed", width: 1 },
              data: [],
            },
          },
          {
            name: "Feels like",
            type: "line",
            data: feels,
            smooth: 0.35,
            showSymbol: false,
            lineStyle: { width: 1.2, color: "rgba(167,139,250,0.55)" },
            itemStyle: { color: PALETTE.violet },
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
            name: "mm",
            nameTextStyle: { color: "rgba(148,180,255,0.4)", fontSize: 9 },
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
            barMaxWidth: 14,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: {
                type: "linear",
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: PALETTE.sky },
                  { offset: 1, color: "rgba(56,189,248,0.25)" },
                ],
              },
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
            lineStyle: { width: 1.6, color: PALETTE.violet, type: "dashed" },
            itemStyle: { color: PALETTE.violet },
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
          name: units.speed === "mph" ? "mph" : "km/h",
          nameTextStyle: { color: "rgba(148,180,255,0.4)", fontSize: 9 },
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
          lineStyle: { width: 2.2, color: PALETTE.mint },
          itemStyle: { color: PALETTE.mint },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(110,231,183,0.22)" },
                { offset: 1, color: "rgba(110,231,183,0.02)" },
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
          lineStyle: { width: 1.2, color: PALETTE.amber, type: "dashed" },
          itemStyle: { color: PALETTE.amber },
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
        <span className="hidden hud-label sm:block">48 HOUR WINDOW</span>
      </div>
      <EChart
        option={option}
        className={cn("h-56 w-full", mode === "precipitation" && "h-60")}
        ariaLabel={`Hourly ${mode} chart for the next 48 hours`}
      />
    </div>
  );
}
