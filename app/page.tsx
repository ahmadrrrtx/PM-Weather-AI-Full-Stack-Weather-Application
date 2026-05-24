"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookmarkPlus, ChevronDown } from "lucide-react";

import Header from "@/components/Header";
import SearchPanel from "@/components/SearchPanel";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import ForecastGrid from "@/components/ForecastGrid";
import WeatherCharts from "@/components/WeatherCharts";
import WeatherMap from "@/components/WeatherMap";
import TravelTips from "@/components/TravelTips";
import SavedRecords from "@/components/SavedRecords";
import RecordForm from "@/components/RecordForm";
import PMAcceleratorCard from "@/components/PMAcceleratorCard";
import LoadingState from "@/components/LoadingState";
import ErrorMessage from "@/components/ErrorMessage";

import type { WeatherData, WeatherRecord } from "@/lib/types";
import { generateWeatherTips } from "@/lib/tips";
import { geocodeCurrentPosition } from "@/lib/geocode";

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [recordsRefreshKey, setRecordsRefreshKey] = useState(0);

  const fetchWeather = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setShowSaveForm(false);

    try {
      const res = await fetch(
        `/api/weather?location=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch weather data.");
      }

      setWeatherData(data as WeatherData);

      // Auto-scroll to results
      setTimeout(() => {
        document
          .getElementById("weather-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCurrentLocation = useCallback(async () => {
    setLocationLoading(true);
    setError(null);

    try {
      const geo = await geocodeCurrentPosition();
      if (!geo) {
        throw new Error("Could not determine your location. Please try again.");
      }
      await fetchWeather(`${geo.latitude},${geo.longitude}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Location access failed.";
      if (message.includes("denied") || message.includes("User denied")) {
        setError(
          "Location access was denied. Please allow location access in your browser settings."
        );
      } else {
        setError(message);
      }
    } finally {
      setLocationLoading(false);
    }
  }, [fetchWeather]);

  const handleRecordClick = (record: WeatherRecord) => {
    if (record.weatherJson) {
      setWeatherData(record.weatherJson);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const tips = weatherData ? generateWeatherTips(weatherData) : [];

  return (
    <div className="min-h-screen">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/8 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-sky-500/6 blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full bg-indigo-600/8 blur-3xl animate-pulse-slow delay-2000" />
      </div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero Search */}
        <section aria-label="Weather search">
          <SearchPanel
            onSearch={fetchWeather}
            onCurrentLocation={handleCurrentLocation}
            isLoading={loading}
            locationLoading={locationLoading}
          />
        </section>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <ErrorMessage
              error={error}
              onDismiss={() => setError(null)}
              onRetry={
                weatherData
                  ? () => fetchWeather(weatherData.location.name)
                  : undefined
              }
            />
          )}
        </AnimatePresence>

        {/* Loading */}
        <AnimatePresence>
          {loading && <LoadingState message="Searching for weather data..." />}
        </AnimatePresence>

        {/* Weather Results */}
        <AnimatePresence>
          {weatherData && !loading && (
            <motion.div
              id="weather-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Current weather */}
              <CurrentWeatherCard data={weatherData} />

              {/* Save button */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSaveForm(!showSaveForm)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-sky-500/30 hover:border-sky-400/50 text-sky-300 hover:text-sky-200 text-sm font-medium transition-all"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  {showSaveForm ? "Hide Form" : "Save Record"}
                </motion.button>
              </div>

              {/* Save form */}
              <AnimatePresence>
                {showSaveForm && (
                  <RecordForm
                    weatherData={weatherData}
                    onSaved={() => {
                      setShowSaveForm(false);
                      setRecordsRefreshKey((k) => k + 1);
                    }}
                    onClose={() => setShowSaveForm(false)}
                  />
                )}
              </AnimatePresence>

              {/* Grid: Forecast + Map */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Forecast */}
                <div className="xl:col-span-2">
                  <ForecastGrid daily={weatherData.daily} />
                </div>

                {/* Charts */}
                <div className="xl:col-span-2">
                  <WeatherCharts hourly={weatherData.hourly} />
                </div>

                {/* Map */}
                <div>
                  <WeatherMap
                    latitude={weatherData.location.latitude}
                    longitude={weatherData.location.longitude}
                    locationName={`${weatherData.location.name}, ${weatherData.location.country}`}
                  />
                </div>

                {/* Tips */}
                <div>
                  <TravelTips tips={tips} />
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/10" />
                <ChevronDown className="w-4 h-4 text-white/20" />
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Records — always visible */}
        <SavedRecords
          onRecordClick={handleRecordClick}
          refreshKey={recordsRefreshKey}
        />

        {/* PM Accelerator Card */}
        <PMAcceleratorCard />

        {/* Footer */}
        <footer className="text-center py-6 border-t border-white/10">
          <p className="text-white/30 text-xs">
            Built by{" "}
            <a
              href="https://ahmad-multi-verse.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Muhammad Ahmad
            </a>{" "}
            · PM Accelerator AI Engineer Internship Assessment ·{" "}
            <span className="text-white/20">
              Powered by Open-Meteo (free, no key) · OpenStreetMap · localStorage
            </span>
          </p>
          <p className="text-white/15 text-xs mt-1">
            Assessment:{" "}
            <a
              href="https://docs.google.com/document/d/1FjBFbXEySCKolfsNGrTpRja9upf9T7BxOXakLM6Q5f0/edit?tab=t.0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors"
            >
              View Assessment Doc
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
