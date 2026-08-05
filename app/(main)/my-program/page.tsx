import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getProcedures } from "@/lib/queries/procedures";
import { DRIP_CAMPAIGN } from "@/lib/content/drip-campaign";
import {
  PLURAL_PROCEDURES,
  pluralRu,
} from "@/lib/utils/format";

const TOTAL_DAYS = 30;

type DayStatus =
  | "done"
  | "extra"
  | "skipped"
  | "today"
  | "rest_past"
  | "ahead"
  | "final";

function classifyDay(
  day: number,
  currentDay: number,
  doneScheduledDays: Set<number>,
  extraDays: Set<number>,
): DayStatus {
  // Финал — только когда сам день ещё не наступил или наступил сегодня.
  if (day === TOTAL_DAYS && day > currentDay) return "final";
  if (day === currentDay) return "today";
  if (day > currentDay) return day === TOTAL_DAYS ? "final" : "ahead";

  // Прошлое.
  if (extraDays.has(day)) return "extra";
  const scheduledType = DRIP_CAMPAIGN[day - 1]?.type;
  if (scheduledType === "procedure") {
    return doneScheduledDays.has(day) ? "done" : "skipped";
  }
  // Прошедший день отдыха без extra — отмечать не нужно, показываем тихо.
  return "rest_past";
}

const STATE_STYLES: Record<DayStatus, string> = {
  done: "bg-olive text-cream",
  extra: "bg-olive/40 text-cream",
  skipped: "bg-rose/20 border border-rose/40 text-rose/70",
  today: "bg-transparent border-2 border-olive text-olive font-medium",
  rest_past: "bg-black/[0.04] border border-black/8 text-text-muted/50",
  ahead: "bg-cream-dark border border-black/12 text-text-muted",
  final: "bg-rose/15 border border-rose/40 text-rose/80",
};

export default async function MyProgramPage() {
  const { profile, currentDay, completedProcedures } =
    await getProfileWithStats();
  const procedures = await getProcedures(profile.id);

  const doneScheduledDays = new Set<number>();
  const extraDays = new Set<number>();
  for (const p of procedures) {
    if (p.is_extra) extraDays.add(p.day_number);
    else doneScheduledDays.add(p.day_number);
  }

  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);
  const skippedCount = days.filter(
    (d) =>
      classifyDay(d, currentDay, doneScheduledDays, extraDays) === "skipped",
  ).length;

  const nudge =
    skippedCount === 0
      ? null
      : skippedCount <= 2
        ? `${skippedCount} пропущено — это нормально. Продолжайте.`
        : "Пропущено несколько процедур. Вернитесь к ритуалу сегодня.";

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/profile" />
        </div>
        <p className="text-[14px] text-text">Моя программа</p>
      </header>

      <p className="mt-1 text-center text-[11px] text-text-muted">
        День {currentDay} из {TOTAL_DAYS} · {completedProcedures}{" "}
        {pluralRu(completedProcedures, PLURAL_PROCEDURES)} сделано
      </p>

      {nudge ? (
        <p className="mt-2 text-center text-[11px] text-rose/70">{nudge}</p>
      ) : null}

      <FadeIn delay={0.2} className="mt-6">
        <div className="grid grid-cols-5 gap-2 px-1">
          {days.map((day) => {
            const state = classifyDay(
              day,
              currentDay,
              doneScheduledDays,
              extraDays,
            );
            const isFinal = state === "final";
            return (
              <div
                key={day}
                className="flex flex-col items-center"
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-pill text-[10px]",
                    STATE_STYLES[state],
                  )}
                >
                  {day}
                </div>
                {isFinal ? (
                  <span
                    className="mt-1 block h-1 w-1 rounded-pill bg-rose"
                    aria-hidden
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </FadeIn>

      <section className="mt-8 px-1">
        <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
          Условные обозначения
        </p>
        <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-3 text-[9px] text-text-muted">
          {/* Левая колонка */}
          <LegendItem className={STATE_STYLES.done} label="сделано" />
          <LegendItem className={STATE_STYLES.today} label="сегодня" />
          <LegendItem
            className={STATE_STYLES.extra}
            label="доп. процедура"
          />
          <LegendItem className={STATE_STYLES.ahead} label="впереди" />
          <LegendItem className={STATE_STYLES.skipped} label="пропущено" />
          <LegendItem
            className={STATE_STYLES.final}
            label="финал программы"
          />
        </div>
      </section>
    </main>
  );
}

function LegendItem({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-block h-3 w-3 rounded-pill", className)} />
      <span>{label}</span>
    </div>
  );
}
