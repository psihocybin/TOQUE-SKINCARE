"use client";

import { useState } from "react";

type Props = {
  code: string;
};

export function PromoCodeCard({ code }: Props) {
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
    <div className="rounded-xl bg-olive/[0.06] px-4 py-4">
      <p className="text-[9px] tracking-widest text-text-muted">
        СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ
      </p>
      <p className="mt-1 text-[13px] text-text">Промокод на скидку 15%</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-mono text-[15px] tracking-widest text-text">
          {code}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="text-[10px] text-olive underline"
        >
          {copied ? "Скопировано ✓" : "Копировать"}
        </button>
      </div>
      <p className="mt-2 text-[9px] text-text-muted">
        Действует на сайте toque-store.ru
      </p>
    </div>
  );
}
