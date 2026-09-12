"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ChipGroup } from "@/components/shared/chip-group";
import { DeviceImage } from "@/components/shared/device-image";
import { TutorialCard } from "@/components/tutorials/tutorial-card";
import { FavoriteHeart } from "@/components/tutorials/favorite-heart";
import { readFavorites } from "@/lib/tutorials/favorites";
import { tutorials } from "@/lib/content/tutorials";

const FILTER_OPTIONS = [
  { value: "all", label: "Все" },
  { value: "nuo", label: "NUO/NUO PRO" },
  { value: "elara", label: "ELARA" },
  { value: "lumera", label: "LUMERA" },
  { value: "anima", label: "ANIMA" },
  { value: "aura", label: "AURA" },
  { value: "nova", label: "NOVA" },
  { value: "aeris", label: "AERIS" },
  { value: "lyra", label: "LYRA" },
  { value: "sylva", label: "SYLVA" },
];

export default function TutorialsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavoriteIds(readFavorites());
  }, []);

  function handleFavoriteToggle(id: string, favorited: boolean) {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (favorited) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tutorials.filter((t) => {
      if (filter !== "all" && t.deviceSlug !== filter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  const favoriteTutorials = tutorials.filter((t) => favoriteIds.has(t.id));

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-6">
      <h1 className="text-[22px] font-bold text-text">Уроки</h1>

      <div className="relative mt-4">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск"
          className="h-10 w-full rounded-xl bg-black/5 pl-9 pr-3 text-[13px] text-text outline-none placeholder:text-text-muted"
        />
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <ChipGroup options={FILTER_OPTIONS} selected={filter} onChange={setFilter} />
      </div>

      {favoriteTutorials.length > 0 ? (
        <div className="mt-6">
          <p className="text-[9px] uppercase tracking-[2px] text-olive">
            Избранное
          </p>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {favoriteTutorials.map((t) => (
              <Link
                key={t.id}
                href={`/tutorials/${t.id}`}
                className="flex h-[150px] w-[120px] shrink-0 flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)]"
              >
                <div className="relative flex-1">
                  <DeviceImage
                    slug={t.deviceSlug}
                    fill
                    className="rounded-none"
                  />
                  <FavoriteHeart
                    tutorialId={t.id}
                    size={13}
                    className="absolute bottom-1.5 right-1.5 h-6 w-6 rounded-full bg-white/80 shadow-sm backdrop-blur-sm"
                    onToggle={handleFavoriteToggle}
                  />
                </div>
                <div className="px-2 py-1.5">
                  <p className="line-clamp-2 text-[11px] font-semibold text-text">
                    {t.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-[12px] text-text-muted">
            Ничего не найдено
          </p>
        ) : (
          filtered.map((t) => (
            <TutorialCard
              key={t.id}
              tutorial={t}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))
        )}
      </div>
    </main>
  );
}
