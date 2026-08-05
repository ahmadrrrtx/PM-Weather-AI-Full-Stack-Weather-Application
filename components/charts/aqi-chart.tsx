"use client";

import { useMemo } from "react";
import type { EChartsCoreOption } from "echarts/core";
import type { AirQualityPoint } from "@/lib/types";
import { EChart } from "@/components/charts/echart";
import {
  AXIS_LABEL,
  AXIS_LINE,
  GLASS_TOOLTIP,
  GRID,
  SPLIT_LINE,
} from "@/lib/chart-theme";

/* ─────────────────────────────
   AqiChart — 24h AQI trend.
   ───────────────────────────── */

export function AqiChart({ hourly }: { hourly: AirQualityPoint[] }) {
  const option = useMemo<EChartsCoreOption>(() => {
    const labels = hourly.map((h) => h.time.slice(11, 16));
    const values = hourly.map((h) => h.usAqi);

    return {
      animationDuration: 600,
      animationEasing: "cubicOut",
      grid: GRID,
      tooltip: {
        ...GLASS_TOOLTIP,
        trigger: "axis",
        valueFormatter: (v: unknown) => `AQI ${Math.round(Number(v))}`,
      },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: false,
        axisLabel: { ...AXIS_LABEL, interval: 3 },
        axisLine: AXIS_LINE,
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        min: 0,
        axisLabel: AXIS_LABEL,
        splitLine: SPLIT_LINE,
      },
      series: [
        {
          name: "US AQI",
          type: "line",
          data: values,
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 2, color: "rgba(255,255,255,0.3)" },
          itemStyle: { color: "rgba(255,255,255,0.3)" },
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
          markLine: {
            silent: true,
            symbol: "none",
            label: { color: "rgba(255,255,255,0.2)", fontSize: 9 },
            data: [
              { yAxis: 50, lineStyle: { color: "rgba(255,255,255,0.06)", type: "dashed" } },
              { yAxis: 100, lineStyle: { color: "rgba(255,255,255,0.06)", type: "dashed" } },
              { yAxis: 150, lineStyle: { color: "rgba(255,255,255,0.06)", type: "dashed" } },
            ],
          },
        },
      ],
    };
  }, [hourly]);

  return (
    <EChart
      option={option}
      className="h-36 w-full"
      ariaLabel="Air quality index trend for the last 24 hours"
    />
  );
}
