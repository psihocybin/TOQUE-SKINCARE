"use client";

import { useEffect, useRef, useState } from "react";
import { getDeviceBySlug } from "@/lib/content/devices";
import { cn } from "@/lib/utils";

type DeviceImageProps = {
  slug: string;
  size?: number;
  className?: string;
  // Заполнить весь родительский контейнер (для больших фото-миниатюр
  // уроков) вместо фиксированного пиксельного квадрата (для мелких иконок
  // в бейджах/списках). Родитель сам задаёт размер и rounded-*.
  fill?: boolean;
};

// Фото устройства из public/devices/, с плейсхолдером (первая буква slug),
// пока реальных фото нет — см. docs/ADDING_DEVICE_PHOTOS.md. Каждое
// устройство в devices.ts уже указывает на /devices/[slug].jpg, даже если
// файла ещё нет на диске — поэтому "фото есть" проверяем через ошибку
// загрузки, а не просто наличие поля imageUrl (иначе вместо плейсхолдера
// показывалась бы битая картинка).
//
// <img> рендерится на сервере и браузер начинает грузить его ДО гидратации.
// 404 с локального dev-сервера отвечает быстрее, чем React успевает
// повесить обработчики — событие error браузер уже "проиграл" мимо onError.
// Поэтому дополнительно проверяем img.complete/naturalWidth сразу после
// монтирования — это ловит уже случившуюся до гидратации ошибку.
//
// Размер задаём через style, а не Tailwind-классы вида w-[${size}px]:
// произвольная arbitrary-value строка, собранная из переменной, не
// попадает в JIT-скан Tailwind и в сборке не будет сгенерирован CSS-класс.
export function DeviceImage({
  slug,
  size = 52,
  className,
  fill = false,
}: DeviceImageProps) {
  const device = getDeviceBySlug(slug);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgSrc = device?.imageUrl;
  const dimension = fill ? undefined : { width: size, height: size };
  const showPlaceholder = !imgSrc || errored;

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 0) {
      setErrored(true);
    }
  }, [imgSrc]);

  if (showPlaceholder) {
    return (
      <div
        style={dimension}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-cream-dark",
          fill && "h-full w-full",
          className,
        )}
      >
        <span
          className={cn(
            "font-bold text-olive",
            fill ? "text-4xl" : "text-xl",
          )}
        >
          {slug[0]?.toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div
      style={dimension}
      className={cn(
        "shrink-0 overflow-hidden rounded-xl bg-cream-dark",
        fill && "h-full w-full",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- фото приходят из public/devices/, next/image не даёт выгоды для локальных статических ассетов такого размера */}
      <img
        ref={imgRef}
        src={imgSrc}
        alt={device?.name ?? slug}
        onError={() => setErrored(true)}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
