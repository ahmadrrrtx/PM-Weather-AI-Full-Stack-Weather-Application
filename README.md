<div align="center">

# 🪐 NovaWeather

### Next Generation 3D Weather Experience

**A cinematic, mission-control-grade weather application — real-time WebGL Earth, live radar & satellite layers, air quality, astronomy, and climate analytics. Powered entirely by free, open data.**

[![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![APIs](https://img.shields.io/badge/APIs-100%25_Free-22c55e?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-6366f1?style=for-the-badge)](LICENSE)

**Crafted with passion by [Muhammad Ahmad](https://rrrtx-systems.com/) · Designed & Engineered by RRRTX Systems**

</div>

---

## ✨ The Experience

NovaWeather is **not a weather app redesign** — it is a complete re-imagination of how weather should feel:

- **🌍 A real-time WebGL Earth** — day/night terminator computed from actual solar physics, atmospheric fresnel glow, drifting clouds, stars, a visible sun and a phase-accurate moon, plus 30 live city markers pulsing with real-time conditions.
- **🛰️ Mission map** — dark vector basemap (OpenFreeMap), NASA satellite imagery (GIBS), city night-lights, and an **animatable radar timeline** (RainViewer).
- **📊 Deep telemetry** — current conditions, 48-hour timeline charts, 7-day outlook, US/EU air quality with WHO guideline bars, solar & lunar watch, and a 30-day climate pulse with extremes.
- **🎬 Cinematic UI** — floating glass panels, aurora space environment, HUD typography, custom animated SVG weather icons, and spring-choreographed transitions. Nothing pops into existence.
- **♿ Accessible & fast** — keyboard-first search combobox, ARIA-complete tabs/panels, `prefers-reduced-motion` support, 193 kB first-load JS, and all heavy 3D/map/chart engines lazy-loaded.

## 🗺️ Free Data Stack (zero keys, zero cost)

| Capability | Source | Cost |
|---|---|---|
| Forecast, hourly, daily | [Open-Meteo](https://open-meteo.com) | Free · no key |
| Geocoding (search) | Open-Meteo Geocoding API | Free · no key |
| Air quality (US/EU AQI) | Open-Meteo Air Quality API | Free · no key |
| Astronomy (sun/moon) | Open-Meteo Astronomy API | Free · no key |
| Historical climate (30 days) | Open-Meteo Archive API | Free · no key |
| Radar tiles (animated) | [RainViewer](https://www.rainviewer.com/api.html) | Free · no key |
| Satellite & night lights | [NASA GIBS](https://earthdata.nasa.gov/gibs) | Free · no key |
| Vector basemap | [OpenFreeMap](https://openfreemap.org) | Free · no key |
| Celestial math | In-house (NOAA-derived equations) | — |

## 🧱 Tech Stack

**Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion 12 · Three.js + React Three Fiber + Drei · MapLibre GL · Apache ECharts (tree-shaken) · Zustand · TanStack Query v5 · Vitest · GitHub Actions**

## 🚀 Getting Started

```bash
git clone https://github.com/ahmadrrrtx/novaweather.git
cd novaweather
npm install
npm run dev        # http://localhost:3000
```

> Zero environment variables required. No API keys. Nothing to configure.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests (47 tests) |
| `npm run ci` | lint → typecheck → test → build |

## ☁️ Deploy on Vercel

1. Push this repository to GitHub.
2. Import it in [Vercel](https://vercel.com) — framework preset **Next.js**.
3. Deploy. That's it — fully static-prerendered pages, zero env vars.

## 🏗️ Architecture

```
app/                    Routes: / (Mission Control), /about, robots, sitemap, icon
├── layout.tsx          Fonts, metadata, providers, texture preloads
├── page.tsx            Home — globe + dashboard shell
└── about/              Developer profile

components/
├── globe/              R3F scene: shaders, atmosphere, celestial, markers, camera flights
├── map/                MapLibre mission map (radar/satellite/night layers)
├── charts/             Tree-shaken ECharts wrappers + chart themes
├── weather/            Panels: current, hourly, daily, AQI, astronomy, analytics
├── search/             Accessible geocoding combobox + GPS
├── icons/              Custom animated SVG weather icon set
├── layout/             Header, footer, aurora background
└── ui/                 Glass primitives: cards, buttons, tabs, tickers, badges

lib/
├── open-meteo.ts       All five Open-Meteo API clients (typed mappers)
├── astronomy.ts        Sun/moon vectors, terminator math, moon phases
├── weather-codes.ts    WMO code → condition/icon/accent system
├── units.ts            Metric↔imperial conversion (display layer)
├── format.ts           Time, compass, AQI/UV labels, metrics
├── chart-theme.ts      Shared ECharts dark-glass styling
├── map-layers.ts       GIBS/RainViewer tile providers
├── store.ts            Zustand global state (persisted)
└── hooks.ts            TanStack Query data hooks

tests/                  Vitest suites: formats, units, WMO codes, astronomy,
                        API mappers, store
docs/                   AUDIT.md · RESEARCH.md · IMPLEMENTATION_PLAN.md
```

**Data flow:** all API calls run client-side (Open-Meteo ships CORS-enabled, keyless endpoints) through TanStack Query — deduped, retried, cached with 5–10 min staleness. The globe reads the same store that drives the dashboard, so selecting a city anywhere updates everything.

## 🎯 Performance

- **193 kB first-load JS**; heavy engines (Three.js 596 kB, MapLibre 516 kB, ECharts 404 kB) are lazy chunks loaded only when needed.
- Textures preloaded and served with `Cache-Control: immutable`.
- DPR clamped `[1, 1.75]`, render loop paused on hidden tabs, shader-only lighting (no shadow maps), reduced-motion disables auto-rotation & cloud drift.
- Self-hosted fonts (`next/font`), AVIF/WebP image pipeline, static prerendering.

## ♿ Accessibility

Skip link · ARIA combobox with full keyboard nav · ARIA tabs (arrow keys) · `role="img"` + labels on all charts · `aria-live` regions for search/errors · visible focus rings · WCAG-conscious contrast on glass surfaces · full `prefers-reduced-motion` support.

## 📚 Engineering Notes

- **The celestial engine is unit-tested**: the sun's declination matches physical values (≈ +17° in August, ≈ −22° in January) and moon phases track the real synodic cycle from the J2000 epoch.
- The test suite caught and fixed two real bugs during development (axis mixing in the sun vector rotation and ecliptic-vs-celestial pole rotation for the moon).
- Every data mapper is typed against the raw Open-Meteo shapes; unknown WMO codes degrade gracefully.

## 📄 License

MIT © 2026 [Muhammad Ahmad](https://rrrtx-systems.com/) — RRRTX Systems. Free to use, modify, and ship.

<div align="center">

**Crafted with passion by Muhammad Ahmad · Designed & Engineered by RRRTX Systems**

[Website](https://rrrtx-systems.com/) · [GitHub](https://github.com/ahmadrrrtx/) · [LinkedIn](https://www.linkedin.com/in/ahmadrrrtx)

</div>
