"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChipGroup } from "@/components/shared/chip-group";
import { Button } from "@/components/ui/button";
import { ProcedureModeSteps } from "@/components/ritual/procedure-mode-steps";
import {
  getModeByName,
  type DailyProtocol,
  type DailyProtocolKey,
  type DeviceProtocol,
} from "@/lib/content/protocols";

const DAILY_CHIPS: Array<{ value: DailyProtocolKey; label: string }> = [
  { value: "morning", label: "Утренний" },
  { value: "evening", label: "Вечерний" },
  { value: "express", label: "Экспресс" },
];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readStoredChoice(storageKey: string): DailyProtocolKey | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { date?: string; key?: DailyProtocolKey };
    if (parsed.date !== todayKey()) return null;
    return parsed.key ?? null;
  } catch {
    return null;
  }
}

function writeStoredChoice(storageKey: string, key: DailyProtocolKey) {
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ date: todayKey(), key }),
    );
  } catch {
    // ignore — localStorage может быть недоступен
  }
}

function defaultDailyKey(): DailyProtocolKey {
  const hour = new Date().getHours();
  return hour < 17 ? "morning" : "evening";
}

type DailyProps = {
  kind: "daily";
  deviceSlug: string;
  protocol: DeviceProtocol;
  dailyProtocols: Record<DailyProtocolKey, DailyProtocol>;
  dailyModeSequence: Record<DailyProtocolKey, string[]>;
};

type ModePickerProps = {
  kind: "mode-picker";
  deviceSlug: string;
  protocol: DeviceProtocol;
};

type Props = DailyProps | ModePickerProps;

export function DeviceProtocolRitual(props: Props) {
  if (props.kind === "daily") {
    return <DailyProtocolView {...props} />;
  }
  return <ModePickerView {...props} />;
}

function DailyProtocolView({
  deviceSlug,
  protocol,
  dailyProtocols,
  dailyModeSequence,
}: DailyProps) {
  const router = useRouter();
  const storageKey = `${deviceSlug}_protocol_today`;
  const [selected, setSelected] = useState<DailyProtocolKey>(defaultDailyKey());

  useEffect(() => {
    const stored = readStoredChoice(storageKey);
    if (stored) setSelected(stored);
    // storageKey стабилен на весь жизненный цикл страницы — читаем один раз.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(value: string) {
    const key = value as DailyProtocolKey;
    setSelected(key);
    writeStoredChoice(storageKey, key);
  }

  const daily = dailyProtocols[selected];
  const modeNames = dailyModeSequence[selected];
  const resolvedModes = modeNames
    .map((name) => getModeByName(protocol, name))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <p className="text-[13px] text-text">{protocol.deviceSlug.toUpperCase()}</p>

        <div className="mt-6 rounded-lg border border-black/8 bg-white px-4 py-4">
          <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Какой протокол сегодня?
          </p>
          <ChipGroup
            className="mt-3"
            options={DAILY_CHIPS}
            selected={selected}
            onChange={handleSelect}
          />
          <p className="mt-3 text-[12px] text-text">{daily.name}</p>
          <p className="mt-0.5 text-[10px] text-text-muted">
            {daily.totalMinutes} минут всего
          </p>
        </div>

        <div className="mt-5">
          <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Последовательность
          </p>
          <ol className="mt-3 flex flex-col gap-1.5">
            {daily.sequence.map((line, i) => (
              <li key={`${i}-${line}`} className="flex gap-2 text-[11px] text-text">
                <span className="w-5 shrink-0 text-text-muted">{i + 1}.</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          {resolvedModes.map((mode) => (
            <div
              key={mode.name}
              className="rounded-lg border border-black/8 bg-white px-4 py-4"
            >
              <ProcedureModeSteps mode={mode} />
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 bg-cream px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3">
        <Button onClick={() => router.push("/home")} className="h-12 w-full">
          Готово
        </Button>
      </div>
    </div>
  );
}

function ModePickerView({ protocol }: ModePickerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(protocol.modes[0]?.name ?? "");
  const mode = protocol.modes.find((m) => m.name === selected) ?? protocol.modes[0];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <p className="text-[13px] text-text">{protocol.deviceSlug.toUpperCase()}</p>

        <div className="mt-6 rounded-lg border border-black/8 bg-white px-4 py-4">
          <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Какой режим сегодня?
          </p>
          <ChipGroup
            className="mt-3"
            options={protocol.modes.map((m) => ({
              value: m.name,
              label: m.displayName ?? m.name,
            }))}
            selected={selected}
            onChange={setSelected}
          />
        </div>

        {mode ? (
          <div className="mt-5 rounded-lg border border-black/8 bg-white px-4 py-4">
            <ProcedureModeSteps mode={mode} />
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 bg-cream px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3">
        <Button onClick={() => router.push("/home")} className="h-12 w-full">
          Готово
        </Button>
      </div>
    </div>
  );
}
