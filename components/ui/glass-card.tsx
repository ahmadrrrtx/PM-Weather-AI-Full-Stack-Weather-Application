import { forwardRef } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   GlassCard — floating glass panel
   with entrance choreography.
   ───────────────────────────── */

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  /** stagger index for entrance */
  index?: number;
  strong?: boolean;
  hover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, index = 0, strong, hover, children, ...props }, ref) => {
    const reduce = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: reduce ? 0 : 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          delay: Math.min(0.08 * index, 0.5),
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          strong ? "glass-strong" : "glass",
          "rounded-2xl",
          hover &&
            "transition-all duration-300 hover:border-aurora-cyan/30 hover:shadow-[0_28px_70px_-28px_rgba(56,189,248,0.25)]",
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
GlassCard.displayName = "GlassCard";
