-- ============================================================
-- TOQUE Ритуал — Настройки уведомлений, гарантия, отложенный NPS
-- Миграция 003
-- ============================================================

-- ────────────────────────────────────────────
-- profiles: новые колонки
-- ────────────────────────────────────────────

alter table profiles add column if not exists notification_settings jsonb
  default '{"reminders": true, "tips": true, "weekly_report": false}'::jsonb;

alter table profiles add column if not exists warranty_receipt_url text;
alter table profiles add column if not exists warranty_registered_at timestamptz;

-- ────────────────────────────────────────────
-- surveys: расширяем тип, добавляем nps_d30_postponed
-- ────────────────────────────────────────────

alter table surveys drop constraint if exists surveys_survey_type_check;
alter table surveys add constraint surveys_survey_type_check check (
  survey_type in (
    'nps_d30',
    'nps_d30_postponed',
    'jcs_d60',
    'week1',
    'first_procedure'
  )
);

-- ────────────────────────────────────────────
-- Storage bucket "warranties" (приватный)
-- ────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('warranties', 'warranties', false)
on conflict (id) do nothing;

-- RLS: загрузка только в свою папку {auth.uid()}/...
create policy "warranties bucket: upload own"
  on storage.objects for insert
  with check (
    bucket_id = 'warranties'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "warranties bucket: read own"
  on storage.objects for select
  using (
    bucket_id = 'warranties'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "warranties bucket: delete own"
  on storage.objects for delete
  using (
    bucket_id = 'warranties'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
