"use client";

import { motion } from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  className?: string;
};

export default function AnimatedCounter({ value, className = "" }: AnimatedCounterProps) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.35, y: -2 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={className}
    >
      {value.toLocaleString("en-US")}
    </motion.span>
  );
}
