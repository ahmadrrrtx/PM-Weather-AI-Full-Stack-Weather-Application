"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo-mark";
import { GitHubIcon } from "@/components/ui/brand-icons";

/* ─────────────────────────────
   Header — glass command bar:
   logo · nav · unit toggle · github
   ───────────────────────────── */

const NAV = [
  { href: "/", label: "Mission Control" },
  { href: "/about", label: "About" },
];

export function Header({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-strong border-x-0 border-t-0 rounded-none">
        <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="NovaWeather home">
            <LogoMark className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-[15px] font-bold tracking-[0.18em] text-white">
                NOVA<span className="text-aurora-cyan">WEATHER</span>
              </span>
              <span className="hud-label mt-1 text-[8.5px]">3D Weather Experience</span>
            </span>
          </Link>

          <nav className="ml-2 hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-200",
                    active
                      ? "text-aurora-cyan bg-aurora-cyan/[0.08]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.05]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Search (injected by parent) */}
          {children}

          <a
            href="https://github.com/ahmadrrrtx"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub — RRRTX Systems"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/50 transition-all duration-200 hover:text-white hover:bg-white/[0.06] hover:scale-105"
          >
            <GitHubIcon className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>
    </header>
  );
}
