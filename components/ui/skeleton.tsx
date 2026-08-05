import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  /** aria label for screen readers while loading */
  label?: string;
}

export function Skeleton({ className, label = "Loading" }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("skeleton rounded-lg", className)}
    >
      <span className="sr-only">{label}…</span>
    </div>
  );
}
