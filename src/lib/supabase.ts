import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.SUPABASE_URL ?? process.env.Supabase_URL ?? "";
// Strip trailing /rest/v1/ if user pasted the REST endpoint instead of the base URL
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "");

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
