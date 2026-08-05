"use client";

import { motion, useReducedMotion } from "framer-motion";
import { iconKey } from "@/lib/weather-codes";

/* ─────────────────────────────────────────────
   NovaWeather animated icon system.
   Hand-crafted SVG set — WMO groups → icon key
   (see lib/weather-codes.ts). Thin strokes,
   gradient accents, gentle looping motion.
   MotionConfig reducedMotion="user" disables
   the loops for users who prefer stillness.
   ───────────────────────────────────────────── */

const CLOUD_STROKE = "url(#nw-cld)";
const SUN_FILL = "url(#nw-sun)";

function CloudPaths({ small = false }: { small?: boolean }) {
  const w = small ? 13 : 17;
  return (
    <>
      <motion.path
        d={`M10 33 a6 6 0 0 1 0 -12 a7.5 7.5 0 0 1 14.6 -2.4 A5.5 5.5 0 0 1 27 33 Z`}
        fill="rgba(207,227,255,0.10)"
        stroke={CLOUD_STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <motion.ellipse
        cx={small ? 15 : 18.5}
        cy={small ? 21.5 : 22}
        rx={w / 2}
        ry={3.4}
        fill="rgba(207,227,255,0.16)"
        stroke={CLOUD_STROKE}
        strokeWidth="1.2"
      />
    </>
  );
}

/* ── Sun with rotating rays ── */
function SunRays({ x = 24, y = 22, r = 6.5, animate = true }: { x?: number; y?: number; r?: number; animate?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <g>
      <motion.g
        style={{ originX: `${x}px`, originY: `${y}px` }}
        animate={animate && !reduce ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1={x}
            y1={y - r - 2.6}
            x2={x}
            y2={y - r - 5.6}
            stroke="url(#nw-sun)"
            strokeWidth="1.8"
            strokeLinecap="round"
            transform={`rotate(${deg} ${x} ${y})`}
          />
        ))}
      </motion.g>
      <circle cx={x} cy={y} r={r} fill={SUN_FILL} stroke="#ffd27d" strokeWidth="0.8" opacity="0.92" />
    </g>
  );
}

function MoonShape({ x = 25, y = 20, r = 8.5 }: { x?: number; y?: number; r?: number }) {
  return (
    <path
      d={`M ${x} ${y - r}
          a ${r} ${r} 0 1 0 ${r * 0.35} ${r * 1.72}
          a ${r * 0.62} ${r * 0.62} 0 1 1 -${r * 0.35} -${r * 1.72} Z`}
      fill="url(#nw-moon)"
      stroke="#dfe9ff"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
  );
}

function Bolt() {
  return (
    <motion.path
      d="M26.5 26.5 L22 33.5 L25.4 33.5 L23.8 38.5 L30 30.5 L26.4 30.5 Z"
      fill="url(#nw-bolt)"
      stroke="#fde047"
      strokeWidth="0.6"
      animate={{ opacity: [1, 0.55, 1, 0.75, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.18, 0.36, 0.5, 1] }}
    />
  );
}

/* ── Icon components ── */

function ClearDay() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <SunRays x={24} y={24} r={8} />
      <circle cx="24" cy="24" r="13.5" fill="url(#nw-sun)" opacity="0.18" />
    </svg>
  );
}

function ClearNight() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-moon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f7ff" />
          <stop offset="1" stopColor="#b9cdf2" />
        </linearGradient>
      </defs>
      <MoonShape x={26} y={22} r={9} />
      {[
        { x: 12, y: 14, d: 0 },
        { x: 16, y: 34, d: 1.2 },
        { x: 38, y: 12, d: 0.6 },
        { x: 37, y: 33, d: 1.8 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r="1.1"
          fill="#cfe3ff"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 3.4, repeat: Infinity, delay: s.d }}
        />
      ))}
    </svg>
  );
}

function PartlyDay() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf4ff" />
          <stop offset="1" stopColor="#9fb8dd" />
        </linearGradient>
        <linearGradient id="nw-sun2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <SunRays x={30} y={16} r={5.5} />
      <circle cx="30" cy="16" r="9" fill="url(#nw-sun2)" opacity="0.16" />
      <CloudPaths />
    </svg>
  );
}

function PartlyNight() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf4ff" />
          <stop offset="1" stopColor="#93a9cf" />
        </linearGradient>
      </defs>
      <MoonShape x={30} y={16} r={6.5} />
      <motion.path
        d="M10 33 a6 6 0 0 1 0 -12 a7.5 7.5 0 0 1 14.6 -2.4 A5.5 5.5 0 0 1 27 33 Z"
        fill="rgba(207,227,255,0.10)"
        stroke="url(#nw-cld2)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <motion.ellipse cx="18.5" cy="22" rx="8.5" ry="3.4" fill="rgba(207,227,255,0.16)" stroke="url(#nw-cld2)" strokeWidth="1.2" />
    </svg>
  );
}

function Cloudy() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf4ff" />
          <stop offset="1" stopColor="#8fa7cc" />
        </linearGradient>
      </defs>
      <motion.g
        animate={{ x: [0, -2.5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M8 27 a4.5 4.5 0 0 1 0 -9 a6 6 0 0 1 11.7 -2 A4.4 4.4 0 0 1 22 27 Z"
          fill="rgba(207,227,255,0.10)"
          stroke="url(#nw-cld3)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </motion.g>
      <motion.g
        animate={{ x: [0, 2.5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M18 33 a5 5 0 0 1 0 -10 a7 7 0 0 1 13.6 -2.2 A5 5 0 0 1 34 33 Z"
          fill="rgba(207,227,255,0.12)"
          stroke="url(#nw-cld3)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  );
}

function Overcast() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dbe7f8" />
          <stop offset="1" stopColor="#7d93b8" />
        </linearGradient>
      </defs>
      <motion.path
        d="M7 26 a7 7 0 0 1 1.4 -13.8 A9 9 0 0 1 25 10.6 A6.8 6.8 0 0 1 33.5 19.8 A6.2 6.2 0 0 1 31 32 L9 32 Z"
        fill="rgba(207,227,255,0.10)"
        stroke="url(#nw-cld4)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <motion.line
        x1="10" y1="37" x2="38" y2="37"
        stroke="url(#nw-cld4)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </svg>
  );
}

function Fog() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld5" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dbe7f8" />
          <stop offset="1" stopColor="#8ba1c4" />
        </linearGradient>
      </defs>
      <path
        d="M9 24 a5.5 5.5 0 0 1 1 -10.9 A7.5 7.5 0 0 1 24.5 11 A5.6 5.6 0 0 1 32 20.8 A5 5 0 0 1 30 30 H10.5 Z"
        fill="rgba(207,227,255,0.10)"
        stroke="url(#nw-cld5)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {[
        { y: 33.5, delay: 0 },
        { y: 38.5, delay: 0.9 },
      ].map((l, i) => (
        <motion.line
          key={i}
          x1={i === 0 ? 9 : 13}
          x2={i === 0 ? 39 : 35}
          y1={l.y}
          y2={l.y}
          stroke="url(#nw-cld5)"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={{ opacity: [0.35, 0.8, 0.35], x: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 6, repeat: Infinity, delay: l.delay, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

function Drizzle() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld6" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf4ff" />
          <stop offset="1" stopColor="#94a8cc" />
        </linearGradient>
        <linearGradient id="nw-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <CloudPaths />
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${15 + i * 7} 35 c0 2.2 -1.8 3.6 -2 3.6 c-0.2 0 -2 -1.4 -2 -3.6 a2 2 0 0 1 4 0 Z`}
          fill="url(#nw-drop)"
          animate={{ y: [0, 4.5, 0], opacity: [0.9, 0.45, 0.9] }}
          transition={{ duration: 1.7, repeat: Infinity, delay: i * 0.35, ease: "easeIn" }}
        />
      ))}
    </svg>
  );
}

function Rain() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld7" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf4ff" />
          <stop offset="1" stopColor="#90a5ca" />
        </linearGradient>
        <linearGradient id="nw-drop2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#2f8ff8" />
        </linearGradient>
      </defs>
      <CloudPaths />
      {[0, 1, 2, 3].map((i) => (
        <motion.line
          key={i}
          x1={13 + i * 6}
          y1={34 + (i % 2) * 1.5}
          x2={11.6 + i * 6}
          y2={40 + (i % 2) * 1.5}
          stroke="url(#nw-drop2)"
          strokeWidth="1.9"
          strokeLinecap="round"
          animate={{ y: [0, 2.5, 0], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.15, repeat: Infinity, delay: i * 0.22, ease: "easeIn" }}
        />
      ))}
    </svg>
  );
}

function Showers() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld8" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf4ff" />
          <stop offset="1" stopColor="#8aa0c6" />
        </linearGradient>
        <linearGradient id="nw-drop3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#93c5fd" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <CloudPaths />
      {[0, 1, 2, 3].map((i) => (
        <motion.path
          key={i}
          d={`M${12.5 + i * 6.2} 34 l-2.6 6.4`}
          stroke="url(#nw-drop3)"
          strokeWidth="2.1"
          strokeLinecap="round"
          animate={{ y: [0, 3, 0], opacity: [1, 0.35, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.16, ease: "easeIn" }}
        />
      ))}
    </svg>
  );
}

function FreezingRain() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld9" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef6ff" />
          <stop offset="1" stopColor="#9fb4d8" />
        </linearGradient>
        <linearGradient id="nw-ice" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0f2fe" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <CloudPaths />
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          animate={{ y: [0, 5, 0], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.9, repeat: Infinity, delay: i * 0.4, ease: "easeIn" }}
        >
          <rect
            x={13.5 + i * 7}
            y={35.5}
            width="4.2"
            height="4.2"
            rx="1"
            transform={`rotate(45 ${15.6 + i * 7} 37.6)`}
            fill="none"
            stroke="url(#nw-ice)"
            strokeWidth="1.5"
          />
        </motion.g>
      ))}
    </svg>
  );
}

function Snow() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld10" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f7ff" />
          <stop offset="1" stopColor="#a9bede" />
        </linearGradient>
        <linearGradient id="nw-flake" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a5c4ef" />
        </linearGradient>
      </defs>
      <CloudPaths />
      {[0, 1, 2, 3].map((i) => (
        <motion.g
          key={i}
          animate={{ y: [0, 4.5, 0], x: [0, i % 2 ? 1.6 : -1.6, 0], rotate: [0, 24, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}
          style={{ originX: "14px", originY: "37px" }}
        >
          <g transform={`translate(${12.5 + i * 6.5} 36.2)`}>
            <line x1="0" y1="-2.6" x2="0" y2="2.6" stroke="url(#nw-flake)" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="-2.3" y1="-1.3" x2="2.3" y2="1.3" stroke="url(#nw-flake)" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="-2.3" y1="1.3" x2="2.3" y2="-1.3" stroke="url(#nw-flake)" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </motion.g>
      ))}
    </svg>
  );
}

function SnowShowers() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld11" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f7ff" />
          <stop offset="1" stopColor="#a9bede" />
        </linearGradient>
        <linearGradient id="nw-flake2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a5c4ef" />
        </linearGradient>
        <linearGradient id="nw-sun3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <SunRays x={31} y={14} r={4.5} animate={false} />
      <circle cx="31" cy="14" r="7.5" fill="url(#nw-sun3)" opacity="0.14" />
      <CloudPaths small />
      {[0, 1].map((i) => (
        <motion.g
          key={i}
          animate={{ y: [0, 4.5, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
        >
          <g transform={`translate(${14 + i * 9} 36.2)`}>
            <line x1="0" y1="-2.4" x2="0" y2="2.4" stroke="url(#nw-flake2)" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="-2.1" y1="-1.2" x2="2.1" y2="1.2" stroke="url(#nw-flake2)" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="-2.1" y1="1.2" x2="2.1" y2="-1.2" stroke="url(#nw-flake2)" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </motion.g>
      ))}
    </svg>
  );
}

function Thunder() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld12" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2ecff" />
          <stop offset="1" stopColor="#8599c0" />
        </linearGradient>
        <linearGradient id="nw-bolt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef08a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <CloudPaths />
      <Bolt />
    </svg>
  );
}

function ThunderHail() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="nw-cld13" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2ecff" />
          <stop offset="1" stopColor="#7f93ba" />
        </linearGradient>
        <linearGradient id="nw-bolt2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef08a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="nw-hail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b7cdf2" />
        </linearGradient>
      </defs>
      <CloudPaths />
      <Bolt />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={14 + i * 7}
          cy={37}
          r="2.2"
          fill="none"
          stroke="url(#nw-hail)"
          strokeWidth="1.5"
          animate={{ y: [0, 2.6, 0], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: "easeIn" }}
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
  /** icon key from lib/weather-codes.ts */
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

/** Resolve from WMO code + isDay. */
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
