"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Feedback = "great" | "normal" | "questions";

type Props = {
  name: string;
  dayNumber: number;
  procedureOrdinal: number;
  mode: string;
  durationSeconds: number;
};

const OPTIONS: ReadonlyArray<{ value: Feedback; label: string }> = [
  { value: "great", label: "Отлично" },
  { value: "normal", label: "Нормально, есть мысли" },
  { value: "questions", label: "Были вопросы — нужна помощь" },
];

function ordinalRu(n: number): string {
  return `${n}-я`;
}

export function DoneClient({
  name,
  dayNumber,
  procedureOrdinal,
  mode,
  durationSeconds,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!selected || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { error: insertError } = await supabase.from("procedures").insert({
        profile_id: user.id,
        day_number: dayNumber,
        mode,
        duration_seconds: durationSeconds,
        feedback: selected,
      });

      if (insertError) {
        setError("Не удалось сохранить процедуру. Попробуйте ещё раз.");
        setSubmitting(false);
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError("Не удалось сохранить. Проверьте соединение.");
      setSubmitting(false);
    }
  }

  const greetingName = name.trim();

  return (
    <main className="flex min-h-screen flex-col px-5 pb-10 pt-[12vh] text-center">
      <FadeIn duration={0.5}>
        <div
          className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-pill border border-olive/40 bg-olive/[0.12]"
          aria-hidden
        >
          <Check className="h-9 w-9 text-olive" strokeWidth={2.5} />
        </div>

        <h1 className="mt-7 text-[18px] leading-snug text-text">
          {greetingName ? `Готово, ${greetingName}.` : "Готово."}
        </h1>
        <p className="mt-2 text-[11px] text-text-muted">
          Это была ваша {ordinalRu(procedureOrdinal)} процедура.
        </p>
      </FadeIn>

      <FadeIn delay={0.2} className="mt-7">
        <div className="mx-auto flex w-full max-w-[280px] items-center justify-center rounded-lg bg-olive/[0.06] px-4 py-4">
          <div className="flex-1 text-center">
            <p className="text-[20px] leading-none text-text">
              {procedureOrdinal}
            </p>
            <p className="mt-1 text-[9px] text-text-muted">процедур</p>
          </div>
          <span
            className="mx-3 block h-9 w-px bg-black/10"
            aria-hidden
          />
          <div className="flex-1 text-center">
            <p className="text-[20px] leading-none text-text">{dayNumber}</p>
            <p className="mt-1 text-[9px] text-text-muted">день</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.35} className="mt-8 text-left">
        <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
          Как прошло?
        </p>
        <div className="mt-3 flex flex-col gap-2.5">
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                disabled={submitting}
                aria-pressed={isSelected}
                className={cn(
                  "h-11 rounded-lg border bg-white text-[12px] text-text transition-colors disabled:opacity-60",
                  isSelected
                    ? "border-olive bg-olive/[0.08]"
                    : "border-black/12 hover:border-black/25",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {error ? (
          <p className="mt-3 text-center text-[11px] text-rose">{error}</p>
        ) : null}
      </FadeIn>

      <div className="mt-auto pt-8">
        <Button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className="h-12 w-full"
        >
          {submitting ? "Сохраняем…" : "Готово"}
        </Button>
      </div>
    </main>
  );
}
