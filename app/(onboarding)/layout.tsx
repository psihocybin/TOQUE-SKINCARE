import { PhoneFrame } from "@/components/shared/phone-frame";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PhoneFrame>{children}</PhoneFrame>;
}
