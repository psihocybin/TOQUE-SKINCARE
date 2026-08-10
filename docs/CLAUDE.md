# TOQUE Ритуал — Контекст проекта

## Что мы делаем

PWA-приложение для онбординга клиенток после покупки косметологического
устройства TOQUE. Цель — поднять долю клиентов с 2+ устройствами с 10–20%
до 25–30% через ежедневное сопровождение в течение 30 дней.

Сценарий пользователя:
1. Купила устройство (NUO, ELARA или другое) на Wildberries / Ozon / сайте
2. Получила коробку, отсканировала QR
3. Открылось приложение → активация → квиз → персональная программа
4. 30 дней ежедневных push-уведомлений и процедур по 5–10 минут
5. На 30, 60, 90 дни — точки апсейла (расходники, второе устройство)

## Технический стек

- **Next.js 14+** (App Router, server components где возможно)
- **TypeScript** (strict mode)
- **Tailwind CSS** + кастомная палитра TOQUE
- **shadcn/ui** (компоненты на Radix UI, theme: neutral)
- **Framer Motion** (анимации появления, переходов между экранами)
- **Supabase** (Postgres, auth, storage, edge functions, realtime)
- **next-pwa** (PWA конфигурация, service worker) — используем форк `@ducanh2912/next-pwa`
- **Web Push API** (push-уведомления через Supabase Edge Functions)
- **Vercel** (хостинг и деплой)
- **Resend** (email — для fallback когда push не дошёл)
- **PostHog** (аналитика)
- **Sentry** (мониторинг ошибок)

## Бренд TOQUE — правила голоса

Тон: **спокойный наставник**. НЕ "привет, красотка!". НЕ восклицания.
Обращение на "вы".
Никаких обещаний "омолодит на 10 лет" — только "видимое улучшение".
Слова, которые используем: ритуал, протокол, регулярность, мягко, точно,
видимое улучшение, экосистема.
Слова, которых избегаем: омоложение, гарантируем, революционный, секрет,
эликсир, бьюти-хак.

## Палитра — всегда использовать эти переменные

```js
// tailwind.config.ts theme.extend.colors
{
  olive: {
    DEFAULT: "#7A8A4F",  // главный акцент — кнопки, прогресс, активные состояния
    dark: "#4A5530",     // заголовки
    light: "#A4B176"
  },
  cream: {
    DEFAULT: "#FAFAF7",  // основной фон
    dark: "#F1EFE8"      // карточки, выделения
  },
  rose: {
    DEFAULT: "#C4908A",  // опциональные акценты — UGC, рефералы, фото
    light: "#E0BCB6"
  },
  text: {
    DEFAULT: "#2C2C2A",  // основной текст
    muted: "#888780"     // вторичный текст, подписи
  }
}
```

> Реализация: shadcn-токены (`--primary`, `--background`, …) замаплены на палитру
> TOQUE в HSL внутри `app/globals.css`, а сами hex-переменные доступны через
> утилиты Tailwind (`bg-olive`, `text-text-muted`, `bg-cream-dark` и т.д.).

## Шрифты

- **Inter** (как замена TT Norms Pro) — основной для всего интерфейса
- **JetBrains Mono** — моноширинный для промокодов и серийных номеров

## Архитектурные принципы

1. **Mobile-first.** Тестируем сначала на телефоне (iPhone Safari, Android Chrome),
   потом на десктопе. Дизайн для экрана 390×844, max-width 420px (`max-w-app`).

2. **Server Components by default.** Client Components только когда нужна
   интерактивность (формы, кнопки, анимации, состояние). Маркируй явно
   `"use client"` только когда необходимо.

3. **Минимум зависимостей.** Перед установкой любого нового npm-пакета —
   обоснуй, можем ли без него.

4. **Премиум-UX.** Никаких ярких эмодзи в UI, никаких bouncy анимаций.
   Плавные fade и slide (200-400ms, ease-out). Whitespace > визуальный шум.
   Border-radius: pill (`rounded-pill`) для кнопок, lg (10px) для карточек,
   md (8px) для inputs.

5. **PWA-first.** С первой ступени думаем про офлайн, установку на главный
   экран, push-уведомления.

6. **Accessibility (a11y).** Все интерактивные элементы достижимы клавиатурой.
   Контраст текста ≥ 4.5:1. Alt-тексты для всех картинок. ARIA-метки для иконок.

## Структура папок

```
app/
├── (auth)/           # активация, login (activation, login, callback)
├── (onboarding)/     # splash, welcome, quiz/* (device, name, age, ...)
├── (main)/           # home, ritual, journal, progress, profile, settings,
│                     # support, ecosystem/[device], referrals,
│                     # warranty, my-program (с нижней навигацией)
├── (modals)/         # nps, jcs, review-request
└── layout.tsx        # root layout (шрифты, metadata, viewport)

components/
├── ui/               # shadcn компоненты (button, card, input, ...)
├── quiz/             # компоненты квиза
├── ritual/           # компоненты процедур
├── shared/           # общие (fade-in, ...)
└── pwa/              # PWA-специфичные

lib/
├── supabase/         # client.ts, server.ts, middleware.ts
├── content/          # тексты drip-кампании, советов, FAQ
├── analytics/        # PostHog wrapper
└── utils.ts          # cn() (shadcn)

public/               # manifest.json, icon-*.png, (sw.js — генерируется)
supabase/             # migrations/, functions/ (edge functions)
docs/                 # этот файл
scripts/              # gen-icons.mjs (placeholder-иконки)
```

## База данных — главные таблицы

```sql
profiles (id, name, age_group, goal, skin_type, experience,
  preferred_time, frequency, device, warranty_serial, referral_code,
  referred_by, activated_at, created_at)

procedures (id, profile_id, day_number, mode, duration_seconds, feedback,
  note, completed_at)

surveys (id, profile_id, survey_type, score, answer, comment, created_at)

photos (id, profile_id, storage_path, day_number, taken_at)

push_subscriptions (id, profile_id, endpoint, p256dh, auth, created_at)
```

**Row Level Security включена для всех таблиц** — пользователь видит и
редактирует только свои записи.

## Главные правила работы (Claude Code)

1. Перед задачей — прочитай этот файл и текущее состояние (структура, package.json).
2. Если задача неясна — задай уточняющий вопрос.
3. После задачи — список изменённых файлов, команда для проверки, риски.
4. Не устанавливай новые npm-пакеты без подтверждения.
5. Не делай git commit автоматически.
6. Если первый способ не сработал и пробуешь второй — объясни почему.
7. TypeScript ошибки не игнорировать; без `any` / `@ts-ignore`.
8. Минимум комментариев — только "почему", не "что".
9. Тексты на русском (user-facing); имена в коде — на английском.
10. Тестируй edge cases (пустое поле, нет интернета, день отдыха).

## Текущая ступень разработки

> Ступень 1 — Инициализация проекта: **готова** (scaffold, палитра/шрифты,
> структура, shadcn/ui, Supabase-заглушки, PWA, splash).
> Сейчас работаем над: **[Ступень 2]**
>
> _(Обновлять по мере прогресса.)_

## Полный список 32 экранов

Файлы с мокапами лежат в `/docs/mockups/`:
- `01_key_screens.svg` — Welcome (1), Главная (2), Ритуал (3), Прогресс (4)
- `02_onboarding_part_1.svg` — Splash (5), Квиз 1-3 (6, 7, 8)
- `03_onboarding_part_2.svg` — Квиз 4-6 (9, 10, 11), Финал (12)
- `04_internal_screens.svg` — Видеоплеер (13), Журнал (14), Профиль (15), Настройки (16)
- `05_states_and_events.svg` — Завершение (17), Empty journal (18), Съёмка фото (19), Push (20)
- `06_alt_branches_and_services.svg` — Поддержка (22), Моя программа (23), Выбор времени (24)
- `07_surveys_and_service.svg` — Гарантия (25), NPS (26), JCS (27), Экосистема (28)
- `08_upsell_referrals_ugc.svg` — Карточка устройства (29), Рефералы (30), Истории (31), Отзыв на МП (32)

Перед реализацией каждой группы экранов — открой соответствующий SVG-файл
и следуй ему в композиции, отступах, типографике.
