"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "push_dismissed";
const GRANTED_KEY = "push_granted";
const DISMISS_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 дня

function urlBase64ToArrayBuffer(base64: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
  return buffer;
}

async function subscribeAndPost(): Promise<boolean> {
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublic) {
    console.error("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY не задан");
    return false;
  }
  const registration = await navigator.serviceWorker.ready;
  let sub = await registration.pushManager.getSubscription();
  if (!sub) {
    sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToArrayBuffer(vapidPublic),
    });
  }
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub.toJSON()),
  });
  if (!res.ok) {
    console.error("[push] subscribe POST failed", await res.text());
    return false;
  }
  return true;
}

export function PushPermission() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    // Permission уже granted: тихо досинхронизируем подписку (если её нет
    // на сервере или браузер пересоздал endpoint) и не показываем banner.
    if (Notification.permission === "granted") {
      void subscribeAndPost().then((ok) => {
        if (ok) window.localStorage.setItem(GRANTED_KEY, "1");
      });
      return;
    }

    if (window.localStorage.getItem(GRANTED_KEY) === "1") return;
    if (Notification.permission !== "default") return;

    const dismissedAt = Number(
      window.localStorage.getItem(DISMISS_KEY) ?? "0",
    );
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_TTL_MS) return;

    setVisible(true);
  }, []);

  async function handleAllow() {
    if (busy) return;
    setBusy(true);

    try {
      const result = await Notification.requestPermission();
      if (result !== "granted") {
        setVisible(false);
        return;
      }

      const ok = await subscribeAndPost();
      if (ok) {
        window.localStorage.setItem(GRANTED_KEY, "1");
        window.localStorage.removeItem(DISMISS_KEY);
      }
      setVisible(false);
    } catch (e) {
      console.error("[push] permission flow failed", e);
      setVisible(false);
    } finally {
      setBusy(false);
    }
  }

  function handleDismiss() {
    window.localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-[68px] z-30 mx-auto w-full max-w-app px-4">
      <div className="rounded-xl bg-cream-dark px-4 py-4 shadow-sm ring-1 ring-black/5">
        <p className="text-[12px] text-text">
          Получайте напоминания о процедурах
        </p>
        <p className="mt-1 text-[10px] text-text-muted">
          В выбранное вами время, без лишнего.
        </p>

        <div className="mt-3 flex items-center gap-2">
          <Button
            onClick={handleAllow}
            disabled={busy}
            className="h-9 flex-1 text-[12px]"
          >
            {busy ? "Разрешаем…" : "Разрешить"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleDismiss}
            disabled={busy}
            className="h-9 px-4 text-[12px]"
          >
            Не сейчас
          </Button>
        </div>
      </div>
    </div>
  );
}
