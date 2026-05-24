"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

interface Props {
  latitude: number;
  longitude: number;
  locationName: string;
}

export default function WeatherMap({
  latitude,
  longitude,
  locationName,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically import Leaflet to avoid SSR issues
    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapRef.current) return;

      // Fix Leaflet's default icon paths
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Remove old map instance
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }

      // Ensure container is empty
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }

      // Create map
      const map = L.map(mapRef.current!, {
        center: [latitude, longitude],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      // Add OpenStreetMap tiles (free, no key)
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom marker
      const customIcon = L.divIcon({
        html: `
          <div style="
            width: 40px; height: 40px;
            background: linear-gradient(135deg, #38bdf8, #3b82f6);
            border-radius: 50% 50% 50% 0%;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 15px rgba(56,189,248,0.5);
            display: flex; align-items: center; justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              font-size: 16px;
              margin-top: -4px;
              margin-left: -2px;
            ">📍</div>
          </div>
        `,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -44],
      });

      // Add marker with popup
      L.marker([latitude, longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `
          <div style="
            color: white;
            background: rgba(12,26,46,0.95);
            padding: 10px 14px;
            border-radius: 10px;
            font-family: Inter, sans-serif;
            min-width: 160px;
            border: 1px solid rgba(99,179,237,0.3);
          ">
            <p style="font-weight: bold; font-size: 13px; margin: 0 0 4px;">${locationName}</p>
            <p style="color: rgba(99,179,237,0.8); font-size: 11px; margin: 0;">
              ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E
            </p>
          </div>
        `,
          {
            className: "custom-popup",
            closeButton: false,
          }
        )
        .openPopup();

      // Add a subtle circle around the location
      L.circle([latitude, longitude], {
        color: "rgba(56,189,248,0.6)",
        fillColor: "rgba(56,189,248,0.1)",
        fillOpacity: 1,
        weight: 2,
        radius: 5000,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, locationName]);

  const osmLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=11`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass rounded-2xl overflow-hidden"
      aria-label="Location map"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-400" />
          <h3 className="text-base font-bold text-white">Location Map</h3>
        </div>
        <a
          href={osmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-sky-300 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open in OSM
        </a>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-72 sm:h-80"
        aria-label={`Map of ${locationName}`}
      />

      {/* Footer */}
      <div className="px-4 py-2 bg-black/20 flex items-center justify-between">
        <p className="text-xs text-white/40">
          📍 {locationName} · {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
        <p className="text-xs text-white/30">OpenStreetMap · Free</p>
      </div>
    </motion.section>
  );
}
