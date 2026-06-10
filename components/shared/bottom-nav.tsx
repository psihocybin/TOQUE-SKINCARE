"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, TrendingUp, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const items: NavItem[] = [
  { href: "/home", label: "Главная", icon: Home },
  { href: "/journal", label: "Журнал", icon: BookOpen },
  { href: "/progress", label: "Прогресс", icon: TrendingUp },
  { href: "/profile", label: "Профиль", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-cream pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex h-14 w-full max-w-app items-stretch">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[10px]",
                  isActive ? "text-olive" : "text-text-muted",
                )}
              >
                <Icon
                  className="h-[22px] w-[22px]"
                  strokeWidth={1.8}
                  fill={isActive ? "currentColor" : "none"}
                  fillOpacity={isActive ? 0.15 : 0}
                  aria-hidden
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
