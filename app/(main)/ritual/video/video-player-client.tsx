"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Pause, Play } from "lucide-react";

type Props = {
  title: string;
  durationSeconds: number;
  stepLabels: readonly string[];
  isExtra?: boolean;
};

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayerClient({
  title,
  durationSeconds,
  stepLabels,
  isExtra = false,
}: Props) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const finishedRef = useRef(false);
  const doneHref = isExtra ? "/ritual/done?extra=1" : "/ritual/done";

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= durationSeconds && !finishedRef.current) {
          finishedRef.current = true;
          window.setTimeout(() => router.push(doneHref), 0);
        }
        return Math.min(next, durationSeconds);
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, durationSeconds, router, doneHref]);

  const totalSteps = Math.max(1, stepLabels.length);
  const fraction = Math.min(1, elapsed / durationSeconds);
  const currentStep = Math.min(
    totalSteps,
    Math.floor(fraction * totalSteps) + 1,
  );
  const remaining = Math.max(0, durationSeconds - elapsed);

  function seek(delta: number) {
    finishedRef.current = false;
    setElapsed((prev) =>
      Math.max(0, Math.min(durationSeconds, prev + delta)),
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#1A1A18] text-cream">
      <div className="relative flex w-full max-w-app flex-col px-5 pb-10 pt-[max(env(safe-area-inset-top),1rem)]">
        <header className="flex items-center justify-between gap-3 pt-2">
          <Link
            href="/ritual"
            aria-label="Закрыть плеер"
            className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-pill text-cream/90 transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.6} aria-hidden />
          </Link>
          <div className="text-center text-[10px] text-cream/70">
            {title} · Шаг {currentStep} из {totalSteps}
          </div>
          <div className="flex h-10 w-10 items-center justify-center">
            <div className="flex flex-col gap-1" aria-hidden>
              <span className="h-[3px] w-[3px] rounded-pill bg-cream/80" />
              <span className="h-[3px] w-[3px] rounded-pill bg-cream/80" />
              <span className="h-[3px] w-[3px] rounded-pill bg-cream/80" />
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Пауза" : "Воспроизведение"}
            className="flex h-20 w-20 items-center justify-center rounded-pill text-cream/90 transition-colors hover:bg-white/5"
          >
            {playing ? (
              <Pause className="h-10 w-10" fill="currentColor" strokeWidth={0} />
            ) : (
              <Play
                className="h-10 w-10 translate-x-[2px]"
                fill="currentColor"
                strokeWidth={0}
              />
            )}
          </button>
        </div>

        <p className="text-center text-[12px] leading-snug text-cream/85">
          {stepLabels[currentStep - 1] ?? ""}
        </p>

        <div className="mt-8">
          <div className="relative h-[3px] w-full rounded-pill bg-white/15">
            <div
              className="absolute inset-y-0 left-0 rounded-pill bg-cream"
              style={{ width: `${fraction * 100}%` }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-pill bg-cream"
              style={{ left: `${fraction * 100}%` }}
              aria-hidden
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-cream/70">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(durationSeconds)}</span>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-7">
          <button
            type="button"
            onClick={() => seek(-10)}
            aria-label="Назад на 10 секунд"
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-white/45 text-[10px] text-cream/90 transition-colors hover:bg-white/10"
          >
            −10
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Пауза" : "Воспроизведение"}
            className="flex h-14 w-14 items-center justify-center rounded-pill bg-cream text-[#1A1A18] transition-transform active:scale-[0.97]"
          >
            {playing ? (
              <Pause className="h-6 w-6" fill="currentColor" strokeWidth={0} />
            ) : (
              <Play
                className="h-6 w-6 translate-x-[1px]"
                fill="currentColor"
                strokeWidth={0}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => seek(10)}
            aria-label="Вперёд на 10 секунд"
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-white/45 text-[10px] text-cream/90 transition-colors hover:bg-white/10"
          >
            +10
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-cream/55">
          осталось {formatTime(remaining)}
        </p>
      </div>
    </div>
  );
}
