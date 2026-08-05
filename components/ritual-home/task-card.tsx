import Link from "next/link";
import { Check } from "lucide-react";
import { DeviceImage } from "@/components/shared/device-image";
import type { ProcedureMode } from "@/lib/content/protocols";
import { cn } from "@/lib/utils";

type Props = {
  deviceSlug: string;
  mode: ProcedureMode | null;
  fallbackTitle: string;
  fallbackDuration: number;
  isDone: boolean;
};

export function TaskCard({
  deviceSlug,
  mode,
  fallbackTitle,
  fallbackDuration,
  isDone,
}: Props) {
  const title = mode ? (mode.displayName ?? mode.name) : fallbackTitle;
  const duration = mode?.durationMinutes ?? fallbackDuration;

  return (
    <Link
      href={`/ritual?device=${deviceSlug}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
    >
      <DeviceImage slug={deviceSlug} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-text">{title}</p>
        <p className="mt-0.5 text-[11px] text-text-muted">{duration} мин</p>
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
