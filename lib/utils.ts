import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Format a number with units
 */
export function formatUnit(value: number, unit: string, decimals = 0): string {
  return `${value.toFixed(decimals)}${unit}`;
}

/**
 * Truncate a string
 */
export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}

/**
 * Get UV index label
 */
export function uvLabel(
  uv: number
): { label: string; color: string } {
  if (uv <= 2) return { label: "Low", color: "text-green-400" };
  if (uv <= 5) return { label: "Moderate", color: "text-yellow-400" };
  if (uv <= 7) return { label: "High", color: "text-orange-400" };
  if (uv <= 10) return { label: "Very High", color: "text-red-400" };
  return { label: "Extreme", color: "text-purple-400" };
}

/**
 * Get humidity label
 */
export function humidityLabel(humidity: number): string {
  if (humidity < 30) return "Very Dry";
  if (humidity < 50) return "Comfortable";
  if (humidity < 70) return "Moderate";
  if (humidity < 85) return "Humid";
  return "Very Humid";
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a date range
 */
export function formatDateRange(start: string, end: string): string {
  if (!start || !end) return "No date range";
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round(
    (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)
  );
  return `${start} → ${end} (${diff} day${diff !== 1 ? "s" : ""})`;
}
