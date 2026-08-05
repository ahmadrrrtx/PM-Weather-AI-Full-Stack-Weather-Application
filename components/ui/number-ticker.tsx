"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   NumberTicker — smooth count-up
   for numeric readouts. Respects
   prefers-reduced-motion.
   ───────────────────────────── */

interface NumberTickerProps {
  value: number;
  decimals?: number;
  className?: string;
  duration?: number;
  /** render prefix/suffix separately */
  format?: (v: number) => string;
}

export function NumberTicker({
  value,
  decimals = 0,
  className,
  duration = 900,
  format,
}: NumberTickerProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  const fromRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const from = fromRef.current;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const v = from + (value - from) * eased;
      setDisplay(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, reduce]);

  const text = format ? format(display) : display.toFixed(decimals);

  return <span className={cn("tabular", className)}>{text}</span>;
}
