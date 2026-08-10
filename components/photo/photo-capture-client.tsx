"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, RotateCcw, X } from "lucide-react";
import { capturePhoto } from "@/lib/actions/photos";

type Props = {
  dayNumber: number;
  isBaseline: boolean;
};

type CameraState = "loading" | "ready" | "denied" | "unavailable";
type SubmitState = "idle" | "uploading" | "error";

function isImageBlob(blob: Blob | null): blob is Blob {
  return blob !== null && blob.size > 0;
}

export function PhotoCaptureClient({ dayNumber, isBaseline }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "user",
  );
  const [preview, setPreview] = useState<{ blob: Blob; url: string } | null>(
    null,
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (preview) return; // не переоткрываем камеру, пока показываем превью

    let cancelled = false;
    setCameraState("loading");

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) setCameraState("unavailable");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        stopStream();
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraState("ready");
      } catch {
        if (!cancelled) setCameraState("denied");
      }
    }

    start();
    return () => {
      cancelled = true;
    };
  }, [facingMode, preview, stopStream]);

  useEffect(() => stopStream, [stopStream]);

  function handleShutter() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || cameraState !== "ready") return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!isImageBlob(blob)) return;
        stopStream();
        setPreview({ blob, url: URL.createObjectURL(blob) });
      },
      "image/jpeg",
      0.9,
    );
  }

  function handleGalleryPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    stopStream();
    setPreview({ blob: file, url: URL.createObjectURL(file) });
  }

  function retake() {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function confirm() {
    if (!preview) return;
    setSubmitState("uploading");
    setError(null);

    const data = new FormData();
    data.append(
      "photo",
      new File([preview.blob], "photo.jpg", { type: "image/jpeg" }),
    );
    data.append("dayNumber", String(dayNumber));

    const res = await capturePhoto(data);
    if (res && !res.ok) {
      setSubmitState("error");
      setError(res.error);
      return;
    }
    // При успехе server action выполнит redirect — сюда не дойдём.
  }

  const title = isBaseline
    ? "Baseline-фото"
    : `Фото прогресса · день ${dayNumber}`;
  const subtitle = isBaseline
    ? "для прогресса · один раз"
    : "для сравнения с baseline";

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#1A1A18] text-cream">
      <div className="relative flex w-full max-w-app flex-col">
        <header className="flex items-center justify-between gap-3 px-5 pt-[max(env(safe-area-inset-top),1rem)]">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Закрыть"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-pill text-cream/90 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" strokeWidth={1.6} aria-hidden />
          </button>
          <div className="text-center">
            <p className="text-[11px] text-cream/90">{title}</p>
            <p className="text-[9px] text-cream/55">{subtitle}</p>
          </div>
          <div className="h-10 w-10" aria-hidden />
        </header>

        <p className="mt-1 px-5 text-center text-[10px] text-cream/55">
          Без макияжа · дневной свет · фронтально
        </p>

        <div className="relative mt-4 flex-1 overflow-hidden">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.url}
              alt="Предпросмотр фото"
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ transform: facingMode === "user" ? "scaleX(-1)" : undefined }}
            />
          )}

          {!preview && cameraState === "ready" ? (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <div className="h-[62%] w-[72%] rounded-[50%] border-2 border-dashed border-cream/50" />
            </div>
          ) : null}

          {!preview && cameraState === "loading" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[11px] text-cream/60">Открываем камеру…</p>
            </div>
          ) : null}

          {!preview &&
          (cameraState === "denied" || cameraState === "unavailable") ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
              <p className="text-[12px] text-cream/85">
                {cameraState === "denied"
                  ? "Нет доступа к камере. Разрешите доступ в настройках браузера или выберите фото из галереи."
                  : "Камера недоступна на этом устройстве. Выберите фото из галереи."}
              </p>
            </div>
          ) : null}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleGalleryPick}
          className="hidden"
        />

        {error ? (
          <p className="px-5 pt-3 text-center text-[11px] text-rose">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-center gap-10 px-5 pb-[max(env(safe-area-inset-bottom),24px)] pt-6">
          {preview ? (
            <>
              <button
                type="button"
                onClick={retake}
                disabled={submitState === "uploading"}
                className="flex h-12 w-12 items-center justify-center rounded-pill border border-white/45 text-cream/90 transition-colors hover:bg-white/10 disabled:opacity-50"
                aria-label="Переснять"
              >
                <RotateCcw className="h-5 w-5" strokeWidth={1.6} aria-hidden />
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={submitState === "uploading"}
                className="flex h-16 w-16 items-center justify-center rounded-pill bg-cream text-[#1A1A18] transition-transform active:scale-[0.97] disabled:opacity-60"
              >
                <span className="text-[10px] uppercase tracking-[1px]">
                  {submitState === "uploading" ? "…" : "Сохранить"}
                </span>
              </button>
              <div className="h-12 w-12" aria-hidden />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Выбрать фото из галереи"
                className="flex h-12 w-12 items-center justify-center rounded-pill border border-white/45 text-cream/90 transition-colors hover:bg-white/10"
              >
                <ImageIcon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
              </button>
              <button
                type="button"
                onClick={handleShutter}
                disabled={cameraState !== "ready"}
                aria-label="Сделать фото"
                className="flex h-16 w-16 items-center justify-center rounded-pill border-[3px] border-cream disabled:opacity-40"
              >
                <span className="h-12 w-12 rounded-pill bg-cream" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setFacingMode((m) => (m === "user" ? "environment" : "user"))
                }
                disabled={cameraState !== "ready"}
                aria-label="Переключить камеру"
                className="flex h-12 w-12 items-center justify-center rounded-pill border border-white/45 text-cream/90 transition-colors hover:bg-white/10 disabled:opacity-40"
              >
                <RotateCcw className="h-5 w-5" strokeWidth={1.6} aria-hidden />
              </button>
            </>
          )}
        </div>

        {!preview ? (
          <button
            type="button"
            onClick={() => router.push("/progress")}
            className="pb-[max(env(safe-area-inset-bottom),16px)] text-center text-[11px] text-cream/60 underline underline-offset-4"
          >
            Пропустить — сделаю позже
          </button>
        ) : null}
      </div>
    </div>
  );
}
