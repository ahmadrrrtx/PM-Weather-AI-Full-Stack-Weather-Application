"use client";

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, CalendarRange, Map as MapIcon, Orbit } from "lucide-react";
import dynamic from "next/dynamic";

import { useAppStore } from "@/lib/store";
import { useAirQuality, useAstronomy, useClimate, useForecast } from "@/lib/hooks";
import type { DashboardTab } from "@/lib/types";
import { formatTime } from "@/lib/format";
import { Tabs } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glass-card";
import { PanelError, PanelSkeleton } from "@/components/weather/panel-state";
import { CurrentPanel } from "@/components/weather/current-panel";
import { HourlyStrip } from "@/components/weather/hourly-strip";
import { DailyList } from "@/components/weather/daily-list";
import { ForecastPanel } from "@/components/weather/forecast-panel";
import { AqiPanel } from "@/components/weather/aqi-panel";
import { AstronomyPanel } from "@/components/weather/astronomy-panel";
import { AnalyticsPanel } from "@/components/weather/analytics-panel";
import { SectionLabel } from "@/components/ui/section-label";

/* ─────────────────────────────
   Dashboard — the mission control
   right column: tabbed glass panels
   (Overview · Forecast · Map · Analytics)
   with staggered entrances.
   ───────────────────────────── */

/* Heavy client-only chunks, split from the main bundle */
const EarthGlobe = dynamic(
  () => import("@/components/globe/earth-globe").then((m) => m.EarthGlobe),
  { ssr: false, loading: () => null },
);
const WeatherMap = dynamic(
  () => import("@/components/map/weather-map").then((m) => m.WeatherMap),
  { ssr: false, loading: () => <PanelSkeleton rows={2} /> },
);

const TABS: Array<{ id: DashboardTab; label: string; icon: ReactNode }> = [
  { id: "overview", label: "Overview", icon: <Orbit className="h-3 w-3" aria-hidden /> },
  { id: "forecast", label: "Forecast", icon: <CalendarRange className="h-3 w-3" aria-hidden /> },
  { id: "map", label: "Map", icon: <MapIcon className="h-3 w-3" aria-hidden /> },
  { id: "analytics", label: "Analytics", icon: <Activity className="h-3 w-3" aria-hidden /> },
];

function OverviewTab() {
  const location = useAppStore((s) => s.location);
  const units = useAppStore((s) => s.units);
  const { data, isLoading, isError, error, refetch } = useForecast(location);

  if (isLoading || !data) return <PanelSkeleton rows={4} />;
  if (isError)
    return (
      <PanelError
        message={error instanceof Error ? error.message : "Failed to load weather data."}
        onRetry={() => void refetch()}
      />
    );

  return (
    <div className="space-y-5">
      <CurrentPanel current={data.current} locationName={location.name} units={units} />

      <div>
        <SectionLabel>Next 24 Hours</SectionLabel>
        <div className="mt-3">
          <HourlyStrip hourly={data.hourly} units={units} />
        </div>
      </div>

      <div>
        <SectionLabel>This Week</SectionLabel>
        <div className="mt-3">
          <DailyList daily={data.daily} units={units} />
        </div>
      </div>
    </div>
  );
}

function ForecastTab() {
  const location = useAppStore((s) => s.location);
  const units = useAppStore((s) => s.units);
  const { data, isLoading, isError, error, refetch } = useForecast(location);

  if (isLoading || !data) return <PanelSkeleton rows={4} />;
  if (isError)
    return (
      <PanelError
        message={error instanceof Error ? error.message : "Failed to load forecast."}
        onRetry={() => void refetch()}
      />
    );

  return <ForecastPanel forecast={data} units={units} />;
}

function MapTab() {
  const location = useAppStore((s) => s.location);
  return <WeatherMap location={location} />;
}

function AnalyticsTab() {
  const location = useAppStore((s) => s.location);
  const units = useAppStore((s) => s.units);

  const forecast = useForecast(location);
  const aqi = useAirQuality(location);
  const climate = useClimate(location);
  const astronomy = useAstronomy(location);

  const loading =
    (aqi.isLoading || climate.isLoading || astronomy.isLoading) && !aqi.data && !climate.data;
  const error = aqi.error ?? climate.error ?? astronomy.error;

  if (loading) return <PanelSkeleton rows={4} />;
  if (error && !aqi.data && !climate.data)
    return (
      <PanelError
        message={error instanceof Error ? error.message : "Failed to load analytics."}
        onRetry={() => {
          void aqi.refetch();
          void climate.refetch();
          void astronomy.refetch();
        }}
      />
    );

  const tz = forecast.data?.timezone ?? location.timezone ?? "UTC";

  return (
    <div className="space-y-6">
      {aqi.data && (
        <GlassCard index={0} className="p-4">
          <AqiPanel current={aqi.data.current} hourly={aqi.data.hourly} locationName={location.name} />
        </GlassCard>
      )}

      {climate.data && (
        <GlassCard index={1} className="p-4">
          <AnalyticsPanel climate={climate.data} units={units} locationName={location.name} />
        </GlassCard>
      )}

      {astronomy.data && (
        <GlassCard index={2} className="p-4">
          <AstronomyPanel days={astronomy.data} timezone={tz} locationName={location.name} />
        </GlassCard>
      )}
    </div>
  );
}

const TAB_COMPONENTS: Record<DashboardTab, () => ReactNode> = {
  overview: () => <OverviewTab />,
  forecast: () => <ForecastTab />,
  map: () => <MapTab />,
  analytics: () => <AnalyticsTab />,
};

function DashboardInner() {
  const [tab, setTab] = useState<DashboardTab>("overview");
  const location = useAppStore((s) => s.location);
  const { data: forecast } = useForecast(location);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep the active panel in view on small screens when switching tabs
    panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [tab]);

  const activePanel = TAB_COMPONENTS[tab];

  return (
    <GlassCard strong className="flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] px-4 pb-3 pt-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="truncate font-display text-sm font-bold tracking-wide text-white">
            {location.name}
            {location.country ? (
              <span className="ml-2 text-xs font-normal text-white/40">{location.country}</span>
            ) : null}
          </h2>
          <p className="tabular mt-0.5 text-[10px] text-white/35">
            {forecast
              ? `Updated ${formatTime(forecast.fetchedAt, forecast.timezone ?? "UTC", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })} · ${forecast.timezone}`
              : "Acquiring telemetry…"}
          </p>
        </div>
        <div className="ml-auto">
          <Tabs
            ariaLabel="Dashboard sections"
            items={TABS}
            value={tab}
            onChange={(id) => setTab(id as DashboardTab)}
          />
        </div>
      </div>

      {/* Panel */}
      <div ref={panelRef} className="flex-1 overflow-y-auto p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <Suspense fallback={<PanelSkeleton rows={3} />}>{activePanel()}</Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}

/* Simple error boundary — never a blank screen */
export class DashboardBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <GlassCard strong className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl p-8 text-center">
          <p className="text-sm font-semibold text-white/80">Telemetry interrupted</p>
          <p className="max-w-sm text-xs text-white/45">{this.state.error.message}</p>
          <button
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
            className="rounded-xl border border-aurora-cyan/30 px-4 py-2 text-xs font-semibold text-aurora-cyan transition-colors hover:bg-aurora-cyan/10"
          >
            Reboot console
          </button>
        </GlassCard>
      );
    }
    return this.props.children;
  }
}

export function MissionControl() {
  const location = useAppStore((s) => s.location);

  return (
    <div className="mx-auto grid max-w-[1700px] grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:h-[calc(100vh-6.5rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-5">
      {/* Globe stage */}
      <div className="relative h-[52vh] overflow-hidden rounded-3xl border border-white/[0.07] lg:h-full lg:min-h-[540px]">
        <EarthGlobe />
        {/* Bottom attribution strip */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between bg-gradient-to-t from-[#03060d]/85 to-transparent px-4 pb-2.5 pt-6 text-[9px] tracking-wide text-white/30">
          <span>OPEN-METEO · RAINVIEWER · NASA GIBS · OPENFREEMAP</span>
          <span className="hidden sm:block">3D REAL-TIME EARTH</span>
        </div>
      </div>

      {/* Dashboard */}
      <DashboardBoundary>
        <DashboardInner />
      </DashboardBoundary>

      {/* Mobile coordinate hint (globe position context) */}
      <p className="sr-only">
        Currently viewing {location.name} at {location.latitude.toFixed(2)},{" "}
        {location.longitude.toFixed(2)}.
      </p>
    </div>
  );
}
