import Link from "next/link";
import { Check } from "lucide-react";
import { DeviceImage } from "@/components/shared/device-image";
import type { TodayProcedure } from "@/lib/program/utils";
import { cn } from "@/lib/utils";

type Props = {
  procedure: TodayProcedure;
  isDone: boolean;
};

export function DeviceProcedureCard({ procedure, isDone }: Props) {
  return (
    <Link
      href={`/ritual?device=${procedure.deviceSlug}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
    >
      <DeviceImage slug={procedure.deviceSlug} size={32} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-semibold text-text">
          {procedure.modeName}
          {procedure.isRestDay ? (
            <span className="font-normal text-text-muted"> (день отдыха)</span>
          ) : null}
        </p>
        <p className="mt-0.5 text-[11px] text-text-muted">
          {procedure.deviceSlug.toUpperCase()} · {procedure.durationMinutes} мин
        </p>
      </div>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          isDone ? "bg-olive" : "border border-black/15",
        )}
        aria-hidden
      >
        {isDone ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : null}
      </span>
    </Link>
  );
}
