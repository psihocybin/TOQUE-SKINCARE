"use client";

import { useRouter } from "next/navigation";
import { QuizShell } from "@/components/quiz/quiz-shell";
import { OptionTile } from "@/components/shared/option-tile";
import { useQuiz, type Experience } from "@/lib/quiz/quiz-context";

const EXPERIENCE_OPTIONS: {
  value: Experience;
  label: string;
  sublabel: string;
}[] = [
  { value: "beginner", label: "Новичок", sublabel: "Никогда не пробовала" },
  { value: "familiar", label: "Знакомая тема", sublabel: "Делала в салоне" },
  {
    value: "experienced",
    label: "Опытный пользователь",
    sublabel: "Уже пользуюсь дома",
  },
  { value: "expert", label: "Эксперт", sublabel: "Знаю всё про процедуры" },
];

export default function QuizExperiencePage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  return (
    <QuizShell
      step={6}
      title="Насколько вы знакомы с аппаратным уходом?"
      subtitle="От этого зависит глубина объяснений."
      backHref="/quiz/skin"
      canProceed={answers.experience !== null}
      onNext={() => router.push("/quiz/schedule")}
    >
      <div className="flex flex-col gap-2">
        {EXPERIENCE_OPTIONS.map((opt) => (
          <OptionTile
            key={opt.value}
            label={opt.label}
            sublabel={opt.sublabel}
            selected={answers.experience === opt.value}
            onClick={() => setAnswer("experience", opt.value)}
          />
        ))}
      </div>
    </QuizShell>
  );
}
