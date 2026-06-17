"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type OptionalToggleProps = {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

// Rose-tinted переключатель для опциональных полей квиза (isGift, baseline-photo).
// Визуально мягче чем основной OptionTile — пыльно-розовая обводка из палитры.
export function OptionalToggle({
  label,
  hint,
  checked,
  onChange,
}: OptionalToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
        checked
          ? "border-rose bg-rose/12"
          : "border-rose/40 bg-rose/8 hover:bg-rose/12",
      )}
    >
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-pill border transition-colors",
          checked ? "border-rose bg-rose" : "border-rose/70 bg-transparent",
        )}
        aria-hidden
      >
        {checked ? (
          <Check className="h-3 w-3 text-cream" strokeWidth={3} />
        ) : (
          <span className="block h-1.5 w-1.5 rounded-pill bg-rose/70" />
        )}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm text-text">{label}</span>
        {hint ? (
          <span className="mt-0.5 text-xs text-text-muted">{hint}</span>
        ) : null}
      </span>
    </button>
  );
}
