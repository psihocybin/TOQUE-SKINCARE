"use client";

import { useState } from "react";
import { Play } from "lucide-react";

type Props = { tutorialId: string };

// Видео лежат в public/videos/<id урока>.mp4 (обложка — <id>.jpg, опционально).
// Пока файла нет, <video> падает в onError и остаётся прежняя заглушка —
// поэтому новый ролик подключается простым добавлением файла, без правки кода.
export function TutorialVideo({ tutorialId }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="mx-4 mt-4 flex aspect-video min-w-0 items-center justify-center overflow-hidden rounded-xl bg-black">
      {failed ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
          <Play className="h-6 w-6 translate-x-[1px] text-white" fill="currentColor" strokeWidth={0} />
        </span>
      ) : (
        <video
          src={`/videos/${tutorialId}.mp4`}
          poster={`/videos/${tutorialId}.jpg`}
          controls
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}
