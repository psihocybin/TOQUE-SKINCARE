"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OptionTile } from "@/components/shared/option-tile";
import { addDevice } from "@/lib/actions/devices";

type Option = { slug: string; name: string; subtitle: string };

type Props = {
  options: Option[];
};

export function AddDeviceDialog({ options }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [adding, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAdd(slug: string) {
    setError(null);
    startTransition(async () => {
      const res = await addDevice(slug);
      if (!res.ok) {
        setError(res.error ?? "Не удалось добавить устройство");
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 w-full text-[12px]">
          Добавить
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[360px] rounded-2xl bg-cream">
        <DialogHeader>
          <DialogTitle className="text-[14px] text-text">
            Добавить устройство
          </DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
          {options.length === 0 ? (
            <p className="text-center text-[11px] text-text-muted">
              Все устройства уже добавлены
            </p>
          ) : (
            options.map((opt) => (
              <OptionTile
                key={opt.slug}
                label={opt.name}
                sublabel={opt.subtitle}
                selected={false}
                onClick={() => handleAdd(opt.slug)}
                variant="compact"
              />
            ))
          )}
        </div>
        {error ? (
          <p className="text-center text-[11px] text-rose">{error}</p>
        ) : null}
        {adding ? (
          <p className="text-center text-[10px] text-text-muted">
            Добавляем…
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
