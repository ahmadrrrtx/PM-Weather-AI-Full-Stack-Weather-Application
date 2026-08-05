"use client";

import { useMemo } from "react";
import type { EChartsCoreOption } from "echarts/core";
import type { DailyPoint, UnitPrefs } from "@/lib/types";
import { EChart } from "@/components/charts/echart";
import {
  AXIS_LABEL,
  AXIS_LINE,
  GLASS_TOOLTIP,
  GRID,
  SPLIT_LINE,
} from "@/lib/chart-theme";
import { formatTemperature } from "@/lib/units";
import { weekdayLabel } from "@/lib/format";

/* ─────────────────────────────
   DailyRangeChart — floating min/max
   bars for the 7-day forecast.
   ───────────────────────────── */

export function DailyRangeChart({
  daily,
  units,
}: {
  daily: DailyPoint[];
  units: UnitPrefs;
}) {
  const option = useMemo<EChartsCoreOption>(() => {
    const fmt = (v: number) => formatTemperature(v, units);
    const mins = daily.map((d) => d.tempMin);
    const ranges = daily.map((d) => d.tempMax - d.tempMin);

    return {
      animationDuration: 600,
      animationEasing: "cubicOut",
      grid: { ...GRID, top: 30 },
      tooltip: {
        ...GLASS_TOOLTIP,
        trigger: "item",
        formatter: (p: { dataIndex: number }) => {
          const d = daily[p.dataIndex];
          if (!d) return "";
          return (
            `<b>${weekdayLabel(d.date)}</b><br/>` +
            `High ${fmt(d.tempMax)} · Low ${fmt(d.tempMin)}`
          );
        },
      },
      xAxis: {
        type: "category",
        data: daily.map((d) => weekdayLabel(d.date)),
        axisLabel: { ...AXIS_LABEL, fontWeight: 500 },
        axisLine: AXIS_LINE,
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: { ...AXIS_LABEL, formatter: "{value}°" },
        splitLine: SPLIT_LINE,
      },
      series: [
        {
          name: "base",
          type: "bar",
          data: mins,
          barWidth: 14,
          stack: "range",
          itemStyle: { color: "transparent" },
          tooltip: { show: false },
          emphasis: { disabled: true },
        },
        {
          name: "range",
          type: "bar",
          data: ranges,
          barWidth: 14,
          stack: "range",
          itemStyle: {
            borderRadius: 7,
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(255,255,255,0.35)" },
                { offset: 1, color: "rgba(255,255,255,0.12)" },
              ],
            },
          },
        },
      ],
    };
  }, [daily, units]);

  return (
    <EChart
      option={option}
      className="h-36 w-full"
      ariaLabel="Seven day forecast high and low temperature range chart"
    />
  );
}
