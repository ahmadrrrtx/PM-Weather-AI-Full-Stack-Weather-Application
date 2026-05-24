"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Trash2,
  Edit3,
  Download,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  FileJson,
  FileText,
  BookOpen,
  FileDown,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { getRecords, deleteRecord } from "@/lib/storage";
import {
  exportJSON,
  exportCSV,
  exportMarkdown,
  exportPDF,
} from "@/lib/export";
import type { WeatherRecord } from "@/lib/types";
import { decodeWeatherCode } from "@/lib/weather";
import { formatDateRange, cn } from "@/lib/utils";
import RecordForm from "./RecordForm";

interface Props {
  onRecordClick?: (record: WeatherRecord) => void;
  refreshKey?: number;
}

export default function SavedRecords({ onRecordClick, refreshKey }: Props) {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const loadRecords = useCallback(() => {
    setRecords(getRecords());
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords, refreshKey]);

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      deleteRecord(id);
      setRecords(getRecords());
      setConfirmDeleteId(null);
      setEditingId(null);
      setExpandedId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const handleExport = async (format: "json" | "csv" | "markdown" | "pdf") => {
    if (records.length === 0) return;
    setExportLoading(true);
    try {
      if (format === "json") exportJSON(records);
      else if (format === "csv") exportCSV(records);
      else if (format === "markdown") exportMarkdown(records);
      else if (format === "pdf") await exportPDF(records);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportLoading(false);
    }
  };

  const editingRecord = records.find((r) => r.id === editingId) ?? null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      aria-label="Saved weather records"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white">Saved Records</h3>
          <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-medium">
            {records.length}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Export buttons */}
          {records.length > 0 && (
            <div className="flex gap-1.5">
              {[
                {
                  key: "json" as const,
                  icon: <FileJson className="w-3.5 h-3.5" />,
                  label: "JSON",
                },
                {
                  key: "csv" as const,
                  icon: <FileText className="w-3.5 h-3.5" />,
                  label: "CSV",
                },
                {
                  key: "markdown" as const,
                  icon: <BookOpen className="w-3.5 h-3.5" />,
                  label: "MD",
                },
                {
                  key: "pdf" as const,
                  icon: <FileDown className="w-3.5 h-3.5" />,
                  label: "PDF",
                },
              ].map((exp) => (
                <button
                  key={exp.key}
                  onClick={() => handleExport(exp.key)}
                  disabled={exportLoading}
                  title={`Export as ${exp.label}`}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass border border-white/15 hover:border-sky-400/40 hover:bg-sky-500/10 text-white/60 hover:text-sky-300 text-xs font-medium transition-all"
                >
                  {exp.icon}
                  {exp.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={loadRecords}
            title="Refresh records"
            className="w-8 h-8 rounded-lg glass border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-lg glass border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Edit form */}
      <AnimatePresence>
        {editingId && editingRecord && (
          <div className="mb-4">
            <RecordForm
              weatherData={editingRecord.weatherJson}
              editingRecord={editingRecord}
              onSaved={() => {
                setEditingId(null);
                loadRecords();
              }}
              onClose={() => setEditingId(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Records list */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {records.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-white/60 font-medium">
                  No saved records yet
                </p>
                <p className="text-white/30 text-sm mt-1">
                  Search for a location and click &quot;Save Record&quot; to
                  start tracking
                </p>
              </div>
            ) : (
              records.map((record, i) => {
                const isExpanded = expandedId === record.id;
                const cw = record.weatherJson?.current;
                const condition = cw
                  ? decodeWeatherCode(cw.weatherCode, cw.isDay)
                  : null;

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                  >
                    {/* Record header */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Emoji */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-blue-600/30 flex items-center justify-center text-xl shrink-0">
                          {condition?.emoji || "🌡️"}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-white font-semibold text-sm truncate">
                                {record.resolvedName}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                <span className="flex items-center gap-1 text-xs text-white/40">
                                  <MapPin className="w-3 h-3" />
                                  {record.locationInput}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-white/40">
                                  <Calendar className="w-3 h-3" />
                                  {formatDateRange(
                                    record.startDate,
                                    record.endDate
                                  )}
                                </span>
                              </div>
                              {cw && (
                                <div className="flex items-center gap-3 mt-1.5">
                                  <span className="text-xs text-sky-300 font-medium">
                                    {Math.round(cw.temperature)}°C
                                  </span>
                                  <span className="text-xs text-white/40">
                                    {condition?.label}
                                  </span>
                                  <span className="text-xs text-white/40">
                                    {cw.humidity}% humidity
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() =>
                                  setExpandedId(
                                    isExpanded ? null : record.id
                                  )
                                }
                                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                                title={isExpanded ? "Collapse" : "Expand"}
                              >
                                {isExpanded ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (onRecordClick) onRecordClick(record);
                                }}
                                className="w-7 h-7 rounded-lg hover:bg-sky-500/20 flex items-center justify-center text-white/40 hover:text-sky-300 transition-all"
                                title="View on map"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  setEditingId(
                                    editingId === record.id ? null : record.id
                                  )
                                }
                                className="w-7 h-7 rounded-lg hover:bg-amber-500/20 flex items-center justify-center text-white/40 hover:text-amber-300 transition-all"
                                title="Edit record"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center transition-all text-xs font-bold",
                                  confirmDeleteId === record.id
                                    ? "bg-red-500/30 text-red-300 border border-red-500/40"
                                    : "hover:bg-red-500/20 text-white/40 hover:text-red-400"
                                )}
                                title={
                                  confirmDeleteId === record.id
                                    ? "Click again to confirm delete"
                                    : "Delete record"
                                }
                              >
                                {confirmDeleteId === record.id ? (
                                  "!"
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-white/10 px-4 pb-4 pt-3 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <p className="text-white/40 mb-0.5">
                                Coordinates
                              </p>
                              <p className="text-white font-medium">
                                {record.latitude.toFixed(4)},{" "}
                                {record.longitude.toFixed(4)}
                              </p>
                            </div>
                            {cw && (
                              <>
                                <div>
                                  <p className="text-white/40 mb-0.5">
                                    Wind Speed
                                  </p>
                                  <p className="text-white font-medium">
                                    {Math.round(cw.windSpeed)} km/h
                                  </p>
                                </div>
                                <div>
                                  <p className="text-white/40 mb-0.5">
                                    UV Index
                                  </p>
                                  <p className="text-white font-medium">
                                    {cw.uvIndex}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-white/40 mb-0.5">
                                    Feels Like
                                  </p>
                                  <p className="text-white font-medium">
                                    {Math.round(cw.feelsLike)}°C
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                          {record.notes && (
                            <div className="mt-3 p-3 rounded-lg bg-white/5">
                              <p className="text-white/40 text-xs mb-1">
                                Notes
                              </p>
                              <p className="text-white/70 text-xs leading-relaxed">
                                {record.notes}
                              </p>
                            </div>
                          )}
                          <p className="text-white/20 text-xs mt-3">
                            Saved:{" "}
                            {new Date(record.createdAt).toLocaleString()}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Storage note */}
      <p className="text-xs text-white/20 text-center mt-3">
        💾 Stored in browser localStorage · No account required
      </p>
    </motion.section>
  );
}
