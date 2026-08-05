/* ─────────────────────────────────────────────
   Free map layers for the mission map:
   · Basemap: OpenFreeMap "dark" vector style
   · Satellite: NASA GIBS MODIS true-color (WMTS)
   · Night lights: NASA GIBS VIIRS ENCC (WMTS)
   · Radar: RainViewer public tiles (animated)
   All keyless. Attribution is mandatory and
   shown in the map controls.
   ───────────────────────────────────────────── */

export const BASEMAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

export const GIBS_TILE_TEMPLATE =
  "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.{format}";

export const GIBS_LAYERS = {
  satellite: {
    layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    tileMatrixSet: "GoogleMapsCompatible_Level9",
    format: "jpg",
    attribution: "NASA GIBS (MODIS)",
  },
  nightLights: {
    layer: "VIIRS_SNPP_DayNightBand_ENCC",
    tileMatrixSet: "GoogleMapsCompatible_Level8",
    format: "png",
    attribution: "NASA GIBS (VIIRS)",
  },
} as const;

export type GibsLayerKey = keyof typeof GIBS_LAYERS;

/** Fetch the latest available time for a GIBS layer from the capabilities doc. */
export async function fetchGibsTime(
  layerKey: GibsLayerKey,
  signal?: AbortSignal,
): Promise<string> {
  const def = GIBS_LAYERS[layerKey];
  const res = await fetch(
    "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml",
    { signal },
  );
  if (!res.ok) throw new Error("GIBS capabilities unavailable");
  const xml = await res.text();
  const escaped = def.layer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const layerBlock = xml.match(
    new RegExp(
      `<Layer[^>]*>[\\s\\S]*?<ows:Identifier>${escaped}<\\/ows:Identifier>[\\s\\S]*?<Dimension[^>]*>[\\s\\S]*?<Default>([^<]+)<\\/Default>`,
    ),
  );
  return layerBlock?.[1] ?? "2023-07-07";
}

export function gibsTileUrl(
  layerKey: GibsLayerKey,
  time: string,
  z: number,
  x: number,
  y: number,
): string {
  const def = GIBS_LAYERS[layerKey];
  return GIBS_TILE_TEMPLATE.replace("{layer}", def.layer)
    .replace("{time}", time)
    .replace("{tileMatrixSet}", def.tileMatrixSet)
    .replace("{z}", String(z))
    .replace("{x}", String(x))
    .replace("{y}", String(y))
    .replace("{format}", def.format);
}

/** Tile URL template string (with {z}/{x}/{y} placeholders) for MapLibre raster sources. */
export function gibsTileTemplate(layerKey: GibsLayerKey, time: string): string {
  const def = GIBS_LAYERS[layerKey];
  return GIBS_TILE_TEMPLATE.replace("{layer}", def.layer)
    .replace("{time}", time)
    .replace("{tileMatrixSet}", def.tileMatrixSet)
    .replace("{format}", def.format);
}

/* ─────────────── RainViewer radar ─────────────── */

export interface RadarFrame {
  /** epoch seconds */
  time: number;
  /** tile URL template with {z}/{x}/{y} */
  tiles: string;
  kind: "past" | "nowcast";
}

const RADAR_META_URL = "https://api.rainviewer.com/public/weather-maps.json";

/** Fetch radar frames (past ~2h + nowcast) for animation. */
export async function fetchRadarFrames(signal?: AbortSignal): Promise<RadarFrame[]> {
  const res = await fetch(RADAR_META_URL, { signal });
  if (!res.ok) throw new Error("RainViewer unavailable");
  const meta = (await res.json()) as {
    host: string;
    radar?: { past?: Array<{ time: number; path: string }> };
    nowcast?: { frames?: Array<{ time: number; path: string }> };
  };
  const host = meta.host;
  const make = (f: { time: number; path: string }, kind: RadarFrame["kind"]): RadarFrame => ({
    time: f.time,
    kind,
    tiles: `${host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`,
  });

  const past = (meta.radar?.past ?? []).slice(-12).map((f) => make(f, "past"));
  const nowcast = (meta.nowcast?.frames ?? []).slice(0, 6).map((f) => make(f, "nowcast"));
  return [...past, ...nowcast];
}
