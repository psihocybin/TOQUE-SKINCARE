import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";

const EXTERNAL_LINKS = [
  {
    href: "https://toque-store.ru",
    title: "Наш сайт",
    subtitle: "toque-store.ru",
  },
  {
    href: "https://toque-store.ru/catalog",
    title: "Каталог устройств",
    subtitle: "Все продукты TOQUE",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/profile" />
        </div>
        <p className="text-[14px] text-text">О TOQUE</p>
      </header>

      <FadeIn className="mt-10 flex flex-col items-center">
        <p className="text-[28px] tracking-[6px] text-olive">TOQUE</p>
        <p className="mt-1 text-[10px] uppercase tracking-[3px] text-text-muted">
          Ритуал
        </p>
        <span
          className="mt-4 block h-px w-[60px] bg-black/15"
          aria-hidden
        />
      </FadeIn>

      <FadeIn delay={0.2} className="mt-10 px-2 text-center">
        <p className="text-[12px] leading-relaxed text-text-muted">
          TOQUE — российский бренд аппаратной косметологии для дома.
        </p>
        <p className="mt-6 text-[12px] leading-relaxed text-text-muted">
          Мы разрабатываем устройства и протоколы вместе с экспертами в
          области косметологии — каждый режим имеет научное обоснование, а
          не маркетинговое.
        </p>
        <p className="mt-6 text-[12px] leading-relaxed text-text-muted">
          Это не про мгновенный результат. Это про регулярность, которая со
          временем становится видимой.
        </p>
      </FadeIn>

      <div className="mt-10 h-px w-full bg-black/8" aria-hidden />

      <FadeIn delay={0.35} className="mt-8 flex flex-col gap-2">
        {EXTERNAL_LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-black/8 bg-white px-4 py-4 transition-colors hover:bg-black/[0.02]"
          >
            <div>
              <p className="text-[13px] text-text">{item.title}</p>
              <p className="mt-0.5 text-[10px] text-text-muted">
                {item.subtitle}
              </p>
            </div>
            <ArrowUpRight
              className="h-4 w-4 text-text-muted"
              strokeWidth={1.5}
              aria-hidden
            />
          </a>
        ))}
        <Link
          href="/support"
          className="flex items-center justify-between rounded-lg border border-black/8 bg-white px-4 py-4 transition-colors hover:bg-black/[0.02]"
        >
          <div>
            <p className="text-[13px] text-text">Служба заботы</p>
            <p className="mt-0.5 text-[10px] text-text-muted">Напишите нам</p>
          </div>
          <ChevronRight
            className="h-4 w-4 text-text-muted"
            strokeWidth={1.5}
            aria-hidden
          />
        </Link>
      </FadeIn>

      <div className="mt-10 text-center">
        <p className="text-[11px] text-text-muted">TOQUE Ритуал</p>
        <p className="mt-1 text-[10px] text-text-muted opacity-60">
          Версия 1.0.0 · Пилот
        </p>
      </div>
    </main>
  );
}
