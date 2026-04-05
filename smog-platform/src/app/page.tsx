"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { getAqiLevel } from "@/lib/utils";
import { POLLUTANTS } from "@/lib/constants";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface AqiData {
  aqi: number;
  city: string;
  country: string;
  temperature: number | null;
  humidity: number | null;
  wind: number | null;
  components: Record<string, number>;
  forecast: { dt: number; aqi: number; pm2_5: number; no2: number; o3: number }[];
  timestamp: string;
  mock?: boolean;
}

export default function Dashboard() {
  const [data, setData] = useState<AqiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Auto-detect location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setCoords({ lat: 28.6139, lon: 77.209 }) // Default: Delhi
      );
    } else {
      setCoords({ lat: 28.6139, lon: 77.209 });
    }
  }, []);

  // Fetch AQI data
  const fetchData = useCallback(async () => {
    if (!coords) return;
    try {
      const res = await fetch(`/api/aqi?lat=${coords.lat}&lon=${coords.lon}`);
      const json = await res.json();
      setData(json);
    } catch {
      console.error("Failed to fetch AQI data");
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, [fetchData]);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const downloadPdfReport = async () => {
    setIsGeneratingPdf(true);
    try {
      const dashboardElement = document.getElementById("dashboard-content");
      if (!dashboardElement) return;

      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        backgroundColor: "#06080f",
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SmogIQ-Report-${data?.city || "Location"}-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading || !data) {
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

  const level = getAqiLevel(data.aqi);
  const pollutantKeys = Object.keys(POLLUTANTS) as (keyof typeof POLLUTANTS)[];

  // Prepare forecast chart data
  const chartData = data.forecast.map((f, i) => {
    const d = new Date(f.dt * 1000);
    return {
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", hour12: true }),
      aqi: f.aqi,
      pm25: f.pm2_5,
      no2: f.no2,
      o3: f.o3,
    };
  });

  // Pollutant bar chart data
  const pollutantData = pollutantKeys.map((key) => ({
    name: POLLUTANTS[key].name,
    value: data.components[key] || 0,
    safe: POLLUTANTS[key].safe,
    danger: POLLUTANTS[key].danger,
    fill: (data.components[key] || 0) > POLLUTANTS[key].danger
      ? "#ef4444"
      : (data.components[key] || 0) > POLLUTANTS[key].safe
      ? "#f59e0b"
      : "#10b981",
  }));

  return (
    <div className="p-4 md:p-8 space-y-6" id="dashboard-content">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Outfit" }}>
            <span className="text-gradient">Live AQI</span> Dashboard
          </h1>
          <p className="text-foreground/50 mt-1">
            📍 {data.city}, {data.country} • Updated {new Date(data.timestamp).toLocaleTimeString()}
            {data.mock && <span className="text-neon-yellow ml-2">(Demo Data)</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {data.temperature !== null && (
            <GlassCard className="px-4 py-2" hover={false}>
              <span className="text-foreground/50 text-sm">🌡️ {data.temperature}°C</span>
            </GlassCard>
          )}
          {data.humidity !== null && (
            <GlassCard className="px-4 py-2" hover={false}>
              <span className="text-foreground/50 text-sm">💧 {data.humidity}%</span>
            </GlassCard>
          )}
          <button
            onClick={downloadPdfReport}
            disabled={isGeneratingPdf}
            className="px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20 transition-all font-medium text-sm flex items-center gap-2"
          >
            {isGeneratingPdf ? "Generating..." : "📄 Download PDF"}
          </button>
        </div>
      </motion.div>

      {/* Main AQI Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6 md:p-8 relative overflow-hidden" glow="cyan">
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-10 rounded-2xl"
            style={{ background: `radial-gradient(circle at 30% 50%, ${level.color}, transparent 70%)` }}
          />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* AQI Circle */}
            <div className="relative">
              <svg width="180" height="180" viewBox="0 0 180 180">
                {/* Background circle */}
                <circle cx="90" cy="90" r="78" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                {/* Progress arc */}
                <motion.circle
                  cx="90" cy="90" r="78"
                  fill="none"
                  stroke={level.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.aqi / 500) * 490} 490`}
                  transform="rotate(-90 90 90)"
                  initial={{ strokeDasharray: "0 490" }}
                  animate={{ strokeDasharray: `${(data.aqi / 500) * 490} 490` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{ filter: `drop-shadow(0 0 8px ${level.color})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatedCounter value={data.aqi} className="text-5xl font-bold" suffix="" />
                <span className="text-foreground/40 text-sm mt-1">AQI</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                <StatusBadge label={level.label} color={level.color} bg={level.bg} pulse size="lg" />
                <span className="text-3xl">{level.emoji}</span>
              </div>
              <p className="text-foreground/60 max-w-md">
                {data.aqi <= 50
                  ? "Air quality is satisfactory. Enjoy your outdoor activities!"
                  : data.aqi <= 100
                  ? "Air quality is acceptable. Unusually sensitive people should limit prolonged outdoor exertion."
                  : data.aqi <= 200
                  ? "Members of sensitive groups may experience health effects. General public is less likely to be affected."
                  : "Health alert: Everyone may experience serious health effects. Limit outdoor exposure."}
              </p>
              {data.wind !== null && (
                <p className="text-foreground/40 text-sm mt-2">💨 Wind: {data.wind} m/s</p>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Pollutant Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {pollutantKeys.map((key, i) => {
          const pollutant = POLLUTANTS[key];
          const value = data.components[key] || 0;
          const severity = value > pollutant.danger ? "red" : value > pollutant.safe ? "cyan" : "green";
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <GlassCard className="p-4" glow={severity as "cyan" | "green" | "red"}>
                <div className="text-2xl mb-2">{pollutant.icon}</div>
                <p className="text-foreground/40 text-xs">{pollutant.name}</p>
                <AnimatedCounter
                  value={value}
                  decimals={1}
                  className="text-xl font-bold block mt-1"
                />
                <p className="text-foreground/30 text-[10px] mt-1">{pollutant.unit}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AQI Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Outfit" }}>
              📈 AQI Forecast (24h)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13,17,23,0.95)",
                    border: "1px solid rgba(56,189,248,0.2)",
                    borderRadius: "12px",
                    color: "#e8eaf0",
                  }}
                />
                <Area type="monotone" dataKey="aqi" stroke="#00e5ff" fill="url(#aqiGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Pollutant Levels Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Outfit" }}>
              🧪 Pollutant Levels
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pollutantData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13,17,23,0.95)",
                    border: "1px solid rgba(56,189,248,0.2)",
                    borderRadius: "12px",
                    color: "#e8eaf0",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pollutantData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Multi-pollutant Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Outfit" }}>
            📊 Pollutant Trends (24h)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="no2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="o3Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(13,17,23,0.95)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  borderRadius: "12px",
                  color: "#e8eaf0",
                }}
              />
              <Area type="monotone" dataKey="pm25" stroke="#8b5cf6" fill="url(#pm25Grad)" strokeWidth={2} name="PM2.5" />
              <Area type="monotone" dataKey="no2" stroke="#f59e0b" fill="url(#no2Grad)" strokeWidth={2} name="NO₂" />
              <Area type="monotone" dataKey="o3" stroke="#ef4444" fill="url(#o3Grad)" strokeWidth={2} name="O₃" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>
    </div>
  );
}
