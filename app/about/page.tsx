"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Globe, Sparkles, Heart, Compass } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";

import { AuroraBackground } from "@/components/layout/aurora-background";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

/* ─────────────────────────────
   About — an elegant developer
   profile, not an advertisement.
   ───────────────────────────── */

const LINKS = [
  {
    href: "https://rrrtx-systems.com/",
    label: "rrrtx-systems.com",
    sub: "Official Website",
    icon: <Globe className="h-4 w-4" aria-hidden />,
  },
  {
    href: "https://github.com/ahmadrrrtx/",
    label: "github.com/ahmadrrrtx",
    sub: "GitHub",
    icon: <GitHubIcon className="h-4 w-4" />,
  },
  {
    href: "https://www.linkedin.com/in/ahmadrrrtx",
    label: "linkedin.com/in/ahmadrrrtx",
    sub: "LinkedIn",
    icon: <LinkedInIcon className="h-4 w-4" />,
  },
];

const PRINCIPLES = [
  {
    title: "Free-first engineering",
    body: "If an excellent free or open-source option exists, NovaWeather uses it — no keys, no accounts, no lock-in.",
  },
  {
    title: "Craft over speed",
    body: "Every animation is choreographed, every panel is intentional. Nothing appears abruptly; nothing distracts.",
  },
  {
    title: "Open by default",
    body: "The code, the data stack, and the design decisions are all documented and open source under MIT.",
  },
  {
    title: "Precision matters",
    body: "Typed data pipelines, unit-tested converters, and strict quality gates — polish survives shipping.",
  },
];

const SKILLS = [
  "Next.js", "React", "TypeScript", "Three.js / WebGL", "Tailwind CSS",
  "Node.js", "AI & LLM Integration", "Open Data APIs", "MapLibre / GIS",
  "ECharts / Data Viz", "Design Systems", "Performance Engineering",
];

const PROJECTS = [
  {
    name: "NovaWeather",
    role: "Creator & Engineer",
    year: "2026",
    body: "The project you&apos;re exploring — a cinematic 3D weather experience built entirely on free open data. Real-time Earth, radar & satellite layers, air quality, astronomy, and climate analytics.",
    links: [{ href: "https://github.com/ahmadrrrtx/Weather-AI", label: "Source" }],
  },
  {
    name: "Weather-AI",
    role: "Full-stack build",
    year: "2026",
    body: "A full-stack weather intelligence application with multi-provider geocoding, forecast charts, maps, travel insights, and export tooling — built for the PM Accelerator AI Engineer assessment.",
    links: [{ href: "https://github.com/ahmadrrrtx/Weather-AI", label: "Source" }],
  },
  {
    name: "RRRTX Systems",
    role: "Founder",
    year: "Now",
    body: "An engineering studio focused on AI-powered products, spatial interfaces, and open data — where NovaWeather was designed and engineered.",
    links: [{ href: "https://rrrtx-systems.com/", label: "Website" }],
  },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function AboutPage() {
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Header />

      <main id="main" className="relative z-10">
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          {/* Hero */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={reduce ? undefined : fade}
            custom={0}
            className="flex flex-col items-center text-center"
          >
            {/* Monogram */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.9 }}
              className="relative"
            >
              <div className="glass-strong flex h-24 w-24 items-center justify-center rounded-3xl">
                <span className="aurora-text font-display text-3xl font-bold tracking-tight">MA</span>
              </div>
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-aurora-mint/40 bg-[#061020]">
                <Sparkles className="h-3 w-3 text-aurora-mint" aria-hidden />
              </span>
            </motion.div>

            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Muhammad Ahmad
            </h1>
            <p className="mt-2 text-sm font-medium tracking-wide text-aurora-cyan/90">
              Founder &amp; AI Engineer
              <span className="mx-2 text-white/25">·</span>
              <span className="text-white/55">RRRTX Systems</span>
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Badge tone="mint">Open Source</Badge>
              <Badge tone="violet">AI Engineering</Badge>
              <Badge tone="cyan">Spatial UI</Badge>
            </div>

            {/* Links */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {LINKS.map((l) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  variants={reduce ? undefined : fade}
                  custom={1}
                  className="glass group flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium text-white/70 transition-all duration-200 hover:border-aurora-cyan/35 hover:text-white"
                >
                  {l.icon}
                  <span className="hidden sm:inline">{l.label}</span>
                  <span className="sm:hidden">{l.sub}</span>
                  <ArrowUpRight className="h-3 w-3 text-white/25 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-aurora-cyan" aria-hidden />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14"
          >
            <GlassCard className="p-7 sm:p-9">
              <div className="flex items-center gap-2.5">
                <Compass className="h-4 w-4 text-aurora-cyan" aria-hidden />
                <h2 className="hud-label">The Builder</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" aria-hidden />
              </div>
              <p className="mt-5 text-sm leading-7 text-white/65 sm:text-[15px] sm:leading-8">
                I&apos;m Muhammad Ahmad — an AI engineer and the founder of{" "}
                <a href="https://rrrtx-systems.com/" target="_blank" rel="noreferrer" className="text-aurora-cyan/90 underline decoration-aurora-cyan/30 underline-offset-4 hover:text-aurora-cyan">
                  RRRTX Systems
                </a>
                . I build products where intelligence meets interface: cinematic
                real-time experiences, AI-powered tooling, and interfaces that feel
                like instruments rather than websites.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/55 sm:text-[15px] sm:leading-8">
                NovaWeather is that philosophy distilled — a weather experience
                designed like mission control and built entirely on free, open data.
                No paid APIs, no keys, no tracking. Just careful engineering: a
                WebGL Earth with a real day/night terminator, live radar and
                satellite layers, air quality, astronomy, and 30-day climate
                analytics — all documented, tested, and open source.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-white/35">
                <Heart className="h-3.5 w-3.5 text-aurora-rose" aria-hidden />
                Crafted with obsession for detail.
              </div>
            </GlassCard>
          </motion.div>

          {/* Principles */}
          <div className="mt-12">
            <motion.h2
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hud-label mb-5 text-center"
            >
              Principles
            </motion.h2>
            <div className="grid gap-3.5 sm:grid-cols-2">
              {PRINCIPLES.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={reduce ? undefined : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlassCard className="h-full p-6" hover>
                    <h3 className="font-display text-sm font-semibold text-white">{p.title}</h3>
                    <p className="mt-2.5 text-xs leading-6 text-white/50">{p.body}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-12">
            <motion.h2
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hud-label mb-4 text-center"
            >
              Toolbox
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-2">
              {SKILLS.map((s, i) => (
                <motion.span
                  key={s}
                  initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                  className="glass rounded-full px-3.5 py-1.5 text-[11px] font-medium text-white/60 transition-colors duration-200 hover:border-aurora-cyan/35 hover:text-white"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="mt-14">
            <motion.h2
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hud-label mb-5 text-center"
            >
              Selected Work
            </motion.h2>
            <div className="space-y-3.5">
              {PROJECTS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={reduce ? undefined : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlassCard className="p-6" hover>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-base font-semibold text-white">{p.name}</h3>
                      <span className="text-[10px] uppercase tracking-widest text-aurora-cyan/70">{p.role}</span>
                      <span className="tabular ml-auto text-[10px] text-white/30">{p.year}</span>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-white/50">{p.body}</p>
                    <div className="mt-4 flex gap-4">
                      {p.links.map((l) => (
                        <a
                          key={l.href + l.label}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1 text-[11px] font-semibold text-aurora-cyan/85 transition-colors hover:text-aurora-cyan"
                        >
                          {l.label}
                          <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                        </a>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14 text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aurora-sky/90 via-aurora-blue/80 to-aurora-violet/80 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_44px_-12px_rgba(56,189,248,0.6)] transition-all duration-300 hover:scale-[1.03] hover:brightness-110"
            >
              <Compass className="h-4 w-4" aria-hidden />
              Back to Mission Control
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
