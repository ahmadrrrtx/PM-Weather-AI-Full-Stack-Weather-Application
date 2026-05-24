"use client";

import { motion } from "framer-motion";
import { Cloud, Github, Linkedin, Globe } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass sticky top-0 z-50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Cloud className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">
                PM Weather AI
              </h1>
              <p className="text-xs text-sky-400 leading-none mt-0.5">
                Built by Muhammad Ahmad
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Portfolio", href: "https://ahmad-multi-verse.lovable.app", icon: <Globe className="w-3.5 h-3.5" /> },
              { label: "GitHub", href: "https://github.com/ahmadrrrtx", icon: <Github className="w-3.5 h-3.5" /> },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/ahmadrrrtx", icon: <Linkedin className="w-3.5 h-3.5" /> },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </nav>

          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              PM Accelerator Assessment
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
