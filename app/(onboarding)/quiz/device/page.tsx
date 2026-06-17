"use client";

import { useRouter } from "next/navigation";
import { QuizShell } from "@/components/quiz/quiz-shell";
import { OptionTile } from "@/components/shared/option-tile";
import { useQuiz, type DeviceId } from "@/lib/quiz/quiz-context";

// Порядок: сначала «знакомые» устройства из ассортимента (NUO семейство, ELARA,
// LUMERA), дальше остальные. Названия — латиница, как принято у бренда.
const DEVICES: DeviceId[] = [
  "NUO",
  "NUO_PRO",
  "ELARA",
  "LUMERA",
  "PULSAR",
  "ANIMA",
  "NOVA",
  "AERIS",
  "AURA",
  "VIBE",
  "QUANTUM",
];

function labelOf(id: DeviceId): string {
  // Отображаем NUO_PRO как «NUO Pro» — мелкая косметика, чтобы в списке смотрелось чище.
  return id === "NUO_PRO" ? "NUO Pro" : id;
}

export default function QuizDevicePage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();

  return (
    <QuizShell
      step={1}
      title="Какое у вас устройство?"
      subtitle="Выберите модель — программа подстроится под её режимы."
      backHref="/welcome"
      canProceed={answers.device !== null}
      onNext={() => router.push("/quiz/name")}
    >
      <div className="flex flex-col gap-2">
        {DEVICES.map((id) => (
          <OptionTile
            key={id}
            label={labelOf(id)}
            selected={answers.device === id}
            onClick={() => setAnswer("device", id)}
            variant="compact"
          />
        ))}
      </div>
    </QuizShell>
  );
}
