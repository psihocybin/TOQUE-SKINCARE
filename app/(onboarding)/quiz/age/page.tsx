"use client";

import { useRouter } from "next/navigation";
import { QuizShell } from "@/components/quiz/quiz-shell";
import { OptionTile } from "@/components/shared/option-tile";
import { useQuiz, type AgeGroup } from "@/lib/quiz/quiz-context";

const AGE_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: "25-34", label: "25–34 года" },
  { value: "35-44", label: "35–44 года" },
  { value: "45-54", label: "45–54 года" },
  { value: "55+", label: "55+ лет" },
];

export default function QuizAgePage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  return (
    <QuizShell
      step={3}
      title="Сколько вам лет?"
      subtitle="Программа подстраивается под возраст."
      backHref="/quiz/name"
      canProceed={answers.ageGroup !== null}
      onNext={() => router.push("/quiz/goal")}
    >
      <div className="flex flex-col gap-2">
        {AGE_OPTIONS.map((opt) => (
          <OptionTile
            key={opt.value}
            label={opt.label}
            selected={answers.ageGroup === opt.value}
            onClick={() => setAnswer("ageGroup", opt.value)}
          />
        ))}
      </div>
    </QuizShell>
  );
}
