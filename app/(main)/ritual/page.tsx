import Link from "next/link";
import { AlertCircle, Droplets, Play } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { DeviceProtocolRitual } from "@/components/ritual/device-protocol-ritual";
import { getProfileWithStats } from "@/lib/queries/profile";
import {
  getCurrentDayNumber,
  getLatestProcedure,
  getTodayProgramItem,
} from "@/lib/program/utils";
import { deviceEnumToSlug } from "@/lib/content/devices";
import {
  getProtocolBySlug,
  lyraDailyModeSequence,
  lyraProtocols,
  sylvaDailyModeSequence,
  sylvaProtocols,
} from "@/lib/content/protocols";
import { getModeForDevice } from "@/lib/program/utils";

// Устройства с полноценным пошаговым протоколом (AURA/LYRA/SYLVA) — в дни,
// когда «устройство дня» одно из них, /ritual показывает их протокол вместо
// обычной дневной программы drip-campaign. Для всех остальных устройств
// (NUO, ELARA и т.д.) поведение страницы не меняется — они по-прежнему
// идут по 30-дневной программе.
const DEVICES_WITH_OWN_RITUAL = new Set(["aura", "lyra", "sylva"]);

export default async function RitualPage({
  searchParams,
}: {
  searchParams: { device?: string; mode?: string };
}) {
  const { profile } = await getProfileWithStats();
  const currentDay = getCurrentDayNumber(profile.activated_at);

  // «Устройство дня» — та же ротация, что и на /home. Карточка «Сегодня» на
  // Home может передать явный выбор пользователя через ?device= (кнопка
  // «Начать» при переключённом устройстве) — он приоритетнее ротации дня.
  const primarySlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const ownedSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : primarySlug
        ? [primarySlug]
        : [];
  const deviceOfDaySlug =
    ownedSlugs.length > 0
      ? ownedSlugs[(currentDay - 1) % ownedSlugs.length]
      : null;
  const activeDevice = searchParams.device ?? deviceOfDaySlug ?? primarySlug;

  if (activeDevice && DEVICES_WITH_OWN_RITUAL.has(activeDevice)) {
    const protocol = getProtocolBySlug(activeDevice);
    if (protocol && protocol.modes.length > 0) {
      if (activeDevice === "lyra") {
        return (
          <DeviceProtocolRitual
            kind="daily"
            deviceSlug="lyra"
            protocol={protocol}
            dailyProtocols={lyraProtocols}
            dailyModeSequence={lyraDailyModeSequence}
          />
        );
      }
      if (activeDevice === "sylva") {
        return (
          <DeviceProtocolRitual
            kind="daily"
            deviceSlug="sylva"
            protocol={protocol}
            dailyProtocols={sylvaProtocols}
            dailyModeSequence={sylvaDailyModeSequence}
          />
        );
      }
      // aura — нет готовых дневных протоколов, выбор конкретного режима.
      return (
        <DeviceProtocolRitual
          kind="mode-picker"
          deviceSlug={activeDevice}
          protocol={protocol}
        />
      );
    }
  }

  const today = getTodayProgramItem(profile.activated_at);

  const isExtraSession = today.type !== "procedure" || !today.procedure;
  const item = isExtraSession ? getLatestProcedure(currentDay) : today;
  // getLatestProcedure гарантирует item.procedure, поэтому non-null.
  const proc = item.procedure!;

  // Шаги процедуры больше не хранятся в drip-campaign — она задаёт только
  // когда и сколько. Название режима и шаги — из протокола АКТИВНОГО
  // устройства (activeDevice), с ротацией режимов по номеру процедуры
  // (item.day — на случай внеплановой сессии, когда день отличается от
  // текущего currentDay).
  // ?mode= — явный режим из активного ритуала (кнопка «Начать» на /home),
  // приоритетнее ротации по номеру дня; если такого режима не нашли —
  // откатываемся на обычную ротацию.
  const explicitMode = searchParams.mode
    ? getProtocolBySlug(activeDevice ?? "")?.modes.find((m) => m.name === searchParams.mode)
    : undefined;
  const currentMode =
    explicitMode ?? (activeDevice ? getModeForDevice(activeDevice, item.day) : null);
  const modeTitle = currentMode
    ? (currentMode.displayName ?? currentMode.name)
    : proc.title;
  const steps = currentMode?.steps.map((s) => s.text) ?? [];
  const medium = currentMode?.medium ?? "";
  const mediumType = currentMode?.mediumType;
  const hasElectricCurrent = currentMode?.hasElectricCurrent ?? false;
  const note = currentMode?.note;

  const totalSeconds = proc.durationMinutes * 60;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timerLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const ritualDoneHref = isExtraSession
    ? "/ritual/done?extra=1"
    : "/ritual/done";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative flex items-center justify-center px-4 pt-4">
        <div className="absolute left-2 top-0">
          <BackButton href="/home" />
        </div>
        <div className="text-center">
          <p className="text-[13px] text-text">
            {isExtraSession ? "Внеплановая процедура" : modeTitle}
          </p>
          <p className="mt-0.5 text-[9px] text-text-muted">
            {isExtraSession
              ? `${modeTitle} · ${proc.durationMinutes} минут`
              : `${proc.durationMinutes} минут`}
          </p>
        </div>
      </header>

      {isExtraSession ? (
        <p className="mt-2 px-6 text-center text-[9px] italic text-text-muted">
          Сегодня день отдыха — но вы решили иначе. Это хорошо.
        </p>
      ) : null}

      <div className="flex-1 overflow-y-auto pb-6">
        <FadeIn duration={0.4} className="mt-4 px-4">
          <Link
            href={
              activeDevice ? `/ritual/video?device=${activeDevice}` : "/ritual/video"
            }
            aria-label="Открыть видеогид"
            className="relative block aspect-video w-full overflow-hidden rounded-lg bg-text"
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <Play
                className="h-8 w-8 text-cream"
                fill="currentColor"
                strokeWidth={0}
                aria-hidden
              />
            </span>
          </Link>
        </FadeIn>

        <div className="mt-6 text-center">
          <p className="text-[26px] tracking-[2px] text-text">{timerLabel}</p>
          <p className="mt-1 text-[9px] text-text-muted">осталось</p>
        </div>

        {medium ? (
          <div className="mx-4 mb-4 mt-6 rounded-lg bg-olive/[0.06] p-3">
            <div className="flex items-center gap-1.5">
              <Droplets
                className="h-3.5 w-3.5 text-olive"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
                Что нанести
              </p>
            </div>
            <p className="mt-1.5 text-[12px] text-text">{medium}</p>
          </div>
        ) : null}

        {hasElectricCurrent ? (
          <div className="mx-4 mb-4 rounded-r-lg border-l-2 border-rose/50 bg-rose/10 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle
                className="mt-[1px] h-3.5 w-3.5 shrink-0 text-rose"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="text-[11px] text-rose/80">
                Только водная основа — масло блокирует ток
              </p>
            </div>
          </div>
        ) : mediumType === "oil" ? (
          <div className="mx-4 mb-4 border-l-2 border-olive/40 bg-olive/[0.06] p-3">
            <p className="text-[11px] text-text-muted">
              Масло или крем разрешены — в этом режиме нет тока
            </p>
          </div>
        ) : null}

        <section className="mt-6 px-4">
          <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Шаги
          </p>
          <ol className="mt-4 flex flex-col gap-2">
            {steps.map((step, i) => (
              <li
                key={`${i}-${step}`}
                className="flex gap-2 text-[11px] text-text"
              >
                <span className="w-5 shrink-0 text-text-muted">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {note ? (
          <div className="mx-4 mt-4 rounded-lg bg-cream-dark p-3">
            <p className="text-[11px] italic text-text-muted">💡 {note}</p>
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 bg-cream px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3">
        <Button asChild className="h-12 w-full">
          <Link href={ritualDoneHref}>Завершить процедуру</Link>
        </Button>
      </div>
    </div>
  );
}
