"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizShellV2 } from "@/components/quiz/quiz-shell-v2";
import { useQuiz } from "@/lib/quiz/quiz-context";
import { createClient } from "@/lib/supabase/client";

export default function QuizNamePage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();
  const [authName, setAuthName] = useState<string | null>(null);
  const trimmed = answers.name.trim();

  // Если пользователь уже авторизован (например, перепроходит квиз, или
  // вошёл через Google/Apple с уже известным именем) — предложим быстрое
  // заполнение вместо пустого поля.
  useEffect(() => {
    let cancelled = false;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (cancelled) return;
        const meta = data.user?.user_metadata as
          | Record<string, unknown>
          | undefined;
        const name = meta?.full_name ?? meta?.name;
        if (typeof name === "string" && name.trim()) setAuthName(name.trim());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <QuizShellV2
      step={2}
      title="Как вас зовут?"
      subtitle="Буду обращаться к вам по имени"
      backHref="/quiz/device"
      canProceed={trimmed.length >= 2}
      onNext={() => router.push("/quiz/goal")}
    >
      <div className="px-8 pt-2">
        <label htmlFor="quiz-name" className="sr-only">
          Имя
        </label>
        <input
          id="quiz-name"
          type="text"
          value={answers.name}
          onChange={(e) => setAnswer("name", e.target.value)}
          placeholder="Ваше имя"
          autoFocus
          autoComplete="given-name"
          enterKeyHint="next"
          className="w-full border-0 border-b-[1.5px] border-olive bg-transparent pb-2 text-center text-[22px] text-text outline-none placeholder:text-text-muted/50"
        />

        {authName && authName !== trimmed ? (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => setAnswer("name", authName)}
              className="rounded-full bg-cream-dark px-3 py-1 text-xs text-text-muted"
            >
              Использовать: {authName}
            </button>
          </div>
        ) : null}
      </div>
    </QuizShellV2>
  );
}
