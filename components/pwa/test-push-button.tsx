"use client";

import { useState } from "react";

type State = "idle" | "sending" | "ok" | "error";

export function TestPushButton() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    if (state === "sending") return;
    setState("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      const data = (await res.json()) as {
        ok?: boolean;
        sent?: number;
        total?: number;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? `Ошибка ${res.status}`);
        return;
      }
      setState("ok");
      setMessage(`Отправлено: ${data.sent}/${data.total}`);
    } catch (e) {
      setState("error");
      setMessage(e instanceof Error ? e.message : "Ошибка сети");
    }
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "sending"}
        className="text-[11px] text-text-muted underline underline-offset-4 disabled:opacity-50"
      >
        {state === "sending" ? "Отправляем…" : "Прислать тестовое уведомление"}
      </button>
      {message ? (
        <p
          className={
            "mt-2 text-[10px] " +
            (state === "ok" ? "text-olive" : "text-rose")
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
