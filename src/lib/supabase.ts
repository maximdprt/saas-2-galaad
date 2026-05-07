import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.SUPABASE_URL ?? process.env.Supabase_URL ?? "";
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "");
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}
