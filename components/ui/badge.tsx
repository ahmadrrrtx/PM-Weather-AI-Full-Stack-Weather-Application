import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "accent" | "warm";
}

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "text-white/40 border-white/[0.06] bg-white/[0.02]",
  accent: "text-accent/60 border-accent/15 bg-accent/[0.04]",
  warm: "text-warm/60 border-warm/15 bg-warm/[0.04]",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5",
        "text-[10px] font-medium uppercase tracking-wider",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
