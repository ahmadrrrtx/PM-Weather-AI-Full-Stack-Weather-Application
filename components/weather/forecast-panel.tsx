"use client";

import dynamic from "next/dynamic";
import type { WeatherForecast, UnitPrefs } from "@/lib/types";
import { DailyList } from "@/components/weather/daily-list";
import { SectionLabel } from "@/components/ui/section-label";
import { Skeleton } from "@/components/ui/skeleton";

/* ─────────────────────────────
   ForecastPanel — hourly timeline,
   weekly range chart, detailed days.
   ───────────────────────────── */

const HourlyChart = dynamic(
  () => import("@/components/charts/hourly-chart").then((m) => m.HourlyChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-52 w-full rounded-xl" label="Loading chart" />,
  },
);
const DailyRangeChart = dynamic(
  () => import("@/components/charts/daily-range-chart").then((m) => m.DailyRangeChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-36 w-full rounded-xl" label="Loading chart" />,
  },
);

interface Props {
  forecast: WeatherForecast;
  units: UnitPrefs;
}

export function ForecastPanel({ forecast, units }: Props) {
  return (
    <section aria-label="Forecast" className="space-y-6">
      <div>
        <SectionLabel>Hourly</SectionLabel>
        <div className="mt-3">
          <HourlyChart hourly={forecast.hourly} units={units} />
        </div>
      </div>

      <div>
        <SectionLabel>Weekly Range</SectionLabel>
        <div className="mt-3">
          <DailyRangeChart daily={forecast.daily} units={units} />
        </div>
      </div>

      <div>
        <SectionLabel>7-Day Outlook</SectionLabel>
        <div className="mt-3">
          <DailyList daily={forecast.daily} units={units} detailed />
        </div>
      </div>
    </section>
  );
}
