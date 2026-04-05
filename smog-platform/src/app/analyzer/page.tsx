"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { CITIES } from "@/lib/constants";

interface AnalysisResult {
  city: string;
  risk: number;
  severity: string;
  color: string;
  warning: string;
  suggestions: { icon: string; text: string }[];
  factors: { traffic: number; temperature: number; windDispersion: number; humidity: number };
}

export default function AnalyzerPage() {
  const [city, setCity] = useState("Delhi");
  const [traffic, setTraffic] = useState(65);
  const [temperature, setTemperature] = useState(35);
  const [wind, setWind] = useState(8);
  const [humidity, setHumidity] = useState(55);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    setAnalyzing(true);
    setResult(null);

    // Simulate processing delay for realism
    await new Promise((r) => setTimeout(r, 1800));

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, traffic, temperature, wind, humidity }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      console.error("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Outfit" }}>
          <span className="text-gradient">AI Smog</span> Analyzer
        </h1>
        <p className="text-foreground/50 mt-1">
          Enter conditions and get an intelligent smog risk assessment
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* City Selection */}
          <GlassCard className="p-5">
            <label className="text-sm font-medium mb-3 block">🏙️ Select City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-foreground focus:border-neon-cyan focus:outline-none transition"
            >
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}, {c.country}</option>
              ))}
            </select>
          </GlassCard>

          {/* Traffic Level */}
          <GlassCard className="p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">🚗 Traffic Level</span>
              <span className="text-neon-orange font-bold">{traffic}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={traffic}
              onChange={(e) => setTraffic(Number(e.target.value))}
            />
          </GlassCard>

          {/* Temperature */}
          <GlassCard className="p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">🌡️ Temperature</span>
              <span className="text-neon-red font-bold">{temperature}°C</span>
            </div>
            <input
              type="range" min={0} max={50} value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
            />
          </GlassCard>

          {/* Wind Speed */}
          <GlassCard className="p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">💨 Wind Speed</span>
              <span className="text-neon-cyan font-bold">{wind} km/h</span>
            </div>
            <input
              type="range" min={0} max={40} value={wind}
              onChange={(e) => setWind(Number(e.target.value))}
            />
          </GlassCard>

          {/* Humidity */}
          <GlassCard className="p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">💧 Humidity</span>
              <span className="text-neon-blue font-bold">{humidity}%</span>
            </div>
            <input
              type="range" min={10} max={100} value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
            />
          </GlassCard>

          {/* Analyze Button */}
          <motion.button
            onClick={analyze}
            disabled={analyzing}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-neon-cyan to-neon-blue text-background disabled:opacity-50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                />
                Analyzing...
              </span>
            ) : (
              "🧠 Analyze Smog Risk"
            )}
          </motion.button>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <motion.div
                    className="w-32 h-32 rounded-full border-4 border-neon-cyan/20 relative"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-neon-cyan rounded-full" />
                  </motion.div>
                  <motion.p
                    className="text-foreground/50 mt-6 text-sm"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    Processing environmental data...
                  </motion.p>
                  <div className="flex gap-2 mt-4">
                    {["NOₓ", "VOCs", "UV", "Wind"].map((item, i) => (
                      <motion.span
                        key={item}
                        className="px-3 py-1 rounded-full text-[10px] glass text-foreground/40"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.3 }}
                      >
                        Scanning {item}...
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Risk Gauge */}
                <GlassCard className="p-6" glow={result.risk > 70 ? "red" : result.risk > 40 ? "cyan" : "green"}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold" style={{ fontFamily: "Outfit" }}>
                      Smog Risk Assessment
                    </h3>
                    <StatusBadge label={result.severity} color={result.color} pulse size="lg" />
                  </div>

                  {/* Risk Circle */}
                  <div className="flex justify-center my-6">
                    <div className="relative">
                      <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                        <motion.circle
                          cx="80" cy="80" r="70"
                          fill="none"
                          stroke={result.color}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${(result.risk / 100) * 440} 440`}
                          transform="rotate(-90 80 80)"
                          initial={{ strokeDasharray: "0 440" }}
                          animate={{ strokeDasharray: `${(result.risk / 100) * 440} 440` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          style={{ filter: `drop-shadow(0 0 6px ${result.color})` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold" style={{ color: result.color }}>{result.risk}%</span>
                        <span className="text-xs text-foreground/40">Risk Level</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-foreground/60 text-sm">{result.warning}</p>
                </GlassCard>

                {/* Contributing Factors */}
                <GlassCard className="p-5">
                  <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "Outfit" }}>📊 Contributing Factors</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Traffic Impact", value: result.factors.traffic, color: "#f97316" },
                      { label: "Temperature Effect", value: result.factors.temperature, color: "#ef4444" },
                      { label: "Wind Dispersion", value: result.factors.windDispersion, color: "#00e5ff" },
                      { label: "Humidity Factor", value: result.factors.humidity, color: "#3b82f6" },
                    ].map((f) => (
                      <div key={f.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground/50">{f.label}</span>
                          <span style={{ color: f.color }}>{f.value}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: f.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${f.value}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Suggestions */}
                <GlassCard className="p-5">
                  <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "Outfit" }}>💡 Recommendations</h3>
                  <div className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-border"
                      >
                        <span className="text-lg">{s.icon}</span>
                        <span className="text-sm text-foreground/70">{s.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                  <span className="text-6xl mb-4">🧠</span>
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "Outfit" }}>
                    Ready to Analyze
                  </h3>
                  <p className="text-foreground/40 max-w-sm">
                    Adjust the parameters on the left and hit &quot;Analyze&quot; to get an AI-powered smog risk assessment with personalized recommendations.
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
