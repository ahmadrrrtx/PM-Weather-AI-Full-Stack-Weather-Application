import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  DashboardTab,
  GeoLocation,
  UnitPrefs,
  UnitSystem,
} from "@/lib/types";
import { UNIT_PRESETS } from "@/lib/units";

/* ─────────────────────────────────────────────
   Global app state — location, units, recent
   searches, tab, globe focus requests.
   Persisted: units + recentLocations + lastLocation
   ───────────────────────────────────────────── */

export const DEFAULT_LOCATION: GeoLocation = {
  name: "Islamabad",
  latitude: 33.6844,
  longitude: 73.0479,
  country: "Pakistan",
  admin1: "Islamabad",
  timezone: "Asia/Karachi",
  population: 1013825,
};

interface AppState {
  location: GeoLocation;
  units: UnitPrefs;
  unitSystem: UnitSystem;
  recentLocations: GeoLocation[];
  activeTab: DashboardTab;

  setLocation: (loc: GeoLocation, opts?: { flyTo?: boolean; persist?: boolean }) => void;
  setUnitSystem: (system: UnitSystem) => void;
  setActiveTab: (tab: DashboardTab) => void;
  addRecent: (loc: GeoLocation) => void;
  clearRecent: () => void;

  /** Incremented to ask the globe to fly to the current location. */
  focusSignal: number;
  requestFocus: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      location: DEFAULT_LOCATION,
      units: UNIT_PRESETS.metric,
      unitSystem: "metric",
      recentLocations: [],
      activeTab: "overview",
      focusSignal: 0,

      setLocation: (loc) => {
        set({ location: loc });
        get().addRecent(loc);
      },
      setUnitSystem: (system) =>
        set({ unitSystem: system, units: UNIT_PRESETS[system] }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      addRecent: (loc) => {
        const exists = get().recentLocations.some(
          (r) =>
            Math.abs(r.latitude - loc.latitude) < 0.01 &&
            Math.abs(r.longitude - loc.longitude) < 0.01,
        );
        if (exists) return;
        set({
          recentLocations: [loc, ...get().recentLocations].slice(0, 6),
        });
      },
      clearRecent: () => set({ recentLocations: [] }),
      requestFocus: () => set({ focusSignal: get().focusSignal + 1 }),
    }),
    {
      name: "novaweather-store",
      partialize: (s) => ({
        unitSystem: s.unitSystem,
        units: s.units,
        recentLocations: s.recentLocations,
        location: s.location,
      }),
    },
  ),
);

/** Convenience: latest units outside React. */
export function getUnits(): UnitPrefs {
  return useAppStore.getState().units;
}
