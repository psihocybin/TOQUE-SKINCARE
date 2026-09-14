"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_KEY, type QuizAnswers } from "@/lib/quiz/quiz-context";
import { isQuizStarted, syncQuizToProfile } from "@/lib/quiz/sync";

type Status = "idle" | "sending" | "sent" | "error";
type AuthMode = "signup" | "signin";

function readQuizFromStorage(): QuizAnswers | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizAnswers;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authExpanded, setAuthExpanded] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Уже авторизован (перепрохождение квиза, повторный визит на /login) —
  // досохраняем ответы квиза из localStorage, если они там есть, и уходим
  // в приложение вместо показа формы входа.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setCheckingAuth(false);
        return;
      }

      const answers = readQuizFromStorage();
      if (answers && isQuizStarted(answers)) {
        await syncQuizToProfile(supabase, user.id, answers);
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      }
      router.replace("/home");
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleDevLogin() {
    setStatus("sending");
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: "test@toque.dev",
        password: "toque-test-2024",
      });
      if (error) {
        setStatus("error");
        setErrorMessage(
          `Тест-логин не сработал: ${error.message}. Убедитесь, что пользователь создан в Supabase Dashboard.`,
        );
        return;
      }
      window.location.href = "/home";
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Что-то пошло не так.");
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || password.length < 6) return;

    setStatus("sending");
    setErrorMessage(null);

    try {
      const supabase = createClient();

      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmed,
          password,
        });
        if (error) {
          setStatus("error");
          setErrorMessage(
            /invalid login credentials/i.test(error.message)
              ? "Неверный email или пароль."
              : `Не удалось войти: ${error.message}`,
          );
          return;
        }
        window.location.href = "/home";
        return;
      }

      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email: trimmed,
        password,
        options: { emailRedirectTo: `${origin}/auth/callback?next=/home` },
      });

      if (error) {
        setStatus("error");
        setErrorMessage(
          /already registered/i.test(error.message)
            ? "Этот email уже зарегистрирован. Попробуйте войти."
            : `Не удалось создать аккаунт: ${error.message}`,
        );
        return;
      }

      if (data.session) {
        window.location.href = "/home";
        return;
      }

      // Email-подтверждение включено в Supabase — сессии ещё нет.
      setEmail(trimmed);
      setStatus("sent");
    } catch (e) {
      const message =
        e instanceof Error && e.message.includes("URL and API key")
          ? "Supabase не настроен: добавьте ключи в .env.local и перезапустите сервер. См. docs/AUTH_SETUP.md"
          : "Что-то пошло не так. Попробуйте ещё раз.";
      setStatus("error");
      setErrorMessage(message);
    }
  }

  if (checkingAuth) return null;

  if (status === "sent") {
    return (
      <main className="flex min-h-screen flex-col items-center px-6 pb-12 pt-[20vh] text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[1.5px] border-olive"
          aria-hidden
        >
          <Mail className="h-7 w-7 text-olive" strokeWidth={1.5} />
        </div>

        <h1 className="mt-8 text-[16px] leading-snug text-text">
          Подтвердите email
        </h1>

        <p className="mt-6 text-[12px] leading-relaxed text-text-muted">
          Откройте письмо на&nbsp;
          <span className="text-text">{email.trim()}</span>
          <br />и перейдите по ссылке, чтобы подтвердить аккаунт.
        </p>

        <p className="mt-10 text-[10px] text-text-muted">
          Не пришло письмо? Проверьте папку «Спам».
        </p>

        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setErrorMessage(null);
          }}
          className="mt-auto text-[11px] uppercase tracking-[1.5px] text-text-muted underline-offset-4 hover:underline"
        >
          Изменить адрес
        </button>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div
        className="flex h-[45vh] items-center justify-center"
        aria-hidden
      >
        {/* Прозрачно — здесь виден общий фон приложения (фото листа из
            PhoneFrame). Раньше был плейсхолдер-заглушка сплошным цветом. */}
        <span className="text-[28px] tracking-[4px] text-olive-dark">TOQUE</span>
      </div>

      <div className="-mt-6 flex-1 rounded-t-[28px] border border-white/40 bg-cream/90 px-6 pb-8 pt-7 backdrop-blur-md">
        <h1 className="text-[22px] font-bold text-text">Создайте аккаунт</h1>
        <p className="mt-1.5 text-[13px] text-text-muted">
          Программа сохранится и будет доступна с любого устройства
        </p>

        <div className="mt-7 flex flex-col gap-3">
          {!authExpanded ? (
            <button
              type="button"
              onClick={() => {
                setAuthExpanded(true);
                setAuthMode("signup");
              }}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-olive text-[15px] text-cream"
            >
              <Mail className="h-[18px] w-[18px]" strokeWidth={1.75} />
              Продолжить с email
            </button>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="вы@example.com"
                className="h-12 rounded-md border-text/15 bg-white text-[14px] text-text placeholder:text-text-muted/60 focus-visible:border-olive focus-visible:ring-0"
                disabled={status === "sending"}
              />
              <Input
                type="password"
                autoComplete={
                  authMode === "signin" ? "current-password" : "new-password"
                }
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Пароль (минимум 6 символов)"
                className="h-12 rounded-md border-text/15 bg-white text-[14px] text-text placeholder:text-text-muted/60 focus-visible:border-olive focus-visible:ring-0"
                disabled={status === "sending"}
              />
              <Button
                type="submit"
                disabled={
                  status === "sending" ||
                  email.trim() === "" ||
                  password.length < 6
                }
                className="h-[52px] rounded-full text-[15px]"
              >
                {status === "sending"
                  ? "Подождите…"
                  : authMode === "signin"
                    ? "Войти"
                    : "Создать аккаунт"}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "signin" ? "signup" : "signin");
                  setErrorMessage(null);
                  if (status === "error") setStatus("idle");
                }}
                className="text-center text-[11px] text-text-muted underline underline-offset-4"
              >
                {authMode === "signin"
                  ? "Нет аккаунта? Создать"
                  : "Уже есть аккаунт? Войти"}
              </button>
              {authMode === "signin" ? (
                <Link
                  href="/reset-password"
                  className="text-center text-[11px] text-text-muted underline underline-offset-4"
                >
                  Забыли пароль?
                </Link>
              ) : null}
            </form>
          )}
        </div>

        {errorMessage ? (
          <p className="mt-4 text-[11px] leading-relaxed text-rose">
            {errorMessage}
          </p>
        ) : null}

        <p className="mt-6 text-center text-[11px] leading-relaxed text-text-muted">
          Нажимая «Продолжить», вы соглашаетесь с
          <br />
          <a href="/privacy" className="underline underline-offset-4">
            Политикой конфиденциальности
          </a>{" "}
          ·{" "}
          <a href="/terms" className="underline underline-offset-4">
            Условиями использования
          </a>
        </p>

        {process.env.NODE_ENV === "development" ? (
          <div className="mt-8 border-t border-black/8 pt-6 text-center">
            <p className="text-[9px] uppercase tracking-[1px] text-text-muted">
              Режим разработки
            </p>
            <button
              type="button"
              onClick={handleDevLogin}
              disabled={status === "sending"}
              className="mt-3 text-[11px] text-text-muted underline underline-offset-4 disabled:opacity-50"
            >
              Войти как тестовый пользователь
            </button>
            <p className="mt-2 text-[9px] text-text-muted opacity-70">
              test@toque.dev — должен быть создан в Supabase → Auth → Users
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
