import Link from "next/link";
import { DeviceImage } from "@/components/shared/device-image";
import type { Device } from "@/lib/content/devices";

type Props = { devices: Device[] };

export function RecommendedDevicesScroll({ devices }: Props) {
  if (devices.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {devices.map((d) => (
        <Link
          key={d.slug}
          href={`/ecosystem/${d.slug}`}
          className="flex w-[150px] shrink-0 flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)]"
        >
          <div className="relative h-[140px] shrink-0">
            <DeviceImage slug={d.slug} fill className="rounded-none" />
          </div>
          <div className="px-3 py-2.5">
            <p className="truncate text-[13px] font-semibold text-text">
              {d.name}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-text-muted">
              {d.subtitle}
            </p>
            <span className="mt-1 inline-block text-[11px] text-olive">
              Узнать →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
