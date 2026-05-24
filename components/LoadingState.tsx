"use client";

import { motion } from "framer-motion";

interface Props {
  message?: string;
}

export default function LoadingState({
  message = "Fetching weather data...",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-6"
    >
      {/* Animated rings */}
      <div className="relative w-20 h-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-sky-400"
            style={{ opacity: 0.6 - i * 0.2 }}
            animate={{ scale: [1, 1.5 + i * 0.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🌍</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white font-medium">{message}</p>
        <p className="text-white/40 text-sm mt-1">
          Using Open-Meteo free API
        </p>
      </div>

      {/* Skeleton cards */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 px-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="skeleton h-20 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
