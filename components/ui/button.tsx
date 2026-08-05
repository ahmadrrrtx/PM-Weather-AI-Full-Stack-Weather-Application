import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   Button — minimal variants.
   ───────────────────────────── */

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-white/[0.06] text-white/85 hover:bg-white/[0.08] border border-white/[0.06]",
  ghost: "text-white/40 hover:text-white/60 hover:bg-white/[0.03]",
  outline:
    "border border-white/[0.06] text-white/50 hover:bg-white/[0.03] hover:text-white/70",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-9 px-4 text-[13px] rounded-lg gap-2",
  icon: "h-9 w-9 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "ghost", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-150 select-none cursor-pointer",
        "active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
