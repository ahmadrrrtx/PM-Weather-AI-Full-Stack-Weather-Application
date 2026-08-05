/* ─────────────────────────────
   Background — subtle, minimal.
   Just a deep gradient with
   a hint of depth.
   ───────────────────────────── */

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Deep gradient — subtle depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,#0d1525_0%,#080c14_50%,#060910_100%)]" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_60%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
