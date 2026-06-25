"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { updateNotificationSettings } from "@/lib/actions/settings";
import type { NotificationSettings } from "@/lib/supabase/database.types";

type Props = {
  initial: NotificationSettings;
  preferredTimeLabel: string;
};

type Field = keyof NotificationSettings;

const ITEMS: ReadonlyArray<{
  field: Field;
  title: string;
  describe: (preferredTimeLabel: string) => string;
}> = [
  {
    field: "reminders",
    title: "Напоминания",
    describe: (label) => `Каждый день в ${label}`,
  },
  {
    field: "tips",
    title: "Совет дня",
    describe: () => "Утром после процедуры",
  },
  {
    field: "weekly_report",
    title: "Еженедельный отчёт",
    describe: () => "По воскресеньям",
  },
];

export function NotificationToggles({ initial, preferredTimeLabel }: Props) {
  const [state, setState] = useState<NotificationSettings>(initial);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(field: Field, value: boolean) {
    const next = { ...state, [field]: value };
    setState(next);
    setError(null);

    const payload = {
      remindersEnabled: field === "reminders" ? value : undefined,
      tipsEnabled: field === "tips" ? value : undefined,
      weeklyReportEnabled: field === "weekly_report" ? value : undefined,
    };

    startTransition(async () => {
      const res = await updateNotificationSettings(payload);
      if (!res.ok) {
        setState(state);
        setError(res.error ?? "Не удалось сохранить");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {ITEMS.map((item) => (
        <label
          key={item.field}
          className="flex items-center justify-between rounded-lg border border-black/8 bg-white px-4 py-3.5"
        >
          <div>
            <p className="text-[12px] text-text">{item.title}</p>
            <p className="mt-0.5 text-[9px] text-text-muted">
              {item.describe(preferredTimeLabel)}
            </p>
          </div>
          <Switch
            checked={state[item.field]}
            onCheckedChange={(checked) => toggle(item.field, checked)}
          />
        </label>
      ))}
      {error ? (
        <p className="text-[10px] text-rose">{error}</p>
      ) : null}
    </div>
  );
}
