"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("sending");
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/home`,
        },
      });

      if (error) {
        setStatus("error");
        setErrorMessage(
          error.message === "Email rate limit exceeded"
            ? "Слишком много попыток. Попробуйте через минуту."
            : "Не удалось отправить письмо. Проверьте адрес и попробуйте ещё раз.",
        );
        return;
      }

      setStatus("sent");
    } catch (e) {
      // Самая частая причина — не настроен .env.local. Показываем подсказку.
      const message =
        e instanceof Error && e.message.includes("URL and API key")
          ? "Supabase не настроен: добавьте ключи в .env.local и перезапустите сервер. См. docs/AUTH_SETUP.md"
          : "Что-то пошло не так. Попробуйте ещё раз.";
      setStatus("error");
      setErrorMessage(message);
    }
  }

  if (status === "sent") {
    return (
      <main className="flex min-h-screen flex-col items-center px-6 pb-12 pt-[20vh] text-center">
        <FadeIn duration={0.5}>
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-pill border-[1.5px] border-olive"
            aria-hidden
          >
            <Mail className="h-7 w-7 text-olive" strokeWidth={1.5} />
          </div>

          <h1 className="mt-8 text-[16px] leading-snug text-text">
            Письмо отправлено
          </h1>

          <span
            className="mx-auto mt-5 block h-px w-[60px] bg-black/15"
            aria-hidden
          />

          <p className="mt-6 text-[12px] leading-relaxed text-text-muted">
            Откройте письмо на&nbsp;
            <span className="text-text">{email.trim()}</span>
            <br />и перейдите по ссылке, чтобы войти.
          </p>

          <p className="mt-10 text-[10px] text-text-muted">
            Не пришло письмо? Проверьте папку «Спам».
          </p>
        </FadeIn>

        <FadeIn delay={0.4} className="mt-auto w-full text-center">
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setErrorMessage(null);
            }}
            className="text-[11px] uppercase tracking-[1.5px] text-text-muted underline-offset-4 hover:underline"
          >
            Изменить адрес
          </button>
        </FadeIn>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col px-6 pb-12 pt-[18vh]">
      <FadeIn duration={0.5}>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[3px] text-text-muted">
            Вход
          </p>
          <h1 className="mt-3 text-[18px] leading-snug text-text">
            Войдите по email
          </h1>
          <span
            className="mx-auto mt-5 block h-px w-[60px] bg-black/15"
            aria-hidden
          />
          <p className="mt-6 text-[11px] leading-relaxed text-text-muted">
            Мы пришлём ссылку для входа.
            <br />
            Пароль не нужен.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.25} duration={0.5} className="mt-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[1.5px] text-text-muted">
              Email
            </span>
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="вы@example.com"
              className="h-12 rounded-md border-text/15 bg-cream-dark/40 text-[14px] text-text placeholder:text-text-muted/60 focus-visible:border-olive focus-visible:ring-0"
              disabled={status === "sending"}
            />
          </label>

          {errorMessage ? (
            <p className="text-[11px] leading-relaxed text-rose">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={status === "sending" || email.trim() === ""}
            className="mt-2 h-12"
          >
            {status === "sending" ? "Отправляем…" : "Отправить ссылку"}
          </Button>
        </form>
      </FadeIn>
    </main>
  );
}
