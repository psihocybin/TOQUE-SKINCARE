"use client";

import { useRouter } from "next/navigation";
import { QuizShell } from "@/components/quiz/quiz-shell";
import { useQuiz, type SkinType } from "@/lib/quiz/quiz-context";
import { cn } from "@/lib/utils";

const SKIN_TYPES: { value: SkinType; label: string }[] = [
  { value: "normal", label: "Нормальная" },
  { value: "dry", label: "Сухая" },
  { value: "oily", label: "Жирная" },
  { value: "combo", label: "Комбинированная" },
];

type CardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  full?: boolean;
};

function SkinCard({ label, selected, onClick, full }: CardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border transition-colors",
        full ? "h-[50px] w-full" : "h-[80px]",
        selected
          ? "border-[1.2px] border-olive bg-olive/8"
          : "border-black/12 bg-white",
      )}
    >
      <span
        className={cn(
          "block h-[18px] w-[18px] rounded-pill transition-colors",
          full && "hidden",
          selected ? "bg-olive" : "bg-black/10",
        )}
        aria-hidden
      />
      <span className="text-[11px] leading-tight text-text">{label}</span>
    </button>
  );
}

export default function QuizSkinPage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  return (
    <QuizShell
      step={5}
      title="Какой у вас тип кожи?"
      subtitle="Это определит интенсивность процедур."
      backHref="/quiz/goal"
      canProceed={answers.skinType !== null}
      onNext={() => router.push("/quiz/experience")}
    >
      <div className="grid grid-cols-2 gap-2">
        {SKIN_TYPES.map((opt) => (
          <SkinCard
            key={opt.value}
            label={opt.label}
            selected={answers.skinType === opt.value}
            onClick={() => setAnswer("skinType", opt.value)}
          />
        ))}
      </div>

      <div className="mt-2">
        <SkinCard
          label="Чувствительная"
          selected={answers.skinType === "sensitive"}
          onClick={() => setAnswer("skinType", "sensitive")}
          full
        />
      </div>
    </QuizShell>
  );
}
