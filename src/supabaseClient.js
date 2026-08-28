/*
  ===========================================================================
  SUPABASE CLIENT

  This file was missing from the zip you sent, so it's been recreated to
  match what the project documentation describes (v2.0). If your live repo
  already has a working src/supabaseClient.js, keep that one — don't
  overwrite it with this.

  The two values come from Vercel's environment variables, never from code:
    VITE_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY
  ===========================================================================
*/

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Not a crash — the study side of the app still works offline. Only
  // booking, admin and cross-device progress need the database.
  console.warn(
    "Supabase env vars missing. Booking, admin and synced progress will be unavailable."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// True when the app has a real database to talk to. Used by the auth and
// progress layers to fall back to on-device storage when it doesn't.
export const HAS_SUPABASE = Boolean(supabaseUrl && supabaseAnonKey);

export default supabase;
