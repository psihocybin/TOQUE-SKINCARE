import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
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

      <p className="mt-1 text-center text-[10px] text-text-muted">
        {devices.length} устройств для системного ухода
      </p>

      {current ? (
        <FadeIn className="mt-7">
          <p className="text-[9px] uppercase tracking-[1px] text-olive">
            У вас уже есть
          </p>
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-olive/30 bg-olive/[0.06] px-3 py-3">
            <DeviceAvatar device={current} accent />
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
          <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
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
        <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
          Другие категории
        </p>
        <div className="mt-3 flex flex-col">
          {others.map((d) => (
            <DeviceRow key={d.slug} device={d} variant="list" />
          ))}
        </div>
      </FadeIn>
    </main>
  );
}

function DeviceAvatar({
  device,
  accent = false,
}: {
  device: Device;
  accent?: boolean;
}) {
  const initial = device.name[0] ?? "?";
  return (
    <div
      className={
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-pill " +
        (accent ? "bg-olive/20" : "bg-black/[0.04]")
      }
      aria-hidden
    >
      <span
        className={
          "text-[13px] " + (accent ? "text-olive" : "text-text-muted")
        }
      >
        {initial}
      </span>
    </div>
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
          ? "flex items-center gap-3 rounded-lg border border-black/8 bg-white px-3 py-3 transition-colors hover:bg-black/[0.02]"
          : "flex items-center gap-3 border-b border-black/8 py-3 last:border-b-0"
      }
    >
      <DeviceAvatar device={device} />
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
