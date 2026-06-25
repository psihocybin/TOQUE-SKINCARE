"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OptionTile } from "@/components/shared/option-tile";
import { updateProgramSettings } from "@/lib/actions/settings";

type Frequency = "low" | "medium" | "daily";

type Props = {
  initial: Frequency | null;
};

const OPTIONS: ReadonlyArray<{
  value: Frequency;
  label: string;
  sublabel: string;
}> = [
  { value: "low", label: "2–3 раза в неделю", sublabel: "Мягкое начало" },
  {
    value: "medium",
    label: "4–5 раз в неделю",
    sublabel: "Оптимальный результат",
  },
  {
    value: "daily",
    label: "Каждый день",
    sublabel: "Максимальная эффективность",
  },
];

export function FrequencyPickerClient({ initial }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Frequency | null>(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSelect(value: Frequency) {
    if (pending) return;
    setSelected(value);
    setError(null);
    startTransition(async () => {
      const res = await updateProgramSettings({ frequency: value });
      if (!res.ok) {
        setError(res.error ?? "Не удалось сохранить");
        return;
      }
      router.back();
      router.refresh();
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-2.5">
      {OPTIONS.map((opt) => (
        <OptionTile
          key={opt.value}
          label={opt.label}
          sublabel={opt.sublabel}
          selected={selected === opt.value}
          onClick={() => handleSelect(opt.value)}
        />
      ))}
      {error ? (
        <p className="text-center text-[11px] text-rose">{error}</p>
      ) : null}
      {pending ? (
        <p className="text-center text-[10px] text-text-muted">Сохраняем…</p>
      ) : null}
    </div>
  );
}
