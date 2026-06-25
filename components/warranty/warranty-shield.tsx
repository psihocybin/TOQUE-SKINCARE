import { cn } from "@/lib/utils";

type Props = {
  emphasized?: boolean;
  className?: string;
};

export function WarrantyShield({ emphasized = false, className }: Props) {
  return (
    <svg
      width={50}
      height={50}
      viewBox="0 0 50 50"
      fill="none"
      aria-hidden
      className={cn(className)}
    >
      <path
        d="M25 4 L43 11 V25 C43 36 35 43 25 46 C15 43 7 36 7 25 V11 Z"
        fill="rgba(122,138,79,0.15)"
        stroke="#7A8A4F"
        strokeWidth={emphasized ? 2 : 1.4}
        strokeLinejoin="round"
      />
      <path
        d="M18 25 L23 30 L33 19"
        stroke="#7A8A4F"
        strokeWidth={emphasized ? 2.6 : 2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
