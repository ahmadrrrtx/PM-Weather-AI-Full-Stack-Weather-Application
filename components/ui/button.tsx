import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────
   Button — glass / primary / ghost / icon
   ───────────────────────────── */

type ButtonVariant = "primary" | "glass" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-aurora-sky/90 via-aurora-blue/80 to-aurora-violet/80 text-white " +
    "shadow-[0_10px_30px_-10px_rgba(56,189,248,0.55)] hover:shadow-[0_14px_40px_-10px_rgba(56,189,248,0.7)] " +
    "hover:brightness-110 border border-white/10",
  glass:
    "glass text-white/85 hover:text-white hover:border-aurora-cyan/35 " +
    "hover:bg-aurora-cyan/[0.06]",
  ghost: "text-white/60 hover:text-white hover:bg-white/[0.06]",
  outline:
    "border border-aurora-cyan/30 text-aurora-cyan hover:bg-aurora-cyan/10",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  icon: "h-10 w-10 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "glass", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-medium tracking-wide",
        "transition-all duration-200 select-none cursor-pointer",
        "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
