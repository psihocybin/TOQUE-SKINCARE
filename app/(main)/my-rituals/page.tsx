import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { RitualListCard } from "@/components/rituals/ritual-list-card";
import { getRituals } from "@/lib/actions/rituals";

const MAX_RITUALS = 5;

export default async function MyRitualsPage() {
  const rituals = await getRituals();
  const count = rituals.length;

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-6">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/ritual-home" />
        </div>
        <p className="text-[14px] font-bold text-text">Мои ритуалы</p>
        <span className="absolute right-0 top-0 rounded-full bg-black/6 px-2.5 py-1 text-[9px] text-text-muted">
          {count}/{MAX_RITUALS}
        </span>
      </header>

      <div className="mt-6 flex flex-col gap-3">
        {rituals.map((ritual) => (
          <RitualListCard key={ritual.id} ritual={ritual} />
        ))}
      </div>

      {count < MAX_RITUALS ? (
        <Link
          href="/ritual-builder"
          className="mt-3 flex h-11 items-center justify-center rounded-lg border border-dashed border-olive/30 bg-olive/[0.04] text-[12px] text-olive"
        >
          + Создать новый ритуал
        </Link>
      ) : (
        <p className="mt-3 text-center text-[11px] text-text-muted">
          Достигнут лимит ({MAX_RITUALS}/{MAX_RITUALS}). Удалите ритуал, чтобы создать новый.
        </p>
      )}

      {count > 0 && count < MAX_RITUALS ? (
        <p className="mt-1.5 text-center text-[9px] text-text-muted">
          Можно создать ещё {MAX_RITUALS - count}{" "}
          {MAX_RITUALS - count === 1 ? "ритуал" : "ритуала"} ({count} из {MAX_RITUALS})
        </p>
      ) : null}

      {count === 0 ? (
        <p className="mt-6 text-center text-[12px] text-text-muted">
          Ритуалов пока нет — соберите первый в конструкторе
        </p>
      ) : (
        <div className="mt-6 rounded-lg bg-black/[0.03] p-4">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.75} aria-hidden />
            <p className="text-[11px] font-semibold text-text">Совет</p>
          </div>
          <p className="mt-1 text-[11px] text-text-muted">
            Создайте «Утренний» и «Вечерний» ритуалы и переключайтесь между ними
          </p>
        </div>
      )}
    </main>
  );
}
