"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   Tabs — accessible tablist with
   keyboard navigation, animated
   active indicator.
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
        "inline-flex items-center gap-0.5 rounded-lg border border-white/[0.05] bg-white/[0.02] p-0.5",
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
              "relative flex items-center gap-1.5 rounded-md px-3 py-1.5",
              "text-[12px] font-medium transition-colors duration-150",
              active ? "text-white/90" : "text-white/35 hover:text-white/55",
            )}
          >
            {active && (
              <motion.span
                layoutId={`${baseId}-tab-pill`}
                className="absolute inset-0 rounded-md bg-white/[0.06]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            {item.icon && (
              <span className={cn("relative z-10", active ? "text-accent/80" : "")}>
                {item.icon}
              </span>
            )}
            <span className="relative z-10 hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
