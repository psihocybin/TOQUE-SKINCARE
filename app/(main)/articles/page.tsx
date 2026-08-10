import { ArrowUpRight } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { articles } from "@/lib/content/articles";

export default function ArticlesPage() {
  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-6">
      <div className="flex items-center gap-2">
        <BackButton href="/home" />
        <h1 className="text-[22px] font-bold text-text">Статьи</h1>
      </div>
      <p className="mt-1.5 text-[13px] text-text-muted">
        Материалы блога TOQUE об уходе за кожей и работе с устройствами
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {articles.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col rounded-2xl bg-white p-4 shadow-sm"
          >
            <p className="text-[9px] uppercase tracking-[1.5px] text-olive">
              {a.tag}
            </p>
            <p className="mt-1.5 text-[15px] font-semibold text-text">
              {a.title}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-text-muted">
              {a.excerpt}
            </p>
            <span className="mt-3 flex items-center gap-1 text-[11px] text-olive">
              Читать на toque-store.ru
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
