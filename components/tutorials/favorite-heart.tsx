"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { readFavorites, writeFavorites } from "@/lib/tutorials/favorites";

type Props = {
  tutorialId: string;
  size?: number;
  className?: string;
  onToggle?: (tutorialId: string, favorited: boolean) => void;
};

// ♡ — работает через localStorage (без бэкенда, см. Часть 4 задачи).
// Может стоять внутри <Link> (карточка целиком кликабельна к деталке) —
// поэтому останавливает всплытие клика.
export function FavoriteHeart({ tutorialId, size = 16, className, onToggle }: Props) {
  const [favorited, setFavorited] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFavorited(readFavorites().has(tutorialId));
    setMounted(true);
  }, [tutorialId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const favorites = readFavorites();
    const next = !favorites.has(tutorialId);
    if (next) favorites.add(tutorialId);
    else favorites.delete(tutorialId);
    writeFavorites(favorites);
    setFavorited(next);
    onToggle?.(tutorialId, next);
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={favorited}
      aria-label={favorited ? "Убрать из избранного" : "Добавить в избранное"}
      whileTap={{ scale: mounted ? 1.3 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <Heart
        width={size}
        height={size}
        className={favorited ? "text-rose" : "text-text-muted"}
        fill={favorited ? "currentColor" : "none"}
        strokeWidth={1.75}
        aria-hidden
      />
    </motion.button>
  );
}
