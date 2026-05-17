import { createClient } from "@supabase/supabase-js";

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client if both values are present and non-placeholder.
// This prevents a hard crash on startup when the .env isn't configured yet.
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseAnonKey !== "PASTE_YOUR_ANON_KEY_HERE";

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper used by AuthCallback — throws a clear message if Supabase isn't set up
export const getSupabase = () => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Frontend/.env"
    );
  }
  return supabase;
};
