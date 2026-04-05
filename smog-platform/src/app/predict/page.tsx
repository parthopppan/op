"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { getAqiLevel } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

interface PredictionData {
  hour: number;
  label: string;
  aqi: number;
  pm2_5: number;
  no2: number;
  o3: number;
}

export default function PredictPage() {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("loading");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setCoords({ lat: 28.6139, lon: 77.209 })
      );
    } else {
      setCoords({ lat: 28.6139, lon: 77.209 });
    }
  }, []);

  const fetchPredictions = useCallback(async () => {
    if (!coords) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/predict?lat=${coords.lat}&lon=${coords.lon}`);
      const data = await res.json();
      setPredictions(data.predictions);
      setSource(data.source);
    } catch {
      console.error("Failed to fetch predictions");
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const peakAqi = predictions.length > 0 ? Math.max(...predictions.map((p) => p.aqi)) : 0;
  const minAqi = predictions.length > 0 ? Math.min(...predictions.map((p) => p.aqi)) : 0;
  const avgAqi = predictions.length > 0 ? Math.round(predictions.reduce((s, p) => s + p.aqi, 0) / predictions.length) : 0;
  const peakHour = predictions.find((p) => p.aqi === peakAqi);

  // Color-coded chart data
  const chartData = predictions.map((p) => ({
    ...p,
    fillColor: getAqiLevel(p.aqi).color,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 rounded-full border-2 border-neon-cyan border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Outfit" }}>
          <span className="text-gradient">AQI Prediction</span> Engine
        </h1>
        <p className="text-foreground/50 mt-1">
          24-hour air quality forecast •
          Source: {source === "openweather" ? "🌐 OpenWeather API" : "🤖 Predictive Model"}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Current AQI", value: predictions[0]?.aqi || 0, icon: "🌡️", color: getAqiLevel(predictions[0]?.aqi || 0).color },
          { label: "Peak (24h)", value: peakAqi, icon: "📈", color: getAqiLevel(peakAqi).color },
          { label: "Low (24h)", value: minAqi, icon: "📉", color: getAqiLevel(minAqi).color },
          { label: "Average", value: avgAqi, icon: "📊", color: getAqiLevel(avgAqi).color },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground/40 text-sm">{stat.label}</span>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <AnimatedCounter
                value={stat.value}
                className="text-3xl font-bold"
              />
              <StatusBadge
                label={getAqiLevel(stat.value).label}
                color={stat.color}
                size="sm"
              />
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Main Prediction Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Outfit" }}>
            🎯 24-Hour AQI Forecast
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#ffffff40", fontSize: 11 }}
                axisLine={false}
                interval={2}
              />
              <YAxis tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(13,17,23,0.95)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  borderRadius: "12px",
                  color: "#e8eaf0",
                }}
                formatter={(value: number) => [
                  `${value} (${getAqiLevel(value).label})`,
                  "AQI",
                ]}
              />
              {/* AQI threshold lines */}
              <ReferenceLine y={50} stroke="#10b981" strokeDasharray="5 5" strokeOpacity={0.3} />
              <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="5 5" strokeOpacity={0.3} />
              <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.3} />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#00e5ff"
                fill="url(#predGrad)"
                strokeWidth={2.5}
                dot={{ fill: "#00e5ff", r: 3 }}
                activeDot={{ r: 6, fill: "#00e5ff", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {[
              { label: "Good (<50)", color: "#10b981" },
              { label: "Moderate (<100)", color: "#f59e0b" },
              { label: "Unhealthy (<200)", color: "#ef4444" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-6 h-[2px]" style={{ backgroundColor: l.color, opacity: 0.5 }} />
                <span className="text-[10px] text-foreground/40">{l.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Pollutant Forecasts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { key: "pm2_5" as const, label: "PM2.5 Forecast", color: "#8b5cf6", icon: "🫁" },
          { key: "no2" as const, label: "NO₂ Forecast", color: "#f59e0b", icon: "🏭" },
          { key: "o3" as const, label: "O₃ Forecast", color: "#ef4444", icon: "☀️" },
        ].map((pollutant, idx) => (
          <motion.div
            key={pollutant.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
          >
            <GlassCard className="p-4" hover={false}>
              <h3 className="text-sm font-semibold mb-3">
                {pollutant.icon} {pollutant.label}
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={predictions}>
                  <defs>
                    <linearGradient id={`grad-${pollutant.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={pollutant.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={pollutant.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" hide />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey={pollutant.key}
                    stroke={pollutant.color}
                    fill={`url(#grad-${pollutant.key})`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Peak Warning */}
      {peakAqi > 100 && peakHour && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-5 border border-red-500/20" glow="red">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-400">Peak Pollution Alert</p>
                <p className="text-sm text-foreground/50 mt-1">
                  AQI is expected to reach <strong className="text-red-400">{peakAqi}</strong> at{" "}
                  <strong className="text-foreground/80">{peakHour.label}</strong>.
                  Consider staying indoors and using air purifiers during this period.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
