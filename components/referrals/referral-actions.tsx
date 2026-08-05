"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  code: string;
};

const APP_URL =
  typeof process.env.NEXT_PUBLIC_APP_URL === "string" &&
  process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : "https://toque-store.ru";

export function CopyCodeButton({ code }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — браузер мог запретить clipboard в insecure context
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-7 items-center rounded-pill bg-olive px-4 text-[10px] text-cream transition-opacity hover:opacity-90"
    >
      {copied ? "Скопировано ✓" : "Копировать"}
    </button>
  );
}

export function ShareButton({ code }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleShare() {
    if (busy) return;
    setBusy(true);

    const shareData = {
      title: "TOQUE Ритуал",
      text: `Пользуюсь TOQUE — стало частью ежедневного ритуала. Промокод ${code} даёт скидку 15% на первое устройство на toque-store.ru`,
      url: `${APP_URL}?ref=${code}`,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`,
        );
      }
    } catch {
      // Пользователь закрыл sheet или clipboard недоступен — молча.
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button onClick={handleShare} disabled={busy} className="h-12 w-full">
      Поделиться ссылкой
    </Button>
  );
}
