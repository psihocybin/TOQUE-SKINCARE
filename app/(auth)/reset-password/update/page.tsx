"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type Status = "checking" | "ready" | "no-session" | "saving" | "done" | "error";

// Сюда ведёт ссылка из письма восстановления пароля напрямую (не через
// серверный /auth/callback — recovery-ссылка Supabase обычно несёт токены
// в hash-фрагменте URL, #access_token=..., который сервер физически не
// видит). Разбираем сессию на клиенте тремя путями сразу, т.к. точный
// формат ссылки зависит от настроек проекта (PKCE ?code= vs implicit
// #access_token=): 1) если есть ?code=, обмениваем вручную; 2) браузерный
// клиент Supabase сам детектит hash и эмитит событие PASSWORD_RECOVERY;
// 3) на случай гонки — дополнительно проверяем текущую сессию.
export default function UpdatePasswordPage() {
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event) => {
        if (cancelled) return;
        if (event === "PASSWORD_RECOVERY") setStatus("ready");
      },
    );

    (async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      setStatus((prev) => (prev === "ready" ? prev : user ? "ready" : "no-session"));
    })();

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 6) return;
    if (password !== confirmPassword) {
      setErrorMessage("Пароли не совпадают.");
      return;
    }

    setStatus("saving");
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("ready");
      setErrorMessage(`Не удалось сохранить пароль: ${error.message}`);
      return;
    }

    setStatus("done");
    window.setTimeout(() => {
      window.location.href = "/home";
    }, 1200);
  }

  if (status === "checking") return null;

  if (status === "no-session") {
    return (
      <main className="flex min-h-screen flex-col items-center px-6 pb-12 pt-[20vh] text-center">
        <h1 className="text-[16px] leading-snug text-text">
          Ссылка недействительна
        </h1>
        <p className="mt-4 text-[12px] leading-relaxed text-text-muted">
          Ссылка для сброса пароля устарела или уже использована. Запросите
          новую.
        </p>
        <a
          href="/reset-password"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-olive px-6 text-[13px] text-cream"
        >
          Запросить ссылку заново
        </a>
      </main>
    );
  }

  if (status === "done") {
    return (
      <main className="flex min-h-screen flex-col items-center px-6 pb-12 pt-[20vh] text-center">
        <h1 className="text-[16px] leading-snug text-text">
          Пароль обновлён
        </h1>
        <p className="mt-4 text-[12px] text-text-muted">Переходим в приложение…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col px-6 pt-[20vh]">
      <h1 className="text-[22px] font-bold text-text">Новый пароль</h1>
      <p className="mt-1.5 text-[13px] text-text-muted">
        Придумайте новый пароль для входа
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3">
        <Input
          type="password"
          autoComplete="new-password"
          autoFocus
          required
          minLength={6}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage(null);
          }}
          placeholder="Новый пароль (минимум 6 символов)"
          className="h-12 rounded-md border-text/15 bg-white text-[14px] text-text placeholder:text-text-muted/60 focus-visible:border-olive focus-visible:ring-0"
          disabled={status === "saving"}
        />
        <Input
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrorMessage(null);
          }}
          placeholder="Повторите пароль"
          className="h-12 rounded-md border-text/15 bg-white text-[14px] text-text placeholder:text-text-muted/60 focus-visible:border-olive focus-visible:ring-0"
          disabled={status === "saving"}
        />
        <Button
          type="submit"
          disabled={
            status === "saving" ||
            password.length < 6 ||
            confirmPassword.length < 6
          }
          className="h-[52px] rounded-full text-[15px]"
        >
          {status === "saving" ? "Сохраняем…" : "Сохранить пароль"}
        </Button>
      </form>

      {errorMessage ? (
        <p className="mt-4 text-[11px] leading-relaxed text-rose">
          {errorMessage}
        </p>
      ) : null}
    </main>
  );
}
