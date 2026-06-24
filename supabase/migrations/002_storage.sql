-- ============================================================
-- TOQUE Ритуал — Storage bucket для фото
-- Миграция 002: bucket "photos" + RLS политики
-- ============================================================

-- Создаём приватный bucket для фото прогресса
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false);

-- ────────────────────────────────────────────
-- RLS на storage.objects
-- ────────────────────────────────────────────

-- Загрузка: только в свою папку {user_id}/...
create policy "photos bucket: upload own"
  on storage.objects for insert
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Чтение: только своих файлов
create policy "photos bucket: read own"
  on storage.objects for select
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Удаление: только своих файлов
create policy "photos bucket: delete own"
  on storage.objects for delete
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
