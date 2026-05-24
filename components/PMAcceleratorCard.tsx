"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  Star,
  Code2,
  Layers,
} from "lucide-react";

export default function PMAcceleratorCard() {
  const techStack = [
    "Next.js 14",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Recharts",
    "Leaflet",
    "Open-Meteo API",
    "localStorage CRUD",
  ];

  const features = [
    "Real-time weather & 5-day forecast",
    "GPS current location support",
    "Interactive OpenStreetMap",
    "48-hour charts (temp/rain/wind)",
    "Smart AI weather tips",
    "Full CRUD saved records",
    "Export: JSON, CSV, MD, PDF",
    "100% free APIs, no paid keys",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      aria-label="About PM Accelerator"
    >
      {/* PM Accelerator Info */}
      <div className="glass rounded-2xl p-6 border border-sky-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">PM Accelerator</h3>
            <p className="text-xs text-sky-400">AI Engineer Internship Assessment</p>
          </div>
        </div>

        <p className="text-sm text-white/70 leading-relaxed mb-4">
          <span className="text-white font-semibold">PM Accelerator</span>{" "}
          helps aspiring product and AI builders gain practical experience
          through cohort-based product development, mentorship, and real-world
          AI product work. This assessment demonstrates full-stack engineering
          capability across frontend and backend tracks.
        </p>

        <div className="space-y-2 mb-4">
          {[
            "✅ Tech Assessment #1 (Frontend) — Complete",
            "✅ Tech Assessment #2 (Backend) — Complete",
            "✅ Full Stack Candidate",
          ].map((item) => (
            <p key={item} className="text-xs text-white/60">
              {item}
            </p>
          ))}
        </div>

        <a
          href="https://forms.gle/XfM3Xrzpo9sbHr4g8"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Submit Assessment Form
        </a>
      </div>

      {/* Builder Info */}
      <div className="glass rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Muhammad Ahmad</h3>
            <p className="text-xs text-purple-400">
              Full-Stack AI Engineer
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            {
              icon: <Globe className="w-3.5 h-3.5" />,
              label: "Portfolio",
              href: "https://ahmad-multi-verse.lovable.app",
              color: "hover:border-sky-400/40 hover:text-sky-300",
            },
            {
              icon: <Github className="w-3.5 h-3.5" />,
              label: "GitHub",
              href: "https://github.com/ahmadrrrtx",
              color: "hover:border-gray-400/40 hover:text-gray-300",
            },
            {
              icon: <Linkedin className="w-3.5 h-3.5" />,
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/ahmadrrrtx",
              color: "hover:border-blue-400/40 hover:text-blue-300",
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/15 text-white/60 text-xs font-medium transition-all ${link.color}`}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <p className="text-xs font-semibold text-white/80">
              Key Features
            </p>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {features.map((f) => (
              <p key={f} className="text-xs text-white/50">
                · {f}
              </p>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <p className="text-xs font-semibold text-white/80">Tech Stack</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 border border-purple-500/25 text-purple-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
