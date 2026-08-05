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
          className="flex h-[180px] w-[140px] shrink-0 flex-col items-center rounded-2xl bg-white p-3 text-center shadow-sm"
        >
          <div className="mt-2">
            <DeviceImage slug={d.slug} size={60} />
          </div>
          <p className="mt-2 text-[13px] font-semibold text-text">{d.name}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] text-text-muted">
            {d.subtitle}
          </p>
          <span className="mt-auto pt-1 text-[11px] text-olive">Узнать →</span>
        </Link>
      ))}
    </div>
  );
}
