"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    if (busy) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    // Полная перезагрузка — гарантирует, что middleware и серверные компоненты
    // увидят уже сброшенную сессию.
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={busy}
      className="text-[11px] text-text-muted underline-offset-4 hover:underline disabled:opacity-60"
    >
      {busy ? "Выходим…" : "Выйти из аккаунта"}
    </button>
  );
}
