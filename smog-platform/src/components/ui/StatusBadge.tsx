"use client";

import { motion } from "framer-motion";

interface StatusBadgeProps {
  label: string;
  color: string;
  bg?: string;
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({ label, color, bg, pulse = false, size = "md" }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        color,
        backgroundColor: bg || `${color}20`,
        border: `1px solid ${color}30`,
      }}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: color }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: color }}
          />
        </span>
      )}
      {label}
    </motion.span>
  );
}
