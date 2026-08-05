"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload, Stars } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";

import { latLonToVector, sunDirection } from "@/lib/astronomy";
import type { GeoLocation } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useGlobalPulse } from "@/lib/hooks";
import {
  createAtmosphereMaterial,
  createEarthMaterial,
} from "@/components/globe/shaders";
import { Celestial } from "@/components/globe/celestial";
import { Markers } from "@/components/globe/markers";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   EarthGlobe — clean, unobstructed 3D Earth.
   Day/night terminator, atmosphere, clouds,
   stars, sun, moon, city markers.
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
      ref.current.rotation.y += delta * 0.004;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.006, 48, 48]} />
      <meshLambertMaterial
        alphaMap={map}
        color="#ffffff"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ——— Atmosphere ——— */

function Atmosphere() {
  const rim = useMemo(() => createAtmosphereMaterial("rim", new THREE.Color("#4f9cf7"), 1.1), []);
  const halo = useMemo(
    () => createAtmosphereMaterial("halo", new THREE.Color("#3d8bf2"), 0.5),
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

  const sunVec = useRef(new THREE.Vector3());

  /* First rendered frame */
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

  /* Fly when user picks a location */
  useEffect(() => {
    if (focusSignal > 0) {
      flyTo(location.latitude, location.longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSignal]);

  /* Gentle flight on first load */
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

  /* Per-frame: flight easing */
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

      const ease = 0.08;
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
      <Stars radius={40} depth={25} count={2500} factor={2.2} saturation={0} fade speed={reduce ? 0 : 0.4} />
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
        rotateSpeed={0.5}
        zoomSpeed={0.65}
        minDistance={1.4}
        maxDistance={5.5}
        autoRotate={!reduce}
        autoRotateSpeed={0.35}
      />
      <Preload all />
    </>
  );
}

/* ——— Main export ——— */

export function EarthGlobe() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Skeleton until first frame */}
      <div
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-500",
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
        transition={{ duration: 0.8 }}
      >
        <Canvas
          dpr={[1, 1.5]}
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

      {/* Interaction hint — only on first load */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="text-[10px] text-white/15"
        >
          Drag to orbit · Scroll to zoom
        </motion.p>
      </div>

      <div className="sr-only">
        Interactive 3D Earth. Drag to orbit, scroll to zoom, click a marker to
        explore that city&apos;s weather.
      </div>
    </div>
  );
}
