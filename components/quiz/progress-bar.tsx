"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ProgressBarProps = {
  currentStep: number;
  totalSteps?: number;
};

export function ProgressBar({ currentStep, totalSteps = 7 }: ProgressBarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const clamped = Math.min(Math.max(currentStep, 0), totalSteps);
  const percent = totalSteps > 0 ? (clamped / totalSteps) * 100 : 0;

  return (
    <div className="w-full">
      <div
        className="h-[3px] w-full overflow-hidden rounded-pill bg-black/8"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
      >
        {mounted ? (
          <motion.div
            className="h-full rounded-pill bg-olive"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ) : (
          <div
            className="h-full rounded-pill bg-olive"
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
      <p className="mt-2 text-[9px] uppercase tracking-[1px] text-text-muted">
        Шаг {clamped} из {totalSteps}
      </p>
    </div>
  );
}
