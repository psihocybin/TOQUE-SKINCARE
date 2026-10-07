"use client";

import { useEffect, useRef, useState } from "react";
import { DeviceImage } from "@/components/shared/device-image";

type Props = {
  slug: string;
  // Папка в public/ с отдельным набором фото под конкретное место:
  // tutorials — обложки уроков.
  folder: "tutorials";
};

// Фото устройства из своей папки (public/<folder>/<slug>.jpg). Каталог
// и мелкие иконки остаются на бежевых фото из public/devices/. Пока файла
// нет — падаем обратно на DeviceImage. Проверка complete/naturalWidth —
// та же, что в DeviceImage: ошибка загрузки может случиться до гидратации,
// мимо onError.
export function DevicePhoto({ slug, folder }: Props) {
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 0) {
      setErrored(true);
    }
  }, [slug, folder]);

  if (errored) {
    return <DeviceImage slug={slug} fill className="rounded-none" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- локальные статические фото, как в DeviceImage
    <img
      ref={imgRef}
      src={`/${folder}/${slug}.jpg`}
      alt=""
      onError={() => setErrored(true)}
      className="h-full w-full object-cover object-center"
    />
  );
}
