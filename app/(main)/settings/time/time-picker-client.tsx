"use client";

import { useState, useTransition } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateProgramSettings } from "@/lib/actions/settings";

type PreferredTime = "morning" | "evening" | "flexible";

type Props = {
  initialPreferred: PreferredTime;
};

const MINUTE_STEP = 15;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function defaultClockForChip(p: PreferredTime): { hour: number; minute: number } {
  if (p === "morning") return { hour: 9, minute: 0 };
  if (p === "evening") return { hour: 20, minute: 0 };
  return { hour: 12, minute: 0 };
}

export function TimePickerClient({ initialPreferred }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const initial = defaultClockForChip(initialPreferred);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [selectedChip, setSelectedChip] =
    useState<PreferredTime>(initialPreferred);

  function adjustHour(delta: number) {
    setHour((h) => (h + delta + HOURS_IN_DAY) % HOURS_IN_DAY);
  }
  function adjustMinute(delta: number) {
    setMinute((m) => {
      const next = m + delta * MINUTE_STEP;
      const normalized = ((next % MINUTES_IN_HOUR) + MINUTES_IN_HOUR) %
        MINUTES_IN_HOUR;
      return normalized;
    });
  }

  function applyChip(chip: PreferredTime) {
    setSelectedChip(chip);
    const c = defaultClockForChip(chip);
    setHour(c.hour);
    setMinute(c.minute);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const res = await updateProgramSettings({ preferredTime: selectedChip });
      if (!res.ok) {
        setError(res.error ?? "Не удалось сохранить");
        return;
      }
      // Полная перезагрузка вместо router.push+refresh: Server Component
      // /settings иначе может отдать устаревший Router Cache сразу после
      // сохранения (гонка между push и refresh). Так же решали signOut.
      window.location.href = "/settings";
    });
  }

  const prevHour = (hour - 1 + HOURS_IN_DAY) % HOURS_IN_DAY;
  const nextHour = (hour + 1) % HOURS_IN_DAY;
  const prevMinute =
    ((minute - MINUTE_STEP) % MINUTES_IN_HOUR + MINUTES_IN_HOUR) %
    MINUTES_IN_HOUR;
  const nextMinute = (minute + MINUTE_STEP) % MINUTES_IN_HOUR;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="mt-14 flex flex-col items-center">
          <div className="flex w-full max-w-[260px] justify-center text-[14px] text-text opacity-20">
            <span className="w-[80px] text-center">{pad(prevHour)}</span>
            <span className="w-[20px] text-center">:</span>
            <span className="w-[80px] text-center">{pad(prevMinute)}</span>
          </div>

          <div className="mt-2 flex w-full max-w-[260px] items-center justify-center gap-3 rounded-lg bg-olive/[0.08] py-6">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => adjustHour(1)}
                aria-label="Час +1"
                className="rounded-pill p-1 text-text-muted transition-colors hover:bg-black/[0.05]"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
              <span className="text-[32px] leading-none text-text">
                {pad(hour)}
              </span>
              <button
                type="button"
                onClick={() => adjustHour(-1)}
                aria-label="Час -1"
                className="rounded-pill p-1 text-text-muted transition-colors hover:bg-black/[0.05]"
              >
                <Minus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <span className="text-[32px] text-text">:</span>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => adjustMinute(1)}
                aria-label={`Минута +${MINUTE_STEP}`}
                className="rounded-pill p-1 text-text-muted transition-colors hover:bg-black/[0.05]"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
              <span className="text-[32px] leading-none text-text">
                {pad(minute)}
              </span>
              <button
                type="button"
                onClick={() => adjustMinute(-1)}
                aria-label={`Минута -${MINUTE_STEP}`}
                className="rounded-pill p-1 text-text-muted transition-colors hover:bg-black/[0.05]"
              >
                <Minus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>

          <div className="mt-2 flex w-full max-w-[260px] justify-center text-[14px] text-text opacity-20">
            <span className="w-[80px] text-center">{pad(nextHour)}</span>
            <span className="w-[20px] text-center">:</span>
            <span className="w-[80px] text-center">{pad(nextMinute)}</span>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
            Быстрый выбор
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["morning", "evening", "flexible"] as const).map((chip) => {
              const labels: Record<PreferredTime, string> = {
                morning: "Утром",
                evening: "Вечером",
                flexible: "Гибко",
              };
              const isSelected = selectedChip === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => applyChip(chip)}
                  className={cn(
                    "rounded-pill border px-4 py-2 text-[11px] transition-colors",
                    isSelected
                      ? "border-olive bg-olive/[0.08] text-text"
                      : "border-black/12 bg-white text-text-muted hover:border-black/25",
                  )}
                >
                  {labels[chip]}
                </button>
              );
            })}
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-[10px] text-rose">{error}</p>
        ) : null}
      </div>

      <div className="sticky bottom-0 bg-cream px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3">
        <Button
          onClick={handleSave}
          disabled={pending}
          className="h-12 w-full"
        >
          {pending ? "Сохраняем…" : "Сохранить"}
        </Button>
      </div>
    </div>
  );
}
