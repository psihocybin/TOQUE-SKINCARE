"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { QuizShellV2 } from "@/components/quiz/quiz-shell-v2";
import { ChipGroup } from "@/components/shared/chip-group";
import {
  useQuiz,
  type Frequency,
  type PreferredTime,
} from "@/lib/quiz/quiz-context";
import { cn } from "@/lib/utils";

const TIME_OPTIONS: { value: PreferredTime; label: string }[] = [
  { value: "morning", label: "Утром" },
  { value: "evening", label: "Вечером" },
  { value: "flexible", label: "Гибко" },
];

const FREQUENCY_OPTIONS: { value: Frequency; label: string; sublabel: string }[] = [
  { value: "low", label: "2–3 раза в неделю", sublabel: "Мягкий старт" },
  { value: "medium", label: "4–5 раз в неделю", sublabel: "Оптимально" },
  { value: "daily", label: "Каждый день", sublabel: "Максимальный эффект" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[9px] uppercase tracking-[1.5px] text-text-muted">
      {children}
    </p>
  );
}

export default function QuizSchedulePage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  const canProceed =
    answers.preferredTime !== null && answers.frequency !== null;

  return (
    <QuizShellV2
      step={7}
      title="Когда и как часто?"
      backHref="/quiz/age"
      canProceed={canProceed}
      onNext={() => router.push("/quiz/analyzing")}
    >
      <section>
        <SectionLabel>Когда удобно делать процедуры</SectionLabel>
        <ChipGroup
          options={TIME_OPTIONS}
          selected={answers.preferredTime ?? ""}
          onChange={(v) => setAnswer("preferredTime", v as PreferredTime)}
        />
      </section>

      <section className="mt-7">
        <SectionLabel>Как часто готовы</SectionLabel>
        <div className="flex flex-col gap-[10px]">
          {FREQUENCY_OPTIONS.map((opt) => {
            const isSelected = answers.frequency === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setAnswer("frequency", opt.value)}
                className={cn(
                  "flex min-h-[56px] items-center justify-between rounded-2xl bg-white p-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors",
                  isSelected
                    ? "border-[1.5px] border-olive bg-olive/5"
                    : "border border-transparent",
                )}
              >
                <span>
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
      </section>

      <div className="mt-7">
        <button
          type="button"
          role="checkbox"
          aria-checked={answers.wantsBaselinePhoto}
          onClick={() =>
            setAnswer("wantsBaselinePhoto", !answers.wantsBaselinePhoto)
          }
          className="flex w-full items-center gap-2.5 rounded-xl bg-cream-dark/60 p-3 text-left"
        >
          <span
            className={cn(
              "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border",
              answers.wantsBaselinePhoto
                ? "border-olive bg-olive"
                : "border-black/25 bg-white",
            )}
            aria-hidden
          >
            {answers.wantsBaselinePhoto ? (
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            ) : null}
          </span>
          <span className="text-[13px] text-text-muted">
            Хочу сделать фото сейчас для сравнения потом
          </span>
        </button>
      </div>
    </QuizShellV2>
  );
}
