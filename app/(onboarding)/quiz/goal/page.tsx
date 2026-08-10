"use client";

import { useRouter } from "next/navigation";
import {
  Check,
  Droplets,
  Layers,
  type LucideIcon,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { QuizShellV2 } from "@/components/quiz/quiz-shell-v2";
import { useQuiz, type Goal } from "@/lib/quiz/quiz-context";
import { cn } from "@/lib/utils";

const GOAL_OPTIONS: {
  value: Goal;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "cleansing",
    label: "Очищение и поры",
    description: "Глубокое очищение, уменьшение пор",
    icon: Sparkles,
  },
  {
    value: "tone",
    label: "Тонус и упругость",
    description: "Лифтинг и чёткость контура лица",
    icon: Zap,
  },
  {
    value: "glow",
    label: "Сияние и свежесть",
    description: "Ровный тон, усталая кожа",
    icon: Sun,
  },
  {
    value: "puffiness",
    label: "Снятие отёков",
    description: "Отёчность, лимфодренаж",
    icon: Droplets,
  },
  {
    value: "all",
    label: "Всё постепенно",
    description: "Комплексный уход без спешки",
    icon: Layers,
  },
];

export default function QuizGoalPage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  return (
    <QuizShellV2
      step={3}
      title="Что для вас важнее всего?"
      subtitle="Выберите одну главную задачу"
      backHref="/quiz/name"
      canProceed={answers.goal !== null}
      onNext={() => router.push("/quiz/skin")}
    >
      <div className="flex flex-col gap-[10px]">
        {GOAL_OPTIONS.map((opt) => {
          const isSelected = answers.goal === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setAnswer("goal", opt.value)}
              className={cn(
                "flex min-h-[56px] items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors",
                isSelected
                  ? "border-[1.5px] border-olive bg-olive/5"
                  : "border border-transparent",
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-olive/10">
                <Icon className="h-5 w-5 text-olive" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-text">
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-text-muted">
                  {opt.description}
                </span>
              </span>
              {isSelected ? (
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-olive"
                  aria-hidden
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </QuizShellV2>
  );
}
