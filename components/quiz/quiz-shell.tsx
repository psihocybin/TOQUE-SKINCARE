"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/shared/back-button";
import { ProgressBar } from "@/components/quiz/progress-bar";
import { Button } from "@/components/ui/button";
import { QUIZ_TOTAL_STEPS } from "@/lib/quiz/quiz-context";
import { createClient } from "@/lib/supabase/client";

type QuizShellProps = {
  step: number;
  title: string;
  subtitle?: string;
  backHref: string;
  onNext: () => void;
  canProceed: boolean;
  nextLabel?: string;
  children: React.ReactNode;
};

export function QuizShell({
  step,
  title,
  subtitle,
  backHref,
  onNext,
  canProceed,
  nextLabel = "Далее",
  children,
}: QuizShellProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!cancelled) setIsLoggedIn(Boolean(data.user));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col px-5 pt-6">
      <ProgressBar currentStep={step} totalSteps={QUIZ_TOTAL_STEPS} />

      <div className="mt-2 flex items-center justify-between">
        <div className="-ml-2.5">
          <BackButton href={backHref} />
        </div>
        {isLoggedIn ? (
          <Link
            href="/home"
            className="text-[11px] text-text-muted underline underline-offset-4"
          >
            На главную
          </Link>
        ) : null}
      </div>

      <h1 className="mt-6 text-[17px] leading-snug text-text">{title}</h1>
      {subtitle ? (
        <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
          {subtitle}
        </p>
      ) : null}

      {/* pb-24 — место под sticky-футер «Далее», чтобы последний тайл не уходил под градиент. */}
      <div className="mt-6 flex-1 pb-24">{children}</div>

      <div className="sticky bottom-0 -mx-5 mt-6 flex justify-center bg-gradient-to-t from-cream via-cream/95 to-transparent px-4 pb-6 pt-4">
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          aria-disabled={!canProceed}
          className="h-11 w-full max-w-[210px] disabled:opacity-50"
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
