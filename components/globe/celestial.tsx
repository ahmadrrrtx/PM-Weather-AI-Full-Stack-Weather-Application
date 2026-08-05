"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { moonDirection, moonPhaseAt, sunDirection } from "@/lib/astronomy";
import { createGlowMaterial } from "@/components/globe/shaders";

/* ─────────────────────────────
   Sun & moon — placed from real
   celestial math; billboarded glow
   sprites + the moon's textured body.
   ───────────────────────────── */

const SUN_DISTANCE = 16;
const MOON_DISTANCE = 3.9;

function SunGlow() {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      createGlowMaterial(
        new THREE.Color("#ffb44d"),
        new THREE.Color("#fff8e1"),
        2.4,
      ),
    [],
  );

  useFrame(() => {
    const dir = sunDirection(new Date());
    const mesh = ref.current;
    if (!mesh) return;
    mesh.position.set(dir.x, dir.y, dir.z).multiplyScalar(SUN_DISTANCE);
    mesh.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={ref} material={material} renderOrder={1}>
      <planeGeometry args={[2.6, 2.6]} />
    </mesh>
  );
}

function Moon() {
  const group = useRef<THREE.Group>(null);
  const moonTex = useLoader(
    THREE.TextureLoader,
    "/textures/moon_1024.jpg",
  );
  const glow = useMemo(
    () =>
      createGlowMaterial(new THREE.Color("#7f9fd4"), new THREE.Color("#e8f0ff"), 3.2),
    [],
  );

  useMemo(() => {
    moonTex.colorSpace = THREE.SRGBColorSpace;
  }, [moonTex]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const phase = moonPhaseAt(new Date());
    const dir = moonDirection(sunDirection(new Date()), phase);
    g.position.set(dir.x, dir.y, dir.z).multiplyScalar(MOON_DISTANCE);
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          map={moonTex}
          roughness={1}
          metalness={0}
          emissive="#101c33"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh material={glow} renderOrder={1}>
        <planeGeometry args={[0.85, 0.85]} />
      </mesh>
    </group>
  );
}

function Lights() {
  const dirRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const dir = sunDirection(new Date());
    const light = dirRef.current;
    if (!light) return;
    light.position.set(dir.x, dir.y, dir.z).multiplyScalar(6);
  });

  return (
    <>
      <directionalLight
        ref={dirRef}
        intensity={2.1}
        color="#fff3dd"
      />
      <ambientLight intensity={0.32} color="#93a7d6" />
    </>
  );
}

export function Celestial() {
  return (
    <>
      <SunGlow />
      <Moon />
      <Lights />
    </>
  );
}
