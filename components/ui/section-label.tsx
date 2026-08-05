import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

/** Minimal section label. */
export function SectionLabel({ children, className, icon }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 select-none",
        className,
      )}
    >
      {icon ? (
        <span className="flex items-center justify-center text-white/25">
          {icon}
        </span>
      ) : (
        <span className="h-px w-4 bg-white/10" aria-hidden />
      )}
      <span className="text-[11px] font-medium uppercase tracking-wider text-white/30">
        {children}
      </span>
      <span className="flex-1 h-px bg-white/[0.04]" aria-hidden />
    </div>
  );
}
