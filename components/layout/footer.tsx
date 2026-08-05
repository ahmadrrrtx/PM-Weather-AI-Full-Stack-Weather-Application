"use client";

import Link from "next/link";
import { Globe, Heart } from "lucide-react";
import { LogoMark } from "@/components/ui/logo-mark";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";

/* ─────────────────────────────
   Footer — crafted by Muhammad Ahmad.
   Designed & Engineered by RRRTX Systems.
   ───────────────────────────── */

const VERSION = "1.0.0";

export function Footer() {
  return (
    <footer className="relative z-10 mt-10">
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 pb-8">
        <div className="glass rounded-2xl px-6 py-8 sm:px-10">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <LogoMark className="h-7 w-7" />
                <span className="font-display text-sm font-bold tracking-[0.18em] text-white">
                  NOVA<span className="text-aurora-cyan">WEATHER</span>
                </span>
              </div>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/45">
                A next-generation 3D weather experience — real-time WebGL Earth,
                live radar &amp; satellite layers, and cinematic glass interfaces.
                Powered entirely by free, open data. Open source, MIT licensed.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-aurora-mint/25 bg-aurora-mint/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-aurora-mint">
                  <span className="h-1.5 w-1.5 rounded-full bg-aurora-mint animate-pulse-soft" />
                  v{VERSION}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                  MIT License
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                  100% Free APIs
                </span>
              </div>
            </div>

            {/* Links */}
            <nav aria-label="Footer — developer links">
              <h2 className="hud-label">Developer</h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="https://rrrtx-systems.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-white/55 transition-colors hover:text-aurora-cyan"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    rrrtx-systems.com
                    <span className="text-white/25 group-hover:text-aurora-cyan/60">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ahmadrrrtx/"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-white/55 transition-colors hover:text-aurora-cyan"
                  >
                    <GitHubIcon className="h-3.5 w-3.5" />
                    github.com/ahmadrrrtx
                    <span className="text-white/25 group-hover:text-aurora-cyan/60">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/ahmadrrrtx"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-white/55 transition-colors hover:text-aurora-cyan"
                  >
                    <LinkedInIcon className="h-3.5 w-3.5" />
                    linkedin.com/in/ahmadrrrtx
                    <span className="text-white/25 group-hover:text-aurora-cyan/60">↗</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Data sources */}
            <div>
              <h2 className="hud-label">Free Data Sources</h2>
              <ul className="mt-3 space-y-1.5 text-xs text-white/40">
                <li>Open-Meteo — forecast, AQI, astronomy, history</li>
                <li>RainViewer — global radar</li>
                <li>NASA GIBS — satellite imagery</li>
                <li>OpenFreeMap — vector basemap</li>
                <li>OpenStreetMap — geocoding fallback</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 border-t border-white/[0.07] pt-6 sm:flex-row sm:justify-between">
            <p className="flex items-center gap-1.5 text-[11px] text-white/40">
              Crafted with <Heart className="h-3 w-3 text-aurora-rose" aria-hidden /> by
              <Link href="/about" className="text-aurora-cyan/80 hover:text-aurora-cyan">
                Muhammad Ahmad
              </Link>
            </p>
            <p className="text-[11px] text-white/30">
              Designed &amp; Engineered by{" "}
              <a
                href="https://rrrtx-systems.com/"
                target="_blank"
                rel="noreferrer"
                className="text-white/50 transition-colors hover:text-aurora-cyan"
              >
                RRRTX Systems
              </a>{" "}
              · Open Source
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
