"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "🌍", desc: "Live AQI" },
  { href: "/simulator", label: "Simulator", icon: "🧪", desc: "Smog Lab" },
  { href: "/analyzer", label: "Analyzer", icon: "🧠", desc: "AI Risk" },
  { href: "/sensor", label: "Sensor", icon: "🎮", desc: "Live Sensor" },
  { href: "/map", label: "City Map", icon: "📍", desc: "Hotspots" },
  { href: "/learn", label: "Learn", icon: "📚", desc: "Education" },
  { href: "/solutions", label: "Solutions", icon: "💡", desc: "Fix It" },
  { href: "/predict", label: "Predict", icon: "🎯", desc: "Forecast" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 glass-strong ${
          expanded ? "w-[260px]" : "w-[72px] lg:w-[260px]"
        }`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-border h-[72px]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center text-xl flex-shrink-0">
            ⚡
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0 lg:opacity-100 lg:w-auto"}`}>
            <h1 className="font-bold text-lg font-[family-name:var(--font-heading)] whitespace-nowrap" style={{ fontFamily: 'Outfit' }}>
              Smog<span className="text-neon-cyan">IQ</span>
            </h1>
            <p className="text-[10px] text-foreground/40 whitespace-nowrap">Intelligence Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setExpanded(false)}>
                <motion.div
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? "bg-neon-cyan/10 text-neon-cyan"
                      : "text-foreground/60 hover:text-foreground/90 hover:bg-white/[0.03]"
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-neon-cyan rounded-r-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="text-lg flex-shrink-0 w-7 text-center">{item.icon}</span>
                  <div className={`overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0 lg:opacity-100 lg:w-auto"}`}>
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    <p className="text-[10px] opacity-50 whitespace-nowrap">{item.desc}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-border ${expanded ? "block" : "hidden lg:block"}`}>
          <div className="glass rounded-xl p-3">
            <p className="text-[10px] text-foreground/40 text-center">Photochemical Smog</p>
            <p className="text-[10px] text-neon-cyan/60 text-center mt-1">Intelligence v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
