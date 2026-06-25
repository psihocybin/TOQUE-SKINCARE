"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitJcs } from "@/lib/actions/surveys";

type Answer = "solved" | "partial" | "no_change" | "worse";

const OPTIONS: ReadonlyArray<{
  value: Answer;
  label: string;
  tone?: "warn";
}> = [
  { value: "solved", label: "Да, кожа явно лучше" },
  { value: "partial", label: "Частично — есть улучшения" },
  { value: "no_change", label: "Пока не вижу разницы" },
  { value: "worse", label: "Стало хуже", tone: "warn" },
];

export function JcsForm() {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, startSubmit] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!answer || submitting) return;
    setError(null);
    const trimmed = comment.trim();
    startSubmit(async () => {
      try {
        await submitJcs({ answer, comment: trimmed || undefined });
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Не удалось отправить",
        );
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 px-4 pb-6 pt-4">
        <p className="text-center text-[11px] text-text-muted">
          День 60 · контрольная точка
        </p>

        <h1 className="mt-8 text-[17px] leading-snug text-text">
          60 дней назад вы пришли к нам.
        </h1>

        <div className="mt-6 rounded-lg bg-rose/[0.08] px-4 py-4">
          <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
            За этим вы пришли
          </p>
          <p className="mt-2 text-[12px] text-text">
            Чтобы решить задачу с уходом за кожей
          </p>
        </div>

        <p className="mt-8 text-[13px] text-text">
          Удалось ли решить эту задачу?
        </p>

        <div
          className="mt-4 flex flex-col gap-2"
          role="radiogroup"
          aria-label="Варианты ответа"
        >
          {OPTIONS.map((opt) => {
            const isSelected = answer === opt.value;
            const isWarn = opt.tone === "warn";
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setAnswer(opt.value)}
                disabled={submitting}
                className={cn(
                  "rounded-lg border bg-white px-4 py-3 text-left text-[12px] text-text transition-colors disabled:opacity-60",
                  isSelected
                    ? "border-olive bg-olive/[0.08]"
                    : isWarn
                      ? "border-rose/60 hover:border-rose"
                      : "border-black/12 hover:border-black/25",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <label className="block text-[9px] uppercase tracking-[1px] text-text-muted">
            Хотите добавить?
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Несколько слов — что помогло, что нет."
            className="mt-2 h-20 rounded-lg border-black/15 bg-white p-3 text-[11px] text-text placeholder:text-text-muted/70 focus-visible:border-olive focus-visible:ring-0"
          />
        </div>

        {error ? (
          <p className="mt-3 text-center text-[11px] text-rose">{error}</p>
        ) : null}
      </div>

      <div className="sticky bottom-0 bg-cream px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3">
        <Button
          onClick={handleSubmit}
          disabled={!answer || submitting}
          className="h-12 w-full"
        >
          {submitting ? "Отправляем…" : "Отправить"}
        </Button>
      </div>
    </div>
  );
}
