import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_LOCATION, useAppStore } from "@/lib/store";

describe("app store", () => {
  beforeEach(() => {
    useAppStore.setState({
      location: DEFAULT_LOCATION,
      unitSystem: "metric",
      units: { system: "metric", temperature: "celsius", speed: "kmh", precipitation: "mm" },
      recentLocations: [],
      activeTab: "overview",
      focusSignal: 0,
    });
  });

  it("defaults to Islamabad (metric)", () => {
    const s = useAppStore.getState();
    expect(s.location.name).toBe("Islamabad");
    expect(s.unitSystem).toBe("metric");
    expect(s.units.temperature).toBe("celsius");
  });

  it("switches unit system", () => {
    useAppStore.getState().setUnitSystem("imperial");
    const s = useAppStore.getState();
    expect(s.unitSystem).toBe("imperial");
    expect(s.units.temperature).toBe("fahrenheit");
    expect(s.units.speed).toBe("mph");
  });

  it("tracks recent locations without duplicates", () => {
    const loc = { name: "Tokyo", latitude: 35.67, longitude: 139.65, country: "Japan" };
    const dup = { name: "Tokyo again", latitude: 35.68, longitude: 139.66, country: "Japan" };
    const other = { name: "Paris", latitude: 48.85, longitude: 2.35, country: "France" };

    useAppStore.getState().setLocation(loc);
    useAppStore.getState().setLocation(dup);
    useAppStore.getState().setLocation(other);

    expect(useAppStore.getState().recentLocations).toHaveLength(2);
    expect(useAppStore.getState().recentLocations[0]?.name).toBe("Paris");
  });

  it("caps recents at 6", () => {
    for (let i = 0; i < 10; i++) {
      useAppStore.getState().setLocation({
        name: `City ${i}`,
        latitude: i,
        longitude: i,
      });
    }
    expect(useAppStore.getState().recentLocations.length).toBeLessThanOrEqual(6);
  });

  it("clears recents", () => {
    useAppStore.getState().setLocation({ name: "X", latitude: 1, longitude: 2 });
    useAppStore.getState().clearRecent();
    expect(useAppStore.getState().recentLocations).toHaveLength(0);
  });

  it("focus signal increments", () => {
    const before = useAppStore.getState().focusSignal;
    useAppStore.getState().requestFocus();
    expect(useAppStore.getState().focusSignal).toBe(before + 1);
  });
});
