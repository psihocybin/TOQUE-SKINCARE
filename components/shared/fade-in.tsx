"use client";

import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className={className}>{children}</div>;

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
