import type { WeatherRecord, RecordFormData, WeatherData } from "./types";

const STORAGE_KEY = "pm_weather_records_v1";

/**
 * Generate a UUID v4 (browser-compatible, no crypto library needed)
 */
function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Read all records from localStorage
 */
export function getRecords(): WeatherRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as WeatherRecord[];
  } catch {
    return [];
  }
}

/**
 * Save records array to localStorage
 */
function saveRecords(records: WeatherRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save records:", e);
  }
}

/**
 * CREATE a new weather record
 */
export function createRecord(
  formData: RecordFormData,
  resolvedName: string,
  latitude: number,
  longitude: number,
  weatherJson: WeatherData | null
): WeatherRecord {
  const now = new Date().toISOString();
  const record: WeatherRecord = {
    id: generateId(),
    locationInput: formData.locationInput,
    resolvedName,
    latitude,
    longitude,
    startDate: formData.startDate,
    endDate: formData.endDate,
    weatherJson,
    notes: formData.notes,
    createdAt: now,
    updatedAt: now,
  };
  const records = getRecords();
  records.unshift(record); // newest first
  saveRecords(records);
  return record;
}

/**
 * READ a single record by id
 */
export function getRecordById(id: string): WeatherRecord | null {
  const records = getRecords();
  return records.find((r) => r.id === id) ?? null;
}

/**
 * UPDATE a record
 */
export function updateRecord(
  id: string,
  updates: Partial<Omit<WeatherRecord, "id" | "createdAt">>
): WeatherRecord | null {
  const records = getRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;
  records[index] = {
    ...records[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveRecords(records);
  return records[index];
}

/**
 * DELETE a record
 */
export function deleteRecord(id: string): boolean {
  const records = getRecords();
  const filtered = records.filter((r) => r.id !== id);
  if (filtered.length === records.length) return false;
  saveRecords(filtered);
  return true;
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: string,
  endDate: string
): { valid: boolean; error?: string } {
  if (!startDate || !endDate) {
    return { valid: false, error: "Both start and end dates are required." };
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: "Invalid date format." };
  }
  if (end < start) {
    return { valid: false, error: "End date must be on or after start date." };
  }
  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > 365) {
    return {
      valid: false,
      error: "Date range cannot exceed 365 days.",
    };
  }
  return { valid: true };
}
