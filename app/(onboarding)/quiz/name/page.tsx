"use client";

import { useRouter } from "next/navigation";
import { QuizShell } from "@/components/quiz/quiz-shell";
import { useQuiz } from "@/lib/quiz/quiz-context";

export default function QuizNamePage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();
  const name = answers.name;
  const trimmed = name.trim();

  return (
    <QuizShell
      step={2}
      title="Как к вам обращаться?"
      subtitle="Я буду называть вас по имени — это останется приватно."
      backHref="/quiz/device"
      canProceed={trimmed.length > 0}
      onNext={() => router.push("/quiz/age")}
    >
      <div className="pt-2">
        <label htmlFor="quiz-name" className="sr-only">
          Имя
        </label>
        <input
          id="quiz-name"
          type="text"
          value={name}
          onChange={(e) => setAnswer("name", e.target.value)}
          placeholder="Например, Анна"
          autoFocus
          autoComplete="given-name"
          enterKeyHint="next"
          className="w-full border-0 border-b border-olive bg-transparent pb-2 text-lg text-text outline-none placeholder:text-text-muted/50 focus:border-olive"
        />
      </div>
    </QuizShell>
  );
}
