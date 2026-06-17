"use client";

import { useRouter } from "next/navigation";
import { QuizShell } from "@/components/quiz/quiz-shell";
import { OptionTile } from "@/components/shared/option-tile";
import { OptionalToggle } from "@/components/quiz/optional-toggle";
import { useQuiz, type Goal } from "@/lib/quiz/quiz-context";

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "cleansing", label: "Очищение, поры" },
  { value: "tone", label: "Тонус, упругость" },
  { value: "glow", label: "Сияние, свежесть" },
  { value: "puffiness", label: "Снятие отёков" },
  { value: "all", label: "Всё постепенно" },
];

export default function QuizGoalPage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  return (
    <QuizShell
      step={4}
      title="Что для вас сейчас важнее всего?"
      subtitle="Выберите одну главную задачу."
      backHref="/quiz/age"
      canProceed={answers.goal !== null}
      onNext={() => router.push("/quiz/skin")}
    >
      <div className="flex flex-col gap-2">
        {GOAL_OPTIONS.map((opt) => (
          <OptionTile
            key={opt.value}
            label={opt.label}
            selected={answers.goal === opt.value}
            onClick={() => setAnswer("goal", opt.value)}
            variant="compact"
          />
        ))}
      </div>

      <div className="mt-6 border-t border-black/8 pt-5">
        <p className="mb-2 text-[10px] uppercase tracking-[1.5px] text-text-muted">
          Опционально
        </p>
        <OptionalToggle
          label="Это подарок"
          hint="Покажу мягкое welcome без активации сразу"
          checked={answers.isGift}
          onChange={(v) => setAnswer("isGift", v)}
        />
      </div>
    </QuizShell>
  );
}
