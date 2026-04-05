"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";

interface SensorData {
  level: "low" | "moderate" | "severe" | "analyzing";
  aqi: number;
  pm25: number;
  no2: number;
  o3: number;
  timestamp: number;
  updatedBy: string;
}

const LEVEL_CONFIG = {
  analyzing: { color: "#00e5ff", label: "Analyzing...", bg: "rgba(0,229,255,0.1)" },
  low: { color: "#10b981", label: "Low Pollution", bg: "rgba(16,185,129,0.1)" },
  moderate: { color: "#f59e0b", label: "Moderate Pollution", bg: "rgba(245,158,11,0.1)" },
  severe: { color: "#ef4444", label: "Severe Pollution", bg: "rgba(239,68,68,0.1)" },
};

export default function SensorPage() {
  const [data, setData] = useState<SensorData>({
    level: "analyzing",
    aqi: 0, pm25: 0, no2: 0, o3: 0,
    timestamp: Date.now(),
    updatedBy: "system",
  });
  const [scanning, setScanning] = useState(true);
  const [scanPhase, setScanPhase] = useState(0);

  // Poll for sensor updates
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/sensor");
        const json = await res.json();
        if (json.level !== "analyzing") {
          setData(json);
          setScanning(false);
        }
      } catch {
        // silently retry
      }
    };

    poll();
    const interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, []);

  // Scanning animation phases
  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setScanPhase((p) => (p + 1) % 4);
    }, 800);
    return () => clearInterval(interval);
  }, [scanning]);

  const config = LEVEL_CONFIG[data.level];
  const scanTexts = [
    "Initializing sensor array...",
    "Calibrating PM2.5 detector...",
    "Sampling atmospheric NOₓ...",
    "Analyzing ozone concentration...",
  ];

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
            <span className="text-gradient">Live Sensor</span> Monitor
          </h1>
          <p className="text-foreground/50 mt-1">Real-time air quality sensor readings</p>
        </div>
        <Link href="/sensor/admin">
          <motion.button
            className="px-6 py-3 rounded-xl glass border border-neon-purple/30 text-neon-purple font-medium text-sm hover:bg-neon-purple/10 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            
          </motion.button>
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {scanning && data.level === "analyzing" ? (
          /* Scanning State */
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            {/* Sensor Animation */}
            <div className="relative w-64 h-64">
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-neon-cyan/20"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              />
              {/* Middle ring */}
              <motion.div
                className="absolute inset-6 rounded-full border-2 border-neon-blue/20"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              />
              {/* Inner ring */}
              <motion.div
                className="absolute inset-12 rounded-full border-2 border-neon-purple/20"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              />
              {/* Center pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-neon-cyan/10 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-neon-cyan/20"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </motion.div>
              </div>
              {/* Scanning line */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-neon-cyan to-transparent opacity-50"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                style={{ transformOrigin: "center center" }}
              />
            </div>

            <motion.p
              className="text-neon-cyan text-lg font-medium mt-8"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🔍 Analyzing Air Quality...
            </motion.p>
            <motion.p
              key={scanPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-foreground/40 text-sm mt-2"
            >
              {scanTexts[scanPhase]}
            </motion.p>

            {/* Fake progress bars */}
            <div className="w-64 mt-8 space-y-2">
              {["PM2.5 Sensor", "NOₓ Detector", "O₃ Analyzer", "VOC Scanner"].map((name, i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-[10px] text-foreground/30 w-20">{name}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-neon-cyan/50 rounded-full"
                      animate={{ width: ["0%", "60%", "30%", "80%", "50%"] }}
                      transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-foreground/20 text-xs mt-8">
              Waiting for sensor data... Ask admin to push readings
            </p>
          </motion.div>
        ) : (
          /* Data Display State */
          <motion.div
            key="data"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Main Reading */}
            <GlassCard className="p-8 relative overflow-hidden" glow={data.level === "severe" ? "red" : data.level === "low" ? "green" : "cyan"}>
              <div
                className="absolute inset-0 opacity-10"
                style={{ background: `radial-gradient(circle at 50% 50%, ${config.color}, transparent 70%)` }}
              />
              <div className="relative text-center">
                <StatusBadge label={config.label} color={config.color} bg={config.bg} pulse size="lg" />
                <motion.div
                  className="text-8xl font-bold mt-6 mb-2"
                  style={{ color: config.color }}
                  key={data.aqi}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {data.aqi}
                </motion.div>
                <p className="text-foreground/40">Air Quality Index</p>
                <p className="text-foreground/20 text-xs mt-4">
                  Last updated: {new Date(data.timestamp).toLocaleTimeString()} •
                  Source: {data.updatedBy === "admin" ? "🔧 Admin Panel" : "System"}
                </p>
              </div>
            </GlassCard>

            {/* Individual Readings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "PM2.5", value: data.pm25, unit: "µg/m³", icon: "🫁", color: "#8b5cf6" },
                { label: "NO₂", value: data.no2, unit: "µg/m³", icon: "🏭", color: "#f59e0b" },
                { label: "O₃", value: data.o3, unit: "µg/m³", icon: "☀️", color: "#ef4444" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard className="p-6 text-center">
                    <span className="text-3xl">{item.icon}</span>
                    <p className="text-foreground/40 text-sm mt-2">{item.label}</p>
                    <motion.p
                      className="text-3xl font-bold mt-2"
                      style={{ color: item.color }}
                      key={item.value}
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {item.value}
                    </motion.p>
                    <p className="text-foreground/30 text-xs mt-1">{item.unit}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
