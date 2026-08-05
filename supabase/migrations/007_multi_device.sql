-- ============================================================
-- TOQUE Ритуал — Поддержка нескольких устройств у одного пользователя
-- Миграция 007
-- ============================================================

-- Массив устройств пользователя. Хранится в формате slug (как в
-- lib/content/devices.ts: 'nuo', 'nuo-pro', 'elara', …), а НЕ как enum
-- profiles.device ('NUO', 'NUO_PRO', …) — это нужно для совместимости с
-- комбо-протоколами и каталогом экосистемы, которые везде ключуются по slug.
alter table profiles
  add column if not exists devices text[] default '{}';

-- Переносим одиночное устройство в массив, конвертируя enum → slug
-- (нижний регистр, подчёркивание → дефис): 'NUO_PRO' → 'nuo-pro'.
update profiles
set devices = array[lower(replace(device, '_', '-'))]
where device is not null and devices = '{}';

-- profiles.device остаётся как primary-устройство для обратной совместимости
-- со всеми существующими экранами (экосистема, пуши и т.д.).

notify pgrst, 'reload schema';
