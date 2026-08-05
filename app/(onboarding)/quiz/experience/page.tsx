"use client";

import { useRouter } from "next/navigation";
import { Baby, Check, Crown, type LucideIcon, Star, StarHalf } from "lucide-react";
import { QuizShellV2 } from "@/components/quiz/quiz-shell-v2";
import { useQuiz, type Experience } from "@/lib/quiz/quiz-context";
import { cn } from "@/lib/utils";

const EXPERIENCE_OPTIONS: {
  value: Experience;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}[] = [
  {
    value: "beginner",
    label: "Новичок",
    sublabel: "Первое устройство",
    icon: Baby,
  },
  {
    value: "familiar",
    label: "Немного знакома",
    sublabel: "Делала процедуры в салоне",
    icon: Star,
  },
  {
    value: "experienced",
    label: "Опытный пользователь",
    sublabel: "Уже пользуюсь дома",
    icon: StarHalf,
  },
  {
    value: "expert",
    label: "Эксперт",
    sublabel: "Хорошо разбираюсь в косметологии",
    icon: Crown,
  },
];

export default function QuizExperiencePage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  return (
    <QuizShellV2
      step={5}
      title="Ваш опыт с аппаратным уходом"
      subtitle="Подберём глубину объяснений"
      backHref="/quiz/skin"
      canProceed={answers.experience !== null}
      onNext={() => router.push("/quiz/age")}
    >
      <div className="flex flex-col gap-[10px]">
        {EXPERIENCE_OPTIONS.map((opt) => {
          const isSelected = answers.experience === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setAnswer("experience", opt.value)}
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
                  {opt.sublabel}
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
