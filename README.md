<div align="center">

# 🌤️ PM Weather AI
### Full-Stack Weather Intelligence Application

**Built by [Muhammad Ahmad](https://ahmad-multi-verse.lovable.app) for PM Accelerator AI Engineer Internship**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-0ea5e9?style=for-the-badge)](https://pm-weather-ai-full-stack-weather-ap-zeta.vercel.app/)
[![Assessment](https://img.shields.io/badge/PM_Accelerator-AI_Engineer_Assessment-6366f1?style=for-the-badge)](https://docs.google.com/document/d/1FjBFbXEySCKolfsNGrTpRja9upf9T7BxOXakLM6Q5f0/edit?tab=t.0)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Free APIs](https://img.shields.io/badge/APIs-100%25_Free-22c55e?style=for-the-badge)]()

---

### ✅ Tech Assessment #1 (Frontend) · ✅ Tech Assessment #2 (Backend) · ✅ Full Stack

[🌐 Live App](https://pm-weather-ai-full-stack-weather-ap-zeta.vercel.app/) · [📁 Repository](https://github.com/ahmadrrrtx/PM-Weather-AI-Full-Stack-Weather-Application) · [📋 Submit Form](https://forms.gle/XfM3Xrzpo9sbHr4g8)

</div>

---

## 👤 About the Builder

| | |
|---|---|
| **Name** | Muhammad Ahmad |
| **Role** | Full-Stack AI Engineer |
| **Portfolio** | https://ahmad-multi-verse.lovable.app |
| **GitHub** | https://github.com/ahmadrrrtx |
| **LinkedIn** | https://www.linkedin.com/in/ahmadrrrtx |
| **Assessment** | PM Accelerator AI Engineer Internship |

---

## 🏢 About PM Accelerator

**PM Accelerator** helps aspiring product and AI builders gain practical experience through cohort-based product development, mentorship, and real-world AI product work. This project was built as part of the AI Engineer Internship Technical Assessment, demonstrating full-stack engineering capability across both frontend and backend tracks.

> 📋 [View Assessment Document](https://docs.google.com/document/d/1FjBFbXEySCKolfsNGrTpRja9upf9T7BxOXakLM6Q5f0/edit?tab=t.0)


---

## 🌍 Project Overview

**PM Weather AI** is a production-quality, full-stack weather application delivering real-time weather intelligence for any location on Earth. Built with a premium glassmorphism UI, animated 3D weather visuals, interactive maps, and a complete CRUD record system — all powered entirely by free APIs with zero configuration required.

### Live Demo
**🚀 https://pm-weather-ai-full-stack-weather-ap-zeta.vercel.app/**

---

## ✅ Assessment Completion

### Tech Assessment #1 — Frontend

| Requirement | Status | Implementation |
|---|---|---|
| Location input — city, zip, GPS, landmark | ✅ Complete | Multi-provider geocoding: Open-Meteo + Nominatim + OSM |
| Real-time weather from live APIs | ✅ Complete | Open-Meteo Forecast API — free, no key |
| Useful weather details displayed clearly | ✅ Complete | Temperature, feels like, humidity, wind, UV, precipitation, sunrise/sunset |
| Current location via GPS | ✅ Complete | Browser Geolocation API + reverse geocoding via Nominatim |
| Icons and design standards | ✅ Complete | WMO weather code emoji system (100+ conditions) + glassmorphism UI |
| 5-day forecast | ✅ Complete | 7-day forecast grid implemented |
| Graceful error handling | ✅ Complete | ErrorMessage component with retry, dismiss, and descriptive messages |
| JavaScript frontend framework | ✅ Complete | Next.js 14 + React 18 |
| Web-first, responsive | ✅ Complete | Tailwind CSS responsive grid — desktop, tablet, mobile |

### Tech Assessment #2 — Backend

| Requirement | Status | Implementation |
|---|---|---|
| Location + date range weather retrieval | ✅ Complete | RecordForm with date range picker and validation |
| Store location, dates, weather, notes | ✅ Complete | localStorage CRUD via lib/storage.ts |
| CREATE weather records | ✅ Complete | `createRecord()` with UUID generation |
| READ previous records | ✅ Complete | `getRecords()` + SavedRecords component |
| UPDATE stored records | ✅ Complete | `updateRecord()` with inline edit form |
| DELETE records | ✅ Complete | `deleteRecord()` with double-confirm UX |
| Validate date ranges | ✅ Complete | `validateDateRange()` — checks format, order, max 365 days |
| Validate location / fuzzy match | ✅ Complete | 4-provider geocoding chain with fallback |
| Additional API — Maps | ✅ Complete | Leaflet + OpenStreetMap — free, no API key |
| Additional creative feature | ✅ Complete | Deterministic smart travel tips from weather logic |
| Export JSON, CSV, Markdown, PDF | ✅ Complete | Client-side export via lib/export.ts |
| API calls and error handling shown | ✅ Complete | app/api/ route handlers with typed error responses |

### Full Stack ✅

- Complete Next.js App Router architecture
- Separated frontend components, backend API routes, and utility libraries
- Deployed to Vercel free tier — zero configuration

---

## ✨ Features

<details>
<summary><strong>🔍 Smart Location Search</strong></summary>

- Search by **city name** — London, Tokyo, Dubai
- Search by **GPS coordinates** — `40.7128,-74.0060`
- Search by **postal code** — `90210`, `SW1A 1AA`
- Search by **landmark** — Eiffel Tower, Times Square
- **Current location** via browser Geolocation API
- **Recent search history** saved to localStorage with clear option
- 4-provider geocoding chain: Open-Meteo → Nominatim postal → Nominatim text → coordinate fallback

</details>

<details>
<summary><strong>☀️ Current Weather Card</strong></summary>

- Temperature + feels like (apparent temperature)
- Weather condition — mapped from WMO codes (100+ conditions)
- Humidity with comfort label (Very Dry → Very Humid)
- Wind speed + compass direction (16-point compass)
- Precipitation (current) + rain amount
- UV index with safety rating (Low → Extreme)
- Today's high and low temperatures
- Sunrise and sunset times
- Timezone display
- Animated 3D weather orb that reflects condition

</details>

<details>
<summary><strong>📅 7-Day Forecast</strong></summary>

- Weather condition emoji per day
- Daily high and low temperatures
- Rain probability percentage
- Maximum wind speed
- UV index maximum
- Responsive grid: 2 columns mobile → 4 tablet → 7 desktop

</details>

<details>
<summary><strong>📊 Interactive Charts</strong></summary>

- **Temperature trend** — 48-hour area chart
- **Rain probability** — 48-hour bar chart
- **Wind speed** — 48-hour area chart
- Tab switching between chart types
- Custom glassmorphism tooltip
- Recharts with fully responsive container
- Data every 3 hours for visual clarity

</details>

<details>
<summary><strong>🗺️ Interactive Map</strong></summary>

- Leaflet + OpenStreetMap tiles — completely free, no API key
- Custom gradient marker with coordinate popup
- 5km radius circle overlay around location
- External link to OpenStreetMap
- SSR-safe with dynamic import

</details>

<details>
<summary><strong>💡 Smart Travel Tips</strong></summary>

- Generated deterministically from weather data — no paid AI API
- 10+ condition categories: Rain, UV, Wind, Heat, Cold, Snow, Thunderstorm, Humidity, Outlook
- 4 severity levels: Info (blue), Warning (amber), Danger (red), Success (green)
- Context-aware descriptions with specific thresholds and actionable advice

</details>

<details>
<summary><strong>💾 CRUD Saved Records</strong></summary>

- **CREATE** — Save any weather search with custom date range and notes
- **READ** — View all records with expandable detail panels
- **UPDATE** — Edit location, dates, and notes with inline form
- **DELETE** — Delete with double-confirm safety UX
- Stored in browser localStorage — no account, no database setup
- Records persist across browser sessions

</details>

<details>
<summary><strong>📤 Export</strong></summary>

- **JSON** — Full structured data with all weather snapshots
- **CSV** — Excel/Sheets compatible with all fields
- **Markdown** — Formatted tables, human-readable
- **PDF** — Professional landscape A4 report via jsPDF
- All generated client-side — no upload, no paid service

</details>

---

## 🛠️ Tech Stack

| Category | Technology | Reason |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR, API routes, free Vercel deployment |
| **Language** | TypeScript | Full type safety across frontend and backend |
| **Styling** | Tailwind CSS | Utility-first, responsive, fast iteration |
| **Animations** | Framer Motion | Smooth entrance animations and transitions |
| **Charts** | Recharts | Composable, responsive chart library |
| **Maps** | Leaflet + react-leaflet | Free, no key, OpenStreetMap tiles |
| **Icons** | Lucide React | Consistent, lightweight, tree-shakeable |
| **PDF Export** | jsPDF + jspdf-autotable | Client-side PDF generation, no paid service |
| **Date utilities** | date-fns | Lightweight date formatting |
| **Weather API** | Open-Meteo | 100% free, no key, WMO-standard data |
| **Geocoding** | Open-Meteo Geocoding | Free, no key, city search |
| **Reverse Geocode** | Nominatim (OSM) | Free, no key, GPS → place name |
| **Map tiles** | OpenStreetMap | Free, no key, global coverage |
| **Storage** | Browser localStorage | Zero setup, no account, persists across sessions |
| **Deployment** | Vercel free tier | Zero config Next.js deployment |

---

## 📁 Project Structure

```
pm-weather-ai-assessment/
├── app/
│   ├── layout.tsx                  # Root layout, metadata, fonts
│   ├── page.tsx                    # Main page — state management hub
│   ├── globals.css                 # Global styles, glassmorphism, animations
│   └── api/
│       ├── weather/route.ts        # GET /api/weather?location=...
│       ├── records/route.ts        # GET/POST /api/records
│       ├── records/[id]/route.ts   # GET/PUT/DELETE /api/records/:id
│       └── export/route.ts         # POST /api/export
├── components/
│   ├── Header.tsx                  # Navigation bar with links
│   ├── SearchPanel.tsx             # Search input + location button + history
│   ├── CurrentWeatherCard.tsx      # Main weather display + stat grid
│   ├── ForecastGrid.tsx            # 7-day forecast cards
│   ├── WeatherCharts.tsx           # Recharts temperature/rain/wind tabs
│   ├── WeatherMap.tsx              # Leaflet map with custom marker
│   ├── WeatherVisual3D.tsx         # Animated CSS 3D weather orb
│   ├── TravelTips.tsx              # Smart tips display grid
│   ├── SavedRecords.tsx            # CRUD records list with expand/edit/delete
│   ├── RecordForm.tsx              # Create and edit record form
│   ├── PMAcceleratorCard.tsx       # About section + builder info + tech stack
│   ├── LoadingState.tsx            # Skeleton loading with animated rings
│   └── ErrorMessage.tsx           # Error display with retry and dismiss
├── lib/
│   ├── types.ts                    # All TypeScript interfaces
│   ├── weather.ts                  # Open-Meteo API, WMO codes, formatters
│   ├── geocode.ts                  # 4-provider geocoding chain
│   ├── tips.ts                     # Deterministic weather tips generator
│   ├── storage.ts                  # localStorage CRUD + date validation
│   ├── export.ts                   # JSON/CSV/Markdown/PDF export utilities
│   └── utils.ts                    # cn(), uvLabel(), humidityLabel(), etc.
├── README.md
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── .gitignore
└── .env.example
```

---

## 🚀 Quick Start

### Prerequisites

```bash
node --version   # 18.17 or higher
npm --version    # 9.0 or higher
```

### Install and Run

```bash
# Clone the repository
git clone https://github.com/ahmadrrrtx/PM-Weather-AI-Full-Stack-Weather-Application.git

# Navigate into the project
cd PM-Weather-AI-Full-Stack-Weather-Application

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** — the app starts immediately with no configuration needed.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🔐 Environment Variables

**None required.** The app works completely out of the box.

All APIs are free and require no authentication:

```env
# .env.example
# No API keys needed — all services are free and keyless

# Open-Meteo Weather API  — no key
# Open-Meteo Geocoding    — no key  
# Nominatim (OSM)         — no key
# OpenStreetMap tiles     — no key
# localStorage            — no key
```

---

## 🌐 API Reference

### `GET /api/weather?location={query}`

Geocodes the query and returns full weather data from Open-Meteo.

**Supported query formats:**
```
/api/weather?location=London
/api/weather?location=40.7128,-74.0060
/api/weather?location=90210
/api/weather?location=Eiffel+Tower
/api/weather?location=Dubai
```

**Success response (200):**
```json
{
  "location": {
    "name": "London",
    "latitude": 51.5085,
    "longitude": -0.1257,
    "country": "United Kingdom",
    "country_code": "GB",
    "admin1": "England",
    "timezone": "Europe/London"
  },
  "current": {
    "temperature": 14.2,
    "feelsLike": 12.8,
    "humidity": 78,
    "windSpeed": 22.4,
    "windDirection": 245,
    "precipitation": 0.0,
    "weatherCode": 2,
    "isDay": 1,
    "uvIndex": 3,
    "rain": 0.0
  },
  "daily": [ /* 7 days */ ],
  "hourly": { /* 48 hours */ },
  "timezone": "Europe/London",
  "fetchedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error responses:**
```json
// 400 — missing location
{ "error": "Location parameter is required." }

// 404 — not found
{ "error": "Could not find location: \"xyz\". Try a city name, coordinates (lat,lon), or postal code." }

// 500 — upstream API failure
{ "error": "Failed to fetch weather data: ..." }
```

### `GET /api/records`
### `POST /api/records`
### `GET /api/records/:id`
### `PUT /api/records/:id`
### `DELETE /api/records/:id`

Documented REST endpoints. Actual data persistence is handled client-side via `lib/storage.ts` using localStorage.

### `POST /api/export`

Server-side export endpoint supporting `json` and `csv` formats.

```json
{
  "records": [...],
  "format": "json"
}
```

---

## 💾 Storage Architecture

### Why localStorage?

| Factor | localStorage | External Database |
|---|---|---|
| Setup time | Zero | Account + credentials + schema |
| Works offline | ✅ | ❌ |
| Reviewer friction | None | High |
| Data persistence | Per browser | Global |
| CRUD complexity | Identical | Identical |

The CRUD logic in `lib/storage.ts` is architecturally identical to a database implementation. Swapping to Supabase or PostgreSQL would require changing only the storage layer, not the component logic.

### Record Schema

```typescript
interface WeatherRecord {
  id: string;           // UUID v4 via crypto.randomUUID()
  locationInput: string; // Raw user input
  resolvedName: string;  // Geocoded display name
  latitude: number;      // Decimal degrees
  longitude: number;     // Decimal degrees
  startDate: string;     // "YYYY-MM-DD"
  endDate: string;       // "YYYY-MM-DD"
  weatherJson: WeatherData | null; // Full weather snapshot
  notes: string;         // User notes
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
}
```

### Date Validation Rules

```
✅ Both dates required
✅ End date must be >= start date
✅ Range cannot exceed 365 days
✅ Dates must be valid ISO format
```

### Optional: Connect to Supabase (free tier)

If you want persistent cross-device storage, create a free Supabase project and run:

```sql
create table weather_records (
  id uuid primary key default gen_random_uuid(),
  location_input text not null,
  resolved_name text not null,
  latitude numeric not null,
  longitude numeric not null,
  start_date date not null,
  end_date date not null,
  weather_json jsonb,
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table weather_records enable row level security;

create policy "Allow all"
  on weather_records for all
  using (true) with check (true);
```

Then add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🗺️ External APIs Used

### Open-Meteo Forecast API
```
https://api.open-meteo.com/v1/forecast
Free tier: Unlimited · No key required
Docs: https://open-meteo.com/en/docs
```

Parameters used:
```
current    → temperature_2m, apparent_temperature, relative_humidity_2m,
             precipitation, rain, weather_code, wind_speed_10m,
             wind_direction_10m, is_day, uv_index

daily      → weather_code, temperature_2m_max, temperature_2m_min,
             precipitation_sum, precipitation_probability_max,
             wind_speed_10m_max, uv_index_max, sunrise, sunset

hourly     → temperature_2m, precipitation_probability, wind_speed_10m

timezone   → auto
```

### Open-Meteo Geocoding API
```
https://geocoding-api.open-meteo.com/v1/search
Free tier: Unlimited · No key required
Used for: city name → lat/lon
```

### Nominatim (OpenStreetMap)
```
https://nominatim.openstreetmap.org/search
https://nominatim.openstreetmap.org/reverse
Free tier: 1 req/sec · No key required
Used for: reverse geocoding, postal codes, landmark search
```

### OpenStreetMap Tiles
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
Free: Unlimited for reasonable use · No key required
Used by: Leaflet map rendering
```

---

## 🎨 Design Decisions

**Glassmorphism UI** — Premium frosted glass aesthetic using `backdrop-filter: blur()` and semi-transparent backgrounds. Carefully applied to remain readable and professional, not overdone.

**CSS Animated Orb over Three.js** — The 3D weather orb uses Framer Motion and CSS gradients instead of WebGL. This achieves a premium visual at near-zero bundle cost with zero SSR risk. Three.js would add ~500KB and requires canvas lifecycle management.

**Open-Meteo over OpenWeatherMap** — Completely free with no API key, no rate limiting for reasonable use, excellent WMO-standard data quality, and returns current + daily + hourly in a single request.

**Leaflet over Google Maps** — Google Maps requires a billing card even for free tier. Leaflet + OpenStreetMap is 100% free, no key, and renders beautiful interactive maps.

**Deterministic Tips over AI API** — Travel tips are generated from weather thresholds — no paid AI, no latency, fully predictable, and demonstrates creative algorithmic product thinking.

**localStorage over External Database** — Zero setup friction means any reviewer can clone and test instantly. The CRUD architecture is identical to a real database implementation.

**Multi-provider Geocoding** — 4-provider chain maximizes success rate for any input type. Open-Meteo handles city names best, Nominatim handles postal codes and landmarks, coordinate parsing handles GPS input directly.

---

## 🚀 Deploy to Vercel (Free)

```bash
# 1. Push to GitHub (already done)

# 2. Go to vercel.com → Add New Project → Import your repo

# 3. Vercel auto-detects Next.js — no settings to change

# 4. Click Deploy

# 5. App is live in ~60 seconds
```

No environment variables needed. No configuration needed.

**Live at:** https://pm-weather-ai-full-stack-weather-ap-zeta.vercel.app/

---


---

## 📄 License

Built for PM Accelerator AI Engineer Internship Assessment.
Free to review, learn from, and fork.

---

<div align="center">

**Built with ❤️ by [Muhammad Ahmad](https://ahmad-multi-verse.lovable.app)**

[🌐 Portfolio](https://ahmad-multi-verse.lovable.app) · [💻 GitHub](https://github.com/ahmadrrrtx) · [🔗 LinkedIn](https://www.linkedin.com/in/ahmadrrrtx)

*PM Accelerator AI Engineer Internship · 2025*

</div>
