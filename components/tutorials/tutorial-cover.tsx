"use client";

import { useEffect, useRef, useState } from "react";
import { DeviceImage } from "@/components/shared/device-image";

type Props = { deviceSlug: string };

// Обложка карточки урока — отдельное фото из public/tutorials/<slug>.jpg
// (одно на устройство). Каталог и мелкие иконки остаются на бежевых фото
// из public/devices/. Пока обложки нет — падаем обратно на DeviceImage.
// Проверка complete/naturalWidth — та же, что в DeviceImage: ошибка
// загрузки может случиться до гидратации, мимо onError.
export function TutorialCover({ deviceSlug }: Props) {
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 0) {
      setErrored(true);
    }
  }, [deviceSlug]);

  if (errored) {
    return <DeviceImage slug={deviceSlug} fill className="rounded-none" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- локальные статические фото, как в DeviceImage
    <img
      ref={imgRef}
      src={`/tutorials/${deviceSlug}.jpg`}
      alt=""
      onError={() => setErrored(true)}
      className="h-full w-full object-cover object-center"
    />
  );
}
