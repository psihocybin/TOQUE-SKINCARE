-- ============================================================
-- TOQUE Ритуал — экран завершения 30-дневной программы
-- Миграция 011 (номер 009 занят 009_extended_features.sql,
-- 010 занят 010_age_group_18_24.sql — из более ранних сессий)
-- ============================================================

-- Одноразовый флаг: показан ли уже /program-complete этому пользователю.
alter table profiles
  add column if not exists completion_celebrated boolean default false;

notify pgrst, 'reload schema';
