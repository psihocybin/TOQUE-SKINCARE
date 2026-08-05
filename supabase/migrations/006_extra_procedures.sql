-- ============================================================
-- TOQUE Ритуал — Флаг is_extra для внеплановых процедур
-- Миграция 006
-- ============================================================

alter table procedures
  add column if not exists is_extra boolean default false;

-- Обновляем PostgREST-кэш, чтобы новая колонка была видна сразу.
notify pgrst, 'reload schema';
