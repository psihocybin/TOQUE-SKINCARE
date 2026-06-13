"use client";

import { motion } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.35,
  y = 8,
  className,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
