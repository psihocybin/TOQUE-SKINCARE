"use client";

import Link from "next/link";
import { PauseCircle } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export default function SettingsPausePage() {
  function handleStub() {
    alert("Функция паузы будет добавлена в следующей версии");
  }

  return (
    <main className="flex min-h-screen flex-col px-4 pb-12 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/settings" />
        </div>
        <p className="text-[14px] text-text">Пауза программы</p>
      </header>

      <FadeIn className="mt-20 flex flex-col items-center text-center">
        <PauseCircle
          className="h-12 w-12 text-text-muted"
          strokeWidth={1.2}
          aria-hidden
        />
        <h1 className="mt-6 text-[15px] leading-snug text-text">
          Поставить программу на паузу?
        </h1>
        <p className="mt-3 text-[11px] leading-relaxed text-text-muted">
          Уведомления остановятся. Программа продолжится с того же места когда
          вернётесь.
        </p>
      </FadeIn>

      <FadeIn delay={0.25} className="mt-12">
        <Button
          variant="outline"
          onClick={handleStub}
          className="h-12 w-full"
        >
          Поставить на паузу
        </Button>
        <div className="mt-4 text-center">
          <Link
            href="/settings"
            className="text-[11px] text-text-muted underline underline-offset-4"
          >
            Вернуться к программе
          </Link>
        </div>
      </FadeIn>
    </main>
  );
}
