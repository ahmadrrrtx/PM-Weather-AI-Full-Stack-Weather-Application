/* ─────────────────────────────
   AuroraBackground — deep-space environment:
   aurora blobs, starfield, scan line.
   Fixed, pointer-events-none.
   ───────────────────────────── */

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Base space gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#0d1b36_0%,#070d1c_45%,#03060d_100%)]" />

      {/* Aurora blobs */}
      <div className="absolute -top-[20%] -left-[10%] h-[55vmax] w-[55vmax] rounded-full bg-aurora-sky/[0.09] blur-[120px] animate-aurora-drift" />
      <div className="absolute top-[10%] -right-[15%] h-[50vmax] w-[50vmax] rounded-full bg-aurora-violet/[0.08] blur-[130px] animate-aurora-drift-2" />
      <div className="absolute -bottom-[25%] left-[20%] h-[45vmax] w-[45vmax] rounded-full bg-aurora-blue/[0.07] blur-[140px] animate-aurora-drift" />
      <div className="absolute top-[45%] left-[45%] h-[30vmax] w-[30vmax] rounded-full bg-aurora-mint/[0.04] blur-[120px] animate-aurora-drift-2" />

      {/* Starfield */}
      <div className="absolute inset-0 starfield opacity-[0.5]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_50%,transparent_55%,rgba(2,4,10,0.55)_100%)]" />
    </div>
  );
}
