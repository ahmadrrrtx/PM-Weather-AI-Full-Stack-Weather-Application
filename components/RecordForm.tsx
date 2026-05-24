"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  X,
  Calendar,
  MapPin,
  FileText,
  Loader2,
  BookmarkPlus,
} from "lucide-react";
import type { WeatherData, RecordFormData } from "@/lib/types";
import {
  createRecord,
  updateRecord,
  validateDateRange,
} from "@/lib/storage";
import type { WeatherRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  weatherData: WeatherData | null;
  editingRecord?: WeatherRecord | null;
  onSaved: () => void;
  onClose?: () => void;
}

export default function RecordForm({
  weatherData,
  editingRecord,
  onSaved,
  onClose,
}: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<RecordFormData>({
    locationInput:
      editingRecord?.locationInput ||
      weatherData?.location.name ||
      "",
    startDate: editingRecord?.startDate || today,
    endDate: editingRecord?.endDate || today,
    notes: editingRecord?.notes || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validation = validateDateRange(formData.startDate, formData.endDate);
    if (!validation.valid) {
      setError(validation.error || "Invalid date range.");
      return;
    }

    if (!formData.locationInput.trim()) {
      setError("Location is required.");
      return;
    }

    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400)); // UX delay

      if (editingRecord) {
        updateRecord(editingRecord.id, {
          locationInput: formData.locationInput,
          startDate: formData.startDate,
          endDate: formData.endDate,
          notes: formData.notes,
          weatherJson: weatherData || editingRecord.weatherJson,
        });
      } else {
        const resolved = weatherData?.location;
        createRecord(
          formData,
          resolved
            ? `${resolved.name}, ${resolved.country}`
            : formData.locationInput,
          resolved?.latitude ?? 0,
          resolved?.longitude ?? 0,
          weatherData
        );
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSaved();
      }, 1000);
    } catch (err) {
      setError("Failed to save record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = cn(
    "w-full px-4 py-2.5 rounded-xl",
    "glass border border-white/15 focus:border-sky-400/60",
    "text-white placeholder-white/30 text-sm",
    "outline-none transition-all duration-200",
    "focus:bg-white/10"
  );

  const labelClass = "block text-xs font-medium text-white/60 mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="glass rounded-2xl p-6 border border-sky-500/20"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BookmarkPlus className="w-5 h-5 text-sky-400" />
          <h3 className="text-base font-bold text-white">
            {editingRecord ? "Edit Weather Record" : "Save Weather Record"}
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            aria-label="Close form"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Current weather preview */}
      {weatherData && (
        <div className="mb-5 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center gap-3">
          <span className="text-2xl">
            {["☀️", "⛅", "🌧️", "❄️", "⛈️"][weatherData.current.weatherCode % 5]}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {weatherData.location.name}, {weatherData.location.country}
            </p>
            <p className="text-xs text-white/50">
              {Math.round(weatherData.current.temperature)}°C ·{" "}
              {weatherData.current.humidity}% humidity
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location */}
        <div>
          <label className={labelClass}>
            <MapPin className="w-3 h-3 inline mr-1" />
            Location
          </label>
          <input
            type="text"
            value={formData.locationInput}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                locationInput: e.target.value,
              }))
            }
            placeholder="City, coordinates, landmark..."
            className={inputClass}
            required
          />
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              <Calendar className="w-3 h-3 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, startDate: e.target.value }))
              }
              className={cn(inputClass, "cursor-pointer")}
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              <Calendar className="w-3 h-3 inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              min={formData.startDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, endDate: e.target.value }))
              }
              className={cn(inputClass, "cursor-pointer")}
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>
            <FileText className="w-3 h-3 inline mr-1" />
            Notes{" "}
            <span className="text-white/30 font-normal">(optional)</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((p) => ({ ...p, notes: e.target.value }))
            }
            placeholder="Add travel notes, personal observations..."
            rows={3}
            className={cn(inputClass, "resize-none")}
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
            >
              ⚠️ {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={saving || success}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full py-3 rounded-xl font-semibold text-sm",
            "flex items-center justify-center gap-2",
            "transition-all duration-200",
            success
              ? "bg-emerald-500/30 border border-emerald-500/40 text-emerald-300"
              : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/20",
            (saving || success) && "pointer-events-none"
          )}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : success ? (
            <>
              <span>✅</span>
              Saved Successfully!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {editingRecord ? "Update Record" : "Save Record"}
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
