"use client";

import { cn } from "@/lib/utils";

type ChipOption = { value: string; label: string };

type ChipGroupProps = {
  options: ChipOption[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
};

export function ChipGroup({
  options,
  selected,
  onChange,
  className,
}: ChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group">
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isSelected}
            className={cn(
              "flex h-8 items-center rounded-pill border px-4 text-sm backdrop-blur-md transition-colors duration-150",
              isSelected
                ? "border-olive/50 bg-olive/30 text-olive-dark"
                : "border-black/15 bg-white text-text-muted hover:text-text",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
