-- ============================================================
-- TOQUE Ритуал — добавление возрастной группы 18-24 в квиз
-- Миграция 010
-- ============================================================

-- profiles.age_group ограничен CHECK-констрейнтом на 4 значения
-- (см. 001_initial_schema.sql) — та же ситуация, что была с profiles.device
-- до миграции 008: без этой миграции запись профиля с ageGroup = '18-24'
-- будет отклонена базой данных, хотя колонка называется "просто text".
alter table profiles drop constraint if exists profiles_age_group_check;

alter table profiles add constraint profiles_age_group_check
  check (age_group in ('18-24','25-34','35-44','45-54','55+'));

notify pgrst, 'reload schema';
