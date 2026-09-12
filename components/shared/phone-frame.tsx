import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto min-h-screen w-full max-w-app overflow-hidden bg-cream pb-20",
        "sm:my-6 sm:min-h-[calc(100vh-3rem)] sm:rounded-[2rem] sm:shadow-lg sm:ring-1 sm:ring-black/5",
        className,
      )}
    >
      {/* Приглушённое фото листа — базовая заставка приложения, видна на
          всех экранах (через PhoneFrame их оборачивают все layout'ы: auth,
          onboarding, main, modals). Только верхние 620px, дальше сплошной
          cream, чтобы не растягивать/повторять картинку на длинных
          страницах. Три отдельных слоя вместо одного составного
          background-image: смешивание gradient+url в одном свойстве с общим
          background-size давало артефакты (чёрная область на стыке слоёв). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-cover bg-top"
        style={{ backgroundImage: "url(/backgrounds/home-leaf.jpg)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(250,250,247,0.4) 0%, rgba(250,250,247,0.6) 35%, rgba(250,250,247,0.85) 65%, rgba(250,250,247,0.97) 88%, #FAFAF7 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[620px] bottom-0 bg-cream"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
