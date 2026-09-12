"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  CloudSun,
  Info,
  Moon,
  Pencil,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/shared/back-button";
import { DeviceImage } from "@/components/shared/device-image";
import { MiniWeekCalendar } from "@/components/ritual-builder/mini-week-calendar";
import { getProtocolBySlug } from "@/lib/content/protocols";
import { abbreviateMode, getDeviceColor } from "@/lib/content/device-colors";
import {
  activateRitual,
  saveRitual,
  type DeviceRitualConfig,
  type ModeSchedule,
  type RitualSchedule,
} from "@/lib/actions/rituals";
import {
  buildRitualSequence,
  buildRitualWeekCells,
  isDeviceConfigured,
} from "@/lib/ritual-builder/ritual-utils";
import { WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/ritual-builder/types";
import { cn } from "@/lib/utils";

// "Днём" в мокапе — 3-я кнопка времени суток, но в схеме БД у sessionTime
// только 3 значения: morning/evening/flexible (нет отдельного "day"). "Днём"
// заведомо маппится на flexible — тот же смысл, что уже есть в приложении:
// resolveSessionTimeSlot('flexible', now) сам бакетит по текущему часу,
// и в районе дня как раз попадёт в "день".
type SessionTimeChoice = ModeSchedule["sessionTime"];

const TIME_BUTTONS: { value: SessionTimeChoice; label: string; icon: LucideIcon }[] = [
  { value: "morning", label: "Утром", icon: Sun },
  { value: "flexible", label: "Днём", icon: CloudSun },
  { value: "evening", label: "Вечером", icon: Moon },
];

type Props = {
  ritualId?: string;
  initialName: string;
  ownedDevices: { slug: string; name: string }[];
  initialSchedule: RitualSchedule;
};

export function RitualConstructor({
  ritualId,
  initialName,
  ownedDevices,
  initialSchedule,
}: Props) {
  const router = useRouter();

  const [ritualName, setRitualName] = useState(initialName);
  const [editingName, setEditingName] = useState(false);

  const [deviceConfigs, setDeviceConfigs] = useState<DeviceRitualConfig[]>(() => {
    const bySlug = new Map(initialSchedule.map((c) => [c.deviceSlug, c]));
    return ownedDevices.map(
      (d) =>
        bySlug.get(d.slug) ?? {
          deviceSlug: d.slug,
          color: getDeviceColor(d.slug).hex,
          modes: [],
        },
    );
  });

  const [activeDeviceSlug, setActiveDeviceSlug] = useState(ownedDevices[0]?.slug ?? "");
  const [activeModeName, setActiveModeName] = useState(() => {
    const config = initialSchedule.find((c) => c.deviceSlug === ownedDevices[0]?.slug);
    const protocol = getProtocolBySlug(ownedDevices[0]?.slug ?? "");
    return config?.modes[0]?.modeName ?? protocol?.modes[0]?.name ?? "";
  });

  const [step, setStep] = useState<"builder" | "complete">("builder");
  const [savedRitualId, setSavedRitualId] = useState<string | undefined>(ritualId);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function selectDevice(slug: string) {
    setActiveDeviceSlug(slug);
    const config = deviceConfigs.find((c) => c.deviceSlug === slug);
    const protocol = getProtocolBySlug(slug);
    setActiveModeName(config?.modes[0]?.modeName ?? protocol?.modes[0]?.name ?? "");
  }

  const activeConfig = deviceConfigs.find((c) => c.deviceSlug === activeDeviceSlug);
  const activeProtocol = getProtocolBySlug(activeDeviceSlug);
  const activeModeObj =
    activeProtocol?.modes.find((m) => m.name === activeModeName) ?? activeProtocol?.modes[0];
  const activeModeSchedule = activeConfig?.modes.find((m) => m.modeName === activeModeObj?.name);

  // Находит запись активного режима в деталях устройства и применяет к ней
  // mutate — создаёт запись с дефолтами, если режим ещё ни разу не трогали.
  function updateActiveMode(mutate: (mode: ModeSchedule) => ModeSchedule) {
    if (!activeModeObj) return;
    setDeviceConfigs((prev) =>
      prev.map((c) => {
        if (c.deviceSlug !== activeDeviceSlug) return c;
        const existing = c.modes.find((m) => m.modeName === activeModeObj.name);
        const base: ModeSchedule = existing ?? {
          modeName: activeModeObj.name,
          displayName: activeModeObj.displayName ?? activeModeObj.name,
          sessionTime: "flexible",
          days: [],
        };
        const updated = mutate(base);
        const modes = existing
          ? c.modes.map((m) => (m.modeName === activeModeObj.name ? updated : m))
          : [...c.modes, updated];
        return { ...c, modes };
      }),
    );
  }

  function toggleDay(day: Weekday) {
    updateActiveMode((mode) => ({
      ...mode,
      days: mode.days.includes(day) ? mode.days.filter((d) => d !== day) : [...mode.days, day],
    }));
  }

  function setSessionTime(time: SessionTimeChoice) {
    updateActiveMode((mode) => ({ ...mode, sessionTime: time }));
  }

  function resetActiveMode() {
    if (!activeModeObj) return;
    setDeviceConfigs((prev) =>
      prev.map((c) =>
        c.deviceSlug === activeDeviceSlug
          ? { ...c, modes: c.modes.filter((m) => m.modeName !== activeModeObj.name) }
          : c,
      ),
    );
  }

  function scheduledDeviceColorsForDay(day: Weekday): string[] {
    const slugs = new Set<string>();
    for (const c of deviceConfigs) {
      if (c.modes.some((m) => m.days.includes(day))) slugs.add(c.deviceSlug);
    }
    return Array.from(slugs);
  }

  const activeDeviceSummary = (activeConfig?.modes ?? [])
    .flatMap((m) => m.days.map((d) => ({ day: d, label: abbreviateMode(m.displayName) })))
    .sort((a, b) => WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day))
    .map((x) => `${WEEKDAY_LABELS[x.day]} ${x.label}`)
    .join(", ");

  const weekCells = buildRitualWeekCells(deviceConfigs, abbreviateMode);
  const sequence = buildRitualSequence(deviceConfigs);

  function handleSave() {
    setSaveError(null);
    const schedule = deviceConfigs.filter((c) => c.modes.some((m) => m.days.length > 0));
    if (schedule.length === 0) {
      setSaveError("Настройте хотя бы один режим с днями, чтобы сохранить ритуал");
      return;
    }
    startTransition(async () => {
      const res = await saveRitual({
        id: savedRitualId,
        name: ritualName.trim() || "Мой ритуал",
        schedule,
        applyNow: false,
      });
      if (res.ok) {
        setSavedRitualId(res.ritualId);
        setStep("complete");
      } else {
        setSaveError(res.error ?? "Не удалось сохранить. Попробуйте ещё раз.");
      }
    });
  }

  function handleApplyNow() {
    if (!savedRitualId) return;
    startTransition(async () => {
      const res = await activateRitual(savedRitualId);
      if (res.ok) {
        router.push("/ritual-home");
      } else {
        setSaveError(res.error ?? "Не удалось активировать ритуал");
      }
    });
  }

  if (ownedDevices.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-[14px] text-text">Сначала добавьте устройство</p>
        <p className="mt-1 text-[12px] text-text-muted">
          Ритуал собирается из ваших приборов TOQUE
        </p>
        <a
          href="/my-devices"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-olive px-5 text-[13px] text-cream"
        >
          Добавить устройство
        </a>
      </main>
    );
  }

  if (step === "complete") {
    return (
      <main className="flex min-h-screen flex-col px-4 pb-10 pt-10">
        <h1 className="text-center text-[22px] font-bold text-text">Ритуал сохранён!</h1>
        <p className="mt-1 text-center text-[13px] text-text-muted">
          Изменить можно в любой момент.
        </p>

        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[12px] font-bold text-text">{ritualName}</p>

          <div className="mt-3">
            <MiniWeekCalendar cells={weekCells} />
          </div>

          <div className="mt-4 border-t border-black/6 pt-3">
            <p className="text-[8px] uppercase tracking-[1px] text-text-muted">
              Последовательность
            </p>
            <div className="mt-2 flex items-center gap-1 overflow-x-auto pb-1">
              {sequence.map((s, i) => {
                const color = getDeviceColor(s.deviceSlug);
                return (
                  <div key={`${s.deviceSlug}-${s.modeName}`} className="flex items-center gap-1">
                    <div
                      className={cn(
                        "relative flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg",
                        color.bg,
                      )}
                    >
                      <span
                        className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold text-white"
                        style={{ backgroundColor: color.hex }}
                      >
                        {i + 1}
                      </span>
                      <span className={cn("mt-2 text-[9px] font-semibold", color.text)}>
                        {s.deviceSlug.toUpperCase()}
                      </span>
                      <span className={cn("text-[8px]", color.text)}>
                        {abbreviateMode(s.displayName)}
                      </span>
                    </div>
                    {i < sequence.length - 1 ? (
                      <span className="text-[12px] text-text-muted">›</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {saveError ? (
          <p className="mt-3 text-center text-[11px] text-rose">{saveError}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5">
          <Button
            type="button"
            onClick={handleApplyNow}
            disabled={isPending}
            className="h-[38px] w-full rounded-full"
          >
            {isPending ? "Применяем…" : "Применить сейчас"}
          </Button>
          <button
            type="button"
            onClick={() => router.push("/ritual-home")}
            className="flex h-[38px] w-full items-center justify-center rounded-full border border-black/12 bg-white text-[12px] text-text"
          >
            Применить позже
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col pb-24 pt-6">
      <header className="relative flex items-center justify-center px-4">
        <div className="absolute left-2 top-0">
          <BackButton href="/my-rituals" />
        </div>
        <p className="text-[14px] font-bold text-text">Конструктор ритуала</p>
      </header>

      <div className="mt-4 flex flex-col gap-4 px-4">
        {/* Название ритуала */}
        <div className="flex h-11 items-center justify-between rounded-lg bg-white px-3.5 shadow-sm">
          {editingName ? (
            <input
              autoFocus
              value={ritualName}
              onChange={(e) => setRitualName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
              className="flex-1 bg-transparent text-[13px] text-text outline-none"
            />
          ) : (
            <span className="text-[13px] text-text">{ritualName}</span>
          )}
          <button
            type="button"
            aria-label="Изменить название"
            onClick={() => setEditingName((v) => !v)}
            className="text-text-muted"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        {/* Выбор устройства */}
        <div>
          <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
            Выберите устройство
          </p>
          <div className="mt-2 flex gap-2.5 overflow-x-auto pb-1">
            {ownedDevices.map((d) => {
              const color = getDeviceColor(d.slug);
              const isActive = d.slug === activeDeviceSlug;
              const config = deviceConfigs.find((c) => c.deviceSlug === d.slug);
              const configured = isDeviceConfigured(config);
              return (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => selectDevice(d.slug)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative flex h-[76px] w-16 shrink-0 flex-col items-center justify-center gap-1.5 rounded-[10px] border backdrop-blur-md transition-colors",
                    isActive
                      ? "border-olive/50 bg-olive/30"
                      : "border-black/8 bg-white",
                  )}
                >
                  <DeviceImage slug={d.slug} size={36} />
                  <span
                    className={cn(
                      "text-[8px] font-semibold",
                      isActive ? "text-olive-dark" : "text-text-muted",
                    )}
                  >
                    {d.name}
                  </span>
                  <span
                    className={cn(
                      "absolute right-1.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full",
                      configured ? "" : "border border-black/15",
                    )}
                    style={configured ? { backgroundColor: color.hex } : undefined}
                  >
                    {configured ? <Check className="h-2 w-2 text-white" strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeProtocol && activeProtocol.modes.length > 0 ? (
          <>
            {/* Режим */}
            <div>
              <p className="text-[9px] uppercase tracking-[1px] text-text-muted">Режим</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {activeProtocol.modes.map((mode) => {
                  const isSelected = mode.name === activeModeName;
                  return (
                    <button
                      key={mode.name}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setActiveModeName(mode.name)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] backdrop-blur-md transition-colors",
                        isSelected
                          ? "border-olive/50 bg-olive/30 font-semibold text-olive-dark"
                          : "border-black/10 bg-white text-text-muted",
                      )}
                    >
                      {mode.displayName ?? mode.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Частота — подсказка из протокола */}
            <div className="rounded-lg border border-olive/50 bg-olive/30 p-3 backdrop-blur-md">
              <div className="flex items-start gap-1.5">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive-dark" strokeWidth={1.75} aria-hidden />
                <div className="min-w-0">
                  <p className="text-[11px] text-olive-dark">
                    {activeProtocol.frequency.label}
                    {activeModeObj ? ` для «${activeModeObj.displayName ?? activeModeObj.name}»` : ""}
                  </p>
                  {activeModeObj?.hasElectricCurrent ? (
                    <p className="mt-0.5 text-[10px] text-olive-dark opacity-80">
                      Используйте только водную основу (гель)
                    </p>
                  ) : activeProtocol.frequency.note ? (
                    <p className="mt-0.5 text-[10px] text-olive-dark opacity-80">
                      {activeProtocol.frequency.note}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Время суток */}
            <div>
              <p className="text-[9px] uppercase tracking-[1px] text-text-muted">Когда?</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {TIME_BUTTONS.map((t) => {
                  const isSelected = (activeModeSchedule?.sessionTime ?? "flexible") === t.value;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSessionTime(t.value)}
                      className={cn(
                        "flex h-11 flex-col items-center justify-center gap-0.5 rounded-lg border backdrop-blur-md transition-colors",
                        isSelected
                          ? "border-olive/50 bg-olive/30"
                          : "border-black/10 bg-white",
                      )}
                    >
                      <Icon
                        className={cn("h-3.5 w-3.5", isSelected ? "text-olive-dark" : "text-text-muted")}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <span className={cn("text-[9px]", isSelected ? "font-semibold text-olive-dark" : "text-text-muted")}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Дни недели */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-[1px] text-text-muted">Дни недели</p>
                <button
                  type="button"
                  onClick={resetActiveMode}
                  className="text-[9px] text-text-muted underline underline-offset-2"
                >
                  Сбросить
                </button>
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {WEEKDAYS.map((day) => {
                  const isSelected = activeModeSchedule?.days.includes(day) ?? false;
                  const otherSlugs = scheduledDeviceColorsForDay(day).filter(
                    (s) => s !== activeDeviceSlug,
                  );
                  return (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "flex h-8 w-full items-center justify-center rounded-lg border text-[10px] backdrop-blur-md transition-colors",
                          isSelected
                            ? "border-olive/50 bg-olive/30 font-semibold text-olive-dark"
                            : "border-black/10 bg-white text-text-muted",
                        )}
                      >
                        {WEEKDAY_LABELS[day]}
                      </button>
                      <div className="flex h-1.5 gap-0.5">
                        {otherSlugs.slice(0, 3).map((slug) => (
                          <span
                            key={slug}
                            className="h-1 w-1 rounded-full"
                            style={{ backgroundColor: getDeviceColor(slug).hex }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {activeDeviceSummary ? (
                <p className="mt-2 text-[10px] text-text-muted">Итого: {activeDeviceSummary}</p>
              ) : null}
            </div>

            {/* Предпросмотр недели */}
            <div>
              <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
                Предпросмотр недели
              </p>
              <div className="mt-2">
                <MiniWeekCalendar cells={weekCells} />
              </div>
            </div>

            {/* Предупреждение */}
            <div className="rounded-lg border border-rose/30 bg-rose/[0.08] p-3">
              <div className="flex items-start gap-1.5">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" strokeWidth={1.75} aria-hidden />
                <div>
                  <p className="text-[11px] font-semibold text-rose">Важно</p>
                  <p className="mt-0.5 text-[10px] text-text-muted">
                    Не используйте устройства с одинаковым действием в один день
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-[12px] text-text-muted">
            Для этого устройства пока нет доступных режимов
          </p>
        )}

        {saveError ? <p className="text-center text-[11px] text-rose">{saveError}</p> : null}
      </div>

      <div className="sticky bottom-0 mt-4 bg-cream px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="h-9 w-full rounded-full"
        >
          {isPending ? "Сохраняем…" : "Сохранить ритуал"}
        </Button>
      </div>
    </main>
  );
}
