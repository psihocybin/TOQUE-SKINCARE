-- ============================================================
-- TOQUE Ритуал — редизайн по образцу GESKE/Medicube:
-- конструктор ритуала, туториалы, достижения
-- Миграция 009 (номер 008 уже занят 008_device_enum_lyra_sylva.sql)
-- ============================================================

-- Кастомное расписание ритуала (конструктор, app/(main)/ritual-builder)
alter table profiles
  add column if not exists custom_schedule jsonb;

-- Серия (streak) — кэш для быстрого чтения.
-- Примечание: сейчас ничем не поддерживается (нет триггера на завершение
-- процедуры) — приложение считает streak на лету в lib/queries/attendance.ts.
-- Колонка добавлена по спецификации, на будущее.
alter table profiles
  add column if not exists current_streak integer default 0;

-- Избранные туториалы.
-- Примечание: сейчас не используется приложением — лайки туториалов хранятся
-- в localStorage (см. lib/tutorials/favorites.ts). Таблица создана на будущее,
-- когда понадобится синхронизация избранного между устройствами.
create table if not exists tutorial_favorites (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  tutorial_id text not null,
  created_at timestamptz default now(),
  unique(profile_id, tutorial_id)
);

alter table tutorial_favorites enable row level security;

create policy "tutorial_favorites_select_own"
  on tutorial_favorites for select
  using (auth.uid() = profile_id);

create policy "tutorial_favorites_insert_own"
  on tutorial_favorites for insert
  with check (auth.uid() = profile_id);

create policy "tutorial_favorites_delete_own"
  on tutorial_favorites for delete
  using (auth.uid() = profile_id);

-- Достижения.
-- Примечание: сейчас не используется приложением — earned считается на лету
-- в lib/content/milestones.ts из существующих данных профиля (процедуры,
-- streak, день программы, количество устройств). Таблица создана на будущее,
-- если понадобится фиксировать момент получения ачивки (earned_at) и не
-- пересчитывать статус задним числом.
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  milestone_id text not null,
  earned_at timestamptz default now(),
  unique(profile_id, milestone_id)
);

alter table achievements enable row level security;

create policy "achievements_select_own"
  on achievements for select
  using (auth.uid() = profile_id);

create policy "achievements_insert_own"
  on achievements for insert
  with check (auth.uid() = profile_id);

create policy "achievements_delete_own"
  on achievements for delete
  using (auth.uid() = profile_id);

notify pgrst, 'reload schema';
