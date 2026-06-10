import { FadeIn } from "@/components/shared/fade-in";
import { TimedRedirect } from "@/components/shared/timed-redirect";

export default function SplashPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <TimedRedirect to="/welcome" delayMs={2000} />

      <FadeIn>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-text-muted">
          Ритуал
        </p>
        <h1 className="mt-5 text-5xl font-semibold tracking-[0.18em] text-olive-dark">
          TOQUE
        </h1>
        <p className="mt-5 text-base leading-relaxed text-text-muted">
          Спокойный ритуал ухода — каждый день видимое улучшение.
        </p>
      </FadeIn>

      <FadeIn delay={0.4}>
        <span
          className="mt-12 block h-1.5 w-1.5 animate-pulse rounded-pill bg-olive"
          aria-hidden
        />
      </FadeIn>
    </main>
  );
}
