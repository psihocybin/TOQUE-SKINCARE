import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { NotificationToggles } from "@/components/settings/notification-toggles";
import { getProfileWithStats } from "@/lib/queries/profile";
import { DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/supabase/database.types";

const TIME_LABELS: Record<"morning" | "evening" | "flexible", string> = {
  morning: "09:00",
  evening: "20:00",
  flexible: "по выбору",
};

const FREQUENCY_LABELS: Record<"low" | "medium" | "daily", string> = {
  low: "2–3 в неделю",
  medium: "4–5 в неделю",
  daily: "каждый день",
};

export default async function SettingsPage() {
  const { profile } = await getProfileWithStats();

  const timeKey = profile.preferred_time ?? "morning";
  const timeLabel = TIME_LABELS[timeKey];
  const frequencyLabel = profile.frequency
    ? FREQUENCY_LABELS[profile.frequency]
    : "не задано";

  const notif = profile.notification_settings ?? DEFAULT_NOTIFICATION_SETTINGS;

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/profile" />
        </div>
        <p className="text-[14px] text-text">Настройки</p>
      </header>

      <FadeIn className="mt-8">
        <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
          Уведомления
        </p>
        <div className="mt-3">
          <NotificationToggles
            initial={notif}
            preferredTimeLabel={timeLabel}
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-8">
        <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
          Программа
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <ProgramRow
            href="/settings/time"
            label="Время процедур"
            valueLabel={timeLabel}
          />
          <ProgramRow
            href="/settings/frequency"
            label="Частота"
            valueLabel={frequencyLabel}
          />
          <ProgramRow
            href="/settings/pause"
            label="Пауза программы"
            valueLabel=""
          />
        </div>
      </FadeIn>
    </main>
  );
}

function ProgramRow({
  href,
  label,
  valueLabel,
}: {
  href: string;
  label: string;
  valueLabel: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-black/8 bg-white px-4 py-3.5 transition-colors hover:bg-black/[0.02]"
    >
      <span className="text-[12px] text-text">{label}</span>
      <span className="flex items-center gap-1 text-[11px] text-text-muted">
        {valueLabel}
        <ChevronRight
          className="h-3.5 w-3.5"
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
    </Link>
  );
}
