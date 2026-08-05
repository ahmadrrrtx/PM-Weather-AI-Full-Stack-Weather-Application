# Research — Free Resource Selection for NovaWeather

> Every dependency and data source chosen below is **free, open-source or
> open-access, no API key, no credit card**. Paid alternatives were compared and
> rejected wherever a free option is excellent. Last updated: 2026-08-05.

---

## 1. Weather Data — **Open-Meteo** ✅ chosen

| Provider | Key | Free tier | History | Extras |
|---|---|---|---|---|
| **Open-Meteo** | none | ~10,000 calls/day, 600/min [1](https://www.apibenchmarks.com/weather/open-meteo) | 1940→now | Forecast, AQI, Marine, Geocoding, Astronomy, Flood, Elevation [2](https://web-data-labs.com/blog/open-meteo-scraper) |
| OpenWeatherMap | required | 1,000/day | paid only | — |
| WeatherAPI | required | 1M/mo | paid only | — |
| Tomorrow.io / AccuWeather | required | tiny | paid | — |

**Why:** the only major free source with no key, deep history, and first-class
CORS support (client-direct calls from the browser — enables fully static,
edge-cached hosting). Covers 5 needs in one provider: forecast, air quality,
geocoding, astronomy, historical.

## 2. Radar Layer — **RainViewer Public API** ✅ chosen

- Free public endpoint `https://api.rainviewer.com/public/weather-maps.json`,
  no key, no registration [3](https://www.rainviewer.com/api.html).
- Radar tiles from 1200+ radars / 150+ countries, refreshed every 5 min,
  past 2 hours + nowcast frames, animatable timeline [3](https://www.rainviewer.com/api.html).
- Attribution required ("Weather data by RainViewer") — acceptable.
- **Alternative rejected:** national services (NWS only covers the US);
  commercial radar SDKs (paid). Open-Meteo also ships precipitation tiles
  (see §8) — used as a secondary global layer.

## 3. Satellite Layer — **NASA GIBS (WMTS)** ✅ chosen

- Free, no registration, open data policy, explicitly supports embedding
  [2](https://www.globalsecurity.org/military/nasa-gibs.html).
- 1,000+ products; Web Mercator endpoint works directly with MapLibre:
  `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml`
  [3](https://nasa-gibs.github.io/gibs-api-docs/map-library-usage/).
- Used: MODIS Terra Corrected Reflectance (true-color satellite basemap) +
  VIIRS Day/Night Band (city lights at night).
- **Alternatives rejected:** Sentinel/EUMETSAT (registration + approval),
  MapTiler satellite (paid).

## 4. Map Engine + Basemap — **MapLibre GL JS + OpenFreeMap** ✅ chosen

| Provider | Key | Vector | Cost |
|---|---|---|---|
| **OpenFreeMap** | none | ✅ | unlimited, no limits, MIT [2](https://github.com/althetinkerer/openfreemap-api) |
| MapTiler | required | ✅ | paid |
| Stadia/Stamen | required | ✅ | paid |
| CARTO | required | ✅ | paid tier |
| OSM raster tiles | none | ❌ | free but raster, less polished |

- MapLibre GL is the free open-source vector renderer (BSD-3) used by
  OpenFreeMap's own docs [3](https://medium.com/@vsvipul10/how-to-use-free-maps-for-any-app-replacing-google-maps-apis-b26f70ca5724).
- **Why not Leaflet** (used in the audited app): raster-only, no WebGL styling,
  no native GL overlays for radar/satellite.

## 5. Geocoding — **Open-Meteo Geocoding API** ✅ chosen (Nominatim fallback)

- Open-Meteo geocoding: free, no key, no strict rate limit, returns name /
  country / admin1 / timezone / population — perfect for autocomplete.
- Nominatim (OSM): excellent but policy-limited to ~1 req/s; used only as a
  final fallback for exotic queries, exactly like the audited app's chain.

## 6. 3D Globe — **Three.js + React Three Fiber + drei** ✅ chosen

| Option | Verdict |
|---|---|
| **three + @react-three/fiber + @react-three/drei** | chosen — declarative React API over WebGL, huge ecosystem, tree-shakable, free (MIT) |
| react-globe.gl | rejected — abstraction too high, custom shaders harder, less control over cinematic look |
| CesiumJS | rejected — heavyweight, tile streaming needs a server/CDN, overkill for a hero globe |

- Custom GLSL shaders for atmosphere fresnel glow, day/night terminator
  (day texture + night-lights texture blended by sun direction), cloud layer.
- Free NASA Blue Marble / three.js example textures (MIT / public domain) —
  bundled locally, no CDN at runtime.

## 7. Charts — **Apache ECharts** ✅ chosen

| Option | Verdict |
|---|---|
| **ECharts (tree-shaken `echarts/core`)** | chosen — Apache-2.0, rich interactions, gradient fills, dual-axis, tiny per-module imports, designed-for-data-viz |
| Recharts | rejected — what the audited app uses; limited theming/gradients |
| Chart.js | rejected — weaker canvas perf for dense series, more manual work |

## 8. Extra Map Layers — **Open-Meteo Weather Map Tiles** ✅ chosen

- Open-Meteo ships free global weather tile layers (temperature, precipitation,
  wind) via `tile.open-meteo.com` — no key; verified at implementation time and
  used for the temperature/precipitation overlays on the map.

## 9. State & Data Fetching — **Zustand + TanStack Query** ✅ chosen

- **Zustand** (MIT): minimal, selector-based, no provider tree — right-sized for
  UI/global state (units, location, tab).
- **TanStack Query v5** (MIT): dedupe, retry, staleTime, background refetch,
  offline-ish resilience — beats SWR here because of the multi-endpoint fan-out
  (forecast + AQI + astronomy + historical) and dev-tools ecosystem.

## 10. Motion — **Framer Motion (v12)** ✅ chosen

- Free (MIT-ish, `motion`), declarative springs, `AnimatePresence`,
  `MotionConfig reducedMotion="user"` — the gold standard for cinematic React
  transitions. Every entrance/exit is choreographed; nothing "just appears".

## 11. Icons — **Custom animated SVG set + lucide-react** ✅ chosen

- Weather icons: hand-built animated SVG set (sun rays rotating, rain streaks
  falling, snow drifting, cloud drift, fog pulses, lightning flicker) — unique,
  brand-consistent, tiny, `prefers-reduced-motion` aware. Beats emoji (platform
  differences) and stock icon packs (generic look).
- UI icons: lucide-react (MIT, tree-shakable) for chrome (search, settings,
  navigation).

## 12. Typography — **next/font (Space Grotesk + Inter)** ✅ chosen

- Self-hosted via `next/font` (no layout shift, no external request).
- Space Grotesk = technical/cinematic display; Inter = body; `tabular-nums`
  for all numeric readouts.

## 13. Astronomy & Celestial Math — **Open-Meteo Astronomy API + custom math** ✅ chosen

- Sunrise/sunset, daylight duration, moon phases/illumination from Open-Meteo
  (free, no key).
- Sun direction vector + moon elongation for the 3D globe computed in-house
  (~60 lines, MIT-referenced NOAA solar equations) — avoids a runtime dep,
  gives exact control over the globe's lighting.

## 14. Visual Inspiration (free to study)

- Apple weather / visionOS glass materials; NASA Worldview & EYES; Google
  Earth cinematic mode; Arc Browser command bar; Nothing OS monochrome HUD
  typography; Linear-style micro-interactions. All studied as *aesthetic
  references* only — NovaWeather is an original implementation.

---

## Final Stack

**Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
shadcn-style component patterns (hand-rolled, zero-Radix where possible) ·
Framer Motion 12 · Three.js + R3F + drei · MapLibre GL · Open-Meteo (forecast,
AQI, geocoding, astronomy, historical, tiles) · RainViewer radar · NASA GIBS
satellite · Apache ECharts (tree-shaken) · Zustand · TanStack Query v5 ·
Vitest · GitHub Actions CI.** — 100% free. Deployable on Vercel free tier.
