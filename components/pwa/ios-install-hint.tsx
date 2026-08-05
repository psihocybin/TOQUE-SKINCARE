"use client";

import { useEffect, useState } from "react";
import { Plus, Share, X } from "lucide-react";

const DISMISS_KEY = "ios_hint_dismissed";

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  // iOS Safari использует свойство `navigator.standalone`.
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

export function IosInstallHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isIOS()) return;
    if (isInStandaloneMode()) return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;
    setVisible(true);
  }, []);

  function handleClose() {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-[68px] z-30 mx-auto w-full max-w-app px-4">
      <div className="relative rounded-xl bg-cream-dark px-4 py-4 shadow-lg ring-1 ring-black/5">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть подсказку"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-pill text-text-muted transition-colors hover:bg-black/[0.05]"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        </button>

        <p className="pr-7 text-[12px] text-text">
          Для получения уведомлений установите приложение
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-text-muted">
          <span>Нажмите</span>
          <Share
            className="h-3.5 w-3.5 text-text-muted"
            strokeWidth={1.5}
            aria-hidden
          />
          <span>в Safari и выберите</span>
          <Plus
            className="h-3.5 w-3.5 rounded-[3px] border border-text-muted text-text-muted"
            strokeWidth={1.5}
            aria-hidden
          />
          <span>«На экран Домой»</span>
        </p>
      </div>
    </div>
  );
}
