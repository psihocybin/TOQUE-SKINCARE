"use client";

import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { QUIZ_TOTAL_STEPS } from "@/lib/quiz/quiz-context";
import { cn } from "@/lib/utils";

type QuizShellV2Props = {
  step: number;
  title: string;
  subtitle?: string;
  backHref: string;
  onNext: () => void;
  canProceed: boolean;
  nextLabel?: string;
  children: React.ReactNode;
};

function DashProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-[5px]" aria-hidden>
      {Array.from({ length: QUIZ_TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
        <span
          key={n}
          className={cn(
            "h-[3px] w-[30px] rounded-full",
            n <= step ? "bg-olive" : "bg-black/15",
          )}
        />
      ))}
    </div>
  );
}

// Новый shell редизайна квиза (Skinive-референс, адаптированный под TOQUE):
// даши вместо линейного прогресс-бара с текстом «Шаг X из Y», крупный
// центрированный заголовок, sticky (не fixed!) кнопка Continue снизу.
// fixed здесь сломался бы так же, как везде: PhoneFrame на десктопе —
// центрированный relative-контейнер, а не полноэкранный, поэтому fixed
// позиционируется от viewport и вылезает за рамку телефона.
export function QuizShellV2({
  step,
  title,
  subtitle,
  backHref,
  onNext,
  canProceed,
  nextLabel = "Продолжить",
  children,
}: QuizShellV2Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="px-5 pt-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute left-0">
            <BackButton href={backHref} />
          </div>
          <DashProgress step={step} />
        </div>

        <h1 className="mt-8 text-center text-[22px] font-bold leading-tight text-text">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-center text-sm text-text-muted">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex-1 overflow-y-auto px-5 pb-6">{children}</div>

      <FadeIn
        duration={0.2}
        y={0}
        className="sticky bottom-0 bg-cream px-5 pb-[max(env(safe-area-inset-bottom),24px)] pt-3"
      >
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          aria-disabled={!canProceed}
          className={cn(
            "h-[52px] w-full rounded-full text-[15px]",
            !canProceed && "pointer-events-none opacity-40",
          )}
        >
          {nextLabel}
        </Button>
      </FadeIn>
    </div>
  );
}
