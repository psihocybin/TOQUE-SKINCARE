import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import { DeviceImage } from "@/components/shared/device-image";
import { getProfileWithStats } from "@/lib/queries/profile";
import {
  devices,
  deviceEnumToSlug,
  getDeviceBySlug,
  type Device,
} from "@/lib/content/devices";

export default async function EcosystemPage() {
  const { profile } = await getProfileWithStats();

  const currentSlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const current: Device | undefined = currentSlug
    ? getDeviceBySlug(currentSlug)
    : undefined;

  const pairsSlugs = current?.pairsWith ?? [];
  const recommended = pairsSlugs
    .map((slug) => getDeviceBySlug(slug))
    .filter((d): d is Device => Boolean(d));

  // «Другие категории» = всё, кроме текущего и уже показанных в «Логично
  // продолжить». Внутри — сначала устройства той же категории, что у
  // пользователя, затем остальные (стабильно относительно исходного порядка).
  const currentCategory = current?.category;
  const others = devices
    .filter((d) => {
      if (current && d.slug === current.slug) return false;
      if (pairsSlugs.includes(d.slug)) return false;
      return true;
    })
    .sort((a, b) => {
      if (!currentCategory) return 0;
      const aSame = a.category === currentCategory ? 0 : 1;
      const bSame = b.category === currentCategory ? 0 : 1;
      return aSame - bSame;
    });

  return (
    <main className="flex min-h-screen flex-col px-4 pb-24 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/profile" />
        </div>
        <p className="text-[14px] text-text">Экосистема TOQUE</p>
      </header>

      <p
        className="mt-1 text-center text-[10px] text-text-muted"
        style={{ textShadow: "0 1px 4px rgba(250,250,247,0.9)" }}
      >
        {devices.length} устройств для системного ухода
      </p>

      {current ? (
        <FadeIn className="mt-7">
          <p
            className="text-[9px] uppercase tracking-[1px] text-olive-dark"
            style={{ textShadow: "0 1px 4px rgba(250,250,247,0.9)" }}
          >
            У вас уже есть
          </p>
          <div className="mt-3 flex items-center gap-3 rounded-lg border-2 border-olive bg-white/85 px-3 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-lg">
            <DeviceImage slug={current.slug} size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-text">{current.name}</p>
              <p className="text-[10px] text-text-muted">{current.subtitle}</p>
            </div>
            <span
              className="flex h-6 w-6 items-center justify-center rounded-pill bg-olive"
              aria-hidden
            >
              <Check className="h-3.5 w-3.5 text-cream" strokeWidth={2.5} />
            </span>
          </div>
        </FadeIn>
      ) : null}

      {recommended.length > 0 ? (
        <FadeIn delay={0.15} className="mt-7">
          <p
            className="text-[9px] uppercase tracking-[1px] text-text-muted"
            style={{ textShadow: "0 1px 4px rgba(250,250,247,0.9)" }}
          >
            Логично продолжить
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {recommended.map((d) => (
              <DeviceRow key={d.slug} device={d} variant="card" />
            ))}
          </div>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.3} className="mt-7">
        <p
          className="text-[9px] uppercase tracking-[1px] text-text-muted"
          style={{ textShadow: "0 1px 4px rgba(250,250,247,0.9)" }}
        >
          Другие категории
        </p>
        <div className="mt-3 overflow-hidden rounded-lg border border-black/10 bg-white/85 px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-lg">
          {others.map((d) => (
            <DeviceRow key={d.slug} device={d} variant="list" />
          ))}
        </div>
      </FadeIn>
    </main>
  );
}

function DeviceRow({
  device,
  variant,
}: {
  device: Device;
  variant: "card" | "list";
}) {
  return (
    <Link
      href={`/ecosystem/${device.slug}`}
      className={
        variant === "card"
          ? "flex items-center gap-3 rounded-lg border border-black/10 bg-white/85 px-3 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-lg transition-colors hover:bg-white"
          : "flex items-center gap-3 border-b border-black/8 py-3 last:border-b-0"
      }
    >
      <DeviceImage slug={device.slug} size={36} />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-text">{device.name}</p>
        <p className="text-[10px] text-text-muted">{device.subtitle}</p>
      </div>
      <ChevronRight
        className="h-3.5 w-3.5 text-text-muted"
        strokeWidth={1.5}
        aria-hidden
      />
    </Link>
  );
}
