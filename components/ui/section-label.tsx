import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

/** Small-caps HUD section label with hairline. */
export function SectionLabel({ children, className, icon }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 select-none",
        className,
      )}
    >
      {icon ? (
        <span className="flex items-center justify-center h-5 w-5 rounded-md bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/20">
          {icon}
        </span>
      ) : (
        <span className="h-px w-5 bg-aurora-cyan/40" aria-hidden />
      )}
      <span className="hud-label">{children}</span>
      <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" aria-hidden />
    </div>
  );
}
