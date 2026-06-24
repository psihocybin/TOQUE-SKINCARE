-- ============================================================
-- TOQUE Ритуал — начальная схема БД
-- Миграция 001: таблицы, RLS, триггер создания профиля
-- ============================================================

-- ────────────────────────────────────────────
-- 1. profiles
-- ────────────────────────────────────────────
create table public.profiles (
  id             uuid        primary key references auth.users(id) on delete cascade,
  name           text        not null default '',
  device         text        check (device in ('NUO','NUO_PRO','LUMERA','ELARA','PULSAR','ANIMA','NOVA','AERIS','AURA','VIBE','QUANTUM')),
  age_group      text        check (age_group in ('25-34','35-44','45-54','55+')),
  goal           text        check (goal in ('cleansing','tone','glow','puffiness','all')),
  is_gift        boolean     not null default false,
  skin_type      text        check (skin_type in ('normal','dry','oily','combo','sensitive')),
  experience     text        check (experience in ('beginner','familiar','experienced','expert')),
  preferred_time text        check (preferred_time in ('morning','evening','flexible')),
  frequency      text        check (frequency in ('low','medium','daily')),
  warranty_serial text,
  referral_code  text        unique,
  referred_by    uuid        references public.profiles(id),
  activated_at   timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

-- ────────────────────────────────────────────
-- 2. procedures
-- ────────────────────────────────────────────
create table public.procedures (
  id               uuid        primary key default gen_random_uuid(),
  profile_id       uuid        not null references public.profiles(id) on delete cascade,
  day_number       integer     not null,
  mode             text        not null,
  duration_seconds integer     not null,
  feedback         text        check (feedback in ('great','normal','questions')),
  note             text,
  completed_at     timestamptz not null default now()
);

create index procedures_profile_completed_idx
  on public.procedures(profile_id, completed_at desc);

-- ────────────────────────────────────────────
-- 3. surveys
-- ────────────────────────────────────────────
create table public.surveys (
  id           uuid        primary key default gen_random_uuid(),
  profile_id   uuid        not null references public.profiles(id) on delete cascade,
  survey_type  text        not null check (survey_type in ('nps_d30','jcs_d60','week1','first_procedure')),
  score        integer,
  answer       text,
  comment      text,
  created_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────
-- 4. photos
-- ────────────────────────────────────────────
create table public.photos (
  id           uuid        primary key default gen_random_uuid(),
  profile_id   uuid        not null references public.profiles(id) on delete cascade,
  storage_path text        not null,
  day_number   integer     not null, -- 0 = baseline
  taken_at     timestamptz not null default now()
);

-- ────────────────────────────────────────────
-- 5. push_subscriptions
-- ────────────────────────────────────────────
create table public.push_subscriptions (
  id         uuid        primary key default gen_random_uuid(),
  profile_id uuid        not null references public.profiles(id) on delete cascade,
  endpoint   text        not null,
  p256dh     text        not null,
  auth       text        not null,
  created_at timestamptz not null default now()
);

create unique index push_subscriptions_endpoint_idx
  on public.push_subscriptions(endpoint);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles          enable row level security;
alter table public.procedures        enable row level security;
alter table public.surveys           enable row level security;
alter table public.photos            enable row level security;
alter table public.push_subscriptions enable row level security;

-- ────────────────────────────────────────────
-- RLS: profiles (id = auth.uid())
-- ────────────────────────────────────────────
create policy "profiles: select own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: insert own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles: update own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles: delete own"
  on public.profiles for delete
  using (id = auth.uid());

-- ────────────────────────────────────────────
-- RLS: procedures
-- ────────────────────────────────────────────
create policy "procedures: select own"
  on public.procedures for select
  using (profile_id = auth.uid());

create policy "procedures: insert own"
  on public.procedures for insert
  with check (profile_id = auth.uid());

create policy "procedures: update own"
  on public.procedures for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "procedures: delete own"
  on public.procedures for delete
  using (profile_id = auth.uid());

-- ────────────────────────────────────────────
-- RLS: surveys
-- ────────────────────────────────────────────
create policy "surveys: select own"
  on public.surveys for select
  using (profile_id = auth.uid());

create policy "surveys: insert own"
  on public.surveys for insert
  with check (profile_id = auth.uid());

create policy "surveys: update own"
  on public.surveys for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "surveys: delete own"
  on public.surveys for delete
  using (profile_id = auth.uid());

-- ────────────────────────────────────────────
-- RLS: photos
-- ────────────────────────────────────────────
create policy "photos: select own"
  on public.photos for select
  using (profile_id = auth.uid());

create policy "photos: insert own"
  on public.photos for insert
  with check (profile_id = auth.uid());

create policy "photos: update own"
  on public.photos for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "photos: delete own"
  on public.photos for delete
  using (profile_id = auth.uid());

-- ────────────────────────────────────────────
-- RLS: push_subscriptions
-- ────────────────────────────────────────────
create policy "push_subscriptions: select own"
  on public.push_subscriptions for select
  using (profile_id = auth.uid());

create policy "push_subscriptions: insert own"
  on public.push_subscriptions for insert
  with check (profile_id = auth.uid());

create policy "push_subscriptions: update own"
  on public.push_subscriptions for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "push_subscriptions: delete own"
  on public.push_subscriptions for delete
  using (profile_id = auth.uid());

-- ============================================================
-- ТРИГГЕР: создать профиль при регистрации пользователя
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, '');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
