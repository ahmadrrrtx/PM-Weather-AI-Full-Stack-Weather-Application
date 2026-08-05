"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo-mark";

/* ─────────────────────────────
   Header — minimal, professional.
   Sticky with backdrop blur.
   ───────────────────────────── */

const NAV = [
  { href: "/", label: "Weather" },
  { href: "/about", label: "About" },
];

export function Header({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/[0.06] bg-[#080c14]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="NovaWeather home">
            <LogoMark className="h-7 w-7 transition-opacity duration-200 group-hover:opacity-80" />
            <span className="hidden sm:flex items-baseline gap-1.5">
              <span className="font-display text-[14px] font-semibold tracking-wide text-white/90">
                Nova
              </span>
              <span className="font-display text-[14px] font-light tracking-wide text-white/40">
                Weather
              </span>
            </span>
          </Link>

          <nav className="ml-4 hidden md:flex items-center gap-1" aria-label="Primary">
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
                    "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-150",
                    active
                      ? "text-white bg-white/[0.06]"
                      : "text-white/45 hover:text-white/70",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Search + controls (injected by parent) */}
          {children}
        </div>
      </div>
    </header>
  );
}
