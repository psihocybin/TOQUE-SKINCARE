import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewRequestScreen } from "@/components/reviews/review-request-screen";

export default async function ReviewRequestPage() {
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

  return <ReviewRequestScreen greetingName={profile?.name ?? ""} />;
}
