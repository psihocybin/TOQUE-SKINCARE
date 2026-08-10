import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/content/articles";

type Props = { items: Article[] };

export function ArticlesScroll({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {items.map((a) => (
        <a
          key={a.id}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[140px] w-[220px] shrink-0 flex-col justify-between rounded-2xl bg-cream-dark p-4"
        >
          <div>
            <p className="text-[9px] uppercase tracking-[1.5px] text-olive">
              {a.tag}
            </p>
            <p className="mt-1.5 line-clamp-2 text-[13px] font-semibold text-text">
              {a.title}
            </p>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-text-muted">
            Читать
            <ArrowUpRight className="h-3 w-3" strokeWidth={1.75} aria-hidden />
          </span>
        </a>
      ))}
    </div>
  );
}
