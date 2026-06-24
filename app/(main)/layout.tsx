import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { BottomNav } from "@/components/shared/bottom-nav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.name.trim()) {
    redirect("/quiz/device");
  }

  return (
    <PhoneFrame>
      {children}
      <BottomNav />
    </PhoneFrame>
  );
}
