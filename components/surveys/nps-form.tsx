"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { postponeNps, submitNps } from "@/lib/actions/surveys";

type Props = {
  greetingName: string;
};

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function NpsForm({ greetingName }: Props) {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, startSubmit] = useTransition();
  const [postponing, startPostpone] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const greeting = greetingName.trim()
    ? `${greetingName.trim()}, подведём итог.`
    : "Подведём итог.";

  function handleSubmit() {
    if (score === null || submitting) return;
    setError(null);
    const trimmed = comment.trim();
    startSubmit(async () => {
      try {
        await submitNps({ score, comment: trimmed || undefined });
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Не удалось отправить",
        );
      }
    });
  }

  function handlePostpone() {
    if (postponing) return;
    setError(null);
    startPostpone(async () => {
      try {
        await postponeNps();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Не удалось перенести",
        );
      }
    });
  }

  return (
    <div className="px-5">
      <p className="text-center text-[11px] text-text-muted">Месяц с TOQUE</p>

      <div className="mt-10 flex flex-col items-center">
        <div
          className="flex h-20 w-20 flex-col items-center justify-center rounded-pill bg-olive/10"
          aria-hidden
        >
          <span className="text-[9px] tracking-[1px] text-text-muted">
            ДЕНЬ
          </span>
          <span className="text-[24px] leading-none text-text">30</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[15px] text-text">{greeting}</p>
        <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
          Насколько вероятно, что вы порекомендуете TOQUE подруге?
        </p>
      </div>

      <div
        className="mt-7 flex items-center justify-between gap-1"
        role="radiogroup"
        aria-label="Оценка от 0 до 10"
      >
        {SCORES.map((s) => {
          const isSelected = score === s;
          return (
            <motion.button
              key={s}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setScore(s)}
              animate={{ scale: isSelected ? 1.12 : 1 }}
              transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
              className={cn(
                "flex h-[22px] w-[22px] items-center justify-center rounded-pill text-[10px] transition-colors",
                isSelected
                  ? "bg-olive text-cream"
                  : "border border-black/10 bg-cream-dark text-text-muted",
              )}
            >
              {s}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between px-1 text-[8px] text-text-muted">
        <span>Точно нет</span>
        <span>Точно да</span>
      </div>

      <div className="mt-8">
        <label className="block text-[9px] uppercase tracking-[1px] text-text-muted">
          Что было важным? (не обязательно)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Расскажите, что больше всего понравилось — или мешало…"
          className="mt-2 h-16 rounded-lg border-black/15 bg-white p-3 text-[10px] text-text placeholder:text-text-muted/70 focus-visible:border-olive focus-visible:ring-0"
        />
      </div>

      {error ? (
        <p className="mt-3 text-center text-[11px] text-rose">{error}</p>
      ) : null}

      <Button
        onClick={handleSubmit}
        disabled={score === null || submitting || postponing}
        className="mt-6 h-10 w-full"
      >
        {submitting ? "Отправляем…" : "Отправить"}
      </Button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handlePostpone}
          disabled={submitting || postponing}
          className="text-[10px] text-text-muted underline underline-offset-4 disabled:opacity-50"
        >
          {postponing ? "Откладываем…" : "Напомнить через 3 дня"}
        </button>
      </div>
    </div>
  );
}
