"use client";

import { PhoneFrame } from "@/components/shared/phone-frame";
import { QuizProvider } from "@/lib/quiz/quiz-context";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuizProvider>
      <PhoneFrame>{children}</PhoneFrame>
    </QuizProvider>
  );
}
