import Link from "next/link";
import { BookOpen } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProfileWithStats } from "@/lib/queries/profile";
import { getProcedures } from "@/lib/queries/procedures";
import {
  formatProcedureDate,
  groupByWeek,
} from "@/lib/utils/journal-grouping";
import {
  PLURAL_DAYS,
  PLURAL_PROCEDURES,
  pluralRu,
} from "@/lib/utils/format";

export default async function JournalPage() {
  const { profile, currentDay } = await getProfileWithStats();
  const procedures = await getProcedures(profile.id);

  if (procedures.length === 0) {
    return (
      <main className="flex min-h-screen flex-col px-5 pb-24 pt-6">
        <FadeIn>
          <h1 className="text-[17px] text-text">Журнал</h1>
          <p className="mt-1 text-[11px] text-text-muted">пока пусто</p>
        </FadeIn>

        <FadeIn
          delay={0.2}
          className="mt-[80px] flex flex-col items-center text-center"
        >
          <div className="flex h-[124px] w-[124px] items-center justify-center rounded-pill bg-olive/[0.05]">
            <BookOpen
              className="h-[50px] w-[50px] text-text-muted"
              strokeWidth={1.2}
              aria-hidden
            />
          </div>
          <p className="mt-8 text-[14px] text-text">
            Здесь появятся ваши процедуры
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            С датой, режимом и заметками.
          </p>
          <p className="text-[11px] text-text-muted">
            Первая запись — после первой процедуры.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} className="mt-10">
          <Button asChild className="h-11 w-full">
            <Link href="/ritual">Сделать первую процедуру</Link>
          </Button>
        </FadeIn>
      </main>
    );
  }

  const groups = groupByWeek(procedures);

  return (
    <main className="flex min-h-screen flex-col px-5 pb-24 pt-6">
      <FadeIn>
        <h1 className="text-[17px] text-text">Журнал</h1>
        <p className="mt-1 text-[11px] text-text-muted">
          {procedures.length} {pluralRu(procedures.length, PLURAL_PROCEDURES)} за{" "}
          {currentDay} {pluralRu(currentDay, PLURAL_DAYS)}
        </p>
      </FadeIn>

      <div className="mt-8 flex flex-col gap-6">
        {groups.map((group) => (
          <section key={group.label}>
            <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
              {group.label}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {group.items.map((proc) => {
                const dateLabel = formatProcedureDate(proc.completed_at);
                const isToday = dateLabel.startsWith("СЕГОДНЯ");
                const minutes = Math.round(proc.duration_seconds / 60);
                return (
                  <article
                    key={proc.id}
                    className="rounded-lg border border-black/8 bg-white px-3 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-[9px] tracking-wide",
                          isToday ? "text-olive" : "text-text-muted",
                        )}
                      >
                        {dateLabel}
                      </p>
                      {proc.is_extra ? (
                        <span className="rounded-pill bg-olive/10 px-1.5 py-0.5 text-[9px] text-olive">
                          Доп.
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-[12px] text-text">{proc.mode}</p>
                    <p className="mt-0.5 text-[10px] text-text-muted">
                      {minutes} минут · {proc.note?.trim() || "без замечаний"}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
