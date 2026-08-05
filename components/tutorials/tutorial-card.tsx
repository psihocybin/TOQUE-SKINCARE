import Link from "next/link";
import { Clock } from "lucide-react";
import { DeviceImage } from "@/components/shared/device-image";
import { FavoriteHeart } from "@/components/tutorials/favorite-heart";
import { getDeviceBySlug } from "@/lib/content/devices";
import type { Tutorial } from "@/lib/content/tutorials";
import { cn } from "@/lib/utils";

type Props = {
  tutorial: Tutorial;
  onFavoriteToggle?: (id: string, favorited: boolean) => void;
};

export function TutorialCard({ tutorial, onFavoriteToggle }: Props) {
  const device = getDeviceBySlug(tutorial.deviceSlug);

  return (
    <Link
      href={`/tutorials/${tutorial.id}`}
      className="flex overflow-hidden rounded-2xl bg-white shadow-sm"
    >
      <div
        className={cn(
          "flex w-[120px] shrink-0 items-center justify-center rounded-l-2xl",
          tutorial.thumbnailPlaceholder,
        )}
      >
        <DeviceImage slug={tutorial.deviceSlug} size={48} />
      </div>
      <div className="min-w-0 flex-1 p-3">
        <div className="flex items-center gap-1.5">
          <DeviceImage slug={tutorial.deviceSlug} size={20} />
          <span className="text-[10px] text-text-muted">
            {device?.name ?? tutorial.deviceSlug.toUpperCase()}
          </span>
        </div>
        <p className="mt-1 text-[14px] font-semibold text-text">
          {tutorial.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[12px] text-text-muted">
          {tutorial.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] text-text-muted">
            <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
            {tutorial.durationMinutes} мин
          </span>
          <FavoriteHeart
            tutorialId={tutorial.id}
            size={16}
            onToggle={onFavoriteToggle}
          />
        </div>
      </div>
    </Link>
  );
}
