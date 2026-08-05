"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   Tabs — accessible tablist with
   keyboard navigation (←/→/Home/End),
   animated active indicator.
   ───────────────────────────── */

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  ariaLabel: string;
}

export function Tabs({ items, value, onChange, className, ariaLabel }: TabsProps) {
  const baseId = useId();
  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === value),
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = activeIndex;
    if (e.key === "ArrowRight") next = (activeIndex + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (activeIndex - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[next]?.id ?? items[0]?.id ?? "");
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        "glass inline-flex items-center gap-0.5 rounded-xl p-1",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            id={`${baseId}-tab-${item.id}`}
            aria-selected={active}
            aria-controls={`${baseId}-panel-${item.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5",
              "text-xs font-semibold tracking-wide transition-colors duration-200",
              active ? "text-white" : "text-white/45 hover:text-white/80",
            )}
          >
            {active && (
              <motion.span
                layoutId={`${baseId}-tab-pill`}
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-aurora-sky/25 to-aurora-violet/25 border border-aurora-cyan/25"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            {item.icon && (
              <span className={cn("relative z-10", active ? "text-aurora-cyan" : "")}>
                {item.icon}
              </span>
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
