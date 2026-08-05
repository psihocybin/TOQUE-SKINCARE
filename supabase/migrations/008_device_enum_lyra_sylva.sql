-- ============================================================
-- TOQUE Ритуал — LYRA и SYLVA как выбор в квизе (profiles.device)
-- Миграция 008
-- ============================================================

-- profiles.device ограничен CHECK-констрейнтом на 11 исторических значений
-- (см. 001_initial_schema.sql) — LYRA и SYLVA туда не попали, хотя оба
-- устройства уже полноценно поддержаны (protocols.ts, devices.ts, /ritual).
-- Редизайн квиза (Часть 4) показывает все 13 устройств для выбора — без
-- этой миграции запись профиля с primaryDevice = 'LYRA' или 'SYLVA' будет
-- отклонена базой данных.
alter table profiles drop constraint if exists profiles_device_check;

alter table profiles add constraint profiles_device_check
  check (device in (
    'NUO','NUO_PRO','LUMERA','ELARA','PULSAR','ANIMA',
    'NOVA','AERIS','AURA','VIBE','QUANTUM','LYRA','SYLVA'
  ));

notify pgrst, 'reload schema';
