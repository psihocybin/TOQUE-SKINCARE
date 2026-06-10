import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
};

const baseClass =
  "inline-flex h-11 w-11 items-center justify-center -ml-2.5 rounded-pill text-text transition-colors hover:bg-black/5";

export function BackButton({
  href,
  onClick,
  className,
  label = "Назад",
}: BackButtonProps) {
  const icon = <ChevronLeft className="h-5 w-5" aria-hidden />;

  if (href) {
    return (
      <Link href={href} aria-label={label} className={cn(baseClass, className)}>
        {icon}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(baseClass, className)}
    >
      {icon}
    </button>
  );
}
