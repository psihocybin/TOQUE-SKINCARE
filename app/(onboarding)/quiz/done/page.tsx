"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Camera,
  CheckCircle,
  MessageCircle,
  Sparkles,
  Video,
} from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/lib/quiz/quiz-context";

const HIGHLIGHTS = [
  { icon: CalendarDays, text: "30 дней ритуала по 5–10 минут" },
  { icon: Video, text: "Видео-инструкции к каждой процедуре" },
  { icon: Camera, text: "Журнал и фото-сравнение" },
  { icon: MessageCircle, text: "Советы косметолога MASSK" },
];

const SPARKLES: {
  size: number;
  className: string;
  delay: number;
}[] = [
  { size: 16, className: "left-2 top-0", delay: 0.1 },
  { size: 22, className: "right-0 top-4", delay: 0.2 },
  { size: 28, className: "bottom-2 left-0", delay: 0.15 },
  { size: 18, className: "bottom-0 right-4", delay: 0.3 },
];

export default function QuizDonePage() {
  const { answers } = useQuiz();

  const name = answers.name.trim();
  const greeting = name
    ? `${name}, ваша программа готова.`
    : "Ваша программа готова.";

  const startTime =
    answers.preferredTime === "morning"
      ? "09:00"
      : answers.preferredTime === "evening"
        ? "20:00"
        : "09:00";

  return (
    <div
      className="flex min-h-screen flex-col px-6 pb-10 pt-14 text-center"
      style={{
        background:
          "radial-gradient(circle at 50% 30%, rgba(241,239,232,0.45) 0%, rgba(250,250,247,0.7) 100%)",
      }}
    >
      <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center">
        {SPARKLES.map((s, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: s.delay }}
            className={`absolute ${s.className}`}
            aria-hidden
          >
            <Sparkles
              width={s.size}
              height={s.size}
              className="text-olive/40"
              strokeWidth={1.5}
            />
          </motion.span>
        ))}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-olive/15"
        >
          <CheckCircle className="h-9 w-9 text-olive" strokeWidth={1.75} />
        </motion.div>
      </div>

      <FadeIn delay={0.2} duration={0.4}>
        <h1 className="mt-6 text-xl font-bold text-text">{greeting}</h1>
        <p className="mt-2 px-6 text-[13px] leading-relaxed text-text-muted">
          30 дней персонального ухода. Протоколы под ваше устройство. Первая
          процедура — завтра.
        </p>
      </FadeIn>

      <FadeIn delay={0.3} duration={0.4} className="mt-7 text-left">
        <p className="text-center text-[9px] uppercase tracking-[2px] text-text-muted">
          Что внутри
        </p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-olive" strokeWidth={1.75} />
              <span className="text-[13px] text-text">{text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl bg-olive/8 px-4 py-3">
          <p className="text-[9px] uppercase tracking-[1.5px] text-olive">
            Первое занятие
          </p>
          <p className="mt-1.5 text-[13px] text-text">
            Завтра в {startTime}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.4} duration={0.4} className="mt-7">
        <Button asChild className="h-[52px] w-full rounded-full text-[15px]">
          <Link href="/login">Создать аккаунт и начать</Link>
        </Button>
        <Link
          href="/login"
          className="mt-3 block text-xs text-text-muted underline underline-offset-4"
        >
          Уже есть аккаунт? Войти
        </Link>
      </FadeIn>
    </div>
  );
}
