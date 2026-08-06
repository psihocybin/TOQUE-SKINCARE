"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { MiniWeekCalendar } from "@/components/ritual-builder/mini-week-calendar";
import { activateRitual, deleteRitual } from "@/lib/actions/rituals";
import { abbreviateMode, getDeviceColor } from "@/lib/content/device-colors";
import {
  asRitualSchedule,
  buildRitualWeekCells,
  countConfiguredDevices,
  countProceduresPerWeek,
} from "@/lib/ritual-builder/ritual-utils";
import type { Ritual } from "@/lib/supabase/database.types";
import { PLURAL_PROCEDURES, pluralRu } from "@/lib/utils/format";

type Props = { ritual: Ritual };

export function RitualListCard({ ritual }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schedule = asRitualSchedule(ritual.schedule);
  const weekCells = buildRitualWeekCells(schedule, abbreviateMode);
  const deviceSlugs = schedule
    .filter((c) => c.modes.some((m) => m.days.length > 0))
    .map((c) => c.deviceSlug);
  const deviceCount = countConfiguredDevices(schedule);
  const perWeek = countProceduresPerWeek(schedule);

  function handleActivate() {
    setError(null);
    startTransition(async () => {
      const res = await activateRitual(ritual.id);
      if (!res.ok) setError(res.error ?? "Не удалось активировать");
      else router.refresh();
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteRitual(ritual.id);
      if (!res.ok) {
        setError(res.error ?? "Не удалось удалить");
        setConfirmingDelete(false);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div
      className={
        "rounded-2xl bg-white p-4 " +
        (ritual.is_active ? "border-[1.2px] border-olive/40" : "border border-black/7")
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {ritual.is_active ? (
            <span className="rounded-full bg-olive/12 px-2 py-0.5 text-[9px] font-semibold text-olive">
              Активен
            </span>
          ) : null}
        </div>
        <Link
          href={`/ritual-builder?editId=${ritual.id}`}
          aria-label="Редактировать ритуал"
          className="text-text-muted"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>

      <p className="mt-1 text-[14px] font-bold text-text">{ritual.name}</p>

      <div className="mt-2.5 flex items-center gap-1.5">
        {deviceSlugs.map((slug) => {
          const color = getDeviceColor(slug);
          return (
            <span
              key={slug}
              className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[8px] font-bold ${color.bg} ${color.text}`}
            >
              {slug[0]?.toUpperCase()}
            </span>
          );
        })}
        <span className="ml-auto text-[10px] text-text-muted">
          {deviceCount} {deviceCount === 1 ? "устройство" : "устройства"} ·{" "}
          {pluralRu(perWeek, PLURAL_PROCEDURES)}/нед
        </span>
      </div>

      <div className="mt-3">
        <MiniWeekCalendar cells={weekCells} />
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-black/6 pt-3">
        {!ritual.is_active ? (
          <button
            type="button"
            onClick={handleActivate}
            disabled={isPending}
            className="rounded-full bg-black/6 px-3 py-1 text-[11px] text-text-muted"
          >
            Активировать
          </button>
        ) : null}
        <Link
          href={`/ritual-builder?editId=${ritual.id}`}
          className="text-[11px] text-olive underline underline-offset-2"
        >
          Изменить
        </Link>
        {confirmingDelete ? (
          <span className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-rose underline underline-offset-2"
            >
              Да, удалить
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="text-text-muted"
            >
              Отмена
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="text-[11px] text-rose underline underline-offset-2"
          >
            Удалить
          </button>
        )}
      </div>

      {error ? <p className="mt-2 text-[10px] text-rose">{error}</p> : null}
    </div>
  );
}
