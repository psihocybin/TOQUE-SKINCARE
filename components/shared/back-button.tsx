import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
  // Показать рядом маленькую ссылку «На главную» → /home.
  showHome?: boolean;
};

const baseClass =
  "inline-flex h-11 w-11 items-center justify-center -ml-2.5 rounded-pill text-text transition-colors hover:bg-black/5";

export function BackButton({
  href,
  onClick,
  className,
  label = "Назад",
  showHome = false,
}: BackButtonProps) {
  const icon = <ChevronLeft className="h-5 w-5" aria-hidden />;

  const backNode = href ? (
    <Link href={href} aria-label={label} className={cn(baseClass, className)}>
      {icon}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(baseClass, className)}
    >
      {icon}
    </button>
  );

  if (!showHome) return backNode;

  return (
    <div className="flex items-center gap-1">
      {backNode}
      <Link
        href="/home"
        className="inline-flex items-center gap-1 text-[11px] text-text-muted transition-colors hover:text-text"
      >
        <Home className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        <span>На главную</span>
      </Link>
    </div>
  );
}
