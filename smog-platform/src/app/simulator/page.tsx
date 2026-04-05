"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { REACTION_STEPS } from "@/lib/constants";

// Particle type for the reaction visualizer
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "NO2" | "O" | "O2" | "O3" | "VOC" | "PAN" | "UV";
  radius: number;
  life: number;
}

const PARTICLE_COLORS: Record<string, string> = {
  NO2: "#f59e0b",
  O: "#ef4444",
  O2: "#3b82f6",
  O3: "#8b5cf6",
  VOC: "#10b981",
  PAN: "#ec4899",
  UV: "#fbbf24",
};

export default function SimulatorPage() {
  const [nox, setNox] = useState(50);
  const [voc, setVoc] = useState(40);
  const [sunlight, setSunlight] = useState(60);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const nextIdRef = useRef(0);

  // Calculate ozone output
  const ozoneOutput = Math.round(((nox * 0.4 + voc * 0.35 + sunlight * 0.25) / 100) * 280);
  const panOutput = Math.round(((voc * 0.5 + nox * 0.3 + sunlight * 0.2) / 100) * 120);
  const smogIntensity = Math.round((ozoneOutput / 280 + panOutput / 120) / 2 * 100);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Spawn particles based on slider values
    const spawnInterval = setInterval(() => {
      const particles = particlesRef.current;
      // NOx particles
      for (let i = 0; i < Math.floor(nox / 20); i++) {
        particles.push({
          id: nextIdRef.current++,
          x: Math.random() * w * 0.3,
          y: Math.random() * h,
          vx: 0.5 + Math.random() * 1.5,
          vy: (Math.random() - 0.5) * 0.8,
          type: "NO2",
          radius: 4 + Math.random() * 3,
          life: 200 + Math.random() * 100,
        });
      }
      // VOC particles
      for (let i = 0; i < Math.floor(voc / 25); i++) {
        particles.push({
          id: nextIdRef.current++,
          x: Math.random() * w * 0.3,
          y: Math.random() * h,
          vx: 0.3 + Math.random() * 1,
          vy: (Math.random() - 0.5) * 0.5,
          type: "VOC",
          radius: 3 + Math.random() * 2,
          life: 180 + Math.random() * 80,
        });
      }
      // UV particles from top
      if (sunlight > 20) {
        for (let i = 0; i < Math.floor(sunlight / 30); i++) {
          particles.push({
            id: nextIdRef.current++,
            x: w * 0.3 + Math.random() * w * 0.4,
            y: 0,
            vx: (Math.random() - 0.5) * 0.3,
            vy: 1 + Math.random() * 2,
            type: "UV",
            radius: 2,
            life: 100,
          });
        }
      }
    }, 200);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;

      // Check collisions and create ozone
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Collision: NO2 + UV → products
        if (p.type === "NO2" && sunlight > 30) {
          for (let j = particles.length - 1; j >= 0; j--) {
            if (i === j) continue;
            const q = particles[j];
            if (q.type === "UV") {
              const dx = p.x - q.x;
              const dy = p.y - q.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 15) {
                // Create O3
                particles.push({
                  id: nextIdRef.current++,
                  x: (p.x + q.x) / 2,
                  y: (p.y + q.y) / 2,
                  vx: 0.5 + Math.random(),
                  vy: (Math.random() - 0.5) * 0.5,
                  type: "O3",
                  radius: 5 + Math.random() * 3,
                  life: 150,
                });
                p.life = 0;
                q.life = 0;
                break;
              }
            }
          }
        }

        // VOC + O3 → PAN
        if (p.type === "VOC") {
          for (let j = particles.length - 1; j >= 0; j--) {
            if (i === j) continue;
            const q = particles[j];
            if (q.type === "O3") {
              const dx = p.x - q.x;
              const dy = p.y - q.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 12) {
                particles.push({
                  id: nextIdRef.current++,
                  x: (p.x + q.x) / 2,
                  y: (p.y + q.y) / 2,
                  vx: 0.3 + Math.random() * 0.5,
                  vy: (Math.random() - 0.5) * 0.3,
                  type: "PAN",
                  radius: 6,
                  life: 200,
                });
                p.life = 0;
                q.life = 0;
                break;
              }
            }
          }
        }

        // Remove dead particles
        if (p.life <= 0 || p.x > w + 20 || p.x < -20 || p.y > h + 20 || p.y < -20) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        const alpha = Math.min(1, p.life / 50);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const color = PARTICLE_COLORS[p.type] || "#ffffff";
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label for larger particles
        if (p.radius > 4 && p.life > 30) {
          ctx.font = "8px Inter";
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.7})`;
          ctx.textAlign = "center";
          ctx.fillText(p.type, p.x, p.y - p.radius - 3);
        }
      }

      // Keep particles array manageable
      if (particles.length > 300) {
        particles.splice(0, particles.length - 200);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [nox, voc, sunlight]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Outfit" }}>
          <span className="text-gradient">Smog Formation</span> Simulator
        </h1>
        <p className="text-foreground/50 mt-1">
          Adjust precursors and watch photochemical reactions in real-time
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* NOx Slider */}
          <GlassCard className="p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">🏭 NOₓ Level</span>
              <span className="text-neon-yellow font-bold">{nox}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={nox}
              onChange={(e) => setNox(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-foreground/30 mt-2">Nitrogen oxides from vehicles & industry</p>
          </GlassCard>

          {/* VOC Slider */}
          <GlassCard className="p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">🧪 VOC Level</span>
              <span className="text-neon-green font-bold">{voc}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={voc}
              onChange={(e) => setVoc(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-foreground/30 mt-2">Volatile Organic Compounds from solvents & fuels</p>
          </GlassCard>

          {/* Sunlight Slider */}
          <GlassCard className="p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">☀️ Sunlight Intensity</span>
              <span className="text-neon-cyan font-bold">{sunlight}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={sunlight}
              onChange={(e) => setSunlight(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-foreground/30 mt-2">UV radiation intensity driving photolysis</p>
          </GlassCard>

          {/* Output Summary */}
          <GlassCard className="p-5" glow={smogIntensity > 70 ? "red" : smogIntensity > 40 ? "cyan" : "green"}>
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "Outfit" }}>⚗️ Reaction Output</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground/50 text-sm">O₃ (Ozone)</span>
                <span className="font-bold text-purple-400">{ozoneOutput} ppb</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-300"
                  animate={{ width: `${(ozoneOutput / 280) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50 text-sm">PAN</span>
                <span className="font-bold text-pink-400">{panOutput} ppb</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 to-pink-300"
                  animate={{ width: `${(panOutput / 120) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-foreground/50 text-sm">Smog Intensity</span>
                  <span className="font-bold" style={{ color: smogIntensity > 70 ? "#ef4444" : smogIntensity > 40 ? "#f59e0b" : "#10b981" }}>
                    {smogIntensity}%
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Reaction Visualizer (Canvas) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-4 relative overflow-hidden" hover={false}>
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "Outfit" }}>
              🔬 Photochemical Reaction Chamber
            </h3>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-3">
              {Object.entries(PARTICLE_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-foreground/50">{name}</span>
                </div>
              ))}
            </div>
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl bg-black/30"
              style={{ height: "400px" }}
            />
            {/* Sunlight indicator */}
            <div
              className="absolute top-20 right-8 w-20 h-20 rounded-full transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle, rgba(251,191,36,${sunlight / 150}) 0%, transparent 70%)`,
                opacity: sunlight / 100,
              }}
            />
          </GlassCard>

          {/* Reaction Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {REACTION_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <GlassCard className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: step.color + "20", color: step.color }}
                    >
                      {step.step}
                    </div>
                    <div>
                      <code className="text-sm font-mono" style={{ color: step.color }}>
                        {step.equation}
                      </code>
                      <p className="text-[11px] text-foreground/40 mt-1">{step.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
