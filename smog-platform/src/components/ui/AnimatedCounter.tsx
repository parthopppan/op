"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1.5,
  decimals = 0,
  className = "",
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (latest) => {
    return `${prefix}${latest.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const [text, setText] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    const unsub = display.on("change", (v) => setText(v));
    return unsub;
  }, [display]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {text}
    </motion.span>
  );
}
