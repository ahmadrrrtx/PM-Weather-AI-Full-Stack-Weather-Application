"use client";

import { motion } from "framer-motion";
import type { WeatherTip } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface Props {
  tips: WeatherTip[];
}

const severityConfig = {
  info: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    iconBg: "bg-sky-500/20",
    text: "text-sky-300",
    badge: "bg-sky-500/20 text-sky-300",
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    iconBg: "bg-amber-500/20",
    text: "text-amber-300",
    badge: "bg-amber-500/20 text-amber-300",
  },
  danger: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    iconBg: "bg-red-500/20",
    text: "text-red-300",
    badge: "bg-red-500/20 text-red-300",
  },
  success: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    iconBg: "bg-emerald-500/20",
    text: "text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
};

export default function TravelTips({ tips }: Props) {
  if (!tips.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      aria-label="Smart travel tips"
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white">Smart Travel Tips</h3>
        <span className="text-xs text-white/40 ml-auto">
          AI-generated · no API key needed
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tips.map((tip, i) => {
          const config = severityConfig[tip.severity];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={cn(
                "rounded-xl p-4 border transition-all duration-200 hover:scale-[1.02]",
                config.border,
                config.bg
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0",
                    config.iconBg
                  )}
                >
                  {tip.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        config.badge
                      )}
                    >
                      {tip.category}
                    </span>
                  </div>
                  <p className={cn("text-sm font-semibold mb-1", config.text)}>
                    {tip.title}
                  </p>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
