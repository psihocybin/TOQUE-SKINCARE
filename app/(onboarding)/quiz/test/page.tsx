"use client";

import { Button } from "@/components/ui/button";
import { useQuiz } from "@/lib/quiz/quiz-context";

export default function QuizTestPage() {
  const { answers, setAnswer, resetQuiz, getCurrentStep, isStepComplete } =
    useQuiz();

  const stepFlags = [1, 2, 3, 4, 5, 6, 7].map((s) => ({
    step: s,
    complete: isStepComplete(s),
  }));

  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      <header>
        <p className="text-[10px] uppercase tracking-[1.5px] text-text-muted">
          Debug · Ступень 5 · Заход 1
        </p>
        <h1 className="mt-2 text-2xl font-bold text-olive-dark">
          QuizContext test
        </h1>
      </header>

      <section className="space-y-2">
        <div className="text-[11px] uppercase tracking-[1.5px] text-text-muted">
          Текущий шаг
        </div>
        <div className="font-mono text-lg text-text">{getCurrentStep()}</div>
      </section>

      <section className="space-y-2">
        <div className="text-[11px] uppercase tracking-[1.5px] text-text-muted">
          Шаги (заполнен?)
        </div>
        <ul className="flex flex-wrap gap-2 font-mono text-xs">
          {stepFlags.map(({ step, complete }) => (
            <li
              key={step}
              className={
                complete
                  ? "rounded-pill border border-olive bg-olive/10 px-2 py-1 text-olive-dark"
                  : "rounded-pill border border-black/15 bg-white px-2 py-1 text-text-muted"
              }
            >
              {step} · {complete ? "✓" : "—"}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <div className="text-[11px] uppercase tracking-[1.5px] text-text-muted">
          answers (state)
        </div>
        <pre className="overflow-x-auto rounded-md border border-black/10 bg-cream-dark p-3 font-mono text-[11px] leading-relaxed text-text">
          {JSON.stringify(answers, null, 2)}
        </pre>
      </section>

      <section className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setAnswer("name", "Анна")}
        >
          Set name → Анна
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setAnswer("device", "ELARA")}
        >
          Set device → ELARA
        </Button>
        <Button size="sm" variant="outline" onClick={resetQuiz}>
          Reset
        </Button>
      </section>

      <p className="text-xs text-text-muted">
        localStorage ключ: <code className="font-mono">toque_quiz_answers</code>.
        Обнови страницу (F5) — состояние сохраняется. Удалить после Ступени 5.
      </p>
    </div>
  );
}
