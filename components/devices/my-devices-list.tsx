"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { removeDevice } from "@/lib/actions/devices";

type OwnedDevice = { slug: string; name: string; subtitle: string };

type Props = {
  devices: OwnedDevice[];
};

export function MyDevicesList({ devices }: Props) {
  const router = useRouter();
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [removing, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleConfirmRemove(slug: string) {
    setError(null);
    startTransition(async () => {
      const res = await removeDevice(slug);
      if (!res.ok) {
        setError(res.error ?? "Не удалось убрать устройство");
        setPendingSlug(null);
        return;
      }
      setPendingSlug(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {devices.map((d) => {
        const isPending = pendingSlug === d.slug;
        return (
          <div
            key={d.slug}
            className="rounded-lg border border-black/8 bg-white px-4 py-3"
          >
            {isPending ? (
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-text">
                  Убрать {d.name} из ваших устройств?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmRemove(d.slug)}
                    disabled={removing}
                    className="text-[11px] text-rose underline disabled:opacity-50"
                  >
                    Убрать
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingSlug(null)}
                    disabled={removing}
                    className="text-[11px] text-text-muted underline disabled:opacity-50"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-olive">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <p className="truncate text-[12px] text-text">{d.name}</p>
                  </div>
                  <p className="mt-0.5 truncate pl-7 text-[10px] text-text-muted">
                    {d.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingSlug(d.slug)}
                  aria-label={`Убрать ${d.name}`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-text-muted transition-colors hover:bg-black/[0.05]"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        );
      })}
      {error ? <p className="text-[11px] text-rose">{error}</p> : null}
    </div>
  );
}
