"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";

export default function SensorAdminPage() {
  const [loading, setLoading] = useState(false);
  const [lastPush, setLastPush] = useState<string | null>(null);
  const [customAqi, setCustomAqi] = useState(100);
  const [customPm25, setCustomPm25] = useState(45);
  const [customNo2, setCustomNo2] = useState(55);
  const [customO3, setCustomO3] = useState(80);

  const pushLevel = async (level: "low" | "moderate" | "severe") => {
    setLoading(true);
    try {
      const res = await fetch("/api/sensor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
      });
      if (res.ok) {
        setLastPush(`${level.toUpperCase()} pushed at ${new Date().toLocaleTimeString()}`);
      }
    } catch {
      console.error("Failed to push");
    } finally {
      setLoading(false);
    }
  };

  const pushCustom = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sensor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: customAqi > 200 ? "severe" : customAqi > 100 ? "moderate" : "low",
          aqi: customAqi,
          pm25: customPm25,
          no2: customNo2,
          o3: customO3,
        }),
      });
      if (res.ok) {
        setLastPush(`Custom values pushed at ${new Date().toLocaleTimeString()}`);
      }
    } catch {
      console.error("Failed to push");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Outfit" }}>
            <span className="text-gradient-warm">Admin</span> Control Panel
          </h1>
          <p className="text-foreground/50 mt-1">Push sensor readings to the user display</p>
        </div>
        <Link href="/sensor">
          <motion.button
            className="px-6 py-3 rounded-xl glass border border-neon-cyan/30 text-neon-cyan font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📡 User View
          </motion.button>
        </Link>
      </motion.div>

      {/* Status */}
      {lastPush && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl px-4 py-3 border border-neon-green/20"
        >
          <p className="text-neon-green text-sm">✅ {lastPush}</p>
        </motion.div>
      )}

      {/* Quick Push Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-lg font-semibold mb-6" style={{ fontFamily: "Outfit" }}>
            ⚡ Quick Push
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LOW */}
            <motion.button
              onClick={() => pushLevel("low")}
              disabled={loading}
              className="p-8 rounded-2xl border-2 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all text-center disabled:opacity-50"
              whileHover={{ scale: 1.03, borderColor: "rgba(16,185,129,0.6)" }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-5xl block mb-3">🟢</span>
              <span className="text-green-400 font-bold text-xl block">LOW</span>
              <span className="text-foreground/40 text-sm block mt-2">AQI: 35</span>
              <span className="text-foreground/30 text-xs">Clean air — safe</span>
            </motion.button>

            {/* MODERATE */}
            <motion.button
              onClick={() => pushLevel("moderate")}
              disabled={loading}
              className="p-8 rounded-2xl border-2 border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all text-center disabled:opacity-50"
              whileHover={{ scale: 1.03, borderColor: "rgba(245,158,11,0.6)" }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-5xl block mb-3">🟡</span>
              <span className="text-yellow-400 font-bold text-xl block">MODERATE</span>
              <span className="text-foreground/40 text-sm block mt-2">AQI: 115</span>
              <span className="text-foreground/30 text-xs">Caution advised</span>
            </motion.button>

            {/* SEVERE */}
            <motion.button
              onClick={() => pushLevel("severe")}
              disabled={loading}
              className="p-8 rounded-2xl border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all text-center disabled:opacity-50"
              whileHover={{ scale: 1.03, borderColor: "rgba(239,68,68,0.6)" }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-5xl block mb-3">🔴</span>
              <span className="text-red-400 font-bold text-xl block">SEVERE</span>
              <span className="text-foreground/40 text-sm block mt-2">AQI: 340</span>
              <span className="text-foreground/30 text-xs">Health emergency</span>
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Custom Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-lg font-semibold mb-6" style={{ fontFamily: "Outfit" }}>
            🎛️ Custom Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground/60">AQI</span>
                <span className="text-neon-cyan font-bold">{customAqi}</span>
              </div>
              <input type="range" min={0} max={500} value={customAqi} onChange={(e) => setCustomAqi(Number(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground/60">PM2.5 (µg/m³)</span>
                <span className="text-neon-purple font-bold">{customPm25}</span>
              </div>
              <input type="range" min={0} max={300} value={customPm25} onChange={(e) => setCustomPm25(Number(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground/60">NO₂ (µg/m³)</span>
                <span className="text-neon-yellow font-bold">{customNo2}</span>
              </div>
              <input type="range" min={0} max={300} value={customNo2} onChange={(e) => setCustomNo2(Number(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground/60">O₃ (µg/m³)</span>
                <span className="text-neon-red font-bold">{customO3}</span>
              </div>
              <input type="range" min={0} max={300} value={customO3} onChange={(e) => setCustomO3(Number(e.target.value))} />
            </div>
          </div>
          <motion.button
            onClick={pushCustom}
            disabled={loading}
            className="w-full mt-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-neon-purple to-neon-pink text-white disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Pushing..." : "📡 Push Custom Values"}
          </motion.button>
        </GlassCard>
      </motion.div>

      {/* Instructions */}
      <GlassCard className="p-5" hover={false}>
        <h3 className="text-sm font-semibold mb-3">📋 How it works</h3>
        <ol className="space-y-2 text-sm text-foreground/50">
          <li>1. Open the <span className="text-neon-cyan">User View</span> on another device or tab</li>
          <li>2. The user sees &quot;Analyzing Air...&quot; with a scanning animation</li>
          <li>3. Click a quick button or set custom values above</li>
          <li>4. The user&apos;s display updates in real-time (1.5s polling)</li>
          <li>5. Each push triggers smooth transition animations on the user side</li>
        </ol>
      </GlassCard>
    </div>
  );
}
