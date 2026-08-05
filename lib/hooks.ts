import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { GeoLocation } from "@/lib/types";
import {
  fetchAirQuality,
  fetchAstronomy,
  fetchClimate,
  fetchForecast,
  fetchGlobalPulse,
  geocodeSearch,
} from "@/lib/open-meteo";

/* ─────────────────────────────────────────────
   TanStack Query hooks — dedupe, retry, cache.
   staleTime is generous: weather changes slowly.
   ───────────────────────────────────────────── */

const WEATHER_STALE = 10 * 60 * 1000; // 10 min
const PULSE_STALE = 5 * 60 * 1000; // 5 min
const GEO_STALE = 60 * 1000; // 1 min

export function useForecast(location: GeoLocation | null) {
  return useQuery({
    queryKey: ["forecast", location?.latitude, location?.longitude],
    queryFn: ({ signal }) => fetchForecast(location as GeoLocation, signal),
    enabled: !!location,
    staleTime: WEATHER_STALE,
    retry: 2,
    placeholderData: keepPreviousData,
  });
}

export function useAirQuality(location: GeoLocation | null) {
  return useQuery({
    queryKey: ["air-quality", location?.latitude, location?.longitude],
    queryFn: ({ signal }) => fetchAirQuality(location as GeoLocation, signal),
    enabled: !!location,
    staleTime: WEATHER_STALE,
    retry: 2,
  });
}

export function useAstronomy(location: GeoLocation | null) {
  return useQuery({
    queryKey: ["astronomy", location?.latitude, location?.longitude],
    queryFn: ({ signal }) => fetchAstronomy(location as GeoLocation, signal),
    enabled: !!location,
    staleTime: WEATHER_STALE,
    retry: 2,
  });
}

export function useClimate(location: GeoLocation | null) {
  return useQuery({
    queryKey: ["climate", location?.latitude, location?.longitude],
    queryFn: ({ signal }) => fetchClimate(location as GeoLocation, signal),
    enabled: !!location,
    staleTime: 60 * 60 * 1000, // historical data changes hourly at most
    retry: 2,
  });
}

export function useGlobalPulse() {
  return useQuery({
    queryKey: ["global-pulse"],
    queryFn: ({ signal }) => fetchGlobalPulse(signal),
    staleTime: PULSE_STALE,
    refetchInterval: PULSE_STALE,
    retry: 2,
  });
}

export function useGeocode(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["geocode", query],
    queryFn: ({ signal }) => geocodeSearch(query, signal),
    enabled: enabled && query.trim().length >= 2,
    staleTime: GEO_STALE,
    placeholderData: keepPreviousData,
  });
}

/** Warm the new location's queries immediately on selection. */
export function usePrefetchLocation() {
  const client = useQueryClient();
  return (loc: GeoLocation) => {
    void client.prefetchQuery({
      queryKey: ["forecast", loc.latitude, loc.longitude],
      queryFn: ({ signal }) => fetchForecast(loc, signal),
      staleTime: WEATHER_STALE,
    });
  };
}
