-- ============================================================
-- TOQUE Ритуал — конструктор ритуала v2 (несколько именованных ритуалов)
-- Миграция 012 (номер 010 занят 010_age_group_18_24.sql,
-- 011 занят 011_completion.sql — из более ранних сессий)
-- ============================================================

-- Таблица ритуалов (пользователь может иметь несколько, до 5 — лимит
-- проверяется в коде, см. lib/actions/rituals.ts).
create table if not exists rituals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  name text not null default 'Мой ритуал',
  is_active boolean default false,
  -- schedule: массив DeviceRitualConfig — см. lib/actions/rituals.ts:
  -- [{
  --   deviceSlug: 'nuo',
  --   color: '#93C5FD',
  --   modes: [{
  --     modeName: 'cleansing',
  --     displayName: 'Очищение',
  --     sessionTime: 'morning' | 'evening' | 'flexible',
  --     days: ['mon','wed','fri']
  --   }]
  -- }]
  schedule jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table rituals enable row level security;

create policy "rituals_select" on rituals
  for select using (auth.uid() = profile_id);
create policy "rituals_insert" on rituals
  for insert with check (auth.uid() = profile_id);
create policy "rituals_update" on rituals
  for update using (auth.uid() = profile_id);
create policy "rituals_delete" on rituals
  for delete using (auth.uid() = profile_id);

-- profiles.custom_schedule больше не используется приложением (заменён
-- таблицей rituals выше) — колонку намеренно НЕ удаляем, чтобы не терять
-- уже сохранённые данные прежних пользователей задним числом.

notify pgrst, 'reload schema';
