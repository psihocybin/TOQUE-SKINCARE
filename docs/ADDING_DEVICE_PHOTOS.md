# Как добавить фото устройства

Пока в `public/devices/` нет ни одного файла — везде показывается
плейсхолдер (первая буква slug на кремовом фоне), это ожидаемо.

1. Подготовь фото: квадратное или близкое к квадрату.
   Рекомендуемый размер: 400×400px или 800×800px.
   Формат: `.jpg` (для скорости) или `.webp` (для качества).
   Фон: белый или кремовый (`#FAFAF7`).

2. Положи файл в `public/devices/`.
   Имя файла: `[slug].jpg` (например, `nuo.jpg`, `nuo-pro.jpg`, `lyra.jpg`) —
   slug берётся из `lib/content/devices.ts`.

3. Всё — приложение автоматически покажет фото через `DeviceImage`
   (`components/shared/device-image.tsx`), плейсхолдер больше не появится
   для этого устройства.

Список ожидаемых имён файлов (все 13 устройств):

```
nuo.jpg
nuo-pro.jpg
lumera.jpg
elara.jpg
pulsar.jpg
anima.jpg
aura.jpg
nova.jpg
aeris.jpg
quantum.jpg
vibe.jpg
lyra.jpg
sylva.jpg
```

Если решите поменять расширение (например, на `.webp`) — обновите
соответствующее поле `imageUrl` в `lib/content/devices.ts`.
