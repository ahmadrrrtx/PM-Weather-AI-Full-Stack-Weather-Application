import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "cyan" | "violet" | "mint" | "amber" | "rose" | "slate";
}

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  cyan: "text-aurora-cyan border-aurora-cyan/25 bg-aurora-cyan/[0.07]",
  violet: "text-aurora-violet border-aurora-violet/25 bg-aurora-violet/[0.07]",
  mint: "text-aurora-mint border-aurora-mint/25 bg-aurora-mint/[0.07]",
  amber: "text-aurora-amber border-aurora-amber/25 bg-aurora-amber/[0.07]",
  rose: "text-aurora-rose border-aurora-rose/25 bg-aurora-rose/[0.07]",
  slate: "text-slate-300 border-white/15 bg-white/[0.05]",
};

export function Badge({
  className,
  tone = "cyan",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-[10px] font-semibold uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
