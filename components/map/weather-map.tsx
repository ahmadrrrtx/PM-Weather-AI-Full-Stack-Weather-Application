"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Map as MapLibreMap,
  Marker as MapLibreMarker,
  type RasterTileSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Pause, Play, Satellite, Layers, Radar, Moon } from "lucide-react";
import type { GeoLocation } from "@/lib/types";
import {
  BASEMAP_STYLE_URL,
  fetchGibsTime,
  fetchRadarFrames,
  gibsTileTemplate,
  type RadarFrame,
} from "@/lib/map-layers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   WeatherMap — MapLibre mission map:
   dark vector basemap + satellite +
   night lights + animated radar.
   Client-only (dynamically imported).
   ───────────────────────────── */

type BaseMode = "vector" | "satellite";

interface Props {
  location: GeoLocation;
}

const clampZoom = (z: number) => Math.min(Math.max(z, 2), 12);

export function WeatherMap({ location }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<MapLibreMarker | null>(null);

  const [base, setBase] = useState<BaseMode>("vector");
  const [night, setNight] = useState(false);
  const [radarOn, setRadarOn] = useState(false);
  const [satTime, setSatTime] = useState<string | null>(null);
  const [frames, setFrames] = useState<RadarFrame[]>([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const frameIdxRef = useRef(0);
  useEffect(() => {
    frameIdxRef.current = frameIdx;
  }, [frameIdx]);

  /* Initialize map once */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: BASEMAP_STYLE_URL,
      center: [location.longitude, location.latitude],
      zoom: 4.5,
      minZoom: 2,
      maxZoom: 12,
      attributionControl: {
        compact: true,
        customAttribution: [
          "© OpenStreetMap contributors",
          "OpenFreeMap",
          "NASA GIBS",
          "Weather data by RainViewer",
        ].join(" · "),
      },
    });
    mapRef.current = map;

    map.on("load", () => {
      setMapReady(true);
      map.resize();
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Fetch layer metadata once map is ready */
  useEffect(() => {
    if (!mapReady) return;
    const ctrl = new AbortController();
    void fetchGibsTime("satellite", ctrl.signal)
      .then(setSatTime)
      .catch(() => setSatTime("2026-01-01"));
    return () => ctrl.abort();
  }, [mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    const ctrl = new AbortController();
    void fetchRadarFrames(ctrl.signal)
      .then((f) => {
        setFrames(f);
        setFrameIdx(Math.max(0, f.length - 7));
      })
      .catch(() => setFrames([]));
    return () => ctrl.abort();
  }, [mapReady]);

  /* Basemap switching */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (base === "satellite" && satTime) {
      if (!map.getSource("satellite")) {
        map.addSource("satellite", {
          type: "raster",
          tiles: [gibsTileTemplate("satellite", satTime)],
          tileSize: 256,
          maxzoom: 9,
          attribution: "NASA GIBS",
        });
        map.addLayer({
          id: "satellite-layer",
          type: "raster",
          source: "satellite",
          paint: { "raster-opacity": 0.95 },
        });
      }
      map.setLayoutProperty("satellite-layer", "visibility", "visible");
    } else if (map.getLayer("satellite-layer")) {
      map.setLayoutProperty("satellite-layer", "visibility", "none");
    }
  }, [base, satTime, mapReady]);

  /* Night lights overlay */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (night) {
      if (!map.getSource("night")) {
        map.addSource("night", {
          type: "raster",
          tiles: [gibsTileTemplate("nightLights", "2023-07-07")],
          tileSize: 256,
          maxzoom: 7,
          attribution: "NASA GIBS",
        });
        map.addLayer({
          id: "night-layer",
          type: "raster",
          source: "night",
          paint: { "raster-opacity": 0.85 },
        });
      }
      map.setLayoutProperty("night-layer", "visibility", "visible");
    } else if (map.getLayer("night-layer")) {
      map.setLayoutProperty("night-layer", "visibility", "none");
    }
  }, [night, mapReady]);

  /* Radar overlay */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (radarOn && frames.length > 0) {
      const frame = frames[frameIdx];
      if (frame) {
        if (!map.getSource("radar")) {
          map.addSource("radar", {
            type: "raster",
            tiles: [frame.tiles],
            tileSize: 256,
            maxzoom: 10,
            attribution: "RainViewer",
          });
          map.addLayer({
            id: "radar-layer",
            type: "raster",
            source: "radar",
            paint: { "raster-opacity": 0.75 },
          });
        } else {
          (map.getSource("radar") as RasterTileSource).setTiles([
            frame.tiles,
          ]);
        }
        map.setLayoutProperty("radar-layer", "visibility", "visible");
      }
    } else if (map.getLayer("radar-layer")) {
      map.setLayoutProperty("radar-layer", "visibility", "none");
    }
  }, [radarOn, frames, frameIdx, mapReady]);

  /* Radar playback */
  useEffect(() => {
    if (!playing || frames.length < 2) return;
    const id = window.setInterval(() => {
      setFrameIdx((i) => (i + 1) % frames.length);
    }, 700);
    return () => window.clearInterval(id);
  }, [playing, frames.length]);

  /* Selected location marker + fly */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (!markerRef.current) {
      const el = document.createElement("div");
      el.className =
        "h-4 w-4 rounded-full border-2 border-white bg-aurora-cyan " +
        "shadow-[0_0_18px_rgba(103,232,249,0.9)] relative";
      el.innerHTML =
        '<span class="absolute inset-0 rounded-full animate-ping bg-aurora-cyan/60"></span>';
      markerRef.current = new MapLibreMarker({ element: el })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([location.longitude, location.latitude]);
    }
    map.flyTo({
      center: [location.longitude, location.latitude],
      zoom: clampZoom(map.getZoom() < 4 ? 4.5 : map.getZoom()),
      duration: 1600,
      essential: true,
    });
  }, [location, mapReady]);

  /* Frame time label */
  const frameLabel = useMemo(() => {
    if (frames.length === 0) return null;
    const f = frames[frameIdx];
    if (!f) return null;
    return new Date(f.time * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [frames, frameIdx]);

  const toggle = (key: "vector" | "satellite") => () => {
    if (key === "satellite") setNight(false);
    setBase(key);
  };

  const activeBtn =
    "border-aurora-cyan/50 bg-aurora-cyan/15 text-aurora-cyan shadow-[0_0_16px_rgba(103,232,249,0.25)]";

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/[0.08]">
      <div ref={containerRef} className="absolute inset-0" aria-label="Interactive weather map" />

      {/* Layer control — top-left */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        <div className="glass-strong flex gap-1 rounded-xl p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle("vector")}
            className={cn("h-7 rounded-lg px-2.5 text-[10px]", base === "vector" && activeBtn)}
            aria-pressed={base === "vector"}
          >
            <Layers className="h-3 w-3" aria-hidden />
            Vector
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle("satellite")}
            className={cn("h-7 rounded-lg px-2.5 text-[10px]", base === "satellite" && activeBtn)}
            aria-pressed={base === "satellite"}
          >
            <Satellite className="h-3 w-3" aria-hidden />
            Satellite
          </Button>
        </div>

        <div className="glass-strong flex gap-1 rounded-xl p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRadarOn((v) => !v)}
            className={cn("h-7 rounded-lg px-2.5 text-[10px]", radarOn && activeBtn)}
            aria-pressed={radarOn}
          >
            <Radar className="h-3 w-3" aria-hidden />
            Radar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNight((v) => !v)}
            disabled={base === "satellite"}
            className={cn("h-7 rounded-lg px-2.5 text-[10px]", night && activeBtn)}
            aria-pressed={night}
          >
            <Moon className="h-3 w-3" aria-hidden />
            Night
          </Button>
        </div>
      </div>

      {/* Radar scrubber — bottom center */}
      {radarOn && frames.length > 1 && (
        <div className="glass-strong absolute bottom-4 left-1/2 z-10 flex w-[min(92%,420px)] -translate-x-1/2 items-center gap-3 rounded-2xl px-4 py-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause radar animation" : "Play radar animation"}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </Button>
          <input
            type="range"
            min={0}
            max={Math.max(frames.length - 1, 0)}
            value={frameIdx}
            onChange={(e) => {
              setPlaying(false);
              setFrameIdx(Number(e.target.value));
            }}
            aria-label="Radar timeline"
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-aurora-cyan"
          />
          <span className="tabular w-12 text-right text-[10px] text-white/60">
            {frameLabel}
          </span>
        </div>
      )}

      {/* Location chip — bottom-right */}
      <div className="glass-strong absolute bottom-4 right-3 z-10 hidden rounded-xl px-3 py-2 sm:block">
        <p className="tabular text-[11px] text-white/80">
          {location.name}
          <span className="ml-2 text-white/35">
            {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
          </span>
        </p>
      </div>
    </div>
  );
}
