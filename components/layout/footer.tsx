"use client";

import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";

/* ─────────────────────────────
   Footer — minimal, clean.
   ───────────────────────────── */

export function Footer() {
  return (
    <footer className="relative z-10 mt-8">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 pb-8">
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] px-6 py-6 sm:px-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <LogoMark className="h-6 w-6" />
                <span className="font-display text-[13px] font-medium tracking-wide text-white/60">
                  Nova<span className="text-white/30">Weather</span>
                </span>
              </div>
              <p className="mt-2.5 max-w-sm text-[11px] leading-relaxed text-white/25">
                Real-time 3D weather experience built on free, open data.
                Open source under MIT.
              </p>
            </div>

            {/* Links */}
            <nav aria-label="Footer links">
              <h3 className="text-[10px] font-medium uppercase tracking-wider text-white/20">Developer</h3>
              <ul className="mt-2.5 space-y-1.5">
                <li>
                  <a
                    href="https://rrrtx-systems.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-white/35 transition-colors hover:text-white/55"
                  >
                    rrrtx-systems.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ahmadrrrtx/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-white/35 transition-colors hover:text-white/55"
                  >
                    <GitHubIcon className="h-3 w-3" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/ahmadrrrtx"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-white/35 transition-colors hover:text-white/55"
                  >
                    <LinkedInIcon className="h-3 w-3" />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </nav>

            {/* Data sources */}
            <div>
              <h3 className="text-[10px] font-medium uppercase tracking-wider text-white/20">Data Sources</h3>
              <ul className="mt-2.5 space-y-1 text-[11px] text-white/20">
                <li>Open-Meteo</li>
                <li>RainViewer</li>
                <li>NASA GIBS</li>
                <li>OpenFreeMap</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-1.5 border-t border-white/[0.03] pt-4 sm:flex-row sm:justify-between">
            <p className="text-[10px] text-white/20">
              Built by{" "}
              <Link href="/about" className="text-white/35 hover:text-white/50 transition-colors">
                Muhammad Ahmad
              </Link>
            </p>
            <p className="text-[10px] text-white/15">
              RRRTX Systems · Open Source
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
