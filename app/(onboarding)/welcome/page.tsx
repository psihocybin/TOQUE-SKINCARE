"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function WelcomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Залогиненному незачем снова видеть Welcome — сразу в приложение.
  useEffect(() => {
    let cancelled = false;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (cancelled) return;
        if (data.user) {
          router.replace("/home");
          return;
        }
        setCheckingAuth(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checkingAuth) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <div
        className="flex flex-1 items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(241,239,232,0.45) 0%, rgba(250,250,247,0.7) 100%)",
        }}
      >
        <FadeIn duration={0.5}>
          <div className="flex h-[240px] w-[240px] items-center justify-center rounded-full border border-white/50 bg-white/40 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md">
            {/* Плейсхолдер — в будущем <Image src="/devices/nuo.jpg" .../> */}
            <span className="text-[32px] font-bold text-olive-dark">TOQUE</span>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.15} duration={0.5} className="flex flex-col items-center px-6 pb-8 pt-10 text-center">
        <p className="text-[28px] font-bold leading-tight text-text">
          Ваш персональный
        </p>
        <p className="text-[28px] font-bold leading-tight text-text">
          ритуал ухода
        </p>
        <p className="mt-3 px-8 text-sm text-text-muted">
          Пройдите квиз — получите 30-дневную программу под ваше устройство и
          тип кожи.
        </p>
        <div className="mt-8 flex w-full max-w-[280px] flex-col gap-3">
          <Button
            onClick={() => router.push("/quiz/device")}
            className="h-[52px] w-full rounded-full text-[15px]"
          >
            Пройти квиз
          </Button>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="h-[52px] w-full rounded-full text-[15px]"
          >
            У меня уже есть аккаунт
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
