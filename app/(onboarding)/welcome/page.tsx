"use client";

import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen flex-col items-center px-6">
      <FadeIn
        delay={0.2}
        duration={0.5}
        className="flex w-full flex-1 flex-col items-center"
      >
        <div className="mt-[24vh] flex flex-col items-center">
          <p className="text-[26px] tracking-[6px] text-text">TOQUE</p>
          <p className="mt-1 text-[10px] uppercase tracking-[3px] text-text-muted">
            Ритуал
          </p>
          <span className="mt-4 block h-px w-[60px] bg-black/15" aria-hidden />
        </div>

        <div className="mt-[16vh] flex flex-col items-center text-center">
          <p className="text-sm text-text">Я — TOQUE Ритуал.</p>
          <p className="mt-6 text-[11px] leading-relaxed text-[#5F5E5A]">
            Помогу встроить ваше устройство
            <br />в ежедневный ритуал за 30 дней.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.6} className="flex w-full justify-center pb-12">
        <Button
          onClick={() => router.push("/quiz/device")}
          className="h-12 w-[200px]"
        >
          Начать
        </Button>
      </FadeIn>
    </main>
  );
}
