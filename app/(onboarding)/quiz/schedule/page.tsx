"use client";

import { useRouter } from "next/navigation";
import { QuizShell } from "@/components/quiz/quiz-shell";
import { ChipGroup } from "@/components/shared/chip-group";
import { OptionTile } from "@/components/shared/option-tile";
import { OptionalToggle } from "@/components/quiz/optional-toggle";
import {
  useQuiz,
  type Frequency,
  type PreferredTime,
} from "@/lib/quiz/quiz-context";

const TIME_OPTIONS: { value: PreferredTime; label: string }[] = [
  { value: "morning", label: "Утром" },
  { value: "evening", label: "Вечером" },
  { value: "flexible", label: "Гибко" },
];

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: "low", label: "2–3 раза в неделю" },
  { value: "medium", label: "4–5 раз в неделю" },
  { value: "daily", label: "Каждый день" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[15px] leading-snug text-text">{children}</h2>
  );
}

export default function QuizSchedulePage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  const canProceed =
    answers.preferredTime !== null && answers.frequency !== null;

  return (
    <QuizShell
      step={7}
      title="Время и ритм"
      subtitle="Я подберу напоминания под ваш день."
      backHref="/quiz/experience"
      canProceed={canProceed}
      onNext={() => router.push("/quiz/done")}
    >
      <section>
        <SectionLabel>Когда вам удобно?</SectionLabel>
        <ChipGroup
          options={TIME_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          selected={answers.preferredTime ?? ""}
          onChange={(v) => setAnswer("preferredTime", v as PreferredTime)}
        />
      </section>

      <section className="mt-7">
        <SectionLabel>Как часто готовы?</SectionLabel>
        <div className="flex flex-col gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <OptionTile
              key={opt.value}
              label={opt.label}
              selected={answers.frequency === opt.value}
              onClick={() => setAnswer("frequency", opt.value)}
            />
          ))}
        </div>
      </section>

      <div className="mt-7 border-t border-black/8 pt-5">
        <p className="mb-2 text-[10px] uppercase tracking-[1.5px] text-text-muted">
          Опционально
        </p>
        <OptionalToggle
          label="Сделать baseline-фото"
          hint="Сравним прогресс через 21 день"
          checked={answers.wantsBaselinePhoto}
          onChange={(v) => setAnswer("wantsBaselinePhoto", v)}
        />
      </div>
    </QuizShell>
  );
}
