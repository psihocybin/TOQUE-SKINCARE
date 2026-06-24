"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  currentDay: number;
  totalDays?: number;
};

const RADIUS = 50;
const STROKE = 6;
const SIZE = (RADIUS + STROKE) * 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({ currentDay, totalDays = 30 }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fraction = Math.max(0, Math.min(1, currentDay / totalDays));
  const targetOffset = CIRCUMFERENCE * (1 - fraction);
  const center = SIZE / 2;

  return (
    <div
      className="relative mx-auto"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden
      >
        <circle
          cx={center}
          cy={center}
          r={RADIUS}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={STROKE}
        />
        {mounted ? (
          <motion.circle
            cx={center}
            cy={center}
            r={RADIUS}
            fill="none"
            stroke="#7A8A4F"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            transform={`rotate(-90 ${center} ${center})`}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ) : (
          <circle
            cx={center}
            cy={center}
            r={RADIUS}
            fill="none"
            stroke="#7A8A4F"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={targetOffset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] tracking-[1px] text-text-muted">ДЕНЬ</span>
        <span className="leading-none text-[22px] text-text">{currentDay}</span>
        <span className="text-[9px] text-text-muted">из {totalDays}</span>
      </div>
    </div>
  );
}
