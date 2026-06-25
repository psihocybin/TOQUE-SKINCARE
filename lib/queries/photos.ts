import { createClient } from "@/lib/supabase/server";
import type { Photo } from "@/lib/supabase/database.types";

export async function getPhotos(profileId: string): Promise<Photo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("profile_id", profileId)
    .order("day_number", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getBaselinePhoto(
  profileId: string,
): Promise<Photo | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("profile_id", profileId)
    .eq("day_number", 0)
    .order("taken_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createSignedPhotoUrl(
  storagePath: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("photos")
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}
