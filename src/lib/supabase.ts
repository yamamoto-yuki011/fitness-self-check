import { createClient } from "@supabase/supabase-js";
import type { Exercise } from "@/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseEnv() {
  return Boolean(url && (anonKey || serviceKey));
}

export function getSupabaseClient(admin = false) {
  const key = admin ? serviceKey : anonKey;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type ExerciseRow = Omit<Exercise, "id"> & { id: string };
