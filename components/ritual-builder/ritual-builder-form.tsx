"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Activity,
  ArrowUp,
  CloudSun,
  Droplets,
  Heart,
  Crown,
  type LucideIcon,
  Moon,
  Sparkles,
  Sun,
  Sunrise,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { DeviceImage } from "@/components/shared/device-image";
import { getDeviceBySlug } from "@/lib/content/devices";
import { getProtocolBySlug } from "@/lib/content/protocols";
import { saveCustomSchedule } from "@/lib/actions/ritual-builder";
import {
  generateRecommendedSchedule,
  type ScheduleDay,
} from "@/lib/ritual-builder/generate-schedule";
import {
  WEEKDAYS,
  WEEKDAY_LABELS,
  type BuilderGoal,
  type CustomSchedule,
  type DeviceSchedule,
  type SessionTime,
  type TimeBudget,
  type Weekday,
} from "@/lib/ritual-builder/types";
import { cn } from "@/lib/utils";

const GOALS: { value: BuilderGoal; label: string; icon: LucideIcon }[] = [
  { value: "cleansing", label: "Очищение", icon: Sparkles },
  { value: "tone", label: "Тонус", icon: Zap },
  { value: "glow", label: "Сияние", icon: Sun },
  { value: "lymph", label: "Лимфодренаж", icon: Droplets },
  { value: "lift", label: "Лифтинг", icon: ArrowUp },
  { value: "recovery", label: "Восстановление", icon: Heart },
  { value: "scalp", label: "Скальп", icon: Crown },
  { value: "body", label: "Тело", icon: Activity },
];
// Отмечены как рекомендуемые для старта — подходят большинству устройств.
const RECOMMENDED_GOALS: BuilderGoal[] = ["cleansing", "tone"];

const SESSION_TIMES: { value: SessionTime; label: string; icon: LucideIcon }[] = [
  { value: "morning", label: "Утром", icon: Sunrise },
  { value: "midday", label: "Днём", icon: CloudSun },
  { value: "evening", label: "Вечером", icon: Moon },
];

const TIME_STEPS: TimeBudget[] = [15, 30, 60];

function tagClassName(day: ScheduleDay): string {
  if (day.isRest) return "bg-black/6 text-text-muted";
  return "bg-olive/15 text-olive";
}

type Props = {
  ownedDevices: { slug: string; name: string }[];
  initialSchedule: CustomSchedule | null;
};

export function RitualBuilderForm({ ownedDevices, initialSchedule }: Props) {
  const [goals, setGoals] = useState<BuilderGoal[]>(initialSchedule?.goals ?? []);
  const [timeMinutes, setTimeMinutes] = useState<TimeBudget>(
    initialSchedule?.timeMinutes ?? 30,
  );
  const [sessionTimes, setSessionTimes] = useState<SessionTime[]>(
    initialSchedule?.sessionTimes ?? [],
  );
  const [activeDeviceSlugs, setActiveDeviceSlugs] = useState<string[]>(
    initialSchedule && initialSchedule.deviceSchedules.length > 0
      ? initialSchedule.deviceSchedules.map((d) => d.deviceSlug)
      : ownedDevices.map((d) => d.slug),
  );
  const [deviceSelections, setDeviceSelections] = useState<
    Record<string, { modeName: string; days: Weekday[] }>
  >(() => {
    const init: Record<string, { modeName: string; days: Weekday[] }> = {};
    for (const ds of initialSchedule?.deviceSchedules ?? []) {
      init[ds.deviceSlug] = { modeName: ds.modeName, days: ds.days };
    }
    return init;
  });

  const [isPending, startTransition] = useTransition();
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  function toggleGoal(goal: BuilderGoal) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  }

  function toggleSessionTime(time: SessionTime) {
    setSessionTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  }

  function toggleDeviceActive(slug: string) {
    setActiveDeviceSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function setDeviceMode(slug: string, modeName: string) {
    setDeviceSelections((prev) => ({
      ...prev,
      [slug]: { modeName, days: prev[slug]?.days ?? [] },
    }));
  }

  function toggleDeviceDay(slug: string, day: Weekday, defaultMode: string) {
    setDeviceSelections((prev) => {
      const current = prev[slug] ?? { modeName: defaultMode, days: [] };
      const days = current.days.includes(day)
        ? current.days.filter((d) => d !== day)
        : [...current.days, day];
      return { ...prev, [slug]: { modeName: current.modeName, days } };
    });
  }

  function resetDevice(slug: string) {
    setDeviceSelections((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }

  const recommendedPlan = useMemo(
    () => generateRecommendedSchedule(goals, timeMinutes, activeDeviceSlugs),
    [goals, timeMinutes, activeDeviceSlugs],
  );

  function handleSave() {
    const deviceSchedules: DeviceSchedule[] = activeDeviceSlugs
      .map((slug) => {
        const protocol = getProtocolBySlug(slug);
        const sel = deviceSelections[slug];
        const modeName = sel?.modeName || protocol?.modes[0]?.name;
        if (!modeName) return null;
        return { deviceSlug: slug, modeName, days: sel?.days ?? [] };
      })
      .filter((d): d is DeviceSchedule => Boolean(d));

    const schedule: CustomSchedule = {
      goals,
      timeMinutes,
      sessionTimes,
      deviceSchedules,
    };

    setSaveState("idle");
    startTransition(async () => {
      const res = await saveCustomSchedule(schedule);
      setSaveState(res.ok ? "saved" : "error");
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
      {/* Блок А — цели */}
      <div className="rounded-2xl bg-white p-4">
        <p className="text-[13px] font-semibold text-text">
          Какие цели вам интересны?
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {GOALS.map((g) => {
            const isSelected = goals.includes(g.value);
            const Icon = g.icon;
            return (
              <button
                key={g.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleGoal(g.value)}
                className={cn(
                  "relative rounded-xl border p-3 text-left transition-colors",
                  isSelected
                    ? "border-olive bg-olive/5"
                    : "border-black/10 bg-white",
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    isSelected ? "text-olive" : "text-text-muted",
                  )}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <p className="mt-1.5 text-[12px] font-semibold text-text">
                  {g.label}
                </p>
                {RECOMMENDED_GOALS.includes(g.value) ? (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-olive/10 px-1.5 py-0.5 text-[8px] uppercase tracking-wide text-olive">
                    Рекомендуем
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Блок Б — расписание */}
      <div className="rounded-2xl bg-white p-4">
        <p className="text-[13px] font-semibold text-text">Ваше расписание</p>

        <div className="mt-5 px-1">
          <Slider
            value={[TIME_STEPS.indexOf(timeMinutes)]}
            min={0}
            max={2}
            step={1}
            onValueChange={([i]) => setTimeMinutes(TIME_STEPS[i ?? 1] ?? 30)}
          />
          <div className="mt-2 flex justify-between text-[10px] text-text-muted">
            {TIME_STEPS.map((t) => (
              <span
                key={t}
                className={cn(t === timeMinutes && "font-semibold text-olive")}
              >
                {t} мин
              </span>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[12px] text-text-muted">Когда выполнять?</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SESSION_TIMES.map((s) => {
            const isSelected = sessionTimes.includes(s.value);
            const Icon = s.icon;
            return (
              <button
                key={s.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleSessionTime(s.value)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-3 transition-colors",
                  isSelected
                    ? "border-olive bg-olive/5"
                    : "border-black/10 bg-white",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isSelected ? "text-olive" : "text-text-muted",
                  )}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="text-[11px] text-text">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Блок В — устройства */}
      <div className="rounded-2xl bg-white p-4">
        <p className="text-[13px] font-semibold text-text">Ваши устройства</p>
        <div className="mt-3 flex flex-col gap-3">
          {ownedDevices.map((d) => (
            <div key={d.slug} className="flex items-center gap-3">
              <DeviceImage slug={d.slug} size={36} />
              <span className="flex-1 text-[13px] text-text">{d.name}</span>
              <Switch
                checked={activeDeviceSlugs.includes(d.slug)}
                onCheckedChange={() => toggleDeviceActive(d.slug)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Секция 2 — рекомендованный план */}
      <div className="rounded-2xl bg-white p-4">
        <p className="text-[13px] font-semibold text-text">
          Рекомендованный план
        </p>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {recommendedPlan.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-1.5">
              <span className="text-[9px] text-text-muted">
                {WEEKDAY_LABELS[day.day]}
              </span>
              <span
                className={cn(
                  "flex h-9 w-full items-center justify-center rounded-lg px-0.5 text-center text-[8px] leading-tight",
                  tagClassName(day),
                )}
              >
                {day.isRest ? "Отдых" : day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Секция 3 — конструктор по режимам */}
      {activeDeviceSlugs.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="px-1 text-[13px] font-semibold text-text">
            Конструктор по режимам
          </p>
          {activeDeviceSlugs.map((slug) => {
            const device = getDeviceBySlug(slug);
            const protocol = getProtocolBySlug(slug);
            if (!device || !protocol || protocol.modes.length === 0) return null;
            const selection = deviceSelections[slug];
            const selectedModeName = selection?.modeName ?? protocol.modes[0]?.name ?? "";
            const selectedDays = selection?.days ?? [];

            return (
              <div key={slug} className="rounded-2xl bg-white p-4">
                <div className="flex items-center gap-2.5">
                  <DeviceImage slug={slug} size={32} />
                  <span className="text-[13px] font-semibold text-text">
                    {device.name}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {protocol.modes.map((mode) => {
                    const isSelected = mode.name === selectedModeName;
                    return (
                      <button
                        key={mode.name}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setDeviceMode(slug, mode.name)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                          isSelected
                            ? "border-olive bg-olive/10 text-text"
                            : "border-black/15 bg-white text-text-muted",
                        )}
                      >
                        {mode.displayName ?? mode.name}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-1.5">
                  {WEEKDAYS.map((day) => {
                    const isOn = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={isOn}
                        onClick={() =>
                          toggleDeviceDay(slug, day, selectedModeName)
                        }
                        className={cn(
                          "flex h-8 items-center justify-center rounded-lg text-[10px] transition-colors",
                          isOn
                            ? "bg-olive text-cream"
                            : "bg-black/[0.04] text-text-muted",
                        )}
                      >
                        {WEEKDAY_LABELS[day]}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <p className="text-[10px] text-text-muted">
                    {protocol.frequency.label}
                  </p>
                  <button
                    type="button"
                    onClick={() => resetDevice(slug)}
                    className="text-[10px] text-text-muted underline underline-offset-4"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
        </div>
      </div>

      <div className="sticky bottom-0 bg-cream px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="h-12 w-full rounded-full"
        >
          {isPending
            ? "Сохраняем…"
            : saveState === "saved"
              ? "Сохранено"
              : "Сохранить ритуал"}
        </Button>
        {saveState === "error" ? (
          <p className="mt-1.5 text-center text-[11px] text-rose">
            Не удалось сохранить. Попробуйте ещё раз.
          </p>
        ) : null}
      </div>
    </div>
  );
}
