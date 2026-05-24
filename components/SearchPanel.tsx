"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Loader2,
  Navigation,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSearch: (query: string) => void;
  onCurrentLocation: () => void;
  isLoading: boolean;
  locationLoading: boolean;
}

const RECENT_KEY = "pm_weather_recent_searches";

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(query: string): void {
  if (typeof window === "undefined") return;
  try {
    const recent = getRecentSearches().filter(
      (s) => s.toLowerCase() !== query.toLowerCase()
    );
    recent.unshift(query);
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(recent.slice(0, 8))
    );
  } catch {}
}

export default function SearchPanel({
  onSearch,
  onCurrentLocation,
  isLoading,
  locationLoading,
}: Props) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setRecentSearches(getRecentSearches());
    setShowSuggestions(true);
  };

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const q = query.trim();
      if (!q) return;
      addRecentSearch(q);
      setRecentSearches(getRecentSearches());
      setShowSuggestions(false);
      onSearch(q);
    },
    [query, onSearch]
  );

  const handleSuggestionClick = (s: string) => {
    setQuery(s);
    setShowSuggestions(false);
    onSearch(s);
    addRecentSearch(s);
  };

  const clearRecent = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = getRecentSearches().filter((s) => s !== item);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const examples = [
    "New York",
    "London",
    "Tokyo",
    "Sydney",
    "40.7128,-74.0060",
    "90210",
    "Eiffel Tower",
    "Dubai",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Real-Time Weather{" "}
          <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            Intelligence
          </span>
        </h2>
        <p className="text-white/50 text-sm sm:text-base">
          Search any city, landmark, postal code, or GPS coordinates
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2">
            {/* Main input */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search: London, 90210, 40.71,-74.00, Eiffel Tower..."
                className={cn(
                  "w-full pl-11 pr-4 py-3.5 rounded-xl",
                  "glass border border-white/15 focus:border-sky-400/60",
                  "text-white placeholder-white/30 text-sm",
                  "outline-none transition-all duration-200",
                  "focus:bg-white/10 focus:shadow-lg focus:shadow-sky-500/10"
                )}
                aria-label="Search location"
                autoComplete="off"
              />
            </div>

            {/* Search button */}
            <motion.button
              type="submit"
              disabled={isLoading || !query.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "px-5 py-3.5 rounded-xl font-semibold text-sm",
                "bg-gradient-to-r from-sky-500 to-blue-600",
                "hover:from-sky-400 hover:to-blue-500",
                "text-white shadow-lg shadow-blue-500/30",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-2 shrink-0"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:block">Search</span>
            </motion.button>

            {/* Current location button */}
            <motion.button
              type="button"
              onClick={onCurrentLocation}
              disabled={locationLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Use my current location"
              className={cn(
                "px-4 py-3.5 rounded-xl font-semibold text-sm",
                "glass border border-white/15 hover:border-sky-400/40",
                "text-white/70 hover:text-white",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-2 shrink-0"
              )}
            >
              {locationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              ) : (
                <Navigation className="w-4 h-4 text-sky-400" />
              )}
              <span className="hidden sm:block text-xs">My Location</span>
            </motion.button>
          </div>
        </form>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 w-full z-50 glass-strong rounded-xl border border-white/15 overflow-hidden shadow-2xl shadow-black/40"
            >
              <div className="p-2">
                <p className="text-xs text-white/40 px-3 py-1.5 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Recent Searches
                </p>
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                        {s}
                      </span>
                    </div>
                    <button
                      onClick={(e) => clearRecent(e, s)}
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                      <X className="w-3 h-3 text-white/50" />
                    </button>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Example searches */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-1.5 justify-center mt-4"
      >
        <span className="text-xs text-white/30">Try:</span>
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setQuery(ex);
              onSearch(ex);
            }}
            className="px-2.5 py-1 rounded-full text-xs text-white/50 hover:text-white border border-white/10 hover:border-sky-400/40 hover:bg-sky-500/10 transition-all duration-200"
          >
            {ex}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
