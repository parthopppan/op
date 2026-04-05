"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { CITIES, INDIA_REGIONS } from "@/lib/constants";
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
  const [mapMode, setMapMode] = useState<"india" | "global">("india");
  const [selectedLocation, setSelectedLocation] = useState<typeof CITIES[number] | typeof INDIA_REGIONS[number] | null>(null);

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

      <div className="flex gap-2">
        <button
          onClick={() => { setMapMode("india"); setSelectedLocation(null); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${mapMode === "india" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40" : "glass text-foreground/50 hover:text-foreground"}`}
        >
          🇮🇳 India Heatmap
        </button>
        <button
          onClick={() => { setMapMode("global"); setSelectedLocation(null); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${mapMode === "global" ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/40" : "glass text-foreground/50 hover:text-foreground"}`}
        >
          🌍 Global Cities
        </button>
      </div>

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
                  key={mapMode}
                  center={mapMode === "global" ? [20, 0] : [22.9, 78.96]}
                  zoom={mapMode === "global" ? 2 : 5}
                  style={{ height: "100%", width: "100%", borderRadius: "12px" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution=""
                  />
                  {(mapMode === "global" ? CITIES : INDIA_REGIONS).map((loc) => {
                    const level = getAqiLevel(loc.aqi);
                    const isIndia = "pincode" in loc;
                    const predictedSmogRisk = Math.min(99, Math.round((loc.aqi / 300) * 100));

                    return (
                      <CircleMarker
                        key={loc.name}
                        center={[loc.lat, loc.lng]}
                        radius={isIndia ? Math.max(20, loc.aqi / 8) : Math.max(8, loc.aqi / 20)}
                        pathOptions={{
                          color: level.color,
                          fillColor: level.color,
                          fillOpacity: isIndia ? 0.25 : 0.4,
                          weight: isIndia ? 0 : 2,
                        }}
                        eventHandlers={{
                          click: () => setSelectedLocation(loc),
                        }}
                      >
                        <Popup>
                          <div className="text-black p-1">
                            <strong className="text-lg">{loc.name}</strong>
                            <p className="text-sm font-medium">{isIndia ? `Pincode: ${(loc as any).pincode}` : (loc as any).country}</p>
                            <div className="bg-gray-100 rounded-lg p-2 mt-2">
                              <p className="font-bold text-lg leading-none" style={{ color: level.color }}>
                                AQI: {loc.aqi}
                              </p>
                              <p className="text-xs font-semibold mt-1 text-gray-700">Predictive Smog Risk: {predictedSmogRisk}%</p>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">{loc.description}</p>
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
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "Outfit" }}>
              🏆 {mapMode === "global" ? "Global" : "India"} Rankings
            </h3>
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              {[...(mapMode === "global" ? CITIES : INDIA_REGIONS)]
                .sort((a, b) => b.aqi - a.aqi)
                .map((loc, i) => {
                  const level = getAqiLevel(loc.aqi);
                  return (
                    <motion.div
                      key={loc.name}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        selectedLocation?.name === loc.name
                          ? "bg-white/[0.06] border border-border-bright"
                          : "hover:bg-white/[0.03]"
                      }`}
                      onClick={() => setSelectedLocation(loc)}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <span className="text-foreground/30 text-sm w-6 text-center font-mono">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{loc.name}</p>
                        <p className="text-[10px] text-foreground/30">
                          {"pincode" in loc ? `Pin: ${loc.pincode}` : loc.country}
                        </p>
                      </div>
                      <StatusBadge
                        label={`${loc.aqi}`}
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
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-4" glow={selectedLocation.aqi > 200 ? "red" : "cyan"}>
                <h3 className="font-semibold text-lg" style={{ fontFamily: "Outfit" }}>
                  {selectedLocation.name}
                </h3>
                <p className="text-foreground/40 text-xs mb-2">
                  {"pincode" in selectedLocation ? `Pincode: ${selectedLocation.pincode}` : selectedLocation.country}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-widest mb-1">Live AQI</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold" style={{ color: getAqiLevel(selectedLocation.aqi).color }}>
                        {selectedLocation.aqi}
                      </span>
                      <StatusBadge
                        label={getAqiLevel(selectedLocation.aqi).label}
                        color={getAqiLevel(selectedLocation.aqi).color}
                        size="sm"
                        pulse
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-widest mb-1">Predictive Risk</p>
                    <p className="text-xl font-bold font-mono text-neon-yellow">
                      {Math.min(99, Math.round((selectedLocation.aqi / 300) * 100))}%
                    </p>
                  </div>
                </div>

                <p className="text-sm text-foreground/50 border-t border-white/10 pt-3 mt-1">
                  {selectedLocation.description}
                </p>
              </GlassCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
