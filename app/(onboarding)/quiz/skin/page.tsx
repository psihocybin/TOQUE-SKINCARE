"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { QuizShellV2 } from "@/components/quiz/quiz-shell-v2";
import { useQuiz } from "@/lib/quiz/quiz-context";
import { SKIN_TYPE_OPTIONS } from "@/lib/content/skin-types";
import { cn } from "@/lib/utils";

export default function QuizSkinPage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  return (
    <QuizShellV2
      step={4}
      title="Ваш тип кожи"
      subtitle="Это влияет на интенсивность процедур"
      backHref="/quiz/goal"
      canProceed={answers.skinType !== null}
      onNext={() => router.push("/quiz/experience")}
    >
      <div className="flex flex-col gap-[10px]">
        {SKIN_TYPE_OPTIONS.map((opt) => {
          const isSelected = answers.skinType === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setAnswer("skinType", opt.value)}
              className={cn(
                "flex min-h-[56px] items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors",
                isSelected
                  ? "border-[1.5px] border-olive bg-olive/5"
                  : "border border-transparent",
              )}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full"
                style={{ background: opt.swatch }}
                aria-hidden
              />
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

      <div className="mt-4 text-center">
        <Link
          href="/quiz/skin-help"
          className="text-[13px] text-text-muted underline underline-offset-4"
        >
          Не знаю свой тип кожи
        </Link>
      </div>
    </QuizShellV2>
  );
}
