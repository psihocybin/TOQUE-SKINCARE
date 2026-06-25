import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NpsForm } from "@/components/surveys/nps-form";

export default async function NpsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="flex min-h-screen flex-col pt-10">
      <NpsForm greetingName={profile?.name ?? ""} />
    </main>
  );
}
