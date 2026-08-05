import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
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
