import { notFound } from "next/navigation";
import { Heart } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { FadeIn } from "@/components/shared/fade-in";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PromoCodeCard } from "@/components/ecosystem/promo-code-card";
import { getProfileWithStats } from "@/lib/queries/profile";
import {
  deviceEnumToSlug,
  getDeviceBySlug,
  type Device,
} from "@/lib/content/devices";
import { getProtocolBySlug } from "@/lib/content/protocols";
import { ProcedureModeSteps } from "@/components/ritual/procedure-mode-steps";

export default async function DevicePage({
  params,
}: {
  params: { device: string };
}) {
  const device: Device | undefined = getDeviceBySlug(params.device);
  if (!device) {
    notFound();
  }

  const protocol = getProtocolBySlug(device.slug);

  const { profile } = await getProfileWithStats();
  const currentSlug = profile.device ? deviceEnumToSlug(profile.device) : null;
  const currentDevice = currentSlug ? getDeviceBySlug(currentSlug) : undefined;
  // Владение проверяем и по новому массиву devices (несколько устройств),
  // и по legacy-полю device — на случай, если профиль ещё не мигрирован.
  const ownedSlugs =
    profile.devices && profile.devices.length > 0
      ? profile.devices
      : currentSlug
        ? [currentSlug]
        : [];
  const isCurrentUserDevice = ownedSlugs.includes(device.slug);
  const pairsWithUserDevice =
    !!currentSlug && device.pairsWith.includes(currentSlug);

  const comboTabLabel = currentDevice
    ? `С ${currentDevice.name}`
    : "Совместимость";

  const comboText =
    !currentDevice || pairsWithUserDevice
      ? device.comboProtocol
      : "Эти устройства можно использовать в разные дни как самостоятельные протоколы.";

  const heroInitial = device.name[0] ?? "?";

  return (
    <main className="flex min-h-screen flex-col px-4 pb-32 pt-4">
      <header className="relative flex items-center justify-center">
        <div className="absolute left-2 top-0">
          <BackButton href="/ecosystem" />
        </div>
        <p className="text-[14px] text-text">{device.name}</p>
        <button
          type="button"
          aria-label="В избранное"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center text-text-muted"
        >
          <Heart className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>
      </header>

      <FadeIn className="mt-4">
        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-olive/15 bg-olive/[0.05]">
          <span className="text-[48px] leading-none text-olive">
            {heroInitial}
          </span>
          <span className="mt-3 text-[8px] uppercase tracking-[1px] text-text-muted">
            Фото устройства
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-4">
        <p className="text-[20px] text-text">{device.name}</p>
        <p className="mt-1 text-[11px] text-text-muted">{device.subtitle}</p>
      </FadeIn>

      <FadeIn delay={0.2} className="mt-4">
        <Tabs defaultValue="description">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1 text-[11px]">
              Описание
            </TabsTrigger>
            <TabsTrigger value="protocol" className="flex-1 text-[11px]">
              Протокол
            </TabsTrigger>
            <TabsTrigger value="combo" className="flex-1 text-[11px]">
              {comboTabLabel}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 text-[11px]">
              Отзывы
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-4">
            <p className="text-[12px] leading-[1.6] text-text">
              {device.description}
            </p>
          </TabsContent>
          <TabsContent value="protocol" className="pt-4">
            {protocol ? (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
                    Частота применения
                  </p>
                  <p className="mt-1 text-[12px] text-text">
                    {protocol.frequency.label}
                  </p>
                  {protocol.frequency.note ? (
                    <p className="mt-1 text-[11px] text-text-muted">
                      {protocol.frequency.note}
                    </p>
                  ) : null}
                  {protocol.weeklySchedule ? (
                    <p className="mt-1 text-[11px] text-text-muted">
                      {protocol.weeklySchedule}
                    </p>
                  ) : null}
                </div>

                {protocol.modes.length > 0 ? (
                  <div>
                    <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
                      Режимы
                    </p>
                    <div className="mt-2 flex flex-col gap-3">
                      {protocol.modes.map((mode) => (
                        <div
                          key={mode.name}
                          className="rounded-lg border border-black/8 bg-white px-3 py-3"
                        >
                          <ProcedureModeSteps mode={mode} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-text-muted">
                    Пошаговый протокол применения появится позже.
                  </p>
                )}

                {protocol.importantRules.length > 0 ? (
                  <div>
                    <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
                      Важно
                    </p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {protocol.importantRules.map((rule) => (
                        <li
                          key={rule}
                          className="text-[11px] leading-relaxed text-text-muted"
                        >
                          · {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-center text-[11px] text-text-muted">
                Протокол применения появится позже.
              </p>
            )}
          </TabsContent>
          <TabsContent value="combo" className="pt-4">
            <p className="text-[12px] leading-[1.6] text-text">{comboText}</p>
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <p className="text-center text-[11px] text-text-muted">
              Отзывы скоро появятся
            </p>
          </TabsContent>
        </Tabs>
      </FadeIn>

      {isCurrentUserDevice ? (
        <FadeIn delay={0.3} className="mt-6">
          <div className="rounded-xl border border-olive/30 bg-olive/[0.06] px-4 py-3 text-center text-[11px] text-text-muted">
            Это ваше устройство — программа уже подобрана под него.
          </div>
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.3} className="mt-6">
            <PromoCodeCard code={device.promoCode} />
          </FadeIn>

          <FadeIn delay={0.4} className="mt-4">
            <a
              href={device.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center rounded-pill bg-olive text-sm text-cream transition-opacity hover:opacity-95"
            >
              Перейти к покупке
            </a>
          </FadeIn>
        </>
      )}
    </main>
  );
}
