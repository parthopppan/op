"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { SOLUTIONS, CITIES } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function SolutionsPage() {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [evAdoption, setEvAdoption] = useState(30);
  const [trafficReduction, setTrafficReduction] = useState(20);
  const [greenCover, setGreenCover] = useState(15);
  const [delhiWithLAPolicies, setDelhiWithLAPolicies] = useState(false);

  const city = CITIES.find((c) => c.name === selectedCity) || CITIES[0];

  // Calculate projected improvements
  const noxReduction = Math.round(evAdoption * 0.4 + trafficReduction * 0.3 + greenCover * 0.1);
  const vocReduction = Math.round(evAdoption * 0.25 + trafficReduction * 0.15 + greenCover * 0.05);
  const smogReduction = Math.round((noxReduction + vocReduction) / 2);
  const projectedAqi = Math.max(15, Math.round(city.aqi * (1 - smogReduction / 100)));

  // What if Delhi had LA policies
  const delhiLAaqi = delhiWithLAPolicies ? Math.round(city.aqi * 0.3) : city.aqi;

  const impactData = [
    { metric: "NOₓ", current: 100, projected: 100 - noxReduction, color: "#f59e0b" },
    { metric: "VOCs", current: 100, projected: 100 - vocReduction, color: "#10b981" },
    { metric: "Smog", current: 100, projected: 100 - smogReduction, color: "#ef4444" },
    { metric: "AQI", current: city.aqi, projected: projectedAqi, color: "#8b5cf6" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Outfit" }}>
          <span className="text-gradient">Solution</span> Engine
        </h1>
        <p className="text-foreground/50 mt-1">Explore impact of different interventions on air quality</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* City Selector */}
          <GlassCard className="p-5">
            <label className="text-sm font-medium mb-3 block">🏙️ Select City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-foreground focus:border-neon-cyan focus:outline-none"
            >
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name} (AQI: {c.aqi})</option>
              ))}
            </select>
          </GlassCard>

          {/* EV Adoption */}
          <GlassCard className="p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">🔌 EV Adoption</span>
              <span className="text-neon-green font-bold">{evAdoption}%</span>
            </div>
            <input type="range" min={0} max={100} value={evAdoption} onChange={(e) => setEvAdoption(Number(e.target.value))} />
            <p className="text-[10px] text-foreground/30 mt-2">% of vehicles replaced with EVs</p>
          </GlassCard>

          {/* Traffic Reduction */}
          <GlassCard className="p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">🚦 Traffic Reduction</span>
              <span className="text-neon-cyan font-bold">{trafficReduction}%</span>
            </div>
            <input type="range" min={0} max={50} value={trafficReduction} onChange={(e) => setTrafficReduction(Number(e.target.value))} />
            <p className="text-[10px] text-foreground/30 mt-2">Via public transit, cycling, congestion pricing</p>
          </GlassCard>

          {/* Green Cover */}
          <GlassCard className="p-5">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">🌳 Green Cover Increase</span>
              <span className="text-neon-green font-bold">{greenCover}%</span>
            </div>
            <input type="range" min={0} max={40} value={greenCover} onChange={(e) => setGreenCover(Number(e.target.value))} />
            <p className="text-[10px] text-foreground/30 mt-2">Urban forest & green corridor expansion</p>
          </GlassCard>

          {/* Delhi vs LA Toggle */}
          {selectedCity === "Delhi" && (
            <GlassCard className="p-5" glow={delhiWithLAPolicies ? "purple" : "none"}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">🤔 What if Delhi had LA policies?</p>
                  <p className="text-[10px] text-foreground/30 mt-1">Simulate 50 years of regulation</p>
                </div>
                <button
                  onClick={() => setDelhiWithLAPolicies(!delhiWithLAPolicies)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    delhiWithLAPolicies ? "bg-neon-purple" : "bg-white/10"
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow"
                    animate={{ x: delhiWithLAPolicies ? 26 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* AQI Before/After */}
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-6 text-center" glow="red">
              <p className="text-foreground/40 text-sm">Current AQI</p>
              <p className="text-5xl font-bold text-red-400 mt-2">{delhiWithLAPolicies ? city.aqi : city.aqi}</p>
              <p className="text-foreground/30 text-xs mt-2">{city.name} today</p>
            </GlassCard>
            <GlassCard className="p-6 text-center" glow="green">
              <p className="text-foreground/40 text-sm">Projected AQI</p>
              <motion.p
                className="text-5xl font-bold text-green-400 mt-2"
                key={`${projectedAqi}-${delhiWithLAPolicies}`}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {delhiWithLAPolicies ? delhiLAaqi : projectedAqi}
              </motion.p>
              <p className="text-foreground/30 text-xs mt-2">
                {delhiWithLAPolicies ? "With LA-style regulation" : "With selected interventions"}
              </p>
            </GlassCard>
          </div>

          {/* Impact Chart */}
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Outfit" }}>
              📊 Pollution Reduction Impact
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="metric" tick={{ fill: "#ffffff40", fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13,17,23,0.95)",
                    border: "1px solid rgba(56,189,248,0.2)",
                    borderRadius: "12px",
                    color: "#e8eaf0",
                  }}
                />
                <Bar dataKey="current" name="Current" fill="rgba(239,68,68,0.5)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="projected" name="Projected" radius={[4, 4, 0, 0]}>
                  {impactData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Solution Cards */}
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Outfit" }}>💡 Available Solutions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SOLUTIONS.map((sol, i) => (
                <motion.div
                  key={sol.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-border hover:border-border-bright transition"
                >
                  <span className="text-2xl">{sol.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{sol.title}</p>
                    <p className="text-[11px] text-foreground/40 mt-1">{sol.description}</p>
                    <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">
                      {sol.impact}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
