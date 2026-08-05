"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import type { GeoLocation, GlobalPulsePoint } from "@/lib/types";
import { latLonToVector } from "@/lib/astronomy";
import { getCondition } from "@/lib/weather-codes";
import { createMarkerMaterial } from "@/components/globe/shaders";

/* ─────────────────────────────
   Markers — live pulse from cities
   + selected location. Hover shows
   tooltip; click selects.
   ───────────────────────────── */

interface MarkersProps {
  pulse: GlobalPulsePoint[];
  selected: GeoLocation;
  onSelect: (loc: GeoLocation) => void;
}

interface MarkerDotProps {
  point: GlobalPulsePoint;
  isSelected: boolean;
  onSelect: (loc: GeoLocation) => void;
}

function MarkerDot({ point, isSelected, onSelect }: MarkerDotProps) {
  const material = useMemo(
    () =>
      createMarkerMaterial(
        new THREE.Color(getCondition(point.weatherCode).accent),
      ),
    [point.weatherCode],
  );
  const [hovered, setHovered] = useState(false);
  const position = useMemo(
    () => latLonToVector(point.location.latitude, point.location.longitude),
    [point.location.latitude, point.location.longitude],
  );
  const scale = isSelected ? 1.7 : 1;

  useFrame(({ clock }) => {
    material.uniforms.uTime!.value = clock.elapsedTime;
    material.uniforms.uSelected!.value = isSelected ? 1 : 0;
  });

  const onPointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const onPointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const condition = getCondition(point.weatherCode);

  return (
    <group position={[position.x, position.y, position.z]}>
      <Billboard>
        <mesh
          material={material}
          scale={[0.075 * scale, 0.075 * scale, 1]}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(point.location);
          }}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      </Billboard>

      {hovered && (
        <Html
          center
          distanceFactor={7}
          style={{ pointerEvents: "none", zIndex: 40 }}
        >
          <div className="pointer-events-none select-none rounded-lg border border-white/[0.08] bg-[#0c1018]/90 px-3 py-2 text-center backdrop-blur-xl shadow-xl">
            <p className="whitespace-nowrap text-[11px] font-medium text-white/80">
              {point.location.name}
              {point.location.country ? `, ${point.location.country}` : ""}
            </p>
            <p className="mt-0.5 whitespace-nowrap text-[10px] text-white/40">
              <span className="tabular font-semibold text-white/70">
                {Math.round(point.temperature)}°
              </span>
              {condition.label ? ` · ${condition.label}` : ""}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

export function Markers({ pulse, selected, onSelect }: MarkersProps) {
  return (
    <group>
      {pulse.map((p) => {
        const isSelected =
          Math.abs(p.location.latitude - selected.latitude) < 0.01 &&
          Math.abs(p.location.longitude - selected.longitude) < 0.01;
        return (
          <MarkerDot
            key={`${p.location.latitude},${p.location.longitude}`}
            point={p}
            isSelected={isSelected}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}
