"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload, Stars } from "@react-three/drei";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Crosshair, LocateFixed } from "lucide-react";

import { latLonToVector, sunDirection } from "@/lib/astronomy";
import type { GeoLocation } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useForecast, useGlobalPulse } from "@/lib/hooks";
import { formatTime, windDirectionLabel } from "@/lib/format";
import { formatTemperature } from "@/lib/units";
import { getCondition } from "@/lib/weather-codes";
import {
  createAtmosphereMaterial,
  createEarthMaterial,
} from "@/components/globe/shaders";
import { Celestial } from "@/components/globe/celestial";
import { Markers } from "@/components/globe/markers";
import { WeatherIconForCode } from "@/components/icons/weather-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   EarthGlobe — the hero. Real-time WebGL Earth:
   day/night terminator, atmosphere, clouds,
   stars, sun, moon, live city pulse, camera
   flights. Fully GPU-friendly (dpr clamp,
   shader-only lighting, paused off-screen).
   ───────────────────────────────────────────── */

/* ——— helpers ——— */

function lerpAngle(a: number, b: number, t: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

/* ——— Earth body ——— */

function Earth() {
  const [dayMap, nightMap, normalMap] = useLoader(THREE.TextureLoader, [
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_lights_2048.png",
    "/textures/earth_normal_2048.jpg",
  ]) as [THREE.Texture, THREE.Texture, THREE.Texture];

  const material = useMemo(() => {
    for (const t of [dayMap, nightMap, normalMap]) {
      t.anisotropy = 4;
      t.generateMipmaps = true;
    }
    return createEarthMaterial(dayMap, nightMap, normalMap);
  }, [dayMap, nightMap, normalMap]);

  const sunDirRef = useRef(new THREE.Vector3(1, 0.2, 0.4).normalize());

  useFrame(() => {
    const dir = sunDirection(new Date());
    sunDirRef.current.set(dir.x, dir.y, dir.z);
    material.uniforms.uSunDir!.value.copy(sunDirRef.current);
    material.uniforms.uTime!.value = performance.now() / 1000;
  });

  return (
    <mesh material={material}>
      <sphereGeometry args={[1, 72, 72]} />
    </mesh>
  );
}

/* ——— Clouds ——— */

function Clouds() {
  const reduce = useReducedMotion();
  const map = useLoader(THREE.TextureLoader, "/textures/earth_clouds_1024.png");
  const ref = useRef<THREE.Mesh>(null);

  useMemo(() => {
    map.wrapS = THREE.RepeatWrapping;
    map.anisotropy = 2;
  }, [map]);

  useFrame((_, delta) => {
    if (ref.current && !reduce) {
      ref.current.rotation.y += delta * 0.0045;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.006, 48, 48]} />
      <meshLambertMaterial
        alphaMap={map}
        color="#ffffff"
        transparent
        opacity={0.42}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ——— Atmosphere ——— */

function Atmosphere() {
  const rim = useMemo(() => createAtmosphereMaterial("rim", new THREE.Color("#4f9cf7"), 1.15), []);
  const halo = useMemo(
    () => createAtmosphereMaterial("halo", new THREE.Color("#3d8bf2"), 0.55),
    [],
  );
  return (
    <>
      <mesh material={rim}>
        <sphereGeometry args={[1.015, 48, 48]} />
      </mesh>
      <mesh material={halo}>
        <sphereGeometry args={[1.16, 48, 48]} />
      </mesh>
    </>
  );
}

/* ——— Scene ——— */

function Scene({
  onReady,
}: {
  onReady: () => void;
}) {
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const reduce = useReducedMotion();
  const location = useAppStore((s) => s.location);
  const focusSignal = useAppStore((s) => s.focusSignal);
  const setLocation = useAppStore((s) => s.setLocation);
  const { data: pulse } = useGlobalPulse();

  const [ready, setReady] = useState(false);
  const flying = useRef(false);
  const flightTarget = useRef<{
    theta: number;
    phi: number;
    radius: number;
  } | null>(null);

  // Sun vector — shared by earth material + camera-facing hints
  const sunVec = useRef(new THREE.Vector3());

  /* First rendered frame → fade the canvas in */
  useFrame(() => {
    if (!ready) {
      setReady(true);
      onReady();
    }
  });

  /* Camera flight to a lat/lon */
  const flyTo = useCallback(
    (lat: number, lon: number) => {
      const controls = controlsRef.current;
      const camera = controls?.object;
      if (!controls || !camera) return;
      const v = latLonToVector(lat, lon);
      const phi = Math.acos(THREE.MathUtils.clamp(v.y, -1, 1));
      const theta = Math.atan2(v.z, v.x);
      const radius = camera.position.length();
      flying.current = true;
      flightTarget.current = { theta, phi, radius };
      controls.enabled = false;
      controls.autoRotate = false;
    },
    [],
  );

  /* Fly when the user picks a location */
  useEffect(() => {
    if (focusSignal > 0) {
      flyTo(location.latitude, location.longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSignal]);

  /* Gentle flight to the selected location on first load */
  useEffect(() => {
    const t = window.setTimeout(() => {
      flyTo(location.latitude, location.longitude);
    }, 600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Cancel flight on user interaction */
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onStart = () => {
      if (flying.current) {
        flying.current = false;
        flightTarget.current = null;
        controls.enabled = true;
        controls.autoRotate = !reduce;
      }
    };
    controls.addEventListener("start", onStart);
    return () => controls.removeEventListener("start", onStart);
  }, [reduce]);

  /* Per-frame: sun uniform + flight easing */
  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const dir = sunDirection(new Date());
    sunVec.current.set(dir.x, dir.y, dir.z);

    if (flying.current && flightTarget.current) {
      const t = flightTarget.current;
      const cam = controls.object;
      const pos = cam.position;
      const r = pos.length() || 1;
      const curPhi = Math.acos(THREE.MathUtils.clamp(pos.y / r, -1, 1));
      const curTheta = Math.atan2(pos.z, pos.x);

      const ease = 0.09;
      const theta = lerpAngle(curTheta, t.theta, ease);
      const phi = THREE.MathUtils.clamp(
        curPhi + (t.phi - curPhi) * ease,
        0.18,
        Math.PI - 0.18,
      );
      const radius = r + (t.radius - r) * ease;

      pos.setFromSphericalCoords(radius, phi, theta);
      cam.lookAt(0, 0, 0);

      const settled =
        Math.abs(theta - t.theta) < 0.004 &&
        Math.abs(phi - t.phi) < 0.004 &&
        Math.abs(radius - t.radius) < 0.012;

      if (settled) {
        flying.current = false;
        flightTarget.current = null;
        controls.enabled = true;
        controls.autoRotate = !reduce;
        controls.update();
      }
    } else {
      controls.update();
    }
  });

  const onSelectCity = useCallback(
    (loc: GeoLocation) => {
      setLocation(loc);
      flyTo(loc.latitude, loc.longitude);
    },
    [setLocation, flyTo],
  );

  const pulsePoints = useMemo(() => pulse ?? [], [pulse]);

  return (
    <>
      <Stars radius={42} depth={30} count={3800} factor={2.6} saturation={0} fade speed={reduce ? 0 : 0.5} />
      <Earth />
      <Clouds />
      <Atmosphere />
      <Celestial />
      <Markers pulse={pulsePoints} selected={location} onSelect={onSelectCity} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.7}
        minDistance={1.35}
        maxDistance={6.5}
        autoRotate={!reduce}
        autoRotateSpeed={0.45}
      />
      <Preload all />
    </>
  );
}

/* ——— HUD overlay ——— */

function Hud() {
  const location = useAppStore((s) => s.location);
  const units = useAppStore((s) => s.units);
  const { data: forecast, isFetching } = useForecast(location);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const tz = location.timezone ?? "UTC";
  const time = formatTime(now.toISOString(), tz, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const date = formatTime(now.toISOString(), tz, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const current = forecast?.current;
  const condition = current ? getCondition(current.weatherCode) : null;

  return (
    <>
      {/* Top-left — location + live clock */}
      <div className="pointer-events-none absolute left-4 top-4 z-20 sm:left-6 sm:top-5">
        <div className="glass rounded-2xl px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora-mint opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora-mint" />
            </span>
            <span className="max-w-[180px] truncate sm:max-w-[260px]">
              {location.name}
            </span>
            {location.country && (
              <span className="hidden text-xs font-normal text-white/45 sm:inline">
                {location.country}
              </span>
            )}
          </p>
          <p className="tabular mt-1.5 font-display text-2xl font-bold tracking-wide text-white text-glow-cyan">
            {time}
          </p>
          <p className="mt-0.5 text-[10px] text-white/45">{date}</p>
        </div>
      </div>

      {/* Top-right — live conditions */}
      <div className="pointer-events-none absolute right-4 top-4 z-20 sm:right-6 sm:top-5">
        <AnimatePresence mode="wait">
          {current && condition ? (
            <motion.div
              key="cond"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className="glass rounded-2xl px-4 py-3 text-right"
            >
              <p className="flex items-center justify-end gap-2.5">
                <span className="h-8 w-8">
                  <WeatherIconForCode code={current.weatherCode} isDay={current.isDay} />
                </span>
                <span className="tabular font-display text-3xl font-bold text-white text-glow-cyan">
                  {formatTemperature(current.temperature, units)}
                </span>
              </p>
              <p className="mt-1 text-[10px] text-white/50">{condition.label}</p>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass flex items-center gap-2 rounded-2xl px-4 py-3"
            >
              <span className="h-2 w-2 animate-pulse-soft rounded-full bg-aurora-cyan" />
              <span className="hud-label">{isFetching ? "Syncing orbit" : "Acquiring telemetry"}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom-left — coordinates */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-20 sm:bottom-5 sm:left-6">
        <div className="glass rounded-xl px-3.5 py-2.5">
          <p className="tabular text-[11px] text-white/60">
            <span className="text-aurora-cyan/80">{location.latitude.toFixed(4)}°N</span>
            {" · "}
            <span className="text-aurora-violet/80">{location.longitude.toFixed(4)}°E</span>
            {forecast && (
              <>
                {" · "}
                <span className="text-white/40">
                  {Math.round(forecast.elevation)}m
                </span>
              </>
            )}
          </p>
          <p className="mt-0.5 hidden text-[9px] tracking-[0.18em] text-white/30 sm:block">
            DRAG TO ORBIT · SCROLL TO ZOOM
          </p>
        </div>
      </div>

      {/* Bottom-right — current wind */}
      {current && (
        <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden sm:bottom-5 sm:right-6 sm:block">
          <div className="glass flex items-center gap-2 rounded-xl px-3.5 py-2.5">
            <LocateFixed className="h-3.5 w-3.5 text-aurora-cyan" aria-hidden />
            <span className="tabular text-[11px] text-white/60">
              {Math.round(current.windSpeed)} km/h {windDirectionLabel(current.windDirection)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

/* ——— Main export ——— */

export function EarthGlobe() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const requestFocus = useAppStore((s) => s.requestFocus);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Skeleton shimmer until first frame */}
      <div
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-700",
          ready ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        <div className="skeleton absolute inset-0" />
      </div>

      {/* Canvas */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0.8, 1.35, 2.2], fov: 42 }}
          frameloop={visible ? "always" : "never"}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          aria-label="Interactive 3D Earth with live weather markers"
          className="!absolute !inset-0"
        >
          <Suspense fallback={null}>
            <Scene onReady={() => setReady(true)} />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Center focus pill */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.16]">
        <Crosshair className="h-10 w-10 text-aurora-cyan" aria-hidden />
      </div>

      {/* Re-center button */}
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 sm:left-auto sm:right-24 sm:translate-x-0">
        <Button
          variant="glass"
          size="icon"
          aria-label="Fly to selected location"
          onClick={() => requestFocus()}
          className="h-9 w-9 rounded-full"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>

      <Hud />

      <div className="sr-only">
        Interactive 3D Earth. Drag to orbit, scroll to zoom, click a marker to
        explore that city&apos;s weather.
      </div>
    </div>
  );
}
