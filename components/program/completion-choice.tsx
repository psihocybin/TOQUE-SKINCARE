"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markCompletionCelebrated } from "@/lib/actions/program";

type Choice = "support" | "custom";

export function CompletionChoice() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
  const [error, setError] = useState<string | null>(null);

  function choose(target: Choice) {
    setError(null);
    setPendingChoice(target);
    startTransition(async () => {
      const res = await markCompletionCelebrated();
      if (!res.ok) {
        setError(res.error ?? "Не удалось сохранить. Попробуйте ещё раз.");
        setPendingChoice(null);
        return;
      }
      router.push(target === "support" ? "/home" : "/ritual-home?tab=constructor");
    });
  }

  return (
    <div className="flex flex-col gap-3 text-left">
      <button
        type="button"
        onClick={() => choose("support")}
        disabled={isPending}
        className="rounded-2xl border border-olive bg-olive/8 p-4 text-left disabled:opacity-60"
      >
        <p className="text-[14px] font-semibold text-text">Поддерживающий режим</p>
        <p className="mt-0.5 text-[12px] text-text-muted">
          2-3 процедуры в неделю · уже настроен
        </p>
        <span className="mt-3 inline-flex h-8 items-center rounded-full bg-olive px-3 text-[12px] text-cream">
          {isPending && pendingChoice === "support" ? "Переходим…" : "Продолжить →"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => choose("custom")}
        disabled={isPending}
        className="rounded-2xl border border-black/10 bg-white p-4 text-left disabled:opacity-60"
      >
        <p className="text-[14px] font-semibold text-text">Создать свой ритуал</p>
        <p className="mt-0.5 text-[12px] text-text-muted">Настрою расписание под себя</p>
        <span className="mt-3 inline-flex h-8 items-center rounded-full border border-olive px-3 text-[12px] text-olive">
          {isPending && pendingChoice === "custom" ? "Переходим…" : "Открыть конструктор →"}
        </span>
      </button>

      {error ? (
        <p className="text-center text-[11px] text-rose">{error}</p>
      ) : null}
    </div>
  );
}
