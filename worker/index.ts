/// <reference lib="webworker" />

// Этот файл компилируется @ducanh2912/next-pwa и сливается в итоговый
// public/sw.js (рядом с генерируемым workbox-кодом).
// Не импортирует ничего из приложения — у SW отдельный bundle.

export {};

declare const self: ServiceWorkerGlobalScope;

type PushPayload = {
  title?: string;
  body?: string;
  url?: string;
};

self.addEventListener("push", (event: PushEvent) => {
  let data: PushPayload = {};
  try {
    data = event.data ? (event.data.json() as PushPayload) : {};
  } catch {
    data = { body: event.data?.text() ?? "" };
  }

  const title = data.title ?? "TOQUE Ритуал";
  const body = data.body ?? "";
  const url = data.url ?? "/home";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url },
      tag: "toque-ritual",
      // @ts-expect-error renotify не входит в lib.dom, но поддерживается
      renotify: true,
    }),
  );
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const data = event.notification.data as { url?: string } | undefined;
  const targetUrl = data?.url ?? "/home";

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of allClients) {
        if (client.url.includes(targetUrl)) {
          return client.focus();
        }
      }

      return self.clients.openWindow(targetUrl);
    })(),
  );
});

self.addEventListener(
  "pushsubscriptionchange",
  (event: PushSubscriptionChangeEvent) => {
    event.waitUntil(
      (async () => {
        const opts = event.oldSubscription?.options;
        if (!opts) return;

        const newSub = await self.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: opts.applicationServerKey ?? undefined,
        });

        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSub),
        });
      })(),
    );
  },
);
