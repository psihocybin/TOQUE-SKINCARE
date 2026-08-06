"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { useQuiz, type SkinType } from "@/lib/quiz/quiz-context";
import { getSkinTypeOption } from "@/lib/content/skin-types";
import { cn } from "@/lib/utils";

type Answer = "yes" | "no" | "sometimes";

const ANSWER_OPTIONS: { value: Answer; label: string }[] = [
  { value: "yes", label: "Да" },
  { value: "no", label: "Нет" },
  { value: "sometimes", label: "Иногда" },
];

const QUESTIONS: { key: "shine" | "tightness" | "redness"; text: string }[] = [
  { key: "shine", text: "К середине дня кожа блестит в Т-зоне?" },
  { key: "tightness", text: "После умывания чувствуете стянутость?" },
  { key: "redness", text: "Бывают покраснения или раздражение без причины?" },
];

// Последовательная проверка, первое совпадение побеждает — покраснения
// решают тип только если блеск/стянутость не дали однозначного ответа
// (там, где ответ "Иногда" не попадает ни в одну явную комбинацию).
function resolveSkinType(
  shine: Answer | null,
  tightness: Answer | null,
  redness: Answer | null,
): SkinType {
  if (shine === "yes" && tightness === "no") return "oily";
  if (shine === "yes" && tightness === "yes") return "combo";
  if (shine === "no" && tightness === "yes") return "dry";
  if (redness === "yes") return "sensitive";
  return "normal";
}

export default function QuizSkinHelpPage() {
  const router = useRouter();
  const { setAnswer } = useQuiz();
  const [shine, setShine] = useState<Answer | null>(null);
  const [tightness, setTightness] = useState<Answer | null>(null);
  const [redness, setRedness] = useState<Answer | null>(null);

  const setters: Record<"shine" | "tightness" | "redness", (a: Answer) => void> = {
    shine: setShine,
    tightness: setTightness,
    redness: setRedness,
  };
  const values: Record<"shine" | "tightness" | "redness", Answer | null> = {
    shine,
    tightness,
    redness,
  };

  const allAnswered = shine !== null && tightness !== null && redness !== null;
  const result = allAnswered ? resolveSkinType(shine, tightness, redness) : null;
  const resultOption = result ? getSkinTypeOption(result) : undefined;

  function handleAccept() {
    if (!result) return;
    setAnswer("skinType", result);
    router.push("/quiz/experience");
  }

  return (
    <div className="flex min-h-screen flex-col px-5 pt-6">
      <div className="flex items-center">
        <BackButton href="/quiz/skin" />
      </div>

      <h1 className="mt-4 text-center text-[22px] font-bold text-text">
        Определим вместе
      </h1>
      <p className="mt-2 text-center text-sm text-text-muted">
        Ответьте на 3 вопроса
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <p className="text-[14px] text-text">{q.text}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {ANSWER_OPTIONS.map((opt) => {
                const isSelected = values[q.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setters[q.key](opt.value)}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-xl border text-[13px] transition-colors",
                      isSelected
                        ? "border-olive bg-olive/10 text-text"
                        : "border-black/12 bg-white text-text-muted",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {resultOption ? (
        <FadeIn duration={0.3} className="mt-8">
          <div className="rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <span
                className="h-8 w-8 shrink-0 rounded-full"
                style={{ background: resultOption.swatch }}
                aria-hidden
              />
              <div>
                <p className="text-[14px] text-text">
                  Похоже, у вас {resultOption.label.toLowerCase()} кожа.
                </p>
                <p className="mt-0.5 text-[12px] text-text-muted">
                  {resultOption.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="h-11 flex-1 rounded-full border border-black/12 text-[13px] text-text-muted"
              >
                Выбрать другой
              </button>
              <Button onClick={handleAccept} className="h-11 flex-1 rounded-full">
                Принять
              </Button>
            </div>
          </div>
        </FadeIn>
      ) : null}
    </div>
  );
}
