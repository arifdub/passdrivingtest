import { createClient } from "@supabase/supabase-js";

// These come from environment variables, NOT hardcoded here.
// Locally: set them in a .env.local file (see .env.local.example).
// On Vercel: set them in Project Settings -> Environment Variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Don't crash the whole site if these are missing during setup —
  // just warn clearly in the browser console so it's easy to diagnose.
  console.warn(
    "Supabase isn't configured yet: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
    "are missing. Booking and the admin page won't work until these are set."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");
