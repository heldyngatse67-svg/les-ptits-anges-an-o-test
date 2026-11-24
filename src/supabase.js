import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigured = Boolean(url && anonKey);
export const supabase = supabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        storageKey: "ano-supabase-auth"
      }
    })
  : null;

export const SUPABASE_SETUP_MESSAGE =
  "Supabase n’est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env, puis redémarrez le serveur.";
