"use client";

import { motion } from "framer-motion";
import { decodeWeatherCode } from "@/lib/weather";

interface Props {
  weatherCode: number;
  isDay: number;
  temperature: number;
}

export default function WeatherVisual3D({
  weatherCode,
  isDay,
  temperature,
}: Props) {
  const { emoji, label } = decodeWeatherCode(weatherCode, isDay);

  // Choose orb colors based on condition
  const getOrbColors = () => {
    if ([95, 96, 99].includes(weatherCode))
      return ["#4a0080", "#1a0040", "#6600cc"];
    if ([61, 63, 65, 80, 81, 82].includes(weatherCode))
      return ["#0066cc", "#003380", "#0099ff"];
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode))
      return ["#a8d8f0", "#6baed6", "#deebf7"];
    if ([0, 1].includes(weatherCode) && isDay)
      return ["#f6ad55", "#ed8936", "#fbd38d"];
    if ([0, 1].includes(weatherCode) && !isDay)
      return ["#434190", "#1a1a5e", "#667eea"];
    if ([2, 3].includes(weatherCode)) return ["#4a5568", "#2d3748", "#718096"];
    if ([45, 48].includes(weatherCode)) return ["#718096", "#4a5568", "#a0aec0"];
    return ["#3182ce", "#1a365d", "#63b3ed"];
  };

  const [c1, c2, c3] = getOrbColors();

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[180px]">
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full opacity-20"
        style={{
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${c1}80, transparent)`,
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating gradient ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          background: `conic-gradient(from 0deg, ${c1}, ${c2}, ${c3}, ${c1})`,
          opacity: 0.15,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Main orb */}
      <motion.div
        className="relative rounded-full flex flex-col items-center justify-center shadow-2xl cursor-default select-none"
        style={{
          width: 140,
          height: 140,
          background: `radial-gradient(circle at 35% 35%, ${c3}cc, ${c1}99, ${c2}ff)`,
          boxShadow: `0 0 60px ${c1}80, 0 0 30px ${c1}40, inset 0 0 40px ${c3}20`,
        }}
        animate={{
          y: [0, -10, 0],
          boxShadow: [
            `0 0 60px ${c1}80, 0 0 30px ${c1}40`,
            `0 0 80px ${c1}90, 0 0 40px ${c1}60`,
            `0 0 60px ${c1}80, 0 0 30px ${c1}40`,
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Sheen overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), transparent 60%)",
          }}
        />

        {/* Emoji */}
        <span className="text-4xl drop-shadow-lg z-10">{emoji}</span>

        {/* Temperature */}
        <span
          className="text-lg font-bold text-white z-10 mt-1 drop-shadow"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
        >
          {Math.round(temperature)}°
        </span>
      </motion.div>

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            background: c3,
            opacity: 0.5,
            top: `${20 + i * 10}%`,
            left: `${10 + i * 12}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, i % 2 === 0 ? 8 : -8, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Label */}
      <motion.p
        className="absolute bottom-0 text-xs font-medium text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {label}
      </motion.p>
    </div>
  );
}
