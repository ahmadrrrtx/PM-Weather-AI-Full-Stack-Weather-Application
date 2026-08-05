"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Globe, Heart, Compass } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";

import { AuroraBackground } from "@/components/layout/aurora-background";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

/* ─────────────────────────────
   About — developer profile.
   Clean, minimal, professional.
   ───────────────────────────── */

const LINKS = [
  {
    href: "https://rrrtx-systems.com/",
    label: "rrrtx-systems.com",
    sub: "Website",
    icon: <Globe className="h-3.5 w-3.5" aria-hidden />,
  },
  {
    href: "https://github.com/ahmadrrrtx/",
    label: "GitHub",
    sub: "GitHub",
    icon: <GitHubIcon className="h-3.5 w-3.5" />,
  },
  {
    href: "https://www.linkedin.com/in/ahmadrrrtx",
    label: "LinkedIn",
    sub: "LinkedIn",
    icon: <LinkedInIcon className="h-3.5 w-3.5" />,
  },
];

const PRINCIPLES = [
  {
    title: "Free-first",
    body: "If an excellent free option exists, NovaWeather uses it — no keys, no accounts, no lock-in.",
  },
  {
    title: "Craft over speed",
    body: "Every animation is intentional, every panel is considered. Nothing appears abruptly.",
  },
  {
    title: "Open source",
    body: "Code, data stack, and design decisions are documented and MIT licensed.",
  },
  {
    title: "Precision",
    body: "Typed pipelines, tested converters, strict quality gates — polish survives shipping.",
  },
];

const SKILLS = [
  "Next.js", "React", "TypeScript", "Three.js", "Tailwind CSS",
  "Node.js", "AI/LLM", "Open Data APIs", "MapLibre",
  "ECharts", "Design Systems", "Performance",
];

const PROJECTS = [
  {
    name: "NovaWeather",
    role: "Creator",
    year: "2026",
    body: "Cinematic 3D weather experience built on free open data. Real-time Earth, radar, satellite, air quality, astronomy, and climate analytics.",
    links: [{ href: "https://github.com/ahmadrrrtx/NovaWeather", label: "Source" }],
  },
  {
    name: "Weather-AI",
    role: "Full-stack",
    year: "2026",
    body: "Full-stack weather intelligence with multi-provider geocoding, charts, maps, travel insights, and export tooling.",
    links: [{ href: "https://github.com/ahmadrrrtx/Weather-AI", label: "Source" }],
  },
  {
    name: "RRRTX Systems",
    role: "Founder",
    year: "Now",
    body: "Engineering studio focused on AI-powered products, spatial interfaces, and open data.",
    links: [{ href: "https://rrrtx-systems.com/", label: "Website" }],
  },
];

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.5, ease: [0.25, 1, 0.5, 1] as const },
  }),
};

export default function AboutPage() {
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Header />

      <main id="main" className="relative z-10">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
          {/* Hero */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={reduce ? undefined : fade}
            custom={0}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]"
            >
              <span className="font-display text-2xl font-bold text-white/60">MA</span>
            </motion.div>

            <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-white/90 sm:text-3xl">
              Muhammad Ahmad
            </h1>
            <p className="mt-1.5 text-[13px] font-medium text-white/40">
              Founder & AI Engineer
              <span className="mx-2 text-white/15">·</span>
              RRRTX Systems
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Badge>Open Source</Badge>
              <Badge>AI Engineering</Badge>
              <Badge>Spatial UI</Badge>
            </div>

            {/* Links */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {LINKS.map((l) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  variants={reduce ? undefined : fade}
                  custom={1}
                  className="group flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3.5 py-2 text-[12px] font-medium text-white/45 transition-colors duration-150 hover:border-white/[0.08] hover:text-white/65"
                >
                  {l.icon}
                  <span>{l.label}</span>
                  <ArrowUpRight className="h-3 w-3 text-white/15 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="mt-12"
          >
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <Compass className="h-3.5 w-3.5 text-white/25" aria-hidden />
                <h2 className="text-[10px] font-medium uppercase tracking-wider text-white/25">About</h2>
                <span className="h-px flex-1 bg-white/[0.04]" aria-hidden />
              </div>
              <p className="mt-4 text-[13px] leading-7 text-white/50 sm:text-[14px] sm:leading-7">
                I build products where intelligence meets interface — real-time
                experiences, AI-powered tooling, and interfaces that feel like
                instruments rather than websites.
              </p>
              <p className="mt-3 text-[13px] leading-7 text-white/35 sm:text-[14px] sm:leading-7">
                NovaWeather is that philosophy — a weather experience designed like
                mission control and built entirely on free, open data. No paid APIs,
                no keys, no tracking.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/20">
                <Heart className="h-3 w-3 text-white/20" aria-hidden />
                Crafted with attention to detail.
              </div>
            </GlassCard>
          </motion.div>

          {/* Principles */}
          <div className="mt-10">
            <motion.h2
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-center text-[10px] font-medium uppercase tracking-wider text-white/20"
            >
              Principles
            </motion.h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PRINCIPLES.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={reduce ? undefined : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                >
                  <GlassCard className="h-full p-5" hover>
                    <h3 className="text-[13px] font-semibold text-white/70">{p.title}</h3>
                    <p className="mt-2 text-[11px] leading-5 text-white/30">{p.body}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-10">
            <motion.h2
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-3 text-center text-[10px] font-medium uppercase tracking-wider text-white/20"
            >
              Toolbox
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-1.5">
              {SKILLS.map((s, i) => (
                <motion.span
                  key={s}
                  initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  className="rounded-md border border-white/[0.04] bg-white/[0.015] px-3 py-1.5 text-[11px] font-medium text-white/35 transition-colors duration-150 hover:border-white/[0.06] hover:text-white/50"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="mt-10">
            <motion.h2
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-center text-[10px] font-medium uppercase tracking-wider text-white/20"
            >
              Selected Work
            </motion.h2>
            <div className="space-y-3">
              {PROJECTS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={reduce ? undefined : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                >
                  <GlassCard className="p-5" hover>
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <h3 className="text-[14px] font-semibold text-white/70">{p.name}</h3>
                      <span className="text-[9px] uppercase tracking-wider text-white/20">{p.role}</span>
                      <span className="tabular ml-auto text-[10px] text-white/15">{p.year}</span>
                    </div>
                    <p className="mt-2.5 text-[11px] leading-5 text-white/30">{p.body}</p>
                    <div className="mt-3 flex gap-3">
                      {p.links.map((l) => (
                        <a
                          key={l.href + l.label}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1 text-[10px] font-medium text-white/35 transition-colors hover:text-white/55"
                        >
                          {l.label}
                          <ArrowUpRight className="h-2.5 w-2.5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
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
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-white/[0.05] border border-white/[0.06] px-5 py-2.5 text-[13px] font-medium text-white/60 transition-all duration-150 hover:bg-white/[0.07] hover:text-white/80"
            >
              <Compass className="h-3.5 w-3.5" aria-hidden />
              Back to Weather
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
