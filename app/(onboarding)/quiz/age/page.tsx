"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { QuizShellV2 } from "@/components/quiz/quiz-shell-v2";
import { useQuiz, type AgeGroup } from "@/lib/quiz/quiz-context";
import { cn } from "@/lib/utils";

const AGE_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45-54", label: "45–54" },
  { value: "55+", label: "55+" },
];

export default function QuizAgePage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  return (
    <QuizShellV2
      step={6}
      title="Ваш возраст"
      subtitle="Программа учитывает возрастные особенности кожи"
      backHref="/quiz/experience"
      canProceed={answers.ageGroup !== null}
      onNext={() => router.push("/quiz/schedule")}
    >
      <div className="flex flex-col gap-[10px]">
        {AGE_OPTIONS.map((opt) => {
          const isSelected = answers.ageGroup === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setAnswer("ageGroup", opt.value)}
              className={cn(
                "flex min-h-[56px] items-center justify-between rounded-2xl bg-white p-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors",
                isSelected
                  ? "border-[1.5px] border-olive bg-olive/5"
                  : "border border-transparent",
              )}
            >
              <span className="text-[15px] font-semibold text-text">
                {opt.label}
              </span>
              {isSelected ? (
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-olive"
                  aria-hidden
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
              ) : (
                <span
                  className="h-5 w-5 shrink-0 rounded-full border border-black/15 bg-white"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </QuizShellV2>
  );
}
