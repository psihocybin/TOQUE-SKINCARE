"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type OptionTileProps = {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "compact";
};

export function OptionTile({
  label,
  sublabel,
  selected,
  onClick,
  icon,
  variant = "default",
}: OptionTileProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
        variant === "default" ? "min-h-[46px]" : "min-h-[40px]",
        selected
          ? "border-[1.2px] border-olive bg-olive/8"
          : "border border-black/12 bg-white",
      )}
    >
      {icon ? (
        <span className="flex shrink-0 items-center justify-center text-text-muted">
          {icon}
        </span>
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] leading-tight text-text">
          {label}
        </span>
        {sublabel ? (
          <span className="mt-0.5 truncate text-xs leading-tight text-text-muted">
            {sublabel}
          </span>
        ) : null}
      </span>

      {selected ? (
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-olive"
          aria-hidden
        >
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </span>
      ) : null}
    </motion.button>
  );
}
