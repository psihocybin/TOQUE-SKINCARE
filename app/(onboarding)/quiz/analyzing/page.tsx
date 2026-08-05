"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

type Stage = { label: string; start: number; duration: number };

const STAGES: Stage[] = [
  { label: "Определяем тип ухода", start: 0, duration: 1200 },
  { label: "Подбираем режимы процедур", start: 1200, duration: 1000 },
  { label: "Составляем 30-дневное расписание", start: 2200, duration: 1000 },
  { label: "Настраиваем советы дня", start: 3200, duration: 800 },
  { label: "Финализируем программу", start: 4000, duration: 800 },
];

const TOTAL_MS = 4800;
const UGC_APPEAR_AT = 1500;

export default function QuizAnalyzingPage() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 50);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (elapsed < TOTAL_MS) return;
    router.push("/quiz/done");
  }, [elapsed, router]);

  return (
    <div className="flex min-h-screen flex-col px-5 pb-10">
      <h1 className="mt-12 text-center text-2xl font-bold text-text">
        Составляем программу…
      </h1>

      <div className="mt-10 flex flex-col gap-5">
        {STAGES.map((stage) => {
          const end = stage.start + stage.duration;
          const isDone = elapsed >= end;
          const isActive = elapsed >= stage.start && elapsed < end;
          const progress = Math.min(
            1,
            Math.max(0, (elapsed - stage.start) / stage.duration),
          );

          return (
            <div key={stage.label} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm",
                    isDone || isActive ? "text-text" : "text-text-muted",
                  )}
                >
                  {stage.label}
                </p>
                <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-black/8">
                  <div
                    className="h-full rounded-full bg-olive"
                    style={{ width: `${(isDone ? 1 : progress) * 100}%` }}
                  />
                </div>
              </div>
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center"
                aria-hidden
              >
                {isDone ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-olive"
                  >
                    <CheckCircle
                      className="h-3.5 w-3.5 text-white"
                      strokeWidth={2}
                    />
                  </motion.span>
                ) : null}
              </span>
            </div>
          );
        })}
      </div>

      {elapsed >= UGC_APPEAR_AT ? (
        <FadeIn duration={0.4} className="mt-10">
          <div className="mx-4 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-[13px] text-text">
              Нам доверяют тысячи клиенток
            </p>
            <div className="mt-1.5 flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-olive text-olive"
                  strokeWidth={0}
                />
              ))}
            </div>
            <p className="mt-3 text-[12px] italic leading-relaxed text-text-muted">
              «Через 3 недели подруги спросили что я делаю с кожей. Ответила
              честно.»
            </p>
            <p className="mt-2 text-[10px] text-text-muted">
              Покупатель на Wildberries
            </p>
          </div>
        </FadeIn>
      ) : null}
    </div>
  );
}
