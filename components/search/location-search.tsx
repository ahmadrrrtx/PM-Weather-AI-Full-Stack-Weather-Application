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
   LocationSearch — clean combobox.
   Debounced geocoding, keyboard nav,
   recent locations, GPS.
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

  /* Keyboard shortcut */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /* GPS */
  const useMyLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported.");
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
          ? "Location access denied."
          : "Could not determine location.";
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
    <div className="relative w-full max-w-sm" ref={inputRef}>
      <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 transition-all duration-150 focus-within:border-white/[0.12] focus-within:bg-white/[0.05]">
        <Search className="h-3.5 w-3.5 shrink-0 text-white/30" aria-hidden />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="location-results"
          aria-autocomplete="list"
          aria-label="Search for a city"
          placeholder="Search city..."
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
          className="h-9 w-full bg-transparent text-[13px] text-white/90 placeholder:text-white/25 focus:outline-none"
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
            className="text-white/25 transition-colors hover:text-white/50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={useMyLocation}
          disabled={gpsLoading}
          aria-label="Use my current location"
          title="Use my current location"
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors duration-150 hover:text-white/60",
            gpsLoading && "animate-pulse",
          )}
        >
          <LocateFixed className="h-3.5 w-3.5" />
        </button>
        <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-white/[0.08] bg-white/[0.03] px-1.5 text-[10px] font-medium text-white/20">
          ⌘K
        </kbd>
      </div>

      <AnimatePresence>
        {(showRecent || showResults || gpsError) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c1018]/95 backdrop-blur-xl shadow-2xl"
          >
            {gpsError && (
              <p role="alert" className="border-b border-white/[0.05] px-4 py-2.5 text-xs text-red-400/90">
                {gpsError}
              </p>
            )}

            {showRecent && (
              <div className="border-b border-white/[0.05] pb-1 pt-2">
                <p className="flex items-center gap-1.5 px-4 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/25">
                  <History className="h-3 w-3" aria-hidden />
                  Recent
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearRecent();
                    }}
                    className="ml-auto text-white/20 hover:text-white/40"
                  >
                    Clear
                  </button>
                </p>
                <ul className="max-h-48 overflow-y-auto">
                  {recentLocations.map((loc, i) => (
                    <li key={`${loc.latitude}-${loc.longitude}-${i}`}>
                      <button
                        onClick={() => selectLocation(loc)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs transition-colors duration-100",
                          activeIndex === i ? "bg-white/[0.05] text-white/90" : "text-white/50 hover:bg-white/[0.03]",
                        )}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0 text-white/20" aria-hidden />
                        <span className="truncate">
                          {loc.name}
                          {loc.country ? <span className="text-white/30"> · {loc.country}</span> : null}
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
                className="max-h-64 overflow-y-auto py-1"
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
                        "flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs transition-colors duration-100",
                        activeIndex === 0 ? "bg-white/[0.05] text-white/90" : "text-white/60 hover:bg-white/[0.03]",
                      )}
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-accent/70" aria-hidden />
                      Coordinates {coordMatch.lat.toFixed(4)}, {coordMatch.lon.toFixed(4)}
                    </button>
                  </li>
                )}

                {isFetching && (
                  <li className="flex items-center gap-2 px-4 py-2.5 text-xs text-white/30">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/60" />
                    Searching...
                  </li>
                )}

                {!isFetching && !error && (results ?? []).length === 0 && !coordMatch && (
                  <li className="px-4 py-2.5 text-xs text-white/25">No locations found.</li>
                )}

                {!isFetching && error && (
                  <li role="alert" className="px-4 py-2.5 text-xs text-red-400/80">
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
                          "flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors duration-100",
                          activeIndex === idx ? "bg-white/[0.05] text-white/90" : "text-white/60 hover:bg-white/[0.03]",
                        )}
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-white/30" aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium">{r.name}</span>
                          <span className="block truncate text-[11px] text-white/30">
                            {[r.admin1, r.country].filter(Boolean).join(" · ") || "Location"}
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

/** Minimal reverse geocoding. */
async function reverseLookup(lat: number, lon: number): Promise<string | null> {
  try {
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
