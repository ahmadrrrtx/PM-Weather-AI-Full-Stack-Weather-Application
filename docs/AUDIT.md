# Internal Audit — Existing Project (`ahmadrrrtx/Weather-AI`)

> Confidential engineering audit performed before any NovaWeather code is written.
> Repository: `https://github.com/ahmadrrrtx/Weather-AI` (branch `main`, 53 commits, ~4,178 LOC)
> Audited: 2026-08-05

---

## 1. Executive Summary

The existing **PM Weather AI** project is a competent Next.js 14 full-stack weather
application built as a technical assessment. It proves solid fundamentals: clean
folder separation, an App Router API layer, free-only APIs, and a polished
glassmorphism dark UI. However it is **not** a next-generation weather experience:

- Its "3D" visual is a CSS-animated emoji orb, not real 3D.
- Maps use raster Leaflet + OSM tiles (no vector, no radar/satellite layers).
- Charts use Recharts (basic, heavier per-feature, weaker dark-theme tooling).
- No astronomy, no air quality, no historical analytics, no unit system.
- No tests, no CI, no lint config, no performance/a11y hardening.
- No About page; the PM Accelerator card is embedded in the home page.

NovaWeather is a full re-imagination, not a refactor. This audit documents what to
keep conceptually, what to throw away, and what to rebuild from first principles.

---

## 2. Architecture Map

```
Weather-AI (Next.js 14.2.29 / React 18.3.1 / TS 5.5.3 / Tailwind 3.4.6)
│
├── app/
│   ├── layout.tsx            — root layout, external Google Fonts <link>, theme-color
│   ├── page.tsx (260 LOC)    — single-page client app, useState state management
│   ├── globals.css           — glass utilities, scrollbar, recharts/leaflet overrides
│   └── api/
│       ├── weather/route.ts  — GET ?location= → geocode + fetch Open-Meteo (server)
│       ├── records/route.ts  — CRUD records (API-shaped, persisted client-side)
│       ├── records/[id]/route.ts
│       └── export/route.ts   — CSV/JSON/Markdown export helpers
│
├── components/ (12 files)
│   ├── Header / SearchPanel / CurrentWeatherCard / ForecastGrid / WeatherCharts
│   ├── WeatherMap (Leaflet) / WeatherVisual3D (CSS orb) / TravelTips
│   ├── SavedRecords / RecordForm / PMAcceleratorCard / LoadingState / ErrorMessage
│
├── lib/ (8 files)
│   ├── weather.ts    — Open-Meteo forecast fetch + WMO code → emoji/label map
│   ├── geocode.ts    — 4-provider chain: Open-Meteo → Nominatim postal → text → coords
│   ├── types.ts      — typed domain models
│   ├── utils.ts      — debounce, cn, labels, format helpers
│   ├── storage.ts    — localStorage CRUD (records)
│   ├── tips.ts       — deterministic "travel tips" rule engine
│   └── export.ts     — JSON/CSV/Markdown/PDF (jsPDF) export
└── package.json — 13 deps: next 14, react 18, framer-motion 11, recharts 2,
    leaflet + react-leaflet, lucide-react, clsx, date-fns, jspdf, jspdf-autotable
```

---

## 3. Per-Area Findings

### 3.1 Data & APIs (STRENGTH)
- Open-Meteo forecast: current + 7-day daily + hourly; `timezone=auto`; no key.
- 4-provider geocoding chain with graceful fallback — well thought out.
- API route sets `Cache-Control: max-age=300, stale-while-revalidate=600` — good.
- `fetch(..., { cache: "no-store" })` on the upstream — correct for proxies.
- **Weakness:** hardcoded metric units (`celsius`, `kmh`, `mm`). No unit toggle.
- **Weakness:** no air quality, no astronomy (moon phase), no historical data,
  no weather map layers (radar/satellite/temperature), no weather alerts.

### 3.2 "3D" Experience (WEAKNESS)
- `WeatherVisual3D.tsx` is a 140px CSS orb: radial-gradient sphere, conic ring,
  6 floating particles, emoji icon. It is *animated*, not *3D*.
- No WebGL, no Earth, no atmosphere, no day/night, no camera, no interactivity.
- For NovaWeather this is replaced entirely by a real WebGL globe
  (Three.js + React Three Fiber).

### 3.3 Maps (WEAKNESS)
- Leaflet 1.9 + raster OSM tiles. Works, but: raster (blurry at zoom), no vector
  styling, no dark theme, no radar/satellite/temperature overlays, CDN marker
  icon hack (`_getIconUrl` deletion), unpkg CSS import in globals.css.
- **NovaWeather:** MapLibre GL (vector, WebGL, dark-styled) + free overlays
  (RainViewer radar, NASA GIBS satellite, Open-Meteo temperature tiles).

### 3.4 Charts (WEAKNESS)
- Recharts with tabbed temperature/precipitation/wind. Fine for simple cases but:
  limited theming, no gradient area fills out of the box, larger bundle per chart.
- **NovaWeather:** Apache ECharts via tree-shaken `echarts/core` — richer
  interactions, native gradients/animations, tiny per-chart imports.

### 3.5 State & Data Flow (WEAKNESS)
- `app/page.tsx` holds 7 `useState`s and prop-drills into 12 components.
- Manual `fetchWeather` + `loading`/`error` flags; no caching, no dedup,
  no retry, no background refetch.
- **NovaWeather:** Zustand (UI/global state) + TanStack Query (server cache:
  dedup, retry, staleTime, background refresh).

### 3.6 UI / UX (MIXED)
- **Strengths:** consistent glassmorphism (`.glass`, `.glass-strong`), good focus
  outlines, custom scrollbar, shimmer skeleton, gradient orbs, framer-motion
  entrances, dark cinematic palette.
- **Weaknesses:** hardcoded `bg-blue-600/8` blobs instead of a design-token
  system; no `prefers-reduced-motion` support; no responsive navigation menu
  logic; no number-count-up animations; no tab semantics; emoji-as-weather-icon
  (platform-dependent rendering, looks casual on some OSes).

### 3.7 Accessibility (WEAKNESS)
- Landmarks exist (`main`, `header`), error message is `role`-less (no
  `aria-live`), charts are non-ARIA (`role="img"` missing), tabs lack
  `tablist`/`tabpanel`, no skip link, no `prefers-reduced-motion`, keyboard nav
  for search list incomplete (no arrow-key selection).

### 3.8 Performance (WEAKNESS)
- No `next/dynamic` usage at all: Leaflet, Recharts, jsPDF all ship in the main
  bundle. No lazy loading. No code splitting beyond default route chunks.
- Google Fonts via `<link>` (render-blocking-ish) instead of `next/font`.
- No `loading="lazy"` imagery, no texture preload, no dpr clamping, no
  `MotionConfig reducedMotion`.
- No bundle-size budget or CI perf gate.

### 3.9 Testing / Quality (WEAKNESS)
- Zero test files. No vitest/jest. `"lint": "next lint"` with no eslint
  dependency pinned. No CI workflow. `target: "es5"` in tsconfig (legacy).

### 3.10 Docs & Branding (MIXED)
- README is extensive (assessment tables, feature accordions) — keep the spirit,
  restructure around the product.
- Branding is assessment-flavored ("PM Weather AI", PM Accelerator card on the
  home page). NovaWeather should be product-branded; the About page becomes a
  dedicated elegant route.

---

## 4. What Carries Over (concepts, not code)

| Concept | Carry-over |
|---|---|
| Free-only data stack (Open-Meteo) | ✅ keep, extend (AQI, historical, astronomy) |
| WMO weather-code mapping | ✅ rebuild with premium custom SVG icon system |
| Geocoding fallback chain | ✅ keep concept, Open-Meteo primary + Nominatim fallback |
| Glassmorphism dark cinematic theme | ✅ formalize into a design-token system |
| Framer Motion entrance choreography | ✅ keep, add reduced-motion + count-up + layoutId |
| localStorage persistence (recent searches) | ✅ keep |
| Error/loading states | ✅ keep concept, rebuild with skeletons + aria-live |
| API `Cache-Control` strategy | ✅ keep |
| Everything else (Leaflet, Recharts, emoji orb, CRUD records, jsPDF, PM card) | ❌ replaced or removed |

---

## 5. Gap Matrix → NovaWeather

| Capability | PM Weather AI | NovaWeather |
|---|---|---|
| Real 3D Earth (WebGL) | ❌ CSS orb | ✅ R3F globe: day/night, atmosphere, clouds, stars, sun, moon, markers |
| Vector dark map + overlays | ❌ Leaflet raster | ✅ MapLibre + radar + satellite + temperature |
| Charts | Recharts (3 tabs) | ✅ ECharts: hourly dual-axis, daily range, 30-day climate |
| Air quality | ❌ | ✅ Open-Meteo AQI + component breakdown |
| Astronomy | ❌ (sunrise/sunset only) | ✅ sun/moon times, moon phase, daylight length |
| Historical analytics | ❌ | ✅ 30-day climate: extremes, averages, precipitation |
| Units | ❌ hardcoded metric | ✅ °C/°F, km/h↔mph↔m/s↔kn, mm↔in |
| State | useState drilling | ✅ Zustand + TanStack Query |
| Tests / CI | ❌ | ✅ Vitest + GitHub Actions (lint, type, test, build) |
| A11y | partial | ✅ skip-link, aria-live, tabs ARIA, combobox, reduced-motion |
| Performance | single bundle | ✅ dynamic imports, tree-shaken ECharts, dpr clamp, preloads |
| About page / Footer | ❌ (embedded card) | ✅ dedicated premium `/about`, crafted footer |
| Branding | PM Weather AI | ✅ NovaWeather — "Next Generation 3D Weather Experience" |

---

## 6. Conclusions

1. **Reuse the foundation ideas** (free APIs, glassmorphism, WMO mapping) but
   **write zero of the existing code** — the scope upgrade is total.
2. The single biggest gap is the absence of a real 3D Earth; it is the core of
   the NovaWeather vision and gets the deepest engineering.
3. Data layer must go client-direct (Open-Meteo supports CORS) to enable
   static hosting, instant response, and Vercel edge caching for free.
4. Quality gates (typecheck, lint, unit tests, production build, CI) must exist
   from Phase 1, not bolted on at the end.

*Audit complete. Proceeding to research (see RESEARCH.md) and planning
(see IMPLEMENTATION_PLAN.md).*
