"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type TimedRedirectProps = {
  to: string;
  delayMs?: number;
};

export function TimedRedirect({ to, delayMs = 2000 }: TimedRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const id = setTimeout(() => router.replace(to), delayMs);
    return () => clearTimeout(id);
  }, [router, to, delayMs]);

  return null;
}
