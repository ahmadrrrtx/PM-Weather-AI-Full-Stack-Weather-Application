# NovaWeather — Implementation Plan

**Vision:** a cinematic, mission-control-grade 3D weather experience — real-time
WebGL Earth with atmosphere, day/night, stars, sun and moon; floating glass
panels; aurora space environment; zero paid services; deployable on Vercel.

---

## Phase 1 — Architecture & Scaffold

- **Goals:** project skeleton, toolchain, quality gates from day one.
- **Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`,
  `vitest.config.ts`, `app/layout.tsx`, `app/globals.css`, `.github/workflows/ci.yml`,
  `LICENSE`, `.gitignore`.
- **Components:** none yet — design tokens only.
- **Deps:** next@15, react@19, typescript, tailwindcss@4, framer-motion, three,
  @react-three/fiber@9, @react-three/drei, maplibre-gl, echarts, zustand,
  @tanstack/react-query, lucide-react, clsx, tailwind-merge; dev: eslint,
  vitest, jsdom, @vitejs/plugin-react.
- **Risks:** Tailwind v4 CSS-first config differences; R3F v9 + React 19 peer
  deps. Mitigation: pin known-good majors, verify with `next build` in Phase 1.
- **Testing:** `tsc --noEmit`, `next lint`, `next build` green.
- **Outcome:** clean scaffold, CI badge-ready workflow, zero-config dev/build.

## Phase 2 — Design System

- **Goals:** premium cinematic tokens: deep-space palette, aurora gradients,
  glass surfaces, HUD typography, focus/contrast, reduced-motion.
- **Files:** `app/globals.css` (tokens via Tailwind v4 `@theme`, glass utilities,
  aurora keyframes, scrollbar, focus ring), `lib/tokens.ts`.
- **Components:** `components/ui/glass-card.tsx`, `button.tsx`, `badge.tsx`,
  `skeleton.tsx`, `section-label.tsx`, `number-ticker.tsx` (count-up).
- **Risks:** backdrop-blur perf on low-end GPUs → `@supports` fallback.
- **Testing:** visual pass in dev; contrast ≥ 4.5:1 for text.
- **Outcome:** every surface/type/color in the app derives from one token set.

## Phase 3 — Core UI Shell

- **Goals:** navigation, aurora background, search command bar, layout grid,
  footer, About page shell.
- **Files:** `components/layout/header.tsx`, `footer.tsx`, `aurora-background.tsx`,
  `components/search/location-search.tsx` (+ combobox a11y), `app/page.tsx`,
  `app/about/page.tsx`.
- **Risks:** search a11y (combobox pattern, keyboard, aria-live) — the most
  interaction-dense component.
- **Testing:** keyboard-only flow; screen-reader pass (aria roles).
- **Outcome:** user can search any city, see recent searches, switch units,
  navigate with keyboard only.

## Phase 4 — 3D Globe Engine

- **Goals:** the hero — real WebGL Earth: day/night terminator shader,
  atmosphere fresnel, cloud layer, stars, sun sprite, moon, markers, camera
  animation, zoom-to-location, hover tooltips.
- **Files:** `components/globe/earth-globe.tsx` (dynamic, ssr:false),
  `globe/scene.tsx`, `globe/earth-material.ts` (shader), `globe/atmosphere.ts`,
  `globe/clouds.ts`, `globe/celestial.ts` (sun+moon), `globe/markers.tsx`,
  `lib/astronomy.ts` (sun/moon vectors), `public/textures/*`.
- **Risks:** WebGL perf on 2-core machines → dpr clamp, texture budget (≤2048),
  pause on hidden tab, reduced-motion (no auto-rotate).
- **Testing:** manual zoom/pan/hover/click; fps sanity; reduced-motion.
- **Outcome:** cinematic, interactive Earth; selection drives all weather panels.

## Phase 5 — Weather Engine (data layer)

- **Goals:** typed Open-Meteo client (forecast, AQI, astronomy, historical,
  geocoding), WMO code system, unit conversion system, TanStack Query hooks,
  Zustand store.
- **Files:** `lib/types.ts`, `lib/open-meteo.ts`, `lib/weather-codes.ts`,
  `lib/units.ts`, `lib/format.ts`, `lib/geocode.ts`, `lib/store.ts`,
  `lib/hooks/use-weather.ts`, `use-air-quality.ts`, `use-astronomy.ts`,
  `use-climate.ts`, `use-geocode.ts`.
- **Risks:** API shape drift → strict typing + unit tests on mappers.
- **Testing:** Vitest unit tests for every mapper/converter.
- **Outcome:** one `useWeather()` call yields typed, cached, fresh data.

## Phase 6 — Map & Layers

- **Goals:** MapLibre mission map: OpenFreeMap dark vector basemap, RainViewer
  animated radar, NASA GIBS satellite + night-lights, Open-Meteo temperature
  tiles; location marker; layer switcher; attribution.
- **Files:** `components/map/weather-map.tsx` (dynamic import), `lib/map-layers.ts`.
- **Risks:** WMTS tile schema mismatch → verify capability document at build.
- **Testing:** all layers render; attribution visible; no console errors.
- **Outcome:** a NASA-Worldview-grade map panel with 5+ togglable layers.

## Phase 7 — Analytics & Panels

- **Goals:** dashboard panels: current conditions, hourly strip, 48h charts,
  7-day forecast, air quality, astronomy, 30-day climate analytics.
- **Files:** `components/weather/*.tsx` (current, hourly, daily, aqi, astronomy),
  `components/charts/echart.tsx` (wrapper), `temp-chart.tsx`, `precip-chart.tsx`,
  `wind-chart.tsx`, `daily-range-chart.tsx`, `climate-chart.tsx`,
  `components/weather/analytics-panel.tsx`.
- **Risks:** ECharts bundle → tree-shaken core imports only.
- **Testing:** chart SSR-safe (client-only, `role="img"` + aria-label).
- **Outcome:** every panel is a glass card with staggered motion, skeleton
  states, and live data.

## Phase 8 — Motion & Polish

- **Goals:** entrance choreography, panel transitions, count-up numbers,
  icon animations (sun rays, rain, snow, lightning), aurora shimmer, hover
  micro-interactions; `MotionConfig reducedMotion="user"`.
- **Files:** `components/icons/weather-icons.tsx`, global `MotionConfig`,
  staggered panel variants.
- **Risks:** over-animation → every animation is spring-based, short, elegant.
- **Testing:** reduced-motion kills all looping motion; no jank in devtools.
- **Outcome:** the UI feels alive; nothing pops into existence.

## Phase 9 — Optimization

- **Goals:** 95+ Lighthouse class performance: dynamic imports (globe, map,
  charts), texture preload, dpr clamp, code splitting, aria/SEO metadata,
  robots/sitemap/OG, caching headers.
- **Files:** `next.config.ts` (perf), `app/robots.ts`, `app/sitemap.ts`,
  `app/icon.svg`, metadata completion.
- **Testing:** `next build` chunk-size review; Lighthouse (local run);
  bundle-size budget in CI.
- **Outcome:** fast TTI, minimal main-bundle JS, self-hosted everything.

## Phase 10 — Testing & Hardening

- **Goals:** full quality gate: typecheck, lint, unit tests, build, a11y
  review, responsive review (320→1440+), cross-browser (Chrome/Firefox/Safari),
  CI runs all gates.
- **Files:** `tests/*.test.ts`, `tests/setup.ts`, CI workflow.
- **Risks:** flaky network in tests → mocks for all fetchers.
- **Testing:** `npm run test`, `typecheck`, `lint`, `build` all green in CI.
- **Outcome:** every planned feature implemented, every bug fixed, production
  build green. **→ "NovaWeather is production-ready and good to go."**

---

## Acceptance Checklist (maps to project brief)

- [x] Audit of Weather-AI written before code (docs/AUDIT.md)
- [x] Research with comparisons + rationale (docs/RESEARCH.md)
- [ ] Next.js 15 + TS + Tailwind v4 + shadcn-style components
- [ ] Real 3D Earth: atmosphere, day/night, stars, sun, moon, clouds, camera
- [ ] All animations present; nothing appears abruptly
- [ ] Free-only APIs: Open-Meteo, RainViewer, NASA GIBS, OpenFreeMap
- [ ] Map with radar/satellite/temperature layers
- [ ] Analytics (climate pulse), air quality, astronomy
- [ ] Units toggle, search with recent locations, GPS
- [ ] prefers-reduced-motion, keyboard nav, ARIA, high contrast
- [ ] Vitest unit tests + CI (lint/type/test/build)
- [ ] Dynamic imports, tree-shaken ECharts, dpr clamp, preloads
- [ ] About page (Muhammad Ahmad · RRRTX Systems) + footer
- [ ] README, MIT license, Vercel-ready
