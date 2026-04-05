"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { CITIES } from "@/lib/constants";
import { getAqiLevel } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import Leaflet (SSR-incompatible)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCity, setSelectedCity] = useState<typeof CITIES[number] | null>(null);

  useEffect(() => {
    setMounted(true);
    // Import Leaflet CSS
    import("leaflet/dist/leaflet.css");
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Outfit" }}>
          <span className="text-gradient">Smart City</span> Pollution Map
        </h1>
        <p className="text-foreground/50 mt-1">Global pollution hotspots with real-time data</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-2 overflow-hidden" hover={false}>
            <div className="rounded-xl overflow-hidden" style={{ height: "500px" }}>
              {mounted && (
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: "100%", width: "100%", borderRadius: "12px" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution=""
                  />
                  {CITIES.map((city) => {
                    const level = getAqiLevel(city.aqi);
                    return (
                      <CircleMarker
                        key={city.name}
                        center={[city.lat, city.lng]}
                        radius={Math.max(8, city.aqi / 20)}
                        pathOptions={{
                          color: level.color,
                          fillColor: level.color,
                          fillOpacity: 0.4,
                          weight: 2,
                        }}
                        eventHandlers={{
                          click: () => setSelectedCity(city),
                        }}
                      >
                        <Popup>
                          <div className="text-black p-1">
                            <strong className="text-lg">{city.name}</strong>
                            <p className="text-sm">{city.country}</p>
                            <p className="font-bold text-lg mt-1" style={{ color: level.color }}>
                              AQI: {city.aqi}
                            </p>
                            <p className="text-xs text-gray-600">{city.description}</p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* City List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <GlassCard className="p-4" hover={false}>
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "Outfit" }}>🏆 City Rankings</h3>
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              {[...CITIES]
                .sort((a, b) => b.aqi - a.aqi)
                .map((city, i) => {
                  const level = getAqiLevel(city.aqi);
                  return (
                    <motion.div
                      key={city.name}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        selectedCity?.name === city.name
                          ? "bg-white/[0.06] border border-border-bright"
                          : "hover:bg-white/[0.03]"
                      }`}
                      onClick={() => setSelectedCity(city)}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <span className="text-foreground/30 text-sm w-6 text-center font-mono">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{city.name}</p>
                        <p className="text-[10px] text-foreground/30">{city.country}</p>
                      </div>
                      <StatusBadge
                        label={`${city.aqi}`}
                        color={level.color}
                        bg={level.bg}
                        size="sm"
                      />
                    </motion.div>
                  );
                })}
            </div>
          </GlassCard>

          {/* Selected City Detail */}
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-4" glow={selectedCity.aqi > 200 ? "red" : "cyan"}>
                <h3 className="font-semibold text-lg" style={{ fontFamily: "Outfit" }}>
                  {selectedCity.name}
                </h3>
                <p className="text-foreground/40 text-xs mb-2">{selectedCity.country}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold" style={{ color: getAqiLevel(selectedCity.aqi).color }}>
                    {selectedCity.aqi}
                  </span>
                  <StatusBadge
                    label={getAqiLevel(selectedCity.aqi).label}
                    color={getAqiLevel(selectedCity.aqi).color}
                    size="sm"
                    pulse
                  />
                </div>
                <p className="text-sm text-foreground/50">{selectedCity.description}</p>
              </GlassCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
