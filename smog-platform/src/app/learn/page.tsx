"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import {
  SMOG_DEFINITION, REACTION_STEPS, CAUSES,
  HEALTH_EFFECTS, ENVIRONMENTAL_EFFECTS,
} from "@/lib/constants";

const TABS = [
  { id: "overview", label: "Overview", icon: "🌐" },
  { id: "mechanism", label: "Mechanism", icon: "⚗️" },
  { id: "causes", label: "Causes", icon: "🏭" },
  { id: "effects", label: "Effects", icon: "🫁" },
  { id: "casestudies", label: "Case Studies", icon: "📋" },
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Outfit" }}>
          <span className="text-gradient">Interactive</span> Education Center
        </h1>
        <p className="text-foreground/50 mt-1">Everything about photochemical smog — visually explained</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap gap-2"
      >
        {TABS.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                : "glass text-foreground/50 hover:text-foreground/80"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Definition Card */}
            <GlassCard className="p-8" glow="cyan">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Outfit" }}>
                {SMOG_DEFINITION.title}
              </h2>
              <div className="bg-black/30 rounded-xl p-4 mb-4">
                <code className="text-lg text-neon-cyan font-mono">{SMOG_DEFINITION.formula}</code>
              </div>
              <p className="text-foreground/60 leading-relaxed">{SMOG_DEFINITION.description}</p>
            </GlassCard>

            {/* Key Facts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "☀️", title: "UV Dependent", desc: "Photochemical smog requires sunlight to form, peaking during midday hours" },
                { icon: "🌡️", title: "Temperature Sensitive", desc: "Higher temperatures accelerate the chemical reactions that create smog" },
                { icon: "🏙️", title: "Urban Phenomenon", desc: "Most common in cities with high traffic density and industrial activity" },
              ].map((fact, i) => (
                <motion.div
                  key={fact.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <GlassCard className="p-5 h-full">
                    <span className="text-3xl">{fact.icon}</span>
                    <h3 className="font-semibold mt-3 mb-2" style={{ fontFamily: "Outfit" }}>{fact.title}</h3>
                    <p className="text-sm text-foreground/50">{fact.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Smog Components */}
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Outfit" }}>🧪 What&apos;s in Photochemical Smog?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "O₃ (Ozone)", pct: "40%", color: "#8b5cf6", desc: "Ground-level ozone — primary irritant" },
                  { name: "PAN", pct: "25%", color: "#ec4899", desc: "Peroxyacetyl nitrate — eye & lung irritant" },
                  { name: "Aldehydes", pct: "20%", color: "#f59e0b", desc: "Formaldehyde & others — carcinogenic" },
                  { name: "NO₂", pct: "15%", color: "#ef4444", desc: "Nitrogen dioxide — brown haze" },
                ].map((comp) => (
                  <div key={comp.name} className="p-4 rounded-xl bg-white/[0.02] border border-border text-center">
                    <span className="text-2xl font-bold" style={{ color: comp.color }}>{comp.pct}</span>
                    <p className="text-sm font-medium mt-2">{comp.name}</p>
                    <p className="text-[10px] text-foreground/30 mt-1">{comp.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "mechanism" && (
          <motion.div key="mechanism" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <GlassCard className="p-6" hover={false}>
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Outfit" }}>⚗️ Photochemical Reaction Mechanism</h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink" />

                {REACTION_STEPS.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="relative pl-16 pb-8 last:pb-0"
                  >
                    {/* Step number */}
                    <div
                      className="absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: step.color + "20", color: step.color, border: `2px solid ${step.color}40` }}
                    >
                      {step.step}
                    </div>

                    <GlassCard className="p-5">
                      <code className="text-lg font-mono font-bold block mb-2" style={{ color: step.color }}>
                        {step.equation}
                      </code>
                      <p className="text-foreground/60 text-sm">{step.description}</p>

                      {/* Visual representation */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {step.equation.split(" ").map((part, j) => (
                          <span
                            key={j}
                            className={`px-2 py-1 rounded text-xs ${
                              ["→", "+"].includes(part)
                                ? "text-foreground/30"
                                : "bg-white/5 border border-border font-mono"
                            }`}
                            style={!["→", "+"].includes(part) ? { color: step.color } : {}}
                          >
                            {part}
                          </span>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Summary */}
            <GlassCard className="p-5 border border-neon-cyan/20" glow="cyan">
              <p className="text-sm text-foreground/60">
                <span className="text-neon-cyan font-semibold">Key insight:</span> The reaction is a cycle — NO₂ is continuously regenerated, creating a self-sustaining loop that produces more O₃ and PAN as long as sunlight and VOCs are present.
              </p>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "causes" && (
          <motion.div key="causes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAUSES.map((cause, i) => (
                <motion.div
                  key={cause.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 h-full">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{cause.icon}</span>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ fontFamily: "Outfit" }}>{cause.title}</h3>
                        <p className="text-foreground/50 text-sm mt-2">{cause.description}</p>
                        <div className="mt-3 inline-block px-3 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
                          <span className="text-xs text-neon-cyan font-medium">{cause.stat}</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "effects" && (
          <motion.div key="effects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Health Effects */}
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Outfit" }}>🏥 Health Effects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HEALTH_EFFECTS.map((effect, i) => (
                  <motion.div
                    key={effect.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className="p-5 h-full" glow={effect.severity === "Critical" ? "red" : "none"}>
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{effect.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{effect.title}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              effect.severity === "Critical" ? "bg-red-500/20 text-red-400" :
                              effect.severity === "Severe" ? "bg-orange-500/20 text-orange-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {effect.severity}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/50 mt-1">{effect.description}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Environmental Effects */}
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Outfit" }}>🌍 Environmental Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ENVIRONMENTAL_EFFECTS.map((effect, i) => (
                  <motion.div
                    key={effect.title}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className="p-5 h-full">
                      <span className="text-3xl">{effect.icon}</span>
                      <h3 className="font-semibold mt-2">{effect.title}</h3>
                      <p className="text-sm text-foreground/50 mt-1">{effect.description}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "casestudies" && (
          <motion.div key="casestudies" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit" }}>📋 Delhi vs Los Angeles — A Comparative Timeline</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Delhi */}
              <GlassCard className="p-6" glow="red">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🇮🇳</span>
                  <div>
                    <h3 className="text-xl font-bold text-red-400" style={{ fontFamily: "Outfit" }}>Delhi, India</h3>
                    <p className="text-foreground/40 text-sm">Avg AQI: 250-400+</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { year: "2010", event: "Vehicle count crosses 7 million, NOₓ emissions surge", color: "#f59e0b" },
                    { year: "2015", event: "WHO declares Delhi the most polluted city globally", color: "#ef4444" },
                    { year: "2017", event: "Schools closed multiple times due to hazardous AQI (999+)", color: "#dc2626" },
                    { year: "2019", event: "Public health emergency declared, Odd-Even scheme implemented", color: "#ef4444" },
                    { year: "2022", event: "Stubble burning + Diwali pushes AQI beyond 500 (off-scale)", color: "#7f1d1d" },
                    { year: "2024", event: "EV adoption beginning, but still 15M+ vehicles on road", color: "#f97316" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="w-12 text-xs font-mono font-bold" style={{ color: item.color }}>{item.year}</div>
                      <div className="flex-1 text-sm text-foreground/60 border-l-2 pl-3" style={{ borderColor: item.color + "40" }}>
                        {item.event}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-400">⚠️ Key issues: Vehicle density, stubble burning, industrial emissions, low wind corridors</p>
                </div>
              </GlassCard>

              {/* Los Angeles */}
              <GlassCard className="p-6" glow="green">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🇺🇸</span>
                  <div>
                    <h3 className="text-xl font-bold text-green-400" style={{ fontFamily: "Outfit" }}>Los Angeles, USA</h3>
                    <p className="text-foreground/40 text-sm">Avg AQI: 40-80</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { year: "1943", event: "First major smog event — 'gas attack' feared by residents", color: "#ef4444" },
                    { year: "1970", event: "Clean Air Act passed — strict emissions standards introduced", color: "#f59e0b" },
                    { year: "1990", event: "Catalytic converters mandatory, AQI improves significantly", color: "#10b981" },
                    { year: "2005", event: "CARB tightens diesel truck regulations", color: "#10b981" },
                    { year: "2015", event: "EV incentives + renewable energy mandates accelerate cleanup", color: "#10b981" },
                    { year: "2024", event: "70% reduction in smog days since 1970s, EV adoption leads US", color: "#059669" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="w-12 text-xs font-mono font-bold" style={{ color: item.color }}>{item.year}</div>
                      <div className="flex-1 text-sm text-foreground/60 border-l-2 pl-3" style={{ borderColor: item.color + "40" }}>
                        {item.event}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-green-400">✅ Success: Regulation + technology + public awareness = 70% improvement</p>
                </div>
              </GlassCard>
            </div>

            {/* Lesson */}
            <GlassCard className="p-5" glow="purple">
              <h3 className="font-semibold mb-2" style={{ fontFamily: "Outfit" }}>💡 Key Takeaway</h3>
              <p className="text-foreground/60 text-sm">
                Los Angeles proves that photochemical smog is <span className="text-neon-cyan font-medium">reversible</span> with proper regulation, technology adoption, and sustained effort. Delhi has the potential to achieve similar improvements by adopting aggressive EV policies, eliminating stubble burning, and expanding public transit infrastructure.
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
