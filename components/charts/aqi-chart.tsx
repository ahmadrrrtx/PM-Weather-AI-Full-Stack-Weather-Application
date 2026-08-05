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
  PALETTE,
  SPLIT_LINE,
} from "@/lib/chart-theme";

/* ─────────────────────────────
   AqiChart — 24h US AQI trend with
   EPA band reference lines.
   ───────────────────────────── */

export function AqiChart({ hourly }: { hourly: AirQualityPoint[] }) {
  const option = useMemo<EChartsCoreOption>(() => {
    const labels = hourly.map((h) => h.time.slice(11, 16));
    const values = hourly.map((h) => h.usAqi);

    return {
      animationDuration: 700,
      animationEasing: "cubicOut",
      grid: GRID,
      tooltip: {
        ...GLASS_TOOLTIP,
        trigger: "axis",
        valueFormatter: (v: unknown) => `US AQI ${Math.round(Number(v))}`,
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
          lineStyle: { width: 2.2, color: PALETTE.violet },
          itemStyle: { color: PALETTE.violet },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(167,139,250,0.26)" },
                { offset: 1, color: "rgba(167,139,250,0.02)" },
              ],
            },
          },
          markLine: {
            silent: true,
            symbol: "none",
            label: { color: "rgba(148,180,255,0.4)", fontSize: 9 },
            data: [
              { yAxis: 50, lineStyle: { color: "rgba(110,231,183,0.4)", type: "dashed" } },
              { yAxis: 100, lineStyle: { color: "rgba(251,191,36,0.4)", type: "dashed" } },
              { yAxis: 150, lineStyle: { color: "rgba(251,113,133,0.4)", type: "dashed" } },
            ],
          },
        },
      ],
    };
  }, [hourly]);

  return (
    <EChart
      option={option}
      className="h-40 w-full"
      ariaLabel="Air quality index trend for the last 24 hours"
    />
  );
}
