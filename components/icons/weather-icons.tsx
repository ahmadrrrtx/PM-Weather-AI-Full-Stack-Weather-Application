"use client";

import { motion, useReducedMotion } from "framer-motion";
import { iconKey } from "@/lib/weather-codes";

/* ─────────────────────────────────────────────
   NovaWeather icon system.
   Clean SVG set — subtle animation only.
   ───────────────────────────────────────────── */

const CLOUD_STROKE = "rgba(255,255,255,0.25)";
const SUN_FILL = "rgba(245,158,11,0.8)";

function CloudPaths({ small = false }: { small?: boolean }) {
  return (
    <>
      <path
        d={`M10 33 a6 6 0 0 1 0 -12 a7.5 7.5 0 0 1 14.6 -2.4 A5.5 5.5 0 0 1 27 33 Z`}
        fill="rgba(255,255,255,0.06)"
        stroke={CLOUD_STROKE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <ellipse
        cx={small ? 15 : 18.5}
        cy={small ? 21.5 : 22}
        rx={small ? 6.5 : 8.5}
        ry={3.2}
        fill="rgba(255,255,255,0.08)"
        stroke={CLOUD_STROKE}
        strokeWidth="1.1"
      />
    </>
  );
}

/* Sun with rays */
function SunRays({ x = 24, y = 22, r = 6.5 }: { x?: number; y?: number; r?: number }) {
  const reduce = useReducedMotion();
  return (
    <g>
      <motion.g
        style={{ originX: `${x}px`, originY: `${y}px` }}
        animate={!reduce ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1={x}
            y1={y - r - 2.4}
            x2={x}
            y2={y - r - 5}
            stroke={SUN_FILL}
            strokeWidth="1.6"
            strokeLinecap="round"
            transform={`rotate(${deg} ${x} ${y})`}
          />
        ))}
      </motion.g>
      <circle cx={x} cy={y} r={r} fill={SUN_FILL} stroke="#f59e0b" strokeWidth="0.6" opacity="0.9" />
    </g>
  );
}

function MoonShape({ x = 25, y = 20, r = 8.5 }: { x?: number; y?: number; r?: number }) {
  return (
    <path
      d={`M ${x} ${y - r}
          a ${r} ${r} 0 1 0 ${r * 0.35} ${r * 1.72}
          a ${r * 0.62} ${r * 0.62} 0 1 1 -${r * 0.35} -${r * 1.72} Z`}
      fill="rgba(255,255,255,0.85)"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="0.7"
      strokeLinejoin="round"
    />
  );
}

function Bolt() {
  return (
    <path
      d="M26.5 26.5 L22 33.5 L25.4 33.5 L23.8 38.5 L30 30.5 L26.4 30.5 Z"
      fill="#f59e0b"
      stroke="#f59e0b"
      strokeWidth="0.4"
      opacity="0.8"
    />
  );
}

/* ── Icon components ── */

function ClearDay() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <SunRays x={24} y={24} r={8} />
      <circle cx="24" cy="24" r="13.5" fill={SUN_FILL} opacity="0.12" />
    </svg>
  );
}

function ClearNight() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <MoonShape x={26} y={22} r={9} />
      {[
        { x: 12, y: 14 },
        { x: 16, y: 34 },
        { x: 38, y: 12 },
        { x: 37, y: 33 },
      ].map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r="0.9"
          fill="rgba(255,255,255,0.3)"
        />
      ))}
    </svg>
  );
}

function PartlyDay() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <SunRays x={30} y={16} r={5.5} />
      <circle cx="30" cy="16" r="9" fill={SUN_FILL} opacity="0.1" />
      <CloudPaths />
    </svg>
  );
}

function PartlyNight() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <MoonShape x={30} y={16} r={6.5} />
      <path
        d="M10 33 a6 6 0 0 1 0 -12 a7.5 7.5 0 0 1 14.6 -2.4 A5.5 5.5 0 0 1 27 33 Z"
        fill="rgba(255,255,255,0.06)"
        stroke={CLOUD_STROKE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <ellipse cx="18.5" cy="22" rx="8.5" ry="3.2" fill="rgba(255,255,255,0.08)" stroke={CLOUD_STROKE} strokeWidth="1.1" />
    </svg>
  );
}

function Cloudy() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <g>
        <path
          d="M8 27 a4.5 4.5 0 0 1 0 -9 a6 6 0 0 1 11.7 -2 A4.4 4.4 0 0 1 22 27 Z"
          fill="rgba(255,255,255,0.05)"
          stroke={CLOUD_STROKE}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </g>
      <g>
        <path
          d="M18 33 a5 5 0 0 1 0 -10 a7 7 0 0 1 13.6 -2.2 A5 5 0 0 1 34 33 Z"
          fill="rgba(255,255,255,0.07)"
          stroke={CLOUD_STROKE}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function Overcast() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <path
        d="M7 26 a7 7 0 0 1 1.4 -13.8 A9 9 0 0 1 25 10.6 A6.8 6.8 0 0 1 33.5 19.8 A6.2 6.2 0 0 1 31 32 L9 32 Z"
        fill="rgba(255,255,255,0.05)"
        stroke={CLOUD_STROKE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <line
        x1="10" y1="37" x2="38" y2="37"
        stroke={CLOUD_STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function Fog() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <path
        d="M9 24 a5.5 5.5 0 0 1 1 -10.9 A7.5 7.5 0 0 1 24.5 11 A5.6 5.6 0 0 1 32 20.8 A5 5 0 0 1 30 30 H10.5 Z"
        fill="rgba(255,255,255,0.05)"
        stroke={CLOUD_STROKE}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {[
        { y: 33.5, x1: 9, x2: 39 },
        { y: 38.5, x1: 13, x2: 35 },
      ].map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          x2={l.x2}
          y1={l.y}
          y2={l.y}
          stroke={CLOUD_STROKE}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity={i === 0 ? 0.5 : 0.35}
        />
      ))}
    </svg>
  );
}

function Drizzle() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <CloudPaths />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={13 + i * 7}
          cy={37}
          r="1.5"
          fill="rgba(92,225,230,0.4)"
        />
      ))}
    </svg>
  );
}

function Rain() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <CloudPaths />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={13 + i * 6}
          y1={34 + (i % 2) * 1.5}
          x2={11.6 + i * 6}
          y2={39 + (i % 2) * 1.5}
          stroke="rgba(92,225,230,0.5)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function Showers() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <CloudPaths />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={12.5 + i * 6.2}
          y1={34}
          x2={9.9 + i * 6.2}
          y2={40}
          stroke="rgba(92,225,230,0.4)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function FreezingRain() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <CloudPaths />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={13.5 + i * 7}
          y={35.5}
          width="3.8"
          height="3.8"
          rx="0.8"
          transform={`rotate(45 ${15.6 + i * 7} 37.6})`}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.3"
        />
      ))}
    </svg>
  );
}

function Snow() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <CloudPaths />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${12.5 + i * 6.5} 36.2)`}>
          <line x1="0" y1="-2.4" x2="0" y2="2.4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="-2.1" y1="-1.2" x2="2.1" y2="1.2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="-2.1" y1="1.2" x2="2.1" y2="-1.2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

function SnowShowers() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <SunRays x={31} y={14} r={4.5} />
      <circle cx="31" cy="14" r="7.5" fill={SUN_FILL} opacity="0.08" />
      <CloudPaths small />
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${14 + i * 9} 36.2)`}>
          <line x1="0" y1="-2.2" x2="0" y2="2.2" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="-1.9" y1="-1.1" x2="1.9" y2="1.1" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="-1.9" y1="1.1" x2="1.9" y2="-1.1" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

function Thunder() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <CloudPaths />
      <Bolt />
    </svg>
  );
}

function ThunderHail() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <CloudPaths />
      <Bolt />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={14 + i * 7}
          cy={37}
          r="1.8"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.3"
        />
      ))}
    </svg>
  );
}

/* ── Registry ── */

const ICONS: Record<string, React.ComponentType> = {
  "clear-day": ClearDay,
  "clear-night": ClearNight,
  "partly-day": PartlyDay,
  "partly-night": PartlyNight,
  cloudy: Cloudy,
  overcast: Overcast,
  fog: Fog,
  drizzle: Drizzle,
  rain: Rain,
  showers: Showers,
  "freezing-rain": FreezingRain,
  snow: Snow,
  "snow-showers": SnowShowers,
  thunder: Thunder,
  "thunder-hail": ThunderHail,
};

export interface WeatherIconProps {
  icon: string;
  className?: string;
  label?: string;
}

export function WeatherIcon({ icon, className, label }: WeatherIconProps) {
  const Component = ICONS[icon] ?? Cloudy;
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      className={className}
    >
      <Component />
    </span>
  );
}

export function WeatherIconForCode({
  code,
  isDay,
  className,
  label,
}: {
  code: number;
  isDay: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <WeatherIcon icon={iconKey(code, isDay)} className={className} label={label} />
  );
}
