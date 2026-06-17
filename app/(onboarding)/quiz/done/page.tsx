"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/lib/quiz/quiz-context";

const HIGHLIGHTS = [
  "30 дней ритуала по 5–10 минут",
  "Видео-гид к каждой процедуре",
  "Журнал и фото-прогресс",
  "Совет косметолога раз в неделю",
];

function tomorrowAt(time: string): string {
  // Просто строкой «Завтра в HH:MM» — никаких дат-расчётов, формат задаётся хардкодом.
  return `Завтра в ${time}`;
}

export default function QuizDonePage() {
  const router = useRouter();
  const { answers } = useQuiz();

  const greeting = answers.name.trim()
    ? `${answers.name.trim()}, ваша программа готова.`
    : "Ваша программа готова.";

  // Стартовое время по предпочтению; «гибко»/null → 09:00 по умолчанию.
  const startTime =
    answers.preferredTime === "morning"
      ? "09:00"
      : answers.preferredTime === "evening"
        ? "20:00"
        : "09:00";

  return (
    <div className="flex min-h-screen flex-col px-5 pb-8 pt-12 text-center">
      <FadeIn duration={0.5}>
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-pill border-[1.5px] border-olive"
          aria-hidden
        >
          <Check className="h-8 w-8 text-olive" strokeWidth={2} />
        </div>

        <h1 className="mt-8 text-[16px] leading-snug text-text">{greeting}</h1>

        <span
          className="mx-auto mt-5 block h-px w-[60px] bg-black/15"
          aria-hidden
        />
      </FadeIn>

      <FadeIn delay={0.25} duration={0.5} className="mt-8 text-left">
        <p className="text-[10px] uppercase tracking-[1.5px] text-text-muted">
          Что внутри
        </p>
        <ul className="mt-3 flex flex-col gap-3">
          {HIGHLIGHTS.map((h) => (
            <li key={h} className="flex items-start gap-2.5">
              <span
                className="mt-[7px] block h-1 w-1 shrink-0 rounded-pill bg-olive"
                aria-hidden
              />
              <span className="text-[11px] leading-relaxed text-text">
                {h}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-lg bg-olive/6 px-4 py-4">
          <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Первое занятие
          </p>
          <p className="mt-1.5 text-[13px] text-text">
            {tomorrowAt(startTime)}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.5} className="mt-auto flex w-full justify-center pt-10">
        <Button
          onClick={() => router.push("/home")}
          className="h-12 w-full max-w-[210px]"
        >
          Начать
        </Button>
      </FadeIn>
    </div>
  );
}
