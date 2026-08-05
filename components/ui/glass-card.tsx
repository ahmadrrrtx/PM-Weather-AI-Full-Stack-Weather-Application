import { forwardRef } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   GlassCard — subtle glass panel
   with optional entrance animation.
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
        initial={{ opacity: 0, y: reduce ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: Math.min(0.06 * index, 0.3),
          ease: [0.25, 1, 0.5, 1],
        }}
        className={cn(
          strong ? "glass-strong" : "glass",
          "rounded-xl",
          hover &&
            "transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.08]",
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
