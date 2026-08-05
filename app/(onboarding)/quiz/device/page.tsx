"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { QuizShellV2 } from "@/components/quiz/quiz-shell-v2";
import { DeviceImage } from "@/components/shared/device-image";
import { useQuiz, type DeviceId } from "@/lib/quiz/quiz-context";
import { deviceEnumToSlug, getDeviceBySlug } from "@/lib/content/devices";
import { cn } from "@/lib/utils";

const DEVICES: DeviceId[] = [
  "NUO",
  "NUO_PRO",
  "LUMERA",
  "ELARA",
  "PULSAR",
  "ANIMA",
  "AURA",
  "NOVA",
  "AERIS",
  "QUANTUM",
  "VIBE",
  "LYRA",
  "SYLVA",
];

export default function QuizDevicePage() {
  const router = useRouter();
  const { answers, toggleDevice } = useQuiz();

  return (
    <QuizShellV2
      step={1}
      title="Какое устройство у вас есть?"
      subtitle="Выберите все — программа подстроится"
      backHref="/welcome"
      canProceed={answers.devices.length > 0}
      onNext={() => router.push("/quiz/name")}
    >
      <div className="flex flex-col gap-[10px]">
        {DEVICES.map((id) => {
          const slug = deviceEnumToSlug(id);
          const device = getDeviceBySlug(slug);
          const isSelected = answers.devices.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleDevice(id)}
              className={cn(
                "flex min-h-[56px] items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors",
                isSelected
                  ? "border-[1.5px] border-olive bg-olive/5"
                  : "border border-transparent",
              )}
            >
              <DeviceImage slug={slug} size={52} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-text">
                  {device?.name ?? id}
                </span>
                {device?.subtitle ? (
                  <span className="mt-0.5 block truncate text-xs text-text-muted">
                    {device.subtitle}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  isSelected ? "bg-olive" : "border border-black/15 bg-white",
                )}
                aria-hidden
              >
                {isSelected ? (
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </QuizShellV2>
  );
}
