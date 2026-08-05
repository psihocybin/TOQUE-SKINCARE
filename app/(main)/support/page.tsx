"use client";

import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

const SUPPORT_TG_URL = "https://t.me/Toque_team";

export default function SupportPage() {
  function openTelegram() {
    window.open(SUPPORT_TG_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative flex items-center gap-3 px-4 pt-4">
        <BackButton href="/profile" />
        <div className="flex flex-1 items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-pill bg-olive/20"
            aria-hidden
          >
            <span className="text-[12px] text-olive">Ю</span>
          </div>
          <div className="flex flex-1 items-center justify-between">
            <p className="text-[12px] text-text">Юлия, эксперт</p>
            <span className="flex items-center gap-1.5">
              <span
                className="block h-1.5 w-1.5 rounded-pill bg-olive"
                aria-hidden
              />
              <span className="text-[9px] text-text-muted">онлайн</span>
            </span>
          </div>
        </div>
      </header>

      <p className="mt-3 border-t border-black/8 pt-3 text-center text-[9px] text-text-muted">
        отвечаем в течение 4 часов
      </p>

      <div className="flex-1 px-4 pt-6">
        <FadeIn>
          <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-black/[0.04] px-4 py-3">
            <p className="text-[10px] leading-relaxed text-text">
              Здравствуйте. Я Юлия, косметолог TOQUE.
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-text">
              Опишите вопрос — отвечу в ближайшее время.
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="sticky bottom-0 border-t border-black/8 bg-cream px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3">
        <Button onClick={openTelegram} className="h-12 w-full">
          Написать в службу заботы
        </Button>
        <p className="mt-2 text-center text-[9px] text-text-muted">
          Обычно отвечаем в течение нескольких часов
        </p>
      </div>
    </div>
  );
}
