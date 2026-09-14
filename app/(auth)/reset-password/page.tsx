"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

export default function ResetPasswordPage() {
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
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${origin}/auth/callback?next=/reset-password/update`,
      });

      if (error) {
        setStatus("error");
        const isRateLimit = /rate limit|only request this after/i.test(
          error.message,
        );
        setErrorMessage(
          isRateLimit
            ? `Слишком много попыток. Подождите и попробуйте снова. (${error.message})`
            : `Не удалось отправить письмо: ${error.message}`,
        );
        return;
      }

      setStatus("sent");
    } catch (e) {
      const message =
        e instanceof Error && e.message.includes("URL and API key")
          ? "Supabase не настроен: добавьте ключи в .env.local и перезапустите сервер."
          : "Что-то пошло не так. Попробуйте ещё раз.";
      setStatus("error");
      setErrorMessage(message);
    }
  }

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
          Письмо отправлено
        </h1>

        <p className="mt-6 text-[12px] leading-relaxed text-text-muted">
          Откройте письмо на&nbsp;
          <span className="text-text">{email.trim()}</span>
          <br />и перейдите по ссылке, чтобы задать новый пароль.
        </p>

        <p className="mt-10 text-[10px] text-text-muted">
          Не пришло письмо? Проверьте папку «Спам».
        </p>

        <Link
          href="/login"
          className="mt-auto text-[11px] uppercase tracking-[1.5px] text-text-muted underline-offset-4 hover:underline"
        >
          Назад ко входу
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col px-6 pt-[20vh]">
      <h1 className="text-[22px] font-bold text-text">Восстановление пароля</h1>
      <p className="mt-1.5 text-[13px] text-text-muted">
        Укажите email — пришлём ссылку для сброса пароля
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3">
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
        <Button
          type="submit"
          disabled={status === "sending" || email.trim() === ""}
          className="h-[52px] rounded-full text-[15px]"
        >
          {status === "sending" ? "Отправляем…" : "Отправить ссылку"}
        </Button>
      </form>

      {errorMessage ? (
        <p className="mt-4 text-[11px] leading-relaxed text-rose">
          {errorMessage}
        </p>
      ) : null}

      <Link
        href="/login"
        className="mt-6 text-center text-[11px] text-text-muted underline underline-offset-4"
      >
        Назад ко входу
      </Link>
    </main>
  );
}
