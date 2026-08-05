import { AlertCircle } from "lucide-react";
import type { ProcedureMode } from "@/lib/content/protocols";

type Props = {
  mode: ProcedureMode;
};

// Общий рендер шагов режима устройства + предупреждение про средство.
// Переиспользуется на /ritual (device-протоколы AURA/LYRA/SYLVA) и на
// /ecosystem/[device] (таб «Протокол»).
export function ProcedureModeSteps({ mode }: Props) {
  return (
    <div>
      {mode.hasElectricCurrent ? (
        <div className="rounded-r-lg border-l-2 border-rose/50 bg-rose/10 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle
              className="mt-[1px] h-3.5 w-3.5 shrink-0 text-rose"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="text-[11px] leading-relaxed text-rose/80">
              Используйте только средства на водной основе. Масло блокирует
              ток — процедура не будет работать.
            </p>
          </div>
        </div>
      ) : mode.mediumType === "oil" ? (
        <div className="rounded-r-lg border-l-2 border-olive/30 bg-olive/[0.06] p-3">
          <p className="text-[11px] text-text-muted">
            Нанесите масло или крем для скольжения.
          </p>
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[12px] text-text">
          {mode.displayName ?? mode.name}
        </p>
        <p className="text-[10px] text-text-muted">
          {mode.durationMinutes} мин
        </p>
      </div>
      {mode.mediumType !== "none" ? (
        <p className="mt-0.5 text-[10px] text-text-muted">{mode.medium}</p>
      ) : null}

      <ol className="mt-3 flex flex-col gap-2">
        {mode.steps.map((step, i) => (
          <li key={`${i}-${step.text}`} className="flex gap-2 text-[11px] text-text">
            <span className="w-5 shrink-0 text-text-muted">{i + 1}.</span>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>

      {mode.note ? (
        <p className="mt-3 text-[10px] italic text-text-muted">{mode.note}</p>
      ) : null}
    </div>
  );
}
