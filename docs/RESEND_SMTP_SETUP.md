# Подключение Resend как SMTP для Supabase Auth

## Зачем это нужно

На бесплатном тарифе Supabase встроенный email-провайдер имеет лимит
**3–4 письма в час** на проект, а некоторые почтовые сервисы (mail.ru,
yandex.ru) часто блокируют письма от Supabase.

Решение — подключить Resend как кастомный SMTP. Это делается **в Supabase
Dashboard**, не в коде — приложение уже вызывает magic link правильно.

---

## Шаг 1. Получить SMTP-данные от Resend

1. Открой [resend.com](https://resend.com) → войди в аккаунт.
2. В левом меню найди раздел **SMTP** → нажми **Add SMTP credential**.
3. **Name**: `toque-ritual` (или любое понятное имя).
4. Нажми **Generate**.
5. Появится окно с **логином** и **паролем**. **Сохрани их прямо сейчас** —
   после закрытия окна пароль больше не покажется.

⚠ Если случайно закрыла окно и не сохранила — просто удали credential и
создай новую. Старый пароль вернуть нельзя.

---

## Шаг 2. Добавить кастомный домен в Resend

**Без верифицированного домена Resend разрешает отправлять только с адреса
`onboarding@resend.dev`** — это годится для теста, но не для прода.

1. Resend → **Domains** → **Add Domain**.
2. Введи: `toque-store.ru`.
3. Resend покажет 4-6 DNS-записей (обычно MX, TXT для SPF и DKIM).
4. Открой панель управления доменом `toque-store.ru` у своего регистратора
   (Reg.ru, Timeweb, cloudflare — где куплен домен).
5. Добавь все показанные записи в DNS.
6. Вернись в Resend → **Verify Domain**.
7. Верификация занимает от нескольких минут до 24 часов (обычно ≤ 1 часа).

**Пока домен не верифицирован** — в шаге 3 используй адрес
`onboarding@resend.dev` как **Sender email** (только для теста).

---

## Шаг 3. Настроить Supabase Auth SMTP

1. Открой Supabase Dashboard → выбери проект `toque-ritual`.
2. Слева внизу шестерёнка → **Project Settings**.
3. В боковом меню найди **Auth** → **SMTP Settings**.
4. Включи переключатель **Enable Custom SMTP**.
5. Заполни поля:

| Поле | Значение |
|---|---|
| **Host** | `smtp.resend.com` |
| **Port** | `465` |
| **Username** | `resend` (именно слово, не email) |
| **Password** | пароль из шага 1 |
| **Sender email** | `ritual@toque-store.ru` (после верификации домена) — или `onboarding@resend.dev` (пока домен не верифицирован) |
| **Sender name** | `TOQUE Ритуал` |

6. Нажми **Save**.

---

## Шаг 4. Проверить

1. Открой `/login` в приложении → введи свой email → **Отправить ссылку**.
2. Проверь почту (в том числе папку «Спам»).
3. Если письмо не пришло:
   - Открой **Resend Dashboard** → **Logs** — там видно, дошло ли письмо до
     провайдера получателя.
   - Открой **Supabase Dashboard** → **Auth** → **Logs** — там видны ошибки
     Supabase при отправке.
   - Проверь, что домен в Resend действительно **Verified** (зелёная
     галочка на странице Domains).

---

## Шаг 5 (опционально). Кастомный шаблон письма

Стандартный шаблон Supabase выглядит технически. Заменим на брендовый:

1. Supabase → **Authentication** → **Email Templates** → **Magic Link**.
2. **Subject**:
   ```
   Ваша ссылка для входа в TOQUE Ритуал
   ```
3. **Message (HTML)** — заменить полностью:

```html
<div style="font-family: Arial, sans-serif; max-width: 480px;
            margin: 0 auto; background: #FAFAF7; padding: 40px;">
  <p style="color: #888780; font-size: 11px; letter-spacing: 2px;
            text-transform: uppercase;">TOQUE РИТУАЛ</p>
  <h1 style="color: #2C2C2A; font-size: 22px; font-weight: normal;
             margin-top: 24px;">
    Ваша ссылка для входа
  </h1>
  <p style="color: #5F5E5A; font-size: 14px; line-height: 1.6;">
    Нажмите на кнопку ниже — она действует 60 минут.
  </p>
  <a href="{{ .ConfirmationURL }}"
     style="display: inline-block; background: #7A8A4F;
            color: #FAFAF7; padding: 14px 32px;
            border-radius: 24px; text-decoration: none;
            font-size: 14px; margin-top: 24px;">
    Войти в TOQUE Ритуал
  </a>
  <p style="color: #888780; font-size: 11px; margin-top: 32px;">
    Если вы не запрашивали вход — просто проигнорируйте это письмо.
  </p>
</div>
```

4. Нажми **Save changes**.

---

## Если ничего не помогает

**Не приходит письмо после Save:**
- Убедись, что домен верифицирован в Resend (Domains → зелёный статус).
- В Resend Logs выбери фильтр «Failed» — там причина отклонения.
- Проверь, что Port = 465 (не 587), Username = `resend` (не адрес).

**«Invalid SMTP credentials» в Supabase:**
- Пароль скопирован с пробелами. Пересоздай credential в Resend, снова
  скопируй, вставь без пробелов.

**Письма приходят с `onboarding@resend.dev`:**
- Домен ещё не верифицирован. В Sender email пока `onboarding@resend.dev`,
  как только Verified — заменить на `ritual@toque-store.ru`.

---

## Пока настраиваешь — временный обход для теста

В `app/(auth)/login/page.tsx` в dev-режиме добавлена кнопка
«Войти как тестовый пользователь». Она входит по email/паролю без magic
link — только для локальной разработки.

Чтобы она работала:
1. Supabase Dashboard → **Authentication** → **Users** → **Add user**.
2. **Email**: `test@toque.dev`, **Password**: `toque-test-2024`.
3. Auto Confirm User: **включить**.
4. Save.

Теперь на `/login` в dev-сборке будет кнопка внизу — жмёшь, входишь без
email.

В production эта кнопка не рендерится (`process.env.NODE_ENV`).
