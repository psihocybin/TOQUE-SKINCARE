import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { SignOutButton } from "@/components/profile/sign-out-button";
import { TestPushButton } from "@/components/pwa/test-push-button";
import { getProfileWithStats } from "@/lib/queries/profile";
import {
  PLURAL_DAYS,
  PLURAL_PROCEDURES,
  pluralRu,
} from "@/lib/utils/format";

const SKIN_LABELS: Record<string, string> = {
  normal: "нормальная кожа",
  dry: "сухая кожа",
  oily: "жирная кожа",
  combo: "комбинированная",
  sensitive: "чувствительная",
};

type MenuItem = { href: string; label: string };

const MENU_ITEMS: ReadonlyArray<MenuItem> = [
  { href: "/ritual-home?tab=my-program", label: "Моя программа" },
  { href: "/achievements", label: "Достижения" },
  { href: "/my-devices", label: "Мои устройства" },
  { href: "/settings", label: "Настройки" },
  { href: "/support", label: "Поддержка" },
  { href: "/warranty", label: "Гарантия" },
  { href: "/ecosystem", label: "Экосистема TOQUE" },
  { href: "/about", label: "О TOQUE" },
  { href: "/referrals", label: "Пригласить подругу" },
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/terms", label: "Условия использования" },
];

export default async function ProfilePage() {
  const { profile, currentDay, completedProcedures } =
    await getProfileWithStats();

  const trimmedName = profile.name.trim();
  const initial = (trimmedName[0] ?? "?").toUpperCase();
  const skinLabel = profile.skin_type
    ? (SKIN_LABELS[profile.skin_type] ?? "")
    : "";
  const subParts = [profile.age_group, skinLabel].filter(Boolean);
  const subLine = subParts.join(" · ");

  return (
    <main className="flex min-h-screen flex-col px-5 pb-24 pt-8">
      <FadeIn className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-pill border border-olive/20 bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)] backdrop-blur-md">
          <span className="text-[20px] tracking-[2px] text-olive-dark">
            {initial}
          </span>
        </div>
        <h1 className="mt-4 text-[16px] text-text">{trimmedName}</h1>
        {subLine ? (
          <p className="mt-1 text-[10px] text-text-muted">{subLine}</p>
        ) : null}
      </FadeIn>

      <FadeIn delay={0.2} className="mt-7">
        <div className="flex items-center rounded-lg border border-olive/20 bg-white/60 px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)] backdrop-blur-md">
          <div className="flex-1 text-center">
            <p className="text-[20px] leading-none text-text">{currentDay}</p>
            <p className="mt-1 text-[9px] text-text-muted">
              {pluralRu(currentDay, PLURAL_DAYS)} с TOQUE
            </p>
          </div>
          <span className="mx-3 h-9 w-px bg-black/10" aria-hidden />
          <div className="flex-1 text-center">
            <p className="text-[20px] leading-none text-text">
              {completedProcedures}
            </p>
            <p className="mt-1 text-[9px] text-text-muted">
              {pluralRu(completedProcedures, PLURAL_PROCEDURES)}
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.35} className="mt-8">
        <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
          Меню
        </p>
        <ul className="mt-2 overflow-hidden rounded-lg border border-black/[0.06] bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)] backdrop-blur-md">
          {MENU_ITEMS.map((item, i) => (
            <li
              key={item.href}
              className={i > 0 ? "border-t border-black/[0.06]" : undefined}
            >
              <Link
                href={item.href}
                className="flex items-center justify-between px-4 py-3 text-[13px] text-text transition-colors hover:bg-white/40"
              >
                <span>{item.label}</span>
                <ChevronRight
                  className="h-3.5 w-3.5 text-text-muted"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </FadeIn>

      <div className="mt-6">
        <TestPushButton />
      </div>

      <div className="mt-4 text-center">
        <SignOutButton />
      </div>
    </main>
  );
}
