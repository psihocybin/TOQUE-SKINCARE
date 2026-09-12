import Link from "next/link";
import { Clock } from "lucide-react";
import { DeviceImage } from "@/components/shared/device-image";
import { FavoriteHeart } from "@/components/tutorials/favorite-heart";
import { getDeviceBySlug } from "@/lib/content/devices";
import { tutorialDeviceLabel, type Tutorial } from "@/lib/content/tutorials";

type Props = {
  tutorial: Tutorial;
  onFavoriteToggle?: (id: string, favorited: boolean) => void;
};

export function TutorialCard({ tutorial, onFavoriteToggle }: Props) {
  const device = getDeviceBySlug(tutorial.deviceSlug);

  return (
    <Link
      href={`/tutorials/${tutorial.id}`}
      className="flex overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="w-[120px] shrink-0">
        <DeviceImage slug={tutorial.deviceSlug} fill className="rounded-none" />
      </div>
      <div className="min-w-0 flex-1 p-3">
        <div className="flex items-center gap-1.5">
          <DeviceImage slug={tutorial.deviceSlug} size={20} />
          <span className="text-[10px] text-text-muted">
            {tutorialDeviceLabel(
              tutorial.deviceSlug,
              device?.name ?? tutorial.deviceSlug.toUpperCase(),
            )}
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
