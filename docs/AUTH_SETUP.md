# Настройка авторизации (magic link)

После того как накатила миграции из [SUPABASE_SETUP.md](./SUPABASE_SETUP.md), нужно:
1. Скопировать ключи Supabase в `.env.local`
2. Настроить URL Configuration в Supabase Auth
3. Проверить, что письма со ссылками доходят

---

## Шаг 1. Создай `.env.local` в корне `toque-ritual/`

В корне проекта (рядом с `package.json`) создай файл `.env.local`. Это локальный файл с секретами — он уже в `.gitignore`, его не закоммитят.

Шаблон:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Шаг 2. Возьми ключи из Supabase Dashboard

1. Открой свой проект на [supabase.com](https://supabase.com).
2. В левой панели **Project Settings** (шестерёнка внизу) → **API**.
3. На странице **API Settings**:
   - **Project URL** — скопируй в `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Keys → anon / public** — скопируй в `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API Keys → service_role** (под спойлером «Reveal») — скопируй в `SUPABASE_SERVICE_ROLE_KEY`

⚠ **`SUPABASE_SERVICE_ROLE_KEY`** обходит RLS — он не должен попадать в браузер. У нас он не используется на клиенте, только в server-side коде, поэтому без префикса `NEXT_PUBLIC_`.

После сохранения `.env.local` нужно **перезапустить dev-сервер** (`Ctrl+C` и снова `npm run dev`).

---

## Шаг 3. Настрой URL Configuration

Чтобы magic link открывал правильный адрес после клика в письме:

1. В Supabase Dashboard → **Authentication** (иконка человечка) → **URL Configuration**.
2. **Site URL** — впиши:
   - Для локальной разработки: `http://localhost:3000`
   - (Когда задеплоим на Vercel — заменим на прод-домен)
3. **Redirect URLs** — добавь обе строки кнопкой **Add URL**:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```
   Вторая строка с `**` — wildcard на всякий случай (Supabase разрешает редиректы только на адреса из этого списка).

Нажми **Save**.

---

## Шаг 4. Настрой шаблон письма (по желанию)

По умолчанию Supabase шлёт письмо на английском. Чтобы заменить на русский:

1. **Authentication** → **Email Templates** → **Magic Link**.
2. Subject: `Вход в TOQUE Ритуал`
3. Тело письма (заменить полностью):
```html
<h2>Вход в TOQUE Ритуал</h2>
<p>Нажмите на ссылку ниже, чтобы войти:</p>
<p><a href="{{ .ConfirmationURL }}">Войти</a></p>
<p>Если вы не запрашивали вход — просто проигнорируйте это письмо.</p>
```
4. Нажми **Save changes**.

---

## Шаг 5. Проверь как работает

1. Открой `http://localhost:3000/login`.
2. Введи свой email → **Отправить ссылку**.
3. Должен появиться экран «Письмо отправлено».
4. Открой почту, найди письмо от Supabase (может быть в Спаме на первый раз).
5. Кликни ссылку — должен перебросить на `/home`.

**Важно про лимиты:** бесплатный план Supabase разрешает **2 email-а в час** через встроенный сервис. Этого хватает для разработки, но если упрёшься в лимит — придётся подключать свой SMTP (Resend, SendGrid и т.п.). Это в следующих ступенях.

---

## Что делать если что-то пошло не так

**"Не удалось отправить письмо"** — проверь `.env.local`: ключи без пробелов, без кавычек. Перезапусти сервер.

**Письмо не приходит** — проверь Спам. Проверь, что в **Authentication → Email Templates** включён шаблон Magic Link.

**После клика по ссылке открывается `/login?error=invalid_link`** — ссылка протухла (15 минут) или уже использована. Запроси новую.

**После клика открывается чужой URL** — проверь **Site URL** и **Redirect URLs** в URL Configuration.

**Редиректит обратно на `/login` сразу после входа** — куки не доходят. Проверь, что не открывала в режиме инкогнито со строгими настройками cookies.

---

После того как magic link работает — переходим к Заходу 3: перенос данных квиза в `profiles` после авторизации.
