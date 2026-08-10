-- ============================================================
-- TOQUE Ритуал — сброс и заполнение тестовых данных
-- Тестовый пользователь: test@toque.dev
-- User UID: 77131bb6-9e42-47b9-af94-d781a44e6a46
--
-- ПРЕДПОСЛЕДНЕЕ УСЛОВИЕ: в базе уже должны быть накачены миграции
-- 007-012 (devices, custom_schedule/current_streak/completion_celebrated,
-- age_group 18-24, rituals). Без них часть операторов ниже упадёт с
-- ошибкой "column/table does not exist".
--
-- Выполнять целиком в Supabase Dashboard → SQL Editor.
-- ============================================================

-- Очистить данные тест-пользователя
delete from procedures
where profile_id = '77131bb6-9e42-47b9-af94-d781a44e6a46';

delete from surveys
where profile_id = '77131bb6-9e42-47b9-af94-d781a44e6a46';

delete from rituals
where profile_id = '77131bb6-9e42-47b9-af94-d781a44e6a46';

-- Сбросить профиль до состояния "программа идёт уже неделю".
-- device — UPPERCASE enum ('NUO'), devices[] — lowercase slug ('nuo'):
-- это два разных по регистру поля в реальной схеме (profiles.device CHECK
-- constraint из 001_initial_schema.sql требует 'NUO', а devices[] хранит
-- те же slug'и, что lib/content/devices.ts — в нижнем регистре).
--
-- activated_at = 6 дней назад, не 7: getCurrentDayNumber() считает день
-- активации днём 1 (см. lib/program/utils.ts), поэтому "7 дней назад"
-- даёт день 8, а не 7. "6 дней назад" — ровно день 7, как и требуется.
update profiles set
  name = 'Анна',
  device = 'NUO',
  devices = array['nuo'],
  age_group = '35-44',
  goal = 'cleansing',
  skin_type = 'combo',
  experience = 'beginner',
  preferred_time = 'evening',
  frequency = 'low',
  activated_at = now() - interval '6 days',
  completion_celebrated = false,
  warranty_serial = null,
  custom_schedule = null,
  current_streak = 0
where id = '77131bb6-9e42-47b9-af94-d781a44e6a46';

-- 5 процедур за последние 7 дней (сегодня, вчера, 3/5/6 дней назад).
-- day_number приведён в соответствие с реальным днём программы на момент
-- completed_at (при activated_at = 6 дней назад и дне активации = день 1):
-- сегодня=день7, вчера=день6, -3дня=день4, -5дней=день2, -6дней=день1.
-- В исходном ТЗ day_number не совпадал с датой (например, день 5 был
-- указан для процедуры 3 дня назад, хотя это день 4) — из-за этого сетка
-- /my-program рисовала бы дни не там, где реально стоят галочки. Streak и
-- посещаемость на /home это не ломало (они считаются по completed_at, не
-- по day_number), но исправлено для полной согласованности тестовых данных.
insert into procedures (profile_id, day_number, mode,
  duration_seconds, feedback, completed_at)
values
  ('77131bb6-9e42-47b9-af94-d781a44e6a46',
   7, 'Cleaning', 300, 'great', now()),
  ('77131bb6-9e42-47b9-af94-d781a44e6a46',
   6, 'Lifting', 480, 'normal', now() - interval '1 day'),
  ('77131bb6-9e42-47b9-af94-d781a44e6a46',
   4, 'Ion-', 300, 'great', now() - interval '3 days'),
  ('77131bb6-9e42-47b9-af94-d781a44e6a46',
   2, 'Ion+', 480, 'great', now() - interval '5 days'),
  ('77131bb6-9e42-47b9-af94-d781a44e6a46',
   1, 'Cleaning', 300, 'questions', now() - interval '6 days');

-- Итог после выполнения:
--   activated_at = 6 дней назад → текущий день программы = 7
--   streak = 2 (сегодня + вчера подряд, дальше разрыв на позавчера)
--   посещаемость: 5 из 7 последних дней заполнены (пусто на -2 и -4 днях)
--   completedProcedures (счётчик на /home и /profile) = 5
