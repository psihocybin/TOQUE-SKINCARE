import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto min-h-screen w-full max-w-app bg-cream pb-20",
        "sm:my-6 sm:min-h-[calc(100vh-3rem)] sm:rounded-[2rem] sm:shadow-lg sm:ring-1 sm:ring-black/5",
        className,
      )}
    >
      {children}
    </div>
  );
}
