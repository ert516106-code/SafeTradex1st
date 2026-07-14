import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://xzvxkclvsgbairgmrgzj.supabase.co";

const supabaseAnonKey =
  "sb_publishable_pVQNW1xXGgp3Nd8MhKK4zw_6Q9lAE2M";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);