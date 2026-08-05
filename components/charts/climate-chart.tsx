"use client";

import { useMemo } from "react";
import type { EChartsCoreOption } from "echarts/core";
import type { ClimateSummary, UnitPrefs } from "@/lib/types";
import { EChart } from "@/components/charts/echart";
import {
  AXIS_LABEL,
  AXIS_LINE,
  GLASS_TOOLTIP,
  GRID,
  SPLIT_LINE,
  makePrecipFormatter,
  makeTempFormatter,
} from "@/lib/chart-theme";
import { monthDayLabel } from "@/lib/format";

/* ─────────────────────────────
   ClimateChart — 30-day trend:
   mean temperature + precipitation.
   ───────────────────────────── */

export function ClimateChart({
  climate,
  units,
}: {
  climate: ClimateSummary;
  units: UnitPrefs;
}) {
  const option = useMemo<EChartsCoreOption>(() => {
    const fmtTemp = makeTempFormatter(units);
    const fmtPrecip = makePrecipFormatter(units);
    const { points } = climate;
    const labels = points.map((p) => monthDayLabel(p.date));

    const markPointData = [];
    if (climate.hottest) {
      markPointData.push({
        name: "Hottest",
        coord: [climate.hottest.date, climate.hottest.tempMax],
        value: `H ${fmtTemp(climate.hottest.tempMax)}`,
        itemStyle: { color: "rgba(245,158,11,0.8)" },
        symbolSize: 40,
      });
    }
    if (climate.coldest) {
      markPointData.push({
        name: "Coldest",
        coord: [climate.coldest.date, climate.coldest.tempMin],
        value: `L ${fmtTemp(climate.coldest.tempMin)}`,
        itemStyle: { color: "rgba(255,255,255,0.4)" },
        symbolSize: 40,
      });
    }

    return {
      animationDuration: 700,
      animationEasing: "cubicOut",
      grid: GRID,
      tooltip: {
        ...GLASS_TOOLTIP,
        trigger: "axis",
        axisPointer: {
          type: "line",
          lineStyle: { color: "rgba(255,255,255,0.08)" },
        },
      },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: true,
        axisLabel: { ...AXIS_LABEL, interval: 4 },
        axisLine: AXIS_LINE,
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          axisLabel: { ...AXIS_LABEL, formatter: "{value}°" },
          splitLine: SPLIT_LINE,
        },
        {
          type: "value",
          axisLabel: AXIS_LABEL,
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Mean temp",
          type: "line",
          data: points.map((p) => p.tempMean),
          smooth: 0.2,
          showSymbol: false,
          lineStyle: { width: 2, color: "rgba(255,255,255,0.35)" },
          itemStyle: { color: "rgba(255,255,255,0.35)" },
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
          markPoint: {
            data: markPointData,
            label: { color: "#080c14", fontSize: 8, fontWeight: 700 },
            tooltip: { show: false },
          },
          tooltip: { valueFormatter: (v: unknown) => fmtTemp(Number(v)) },
        },
        {
          name: "Precipitation",
          type: "bar",
          yAxisIndex: 1,
          data: points.map((p) => p.precipitation),
          barMaxWidth: 6,
          itemStyle: {
            borderRadius: [2, 2, 0, 0],
            color: "rgba(255,255,255,0.12)",
          },
          tooltip: { valueFormatter: (v: unknown) => fmtPrecip(Number(v)) },
        },
      ],
    };
  }, [climate, units]);

  return (
    <EChart
      option={option}
      className="h-48 w-full"
      ariaLabel="Last 30 days climate chart with mean temperature and precipitation"
    />
  );
}
