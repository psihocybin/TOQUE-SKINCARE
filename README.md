# TOQUE Ритуал

PWA-приложение для онбординга клиенток после покупки косметологического
устройства TOQUE. 30 дней ежедневного сопровождения, персональный протокол,
точки апсейла на 30/60/90 дни.

Бренд-гайд, архитектурные принципы и структура — в [`docs/CLAUDE.md`](docs/CLAUDE.md).

## Стек

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · shadcn/ui ·
Framer Motion · Supabase · @ducanh2912/next-pwa · Vercel.

## Запуск

```bash
npm install
cp .env.example .env.local   # заполнить ключи Supabase и пр.
npm run dev                  # http://localhost:3000 → редирект на /splash
```

## Скрипты

```bash
npm run dev      # дев-сервер (PWA/service worker отключён)
npm run build    # продакшн-сборка
npm run start    # запуск собранного приложения (PWA активна)
npm run lint     # ESLint

node scripts/gen-icons.mjs   # перегенерировать placeholder-иконки PWA
```

## PWA

Service worker генерируется `@ducanh2912/next-pwa` только в продакшн-сборке.
Чтобы проверить установку на главный экран и оффлайн — `npm run build && npm run start`,
вкладка **Application** в DevTools.

> Иконки в `public/icon-*.png` — временные плейсхолдеры (olive + монограмма «T»).
> Заменить на финальные из дизайна.

## Структура

См. `docs/CLAUDE.md`. Кратко: route-группы `(auth)`, `(onboarding)`, `(main)`,
`(modals)` в `app/`; UI в `components/`; клиенты и контент в `lib/`;
миграции и edge-функции в `supabase/`.
