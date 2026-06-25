"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { WeeklyStat } from "@/lib/queries/procedures";

type Props = {
  stats: WeeklyStat[];
  currentWeek: number;
};

const MAX_BAR_HEIGHT = 56;
const MIN_BAR_HEIGHT = 6;
const SCALE_MAX_VALUE = 7;

export function WeeklyBars({ stats, currentWeek }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      <div className="mt-4 grid grid-cols-4 items-end border-b border-black/10 pb-0">
        {stats.map((s, i) => {
          const ratio = Math.min(1, s.count / SCALE_MAX_VALUE);
          const targetHeight =
            s.count === 0
              ? MIN_BAR_HEIGHT
              : Math.max(MIN_BAR_HEIGHT, Math.round(ratio * MAX_BAR_HEIGHT));
          const isFuture = s.week > currentWeek;
          const isEmpty = s.count === 0;

          return (
            <div
              key={s.week}
              className="flex h-16 flex-col items-center justify-end"
            >
              {mounted ? (
                <motion.div
                  className={cn(
                    "w-[22px] rounded-[3px] bg-olive",
                    (isFuture || isEmpty) && "opacity-40",
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: targetHeight }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ) : (
                <div
                  className={cn(
                    "w-[22px] rounded-[3px] bg-olive",
                    (isFuture || isEmpty) && "opacity-40",
                  )}
                  style={{ height: targetHeight }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid grid-cols-4">
        {stats.map((s) => (
          <span
            key={s.week}
            className="text-center text-[8px] text-text-muted"
          >
            Нед.{s.week}
          </span>
        ))}
      </div>
    </div>
  );
}
