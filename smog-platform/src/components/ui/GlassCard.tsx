"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  glow?: "cyan" | "blue" | "purple" | "green" | "red" | "none";
  hover?: boolean;
  className?: string;
}

const glowMap = {
  cyan: "glow-cyan",
  blue: "glow-blue",
  purple: "glow-purple",
  green: "glow-green",
  red: "glow-red",
  none: "",
};

export default function GlassCard({
  children,
  glow = "none",
  hover = true,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass ${glowMap[glow]} ${className}`}
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
