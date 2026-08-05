"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, History, LocateFixed, MapPin, Search, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useGeocode } from "@/lib/hooks";
import { parseCoordinateQuery } from "@/lib/open-meteo";
import type { GeoLocation } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   LocationSearch — accessible combobox:
   debounced geocoding, keyboard nav,
   recent locations, GPS fallback.
   ───────────────────────────── */

export function LocationSearch() {
  const setLocation = useAppStore((s) => s.setLocation);
  const requestFocus = useAppStore((s) => s.requestFocus);
  const recentLocations = useAppStore((s) => s.recentLocations);
  const clearRecent = useAppStore((s) => s.clearRecent);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const skipNextBlur = useRef(false);

  const trimmed = query.trim();
  const { data: results, isFetching, error } = useGeocode(trimmed, open && trimmed.length >= 2);

  const coordMatch = useMemo(() => parseCoordinateQuery(query), [query]);

  /* GPS */
  const useMyLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by this browser.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 12000,
          maximumAge: 300000,
        }),
      );
      const { latitude, longitude } = pos.coords;
      // Best-effort display name from the nearest known city
      let name = "My Location";
      try {
        const best = await reverseLookup(latitude, longitude);
        if (best) name = best;
      } catch {
        /* keep default */
      }
      const loc: GeoLocation = {
        name,
        latitude,
        longitude,
        fromGps: true,
      };
      setLocation(loc);
      requestFocus();
      setQuery("");
      setOpen(false);
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("denied")
          ? "Location access denied. Search for a city instead."
          : "Could not determine your location. Search for a city instead.";
      setGpsError(message);
    } finally {
      setGpsLoading(false);
    }
  }, [requestFocus, setLocation]);

  /* Select a location */
  const selectLocation = useCallback(
    (loc: GeoLocation) => {
      setLocation(loc);
      requestFocus();
      setQuery("");
      setOpen(false);
      inputRef.current?.blur();
    },
    [requestFocus, setLocation],
  );

  /* Keyboard navigation */
  const itemCount = (coordMatch ? 1 : 0) + (results?.length ?? 0);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, itemCount - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        type Item =
          | { coord: true; r?: undefined }
          | { coord: false; r: GeoLocation };
        const all: Item[] = [
          ...(coordMatch ? [{ coord: true as const }] : []),
          ...(results ?? []).map((r) => ({ coord: false as const, r })),
        ];
        const item = all[activeIndex];
        if (item?.coord && coordMatch) {
          selectLocation({
            name: `${coordMatch.lat.toFixed(4)}, ${coordMatch.lon.toFixed(4)}`,
            latitude: coordMatch.lat,
            longitude: coordMatch.lon,
          });
        } else if (item && !item.coord) {
          selectLocation(item.r);
        }
      } else if (trimmed.length >= 2) {
        // Enter with no selection: use first result
        const first = results?.[0];
        if (first) {
          e.preventDefault();
          selectLocation(first);
        }
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  /* Scroll active item into view */
  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  /* Close on outside click */
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const showRecent = open && trimmed.length === 0 && recentLocations.length > 0;
  const showResults = open && trimmed.length >= 2;

  return (
    <div className="relative w-full max-w-md" ref={inputRef}>
      <div className="glass-strong flex items-center gap-2 rounded-xl px-3 transition-all duration-200 focus-within:border-aurora-cyan/40 focus-within:shadow-[0_0_0_3px_rgba(103,232,249,0.08)]">
        <Search className="h-4 w-4 shrink-0 text-white/35" aria-hidden />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="location-results"
          aria-autocomplete="list"
          aria-label="Search for a city"
          placeholder="Search city… Islamabad, Tokyo, Paris"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
            setGpsError(null);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            if (!skipNextBlur.current) {
              window.setTimeout(() => setOpen(false), 120);
            }
            skipNextBlur.current = false;
          }}
          onKeyDown={onKeyDown}
          className="h-10 w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="text-white/35 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={useMyLocation}
          disabled={gpsLoading}
          aria-label="Use my current location"
          title="Use my current location"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all duration-200 hover:border-aurora-cyan/40 hover:text-aurora-cyan",
            gpsLoading && "animate-pulse-soft",
          )}
        >
          <LocateFixed className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {(showRecent || showResults || gpsError) && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.18 }}
            className="glass-strong absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl"
          >
            {gpsError && (
              <p role="alert" className="border-b border-white/[0.06] px-4 py-3 text-xs text-aurora-rose/90">
                {gpsError}
              </p>
            )}

            {showRecent && (
              <div className="border-b border-white/[0.06] pb-1 pt-2">
                <p className="flex items-center gap-1.5 px-4 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  <History className="h-3 w-3" aria-hidden />
                  Recent
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearRecent();
                    }}
                    className="ml-auto text-white/25 hover:text-aurora-rose"
                  >
                    Clear
                  </button>
                </p>
                <ul className="max-h-52 overflow-y-auto">
                  {recentLocations.map((loc, i) => (
                    <li key={`${loc.latitude}-${loc.longitude}-${i}`}>
                      <button
                        onClick={() => selectLocation(loc)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs transition-colors",
                          activeIndex === i ? "bg-aurora-cyan/[0.08] text-white" : "text-white/60 hover:bg-white/[0.04]",
                        )}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0 text-white/25" aria-hidden />
                        <span className="truncate">
                          {loc.name}
                          {loc.country ? <span className="text-white/35"> · {loc.country}</span> : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showResults && (
              <ul
                id="location-results"
                role="listbox"
                aria-label="Location results"
                ref={listRef}
                className="max-h-72 overflow-y-auto py-1.5"
              >
                {coordMatch && (
                  <li role="option" aria-selected={activeIndex === 0}>
                    <button
                      onClick={() =>
                        selectLocation({
                          name: `${coordMatch.lat.toFixed(4)}, ${coordMatch.lon.toFixed(4)}`,
                          latitude: coordMatch.lat,
                          longitude: coordMatch.lon,
                        })
                      }
                      onMouseEnter={() => setActiveIndex(0)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs transition-colors",
                        activeIndex === 0 ? "bg-aurora-cyan/[0.08] text-white" : "text-white/70 hover:bg-white/[0.04]",
                      )}
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-aurora-cyan" aria-hidden />
                      Coordinates {coordMatch.lat.toFixed(4)}, {coordMatch.lon.toFixed(4)}
                    </button>
                  </li>
                )}

                {isFetching && (
                  <li className="flex items-center gap-2 px-4 py-3 text-xs text-white/40">
                    <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-aurora-cyan" />
                    Searching orbit…
                  </li>
                )}

                {!isFetching && !error && (results ?? []).length === 0 && !coordMatch && (
                  <li className="px-4 py-3 text-xs text-white/35">No locations found.</li>
                )}

                {!isFetching && error && (
                  <li role="alert" className="px-4 py-3 text-xs text-aurora-rose/85">
                    Search failed. Check your connection.
                  </li>
                )}

                {(results ?? []).map((r, i) => {
                  const idx = i + (coordMatch ? 1 : 0);
                  return (
                    <li key={r.id ?? `${r.latitude}-${r.longitude}`} role="option" aria-selected={activeIndex === idx}>
                      <button
                        onClick={() => selectLocation(r)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors",
                          activeIndex === idx ? "bg-aurora-cyan/[0.08] text-white" : "text-white/70 hover:bg-white/[0.04]",
                        )}
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-aurora-cyan/70" aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-medium">{r.name}</span>
                          <span className="block truncate text-[10px] text-white/35">
                            {[r.admin1, r.country].filter(Boolean).join(" · ") ||
                              "Location"}
                            {typeof r.population === "number" && r.population > 0
                              ? ` · ${(r.population / 1_000_000).toFixed(1)}M`
                              : ""}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen-reader live region */}
      <div aria-live="polite" className="sr-only">
        {isFetching ? `Searching for ${trimmed}…` : ""}
        {results && !isFetching ? `${results.length} results for ${trimmed}` : ""}
      </div>
    </div>
  );
}

/** Minimal reverse geocoding: nearest city from Open-Meteo's geocoding dataset. */
async function reverseLookup(lat: number, lon: number): Promise<string | null> {
  try {
    // Open-Meteo geocoding has no reverse endpoint; do a coarse nearest
    // match against a fixed set of major cities for the display name.
    const { GLOBAL_CITIES } = await import("@/lib/open-meteo");
    let best: { name: string; d: number } | null = null;
    for (const c of GLOBAL_CITIES) {
      const d = (c.latitude - lat) ** 2 + (c.longitude - lon) ** 2;
      if (!best || d < best.d) best = { name: c.name, d };
    }
    if (best && Math.sqrt(best.d) < 3) return best.name;
    return null;
  } catch {
    return null;
  }
}
