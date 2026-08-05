"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Heart } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";

type Props = {
  greetingName: string;
};

const MARKETPLACES = [
  {
    key: "wb",
    href: "https://www.wildberries.ru/brands/toque",
    title: "Wildberries",
    subtitle: "оставить отзыв",
    letter: "W",
    badgeClass: "bg-[#CB11AB]",
    external: true,
  },
  {
    key: "ozon",
    href: "https://www.ozon.ru/brand/toque/",
    title: "Ozon",
    subtitle: "оставить отзыв",
    letter: "O",
    badgeClass: "bg-[#005BFF]",
    external: true,
  },
  {
    key: "site",
    href: "/support",
    title: "toque-store.ru",
    subtitle: "написать в службу заботы",
    letter: "T",
    badgeClass: "bg-olive",
    external: false,
  },
] as const;

export function ReviewRequestScreen({ greetingName }: Props) {
  const router = useRouter();
  const trimmedName = greetingName.trim();
  const greeting = trimmedName
    ? `${trimmedName}, помогите нам стать заметнее.`
    : "Помогите нам стать заметнее.";

  return (
    <main className="flex min-h-screen flex-col px-4 pb-12">
      <FadeIn className="mt-[60px] flex justify-center">
        <Heart
          className="h-11 w-11 text-rose"
          strokeWidth={1.5}
          aria-hidden
        />
      </FadeIn>

      <FadeIn delay={0.15} className="mt-6 px-2 text-center">
        <h1 className="text-[17px] leading-snug text-text">{greeting}</h1>
        <p className="mt-6 text-[11px] leading-relaxed text-text-muted">
          Расскажите про TOQUE там, где купили устройство.
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
          Это занимает 2 минуты — и очень помогает другим.
        </p>
      </FadeIn>

      <FadeIn delay={0.3} className="mt-8 flex flex-col gap-2">
        {MARKETPLACES.map((m) => {
          const inner = (
            <>
              <span
                className={
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                  m.badgeClass
                }
                aria-hidden
              >
                <span className="text-[14px] text-cream">{m.letter}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-text">{m.title}</p>
                <p className="text-[9px] text-text-muted">{m.subtitle}</p>
              </div>
              <ChevronRight
                className="h-3.5 w-3.5 text-text-muted"
                strokeWidth={1.5}
                aria-hidden
              />
            </>
          );

          return m.external ? (
            <a
              key={m.key}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-black/8 bg-white px-3 py-3 transition-colors hover:bg-black/[0.02]"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={m.key}
              href={m.href}
              className="flex items-center gap-3 rounded-xl border border-black/8 bg-white px-3 py-3 transition-colors hover:bg-black/[0.02]"
            >
              {inner}
            </Link>
          );
        })}
      </FadeIn>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="text-[10px] text-text-muted underline underline-offset-4"
        >
          Я не буду оставлять отзыв
        </button>
      </div>
    </main>
  );
}
