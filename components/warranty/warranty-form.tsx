"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerWarranty } from "@/lib/actions/warranty";

const MIN_SERIAL = 6;
const DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;

// Маска ДД/ММ/ГГГГ: оставляет только цифры, расставляет слэши после 2 и 4
// позиций, обрезает на 8 цифрах.
function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function WarrantyForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [serial, setSerial] = useState("");
  const [activationDate, setActivationDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, startSubmit] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setError(null);
    const data = new FormData();
    data.append("serialNumber", serial.trim());
    data.append("activationDate", activationDate);
    if (file) data.append("receiptPhoto", file);

    startSubmit(async () => {
      const res = await registerWarranty(data);
      if (res && !res.ok) {
        setError(res.error);
      }
      // При успехе server action выполнит redirect — клиент сам перебросится.
    });
  }

  const serialValid = serial.trim().length >= MIN_SERIAL;
  const dateValid = DATE_PATTERN.test(activationDate);
  const canSubmit = serialValid && dateValid && !submitting;

  return (
    <div className="flex flex-col gap-6 px-4">
      <div>
        <label className="block text-[9px] uppercase tracking-[1px] text-text-muted">
          Серийный номер
        </label>
        <Input
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="TQ-NUO-04823"
          autoComplete="off"
          spellCheck={false}
          className="mt-2 h-11 rounded-md border-black/15 bg-white font-mono text-[13px] text-text placeholder:text-text-muted/60 focus-visible:border-olive focus-visible:ring-0"
          disabled={submitting}
        />
        <p className="mt-1 text-[9px] text-text-muted">
          Введите номер, полученный при регистрации расширенной гарантии в боте
        </p>
      </div>

      <div>
        <label className="block text-[9px] uppercase tracking-[1px] text-text-muted">
          Дата активации устройства
        </label>
        <Input
          value={activationDate}
          onChange={(e) => setActivationDate(maskDate(e.target.value))}
          placeholder="ДД/ММ/ГГГГ"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          className="mt-2 h-11 rounded-md border-black/15 bg-white font-mono text-[13px] text-text placeholder:text-text-muted/60 focus-visible:border-olive focus-visible:ring-0"
          disabled={submitting}
        />
        <p className="mt-1 text-[9px] text-text-muted">
          Дата первого включения устройства
        </p>
      </div>

      <div>
        <label className="block text-[9px] uppercase tracking-[1px] text-text-muted">
          Чек или скриншот заказа
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <div className="mt-2 flex items-center justify-between rounded-lg border border-black/15 bg-white px-4 py-3">
            <span className="truncate text-[11px] text-text">{file.name}</span>
            <button
              type="button"
              onClick={removeFile}
              aria-label="Удалить файл"
              className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-text-muted hover:bg-black/[0.05]"
            >
              <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 flex h-16 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-black/15 bg-white text-[10px] text-text-muted transition-colors hover:border-black/30"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Загрузить (опционально)
          </button>
        )}
      </div>

      {error ? (
        <p className="text-center text-[11px] text-rose">{error}</p>
      ) : null}

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="h-12 w-full"
      >
        {submitting ? "Регистрируем…" : "Зарегистрировать"}
      </Button>
    </div>
  );
}
