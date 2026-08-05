"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  value: number;
  max: number;
  size: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  children?: React.ReactNode;
};

// Обобщённое кольцо прогресса — параметризованная версия того же паттерна,
// что в components/home/progress-ring.tsx (которую не трогаем, чтобы не
// рисковать регрессией на Home). Используется там, где нужен другой размер
// или цветовая схема (ritual-home — 80px olive-on-white; achievements —
// 160px olive-on-dark).
export function RingProgress({
  value,
  max,
  size,
  strokeWidth = 6,
  trackColor = "rgba(0,0,0,0.08)",
  progressColor = "#7A8A4F",
  children,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const fraction = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const targetOffset = circumference * (1 - fraction);
  const center = size / 2;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {mounted ? (
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            transform={`rotate(-90 ${center} ${center})`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ) : (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={targetOffset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </svg>
      {children ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}
