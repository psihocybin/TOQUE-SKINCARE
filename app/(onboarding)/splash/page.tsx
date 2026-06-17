"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/shared/fade-in";
import { TimedRedirect } from "@/components/shared/timed-redirect";

export default function SplashPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <TimedRedirect to="/welcome" delayMs={2000} />

      <FadeIn duration={0.4} y={0}>
        <h1 className="text-[32px] font-bold tracking-[8px] text-olive">
          TOQUE
        </h1>
        <p className="mt-1 text-[9px] uppercase tracking-[4px] text-text-muted">
          Ритуал
        </p>
      </FadeIn>

      <div className="absolute left-1/2 top-[85%] -translate-x-1/2">
        <div className="h-[2px] w-[100px] overflow-hidden rounded-pill bg-black/10">
          {mounted ? (
            <motion.div
              className="h-full rounded-pill bg-olive"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          ) : (
            <div className="h-full w-0 rounded-pill bg-olive" />
          )}
        </div>
      </div>
    </main>
  );
}
